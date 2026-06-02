import { registerUser } from "../services/authApi";
import { createHTML } from "../utils/utils";
import { showError, showSuccess } from "./LoginPage";
import { errorTemplate, successTemplate } from "../components/auth/Message";
import { animateSlideUp } from "../utils/animations";

export default async function RegisterPage() {
  const template = registerPageTemplate();
  setTimeout(() => {
    setupRegisterForm();
    animateSlideUp("section.flex.flex-col.items-center > div");
  }, 0);
  return createHTML(template);
}

function registerPageTemplate() {
  return `
  <section class="flex flex-col items-center gap-6 mx-auto my-auto max-w-md w-full px-4">
    
    ${errorTemplate()}
    ${successTemplate()}

    <div class="w-full flex flex-col gap-6 bg-linear-to-r from-black to-gray-800 text-white rounded-2xl p-8 sm:p-12 shadow-xl">
      <h1 class="text-3xl font-bold text-center mb-2">Register</h1>

      <form id="js-register-form" class="flex flex-col gap-5 w-full">
        <div class="flex flex-col gap-2">
          <label for="name" class="font-semibold ml-1">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="Your name" 
            class="w-full bg-white text-gray-900 border-none rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm" 
            required 
          />
        </div>  

        <div class="flex flex-col gap-2">
          <label for="email" class="font-semibold ml-1">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="@stud.noroff.no" 
            class="w-full bg-white text-gray-900 border-none rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm" 
            required 
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="password" class="font-semibold ml-1">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Your password" 
            class="w-full bg-white text-gray-900 border-none rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm" 
            required 
          />
        </div>
 
        <div class="flex flex-col items-center gap-2 mt-2">
          <button 
            type="submit" 
            class="w-full bg-red-600 text-white px-8 py-3.5 rounded-lg hover:bg-red-700 font-bold transition-all cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Register
          </button>

          <div class="flex gap-1 text-sm mt-2">
            <p class="text-gray-300">Do you have an account?</p>
            <a href="/login" class="text-white hover:text-red-400 font-semibold underline decoration-red-500">Login here</a>
          </div>
        </div>
      </form>
    </div>
  </section>
    `;
}

async function handleRegister(event: Event) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const username = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!username || !email || !password) {
    showError("Please fill in all required fields.");
    return;
  }

  if (username.length < 3) {
    showError("Username must be at least 4 characters long.");
    return;
  }

  if (!email.includes("@stud.noroff.no")) {
    showError("Email must be a valid stud.noroff.no address.");
    return;
  }
  if (password.length < 7) {
    showError("Password must minimum 8 characters long.");
    return;
  }

  const registerData = {
    name: username,
    email: email,
    password: password,
  };

  try {
    const response = await registerUser(registerData);
    const data = await response.json();

    if (!response.ok) {
      showError(data.message || "Registration failed. Please try again.");
    }

    if (data.data) {
      showSuccess("Registration successful!");
    }

    if (data.data) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }
  } catch (error) {
    showError("An error occurred during registration. Please try again.");
  }
}

function setupRegisterForm() {
  const registerFormEl = document.getElementById("js-register-form");
  if (registerFormEl) {
    registerFormEl.addEventListener("submit", handleRegister);
  }
}
