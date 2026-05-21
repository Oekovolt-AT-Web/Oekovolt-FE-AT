import { getBaseUrl, isBuilding } from "@/lib/baseUrl"
// src/lib/api/partners.js
export async function getPartners() {
  // Skip during build
  if (isBuilding()) {
      return { message: null };
    }
  
    const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/partners`;
  
  const res = await fetch(url);

  if (!res.ok) return null;

  return res.json();
}