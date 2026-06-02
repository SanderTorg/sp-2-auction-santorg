import ListingCard from "../components/listing-card/ListingCard";
import SkeletonCard from "../components/listing-card/SkeletonCard";
import { createHTML } from "../utils/utils";
import { getAllListings } from "../services/listingsApi";
import { animateStaggerIn } from "../utils/animations";

let allListings: any[] = [];
let filteredListings: any[] = [];
let currentPage = 1;
const LISTINGS_PER_PAGE = 12;

export default async function ListingsPage() {
  const template = mainTemplate();
  const html = createHTML(template);

  getAllListings().then((data) => {
    allListings = data;
    filteredListings = [...allListings];

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search");

    if (searchQuery) {
      const searchInput = document.getElementById(
        "js-search",
      ) as HTMLInputElement;
      if (searchInput) {
        searchInput.value = searchQuery;
        filteredListings = filterBySearch(filteredListings, searchQuery);
      }
    }

    renderListings(filteredListings);
    setupFiltersAndSearch();
    updatePagination();
  });

  return html;
}

function mainTemplate() {
  return `
    <section class="flex flex-col items-center gap-8 mx-auto max-w-6xl w-full px-4">
      <section class="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
        <div class="flex flex-col sm:flex-row w-full lg:flex-2/4 gap-3">
          <select id="js-tag-filter" class="w-full sm:w-full lg:w-full border border-gray-300 rounded-lg p-3 cursor-pointer font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option class="font-semibold" value="all">All Tags</option>
            <option class="font-semibold" value="electronics">Electronics</option>
            <option class="font-semibold" value="fashion">Fashion</option>
            <option class="font-semibold" value="home">Home</option>
            <option class="font-semibold" value="car">Car</option>
            <option class="font-semibold" value="sport">Sport</option>
            <option class="font-semibold" value="books">Books</option>
          </select>

          <select id="js-sort-select" class="w-full sm:w-full lg:w-full border border-gray-300 rounded-lg p-3 cursor-pointer font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option class="font-semibold" value="latest">Latest to Oldest</option>
            <option class="font-semibold" value="oldest">Oldest to Latest</option>
            <option class="font-semibold" value="a-z">A-Z</option>
            <option class="font-semibold" value="z-a">Z-A</option>
            <option class="font-semibold" value="Bid-low">Bid: Low to High</option>
            <option class="font-semibold" value="Bid-high">Bid: High to Low</option>
          </select>
        </div>

        <div class="flex w-full">
          <input type="text" id="js-search" name="search" placeholder="Search by title..." class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </section>

      <section class="w-full flex flex-col gap-6 pt-5">
        <div id="js-all-listings" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          ${Array(12).fill(SkeletonCard()).join("")}
        </div>
        <div id="js-pagination" class="flex justify-center flex-wrap items-center gap-2 pt-5"></div>
      </section>
    </section>
  `;
}

function renderListings(listings: any[]) {
  const listingsContainer = document.getElementById(
    "js-all-listings",
  ) as HTMLElement;

  if (!listingsContainer) return;

  if (listings.length === 0) {
    listingsContainer.innerHTML = `
      <div class="col-span-full text-center py-10 text-gray-500">
        <p class="text-xl">No listings found</p>
      </div>
    `;
    return;
  }

  const listingsHTML = listings.map((listing) => ListingCard(listing)).join("");
  listingsContainer.innerHTML = listingsHTML;
  animateStaggerIn("#js-all-listings");
}

function getHighestBid(listing: any): number {
  if (!listing.bids || listing.bids.length === 0) return 0;
  return Math.max(...listing.bids.map((bid: any) => bid.amount));
}

function filterByTag(listings: any[], tag: string): any[] {
  if (tag === "all") return listings;

  return listings.filter((listing) =>
    listing.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase()),
  );
}

function filterBySearch(listings: any[], query: string): any[] {
  if (!query) return listings;

  const lowerQuery = query.toLowerCase();
  return listings.filter(
    (listing) =>
      listing.title?.toLowerCase().includes(lowerQuery) ||
      listing.description?.toLowerCase().includes(lowerQuery),
  );
}

