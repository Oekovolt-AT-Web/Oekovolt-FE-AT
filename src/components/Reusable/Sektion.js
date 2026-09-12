/**
 * Abschnitts-Rahmen für die Startseite.
 *
 * Hintergrund: Gemessen lag der Weissraum zwischen den Abschnitten zwischen
 * 45 und 204 Pixeln – oben atmete die Seite, unten war sie gedrängt. Zugleich
 * standen alle Blöcke ab dem dritten auf derselben weissen Fläche, über mehr
 * als 4.000 Pixel ohne jede visuelle Zäsur.
 *
 * Der Wrapper löst beides, ohne in die Innenabstände der Komponenten
 * einzugreifen: Er setzt den Hintergrund und gleicht knappe Abstände über ein
 * zusätzliches Polster aus.
 *
 * @param {"hell"|"getoent"} ton   Hintergrund. Wechselnd eingesetzt ergibt
 *                                 das den Rhythmus, an dem das Auge die
 *                                 Gliederung der Seite ablesen kann.
 * @param {"keine"|"klein"|"gross"} polster  Zusätzlicher vertikaler Abstand
 *                                 für Abschnitte, die von sich aus zu eng sitzen.
 */
export default function Sektion({
  ton = "hell",
  polster = "keine",
  className = "",
  children,
}) {
  const hintergrund = ton === "getoent" ? "bg-[#f7f9f4]" : "bg-white";
  const abstand =
    polster === "gross" ? "py-10 md:py-14" : polster === "klein" ? "py-6 md:py-8" : "";

  return (
    <div className={`${hintergrund} ${abstand} ${className}`.trim()}>
      {children}
    </div>
  );
}
