import SingleListingPage from "../pages/SingleListingPage";
import CreateListingsPage from "../pages/CreateListingsPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";

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
  createListing: {
    url: "/create-listing",
    component: CreateListingsPage,
  },
  profile: {
    url: "/profile",
    component: ProfilePage,
  },
  singleListing: {
    url: "/listing/:id",
    component: SingleListingPage,
  },
} as const;

function toRegexPath(path: string) {
  const regexPath = path.replace(/:\w+/g, "([\\w-]+)");
  return new RegExp(`^${regexPath}$`);
}

export default async function router(
  currentPath = "",
  paths = ROUTES
): Promise<string | ChildNode | null> {
  const currentRoute = Object.values(paths).find((route) =>
    toRegexPath(route.url).test(currentPath)
  );

  if (!currentRoute) {
    return await NotFoundPage();
  }

  return await currentRoute.component();
}
