import { get, post } from "../services/api";
import { isLoggedIn } from "../utils/storage";
import { createHTML } from "../utils/utils";

export default async function SingleListingPage() {
  const listingId = getListingIdFromURL();

  if (!listingId) {
    return createHTML("<p>Invalid listing ID</p>");
  }

  const listingData = await getListingDetails(listingId);
  if (!listingData) {
    return createHTML("<p>Listing not found</p>");
  }

  const template = singleListingPageTemplate(listingData);
  const html = createHTML(template);

  setTimeout(() => setupBidForm(listingId), 0);

  return html;
}

async function getListingDetails(listingId: string) {
  try {
    const response = await get(
      `/auction/listings/${listingId}?_seller=true&_bids=true`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    return null;
  }
}

function getBidHistoryHTML(bids: any[], bidCount: number) {
  if (bidCount === 0) return "";

  const bidsSorted = [...bids].sort((a: any, b: any) => b.amount - a.amount);

  return `
    <div class="border-t mt-6 pt-6">
      <h3 class="text-xl font-semibold pb-4">Bid History (${bidCount})</h3>
      <div class="flex flex-col gap-2">
        ${bidsSorted
          .slice(0, 5)
          .map(
            (bid: any) => `
          <div class="flex flex-wrap gap-2.5 sm:justify-between items-center p-3 bg-gray-50 rounded">
            <div class="flex flex-wrap items-center gap-3">
              <img 
                src="${
                  bid.bidder?.avatar?.url || "https://via.placeholder.com/40"
                }" 
                alt="${bid.bidder?.name || "Anonymous"}" 
                class="w-10 h-10 rounded-full"
              />
              <span class="flex font-medium">${
                bid.bidder?.name || "Anonymous"
              }</span>
            </div>
            <span class="flex items-center justify-center text-center text-green-600 font-bold">$${
              bid.amount
            }</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function getBidFormHTML(timeRemaining: any, highestBid: number) {
  if (timeRemaining.expired) {
    return '<p class="text-red-500 font-semibold">This auction has ended</p>';
  }

  if (!isLoggedIn()) {
    return `
      <div class="flex flex-col border-t pt-6 items-center gap-3">
        <h3 class="text-xl font-semibold">Want to place a bid?</h3>
        <p class="text-gray-600">You must be logged in to participate in auctions.</p>
        <a href="/login" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
          Log In to Bid
        </a>
      </div>
    `;
  }

  return `
    <div class="flex flex-col border-t pt-6">
      <h3 class="flex text-xl font-semibold pb-4">Place Your Bid</h3>
      <form id="js-bid-form" class="flex flex-wrap sm:flex-row justify-center gap-4">
        <input 
          type="number" 
          id="bidAmount" 
          name="bidAmount" 
          min="${highestBid + 1}"
          placeholder="Enter bid amount"
          required
          class="flex w-full sm:flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          class="flex w-full max-w-xs sm:flex-1 justify-center bg-blue-600 cursor-pointer text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        > 
          Place Bid
        </button>
      </form>
      <div id="js-bid-error" class="hidden mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"></div>
      <div id="js-bid-success" class="hidden mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"></div>
    </div>
  `;
}

function singleListingPageTemplate(listing: any) {
  const { title, description, media, endsAt, _count, seller, bids } = listing;

  const imageUrl = media?.[0]?.url || "https://via.placeholder.com/600x400";
  const imageAlt = media?.[0]?.alt || title;
  const bidCount = _count?.bids || 0;
  const timeRemaining = getTimeRemaining(endsAt);
  const highestBid =
    bids && bids.length > 0
      ? Math.max(...bids.map((bid: any) => bid.amount))
      : 0;
  const sellerName = seller.name;
  const sellerAvatar = seller.avatar.url;

  return `
  <section class="flex flex-col gap-6 mx-auto max-w-2xl w-full pb-2.5">
    <a href="/" class="flex items-start text-blue-600 hover:text-blue-800"> <- Back to Listings</a>
    
     <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <img 
          src="${imageUrl}" 
          alt="${imageAlt}" 
          class="w-full h-auto object-cover"
        />

        <div class="p-6">
          <h1 class="text-3xl font-bold pb-4">${title}</h1>
          
          <div class="flex flex-wrap sm:flex-row gap-4 pb-4">
            <div class="flex w-full sm:flex-1 flex-col bg-gray-100 p-4 rounded-lg">
              <p class="flex text-sm text-gray-600">Current Bid</p>
              <p class="flex text-2xl font-bold text-green-600">
                ${highestBid > 0 ? `$${highestBid}` : "No bids yet"}
              </p>
            </div>
            <div class="flex w-full sm:flex-1 flex-col bg-gray-100 p-4 rounded-lg">
              <p class="flex text-sm text-gray-600">Time Remaining</p>
              <p class="flex text-2xl font-bold ${
                timeRemaining.expired ? "text-red-500" : "text-blue-600"
              }">
                ${timeRemaining.text}
              </p>
            </div>
          </div>

          <div class="flex flex-col pb-6">
            <h2 class="flex text-xl font-semibold mb-2">Description</h2>
            <p class="flex text-gray-700">${
              description || "No description available"
            }</p>
          </div>

          <div class="flex flex-col mb-6 pb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="flex text-lg font-semibold mb-2">Seller</h3>
            <div class="flex items-center gap-3">
              <img 
                src="${sellerAvatar}" 
                alt="${sellerName}'s avatar" 
                class="w-12 h-12 rounded-full"
              />
              <div class="text-blue-600 font-semibold hover:underline">
                ${sellerName}
              </div>
            </div>
          </div>
 
          ${getBidFormHTML(timeRemaining, highestBid)}

          ${getBidHistoryHTML(bids, bidCount)}
        </div>
      </div>
  </section>
    `;
}

function getTimeRemaining(endsAt: string) {
  const now = new Date().getTime();
  const end = new Date(endsAt).getTime();
  const timeDifference = end - now;

  if (timeDifference <= 0) {
    return { text: "Auction Ended", expired: true };
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return { text: `${days}d ${hours}h remaining`, expired: false };
  }

  if (hours > 0) {
    return { text: `${hours}h ${minutes}m remaining`, expired: false };
  }
  return { text: `${minutes}m remaining`, expired: false };
}

function getListingIdFromURL(): string {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/listing\/([^/]+)/);
  return match?.[1] || "";
}

