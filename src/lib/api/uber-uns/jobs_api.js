import { getBaseUrl, isBuilding } from "@/lib/baseUrl"
// src/lib/api/jobs.js
export async function getJobs() {
  // Skip during build
   if (isBuilding()) {
      return { message: null };
    }
  
    const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/uber-uns/jobs`;
  
  const res = await fetch(url);

  if (!res.ok) return null;

  return res.json();
}