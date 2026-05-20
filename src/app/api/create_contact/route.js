// src/app/api/kontakt/route.js (or wherever this file is located)

import { NextResponse } from "next/server";
import { getApiHeaders, isApiConfigured, API_BASE_URL } from "@/lib/apiBaseUrl";

const API_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.kontakt.api.create_contact`;

export async function POST(request) {
    // Check if API is configured
    if (!isApiConfigured()) {
        console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
        return NextResponse.json(
            { error: "API not configured" },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        
        // Get authenticated headers
        const headers = getApiHeaders();

        // Forward the data to the external API with authentication
        const response = await fetch(API_URL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
                console.error("Error response:", errorData);
            } catch (e) {
                const errorText = await response.text();
                console.error("Error text:", errorText);
                errorData = { message: errorText };
            }
            
            return NextResponse.json(
                { error: "Failed to submit contact form", details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error in contact API:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}