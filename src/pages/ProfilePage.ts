import { AuthGuardTemplate } from "../components/auth/AuthGuard";
import { get } from "../services/api";
import { requireAuth } from "../utils/authGuard";
import { getUser } from "../utils/storage";
import { createHTML } from "../utils/utils";
import { showError } from "./LoginPage";

export default async function ProfilePage() {
  if (!requireAuth()) {
    return createHTML(AuthGuardTemplate());
  }

  let profileData: any = null;

  try {
    const userName = getUser();
    const endpoint = `/auction/profiles/${userName}`;

    if (userName) {
      const data = await get(endpoint);
      profileData = data.data;

      if (profileData?.credits !== undefined) {
        localStorage.setItem("userCredits", profileData.credits.toString());
      }
    }
  } catch (error) {
    showError("Failed to load user data.");
  }
  const template = profilePageTemplate(profileData);
  return createHTML(template);
}

type UserData = {
  name: string;
  email: string;
  bio: string;
  avatar: {
    url: string;
    alt: string;
  };
  banner: {
    url: string;
    alt: string;
  };
  credits: number;
  _count: {
    listings: number;
    wins: number;
  };
};

const defaultProfileData: UserData = {
  name: "User",
  email: "user@example.com",
  bio: "No bio available",
  avatar: {
    url: "https://via.placeholder.com/150",
    alt: "Default Avatar",
  },
  banner: {
    url: "https://via.placeholder.com/800x200",
    alt: "Default Banner",
  },
  credits: 0,
  _count: {
    listings: 0,
    wins: 0,
  },
};

function profilePageTemplate(data: UserData) {
  const profile = data || defaultProfileData;
  const loggedInToken = getUser();
  const isOwnProfile = loggedInToken === profile.name;

  return `
    <section class="flex flex-col items-center gap-3  mx-auto max-w-5xl w-full  rounded-2xl border"> 
      <img src="${profile.banner.url}" alt="${
    profile.banner.alt
  }" class="w-full h-48 object-cover rounded-t-2xl" />
      <div class="flex flex-col gap-3 p-4 w-full">
        <div class="flex items-center gap-4">
          <img src="${profile.avatar.url}" alt="${
    profile.avatar.alt
  }" class="w-15 h-15 rounded-full object-cover" />
          <div class="flex flex-col">
            <h2>${profile.name}</h2>
            <div class="flex gap-1">
            ${
              isOwnProfile
                ? `<p class="font-semibold">Credits: <span class="text-green-500">${profile.credits}</span></p>`
                : ""
            }
              <p class="font-semibold">Listings: ${profile._count.listings}</p>
              <p class="font-semibold">Wins: ${profile._count.wins}</p>
            </div>
          </div>
        </div>
        <div class="w-full gap-3 flex flex-col items-start">
          <h2>${profile.bio}</h2>
          
        </div>
        <div class="w-full flex justify-end">
          ${
            isOwnProfile
              ? `<button class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">Edit Profile</button>`
              : ""
          }
        </div>
      </div>
    </section>
    `;
}
