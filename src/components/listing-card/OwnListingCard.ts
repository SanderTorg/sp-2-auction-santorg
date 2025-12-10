import { getTimeRemaining } from "./ListingCard";

export default function OwnListingCard(listing: any): string {
  const { id, title, description, media, endsAt, _count } = listing;

  const imageUrl = media?.[0]?.url || "https://via.placeholder.com/300x200";
  const imageAlt = media?.[0]?.alt || title;
  const bidCount = _count?.bids || 0;
  const timeRemaining = getTimeRemaining(endsAt);

  return `
    <div class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <a href="/listing/${id}">
        <img 
          src="${imageUrl}" 
          alt="${imageAlt}" 
          class="w-full h-48 object-cover"
        />
      </a>
      <div class="flex flex-col p-4 gap-3">
        <a href="/listing/${id}">
          <h3 class="text-xl font-semibold line-clamp-1 text-red-600 hover:text-red-800 hover:underline">${title}</h3>
        </a>
        <p class="text-gray-600 text-sm line-clamp-2">${
          description || "No description"
        }</p>
        
        <div class="flex justify-between items-center">
          <span class="flex text-sm text-gray-500">
            ${bidCount} ${bidCount === 1 ? "bid" : "bids"}
          </span>
          <span class="text-sm font-medium ${
            timeRemaining.expired ? "text-red-500" : "text-green-600"
          }">
            ${timeRemaining.text}
          </span>
        </div>

        <div class="flex gap-2 pt-3 border-t">
          <a href="/edit-listing/${id}" class="flex w-full">
            <button class="w-full cursor-pointer px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
              Edit
            </button>
          </a>
          <button 
            data-listing-id="${id}" 
            id="js-delete-listing"
            class="flex w-full cursor-pointer justify-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  `;
}
