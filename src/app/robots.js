export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/image/"],
        disallow: ["/api/"], 
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/api/image/"],
        disallow: ["/api/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/api/image/"],
      },
    ],
    sitemap: "https://www.oekovolt.de/sitemap.xml",
    host: "https://www.oekovolt.de",
  };
}