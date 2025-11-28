import { createHTML } from "../utils/utils";

export default async function SingleListingPage() {
  const template = singleListingPageTemplate();
  return createHTML(template);
}

function singleListingPageTemplate() {
  return `
  <section>
    <h1>Single Listing Page</h1>
  </section>
    `;
}

function getListingDetails(listingId: string) {}

function setupSingleListingPage() {}
