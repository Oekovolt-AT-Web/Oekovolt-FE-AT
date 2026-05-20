import { NextResponse } from "next/server";

const BASE_URL = "http://10.10.200.203:8000";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Missing path" },
        { status: 400 }
      );
    }

    // Optional security check
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");

    const allowed =
      process.env.ALLOWED_LOCAL || "https://www.oekovolt.de";

    if (
      origin &&
      origin !== allowed &&
      (!referer || !referer.startsWith(allowed))
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Ensure valid path
    const safePath = path.startsWith("/")
      ? path
      : `/${path}`;

    const externalUrl = `${BASE_URL}${safePath}`;

    const response = await fetch(externalUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "File not found" },
        { status: response.status }
      );
    }

    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ||
          "application/octet-stream",

        "Content-Length":
          response.headers.get("content-length") || "",

        "Cache-Control":
          "public, max-age=31536000, immutable",

        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}