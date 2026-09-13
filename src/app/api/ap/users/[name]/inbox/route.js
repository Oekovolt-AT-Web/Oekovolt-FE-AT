import { inboxVerarbeiten, kontoNach } from "@/lib/kanaele/activitypub";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const { name } = await params;
  if (!kontoNach(name)) return new Response(null, { status: 404 });
  return new Response(null, { status: await inboxVerarbeiten(request, name) });
}
