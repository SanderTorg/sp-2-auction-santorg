import { createHTML } from "../utils/utils";

export async function ListingsPage() {
  const template = mainTemplate();

  return createHTML(template);
}

function mainTemplate() {
  return `
    <section id="listings-page" class="flex flex-col items-center gap-5 mx-auto max-w-3xl w-full">
      <h1 class="flex text-3xl capitalize font-bold">all Listings</h1>

      <section class="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
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
      </section>

      <section class="my-8">
        <div id="js-all-listings" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          Loading all listings...
        </div>
      </section>
    </section>
  `;
}
