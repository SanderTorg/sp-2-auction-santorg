import { createHTML } from "../utils/utils";

export default async function NotFoundPage() {
  const template = notFoundPageTemplate();
  return createHTML(template);
}

function notFoundPageTemplate() {
  return `<h1>404 - Page Not Found</h1>`;
}
