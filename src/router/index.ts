import SingleListingPage from "../pages/SingleListingPage";
import CreateListingsPage from "../pages/CreateListingsPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import NotLoggedInPage from "../pages/NotLoggedInPage";
import { getUsernameStorage } from "../utils/storage";
import { EditProfilePage } from "../pages/EditProfilePage";
import ListingsPage from "../pages/ListingsPage";

const ROUTES = {
  home: {
    url: "/",
    component: HomePage,
  },
  login: {
    url: "/login",
    component: LoginPage,
  },
  register: {
    url: "/register",
    component: RegisterPage,
  },
  profile: {
    url: "/profile",
    component: ProfilePage,
  },
  editProfile: {
    url: "/edit-profile",
    component: EditProfilePage,
  },
  allListings: {
    url: "/listings",
    component: ListingsPage,
  },
  singleListing: {
    url: "/listing/:id",
    component: SingleListingPage,
  },
  createListing: {
    url: "/create-listing",
    component: CreateListingsPage,
  },
} as const;

function toRegexPath(path: string) {
  const regexPath = path.replace(/:\w+/g, "([\\w-]+)");
  return new RegExp(`^${regexPath}$`);
}

export default async function router(
  currentPath = "",
  paths = ROUTES
): Promise<string | ChildNode | DocumentFragment | null> {
  const currentRoute = Object.values(paths).find((route) =>
    toRegexPath(route.url).test(currentPath)
  );

  const user = getUsernameStorage();

  const protectedRoutes = [
    ROUTES.createListing.url,
    ROUTES.profile.url,
    ROUTES.editProfile.url,
  ];
  const isProtectedRoute = currentRoute
    ? protectedRoutes.includes(currentRoute.url as any)
    : false;

  if (isProtectedRoute && !user) {
    return await NotLoggedInPage();
  }

  if (!currentRoute) {
    return await NotFoundPage();
  }

  return await currentRoute.component();
}
