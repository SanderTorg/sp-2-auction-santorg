import { AuthGuardTemplate } from "../components/auth/AuthGuard";
import ListingCard from "../components/listing-card/ListingCard";
import { fetchUserProfile, type ProfileData } from "../services/userApi";
import { requireAuth } from "../utils/authGuard";
import { getUsernameStorage, isOwnProfile } from "../utils/storage";
import { createHTML } from "../utils/utils";
import { get } from "../services/api";

let currentView: "listings" | "bids" | "wins" = "listings";

export default async function ProfilePage() {
  if (!requireAuth()) {
    return createHTML(AuthGuardTemplate());
  }

  const username = getUsernameStorage();
  const profileData = await fetchUserProfile(username);

  const template = profilePageTemplate(profileData);
  const html = createHTML(template);

  setTimeout(() => {
    const contentArea = document.getElementById("js-content-area");
    if (contentArea) {
      setupProfilePage(username);
    } else {
      setTimeout(() => setupProfilePage(username), 100);
    }
  }, 10);

  return html;
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
          <div class="w-full flex flex-wrap items-center">
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
          </div>
        </div>
        <div class="w-full gap-3 flex flex-col items-start">
          <h2>${profile.bio}</h2>
        </div>
      </div>

      ${
        ownProfile
          ? `
            <div class="flex gap-4 w-full flex-wrap justify-center border-t p-4">
              <button id="js-my-listings-button" class="p-2 font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">My Listings</button>
              <button id="js-my-bids-button" class="p-2 font-semibold bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer">My Bids</button>
              <button id="js-my-wins-button" class="p-2 font-semibold bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer">My Wins</button>
              <a href="/edit-profile">
                <button id="js-edit-profile-button" class="p-2 font-semibold bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                  Edit Profile
                </button>
              </a>
              <a href="/create-listing">
                <button id="js-create-listing-button" class="p-2 font-semibold bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                  Create Listing
                </button>
              </a>
            </div>
              `
          : ""
      }
    </section>

    <section class="w-full flex flex-col gap-6 mt-6 mx-auto max-w-5xl">
      <h2 id="js-section-title" class="text-2xl font-bold">My Listings</h2>  
      <div id="js-content-area" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        Loading...
      </div>
    </section>
    `;
}

async function fetchUserListings(username: string) {
  try {
    const response = await get(`/auction/profiles/${username}/listings`);
    console.log("User listings response:", response);
    return response?.data || [];
  } catch (error) {
    console.error("Failed to load user listings:", error);
    return [];
  }
}

async function fetchUserBids(username: string) {
  try {
    const response = await get(
      `/auction/profiles/${username}/bids?_listings=true`
    );
    return response?.data || [];
  } catch (error) {
    console.error("Failed to load user bids:", error);
    return [];
  }
}

async function fetchUserWins(username: string) {
  try {
    const response = await get(`/auction/profiles/${username}/wins`);
    return response?.data || [];
  } catch (error) {
    console.error("Failed to load user wins:", error);
    return [];
  }
}

function renderContent(items: any[], emptyMessage: string) {
  console.log("renderContent called with items:", items);
  console.log("items.length:", items.length);

  const contentArea = document.getElementById("js-content-area");
  console.log("contentArea element:", contentArea);

  if (!contentArea) return;

  if (items.length === 0) {
    contentArea.innerHTML = `
      <div class="col-span-full text-center py-10 text-gray-500">
        <p class="text-xl">${emptyMessage}</p>
      </div>
    `;
    return;
  }

  const itemsHTML = items.map((item) => ListingCard(item)).join("");
  console.log("Generated HTML length:", itemsHTML.length);
  console.log("First 200 chars:", itemsHTML.substring(0, 200));
  contentArea.innerHTML = itemsHTML;
  console.log("Content area innerHTML updated");
}

async function showMyListings(username: string) {
  currentView = "listings";

  const titleEl = document.getElementById("js-section-title");
  const contentArea = document.getElementById("js-content-area");
  const listingsBtn = document.getElementById("js-my-listings-button");
  const bidsBtn = document.getElementById("js-my-bids-button");
  const winsBtn = document.getElementById("js-my-wins-button");

  if (titleEl) titleEl.textContent = "My Listings";
  if (contentArea) contentArea.innerHTML = "Loading...";

  if (listingsBtn) {
    listingsBtn.className =
      "p-2 font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer";
  }
  if (bidsBtn) {
    bidsBtn.className =
      "p-2 font-semibold bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer";
  }
  if (winsBtn) {
    winsBtn.className =
      "p-2 font-semibold bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer";
  }

  const listings = await fetchUserListings(username);
  renderContent(listings, "You haven't created any listings yet.");
}

async function showMyBids(username: string) {
  currentView = "bids";

  const titleEl = document.getElementById("js-section-title");
  const contentArea = document.getElementById("js-content-area");
  const listingsBtn = document.getElementById("js-my-listings-button");
  const bidsBtn = document.getElementById("js-my-bids-button");
  const winsBtn = document.getElementById("js-my-wins-button");

  if (titleEl) titleEl.textContent = "My Bids";
  if (contentArea) contentArea.innerHTML = "Loading...";

  if (listingsBtn) {
    listingsBtn.className =
      "p-2 font-semibold bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer";
  }
  if (bidsBtn) {
    bidsBtn.className =
      "p-2 font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer";
  }
  if (winsBtn) {
    winsBtn.className =
      "p-2 font-semibold bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer";
  }

  const bids = await fetchUserBids(username);
  renderContent(bids, "You haven't placed any bids yet.");
}

async function showMyWins(username: string) {
  currentView = "wins";

  const titleEl = document.getElementById("js-section-title");
  const contentArea = document.getElementById("js-content-area");
  const listingsBtn = document.getElementById("js-my-listings-button");
  const bidsBtn = document.getElementById("js-my-bids-button");
  const winsBtn = document.getElementById("js-my-wins-button");

  if (titleEl) titleEl.textContent = "My Wins";
  if (contentArea) contentArea.innerHTML = "Loading...";

  if (listingsBtn) {
    listingsBtn.className =
      "p-2 font-semibold bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer";
  }
  if (bidsBtn) {
    bidsBtn.className =
      "p-2 font-semibold bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer";
  }
  if (winsBtn) {
    winsBtn.className =
      "p-2 font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer";
  }

  const wins = await fetchUserWins(username);
  renderContent(wins, "You haven't won any auctions yet.");
}

function setupProfilePage(username: string) {
  const listingsBtn = document.getElementById("js-my-listings-button");
  const bidsBtn = document.getElementById("js-my-bids-button");
  const winsBtn = document.getElementById("js-my-wins-button");

  if (listingsBtn) {
    listingsBtn.addEventListener("click", () => showMyListings(username));
  }

  if (bidsBtn) {
    bidsBtn.addEventListener("click", () => showMyBids(username));
  }

  if (winsBtn) {
    winsBtn.addEventListener("click", () => showMyWins(username));
  }

  showMyListings(username);
}
