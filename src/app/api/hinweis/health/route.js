import { NextResponse } from "next/server";
import { frappeHinweis, hinweisKonfiguriert, HEADERS_PRIVAT } from "@/lib/hinweisApi";

export const dynamic = "force-dynamic";

/**
 * Monitoring-Endpunkt für das Hinweisgebersystem (DSFA-Maßnahme R8).
 * 200 = Website konfiguriert und Backend inkl. DocType erreichbar, sonst 503.
 * Gibt keinerlei Daten über Fälle preis – geeignet für externe Uptime-Checks.
 */
export async function GET() {
  if (!hinweisKonfiguriert()) {
    return NextResponse.json({ ok: false, grund: "nicht_konfiguriert" }, { status: 503, headers: HEADERS_PRIVAT });
  }
  try {
    const r = await frappeHinweis("ping", {});
    const ok = Boolean(r?.ok && r?.doctype);
    return NextResponse.json({ ok, grund: ok ? undefined : "doctype_fehlt" }, { status: ok ? 200 : 503, headers: HEADERS_PRIVAT });
  } catch {
    return NextResponse.json({ ok: false, grund: "backend_nicht_erreichbar" }, { status: 503, headers: HEADERS_PRIVAT });
  }
}
