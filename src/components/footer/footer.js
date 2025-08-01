export async function renderFooter(targetElement) {
  if (!targetElement) return;

  const html = await fetch("src/components/footer/footer.html").then(function (res) {
    return res.text();
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const footerContent = doc.querySelector("footer");

  if (footerContent) {
    targetElement.innerHTML = footerContent.outerHTML;
  }
}
