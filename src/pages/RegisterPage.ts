import { createHTML } from "../utils/utils";

export default async function RegisterPage() {
  const template = registerPageTemplate();
  return createHTML(template);
}

function registerPageTemplate() {
  return `
    <h1>Register Page</h1>
    `;
}
