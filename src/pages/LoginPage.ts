import { createHTML } from "../utils/utils";

export default async function LoginPage() {
  const template = loginPageTemplate();
  return createHTML(template);
}

function loginPageTemplate() {
  return `
    <section id="login-page">
      <h1>Login to Your Account</h1>
    </section>
  `;
}
