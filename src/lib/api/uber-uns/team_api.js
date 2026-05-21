import { getBaseUrl, isBuilding } from "@/lib/baseUrl"
// src/lib/api/team.js
export async function getTeam() {
  // Skip during build
  if (isBuilding()) {
    return { message: null };
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/uber-uns/team`;

  const res = await fetch(url);

  if (!res.ok) return null;

  return res.json();
}