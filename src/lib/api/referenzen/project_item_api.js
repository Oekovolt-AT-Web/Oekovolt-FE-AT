import { getBaseUrl, isBuilding } from "@/lib/baseUrl"
// src/lib/api/project_item.js
export async function getProjectItem() {
  // Skip during build
  if (isBuilding()) {
    return { message: null };
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/referenzen/project_item`;

  const res = await fetch(url);

  if (!res.ok) return null;

  return res.json();
}