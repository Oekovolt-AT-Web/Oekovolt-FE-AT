import { getBaseUrl, isBuilding } from "@/lib/baseUrl"

// src/lib/api/photovoltaik.js
export async function getCardContact() {
  if (isBuilding()) {
    return { message: null };
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/card_contact`;


  try {
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}