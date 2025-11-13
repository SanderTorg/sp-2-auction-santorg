import { createHTML } from "../../utils/utils";

export default async function Navbar() {
  const template = navbarTemplate();
  return createHTML(template);
}

function navbarTemplate() {
  return `
    <nav id="js-nav">
      <a href="/">Home</a>
      <a href="/login">Login</a>
      <a href="/register">Register</a>
      <a href="/profile">Profile</a>
      <a href="/create-listing">Create Listing</a>
      <a href="/listing/123">Sample Listing</a>
    </nav>
  `;
}
