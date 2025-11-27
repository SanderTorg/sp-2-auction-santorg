export function AuthGuardTemplate() {
  return `
  <section class="flex flex-col rounded-2xl border items-center gap-3 mx-auto max-w-2xl w-full py-4">
    <h1 class="text-3xl font-bold text-center">403 - Forbidden</h1>
    <p class="text-lg flex text-center font-semibold">You must be logged in to access this page.</p>
  </section>
  `;
}
