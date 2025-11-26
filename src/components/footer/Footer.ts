import { createHTML } from "../../utils/utils";

export default async function Footer() {
  const template = footerTemplate();
  return createHTML(template);
}

function footerTemplate() {
  return `
    <section class="text-white p-4 text-center flex justify-center items-center w-full">
      <p>&copy; 2024 Auction App. All rights reserved.</p>
    </section>
    `;
}
