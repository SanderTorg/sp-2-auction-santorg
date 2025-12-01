export default function ListingCard(listing: any): string {
  const { id, title, description, media, endsAt, _count } = listing;

  const imageUrl = media?.[0]?.url || "https://via.placeholder.com/300x200";
  const imageAlt = media?.[0]?.alt || title;
  const bidCount = _count?.bids || 0;
  const timeRemaining = getTimeRemaining(endsAt);

  return `
    <a href="/listing/${id}" class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow hover:animate-pulse overflow-hidden">
      <img 
        src="${imageUrl}" 
        alt="${imageAlt}" 
        class="w-full h-48 object-cover"
      />
      <div class="flex flex-col p-4">
        <h3 class="text-xl font-semibold mb-2 line-clamp-1 hover:underline">${title}</h3>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">${
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
      </div>
    </a>
  `;
}

function getTimeRemaining(endsAt: string): { text: string; expired: boolean } {
  const now = new Date().getTime();
  const end = new Date(endsAt).getTime();
  const diff = end - now;

  if (diff <= 0) {
    return { text: "Ended", expired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return { text: `${days}d ${hours}h left`, expired: false };
  } else if (hours > 0) {
    return { text: `${hours}h ${minutes}m left`, expired: false };
  } else {
    return { text: `${minutes}m left`, expired: false };
  }
}
