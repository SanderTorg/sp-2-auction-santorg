import { createHTML } from "../../utils/utils";

export default async function Footer() {
  const template = footerTemplate();
  return createHTML(template);
}

function footerTemplate() {
  return `
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>&copy; 2024 Auction App. All rights reserved.</p>
    </footer>
    `;
}
