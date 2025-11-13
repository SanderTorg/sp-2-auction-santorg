import Footer from "./components/footer/Footer";
import Navbar from "./components/header/Navbar";
import router from "./router";
import "./styles/style.css";

async function main() {
  document.addEventListener("DOMContentLoaded", async () => {
    const headerNavEl = document.getElementById("js-header");
    const footerEl = document.getElementById("js-footer");

    const navHtml = await Navbar();
    if (headerNavEl && navHtml) {
      if (typeof navHtml === "string") {
        headerNavEl.innerHTML = navHtml;
      } else if (navHtml instanceof Node) {
        headerNavEl.innerHTML = "";
        headerNavEl.appendChild(navHtml);
      }
    }

    setupNavLinks();

    const footerHtml = await Footer();
    if (footerEl && footerHtml) {
      if (typeof footerHtml === "string") {
        footerEl.innerHTML = footerHtml;
      } else if (footerHtml instanceof Node) {
        footerEl.innerHTML = "";
        footerEl.appendChild(footerHtml);
      }
    }

    renderMainContent(window.location.pathname);
  });
}

main().catch((error) => {
  console.error("Error in main:", error);
});

window.addEventListener("popstate", () => {
  renderMainContent(window.location.pathname);
});

function setupNavLinks() {
  const navEl = document.getElementById("js-nav");
  if (!navEl) return;

  const navLinks: NodeListOf<HTMLAnchorElement> =
    navEl.querySelectorAll("a[href^='/']");

  navLinks.forEach((link) => {
    link.addEventListener("click", navigate);
  });
}
function navigate(event: MouseEvent) {
  event.preventDefault();

  const el = event?.target as HTMLAnchorElement;
  const path = el?.getAttribute("href");

  if (typeof path === "string") {
    history.pushState({ path }, "", path);
    renderMainContent(path);
  }
}

async function renderMainContent(path = "") {
  const mainContentEl = document.getElementById("main-content");
  if (!mainContentEl || !path) return;

  const html = await router(path);
  if (typeof html === "string") {
    mainContentEl.innerHTML = html;
  } else if (html instanceof Node) {
    mainContentEl.innerHTML = "";
    mainContentEl.appendChild(html);
  }
}
