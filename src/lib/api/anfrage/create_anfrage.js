import { getBaseUrl, isBuilding } from "@/lib/baseUrl"
// src/lib/api/create_anfrage.js

export async function submitAnfrage(payload) {
  if (isBuilding()) {
    return { message: null };
  }

  const baseUrl = getBaseUrl();

  const url = `${baseUrl}/api/create_anfrage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });


    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to submit inquiry");
    }

    return await res.json();
  } catch (error) {
    console.error("Error submitting PV inquiry:", error);
    throw error;
  }
}

