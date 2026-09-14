import { alsVerbundenMarkieren, tokenGueltig } from "@/lib/scan/backend";

export const dynamic = "force-dynamic";

/** Smartphone hat die Seite geöffnet → Desktop zeigt „Smartphone verbunden“. */
export async function POST(request, { params }) {
  const { token } = await params;
  if (!tokenGueltig(token)) return new Response(null, { status: 404 });
  try {
    return new Response(null, { status: (await alsVerbundenMarkieren(token)) ? 204 : 404 });
  } catch {
    return new Response(null, { status: 502 });
  }
}
