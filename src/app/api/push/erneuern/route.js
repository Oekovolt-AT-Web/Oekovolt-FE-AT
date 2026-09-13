import { kanal } from "@/lib/kanaele/frappe";
import { pushEndpointErlaubt } from "@/lib/kanaele/pushThemen";

export const dynamic = "force-dynamic";

/** Vom Service Worker bei „pushsubscriptionchange“: altes Abo durch neues ersetzen (Themen bleiben). */
export async function POST(request) {
  let e;
  try {
    e = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const neu = e?.neu;
  if (!pushEndpointErlaubt(e?.alt) || !pushEndpointErlaubt(neu?.endpoint) || !neu?.keys?.p256dh || !neu?.keys?.auth) {
    return Response.json({ ok: false }, { status: 400 });
  }
  try {
    await kanal("push_abo_ersetzen", { alt: e.alt, endpoint: neu.endpoint, p256dh: neu.keys.p256dh, auth: neu.keys.auth });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}
