import { registerUser } from "../services/authApi";
import { createHTML } from "../utils/utils";
import { showError, showSuccess } from "./LoginPage";

export default async function RegisterPage() {
  const template = registerPageTemplate();
  setTimeout(() => {
    setupRegisterForm();
  }, 0);
  return createHTML(template);
}

function registerPageTemplate() {
  return `
  <section class="flex flex-col items-center gap-3 mx-auto my-auto max-w-md w-full">
    <h1 class="text-2xl font-bold">Register Page</h1>

    <div id="js-login-error" class="hidden w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">wfewfefewfewoijoik</div>

    <form id="js-register-form" class="flex flex-col gap-4 border p-6 rounded-lg shadow-md w-full ">
      <div class="flex flex-col relative">
        <label for="name" aria-label="Name" class="flex absolute -top-3 left-5 bg-white px-1 dark:bg-[#242424]">Name</label>
        <input type="text" id="name" name="name" placeholder="Your name" class="flex border pl-2 py-3 rounded-xl" required />
      </div>  

      <div class="flex flex-col relative">
        <label for="email" aria-label="Email" class="flex absolute -top-3 left-5 bg-white px-1 dark:bg-[#242424]">Email</label>
        <input type="email" id="email" name="email" placeholder="@stud.noroff.no" class="flex border pl-2 py-3 rounded-xl" required />
      </div>

      <div class="flex flex-col relative">
        <label for="password" aria-label="Password" class="flex absolute -top-3 left-5 bg-white px-1 dark:bg-[#242424]">Password</label>
        <input type="password" id="password" name="password" placeholder="Your password" class="flex border pl-2 py-3 rounded-xl" required />
      </div>
 
      <div class="flex flex-col items-center gap-1 min-[350px]:flex-row justify-center">
        <p class="text-center font-semibold">Do you have an account? </p>
        <a href="/login" class="hover:underline font-semibold">Login here</a>
      </div>
      <button type="submit" class="flex p-4 justify-center items-center font-semibold text-white text-xl bg-[#101828]  border rounded-2xl cursor-pointer hover:bg-gray-800">Submit</button>
    </form>
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
