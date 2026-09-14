import { sitzungStatus, tokenGueltig } from "@/lib/scan/backend";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const PRIVAT = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

/**
 * Live-Status der Sitzung.
 *   GET …/status            → JSON (einmalig)
 *   GET …/status?stream=1   → Server-Sent Events, solange die Sitzung läuft (Desktop-Popup)
 * Frappe wird serverseitig alle 1,5 s gefragt; nur Änderungen gehen an den Browser.
 */
export async function GET(request, { params }) {
  const { token } = await params;
  if (!tokenGueltig(token)) return Response.json({ fehler: "ungueltig" }, { status: 404, headers: PRIVAT });

  const stream = new URL(request.url).searchParams.get("stream") === "1";
  if (!stream) {
    const s = await sitzungStatus(token).catch(() => null);
    return s ? Response.json(s, { headers: PRIVAT }) : Response.json({ fehler: "unbekannt" }, { status: 404, headers: PRIVAT });
  }

  const encoder = new TextEncoder();
  let beendet = false;
  request.signal.addEventListener("abort", () => (beendet = true));

  const body = new ReadableStream({
    async start(controller) {
      const senden = (event, daten) => controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(daten)}\n\n`));
      const start = Date.now();
      let letzter = "";
      let letzterPuls = Date.now();
      controller.enqueue(encoder.encode("retry: 3000\n\n"));

      while (!beendet && Date.now() - start < 280_000) {
        let s = null;
        try {
          s = await sitzungStatus(token);
        } catch {
          /* Backend kurz nicht erreichbar – beim nächsten Durchlauf erneut */
        }
        if (s) {
          const json = JSON.stringify(s);
          if (json !== letzter) {
            senden("status", s);
            letzter = json;
          }
          const kiFertig = !["wartet", "laeuft"].includes(s.ki?.status);
          if ((s.phase === "eingegangen" && kiFertig) || !s.gueltig) {
            senden("ende", { grund: s.gueltig ? "fertig" : "abgelaufen" });
            break;
          }
        } else if (Date.now() - start > 5000) {
          senden("ende", { grund: "unbekannt" });
          break;
        }
        if (Date.now() - letzterPuls > 15_000) {
          controller.enqueue(encoder.encode(": puls\n\n"));
          letzterPuls = Date.now();
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      try {
        controller.close();
      } catch {
        /* bereits geschlossen */
      }
    },
  });

  return new Response(body, {
    headers: { ...PRIVAT, "Content-Type": "text/event-stream; charset=utf-8", Connection: "keep-alive", "X-Accel-Buffering": "no" },
  });
}