function sortListings(listings: any[], sortType: string): any[] {
  const sorted = [...listings];

  switch (sortType) {
    case "latest":
      return sorted.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
      );
    case "a-z":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "z-a":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "Bid-low":
      return sorted.sort((a, b) => getHighestBid(a) - getHighestBid(b));
    case "Bid-high":
      return sorted.sort((a, b) => getHighestBid(b) - getHighestBid(a));
    default:
      return sorted;
  }
}

function applyFilters() {
  const searchInput = document.getElementById("js-search") as HTMLInputElement;
  const tagSelect = document.getElementById(
    "js-tag-filter",
  ) as HTMLSelectElement;
  const sortSelect = document.getElementById(
    "js-sort-select",
  ) as HTMLSelectElement;

  if (!searchInput || !tagSelect || !sortSelect) return;

  const searchQuery = searchInput.value;
  const selectedTag = tagSelect.value;
  const selectedSort = sortSelect.value;

  filteredListings = [...allListings];

  filteredListings = filterByTag(filteredListings, selectedTag);

  filteredListings = filterBySearch(filteredListings, searchQuery);

  filteredListings = sortListings(filteredListings, selectedSort);

  currentPage = 1;
  updatePagination();
}

function renderPaginationControls() {
  const paginationContainer = document.getElementById("js-pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(filteredListings.length / LISTINGS_PER_PAGE);

  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.className =
    "px-2 py-2 border rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:px-4 cursor-pointer";
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    updatePagination();
  };

  paginationContainer.appendChild(prevBtn);

  const isMobile = window.innerWidth < 640;

  if (isMobile) {
    const pagesToShow: number[] = [];

    pagesToShow.push(1);

    if (currentPage !== 1 && currentPage !== totalPages) {
      pagesToShow.push(currentPage);
    }

    if (totalPages > 1) {
      pagesToShow.push(totalPages);
    }

    pagesToShow.forEach((pageNum, index) => {
      if (index > 0 && pagesToShow[index - 1] < pageNum - 1) {
        const ellipsis = document.createElement("span");
        ellipsis.className = "px-1 py-2 text-gray-500 text-sm";
        ellipsis.textContent = "...";
        paginationContainer.appendChild(ellipsis);
      }

      const pageBtn = document.createElement("button");
      pageBtn.className = `px-2 py-2 border rounded-lg font-semibold hover:bg-gray-100 text-sm sm:px-4 cursor-pointer ${
        pageNum === currentPage
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : ""
      }`;
      pageBtn.textContent = String(pageNum);
      pageBtn.disabled = pageNum === currentPage;
      pageBtn.onclick = () => {
        currentPage = pageNum;
        updatePagination();
      };
      paginationContainer.appendChild(pageBtn);
    });
  } else {
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.className = `px-2 py-2 border rounded-lg font-semibold hover:bg-gray-100 text-sm sm:px-4 cursor-pointer ${
        i === currentPage ? "bg-blue-600 text-white hover:bg-blue-700" : ""
      }`;
      pageBtn.textContent = String(i);
      pageBtn.disabled = i === currentPage;
      pageBtn.onclick = () => {
        currentPage = i;
        updatePagination();
      };
      paginationContainer.appendChild(pageBtn);
    }
  }

  const nextBtn = document.createElement("button");
  nextBtn.className =
    "px-2 py-2 border rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:px-4 cursor-pointer";
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    updatePagination();
  };

  paginationContainer.appendChild(nextBtn);
}

function updatePagination() {
  const start = (currentPage - 1) * LISTINGS_PER_PAGE;
  const end = start + LISTINGS_PER_PAGE;
  renderListings(filteredListings.slice(start, end));
  renderPaginationControls();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function setupFiltersAndSearch() {
  const searchInput = document.getElementById("js-search") as HTMLInputElement;
  const tagSelect = document.getElementById(
    "js-tag-filter",
  ) as HTMLSelectElement;
  const sortSelect = document.getElementById(
    "js-sort-select",
  ) as HTMLSelectElement;

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (tagSelect) {
    tagSelect.addEventListener("change", applyFilters);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", applyFilters);
  }
}
