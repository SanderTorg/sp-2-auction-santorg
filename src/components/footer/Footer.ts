import { createHTML } from "../../utils/utils";

export default async function Footer() {
  const template = footerTemplate();
  return createHTML(template);
}

function footerTemplate() {
  return `
    <section class="flex flex-col text-white p-4 text-center justify-center items-center w-full">
      <div class="flex flex-col pb-4 text-center items-center gap-2 max-w-2xl">
        <a href="/" class="flex text-2xl font-bold text-center bg-linear-to-r from-red-600 to-white bg-clip-text !text-transparent">Auction House</a>
        <p class="flex ">Discover amazing items up for auction. Browse, bid, and win!</p>
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
          <a href="/" target="_blank" class="flex items-center justify-center text-red-600 hover:underline font-semibold">
           Home
          </a>
          <a href="/profile" target="_blank" class="flex items-center justify-center text-red-600 hover:underline font-semibold">
           Profile
          </a>
          <a href="/listings" target="_blank" class="flex items-center justify-center text-red-600 hover:underline font-semibold">
           All Listings
          </a>
          <a href="/login" target="_blank" class="flex items-center justify-center text-red-600 hover:underline font-semibold">
           Login
          </a>
          <a href="/register" target="_blank" class="flex items-center justify-center text-red-600 hover:underline font-semibold">
           Register
          </a>
        </div>

      </div>
      <div class="py-4 border-t border-gray-600 w-full max-w-2xl">
        <div class="flex items-center justify-center gap-2 mt-2">
          <p class="pt-2">GitHub:</p>
          <a href="https://github.com/SanderTorg" target="_blank" class="flex items-center justify-center gap-2 text-red-600 hover:underline font-semibold mt-2">
            Santorg
          </a> 
        </div>
        <p>&copy; 2025 Auction House SPA. All rights reserved.</p>          
      </div>
    </section>
    `;
}
