// src/app/api/partners/route.js
import { NextResponse } from "next/server";
import { getApiHeaders, isApiConfigured, API_BASE_URL } from "@/lib/apiBaseUrl";

const API_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.partners.api.partnersde_data`;

export async function GET() {
  // Check if API is configured
  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return NextResponse.json(
      { error: "API not configured" },
      { status: 500 }
    );
  }

  try {
    const headers = getApiHeaders();

    const res = await fetch(API_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      let errorText = "";
      try {
        const errorData = await res.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await res.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${res.status}: ${errorText}`);
      
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Add cache headers to the response
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error("Fetch error details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}