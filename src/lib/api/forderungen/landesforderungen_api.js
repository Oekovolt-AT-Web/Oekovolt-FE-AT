import { getBaseUrl, isBuilding } from "@/lib/baseUrl"

// src/lib/api/landesforderungen.js
export async function getLandesforderungen() {
  // Skip during build
  if (isBuilding()) {
    return { message: null };
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/forderungen/landesforderungen`;
  
  const res = await fetch(url);

  if (!res.ok) return null;

  const data = await res.json();
    return data;
}