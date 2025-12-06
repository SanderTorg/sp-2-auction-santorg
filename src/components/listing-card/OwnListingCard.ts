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
      <div class="flex flex-col p-4">
        <a href="/listing/${id}">
          <h3 class="text-xl font-semibold mb-2 line-clamp-1 hover:underline">${title}</h3>
        </a>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">${
          description || "No description"
        }</p>
        
        <div class="flex justify-between items-center mb-3">
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
          <a href="/edit-listing/${id}" class="flex-1">
            <button class="w-full cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Edit
            </button>
          </a>
          <button 
            data-listing-id="${id}" 
            id="js-delete-listing"
            class=" flex-1 cursor-pointer px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  `;
}
