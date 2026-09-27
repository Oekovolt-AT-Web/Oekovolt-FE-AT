// src/app/api/kontakt/route.js (or wherever this file is located)

import { NextResponse } from "next/server";
import { ipAdresse } from "@/lib/ipAdresse";
import {
  getApiHeaders,
  isApiConfigured,
  API_BASE_URL,
} from "@/lib/apiBaseUrl";
import { backendFehler, NICHT_ERREICHBAR } from "@/lib/backendFehler";

const API_URL = `${API_BASE_URL}oekovolt_app.website_api.kontakt.submit_kontakt`;

export async function POST(request) {
  // Check if API is configured
  if (!isApiConfigured()) {
    console.error(
      "API not configured: Missing API_KEY or API_SECRET in environment variables",
    );
    return NextResponse.json({ error: "API not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();

    // Get authenticated headers
    const headers = getApiHeaders();

    // Forward the data to the external API with authentication
    const response = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ ...body, ip_adresse: ipAdresse(request) }),
    });

    if (!response.ok) {
      const { status, body: fehler } = await backendFehler(response, "Kontakt API");
      return NextResponse.json(fehler, { status });
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json(
      { error: NICHT_ERREICHBAR, code: "backend" },
      { status: 502 },
    );
  }
}
