import { getBaseUrl, isBuilding } from "@/lib/baseUrl"
// src/lib/api/photovoltaikanlage.js
export async function getPhotovoltaikanlage() {
  // Skip during build
 if (isBuilding()) {
    return { message: null };
  }

  const baseUrl = getBaseUrl();

  const url = `${baseUrl}/api/produkte/photovoltaikanlage`;
  
  const res = await fetch(url);

  if (!res.ok) return null;

  return res.json();
}