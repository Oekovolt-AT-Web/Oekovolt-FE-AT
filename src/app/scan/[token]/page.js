import ScanApp from "@/components/Scan/ScanApp";
import { sitzungStatus, tokenGueltig } from "@/lib/scan/backend";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Unterlagen senden | Ökovolt",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export const viewport = { themeColor: "#03122b", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function ScanSeite({ params }) {
  const { token } = await params;
  const status = tokenGueltig(token) ? await sitzungStatus(token).catch(() => null) : null;
  return <ScanApp token={token} start={status} />;
}
