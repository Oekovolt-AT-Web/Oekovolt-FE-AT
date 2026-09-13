import { inboxVerarbeiten } from "@/lib/kanaele/activitypub";

export const dynamic = "force-dynamic";

/** Shared Inbox für alle Konten. */
export async function POST(request) {
  return new Response(null, { status: await inboxVerarbeiten(request) });
}
