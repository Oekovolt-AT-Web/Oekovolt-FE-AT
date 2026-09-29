import { actorId, apBereit, kontoNach } from "@/lib/kanaele/activitypub";
import { HANDLE_DOMAIN } from "@/lib/kanaele/fediverseKonten";
import { BASE_URL } from "@/lib/kanaele/veroeffentlichungen";

export const dynamic = "force-dynamic";

/** WebFinger: /.well-known/webfinger?resource=acct:oekovolt@oekovolt.com */
export async function GET(request) {
  const resource = new URL(request.url).searchParams.get("resource") || "";
  let name = null;
  const acct = resource.match(/^acct:@?([a-z0-9_]+)@(.+)$/i);
  if (acct && [HANDLE_DOMAIN, `www.${HANDLE_DOMAIN}`].includes(acct[2].toLowerCase())) name = acct[1].toLowerCase();
  else if (resource.startsWith(`${BASE_URL}/api/ap/users/`)) name = resource.split("/").pop();

  const konto = name && kontoNach(name);
  if (!apBereit() || !konto) return new Response("Not found", { status: 404 });

  return Response.json(
    {
      subject: `acct:${name}@${HANDLE_DOMAIN}`,
      aliases: [actorId(name), `${BASE_URL}${konto.profilPfad}`],
      links: [
        { rel: "self", type: "application/activity+json", href: actorId(name) },
        { rel: "http://webfinger.net/rel/profile-page", type: "text/html", href: `${BASE_URL}${konto.profilPfad}` },
        { rel: "http://webfinger.net/rel/avatar", type: "image/png", href: `${BASE_URL}/logo-oekovolt.png` },
      ],
    },
    { headers: { "Content-Type": "application/jrd+json; charset=utf-8", "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } }
  );
}
