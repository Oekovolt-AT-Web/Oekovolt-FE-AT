// import { NextResponse } from "next/server";

// const BASE_URL = process.env.SERVER;

// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const path = url.searchParams.get("path");

//     if (!path) {
//       return NextResponse.json(
//         { error: "Missing path" },
//         { status: 400 }
//       );
//     }

//     // Optional security check
//     const origin = req.headers.get("origin");
//     const referer = req.headers.get("referer");

//     const allowed =
//       process.env.ALLOWED_LOCAL || "https://www.oekovolt.com";

//     if (
//       origin &&
//       origin !== allowed &&
//       (!referer || !referer.startsWith(allowed))
//     ) {
//       return NextResponse.json(
//         { error: "Forbidden" },
//         { status: 403 }
//       );
//     }

//     // Ensure valid path
//     const safePath = path.startsWith("/")
//       ? path
//       : `/${path}`;

//     const externalUrl = `${BASE_URL}${safePath}`;

//     const response = await fetch(externalUrl);

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "File not found" },
//         { status: response.status }
//       );
//     }

//     const data = await response.arrayBuffer();

//     return new NextResponse(data, {
//       status: 200,
//       headers: {
//         "Content-Type":
//           response.headers.get("content-type") ||
//           "application/octet-stream",

//         "Content-Length":
//           response.headers.get("content-length") || "",

//         "Cache-Control":
//           "public, max-age=31536000, immutable",

//         "Access-Control-Allow-Origin": "*",
//       },
//     });
//   } catch (error) {
//     console.error("Proxy error:", error);

//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

const BASE_URL = process.env.SERVER;

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");

    const allowed =
      process.env.ALLOWED_LOCAL || "https://www.oekovolt.com";

    if (
      origin &&
      origin !== allowed &&
      (!referer || !referer.startsWith(allowed))
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const safePath = path.startsWith("/") ? path : `/${path}`;
    // Nur öffentliche Frappe-Dateien durchreichen – kein Zugriff auf /api, /app, /private o. ä.
    if (!/^\/files\/[^?#\\]+$/.test(safePath) || safePath.includes("..")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const externalUrl = `${BASE_URL}${safePath}`;

    // ✅ detect video
    const isVideo = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(path);

    // ✅ handle Range (IMPORTANT for backoffice streaming)
    const headers = {};
    if (isVideo) {
      const range = req.headers.get("range");
      if (range) headers["Range"] = range;
    }

    const response = await fetch(externalUrl, { headers });

    if (!response.ok && response.status !== 206) {
      return NextResponse.json(
        { error: "File not found" },
        { status: response.status }
      );
    }

    // 🔥 VIDEO: stream instead of buffering
    if (isVideo) {
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("content-type") || "video/mp4",

          "Content-Length":
            response.headers.get("content-length") || "",

          "Content-Range":
            response.headers.get("content-range") || "",

          "Accept-Ranges": "bytes",

          "Cache-Control": "public, max-age=31536000, immutable",

          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 🟢 NORMAL FILES (your original logic)
    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ||
          "application/octet-stream",

        "Content-Length":
          response.headers.get("content-length") || "",

        "Cache-Control": "public, max-age=31536000, immutable",

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