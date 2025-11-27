import { createHTML } from "../utils/utils";

export default async function NotFoundPage() {
  const template = notFoundPageTemplate();
  return createHTML(template);
}

function notFoundPageTemplate() {
  return `
  <section class="flex flex-col rounded-2xl border items-center gap-3 mx-auto max-w-2xl w-full py-4">
    <h1 class="text-3xl font-bold text-center">404 - Page Not Found</h1>
    <p class="text-lg flex text-center font-semibold">The page you are looking for does not exist.</p>
  </section>`;
}
