import { post } from "../services/api";
import { createHTML } from "../utils/utils";
import { showError, showSuccess } from "./LoginPage";
import { errorTemplate, successTemplate } from "../components/auth/Message";

export default async function CreateListingsPage() {
  const template = createListingTemplate();

  setTimeout(() => {
    setupCreateListingForm();
  }, 0);

  return createHTML(template);
}

function createListingTemplate() {
  return `
    <section class="flex flex-col items-center gap-6 mx-auto max-w-3xl w-full px-4">
      <div class="w-full gap-2 flex flex-col items-center sm:items-start"> 
        <h1 class="text-3xl font-bold">Create a New Listing</h1>
        <div class="flex flex-col">
          <p class="text-gray-600">Listing creation form will go here.</p>
          <p>Every field is required to create a listing.</p>
        </div>
      </div>

      ${errorTemplate()}
      ${successTemplate()}

      <form id="create-listing-form" class="w-full flex flex-col gap-6 border p-6 rounded-lg shadow-md">
        <div class="flex flex-col gap-2">
           <label for="title" class="font-semibold">Title </label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            required
            class="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter listing title"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="description" class="font-semibold">Description </label>
          <textarea 
            id="description" 
            name="description" 
            rows="4" 
            required
            class="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Describe your item..."
          ></textarea>
        </div>

        <div class="flex flex-col gap-2">
          <label for="tags" class="font-semibold">Tags </label>
          <input 
            type="text" 
            id="tags" 
            name="tags" 
            required
            class="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tags separated by commas (e.g., electronics, gadgets)"
          />
          <small class="text-gray-500">Separate multiple tags with commas</small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="mediaUrl" class="font-semibold">Image URL </label>
          <input 
            type="url" 
            id="mediaUrl" 
            name="mediaUrl" 
            required
            class="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="mediaAlt" class="font-semibold">Image Alt Text </label>
          <input 
            type="text" 
            id="mediaAlt" 
            name="mediaAlt" 
            required
            class="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description of the image"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="endsAt" class="font-semibold">Auction End Date </label>
          <input 
            type="datetime-local" 
            id="endsAt" 
            name="endsAt" 
            required
            class="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <small class="text-gray-500">Select when the auction should end</small>
        </div>

        <div class="flex gap-4">
          <a 
            href="/" 
            class="flex-1 text-center bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >Cancel</a>

          <button 
            type="submit" 
            class="flex-1 cursor-pointer bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          > Create Listing</button>
        </div>
      </form>
    </section>
    `;
}

async function handleCreateListing(event: Event) {
  event.preventDefault();

  const formEl = event.target as HTMLFormElement;
  const formData = new FormData(formEl);
  const submitButtonEl = formEl.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;

  const successMessageEl = document.getElementById("js-show-success");
  const errorMessageEl = document.getElementById("js-show-error");

  const titleInput = formData.get("title") as string;
  const descriptionInput = formData.get("description") as string;
  const tagsInput = formData.get("tags") as string;
  const mediaUrlInput = formData.get("mediaUrl") as string;
  const mediaAltInput = formData.get("mediaAlt") as string;
  const endsAtInput = formData.get("endsAt") as string;

  if (!titleInput || !endsAtInput) {
    showError("Please fill in all required fields.");
    return;
  }

  let tags: string[] = [];

  if (tagsInput) {
    tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  const media = [];
  if (mediaUrlInput) {
    media.push({ url: mediaUrlInput, alt: mediaAltInput });
  }

  const endsAtDate = new Date(endsAtInput);

  const listingData: {
    title: string;
    description?: string;
    tags?: string[];
    media?: { url: string; alt: string }[];
    endsAt: string;
  } = {
    title: titleInput,
    endsAt: endsAtDate.toISOString(),
  };

  if (descriptionInput) {
    listingData.description = descriptionInput;
  }

  if (descriptionInput.length > 280) {
    showError("Description must be less than 280 characters.");
    return;
  }

  if (tags.length > 0) {
    listingData.tags = tags;
  }

  if (media.length > 0) {
    listingData.media = media;
  }

  if (submitButtonEl) {
    submitButtonEl.disabled = true;
    submitButtonEl.textContent = "Creating...";
  }

  if (successMessageEl) {
    successMessageEl.classList.add("hidden");
  }

  if (errorMessageEl) {
    errorMessageEl.classList.add("hidden");
  }

  try {
    await post("/auction/listings", listingData);

    showSuccess("Listing created successfully!");

    formEl.reset();

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  } catch (error) {
    showError("Failed to create listing. Please try again.");
  } finally {
    if (submitButtonEl) {
      submitButtonEl.disabled = false;
      submitButtonEl.textContent = "Create Listing";
    }
  }
}

function setupCreateListingForm() {
  const formEl = document.getElementById("create-listing-form");
  if (formEl) {
    formEl.addEventListener("submit", handleCreateListing);
  }
}
