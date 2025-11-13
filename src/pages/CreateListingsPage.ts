import { createHTML } from "../utils/utils";

export default async function CreateListingsPage() {
  const template = createListingTemplate();
  return createHTML(template);
}

function createListingTemplate() {
  return `
    <h1>Create a New Listing</h1>
    `;
}
