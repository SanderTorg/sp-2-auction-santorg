import ListingCard from "../components/listing-card/ListingCard";
import { getAllListings } from "../services/listingsApi";
import { createHTML } from "../utils/utils";
import heroImage from "../images/image/Image-1.webp";

export default async function HomePage() {
  const allListings = await getAllListings();

  const template = homePageTemplate();
  const html = createHTML(template);

  setTimeout(() => {
    renderListings(allListings);
    setupHomeSearch();
  }, 0);

  return html;
}

function setupHomeSearch() {
  const form = document.getElementById("js-home-search-form");
  const input = document.getElementById("js-home-search") as HTMLInputElement;

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (query) {
        window.location.href = `/listings?search=${encodeURIComponent(query)}`;
      }
    });
  }
}

function homePageTemplate() {
  return `
    <section id="home-page" class="flex flex-col items-center gap-5 mx-auto max-w-4xl w-full">
    
    <section class="w-full flex flex-col items-center justify-center gap-3 max-h-1/6 overflow-clip relative bg-black ">
      <img src="${heroImage}" alt="Auction Illustration" class="w-full opacity-40 object-cover" />
      <div class="absolute flex flex-col items-center gap-3 text-white px-3">
        <h1 class="text-3xl text-center font-bold">Welcome to the auction house</h1>
        <p class="text-center">
          Discover amazing items up for auction. Browse, bid, and win!
        </p>
        <button 
          onclick="window.location.href='/listings'"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Explore Listings
        </button>
      </div>
      </section>

      <section class="w-full max-w-md">
        <form id="js-home-search-form" class="flex gap-2">
          <input 
            type="text" 
            id="js-home-search" 
            placeholder="Search for items..." 
            class="flex w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            class="bg-blue-600 text-white px-3 py-2
             rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            Search
          </button>
        </form>
      </section>

      <section class="w-full flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <h2 class="flex text-2xl font-bold capitalize">featured listings</h2>
          <a href="/listings" class="flex font-semibold hover:underline">View All</a>  
        </div>
        <div id="js-featured-listings" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">Loading featured listings...</div>
      </section>
      
      <section class="w-full flex flex-col gap-6 pt-5">
        <div class="flex justify-between items-center">
          <h2 class="flex text-2xl font-bold capitalize">all listings</h2>
          <a href="/listings" class="flex font-semibold hover:underline">View All</a>  
        </div>
        <div id="js-all-listings" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">Loading all listings...</div>
      </section>   
      
      <section class="flex w-full flex-col gap-3">
        <h2 class="text-2xl font-bold capitalize text-center">
          join our newsletter
        </h2>
        <p class="flex font-semibold text-center justify-center">Get weekly updates and tips straight to your inbox.</p>
        <p class="flex font-semibold text-center justify-center">
          Subscribe for a curated selection of articles, news and exclusive
          offers delivered every friday
        </p>
        <div class="flex justify-center">
          <form class="flex flex-col items-center w-full max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              class="flex border p-3 rounded-lg w-full max-w-md"
            />
            
            <button
              type="submit"
              class="bg-black capitalize justify-center flex text-white px-6 cursor-pointer py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Subscribe now
            </button>
          </form>
        </div>
      </section>
    </section>
  `;
}

function renderListings(listings: any[]) {
  const featuredListingsEl = document.getElementById("js-featured-listings");
  const allListingsEl = document.getElementById("js-all-listings");

  const featuredListings = popularListings(listings);
  const allListings = latestListings(listings);

  if (featuredListingsEl) {
    featuredListingsEl.innerHTML = featuredListings
      .map((listing) => ListingCard(listing))
      .join("");
  }
  if (allListingsEl) {
    allListingsEl.innerHTML = allListings
      .map((listing) => ListingCard(listing))
      .join("");
  }
}

function latestListings(listings: any[]) {
  return listings
    .sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    )
    .slice(0, 6);
}

function popularListings(listings: any[]) {
  return listings
    .sort((a, b) => (b._count?.bids || 0) - (a._count?.bids || 0))
    .slice(0, 6);
}
