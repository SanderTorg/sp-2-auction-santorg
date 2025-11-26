import { AuthGuardTemplate } from "../components/auth/AuthGuard";
import { createHTML } from "../utils/utils";

export default async function NotLoggedInPage() {
  const template = notLoggedInPage();
  return createHTML(template);
}

function notLoggedInPage() {
  return `
    ${AuthGuardTemplate()}
  `;
}
