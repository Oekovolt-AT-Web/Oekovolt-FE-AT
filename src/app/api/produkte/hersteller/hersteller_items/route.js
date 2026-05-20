// src/app/api/hersteller/[name]/route.js (or wherever this file is located)
import { NextResponse } from "next/server";
import { getApiHeaders, isApiConfigured, API_BASE_URL } from "@/lib/apiBaseUrl";

export async function GET(request) {
  try {
    // Get the 'name' parameter from the URL query string
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    
    // Check if name parameter exists
    if (!name) {
      return NextResponse.json(
        { error: "Name parameter is required" },
        { status: 400 }
      );
    }
    
    // Check if API is configured
    if (!isApiConfigured()) {
      console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
      return NextResponse.json(
        { error: "API not configured" },
        { status: 500 }
      );
    }
    
    // Construct the external API URL with the name parameter using API_BASE_URL
    const apiUrl = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.hersteller.api.get_hesteller_by_name?name=${encodeURIComponent(name)}`;
    
    const headers = getApiHeaders();
    
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
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
        { error: "Failed to fetch hersteller data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Extract the actual hersteller data from the response
    const hersteller = data?.message?.message;
    
    if (!hersteller) {
      return NextResponse.json(
        { error: "Hersteller not found" },
        { status: 404 }
      );
    }

    // Add cache headers to the response
    return NextResponse.json({ hersteller }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error("Error fetching hersteller:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}