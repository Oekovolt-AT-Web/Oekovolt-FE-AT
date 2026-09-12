"use client";

import { useState, useEffect } from "react";

// Bump the version suffix to show the notice again to everyone who already
// dismissed it (e.g. if the wording or the addresses change).
const SEEN_KEY = "oekovolt_email_change_notice_v1";

const OLD_EMAIL = "office@oekovolt.com";
const NEW_EMAIL = "office@oekovolt.de";

// Static colors on purpose — this notice must look identical no matter what
// theme or CSS variables the surrounding page happens to be running.
const GREEN = "#669933";
const GREEN_DARK = "#669933";
const GREEN_HOVER = "#1A9A4F";
const WHITE = "#FFFFFF";
const TEXT = "#121721";
const TEXT_MUTED = "#5A6472";
const SURFACE = "#F3F5F7";
const BORDER = "#E3E7EC";

function wasDismissed() {
    try {
        return localStorage.getItem(SEEN_KEY) !== null;
    } catch {
        return false;
    }
}

function markDismissed() {
    try {
        localStorage.setItem(SEEN_KEY, JSON.stringify({ dismissedAt: new Date().toISOString() }));
    } catch {
        // ignore — private browsing / storage full / storage disabled
    }
}

// German-only notice about the change of our contact address. Shown once per
// browser and remembered in localStorage, the same way the cookie banner and
// the offer modal remember their state.
export default function EmailChangeNotice() {
    const [mounted, setMounted] = useState(false);
    const [shown, setShown] = useState(false);
    const [copied, setCopied] = useState(false);

    // Staggered after CookieConsent (800ms) and OfferModal (1400ms) so the
    // three don't animate in on top of each other.
    useEffect(() => {
        if (wasDismissed()) return;
        const timer = setTimeout(() => setMounted(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Lets any page reopen the notice on demand, bypassing the dismissed check.
    useEffect(() => {
        const reopen = () => setMounted(true);
        window.addEventListener("emailChangeNoticeOpen", reopen);
        return () => window.removeEventListener("emailChangeNoticeOpen", reopen);
    }, []);

    // Flip to the visible state one frame after mounting so the CSS transition
    // has a "from" value to animate away from.
    useEffect(() => {
        if (!mounted) return;
        const raf = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(raf);
    }, [mounted]);

    const close = () => {
        markDismissed();
        setShown(false);
        setTimeout(() => setMounted(false), 220);
    };

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(NEW_EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard blocked — the address is visible on screen anyway
        }
    };

    if (!mounted) return null;

    return (
        <>
            {/* Scoped so hover states work without pulling in any CSS framework. */}
            <style>{`
        .ovn-overlay {
          position: fixed;
          inset: 0;
          z-index: 9997;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          opacity: 0;
          transition: opacity 200ms ease;
        }
        .ovn-overlay[data-shown="true"] { opacity: 1; }

        .ovn-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          overflow: hidden;
          background: ${WHITE};
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          transform: scale(0.92) translateY(24px);
          opacity: 0;
          transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease;
        }
        .ovn-overlay[data-shown="true"] .ovn-card {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .ovn-close {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 9999px;
          cursor: pointer;
          color: ${WHITE};
          background: rgba(255, 255, 255, 0.2);
          transition: background 150ms ease;
        }
        .ovn-close:hover { background: rgba(255, 255, 255, 0.35); }

        .ovn-header {
          padding: 24px;
          color: ${WHITE};
          background: linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%);
        }
        .ovn-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.2);
        }
        .ovn-title {
          margin: 0;
          font-size: 24px;
          line-height: 1.25;
          font-weight: 700;
        }

        .ovn-body { padding: 24px; }
        .ovn-text {
          margin: 0 0 16px;
          font-size: 15px;
          line-height: 1.65;
          color: ${TEXT_MUTED};
        }
        .ovn-old { text-decoration: line-through; }
        .ovn-new { color: ${TEXT}; font-weight: 600; }

        .ovn-copyrow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 24px;
          padding: 12px 16px;
          border: 1px solid ${BORDER};
          border-radius: 12px;
          background: ${SURFACE};
        }
        .ovn-copyrow span {
          font-size: 14px;
          font-weight: 500;
          color: ${TEXT};
          word-break: break-all;
        }
        .ovn-copybtn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          padding: 0;
          border: 0;
          background: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          color: ${GREEN};
        }
        .ovn-copybtn:hover { text-decoration: underline; }

        .ovn-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          height: 48px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          color: ${WHITE};
          background: ${GREEN};
          transition: background 150ms ease;
        }
        .ovn-cta:hover { background: ${GREEN_HOVER}; }

        .ovn-dismiss {
          display: block;
          width: 100%;
          margin-top: 12px;
          padding: 4px 0;
          border: 0;
          background: none;
          cursor: pointer;
          text-align: center;
          font-size: 14px;
          color: ${TEXT_MUTED};
          transition: color 150ms ease;
        }
        .ovn-dismiss:hover { color: ${TEXT}; }
      `}</style>

            <div
                className="ovn-overlay"
                data-shown={shown}
                onClick={close}
                role="dialog"
                aria-labelledby="email-change-title"
                aria-describedby="email-change-desc"
            >
                <div className="ovn-card" onClick={(e) => e.stopPropagation()}>
                    <button className="ovn-close" onClick={close} aria-label="Hinweis schließen">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="ovn-header">
                        <div className="ovn-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            Wichtiger Hinweis
                        </div>
                        <h3 id="email-change-title" className="ovn-title">
                            Unsere E-Mail-Adressen haben sich geändert
                        </h3>
                    </div>

                    <div className="ovn-body">
                        <p id="email-change-desc" className="ovn-text">
                            Bitte beachten Sie: Sämtliche E-Mail-Adressen der Ökovolt Österreich wurden von .com auf <strong className="ovn-new">.de</strong> umgestellt. Bitte aktualisieren Sie Ihre gespeicherten Kontakte entsprechend.
                        </p>

                        <a className="ovn-cta" href={`mailto:${NEW_EMAIL}`} onClick={close}>
                            Jetzt E-Mail schreiben
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>

                        <button className="ovn-dismiss" onClick={close}>
                            Verstanden
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