function setupBidForm(listingId: string) {
  const bidFormEl = document.getElementById("js-bid-form") as HTMLFormElement;
  const bidErrorEl = document.getElementById("js-bid-error");
  const bidSuccessEl = document.getElementById("js-bid-success");

  if (bidFormEl) {
    bidFormEl.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (bidErrorEl) bidErrorEl.classList.add("hidden");
      if (bidSuccessEl) bidSuccessEl.classList.add("hidden");

      const formData = new FormData(bidFormEl);
      const bidAmount = formData.get("bidAmount") as string;
      const submitButton = bidFormEl.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;

      if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
        if (bidErrorEl) {
          bidErrorEl.textContent = "Please enter a valid bid amount.";
          bidErrorEl.classList.remove("hidden");
        }
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Placing Bid...";
      }

      try {
        await post(`/auction/listings/${listingId}/bids`, {
          amount: Number(bidAmount),
        });

        if (bidSuccessEl) {
          bidSuccessEl.textContent = "Bid placed successfully! Refreshing...";
          bidSuccessEl.classList.remove("hidden");
        }

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error: any) {
        if (bidErrorEl) {
          bidErrorEl.textContent =
            error.message || "Failed to place bid. Please try again.";
          bidErrorEl.classList.remove("hidden");
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Place Bid";
        }
      }
    });
  }
}
