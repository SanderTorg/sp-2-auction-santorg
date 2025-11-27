import { AuthGuardTemplate } from "../components/auth/AuthGuard";
import ListingCard from "../components/listing-card/ListingCard";
import { fetchUserProfile, type ProfileData } from "../services/userApi";
import { requireAuth } from "../utils/authGuard";
import { getUsernameStorage, isOwnProfile } from "../utils/storage";
import { createHTML } from "../utils/utils";

export default async function ProfilePage() {
  if (!requireAuth()) {
    return createHTML(AuthGuardTemplate());
  }

  const username = getUsernameStorage();
  const profileData = await fetchUserProfile(username);

  const myListingsSection = myListingsTemplate();
  const template = profilePageTemplate(profileData) + myListingsSection;

  return createHTML(template);
}

const defaultProfileData: ProfileData = {
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

function profilePageTemplate(data: ProfileData | null) {
  const profile = data || defaultProfileData;
  const ownProfile = isOwnProfile(profile.name);

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
          <div class="w-full flex flex-wrap gap-2 justify-between items-center">
            <div class="flex flex-col">
              <h3 class="flex text-xl font-bold">${profile.name}</h3>
              <div class="flex gap-1 flex-wrap">
              ${
                ownProfile
                  ? `<p class=" flex font-semibold gap-1">Credits: <span class="flex text-green-500">
                  ${profile.credits}$</span></p>`
                  : ""
              }
                <p class="flex font-semibold">Listings: ${
                  profile._count.listings
                }</p>
                <p class="flex font-semibold">Wins: ${profile._count.wins}</p>
              </div>
            </div>
          
            <div class="flex justify-end">
            ${
              ownProfile
                ? `
              <a href="/edit-profile">
              <button id="js-edit-profile-button" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                Edit Profile
              </button></a>`
                : ""
            }
            </div>
          </div>
        </div>
        <div class="w-full gap-3 flex flex-col items-start">
          <h2>${profile.bio}</h2>
        </div>
      </div>

      <div class="flex gap-4 w-full justify-center border-t p-4">
        <button id="js-my-listings-button" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">My Listings</button>
        <button id="js-my-bids-button" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">My Bids</button>
      </div>
    </section>
    `;
}

function myListingsTemplate() {
  return `
    <section class="w-full flex flex-col gap-6 mt-6">
      <h2 class="flex font-bold">My Listings</h2>  
      <div id="js-my-listings" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">Loading your listings...</div>
    </section>
  `;
}

function renderMyListings(listings: any[]) {
  const myListingsEl = document.getElementById("js-my-listings");

  if (myListingsEl) {
    myListingsEl.innerHTML = listings
      .map((listing) => ListingCard(listing))
      .join("");
  }
}

function mybidListingsTemplate() {
  return `
    <section class="w-full flex flex-col gap-6 mt-6">
      <h2 class="flex font-bold">My Bids</h2>  
      <div id="js-my-bids" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">Loading your bids...</div>
    </section>
  `;
}

function renderMyBids(listings: any[]) {
  const myBidsEl = document.getElementById("js-my-bids");
  if (myBidsEl) {
    myBidsEl.innerHTML = listings
      .map((listing) => ListingCard(listing))
      .join("");
  }
}
