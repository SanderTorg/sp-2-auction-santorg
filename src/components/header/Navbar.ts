import { createHTML } from "../../utils/utils";
import { isLoggedIn, logout } from "../../utils/storage";
import {
  fetchUserProfile,
  getAvatarAlt,
  getAvatarUrl,
  getCredits,
  getNameApi,
} from "../../services/userApi";

export default async function Navbar() {
  if (isLoggedIn()) {
    const name = getNameApi();
    await fetchUserProfile(name);
  }

  const template = mainTemplate();
  const html = createHTML(template);
  return html;
}

function mainTemplate() {
  return `<div class="w-full">${navbarTemplate()} ${navMenuTemplate()}</div>`;
}

function navbarTemplate() {
  return `
<nav id="js-navbar"class="flex text-center justify-between gap-1 items-center p-2 text-white w-full flex-wrap">
  <div class="flex items-center gap-2 justify-between w-full min-[450px]:w-auto">
    <a href="/" class="flex text-2xl font-bold text-center min-[450px]:order-2">Auction App</a>

    <div class="min-[450px]:order-1 cursor-pointer hover:bg-red-500/40 p-1 rounded" id="js-hamburger" aria-controls="js-nav-menu" aria-expanded="false">
      <span class="block w-[25px] h-[3px] my-[5px] bg-white transition-all duration-300 ease-in-out"></span>
      <span class="block w-[25px] h-[3px] my-[5px] bg-white transition-all duration-300 ease-in-out"></span>
      <span class="block w-[25px] h-[3px] my-[5px] bg-white transition-all duration-300 ease-in-out"></span>
    </div>
  </div>

  ${userInfoTemplate()}
</nav>  
  `;
}

function userInfoTemplate() {
  const loggedIn = isLoggedIn();
  const name = getNameApi();
  const credits = getCredits() || 0;
  const avatarUrl = getAvatarUrl();
  const avatarAlt = getAvatarAlt();
  if (!loggedIn) {
    return `
      <div class="flex items-center gap-3 flex-wrap justify-center">
        ${logInButtonTemplate()}  
        ${registerButtonTemplate()}
      </div>
      `;
  } else {
    return `
      <div class="flex items-center gap-3 flex-wrap justify-center w-full min-[450px]:w-auto">
        <div>
          Credit: ${credits}$
        </div>
        <a href="/profile" >
          <div class="sr-only">${name}</div>
          <img src="${avatarUrl}" alt="${avatarAlt}" class="w-10 h-10 rounded-full" />
        </a>
        ${logoutButtonTemplate()}
      </div>
    `;
  }
}

function navMenuTemplate() {
  return `
    <ul class="z-100 hidden flex-col gap-2 p-4 bg-gray-800 w-full transition-all duration-300 ease-in-out" id="js-nav-menu">
     <li>
      <a href="/" class="text-white hover:bg-red-500/10 p-2 rounded">Home</a>
     </li>
     <li>
      <a href="/profile" class="text-white hover:bg-red-500/10 p-2 rounded ">Profile</a>
     </li>
     <li>
      <a href="/create-listing" class="text-white hover:bg-red-500/10 p-2 rounded ">Create Listing</a>
     </li>
    </ul>
  `;
}

export function toggleMenu() {
  const hamburgerEl = document.getElementById("js-hamburger");
  const navMenuEl = document.getElementById("js-nav-menu");
  if (hamburgerEl && navMenuEl) {
    hamburgerEl.addEventListener("click", () => {
      const isExpanded = hamburgerEl.getAttribute("aria-expanded") === "true";
      hamburgerEl.setAttribute("aria-expanded", String(!isExpanded));
      navMenuEl.classList.toggle("hidden");
      navMenuEl.classList.toggle("flex");
    });
  }
}

function logInButtonTemplate() {
  return `
    <a id="js-login-button" class="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
      Login
    </a>
  `;
}

function setupLoginButton() {
  const loginButtonEl = document.getElementById("js-login-button");
  if (loginButtonEl) {
    loginButtonEl.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }
}

function logoutButtonTemplate() {
  return `
    <button id="js-logout-button" class="cursor-pointer bg-red-700 hover:bg-red-900 text-white font-bold py-1 px-2 rounded">
      Logout
    </button>
  `;
}

function setupLogoutButton() {
  const logoutButtonEl = document.getElementById("js-logout-button");
  if (logoutButtonEl) {
    logoutButtonEl.addEventListener("click", () => {
      logout();
      window.location.href = "/login";
    });
  }
}

function registerButtonTemplate() {
  return `
    <a id="js-register-button" class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Register
    </a>
  `;
}

function setupRegisterButton() {
  const registerButtonEl = document.getElementById("js-register-button");
  if (registerButtonEl) {
    registerButtonEl.addEventListener("click", () => {
      window.location.href = "/register";
    });
  }
}

export function setupNavFunctions() {
  setupLoginButton();
  setupRegisterButton();
  setupLogoutButton();
}
