import { getBaseUrl, isBuilding } from "@/lib/baseUrl"
// src/lib/api/partners.js
export async function getPartnersIcon() {
  // Skip during build
  if (isBuilding()) {
    return { message: null };
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/partners_icon`;

  const res = await fetch(url);

  if (!res.ok) return null;

  return res.json();
}