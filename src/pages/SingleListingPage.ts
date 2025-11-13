import { createHTML } from "../utils/utils";

export default async function SingleListingPage() {
  const template = singleListingPageTemplate();
  return createHTML(template);
}

function singleListingPageTemplate() {
  return `
    <h1>Single Listing Page</h1>
    `;
}
