import { requireAuth } from "../utils/authGuard";
import { AuthGuardTemplate } from "../components/auth/AuthGuard";
import { createHTML } from "../utils/utils";
import { getUsernameStorage } from "../utils/storage";
import { fetchUserProfile, refreshProfile } from "../services/userApi";
import { showError, showSuccess } from "./LoginPage";
import { put } from "../services/api";
import { errorTemplate, successTemplate } from "../components/auth/Message";

export async function EditProfilePage() {
  if (!requireAuth()) {
    return createHTML(AuthGuardTemplate());
  }

  const username = getUsernameStorage();
  const profileData = await fetchUserProfile(username);

  const template = editProfilePageTemplate(profileData);
  const html = createHTML(template);

  setTimeout(() => {
    setupEditProfileForm();
  }, 0);

  return html;
}

function editProfilePageTemplate(profileData: any) {
  const bio = profileData?.bio || "";
  const avatarUrl = profileData?.avatar?.url || "";
  const avatarAlt = profileData?.avatar?.alt || "";
  const bannerUrl = profileData?.banner?.url || "";
  const bannerAlt = profileData?.banner?.alt || "";

  return `
    <section class="flex flex-col items-center gap-6 mx-auto max-w-2xl w-full">
      <div class="w-full gap-2 flex flex-col items-center sm:items-start">
        <h1 class="text-3xl font-bold">Edit Profile</h1>
        <p class="text-gray-600">Update your profile information</p>
      </div>

      ${errorTemplate()}
      ${successTemplate()}

      <form id="js-edit-profile-form" class="w-full flex flex-col gap-6 border p-6 rounded-lg shadow-md">
        <div class="flex flex-col gap-2">
          <label for="bio" class="font-semibold">Bio</label>
          <textarea 
          id="js-bio" 
          name="bio" 
          rows="4" 
          class="border p-2 rounded-lg" placeholder="Tell us about yourself...">${bio}</textarea>
        </div>

        <div class="flex flex-col gap-2">
          <label for="avatarUrl" class="font-semibold text-lg">Avatar URL</label>
          <input 
            type="url" 
            id="js-avatarUrl" 
            name="avatarUrl" 
            value="${avatarUrl}"
            class="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="avatarAlt" class="font-semibold text-lg">Avatar Alt Text</label>
          <input 
            type="text" 
            id="js-avatarAlt" 
            name="avatarAlt" 
            value="${avatarAlt}"
            class="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description of your avatar"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="bannerUrl" class="font-semibold text-lg">Banner URL</label>
          <input 
            type="url" 
            id="js-bannerUrl" 
            name="bannerUrl" 
            value="${bannerUrl}"
            class="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/banner.jpg"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="bannerAlt" class="font-semibold text-lg">Banner Alt Text</label>
          <input 
            type="text" 
            id="js-bannerAlt" 
            name="bannerAlt" 
            value="${bannerAlt}"
            class="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description of your banner"
          />
        </div>
      
        <div class="flex justify-center gap-4">
          <a href="/profile" class="flex items-center px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition">Cancel</a>
          
          <button 
            type="submit"
            class="cursor-pointer px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>`;
}

async function handleEditProfile(event: Event) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const submitButtonEl = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;

  const successMessageEl = document.getElementById("js-show-success");
  const errorMessageEl = document.getElementById("js-show-error");

  const bio = formData.get("bio") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const avatarAlt = formData.get("avatarAlt") as string;
  const bannerUrl = formData.get("bannerUrl") as string;
  const bannerAlt = formData.get("bannerAlt") as string;

  if (bio && bio.length > 200) {
    showError("Bio must be less than 200 characters.");
    return;
  }

  if (avatarUrl && !isValidUrl(avatarUrl)) {
    showError("Avatar URL must be a valid URL.");
    return;
  }

  if (bannerUrl && !isValidUrl(bannerUrl)) {
    showError("Banner URL must be a valid URL.");
    return;
  }

  if (submitButtonEl) {
    submitButtonEl.disabled = true;
    submitButtonEl.textContent = "Saving...";
  }

  if (successMessageEl) {
    successMessageEl.classList.add("hidden");
  }

  if (errorMessageEl) {
    errorMessageEl.classList.add("hidden");
  }

  const username = getUsernameStorage();
  const updateData: any = {};

  if (bio) {
    updateData.bio = bio;
  }

  if (avatarUrl && isValidUrl(avatarUrl)) {
    updateData.avatar = {
      url: avatarUrl,
      alt: avatarAlt,
    };
  }

  if (bannerUrl && isValidUrl(bannerUrl)) {
    updateData.banner = {
      url: bannerUrl,
      alt: bannerAlt,
    };
  }

  try {
    await put(`/auction/profiles/${username}`, updateData);

    await refreshProfile();

    showSuccess("Profile updated successfully!");

    setTimeout(() => {
      window.location.href = `/profile`;
    }, 2000);
  } catch (error) {
    console.error("Error updating profile:", error);
    showError(
      "An error occurred while updating your profile. Please try again."
    );
  } finally {
    if (submitButtonEl) {
      submitButtonEl.disabled = false;
      submitButtonEl.textContent = "Save Changes";
    }
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function setupEditProfileForm() {
  const formEl = document.getElementById("js-edit-profile-form");
  if (formEl) {
    formEl.addEventListener("submit", handleEditProfile);
  }
}
