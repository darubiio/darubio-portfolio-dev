export function triggerDownload(href: string): void {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = "";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
