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
    <section id="home-page" class="flex flex-col items-center gap-5 mx-auto max-w-3xl w-full">
      <h1 class="text-3xl font-bold">Welcome to the auction house</h1>

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
