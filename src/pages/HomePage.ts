import { createHTML } from "../utils/utils";

export default async function HomePage() {
  const template = homePageTemplate();
  return createHTML(template);
}

function homePageTemplate() {
  return `
    <section id="home-page">
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the application.</p>
    </section>
  `;
}
