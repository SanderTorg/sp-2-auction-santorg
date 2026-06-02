import ListingCard from "../components/listing-card/ListingCard";
import SkeletonCard from "../components/listing-card/SkeletonCard";
import { getAllListings } from "../services/listingsApi";
import { createHTML } from "../utils/utils";
import heroImage from "../images/image/hero-img.png";
import { animateStaggerIn, animateFadeIn } from "../utils/animations";

export default async function HomePage() {
  const template = homePageTemplate();
  const html = createHTML(template);

  getAllListings().then((allListings) => {
    renderListings(allListings);
    setupHomeSearch();
  });

  setTimeout(() => {
    animateFadeIn("#home-page .absolute", 0.2);
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
    <section id="home-page" class="flex flex-col items-center gap-8 mx-auto max-w-6xl w-full px-4">
    
      <section class="w-full flex flex-col items-center justify-center gap-3 relative bg-black rounded-2xl overflow-hidden">
        <img src="${heroImage}" alt="Auction Illustration" class="w-full min-h-[50dvh] max-h-[70dvh] opacity-45  overflow-hidden object-cover" />
        <div class="absolute flex flex-col items-center gap-3 text-white px-3">
          <h1 class="text-3xl text-center font-bold">Welcome to the auction house</h1>
          <p class="text-center font-semibold text-2xl">
            Discover amazing items up for auction. Browse, bid, and win!
          </p>
          <button
            onclick="window.location.href='/listings'"
            class="bg-black text-white px-6 cursor-pointer py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
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
            class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-semibold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </section>

      <section class="w-full flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <h2 class="flex text-2xl font-bold capitalize">featured listings</h2>
          <a href="/listings" class="flex font-semibold text-red-600 hover:text-red-800 underline!">View All</a>  
        </div>
        <div id="js-featured-listings" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          ${Array(3).fill(SkeletonCard()).join("")}
        </div>
      </section>
      
      <section class="w-full flex flex-col gap-6 pt-5">
        <div class="flex justify-between items-center">
          <h2 class="flex text-2xl font-bold capitalize">all listings</h2>
          <a href="/listings" class="flex font-semibold text-red-600 hover:text-red-800 underline!">View All</a>  
        </div>
        <div id="js-all-listings" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          ${Array(6).fill(SkeletonCard()).join("")}
        </div>
      </section>   
      
      <section class="flex w-full flex-col gap-6 bg-linear-to-r from-black to-gray-800 text-white rounded-2xl p-8 sm:p-12 items-center shadow-xl">
        <div class="flex flex-col gap-2 max-w-2xl text-center">
          <h2 class="text-3xl font-bold capitalize">
            Join Our Newsletter
          </h2>
          <p class="text-gray-300 text-lg">
            Get weekly updates, tips, and exclusive offers delivered straight to your inbox every Friday.
          </p>
        </div>
        
        <div class="w-full flex justify-center">
          <form class="flex flex-col sm:flex-row items-center w-full max-w-lg gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              class="w-full bg-white text-gray-900 border-none rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
            />
            
            <button
              type="submit"
              class="w-full sm:w-auto bg-red-600 text-white px-8 py-3.5 rounded-lg hover:bg-red-700 font-bold transition-all cursor-pointer whitespace-nowrap shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Subscribe
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

  const activeListings = listings.filter(
    (listing) => new Date(listing.endsAt).getTime() > new Date().getTime(),
  );

  const featuredListings = popularListings(activeListings);
  const allListings = latestListings(activeListings);

  if (featuredListingsEl) {
    featuredListingsEl.innerHTML = featuredListings
      .map((listing) => ListingCard(listing))
      .join("");
    animateStaggerIn("#js-featured-listings");
  }
  if (allListingsEl) {
    allListingsEl.innerHTML = allListings
      .map((listing) => ListingCard(listing))
      .join("");
    animateStaggerIn("#js-all-listings");
  }
}

function latestListings(listings: any[]) {
  return listings
    .sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    )
    .slice(0, 6);
}

function popularListings(listings: any[]) {
  return listings
    .sort((a, b) => (b._count?.bids || 0) - (a._count?.bids || 0))
    .slice(0, 6);
}
