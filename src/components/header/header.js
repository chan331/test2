export async function renderHeader(targetElement) {
  if (!targetElement) return;

  const html = await fetch("src/components/header/header.html").then(function (res) {
    return res.text();
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const headerContent = doc.querySelector("header");

  if (headerContent) {
    targetElement.innerHTML = headerContent.outerHTML;
  }
}
