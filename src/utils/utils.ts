export function createHTML(template: string) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, "text/html");
  const fragment = document.createDocumentFragment();
  Array.from(parsedDocument.body.children).forEach((child) => {
    fragment.appendChild(child);
  });
  return fragment;
}
