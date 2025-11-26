export function AuthGuardTemplate() {
  return `
  <section class="flex flex-col rounded-2xl border items-center gap-3 m-auto max-w-3xl w-full py-4">
    <h1 class="text-3xl font-bold">403 - Forbidden</h1>
    <p class="text-lg">You must be logged in to access this page.</p>
  </section>
  `;
}
