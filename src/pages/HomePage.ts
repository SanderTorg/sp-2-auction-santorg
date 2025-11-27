import ListingCard from "../components/listing-card/ListingCard";
import { getAllListings } from "../services/listingsApi";
import { createHTML } from "../utils/utils";

export default async function HomePage() {
  const allListings = await getAllListings();

  const template = homePageTemplate();
  const html = createHTML(template);

  setTimeout(() => {
    renderListings(allListings);
  }, 0);

  return html;
}

function homePageTemplate() {
  return `
    <section id="home-page" class="flex flex-col items-center gap-3 mx-auto max-w-3xl w-full py-2.5">
      <h1 class="text-2xl font-bold">Welcome to the auction house</h1>

      <div class="flex flex-col sm:flex-row gap-3 w-full justify-center items-center mt-4">
        <div class="flex flex-col">
          <select class="border rounded-xl p-3">
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="toys">Toys</option>
            <option value="sports">Sports</option>
            <option value="vehicles">Vehicles</option>
          </select>
        </div>
        <div class="flex flex-col w-full max-w-md">
          <input type="text" id="js-search" name="search" placeholder="Search..." class="flex border pl-2 py-3 rounded-xl" />
        </div>
      </div>


      <section class="w-full flex flex-col gap-6 mt-6">
        <h2 class="flex font-bold">Featured Listings</h2>
        <div id="js-featured-listings" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">Loading featured listings...</div>
      </section>
      
      <section class="w-full flex flex-col gap-6 mt-6">
        <h2 class="flex font-bold">All Listings</h2>  
        <div id="js-all-listings" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">Loading all listings...</div>
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
  return listings.sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );
}

function popularListings(listings: any[]) {
  return listings
    .sort((a, b) => (b._count?.bids || 0) - (a._count?.bids || 0))
    .slice(0, 6);
}
