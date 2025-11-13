import { createHTML } from "../utils/utils";

export default async function ProfilePage() {
  const template = profilePageTemplate();
  return createHTML(template);
}

function profilePageTemplate() {
  return `
    <h1>User Profile</h1>
    `;
}
