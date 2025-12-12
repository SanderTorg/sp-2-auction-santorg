import { get, put } from "../services/api";
import { createHTML } from "../utils/utils";
import { showError, showSuccess } from "./LoginPage";
import { errorTemplate, successTemplate } from "../components/auth/Message";

export default async function EditListingPage() {
  const listingId = getListingIdFromURL();

  if (!listingId) {
    return createHTML("<p>Invalid listing ID</p>");
  }

  const listingData = await getListingDetails(listingId);

  if (!listingData) {
    return createHTML("<p>Listing not found</p>");
  }

  const template = editListingTemplate(listingData);

  setTimeout(() => {
    setupEditListingForm(listingId);
  }, 0);

  return createHTML(template);
}

function getListingIdFromURL(): string | null {
  const path = window.location.pathname;
  const match = path.match(/\/edit-listing\/([^/]+)/);
  return match ? match[1] : null;
}

async function getListingDetails(listingId: string) {
  try {
    const response = await get(`/auction/listings/${listingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    return null;
  }
}

function editListingTemplate(listing: any) {
  const { title, description, tags, media, endsAt } = listing;
  const mediaUrl = media?.[0]?.url || "";
  const mediaAlt = media?.[0]?.alt || "";
  const tagsString = tags?.join(", ") || "";

  const endsAtFormatted = endsAt
    ? new Date(endsAt).toISOString().slice(0, 16)
    : "";

  return `
    <section class="flex flex-col items-center gap-6 mx-auto max-w-3xl w-full px-4">
      <div class="w-full gap-2 flex flex-col items-center sm:items-start"> 
        <h1 class="text-3xl font-bold">Edit Listing</h1>
        <p class="text-gray-600">Update your listing details below.</p>
      </div>

      ${errorTemplate()}
      ${successTemplate()}

      <form id="edit-listing-form" class="w-full flex flex-col gap-6 border p-6 rounded-lg shadow-md">
        <div class="flex flex-col gap-2">
           <label for="title" class="font-semibold">Title </label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value="${title || ""}"
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
          >${description || ""}</textarea>
        </div>

        <div class="flex flex-col gap-2">
          <label for="tags" class="font-semibold">Tags </label>
          <input 
            type="text" 
            id="tags" 
            name="tags" 
            value="${tagsString}"
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
            value="${mediaUrl}"
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
            value="${mediaAlt}"
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
            value="${endsAtFormatted}"
            disabled
            class="border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed focus:outline-none"
          />
          <small class="text-gray-500">Auction end date cannot be changed</small>
        </div>

        <div class="flex gap-4">
          <a 
            href="/profile" 
            class="flex-1 text-center bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >Cancel</a>

          <button 
            type="submit" 
            class="flex-1 bg-black cursor-pointer text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          >Update Listing</button>
        </div>
      </form>
    </section>
    `;
}

async function handleEditListing(event: Event, listingId: string) {
  event.preventDefault();

  const formEl = event.target as HTMLFormElement;
  const formData = new FormData(formEl);
  const submitButtonEl = formEl.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;

  const titleInput = formData.get("title") as string;
  const descriptionInput = formData.get("description") as string;
  const tagsInput = formData.get("tags") as string;
  const mediaUrlInput = formData.get("mediaUrl") as string;
  const mediaAltInput = formData.get("mediaAlt") as string;

  if (!titleInput) {
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

  const listingData: {
    title: string;
    description?: string;
    tags?: string[];
    media?: { url: string; alt: string }[];
  } = {
    title: titleInput,
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
    submitButtonEl.textContent = "Updating...";
  }

  try {
    await put(`/auction/listings/${listingId}`, listingData);
    showSuccess("Listing updated successfully!");

    setTimeout(() => {
      window.location.href = "/profile";
    }, 2000);
  } catch (error) {
    showError("Failed to update listing. Please try again.");
  } finally {
    if (submitButtonEl) {
      submitButtonEl.disabled = false;
      submitButtonEl.textContent = "Update Listing";
    }
  }
}

function setupEditListingForm(listingId: string) {
  const formEl = document.getElementById("edit-listing-form");
  if (formEl) {
    formEl.addEventListener("submit", (e) => handleEditListing(e, listingId));
  }
}
