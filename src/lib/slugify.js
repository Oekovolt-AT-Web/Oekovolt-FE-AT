export function generateSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[\s–—]+/g, "-")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Used for job and hersteller names
export function generateJobSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "-")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9-]/g, "");
}