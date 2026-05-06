"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";

// ============================================================
// SCALEPUBLISH — Alexey's Yedioth Demo
// Two-sided marketplace: AGENCY ↔ PUBLISHER
// Agency: select queries → match Yedioth sites → order
// Publisher (Yedioth): manage sites/sections/prices + inbox + tracking
// Cross-state via localStorage so toggle shows live updates
// ============================================================

// ── Theme ──
type Theme = {
  bg: string; cardBg: string; border: string; text: string; textSecondary: string; textMuted: string;
  headerBg: string; hoverBg: string; tableBg: string; tableHeaderBg: string; badgeBg: string;
  inputBg: string; barTrack: string; logoFill: string; logoStroke: string;
};
const LIGHT_THEME: Theme = {
  bg: "#FFFFFF", cardBg: "#FFFFFF", border: "#E5E5E5", text: "#0F172A", textSecondary: "#475569",
  textMuted: "#64748B", headerBg: "rgba(255,255,255,0.96)", hoverBg: "#FAFAFA",
  tableBg: "#FFFFFF", tableHeaderBg: "#FAFAFA", badgeBg: "#F9F9F9", inputBg: "#FFFFFF",
  barTrack: "#E5E5E5", logoFill: "#141414", logoStroke: "#ABABAB",
};
// DARK_THEME tuned 2026-05-06 (Alexei feedback): textSecondary + textMuted bumped lighter so
// labels and small text don't disappear on the #0D1117 bg. Big numbers always use `text` (#E6EDF3).
const DARK_THEME: Theme = {
  bg: "#0D1117", cardBg: "#161B22", border: "#30363D", text: "#E6EDF3", textSecondary: "#B0B8C2",
  textMuted: "#94A3B0", headerBg: "rgba(13,17,23,0.96)", hoverBg: "#1C2128",
  tableBg: "#161B22", tableHeaderBg: "#1C2128", badgeBg: "#1C2128", inputBg: "#0D1117",
  barTrack: "#30363D", logoFill: "#E6EDF3", logoStroke: "#484F58",
};

const BRAND_GREEN = "#10A37F";
const BRAND_AMBER = "#B45309";
// BRAND_BLUE was #1D4ED8 royal blue (Alexei feedback 2026-05-06: "blue doesn't fit GeoScale").
// Replaced with cyan-700 — distinctly cool, aligns with GeoScale name, plays well with green/amber.
// Usage: neutral info pills, in-progress status, target-URL link color.
const BRAND_BLUE = "#0891B2";

// ── SVG Icons ──
function IconSearch({ size = 14, color = "#A2A9B0" }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
}
function IconCheck({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;
}
function IconX({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>;
}
function IconPlus({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;
}
function IconEdit({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function IconTrash({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>;
}
function IconChevronDown({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>;
}
function IconChevronRight({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>;
}
function IconExternalLink({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>;
}
function IconInbox({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" /></svg>;
}
function IconClock({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
function IconShield({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function IconCart({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>;
}
function IconSparkle({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>;
}
function IconArrowRight({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}
function IconUsers({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;
}
function IconBuilding({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></svg>;
}
function IconChart({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>;
}
function IconBookmark({ size = 14, filled = false }: { size?: number; filled?: boolean }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>;
}
function IconRefresh({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>;
}
function IconInfo({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>;
}
function IconDownload({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>;
}

// ── Tooltip (hover/tap) ──
function Tip({ text, size = 13 }: { text: string; size?: number }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const open = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.top - 8, left: r.left + r.width / 2 });
    }
    setShow(true);
  };
  const close = () => setShow(false);
  return (
    <span ref={ref} style={{ display: "inline-flex", alignItems: "center", cursor: "help", color: "#A2A9B0" }} onMouseEnter={open} onMouseLeave={close} onClick={(e) => { e.stopPropagation(); show ? close() : open(); }}>
      <IconInfo size={size} />
      {show && (
        <div style={{ position: "fixed", top: pos.top, left: pos.left, transform: "translate(-50%, -100%)", background: "#1B1F23", color: "#fff", fontSize: 12, fontWeight: 400, lineHeight: 1.5, padding: "8px 11px", borderRadius: 6, whiteSpace: "normal", maxWidth: 260, zIndex: 99999, pointerEvents: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}>
          {text}
          <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 8, height: 8, background: "#1B1F23" }} />
        </div>
      )}
    </span>
  );
}

// GeoNote — annotation badge that explains why a given element contributes to GEO/SEO. Used inside
// the article preview so the demo audience can hover any element and see its strategic rationale.
// Renders nothing if `enabled` is false (toggleable via the article's "Show GEO annotations" switch).
// On mobile (touch), tap toggles the tooltip; on desktop, hover shows it.
function GeoNote({ text, enabled = true, label = "GEO" }: { text: string; enabled?: boolean; label?: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  // Close on outside click for mobile (so tap-to-show isn't sticky after the user moves on).
  useEffect(() => {
    if (!show) return;
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    return () => { document.removeEventListener("click", onDocClick); document.removeEventListener("touchstart", onDocClick); };
  }, [show]);
  if (!enabled) return null;
  const open = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.top - 10, left: r.left + r.width / 2 });
    }
    setShow(true);
  };
  const close = () => setShow(false);
  return (
    <span ref={ref} onMouseEnter={open} onMouseLeave={close} onClick={(e) => { e.stopPropagation(); show ? close() : open(); }} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", background: "#10A37F1F", color: "#047857", fontSize: 12, fontWeight: 700, borderRadius: 6, letterSpacing: 0.5, textTransform: "uppercase", border: "1.5px solid #10A37F", cursor: "help", verticalAlign: "middle", marginLeft: 6, lineHeight: 1.4, flexShrink: 0, boxShadow: "0 1px 3px rgba(16,163,127,0.2)" }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
      {label}
      {show && (
        <span style={{ position: "fixed", top: pos.top, left: Math.min(Math.max(pos.left, 180), (typeof window !== "undefined" ? window.innerWidth : 1200) - 180), transform: "translate(-50%, -100%)", background: "#0F172A", color: "#fff", fontSize: 13, fontWeight: 400, lineHeight: 1.55, padding: "12px 16px", borderRadius: 9, whiteSpace: "normal", maxWidth: 340, width: "max-content", zIndex: 99999, pointerEvents: "none", boxShadow: "0 12px 30px rgba(0,0,0,0.35)", textTransform: "none", letterSpacing: 0, textAlign: "left" }}>
          <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#10A37F", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Why this matters for GEO</span>
          {text}
          <span style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 10, height: 10, background: "#0F172A" }} />
        </span>
      )}
    </span>
  );
}

// ── Modal ──
function Modal({ open, onClose, title, children, theme, isMobile }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; theme: Theme; isMobile: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: isMobile ? 14 : 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: theme.cardBg, borderRadius: 14, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}>
        <div style={{ padding: isMobile ? "16px 18px" : "20px 24px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", padding: 4, display: "inline-flex" }}>
            <IconX size={16} />
          </button>
        </div>
        <div style={{ padding: isMobile ? "16px 18px" : "20px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

// ── Toast (transient feedback) ──
type ToastMsg = { id: string; text: string; kind: "success" | "info" | "warn" };
function ToastHost({ toasts, onDismiss }: { toasts: ToastMsg[]; onDismiss: (id: string) => void }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 99999, display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
      {toasts.map((t) => {
        const styles = t.kind === "success" ? { bg: "#047857", color: "#fff" } : t.kind === "warn" ? { bg: "#B45309", color: "#fff" } : { bg: "#1F2937", color: "#fff" };
        return (
          <div key={t.id} onClick={() => onDismiss(t.id)} style={{ background: styles.bg, color: styles.color, padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: "0 6px 20px rgba(0,0,0,0.15)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            {t.kind === "success" && <IconCheck size={14} />}
            {t.text}
          </div>
        );
      })}
    </div>
  );
}

// ── Logo Components ──
function GeoscaleLogo({ width = 150, theme }: { width?: number; theme: Theme }) {
  return (
    <div style={{ direction: "ltr", width }}>
      <svg width={width} height={width * 0.2} viewBox="0 0 510 102" fill="none">
        <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="13" fill="none" />
        <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
        <g fill={theme.logoFill}>
          <text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text>
        </g>
      </svg>
    </div>
  );
}
function GeoscaleLogoMark({ size = 32, theme }: { size?: number; theme: Theme }) {
  return (
    <svg width={size} height={size} viewBox="0 0 102 102" fill="none">
      <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="10" fill="none" />
      <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
    </svg>
  );
}

function DarkModeToggle({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  return (
    <button onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode" style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "inline-flex", alignItems: "center" }}>
      {darkMode ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6EDF3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#727272" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
      )}
    </button>
  );
}

// ── Favicon ──
function Favicon({ domain, size = 22 }: { domain: string; size?: number }) {
  return <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" width={size} height={size} style={{ width: size, height: size, borderRadius: 4, flexShrink: 0, objectFit: "contain", background: "#fff", border: "1px solid #F0F0F0" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />;
}

// ── Currency ──
function fmtNIS(n: number): string {
  return `₪${n.toLocaleString("en-US")}`;
}
function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}

// ============================================================
// DATA MODELS
// ============================================================

type SectionCategory = "News" | "Cars" | "Sports" | "Finance" | "Tech" | "Health" | "Travel" | "Lifestyle" | "Food" | "Parents" | "Real Estate" | "Entertainment" | "Local" | "Insurance" | "Career" | "Fashion";
type AudienceTag = "B2C" | "B2B" | "Parents" | "Tech-savvy" | "Affluent" | "Decision-makers" | "Young adults" | "Mass market" | "Local" | "Wealthy" | "Investors" | "Drivers" | "Athletes" | "Travelers";

type PublisherSection = {
  id: string;
  siteId: string;
  name: string;       // English
  hebrewName: string; // Hebrew
  category: SectionCategory;
  audience: AudienceTag[];
  pricePerArticle: number; // ILS
  estimatedUploadDays: number;
  monthlyReadership: number;
};

type PublisherSite = {
  id: string;
  domain: string;
  name: string;
  hebrewName: string;
  description: string;
  parentGroup: string;
  monthlyTraffic: number;
  dr: number;
};

type Order = {
  id: string;
  createdAt: string;
  agencyName: string;
  agencyContact: string;
  brand: string;
  brandDomain: string;
  queries: string[];
  title: string;
  contentMode: "empty" | "generate";
  sections: { sectionId: string; siteId: string; price: number }[];
  totalPrice: number;
  status: "pending" | "approved" | "in_progress" | "published" | "rejected";
  publishedUrls?: { sectionId: string; url: string; publishedAt: string }[];
  // Publisher counter-offer: when Yedioth wants to renegotiate, they edit per-section prices and
  // optionally add a note. Agency sees the badge + revised total + note in their orders view.
  counterOffer?: { adjustedSections: { sectionId: string; price: number }[]; adjustedTotal: number; note?: string; sentAt: string };
  // Backlink (Alexei 2026-05-05): every article ALWAYS carries a do-follow link. Agency specifies
  // target URL + anchor text. If left blank, defaults to brand homepage with "click here" anchor.
  // No premium — this is standard, not an upsell.
  backlink?: { targetUrl: string; anchorText: string };
  // Payment method: cash (invoice) or credits (article-bank prepaid). Hybrid splits across both
  // when the cart total exceeds the available credit balance.
  payment?: { method: "cash" | "credits" | "hybrid"; creditsUsed: number; cashAmount: number };
  // Agency-to-client share: when the agency clicks "Share with client" on an order, we mint a
  // shareId that becomes a deep-link URL. The client opens it and sees a clean review surface
  // (article preview + sections + total). Their decision (approve / request changes) plus any
  // comment thread is stored back here so the agency sees it in the same OrderCard.
  clientShare?: {
    shareId: string;
    sharedAt: string;
    clientName: string;
    clientEmail: string;
    message?: string;
    status: "pending_review" | "approved" | "changes_requested";
    decidedAt?: string;
    comments: { id: string; from: "agency" | "client"; author: string; text: string; at: string }[];
  };
};

type ArticleTracking = {
  orderId: string;
  sectionId: string;
  url: string;
  publishedAt: string;
  crawled: boolean;
  indexedGoogle: boolean;
  citedGPT: boolean;
  citedGemini: boolean;
  citedPerplexity: boolean;
  rankedQueries: { query: string; engine: "gpt" | "gemini" | "perplexity"; rank: number }[];
  views: number;
  impactScore: number;
};

// Article-bank top-up request (Alexei 2026-05-06): publishers sell the bank manually — they
// arrange in meetings, agency pays via wire/invoice (not credit card). The agency uses this
// "Request top-up" entry as a paper-trail. Publisher then either fulfills (sets credits to a
// new value) or marks the request rejected. They can also adjust an agency's balance manually
// without an inbound request.
type TopUpRequest = {
  id: string;
  agencyName: string;
  requestedCredits: number;
  note?: string;
  requestedAt: string;
  status: "pending" | "fulfilled" | "rejected";
  fulfilledAt?: string;
  fulfilledCredits?: number; // What the publisher actually granted (may differ from request).
};

type CreditLedgerEntry = {
  id: string;
  at: string;
  delta: number; // Positive = top-up, negative = order debit.
  reason: string; // Free-text label visible in history.
  by: "publisher" | "system";
};

// ============================================================
// SEED DATA — Yedioth Ahronoth Group
// ============================================================

const YEDIOTH_SITES: PublisherSite[] = [
  { id: "ynet", domain: "ynet.co.il", name: "Ynet", hebrewName: "Ynet ידיעות אחרונות", description: "Israel's #1 news portal", parentGroup: "Yedioth Ahronoth Group", monthlyTraffic: 42000000, dr: 91 },
  { id: "calcalist", domain: "calcalist.co.il", name: "Calcalist", hebrewName: "כלכליסט", description: "Leading Israeli business daily", parentGroup: "Yedioth Ahronoth Group", monthlyTraffic: 11500000, dr: 84 },
  { id: "sport5", domain: "sport5.co.il", name: "Sport5", hebrewName: "ספורט 5", description: "Israel's top sports network", parentGroup: "Yedioth Ahronoth Group", monthlyTraffic: 9800000, dr: 78 },
  { id: "mynet", domain: "mynet.co.il", name: "Mynet", hebrewName: "Mynet מקומון", description: "Hyper-local Israeli news", parentGroup: "Yedioth Ahronoth Group", monthlyTraffic: 6400000, dr: 72 },
  { id: "pplus", domain: "pplus.co.il", name: "Pnai Plus", hebrewName: "פנאי פלוס", description: "Entertainment & celebrities", parentGroup: "Yedioth Ahronoth Group", monthlyTraffic: 3200000, dr: 68 },
  { id: "vib", domain: "vib.co.il", name: "Vi.B", hebrewName: "Vi.B חתונות", description: "Wedding planning portal", parentGroup: "Yedioth Ahronoth Group", monthlyTraffic: 1800000, dr: 58 },
  { id: "lady", domain: "lady.co.il", name: "Lady", hebrewName: "ליידי", description: "Women's lifestyle magazine", parentGroup: "Yedioth Ahronoth Group", monthlyTraffic: 2100000, dr: 62 },
  { id: "ybiz", domain: "ynet.co.il/economy", name: "Ynet Business", hebrewName: "Ynet כלכלה", description: "Ynet's business vertical", parentGroup: "Yedioth Ahronoth Group", monthlyTraffic: 5400000, dr: 86 },
];

const YEDIOTH_SECTIONS: PublisherSection[] = [
  // Ynet sections
  { id: "ynet-cars", siteId: "ynet", name: "Cars", hebrewName: "רכב", category: "Cars", audience: ["B2C", "Drivers", "Mass market"], pricePerArticle: 7500, estimatedUploadDays: 3, monthlyReadership: 2800000 },
  { id: "ynet-sports", siteId: "ynet", name: "Sports", hebrewName: "ספורט", category: "Sports", audience: ["B2C", "Athletes", "Mass market"], pricePerArticle: 6800, estimatedUploadDays: 3, monthlyReadership: 4200000 },
  { id: "ynet-health", siteId: "ynet", name: "Health", hebrewName: "בריאות", category: "Health", audience: ["B2C", "Parents", "Mass market"], pricePerArticle: 8200, estimatedUploadDays: 3, monthlyReadership: 3100000 },
  { id: "ynet-tech", siteId: "ynet", name: "Digital", hebrewName: "דיגיטל", category: "Tech", audience: ["B2C", "Tech-savvy", "Young adults"], pricePerArticle: 7800, estimatedUploadDays: 3, monthlyReadership: 2400000 },
  { id: "ynet-travel", siteId: "ynet", name: "Travel", hebrewName: "תיירות", category: "Travel", audience: ["B2C", "Travelers", "Affluent"], pricePerArticle: 6500, estimatedUploadDays: 3, monthlyReadership: 1900000 },
  { id: "ynet-parents", siteId: "ynet", name: "Parents", hebrewName: "הורים וילדים", category: "Parents", audience: ["B2C", "Parents"], pricePerArticle: 7200, estimatedUploadDays: 3, monthlyReadership: 2200000 },
  { id: "ynet-food", siteId: "ynet", name: "Food", hebrewName: "אוכל", category: "Food", audience: ["B2C", "Mass market"], pricePerArticle: 6200, estimatedUploadDays: 3, monthlyReadership: 1700000 },

  // Ynet Business
  { id: "ybiz-banking", siteId: "ybiz", name: "Banking", hebrewName: "בנקאות", category: "Finance", audience: ["B2C", "B2B", "Decision-makers", "Affluent"], pricePerArticle: 9500, estimatedUploadDays: 3, monthlyReadership: 1400000 },
  { id: "ybiz-realestate", siteId: "ybiz", name: "Real Estate", hebrewName: "נדל״ן", category: "Real Estate", audience: ["B2C", "Affluent", "Decision-makers"], pricePerArticle: 8900, estimatedUploadDays: 3, monthlyReadership: 1600000 },
  { id: "ybiz-insurance", siteId: "ybiz", name: "Insurance", hebrewName: "ביטוח", category: "Insurance", audience: ["B2C", "B2B", "Decision-makers"], pricePerArticle: 8400, estimatedUploadDays: 3, monthlyReadership: 980000 },
  { id: "ybiz-stocks", siteId: "ybiz", name: "Capital Markets", hebrewName: "שוק ההון", category: "Finance", audience: ["B2B", "Investors", "Wealthy"], pricePerArticle: 9200, estimatedUploadDays: 3, monthlyReadership: 1100000 },

  // Calcalist
  { id: "calc-tech", siteId: "calcalist", name: "Tech", hebrewName: "הייטק", category: "Tech", audience: ["B2B", "Decision-makers", "Tech-savvy", "Investors"], pricePerArticle: 9800, estimatedUploadDays: 3, monthlyReadership: 2900000 },
  { id: "calc-realestate", siteId: "calcalist", name: "Real Estate", hebrewName: "נדל״ן", category: "Real Estate", audience: ["B2C", "Affluent", "Investors"], pricePerArticle: 8800, estimatedUploadDays: 3, monthlyReadership: 1800000 },
  { id: "calc-stocks", siteId: "calcalist", name: "Capital Markets", hebrewName: "שוק ההון", category: "Finance", audience: ["B2B", "Investors", "Wealthy"], pricePerArticle: 9600, estimatedUploadDays: 3, monthlyReadership: 1500000 },
  { id: "calc-career", siteId: "calcalist", name: "Career", hebrewName: "קריירה", category: "Career", audience: ["B2C", "Decision-makers"], pricePerArticle: 7400, estimatedUploadDays: 3, monthlyReadership: 920000 },
  { id: "calc-innovation", siteId: "calcalist", name: "Innovation", hebrewName: "חדשנות", category: "Tech", audience: ["B2B", "Decision-makers", "Investors"], pricePerArticle: 9100, estimatedUploadDays: 3, monthlyReadership: 1300000 },

  // Sport5
  { id: "sport5-football", siteId: "sport5", name: "Football", hebrewName: "כדורגל", category: "Sports", audience: ["B2C", "Athletes", "Mass market", "Young adults"], pricePerArticle: 6500, estimatedUploadDays: 3, monthlyReadership: 4400000 },
  { id: "sport5-basketball", siteId: "sport5", name: "Basketball", hebrewName: "כדורסל", category: "Sports", audience: ["B2C", "Athletes", "Young adults"], pricePerArticle: 5800, estimatedUploadDays: 3, monthlyReadership: 2100000 },
  { id: "sport5-tennis", siteId: "sport5", name: "Tennis", hebrewName: "טניס", category: "Sports", audience: ["B2C", "Athletes", "Affluent"], pricePerArticle: 5400, estimatedUploadDays: 3, monthlyReadership: 680000 },
  { id: "sport5-olympics", siteId: "sport5", name: "Olympics", hebrewName: "אולימפיאדה", category: "Sports", audience: ["B2C", "Athletes", "Mass market"], pricePerArticle: 5200, estimatedUploadDays: 3, monthlyReadership: 540000 },

  // Mynet
  { id: "mynet-tlv", siteId: "mynet", name: "Tel Aviv", hebrewName: "Mynet תל אביב", category: "Local", audience: ["B2C", "Local", "Young adults"], pricePerArticle: 4800, estimatedUploadDays: 3, monthlyReadership: 1800000 },
  { id: "mynet-jlm", siteId: "mynet", name: "Jerusalem", hebrewName: "Mynet ירושלים", category: "Local", audience: ["B2C", "Local"], pricePerArticle: 4400, estimatedUploadDays: 3, monthlyReadership: 1200000 },
  { id: "mynet-haifa", siteId: "mynet", name: "Haifa", hebrewName: "Mynet חיפה", category: "Local", audience: ["B2C", "Local"], pricePerArticle: 4200, estimatedUploadDays: 3, monthlyReadership: 980000 },
  { id: "mynet-sharon", siteId: "mynet", name: "Sharon", hebrewName: "Mynet שרון", category: "Local", audience: ["B2C", "Local", "Affluent"], pricePerArticle: 4600, estimatedUploadDays: 3, monthlyReadership: 1100000 },
  { id: "mynet-south", siteId: "mynet", name: "South", hebrewName: "Mynet דרום", category: "Local", audience: ["B2C", "Local"], pricePerArticle: 3800, estimatedUploadDays: 3, monthlyReadership: 720000 },

  // Pnai Plus
  { id: "pplus-tv", siteId: "pplus", name: "TV", hebrewName: "טלוויזיה", category: "Entertainment", audience: ["B2C", "Mass market", "Young adults"], pricePerArticle: 4500, estimatedUploadDays: 3, monthlyReadership: 1400000 },
  { id: "pplus-music", siteId: "pplus", name: "Music", hebrewName: "מוזיקה", category: "Entertainment", audience: ["B2C", "Young adults"], pricePerArticle: 3900, estimatedUploadDays: 3, monthlyReadership: 920000 },
  { id: "pplus-reality", siteId: "pplus", name: "Reality", hebrewName: "ריאליטי", category: "Entertainment", audience: ["B2C", "Mass market"], pricePerArticle: 4200, estimatedUploadDays: 3, monthlyReadership: 1100000 },

  // Vi.B
  { id: "vib-catering", siteId: "vib", name: "Catering", hebrewName: "קייטרינג", category: "Lifestyle", audience: ["B2C", "Affluent"], pricePerArticle: 3600, estimatedUploadDays: 3, monthlyReadership: 480000 },
  { id: "vib-halls", siteId: "vib", name: "Wedding Halls", hebrewName: "אולמות", category: "Lifestyle", audience: ["B2C", "Affluent"], pricePerArticle: 3800, estimatedUploadDays: 3, monthlyReadership: 540000 },

  // Lady
  { id: "lady-fashion", siteId: "lady", name: "Fashion", hebrewName: "אופנה", category: "Fashion", audience: ["B2C", "Young adults"], pricePerArticle: 4200, estimatedUploadDays: 3, monthlyReadership: 980000 },
  { id: "lady-beauty", siteId: "lady", name: "Beauty", hebrewName: "יופי", category: "Fashion", audience: ["B2C", "Young adults"], pricePerArticle: 4400, estimatedUploadDays: 3, monthlyReadership: 1100000 },
];

// ── DEMO BRAND (Bank Hapoalim) — Agency context ──
const DEMO_BRAND = {
  name: "Bank Hapoalim",
  domain: "bankhapoalim.co.il",
  agency: "Just In Time Agency",
  agencyContact: "media@justintime.co.il",
};

// ── BRAND PORTFOLIO — what shows in the top-right brand-context selector ──
// Per Inna call 2026-05-05: dropdown lists each brand the agency manages, ONE entry per brand
// (latest scan only — never duplicates). Selecting routes to that brand's ScalePublish context.
const BRAND_PORTFOLIO: { name: string; domain: string; lastScanDays: number; queries: number }[] = [
  { name: "Bank Hapoalim", domain: "bankhapoalim.co.il", lastScanDays: 2, queries: 87 },
  { name: "all4horses", domain: "all4horses.co.il", lastScanDays: 0, queries: 64 },
  { name: "TechStart Israel", domain: "techstart.co.il", lastScanDays: 6, queries: 112 },
  { name: "Paradise Gardening", domain: "paradise-gardening.co.il", lastScanDays: 3, queries: 49 },
  { name: "Artisan Bread Co", domain: "artisan-bread.co.il", lastScanDays: 9, queries: 38 },
];

// ── DEMO QUERIES from a Bank Hapoalim brand scan ──
const DEMO_QUERIES = [
  { id: "q1", text: "Best banking app in Israel 2026", category: "Tech", audience: ["Tech-savvy", "Young adults"], gpt: false, gemini: true, perplexity: false, opportunity: 94 },
  { id: "q2", text: "Mortgage rates comparison Israel", category: "Real Estate", audience: ["Affluent", "Decision-makers"], gpt: true, gemini: false, perplexity: false, opportunity: 91 },
  { id: "q3", text: "Why is Bank Hapoalim the best bank for businesses", category: "Finance", audience: ["B2B", "Decision-makers"], gpt: false, gemini: false, perplexity: false, opportunity: 88 },
  { id: "q4", text: "Investment funds for young families Israel", category: "Finance", audience: ["B2C", "Parents", "Affluent"], gpt: false, gemini: true, perplexity: false, opportunity: 86 },
  { id: "q5", text: "How to open business account in Israel", category: "Finance", audience: ["B2B", "Decision-makers"], gpt: true, gemini: true, perplexity: false, opportunity: 82 },
  { id: "q6", text: "Credit card for high earners Israel", category: "Finance", audience: ["Wealthy", "Affluent"], gpt: false, gemini: false, perplexity: false, opportunity: 79 },
  { id: "q7", text: "Bank Hapoalim AI assistant features", category: "Tech", audience: ["Tech-savvy", "Decision-makers"], gpt: false, gemini: false, perplexity: false, opportunity: 76 },
  { id: "q8", text: "Real estate financing Israel 2026", category: "Real Estate", audience: ["Affluent", "Investors"], gpt: true, gemini: false, perplexity: false, opportunity: 74 },
  { id: "q9", text: "Pension planning Israel best banks", category: "Finance", audience: ["Decision-makers", "Affluent"], gpt: false, gemini: true, perplexity: false, opportunity: 71 },
  { id: "q10", text: "Insurance products from Israeli banks", category: "Insurance", audience: ["B2C", "Decision-makers"], gpt: false, gemini: false, perplexity: false, opportunity: 68 },
  { id: "q11", text: "Israeli stock market investment tips", category: "Finance", audience: ["Investors", "Wealthy"], gpt: true, gemini: true, perplexity: false, opportunity: 65 },
  { id: "q12", text: "Bank fees comparison Israel", category: "Finance", audience: ["Mass market", "B2C"], gpt: false, gemini: true, perplexity: false, opportunity: 62 },
];

// ── INITIAL DEMO ORDER (so Publisher inbox is not empty) ──
const SEED_ORDERS: Order[] = [
  {
    id: "ord-001",
    createdAt: "2026-04-22T09:14:00",
    agencyName: "Aradin Media Group",
    agencyContact: "media@aradin.co.il",
    brand: "TechStart Israel",
    brandDomain: "techstart.co.il",
    queries: ["Best Israeli SaaS tools 2026", "Cloud platforms for Israeli startups", "AI tools for Israeli businesses"],
    title: "How Israeli SaaS startups are reshaping enterprise tech in 2026",
    contentMode: "generate",
    sections: [
      { sectionId: "calc-tech", siteId: "calcalist", price: 9800 },
      { sectionId: "calc-innovation", siteId: "calcalist", price: 9100 },
      { sectionId: "ynet-tech", siteId: "ynet", price: 7800 },
    ],
    totalPrice: 26700,
    status: "pending",
  },
];

const SEED_TRACKING: ArticleTracking[] = [
  {
    orderId: "ord-historic-1",
    sectionId: "calc-tech",
    url: "https://calcalist.co.il/tech/ai-banking-2026-leaders",
    publishedAt: "2026-04-12T11:00:00",
    crawled: true,
    indexedGoogle: true,
    citedGPT: true,
    citedGemini: true,
    citedPerplexity: false,
    rankedQueries: [
      { query: "Best banking app in Israel 2026", engine: "gpt", rank: 2 },
      { query: "Best banking app in Israel 2026", engine: "gemini", rank: 1 },
      { query: "Bank Hapoalim AI assistant features", engine: "gpt", rank: 3 },
    ],
    views: 24800,
    impactScore: 87,
  },
  {
    orderId: "ord-historic-2",
    sectionId: "ybiz-banking",
    url: "https://ynet.co.il/economy/banking/business-account-guide-2026",
    publishedAt: "2026-04-08T14:30:00",
    crawled: true,
    indexedGoogle: true,
    citedGPT: true,
    citedGemini: false,
    citedPerplexity: true,
    rankedQueries: [
      { query: "How to open business account in Israel", engine: "gpt", rank: 1 },
      { query: "How to open business account in Israel", engine: "perplexity", rank: 2 },
    ],
    views: 18200,
    impactScore: 79,
  },
];

// ============================================================
// SHARED STATE (localStorage) — Cross-view sync
// ============================================================

const LS_KEY_ORDERS = "geoscale-sp-orders";
const LS_KEY_PRICES = "geoscale-sp-prices";
const LS_KEY_TRACKING = "geoscale-sp-tracking";
const LS_KEY_USER_MODE = "geoscale-sp-user-mode";
const LS_KEY_SITES = "geoscale-sp-sites-v1";
const LS_KEY_SECTIONS = "geoscale-sp-sections-v1";
const LS_KEY_DELETED_SECTIONS = "geoscale-sp-deleted-sections";
const LS_KEY_CREDITS = "geoscale-sp-article-credits";
const LS_KEY_TOPUP_REQUESTS = "geoscale-sp-topup-requests";
const LS_KEY_CREDIT_LEDGER = "geoscale-sp-credit-ledger";

// ── ARTICLE BANK ("בנק כתבות") ──
// 1 credit = 1 article placement on any section. Balance is publisher-managed: Yedioth manually
// updates each agency's credits in admin (no credit-card checkout in this surface). See the
// `PublisherBankView` and `ArticleBankModal` (agency request form) below for the UI.

function loadFromLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function saveToLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

// ============================================================
// MATCHING ALGORITHM — Score Yedioth sections vs selected queries
// ============================================================

function calculateMatch(section: PublisherSection, queries: typeof DEMO_QUERIES, brand: { audience?: AudienceTag[] }): { score: number; reasons: { type: "audience" | "category" | "query"; label: string }[] } {
  let score = 0;
  const reasons: { type: "audience" | "category" | "query"; label: string }[] = [];

  // Audience match — biggest factor
  const brandAudience = brand.audience || ["B2C", "Decision-makers", "Affluent"];
  const audienceOverlap = section.audience.filter((a) => brandAudience.includes(a));
  if (audienceOverlap.length > 0) {
    score += audienceOverlap.length * 18;
    reasons.push({ type: "audience", label: `Audience: ${audienceOverlap.slice(0, 2).join(" + ")}` });
  }

  // Category match against queries
  const categoryHits = queries.filter((q) => q.category === section.category).length;
  if (categoryHits > 0) {
    score += categoryHits * 22;
    reasons.push({ type: "category", label: `Category: ${section.category}` });
  }

  // Query intent direct match (count audience overlap with query audience)
  let queryHits = 0;
  for (const q of queries) {
    const overlap = section.audience.filter((a) => q.audience.includes(a as AudienceTag));
    if (overlap.length >= 2) queryHits++;
  }
  if (queryHits > 0) {
    score += queryHits * 12;
    reasons.push({ type: "query", label: `${queryHits}/${queries.length} queries match intent` });
  }

  // Cap at 100
  score = Math.min(100, score);
  return { score, reasons };
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function ScalePublishPage() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("geoscale-dark-mode") === "true";
    return false;
  });
  useEffect(() => {
    localStorage.setItem("geoscale-dark-mode", darkMode.toString());
  }, [darkMode]);
  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, []);

  // ── User mode toggle ──
  const [userMode, setUserMode] = useState<"agency" | "publisher">("agency");
  useEffect(() => {
    const saved = loadFromLS<"agency" | "publisher">(LS_KEY_USER_MODE, "agency");
    setUserMode(saved);
  }, []);
  useEffect(() => {
    saveToLS(LS_KEY_USER_MODE, userMode);
  }, [userMode]);

  // ── Deep-link from /scan: ?source=domain.co.il&queryText=... or ?queries=<JSON-array> ──
  // When the agency clicks "Build article" on the /scan basket, we receive an array of queries
  // (id, text, persona, stage). We pre-select all of them and remember the source domain so we
  // can show a "From [domain] · Back to scan" breadcrumb.
  type DeepQuery = { id: string; text: string; persona?: string; stage?: string };
  const [scanSource, setScanSource] = useState<{ domain: string; brand?: string } | null>(null);
  const [deepLinkedQueries, setDeepLinkedQueries] = useState<DeepQuery[] | null>(null);
  const [deepLinkedQueryText, setDeepLinkedQueryText] = useState<string | null>(null);
  // Client-review deep-link: when the agency shares an order, the client opens this page with
  // ?clientShare=<shareId>. We swap the entire dashboard for a clean ClientReviewView.
  const [clientShareId, setClientShareId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const source = params.get("source");
    const queryText = params.get("queryText");
    const queriesParam = params.get("queries");
    const brand = params.get("brand") ?? undefined;
    if (source) {
      setScanSource({ domain: source, brand });
      setUserMode("agency");
    }
    if (queriesParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(queriesParam)) as DeepQuery[];
        if (Array.isArray(parsed) && parsed.length) {
          setDeepLinkedQueries(parsed);
          setUserMode("agency");
        }
      } catch { /* ignore malformed param */ }
    }
    if (queryText) {
      setDeepLinkedQueryText(queryText);
      setUserMode("agency");
    }
    const cs = params.get("clientShare");
    if (cs) setClientShareId(cs);
  }, []);

  // ── Cross-view shared state ──
  const [orders, setOrders] = useState<Order[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [tracking, setTracking] = useState<ArticleTracking[]>([]);
  const [sites, setSites] = useState<PublisherSite[]>(YEDIOTH_SITES);
  const [sections, setSections] = useState<PublisherSection[]>(YEDIOTH_SECTIONS);
  // Article-bank credit balance (agency only). Publisher-managed: only the publisher can grant
  // credits. Demo seed: 8 credits so "pay with credits" is demo-able without first asking the
  // publisher to top up. Persisted per-browser.
  const [articleCredits, setArticleCredits] = useState<number>(8);
  const [topUpRequests, setTopUpRequests] = useState<TopUpRequest[]>([]);
  const [creditLedger, setCreditLedger] = useState<CreditLedgerEntry[]>([]);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setOrders(loadFromLS<Order[]>(LS_KEY_ORDERS, SEED_ORDERS));
    setPrices(loadFromLS<Record<string, number>>(LS_KEY_PRICES, {}));
    setTracking(loadFromLS<ArticleTracking[]>(LS_KEY_TRACKING, SEED_TRACKING));
    setSites(loadFromLS<PublisherSite[]>(LS_KEY_SITES, YEDIOTH_SITES));
    setSections(loadFromLS<PublisherSection[]>(LS_KEY_SECTIONS, YEDIOTH_SECTIONS));
    setTopUpRequests(loadFromLS<TopUpRequest[]>(LS_KEY_TOPUP_REQUESTS, []));
    setCreditLedger(loadFromLS<CreditLedgerEntry[]>(LS_KEY_CREDIT_LEDGER, [
      { id: "ledger-seed-1", at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), delta: 8, reason: "Initial onboarding grant — manually added by Yedioth team", by: "publisher" },
    ]));
    setArticleCredits(loadFromLS<number>(LS_KEY_CREDITS, 8));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_ORDERS, orders); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_PRICES, prices); }, [prices, hydrated]);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_TRACKING, tracking); }, [tracking, hydrated]);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_SITES, sites); }, [sites, hydrated]);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_SECTIONS, sections); }, [sections, hydrated]);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_CREDITS, articleCredits); }, [articleCredits, hydrated]);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_TOPUP_REQUESTS, topUpRequests); }, [topUpRequests, hydrated]);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_CREDIT_LEDGER, creditLedger); }, [creditLedger, hydrated]);

  // ── Effective price (overrides + base) ──
  const getPrice = useCallback((section: PublisherSection) => prices[section.id] ?? section.pricePerArticle, [prices]);

  // ── Toasts ──
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const showToast = useCallback((text: string, kind: "success" | "info" | "warn" = "success") => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  // Effective brand: when entering from a /scan deep-link, the agency is acting for THAT brand
  // (e.g. all4horses), not the canned DEMO_BRAND (Bank Hapoalim). This drives every label, title
  // suggestion, order metadata, and article-preview body text in the agency view.
  const effectiveBrand = useMemo(() => {
    if (scanSource) {
      return {
        name: scanSource.brand ?? scanSource.domain,
        domain: scanSource.domain,
        agency: DEMO_BRAND.agency,
        agencyContact: DEMO_BRAND.agencyContact,
      };
    }
    return DEMO_BRAND;
  }, [scanSource]);

  // ── Client-review takeover ──
  // When the agency shared this order with their client, the client opens ?clientShare=<id>.
  // We swap the agency/publisher dashboard for a clean, agency-branded review surface so the
  // client never sees Geoscale internals.
  if (clientShareId && hydrated) {
    const sharedOrder = orders.find((o) => o.clientShare?.shareId === clientShareId) ?? null;
    return (
      <ClientReviewView
        order={sharedOrder}
        orders={orders}
        setOrders={setOrders}
        sites={sites}
        sections={sections}
        theme={theme}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isMobile={isMobile}
        showToast={showToast}
        toasts={toasts}
        dismissToast={dismissToast}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', 'Heebo', sans-serif", color: theme.text }} dir="ltr">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50" style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px", height: isMobile ? 60 : 72, display: isMobile ? "flex" : "grid", gridTemplateColumns: isMobile ? undefined : "1fr auto 1fr", alignItems: "center", justifyContent: isMobile ? "space-between" : undefined }}>
          {isMobile ? (
            <>
              <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: theme.text }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
                </svg>
              </button>
              <GeoscaleLogoMark size={32} theme={theme} />
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </>
          ) : (
            <>
              <div style={{ justifySelf: "start" }}><GeoscaleLogo width={150} theme={theme} /></div>
              <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <a href="/" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Dashboard</a>
                {/* Publishers don't manage scans — hide the link in publisher mode (per call with Inna 2026-05-05). */}
                {userMode !== "publisher" && (
                  <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
                )}
                <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 600, color: theme.text, textDecoration: "none" }}>ScalePublish</a>
                <a href="/scale-publish-roadmap" style={{ fontSize: 15, fontWeight: 500, color: BRAND_GREEN, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: BRAND_GREEN }} />
                  Spec for Inna
                </a>
                <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
                <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Roadmap</a>
              </nav>
              <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "end" }}>
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 15, fontWeight: 600, borderRadius: 9, border: `1px solid ${darkMode ? "#E6EDF3" : "#000"}`, textDecoration: "none" }}>New Scan</a>
              </div>
            </>
          )}
        </div>
        {isMobile && menuOpen && (
          <div style={{ background: theme.cardBg, borderBottom: `1px solid ${theme.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            <a href="/" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Dashboard</a>
            {userMode !== "publisher" && (
              <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Scans</a>
            )}
            <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 600, color: theme.text, textDecoration: "none", padding: "8px 0" }}>ScalePublish</a>
            <a href="/scale-publish-roadmap" style={{ fontSize: 15, fontWeight: 500, color: BRAND_GREEN, textDecoration: "none", padding: "8px 0" }}>● Spec for Inna</a>
            <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Content Editor</a>
            <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Roadmap</a>
          </div>
        )}
      </header>

      {/* ── User Mode Switcher ── */}
      <UserModeSwitcher userMode={userMode} setUserMode={setUserMode} theme={theme} darkMode={darkMode} isMobile={isMobile} pendingOrderCount={orders.filter((o) => o.status === "pending").length} effectiveBrand={effectiveBrand} articleCredits={articleCredits} onOpenBank={() => setBankModalOpen(true)} />

      {/* ── Body ── */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: isMobile ? "20px 12px 80px" : "32px 24px 80px", width: "100%", boxSizing: "border-box" }}>
        {userMode === "publisher" ? (
          <PublisherDashboard
            theme={theme}
            isMobile={isMobile}
            orders={orders}
            setOrders={setOrders}
            prices={prices}
            setPrices={setPrices}
            tracking={tracking}
            setTracking={setTracking}
            getPrice={getPrice}
            sites={sites}
            setSites={setSites}
            sections={sections}
            setSections={setSections}
            showToast={showToast}
            articleCredits={articleCredits}
            setArticleCredits={setArticleCredits}
            topUpRequests={topUpRequests}
            setTopUpRequests={setTopUpRequests}
            creditLedger={creditLedger}
            setCreditLedger={setCreditLedger}
            agencyName={effectiveBrand.agency}
          />
        ) : (
          <AgencyDashboard
            theme={theme}
            isMobile={isMobile}
            orders={orders}
            setOrders={setOrders}
            tracking={tracking}
            getPrice={getPrice}
            sites={sites}
            sections={sections}
            showToast={showToast}
            scanSource={scanSource}
            effectiveBrand={effectiveBrand}
            deepLinkedQueryText={deepLinkedQueryText}
            deepLinkedQueries={deepLinkedQueries}
            clearDeepLink={() => { setDeepLinkedQueryText(null); setDeepLinkedQueries(null); }}
            articleCredits={articleCredits}
            setArticleCredits={setArticleCredits}
            onOpenBank={() => setBankModalOpen(true)}
            setCreditLedger={setCreditLedger}
          />
        )}
      </div>

      {bankModalOpen && (
        <ArticleBankModal
          open={bankModalOpen}
          onClose={() => setBankModalOpen(false)}
          theme={theme}
          isMobile={isMobile}
          currentCredits={articleCredits}
          ledger={creditLedger}
          topUpRequests={topUpRequests}
          agencyName={effectiveBrand.agency}
          onSubmitRequest={(req) => {
            const id = `topup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            setTopUpRequests((prev) => [{ id, agencyName: effectiveBrand.agency, requestedCredits: req.credits, note: req.note, requestedAt: new Date().toISOString(), status: "pending" }, ...prev]);
            showToast(`Top-up request sent to Yedioth — ${req.credits} credits`, "success");
            setBankModalOpen(false);
          }}
        />
      )}

      <ToastHost toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// ============================================================
// USER MODE SWITCHER (Agency / Publisher)
// ============================================================

function UserModeSwitcher({ userMode, setUserMode, theme, darkMode, isMobile, pendingOrderCount, effectiveBrand, articleCredits, onOpenBank }: { userMode: "agency" | "publisher"; setUserMode: (v: "agency" | "publisher") => void; theme: Theme; darkMode: boolean; isMobile: boolean; pendingOrderCount: number; effectiveBrand: typeof DEMO_BRAND; articleCredits: number; onOpenBank: () => void }) {
  const isAgency = userMode === "agency";
  const userInfo = isAgency
    ? { name: effectiveBrand.agency, role: `Agency · Acting for: ${effectiveBrand.name}`, icon: <IconUsers size={16} /> }
    : { name: "Yedioth Ahronoth Group", role: "Publisher · 8 sites · 30 sections", icon: <IconBuilding size={16} /> };

  return (
    <div style={{ background: darkMode ? "#0F1217" : "#FAFBFC", borderBottom: `1px solid ${theme.border}`, padding: isMobile ? "16px" : "20px 24px" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: isAgency ? `${BRAND_GREEN}15` : `${BRAND_AMBER}15`, color: isAgency ? BRAND_GREEN : BRAND_AMBER, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {userInfo.icon}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 2 }}>Logged in as</div>
            <div style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>{userInfo.name}</div>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>{userInfo.role}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {/* Article-bank credit widget — agency only. Click = open balance + top-up request modal. */}
          {isAgency && (
            <button onClick={onOpenBank} title="Article bank · publisher-managed balance" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: isMobile ? "8px 12px" : "8px 14px", background: theme.cardBg, border: `1px solid ${articleCredits > 0 ? `${BRAND_GREEN}50` : theme.border}`, borderRadius: 10, cursor: "pointer", color: theme.text }}>
              <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: theme.textSecondary, letterSpacing: 1, textTransform: "uppercase" }}>Article bank</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: articleCredits > 0 ? theme.text : theme.text, fontVariantNumeric: "tabular-nums" }}>
                  <span style={{ color: articleCredits > 0 ? BRAND_GREEN : theme.text, fontWeight: 700 }}>{articleCredits}</span> {articleCredits === 1 ? "credit" : "credits"}
                  <span style={{ fontSize: 12, fontWeight: 500, color: theme.textSecondary, marginLeft: 8 }}>Request top-up</span>
                </div>
              </div>
            </button>
          )}
          {/* Brand-context selector — agency only. Lists each managed brand with LATEST scan only. */}
          {isAgency && <BrandContextSelector currentBrand={effectiveBrand} theme={theme} isMobile={isMobile} />}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 4, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10 }}>
            <button onClick={() => setUserMode("agency")} style={{ padding: isMobile ? "8px 14px" : "8px 18px", fontSize: 13, fontWeight: 600, color: isAgency ? "#fff" : theme.textSecondary, background: isAgency ? BRAND_GREEN : "transparent", border: "none", borderRadius: 7, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IconUsers size={13} /> Agency View
            </button>
            <button onClick={() => setUserMode("publisher")} style={{ padding: isMobile ? "8px 14px" : "8px 18px", fontSize: 13, fontWeight: 600, color: !isAgency ? "#fff" : theme.textSecondary, background: !isAgency ? BRAND_AMBER : "transparent", border: "none", borderRadius: 7, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, position: "relative" }}>
              <IconBuilding size={13} /> Publisher View
              {pendingOrderCount > 0 && userMode === "agency" && (
                <span style={{ position: "absolute", top: -4, right: -4, background: "#DC2626", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 8, minWidth: 16, textAlign: "center" }}>{pendingOrderCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandContextSelector({ currentBrand, theme, isMobile }: { currentBrand: typeof DEMO_BRAND; theme: Theme; isMobile: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const switchBrand = (b: typeof BRAND_PORTFOLIO[number]) => {
    if (typeof window === "undefined") return;
    const url = `/scale-publish?source=${encodeURIComponent(b.domain)}&brand=${encodeURIComponent(b.name)}`;
    window.location.href = url;
  };

  const fmtAge = (days: number) => days === 0 ? "today" : days === 1 ? "yesterday" : `${days}d ago`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: isMobile ? "8px 12px" : "8px 14px", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10, cursor: "pointer", color: theme.text }}>
        <Favicon domain={currentBrand.domain} size={18} />
        <div style={{ textAlign: "left", lineHeight: 1.2 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Brand</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: theme.text }}>{currentBrand.name}</div>
        </div>
        <span style={{ marginLeft: 6, color: theme.textMuted, fontSize: 11 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, minWidth: 320, maxWidth: "92vw", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.15)", padding: 8, zIndex: 60, maxHeight: 460, overflowY: "auto" }}>
          <div style={{ padding: "8px 10px 10px", borderBottom: `1px solid ${theme.border}`, marginBottom: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 2 }}>Switch brand</div>
            <div style={{ fontSize: 12, color: theme.textSecondary }}>Latest scan per brand · {BRAND_PORTFOLIO.length} brands managed</div>
          </div>
          {BRAND_PORTFOLIO.map((b) => {
            const active = b.domain === currentBrand.domain;
            return (
              <button key={b.domain} onClick={() => switchBrand(b)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", background: active ? `${BRAND_GREEN}10` : "transparent", border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left", color: theme.text }} onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = theme.tableHeaderBg; }} onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <Favicon domain={b.domain} size={22} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: theme.text }}>{b.name}</span>
                    {active && <span style={{ fontSize: 10, fontWeight: 700, color: BRAND_GREEN, padding: "1px 7px", background: `${BRAND_GREEN}20`, borderRadius: 999 }}>ACTIVE</span>}
                  </div>
                  <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 2 }}>{b.domain} · {b.queries} queries · scanned {fmtAge(b.lastScanDays)}</div>
                </div>
                {!active && <span style={{ color: theme.textMuted, fontSize: 11 }}>→</span>}
              </button>
            );
          })}
          <div style={{ padding: "8px 10px", borderTop: `1px solid ${theme.border}`, marginTop: 6 }}>
            <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: BRAND_GREEN, textDecoration: "none" }}>+ Add a new brand to scan</a>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PUBLISHER DASHBOARD
// ============================================================

type PublisherTab = "sites" | "inbox" | "articles" | "analytics" | "bank";

function PublisherDashboard({ theme, isMobile, orders, setOrders, prices, setPrices, tracking, setTracking, getPrice, sites, setSites, sections, setSections, showToast, articleCredits, setArticleCredits, topUpRequests, setTopUpRequests, creditLedger, setCreditLedger, agencyName }: { theme: Theme; isMobile: boolean; orders: Order[]; setOrders: (v: Order[]) => void; prices: Record<string, number>; setPrices: (v: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void; tracking: ArticleTracking[]; setTracking: (v: ArticleTracking[]) => void; getPrice: (s: PublisherSection) => number; sites: PublisherSite[]; setSites: (v: PublisherSite[]) => void; sections: PublisherSection[]; setSections: (v: PublisherSection[]) => void; showToast: (text: string, kind?: "success" | "info" | "warn") => void; articleCredits: number; setArticleCredits: React.Dispatch<React.SetStateAction<number>>; topUpRequests: TopUpRequest[]; setTopUpRequests: React.Dispatch<React.SetStateAction<TopUpRequest[]>>; creditLedger: CreditLedgerEntry[]; setCreditLedger: React.Dispatch<React.SetStateAction<CreditLedgerEntry[]>>; agencyName: string }) {
  const [tab, setTab] = useState<PublisherTab>("sites");
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const publishedCount = tracking.length + orders.filter((o) => o.status === "published").length;
  const pendingTopUps = topUpRequests.filter((r) => r.status === "pending").length;

  const TABS: { key: PublisherTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "sites", label: "Sites & Sections", icon: <IconBuilding size={14} /> },
    { key: "inbox", label: "Order Inbox", icon: <IconInbox size={14} />, badge: pendingCount },
    { key: "bank", label: "Article Bank", icon: <IconCart size={14} />, badge: pendingTopUps },
    { key: "articles", label: "Articles & Tracking", icon: <IconChart size={14} />, badge: publishedCount },
    { key: "analytics", label: "Analytics", icon: <IconChart size={14} /> },
  ];

  return (
    <>
      <SubTabs tabs={TABS} active={tab} onChange={(k) => setTab(k as PublisherTab)} theme={theme} isMobile={isMobile} />
      {tab === "sites" && <PublisherSitesView theme={theme} isMobile={isMobile} prices={prices} setPrices={setPrices} getPrice={getPrice} sites={sites} setSites={setSites} sections={sections} setSections={setSections} showToast={showToast} />}
      {tab === "inbox" && <PublisherInboxView theme={theme} isMobile={isMobile} orders={orders} setOrders={setOrders} sites={sites} sections={sections} showToast={showToast} />}
      {tab === "bank" && <PublisherBankView theme={theme} isMobile={isMobile} articleCredits={articleCredits} setArticleCredits={setArticleCredits} topUpRequests={topUpRequests} setTopUpRequests={setTopUpRequests} creditLedger={creditLedger} setCreditLedger={setCreditLedger} agencyName={agencyName} showToast={showToast} />}
      {tab === "articles" && <PublisherArticlesView theme={theme} isMobile={isMobile} tracking={tracking} setTracking={setTracking} sites={sites} sections={sections} showToast={showToast} />}
      {tab === "analytics" && <PublisherAnalyticsView theme={theme} isMobile={isMobile} orders={orders} tracking={tracking} getPrice={getPrice} sites={sites} sections={sections} />}
    </>
  );
}

// ── SUB TABS COMPONENT (shared) ──
function SubTabs<T extends string>({ tabs, active, onChange, theme, isMobile }: { tabs: { key: T; label: string; icon?: React.ReactNode; badge?: number }[]; active: T; onChange: (k: T) => void; theme: Theme; isMobile: boolean }) {
  return (
    <div style={{ borderBottom: `1px solid ${theme.border}`, marginBottom: 24, marginLeft: isMobile ? -12 : -24, marginRight: isMobile ? -12 : -24, marginTop: -32, paddingTop: 16 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: isMobile ? "0 12px" : "0 24px", display: "flex", alignItems: "center", gap: 0, overflowX: "auto", whiteSpace: "nowrap" }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => onChange(t.key)} style={{ padding: isMobile ? "10px 14px" : "12px 22px", fontSize: isMobile ? 13 : 14, fontWeight: active === t.key ? 600 : 500, color: active === t.key ? theme.text : theme.textSecondary, background: "none", border: "none", borderBottom: active === t.key ? `2px solid ${theme.text}` : "2px solid transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {t.icon}
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span style={{ background: active === t.key ? `${BRAND_GREEN}15` : `${theme.textMuted}30`, color: active === t.key ? BRAND_GREEN : theme.textSecondary, fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PUBLISHER · Sites & Sections
// ============================================================

function PublisherSitesView({ theme, isMobile, prices, setPrices, getPrice, sites, setSites, sections, setSections, showToast }: { theme: Theme; isMobile: boolean; prices: Record<string, number>; setPrices: (v: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void; getPrice: (s: PublisherSection) => number; sites: PublisherSite[]; setSites: (v: PublisherSite[]) => void; sections: PublisherSection[]; setSections: (v: PublisherSection[]) => void; showToast: (text: string, kind?: "success" | "info" | "warn") => void }) {
  const [search, setSearch] = useState("");
  const [expandedSites, setExpandedSites] = useState<Record<string, boolean>>(() => Object.fromEntries(sites.map((s) => [s.id, true])));
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");
  const [siteModalOpen, setSiteModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionModalSiteId, setSectionModalSiteId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ kind: "section"; id: string; label: string } | null>(null);

  const sectionsBySite = useMemo(() => {
    const map: Record<string, PublisherSection[]> = {};
    for (const sec of sections) {
      if (search) {
        const q = search.toLowerCase();
        if (!sec.name.toLowerCase().includes(q) && !sec.hebrewName.includes(search) && !sec.category.toLowerCase().includes(q)) continue;
      }
      if (!map[sec.siteId]) map[sec.siteId] = [];
      map[sec.siteId].push(sec);
    }
    return map;
  }, [search, sections]);

  const avgPrice = useMemo(() => {
    if (sections.length === 0) return 0;
    return Math.round(sections.reduce((s, sec) => s + getPrice(sec), 0) / sections.length);
  }, [getPrice, sections]);

  const toggleSite = (id: string) => setExpandedSites((p) => ({ ...p, [id]: !p[id] }));
  const startEditPrice = (section: PublisherSection) => { setEditingPriceId(section.id); setTempPrice(String(getPrice(section))); };
  const savePrice = (sectionId: string) => {
    const n = parseInt(tempPrice.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(n) && n > 0) {
      setPrices((prev) => ({ ...prev, [sectionId]: n }));
      showToast(`Price updated to ${fmtNIS(n)} — agencies see it live`, "success");
    }
    setEditingPriceId(null);
  };
  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
    setConfirmDelete(null);
    showToast("Section removed from inventory", "warn");
  };
  const addSite = (data: { domain: string; name: string; hebrewName: string; description: string }) => {
    const id = `site-${Date.now().toString(36)}`;
    const newSite: PublisherSite = { id, domain: data.domain, name: data.name, hebrewName: data.hebrewName, description: data.description, parentGroup: "Yedioth Ahronoth Group", monthlyTraffic: 500000, dr: 60 };
    setSites([...sites, newSite]);
    setExpandedSites((p) => ({ ...p, [id]: true }));
    setSiteModalOpen(false);
    showToast(`${data.name} added to inventory`, "success");
  };
  const addSection = (data: { siteId: string; name: string; hebrewName: string; category: SectionCategory; price: number }) => {
    const id = `sec-${Date.now().toString(36)}`;
    const newSection: PublisherSection = { id, siteId: data.siteId, name: data.name, hebrewName: data.hebrewName, category: data.category, audience: ["B2C", "Mass market"], pricePerArticle: data.price, estimatedUploadDays: 3, monthlyReadership: 600000 };
    setSections([...sections, newSection]);
    setSectionModalOpen(false);
    setSectionModalSiteId(null);
    const site = sites.find((s) => s.id === data.siteId);
    showToast(`Section "${data.name}" added to ${site?.name}`, "success");
  };

  return (
    <div>
      {/* Header banner */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_AMBER}10 0%, ${BRAND_AMBER}03 100%)`, border: `1px solid ${BRAND_AMBER}30`, borderRadius: 12, padding: isMobile ? 14 : 22, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_AMBER, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 4 }}>Publisher Inventory</div>
          <div style={{ fontSize: isMobile ? 17 : 22, fontWeight: 700, color: theme.text }}>Yedioth Ahronoth Group</div>
          <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4, lineHeight: 1.5 }}>Manage your sites, sections, and pricing. Changes propagate to agencies in real time.</div>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 14 : 24, flexWrap: "wrap" }}>
          <Stat label="Sites" value={String(sites.length)} theme={theme} tip="Total parent sites you publish on (e.g. Ynet, Calcalist, Sport5)." />
          <Stat label="Sections" value={String(sections.length)} theme={theme} tip="Sub-categories within your sites that an agency can target (e.g. Cars, Banking, Tech)." />
          <Stat label="Avg. price" value={fmtNIS(avgPrice)} theme={theme} tip="Mean price across all sections, including any manual overrides you've set." />
          <Stat label="Upload time" value="~3 days" theme={theme} tip="Estimated time from order acceptance to article going live, shown to agencies before they order." />
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: isMobile ? 0 : 240 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><IconSearch size={14} color={theme.textMuted} /></div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sites, sections, categories..." style={{ width: "100%", padding: "10px 14px 10px 38px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={() => setSiteModalOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, cursor: "pointer" }}>
          <IconPlus size={13} /> Add Site
        </button>
        <button onClick={() => { setSectionModalSiteId(sites[0]?.id ?? null); setSectionModalOpen(true); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, background: BRAND_AMBER, color: "#fff", border: "none", borderRadius: 9, cursor: "pointer" }}>
          <IconPlus size={13} /> Add Section
        </button>
      </div>

      {/* Sites tree */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sites.map((site) => {
          const siteSections = sectionsBySite[site.id] || [];
          if (search && siteSections.length === 0) return null;
          const expanded = expandedSites[site.id];
          const siteRevenue = siteSections.reduce((s, sec) => s + getPrice(sec), 0);
          return (
            <div key={site.id} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => toggleSite(site.id)} style={{ width: "100%", padding: isMobile ? 12 : 18, background: "none", border: "none", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: isMobile ? 10 : 14 }}>
                <div style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0, color: theme.textSecondary }}>
                  <IconChevronRight size={14} />
                </div>
                <Favicon domain={site.domain} size={isMobile ? 22 : 28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: theme.text }}>{site.name}</span>
                    <span style={{ fontSize: 12, color: theme.textSecondary, direction: "rtl" }}>{site.hebrewName}</span>
                  </div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {site.domain}{!isMobile && <> · {fmtNum(site.monthlyTraffic)} monthly visits · DR {site.dr}</>}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600 }}>{siteSections.length} {isMobile ? "secs" : "SECTIONS"}</div>
                  <div style={{ fontSize: isMobile ? 12 : 13, color: theme.text, fontWeight: 600 }}>{fmtNIS(siteRevenue)}</div>
                </div>
              </button>
              {expanded && siteSections.length > 0 && (
                <div style={{ borderTop: `1px solid ${theme.border}`, background: theme.tableBg }}>
                  {siteSections.map((sec) => {
                    const isEditing = editingPriceId === sec.id;
                    const overridden = prices[sec.id] !== undefined;
                    return (
                      <div key={sec.id} style={{ padding: isMobile ? "12px 14px" : "14px 18px 14px 50px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 10 : 16, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
                        <div style={{ flex: 1, minWidth: 0, width: isMobile ? "100%" : "auto" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{sec.name}</span>
                            <span style={{ fontSize: 12, color: theme.textSecondary, direction: "rtl" }}>{sec.hebrewName}</span>
                            <Pill bg={`${BRAND_BLUE}15`} color={BRAND_BLUE}>{sec.category}</Pill>
                          </div>
                          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4, display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <span>{fmtNum(sec.monthlyReadership)} readers</span>
                            <span>·</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><IconClock size={11} /> ~{sec.estimatedUploadDays} days upload</span>
                          </div>
                          <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {sec.audience.map((a) => <Pill key={a} bg={`${theme.textMuted}20`} color={theme.textSecondary} small>{a}</Pill>)}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "space-between" : "flex-end" }}>
                          {isEditing ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <span style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 600 }}>₪</span>
                              <input value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} autoFocus onBlur={() => savePrice(sec.id)} onKeyDown={(e) => { if (e.key === "Enter") savePrice(sec.id); if (e.key === "Escape") setEditingPriceId(null); }} style={{ width: 90, padding: "6px 10px", fontSize: 14, fontWeight: 600, background: theme.inputBg, border: `1px solid ${BRAND_AMBER}`, borderRadius: 6, color: theme.text, outline: "none", textAlign: "right" }} />
                            </div>
                          ) : (
                            <button onClick={() => startEditPrice(sec)} title="Click to edit price" style={{ padding: "6px 12px", fontSize: 14, fontWeight: 700, background: overridden ? `${BRAND_AMBER}15` : "transparent", color: overridden ? BRAND_AMBER : theme.text, border: `1px solid ${overridden ? BRAND_AMBER : theme.border}`, borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, minWidth: 100, justifyContent: "flex-end" }}>
                              {fmtNIS(getPrice(sec))} <IconEdit size={11} />
                            </button>
                          )}
                          <button onClick={() => setConfirmDelete({ kind: "section", id: sec.id, label: `${site.name} · ${sec.name}` })} title="Delete section" style={{ padding: 8, background: "none", border: "none", color: theme.textMuted, cursor: "pointer", borderRadius: 6 }}>
                            <IconTrash size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ padding: isMobile ? "10px 14px" : "10px 18px 12px 50px" }}>
                    <button onClick={() => { setSectionModalSiteId(site.id); setSectionModalOpen(true); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, background: "none", border: `1px dashed ${theme.border}`, color: theme.textSecondary, borderRadius: 7, cursor: "pointer" }}>
                      <IconPlus size={12} /> Add section to {site.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Helper text */}
      <div style={{ marginTop: 24, padding: 14, background: `${BRAND_AMBER}08`, border: `1px solid ${BRAND_AMBER}25`, borderRadius: 9, fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>
        <strong style={{ color: BRAND_AMBER }}>Tip:</strong> Click any price to edit it. Changes propagate instantly to all agencies viewing this section. The estimated 3-day upload window is shown to agencies at order time.
      </div>

      {/* Modals */}
      <AddSiteModal open={siteModalOpen} onClose={() => setSiteModalOpen(false)} onSubmit={addSite} theme={theme} isMobile={isMobile} />
      <AddSectionModal open={sectionModalOpen} onClose={() => { setSectionModalOpen(false); setSectionModalSiteId(null); }} onSubmit={addSection} sites={sites} initialSiteId={sectionModalSiteId} theme={theme} isMobile={isMobile} />
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete section?" theme={theme} isMobile={isMobile}>
        <div style={{ fontSize: 14, color: theme.text, marginBottom: 16 }}>This will remove <strong>{confirmDelete?.label}</strong> from your inventory. Agencies will no longer see it as an option. This is reversible if you reset demo data.</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={() => setConfirmDelete(null)} style={{ padding: "9px 18px", fontSize: 13, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => confirmDelete && deleteSection(confirmDelete.id)} style={{ padding: "9px 18px", fontSize: 13, fontWeight: 700, background: "#DC2626", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}

// ── Add Site Modal ──
function AddSiteModal({ open, onClose, onSubmit, theme, isMobile }: { open: boolean; onClose: () => void; onSubmit: (d: { domain: string; name: string; hebrewName: string; description: string }) => void; theme: Theme; isMobile: boolean }) {
  const [name, setName] = useState("");
  const [hebrewName, setHebrewName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => { if (!open) { setName(""); setHebrewName(""); setDomain(""); setDescription(""); } }, [open]);
  const canSubmit = name.trim() && domain.trim();
  return (
    <Modal open={open} onClose={onClose} title="Add new site" theme={theme} isMobile={isMobile}>
      <FormField label="Site name (English)" theme={theme}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. iCar" autoFocus style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }} />
      </FormField>
      <FormField label="Site name (Hebrew)" theme={theme}>
        <input value={hebrewName} onChange={(e) => setHebrewName(e.target.value)} placeholder="לדוגמה: iCar רכב" dir="rtl" style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }} />
      </FormField>
      <FormField label="Domain" theme={theme}>
        <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. icar.co.il" style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }} />
      </FormField>
      <FormField label="Short description (optional)" theme={theme}>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="One-line description shown to agencies" style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }} />
      </FormField>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
        <button onClick={onClose} style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer" }}>Cancel</button>
        <button onClick={() => canSubmit && onSubmit({ name, hebrewName: hebrewName || name, domain, description })} disabled={!canSubmit} style={{ padding: "10px 18px", fontSize: 13, fontWeight: 700, background: canSubmit ? BRAND_AMBER : theme.barTrack, color: canSubmit ? "#fff" : theme.textMuted, border: "none", borderRadius: 8, cursor: canSubmit ? "pointer" : "not-allowed" }}>Add site</button>
      </div>
    </Modal>
  );
}

// ── Add Section Modal ──
function AddSectionModal({ open, onClose, onSubmit, sites, initialSiteId, theme, isMobile }: { open: boolean; onClose: () => void; onSubmit: (d: { siteId: string; name: string; hebrewName: string; category: SectionCategory; price: number }) => void; sites: PublisherSite[]; initialSiteId: string | null; theme: Theme; isMobile: boolean }) {
  const [siteId, setSiteId] = useState(initialSiteId || sites[0]?.id || "");
  const [name, setName] = useState("");
  const [hebrewName, setHebrewName] = useState("");
  const [category, setCategory] = useState<SectionCategory>("News");
  const [price, setPrice] = useState("6000");
  useEffect(() => { if (open) { setSiteId(initialSiteId || sites[0]?.id || ""); setName(""); setHebrewName(""); setCategory("News"); setPrice("6000"); } }, [open, initialSiteId, sites]);
  const canSubmit = name.trim() && siteId && parseInt(price) > 0;
  const CATEGORIES: SectionCategory[] = ["News", "Cars", "Sports", "Finance", "Tech", "Health", "Travel", "Lifestyle", "Food", "Parents", "Real Estate", "Entertainment", "Local", "Insurance", "Career", "Fashion"];
  return (
    <Modal open={open} onClose={onClose} title="Add new section" theme={theme} isMobile={isMobile}>
      <FormField label="Site" theme={theme}>
        <select value={siteId} onChange={(e) => setSiteId(e.target.value)} style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }}>
          {sites.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.domain})</option>)}
        </select>
      </FormField>
      <FormField label="Section name (English)" theme={theme}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Banking" autoFocus style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }} />
      </FormField>
      <FormField label="Section name (Hebrew)" theme={theme}>
        <input value={hebrewName} onChange={(e) => setHebrewName(e.target.value)} placeholder="לדוגמה: בנקאות" dir="rtl" style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }} />
      </FormField>
      <FormField label="Category" theme={theme}>
        <select value={category} onChange={(e) => setCategory(e.target.value as SectionCategory)} style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </FormField>
      <FormField label="Price per article (₪)" theme={theme}>
        <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} placeholder="6000" style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }} />
      </FormField>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
        <button onClick={onClose} style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer" }}>Cancel</button>
        <button onClick={() => canSubmit && onSubmit({ siteId, name, hebrewName: hebrewName || name, category, price: parseInt(price) })} disabled={!canSubmit} style={{ padding: "10px 18px", fontSize: 13, fontWeight: 700, background: canSubmit ? BRAND_AMBER : theme.barTrack, color: canSubmit ? "#fff" : theme.textMuted, border: "none", borderRadius: 8, cursor: canSubmit ? "pointer" : "not-allowed" }}>Add section</button>
      </div>
    </Modal>
  );
}

function FormField({ label, children, theme }: { label: string; children: React.ReactNode; theme: Theme }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

// ── Helpers ──
function Stat({ label, value, theme, tip, accent }: { label: string; value: string; theme: Theme; tip?: string; accent?: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 5 }}>
        {label}
        {tip && <Tip text={tip} size={11} />}
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: accent || theme.text, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function Pill({ children, bg, color, small = false }: { children: React.ReactNode; bg: string; color: string; small?: boolean }) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: small ? "2px 7px" : "3px 9px", fontSize: small ? 10 : 11, fontWeight: 600, background: bg, color, borderRadius: 6, lineHeight: 1.4 }}>{children}</span>;
}

// ============================================================
// PUBLISHER · Order Inbox
// ============================================================

function PublisherInboxView({ theme, isMobile, orders, setOrders, sites, sections, showToast }: { theme: Theme; isMobile: boolean; orders: Order[]; setOrders: (v: Order[]) => void; sites: PublisherSite[]; sections: PublisherSection[]; showToast: (text: string, kind?: "success" | "info" | "warn") => void }) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "in_progress" | "published">("all");
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    published: orders.filter((o) => o.status === "published").length,
  };

  const updateStatus = (id: string, status: Order["status"]) => {
    setOrders(orders.map((o) => o.id === id ? { ...o, status } : o));
    const labels: Record<Order["status"], string> = { pending: "marked pending", approved: "approved — agency notified", in_progress: "moved to In Progress", published: "marked published — tracking enabled", rejected: "rejected" };
    showToast(`Order ${labels[status]}`, status === "rejected" ? "warn" : "success");
  };

  const sendCounterOffer = (id: string, adjustedSections: { sectionId: string; price: number }[], note: string) => {
    const adjustedTotal = adjustedSections.reduce((sum, s) => sum + s.price, 0);
    setOrders(orders.map((o) => o.id === id ? { ...o, counterOffer: { adjustedSections, adjustedTotal, note: note.trim() || undefined, sentAt: new Date().toISOString() } } : o));
    showToast(`Counter-offer sent · new total ${fmtNIS(adjustedTotal)}`, "info");
  };

  return (
    <div>
      {/* Banner */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_GREEN}10 0%, ${BRAND_GREEN}03 100%)`, border: `1px solid ${BRAND_GREEN}30`, borderRadius: 12, padding: isMobile ? 16 : 22, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Order Inbox</div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text }}>{counts.pending} pending {counts.pending === 1 ? "order" : "orders"} · {fmtNIS(orders.filter((o) => o.status === "pending").reduce((s, o) => s + o.totalPrice, 0))} potential revenue</div>
          <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Orders submitted by agencies — your sales team contacts the agency to collect payment, then you publish the article.</div>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 14 : 22, flexWrap: "wrap" }}>
          <Stat label="Pending" value={String(counts.pending)} theme={theme} tip="Orders submitted by agencies that you have not yet approved or rejected." accent={counts.pending > 0 ? BRAND_AMBER : undefined} />
          <Stat label="In progress" value={String(counts.in_progress)} theme={theme} tip="Approved orders currently being uploaded by your editorial team." />
          <Stat label="Published" value={String(counts.published)} theme={theme} tip="Articles already live — also visible in Articles & Tracking." accent={BRAND_GREEN} />
          <Stat label="Avg. value" value={fmtNIS(orders.length === 0 ? 0 : Math.round(orders.reduce((s, o) => s + o.totalPrice, 0) / orders.length))} theme={theme} tip="Average ₪ value across all orders received from agencies." />
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {(["all", "pending", "approved", "in_progress", "published"] as const).map((k) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding: "7px 14px", fontSize: 13, fontWeight: 600, background: filter === k ? theme.text : theme.cardBg, color: filter === k ? theme.bg : theme.textSecondary, border: `1px solid ${filter === k ? theme.text : theme.border}`, borderRadius: 8, cursor: "pointer" }}>
            {k === "in_progress" ? "In progress" : k.charAt(0).toUpperCase() + k.slice(1)} ({counts[k]})
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
          <IconInbox size={32} />
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginTop: 12 }}>No orders to show</div>
          <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Orders appear here when agencies submit them.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} theme={theme} isMobile={isMobile} expanded={openOrderId === order.id} onToggle={() => setOpenOrderId(openOrderId === order.id ? null : order.id)} onUpdate={updateStatus} onCounterOffer={sendCounterOffer} mode="publisher" sites={sites} sections={sections} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── ORDER CARD (shared between Publisher inbox & Agency orders) ──
function OrderCard({ order, theme, isMobile, expanded, onToggle, onUpdate, onCounterOffer, onShare, agencyName, mode, sites, sections }: { order: Order; theme: Theme; isMobile: boolean; expanded: boolean; onToggle: () => void; onUpdate: (id: string, status: Order["status"]) => void; onCounterOffer?: (id: string, adjusted: { sectionId: string; price: number }[], note: string) => void; onShare?: (id: string, payload: { clientName: string; clientEmail: string; message?: string }) => string; agencyName?: string; mode: "publisher" | "agency"; sites: PublisherSite[]; sections: PublisherSection[] }) {
  // Counter-offer editor: publisher can adjust each section's price + add a note before sending back
  const [counterEditing, setCounterEditing] = useState(false);
  const [adjustedPrices, setAdjustedPrices] = useState<Record<string, number>>(() => Object.fromEntries(order.sections.map((s) => [s.sectionId, s.price])));
  const [counterNote, setCounterNote] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const adjustedTotal = order.sections.reduce((sum, s) => sum + (adjustedPrices[s.sectionId] ?? s.price), 0);
  const adjustedDelta = adjustedTotal - order.totalPrice;
  const STATUS_STYLES: Record<Order["status"], { bg: string; color: string; label: string }> = {
    pending: { bg: "#FEF3C7", color: "#B45309", label: "Pending approval" },
    approved: { bg: "#CFFAFE", color: "#0E7490", label: "Approved" },
    in_progress: { bg: "#E0E7FF", color: "#5B21B6", label: "In progress" },
    published: { bg: "#D1FAE5", color: "#047857", label: "Published" },
    rejected: { bg: "#FEE2E2", color: "#B91C1C", label: "Rejected" },
  };
  const status = STATUS_STYLES[order.status];

  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
      <button onClick={onToggle} style={{ width: "100%", padding: isMobile ? 14 : 18, background: "none", border: "none", textAlign: "left", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", fontSize: 11, fontWeight: 700, background: status.bg, color: status.color, borderRadius: 6, lineHeight: 1.4 }}>{status.label}</span>
              <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>#{order.id.toUpperCase()}</span>
              <span style={{ fontSize: 12, color: theme.textMuted }}>· {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              {mode === "agency" && order.clientShare && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", fontSize: 11, fontWeight: 700, borderRadius: 6, lineHeight: 1.4,
                  background: order.clientShare.status === "approved" ? `${BRAND_GREEN}18` : order.clientShare.status === "changes_requested" ? `${BRAND_BLUE}18` : `${BRAND_AMBER}18`,
                  color: order.clientShare.status === "approved" ? BRAND_GREEN : order.clientShare.status === "changes_requested" ? BRAND_BLUE : BRAND_AMBER }}>
                  {order.clientShare.status === "approved" ? "✓ Client approved" : order.clientShare.status === "changes_requested" ? "Client requested changes" : "Awaiting client review"}
                </span>
              )}
              {/* Payment badge — only show when credits were redeemed (i.e. non-default cash) */}
              {order.payment && order.payment.creditsUsed > 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", fontSize: 11, fontWeight: 700, borderRadius: 6, lineHeight: 1.4, background: `${BRAND_GREEN}18`, color: BRAND_GREEN }}>
                  {order.payment.creditsUsed} {order.payment.creditsUsed === 1 ? "credit" : "credits"}{order.payment.cashAmount > 0 ? ` + cash` : ""}
                </span>
              )}
            </div>
            <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{order.title}</div>
            <div style={{ fontSize: 13, color: theme.textSecondary, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span><strong style={{ color: theme.text }}>{mode === "publisher" ? order.agencyName : "Order from"}</strong>{mode === "agency" && <> · {order.agencyName}</>}</span>
              <span>· Brand: <strong style={{ color: theme.text }}>{order.brand}</strong></span>
              <span>· {order.queries.length} queries</span>
              <span>· {order.sections.length} {order.sections.length === 1 ? "section" : "sections"}</span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {order.counterOffer ? (
              <>
                <div style={{ fontSize: 13, color: theme.textMuted, textDecoration: "line-through" }}>{fmtNIS(order.totalPrice)}</div>
                <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: BRAND_AMBER }}>{fmtNIS(order.counterOffer.adjustedTotal)}</div>
                <div style={{ fontSize: 11, color: BRAND_AMBER, marginTop: 2, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase" }}>Counter-offer</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text }}>{fmtNIS(order.totalPrice)}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Total order value</div>
              </>
            )}
          </div>
        </div>
      </button>
      {expanded && (
        <div style={{ borderTop: `1px solid ${theme.border}`, padding: isMobile ? 14 : 20, background: theme.tableHeaderBg }}>
          <Section title="Selected queries" theme={theme}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {order.queries.map((q, i) => {
                const found = DEMO_QUERIES.find((dq) => dq.text === q);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: theme.text, padding: "8px 12px", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 7, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: BRAND_GREEN, minWidth: 18 }}>{i + 1}.</span>
                    <span style={{ flex: 1, minWidth: 0 }}>{q}</span>
                    {found && (
                      <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", background: `${BRAND_BLUE}15`, color: BRAND_BLUE, borderRadius: 4 }}>{found.category}</span>
                        {found.audience.slice(0, 2).map((a) => (
                          <span key={a} style={{ fontSize: 10, padding: "2px 7px", background: theme.tableHeaderBg, color: theme.textSecondary, borderRadius: 4 }}>{a}</span>
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {mode === "publisher" && (
            <Section title="Article preview · review before approving" theme={theme}>
              <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 10, padding: "8px 12px", background: `${BRAND_GREEN}08`, border: `1px solid ${BRAND_GREEN}30`, borderLeft: `3px solid ${BRAND_GREEN}`, borderRadius: 6 }}>
                This is the article the agency built from their {order.queries.length} selected queries. Once you approve, your editor publishes this draft on the chosen sections.
              </div>
              <ArticlePreview
                title={order.title}
                selectedQueries={order.queries.map((qText, i) => {
                  const found = DEMO_QUERIES.find((dq) => dq.text === qText);
                  if (found) return found;
                  const lower = qText.toLowerCase();
                  const inferredCategory = lower.includes("bank") || lower.includes("invest") || lower.includes("fund") || lower.includes("pension") || lower.includes("credit") ? "Finance"
                    : lower.includes("real estate") || lower.includes("mortgage") || lower.includes("housing") ? "Real Estate"
                    : lower.includes("tech") || lower.includes("ai") || lower.includes("cloud") || lower.includes("saas") || lower.includes("startup") ? "Tech"
                    : lower.includes("insurance") ? "Insurance"
                    : "Editorial";
                  return {
                    id: `ord-${order.id}-q${i}`,
                    text: qText,
                    category: inferredCategory,
                    audience: ["Decision-makers", "B2B"],
                    gpt: false,
                    gemini: false,
                    perplexity: false,
                    opportunity: 80,
                  };
                })}
                theme={theme}
                isMobile={isMobile}
                mode="publisher"
              />
            </Section>
          )}

          <Section title="Sections ordered" theme={theme}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {order.sections.map((s, i) => {
                const sec = sections.find((y) => y.id === s.sectionId);
                const site = sites.find((y) => y.id === s.siteId);
                if (!sec || !site) return null;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
                    <Favicon domain={site.domain} size={20} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{site.name} · {sec.name} <span style={{ direction: "rtl", color: theme.textSecondary, fontWeight: 400 }}>{sec.hebrewName}</span></div>
                      <div style={{ fontSize: 11, color: theme.textMuted }}>{site.domain}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{fmtNIS(s.price)}</div>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section title="Content mode" theme={theme}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", background: order.contentMode === "generate" ? `${BRAND_GREEN}15` : `${BRAND_AMBER}15`, color: order.contentMode === "generate" ? BRAND_GREEN : BRAND_AMBER, borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
              {order.contentMode === "generate" ? <><IconSparkle size={13} /> AI-generated draft</> : <><IconEdit size={13} /> Empty — agency provides copy</>}
            </div>
          </Section>

          {/* Backlink — every article carries one. Publisher uses this to embed the link. */}
          {order.backlink && (
            <Section title={mode === "publisher" ? "Backlink to embed (do-follow)" : "Do-follow backlink in every article"} theme={theme}>
              <div style={{ padding: 14, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 9 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5, color: theme.text }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", minWidth: 78 }}>Target URL</span>
                    <a href={order.backlink.targetUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "monospace", fontSize: 13, color: BRAND_BLUE, textDecoration: "underline", wordBreak: "break-all" }}>{order.backlink.targetUrl}</a>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", minWidth: 78 }}>Anchor</span>
                    <span style={{ fontWeight: 600 }}>{order.backlink.anchorText}</span>
                  </div>
                </div>
                {mode === "publisher" && (
                  <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 12, lineHeight: 1.5, padding: "8px 12px", background: theme.tableHeaderBg, borderRadius: 7 }}>
                    Embed once per article in the 2nd or 3rd paragraph (no <code style={{ fontFamily: "monospace" }}>rel="nofollow"</code>).
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Payment summary — only shown when there's actual payment metadata (newer orders). */}
          {order.payment && (order.payment.creditsUsed > 0 || order.payment.cashAmount > 0) && (
            <Section title="Payment" theme={theme}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {order.payment.creditsUsed > 0 && (
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "8px 14px", background: `${BRAND_GREEN}15`, color: BRAND_GREEN, borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                    {order.payment.creditsUsed} {order.payment.creditsUsed === 1 ? "credit" : "credits"} redeemed
                  </span>
                )}
                {order.payment.cashAmount > 0 && (
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "8px 14px", background: theme.tableHeaderBg, color: theme.text, borderRadius: 8, fontSize: 13, fontWeight: 700, border: `1px solid ${theme.border}` }}>
                    {fmtNIS(order.payment.cashAmount)} cash
                  </span>
                )}
              </div>
            </Section>
          )}

          <Section title="Agency contact" theme={theme}>
            <div style={{ fontSize: 13, color: theme.text }}>{order.agencyName} · {order.agencyContact}</div>
          </Section>

          {/* Agency-only: share with client */}
          {mode === "agency" && onShare && (
            <ClientShareSection order={order} theme={theme} isMobile={isMobile} agencyName={agencyName ?? order.agencyName} onOpenShareModal={() => setShareModalOpen(true)} />
          )}

          {/* Existing counter-offer banner (visible to both sides once sent) */}
          {order.counterOffer && (
            <Section title={mode === "publisher" ? "Counter-offer sent" : "Counter-offer received from publisher"} theme={theme}>
              <div style={{ padding: 14, background: `${BRAND_AMBER}10`, border: `1.5px solid ${BRAND_AMBER}50`, borderLeft: `4px solid ${BRAND_AMBER}`, borderRadius: 9 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, color: theme.textSecondary }}>Original: <s>{fmtNIS(order.totalPrice)}</s></div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: BRAND_AMBER }}>{fmtNIS(order.counterOffer.adjustedTotal)}</div>
                </div>
                {order.counterOffer.note && (
                  <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.5, padding: "10px 12px", background: theme.cardBg, borderRadius: 7, border: `1px solid ${theme.border}` }}>
                    <strong>Note:</strong> {order.counterOffer.note}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Counter-offer editor (publisher only, on pending orders) */}
          {mode === "publisher" && order.status === "pending" && counterEditing && (
            <Section title="Build counter-offer" theme={theme}>
              <div style={{ padding: 14, background: `${BRAND_AMBER}08`, border: `1.5px solid ${BRAND_AMBER}40`, borderRadius: 9 }}>
                <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 12, lineHeight: 1.5 }}>Adjust per-section prices to send a counter-offer to {order.agencyName}. They'll see the new total and your note in their orders view.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                  {order.sections.map((s) => {
                    const sec = sections.find((y) => y.id === s.sectionId);
                    const site = sites.find((y) => y.id === s.siteId);
                    if (!sec || !site) return null;
                    const newPrice = adjustedPrices[s.sectionId] ?? s.price;
                    return (
                      <div key={s.sectionId} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 8, flexWrap: "wrap" }}>
                        <Favicon domain={site.domain} size={20} />
                        <div style={{ flex: 1, minWidth: 160, fontSize: 14, color: theme.text, fontWeight: 600 }}>{site.name} · {sec.name}</div>
                        <div style={{ fontSize: 12, color: theme.textSecondary }}>was {fmtNIS(s.price)}</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 14, color: theme.textSecondary }}>₪</span>
                          <input type="number" value={newPrice} onChange={(e) => setAdjustedPrices({ ...adjustedPrices, [s.sectionId]: Math.max(0, Number(e.target.value) || 0) })} style={{ width: 100, padding: "8px 10px", fontSize: 14, fontWeight: 700, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 7, color: theme.text, textAlign: "right" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <textarea value={counterNote} onChange={(e) => setCounterNote(e.target.value)} placeholder="Optional note to the agency (e.g. 'Tech section is in high demand this month — premium pricing for the next 30 days')..." style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box", minHeight: 60, fontFamily: "inherit", resize: "vertical" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, flexWrap: "wrap", gap: 10, padding: "10px 14px", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
                  <div style={{ fontSize: 13, color: theme.textSecondary }}>New total <strong style={{ color: theme.text }}>vs</strong> original</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, color: theme.textSecondary, textDecoration: "line-through" }}>{fmtNIS(order.totalPrice)}</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{fmtNIS(adjustedTotal)}</span>
                    {adjustedDelta !== 0 && (
                      <span style={{ fontSize: 13, fontWeight: 700, color: adjustedDelta > 0 ? BRAND_GREEN : "#DC2626", padding: "3px 9px", background: adjustedDelta > 0 ? `${BRAND_GREEN}15` : "#FEE2E2", borderRadius: 6 }}>{adjustedDelta > 0 ? "+" : ""}{fmtNIS(adjustedDelta)}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                  <button onClick={() => { onCounterOffer && onCounterOffer(order.id, order.sections.map((s) => ({ sectionId: s.sectionId, price: adjustedPrices[s.sectionId] ?? s.price })), counterNote); setCounterEditing(false); }} disabled={adjustedDelta === 0} style={{ padding: "11px 22px", fontSize: 14, fontWeight: 700, background: adjustedDelta !== 0 ? BRAND_AMBER : theme.barTrack, color: adjustedDelta !== 0 ? "#fff" : theme.textMuted, border: "none", borderRadius: 8, cursor: adjustedDelta !== 0 ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <IconArrowRight size={13} /> Send counter-offer to agency
                  </button>
                  <button onClick={() => { setCounterEditing(false); setAdjustedPrices(Object.fromEntries(order.sections.map((s) => [s.sectionId, s.price]))); setCounterNote(""); }} style={{ padding: "11px 18px", fontSize: 14, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            </Section>
          )}

          {/* Action buttons */}
          {mode === "publisher" && order.status === "pending" && !counterEditing && (
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <button onClick={() => onUpdate(order.id, "approved")} style={{ padding: "11px 22px", fontSize: 14, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconCheck size={13} /> Approve &amp; contact agency
              </button>
              <button onClick={() => setCounterEditing(true)} style={{ padding: "11px 22px", fontSize: 14, fontWeight: 700, background: "transparent", color: BRAND_AMBER, border: `1.5px solid ${BRAND_AMBER}`, borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconEdit size={13} /> Counter-offer
              </button>
              <button onClick={() => onUpdate(order.id, "rejected")} style={{ padding: "11px 22px", fontSize: 14, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer" }}>
                Reject
              </button>
            </div>
          )}
          {mode === "publisher" && order.status === "approved" && (
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <button onClick={() => onUpdate(order.id, "in_progress")} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 700, background: BRAND_BLUE, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
                Mark in progress
              </button>
            </div>
          )}
          {mode === "publisher" && order.status === "in_progress" && (
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <button onClick={() => onUpdate(order.id, "published")} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 700, background: "#047857", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconCheck size={13} /> Mark published
              </button>
            </div>
          )}
        </div>
      )}
      {shareModalOpen && onShare && (
        <ShareWithClientModal
          order={order}
          theme={theme}
          isMobile={isMobile}
          agencyName={agencyName ?? order.agencyName}
          brandName={order.brand}
          onClose={() => setShareModalOpen(false)}
          onShare={(payload) => onShare(order.id, payload)}
        />
      )}
    </div>
  );
}

function ClientShareSection({ order, theme, isMobile, agencyName, onOpenShareModal }: { order: Order; theme: Theme; isMobile: boolean; agencyName: string; onOpenShareModal: () => void }) {
  const cs = order.clientShare;
  const [copied, setCopied] = useState(false);
  const shareUrl = cs && typeof window !== "undefined" ? `${window.location.origin}/scale-publish?clientShare=${cs.shareId}` : "";
  const copy = () => {
    if (!shareUrl) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }).catch(() => { /* noop */ });
    }
  };

  if (!cs) {
    return (
      <Section title="Client review" theme={theme}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "14px 16px", background: `${BRAND_GREEN}06`, border: `1px dashed ${BRAND_GREEN}50`, borderRadius: 9 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: theme.text, marginBottom: 3 }}>Loop in your client before publishing</div>
            <div style={{ fontSize: 12.5, color: theme.textSecondary, lineHeight: 1.5 }}>Generate a private review link for {order.brand}. They'll see the article preview, the publishers it's going to, and approve or request changes — all under your agency's brand.</div>
          </div>
          <button onClick={onOpenShareModal} style={{ padding: "10px 18px", fontSize: 13, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
            <IconUsers size={13} /> Share with client
          </button>
        </div>
      </Section>
    );
  }

  const STATUS_COPY: Record<typeof cs.status, { label: string; color: string; bg: string; sub: string }> = {
    pending_review: { label: "Awaiting client review", color: BRAND_AMBER, bg: `${BRAND_AMBER}10`, sub: `Waiting for ${cs.clientName} to approve or request changes.` },
    approved: { label: "Client approved ✓", color: BRAND_GREEN, bg: `${BRAND_GREEN}10`, sub: `${cs.clientName} approved this article${cs.decidedAt ? ` on ${new Date(cs.decidedAt).toLocaleDateString()}` : ""} — clear to send to publisher.` },
    changes_requested: { label: "Client requested changes", color: BRAND_BLUE, bg: `${BRAND_BLUE}10`, sub: `${cs.clientName} left feedback — check the comments below and re-share once iterated.` },
  };
  const sc = STATUS_COPY[cs.status];

  return (
    <Section title="Client review" theme={theme}>
      <div style={{ padding: 14, background: sc.bg, border: `1.5px solid ${sc.color}40`, borderLeft: `4px solid ${sc.color}`, borderRadius: 9, marginBottom: cs.comments.length > 0 ? 12 : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: sc.color, marginBottom: 4 }}>{sc.label}</div>
            <div style={{ fontSize: 12.5, color: theme.textSecondary, lineHeight: 1.5 }}>{sc.sub}</div>
            <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 6 }}>Shared with <strong style={{ color: theme.text }}>{cs.clientName}</strong> · {cs.clientEmail} · {new Date(cs.sharedAt).toLocaleDateString()}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", fontSize: 12, fontWeight: 700, background: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: 7, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
              Preview as client
            </a>
            <button onClick={copy} style={{ padding: "8px 12px", fontSize: 12, fontWeight: 700, background: copied ? BRAND_GREEN : theme.cardBg, color: copied ? "#fff" : theme.text, border: `1px solid ${copied ? BRAND_GREEN : theme.border}`, borderRadius: 7, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
              {copied ? "Copied ✓" : "Copy link"}
            </button>
            <button onClick={onOpenShareModal} style={{ padding: "8px 12px", fontSize: 12, fontWeight: 700, background: sc.color, color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>
              {cs.status === "changes_requested" ? "Re-share" : "Resend"}
            </button>
          </div>
        </div>
      </div>

      {cs.comments.length > 0 && (
        <div style={{ padding: 12, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 9 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Conversation thread ({cs.comments.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cs.comments.map((c) => (
              <div key={c.id} style={{ alignSelf: c.from === "agency" ? "flex-end" : "flex-start", maxWidth: isMobile ? "92%" : "78%", padding: "10px 13px", background: c.from === "agency" ? `${BRAND_GREEN}10` : theme.tableHeaderBg, border: `1px solid ${c.from === "agency" ? `${BRAND_GREEN}40` : theme.border}`, borderRadius: 10, fontSize: 13, color: theme.text, lineHeight: 1.5 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: c.from === "agency" ? BRAND_GREEN : theme.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>
                  {c.from === "agency" ? agencyName : c.author} · {new Date(c.at).toLocaleDateString()} {new Date(c.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div>{c.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function Section({ title, children, theme }: { title: string; children: React.ReactNode; theme: Theme }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

// ============================================================
// PUBLISHER · Articles & Tracking
// ============================================================

function PublisherArticlesView({ theme, isMobile, tracking, setTracking, sites, sections, showToast }: { theme: Theme; isMobile: boolean; tracking: ArticleTracking[]; setTracking: (v: ArticleTracking[]) => void; sites: PublisherSite[]; sections: PublisherSection[]; showToast: (text: string, kind?: "success" | "info" | "warn") => void }) {
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [rechecking, setRechecking] = useState(false);

  const filtered = tracking.filter((t) => {
    const sec = sections.find((s) => s.id === t.sectionId);
    if (domainFilter !== "all") {
      const site = sec ? sites.find((s) => s.id === sec.siteId) : null;
      if (!site || site.id !== domainFilter) return false;
    }
    if (!search) return true;
    const q = search.toLowerCase();
    return t.url.toLowerCase().includes(q) || (sec?.name.toLowerCase().includes(q) ?? false);
  });

  const totalViews = tracking.reduce((s, t) => s + t.views, 0);
  const indexedCount = tracking.filter((t) => t.indexedGoogle).length;
  const aiCitedCount = tracking.filter((t) => t.citedGPT || t.citedGemini || t.citedPerplexity).length;
  const avgImpact = tracking.length === 0 ? 0 : Math.round(tracking.reduce((s, t) => s + t.impactScore, 0) / tracking.length);

  const recheckAll = () => {
    setRechecking(true);
    showToast("Re-checking GPT, Gemini, Perplexity for all articles...", "info");
    setTimeout(() => {
      // Simulate engine checks: bump citation flags + impact slightly
      setTracking(tracking.map((t) => ({
        ...t,
        citedGPT: t.citedGPT || Math.random() > 0.6,
        citedGemini: t.citedGemini || Math.random() > 0.7,
        citedPerplexity: t.citedPerplexity || Math.random() > 0.85,
        impactScore: Math.min(100, t.impactScore + Math.floor(Math.random() * 6)),
        views: t.views + Math.floor(Math.random() * 240),
      })));
      setRechecking(false);
      showToast("Engines re-checked — citations & impact updated", "success");
    }, 1400);
  };

  const exportCSV = () => {
    const rows = [
      ["URL", "Site", "Section", "Published", "Crawled", "Google Indexed", "GPT", "Gemini", "Perplexity", "Views", "Impact %", "Ranked queries"],
      ...tracking.map((t) => {
        const sec = sections.find((s) => s.id === t.sectionId);
        const site = sec ? sites.find((s) => s.id === sec.siteId) : null;
        return [t.url, site?.name ?? "", sec?.name ?? "", t.publishedAt, t.crawled ? "Yes" : "No", t.indexedGoogle ? "Yes" : "No", t.citedGPT ? "Yes" : "No", t.citedGemini ? "Yes" : "No", t.citedPerplexity ? "Yes" : "No", String(t.views), String(t.impactScore), t.rankedQueries.map((q) => `${q.query} (${q.engine} #${q.rank})`).join("; ")];
      }),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `geoscale-articles-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${tracking.length} articles to CSV`, "success");
  };

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${BRAND_BLUE}10 0%, ${BRAND_BLUE}03 100%)`, border: `1px solid ${BRAND_BLUE}30`, borderRadius: 12, padding: isMobile ? 16 : 22, marginBottom: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_BLUE, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Article-Level Tracking</div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text }}>{tracking.length} published articles · monitored per item</div>
          <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Each article (item) is tracked individually — crawl status, AI citations, ranked queries, views.</div>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 14 : 24, flexWrap: "wrap" }}>
          <Stat label="Total views" value={fmtNum(totalViews)} theme={theme} tip="Sum of organic views across all your published Geoscale articles." />
          <Stat label="Indexed" value={`${indexedCount}/${tracking.length}`} theme={theme} tip="Articles confirmed in Google's index. Non-indexed pages can't drive search traffic — investigate sitemap & robots if low." />
          <Stat label="AI-cited" value={`${aiCitedCount}/${tracking.length}`} theme={theme} tip="Articles cited by at least one of GPT, Gemini, or Perplexity. This is the AI-search traffic moat." accent={BRAND_GREEN} />
          <Stat label="Avg. impact" value={`${avgImpact}%`} theme={theme} tip="Composite score: index status + AI citations + ranked queries + view velocity." />
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "stretch" }}>
        <div style={{ position: "relative", flex: 1, minWidth: isMobile ? 0 : 220 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><IconSearch size={14} color={theme.textMuted} /></div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles by URL or section..." style={{ width: "100%", padding: "10px 14px 10px 38px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box" }} />
        </div>
        <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, cursor: "pointer", minWidth: 150 }}>
          <option value="all">All sites ({tracking.length})</option>
          {sites.map((s) => {
            const count = tracking.filter((t) => {
              const sec = sections.find((sec) => sec.id === t.sectionId);
              return sec?.siteId === s.id;
            }).length;
            return <option key={s.id} value={s.id}>{s.name} ({count})</option>;
          })}
        </select>
        <button onClick={recheckAll} disabled={rechecking} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, cursor: rechecking ? "wait" : "pointer", opacity: rechecking ? 0.6 : 1 }}>
          <span style={{ display: "inline-flex", animation: rechecking ? "spin 1s linear infinite" : "none" }}><IconRefresh size={13} /></span>
          {rechecking ? "Re-checking..." : "Re-check engines"}
        </button>
        <button onClick={exportCSV} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, background: BRAND_BLUE, color: "#fff", border: "none", borderRadius: 9, cursor: "pointer" }}>
          <IconDownload size={13} /> Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>No articles match your filters</div>
          <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Try clearing the search or site filter.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((t) => (
            <ArticleTrackingRow key={t.url} tracking={t} theme={theme} isMobile={isMobile} sites={sites} sections={sections} showToast={showToast} setTracking={setTracking} allTracking={tracking} />
          ))}
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ArticleTrackingRow({ tracking, theme, isMobile, sites, sections, showToast, setTracking, allTracking }: { tracking: ArticleTracking; theme: Theme; isMobile: boolean; sites: PublisherSite[]; sections: PublisherSection[]; showToast: (text: string, kind?: "success" | "info" | "warn") => void; setTracking: (v: ArticleTracking[]) => void; allTracking: ArticleTracking[] }) {
  const sec = sections.find((s) => s.id === tracking.sectionId);
  const site = sec ? sites.find((s) => s.id === sec.siteId) : null;
  const [expanded, setExpanded] = useState(false);
  const [rechecking, setRechecking] = useState(false);

  const recheckOne = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRechecking(true);
    showToast(`Re-checking engines for ${tracking.url.slice(0, 50)}...`, "info");
    setTimeout(() => {
      setTracking(allTracking.map((t) => t.url === tracking.url ? { ...t, citedGPT: t.citedGPT || Math.random() > 0.5, citedGemini: t.citedGemini || Math.random() > 0.6, citedPerplexity: t.citedPerplexity || Math.random() > 0.8, impactScore: Math.min(100, t.impactScore + Math.floor(Math.random() * 8)), views: t.views + Math.floor(Math.random() * 320) } : t));
      setRechecking(false);
      showToast("Engines re-checked", "success");
    }, 1100);
  };

  const exportOne = (e: React.MouseEvent) => {
    e.stopPropagation();
    const lines = [
      `Article Performance Report`,
      `URL: ${tracking.url}`,
      site && sec ? `Site: ${site.name} / ${sec.name}` : ``,
      `Published: ${tracking.publishedAt}`,
      `Crawled: ${tracking.crawled ? "Yes" : "No"}`,
      `Google indexed: ${tracking.indexedGoogle ? "Yes" : "No"}`,
      `Cited by GPT: ${tracking.citedGPT ? "Yes" : "No"}`,
      `Cited by Gemini: ${tracking.citedGemini ? "Yes" : "No"}`,
      `Cited by Perplexity: ${tracking.citedPerplexity ? "Yes" : "No"}`,
      `Views: ${tracking.views}`,
      `Impact score: ${tracking.impactScore}%`,
      ``,
      `Ranked queries:`,
      ...tracking.rankedQueries.map((q) => `  - "${q.query}" — ${q.engine} #${q.rank}`),
    ].filter(Boolean).join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `article-report-${tracking.url.split("/").pop() || "article"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Report downloaded", "success");
  };

  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
      <button onClick={() => setExpanded(!expanded)} style={{ width: "100%", padding: isMobile ? 14 : 18, background: "none", border: "none", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
        {site && <Favicon domain={site.domain} size={28} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 600, color: theme.text, marginBottom: 4, wordBreak: "break-all" }}>{tracking.url}</div>
          <div style={{ fontSize: 12, color: theme.textSecondary, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {site && sec && <><span>{site.name} / {sec.name}</span><span>·</span></>}
            <span>Published {new Date(tracking.publishedAt).toLocaleDateString()}</span>
            <span>·</span>
            <span>{fmtNum(tracking.views)} views</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tracking.crawled ? <Pill bg={`${BRAND_GREEN}15`} color={BRAND_GREEN}><IconCheck size={10} /> Crawled</Pill> : <Pill bg={`${theme.textMuted}20`} color={theme.textSecondary}>Not crawled</Pill>}
            {tracking.indexedGoogle ? <Pill bg={`${BRAND_GREEN}15`} color={BRAND_GREEN}><IconCheck size={10} /> Google indexed</Pill> : <Pill bg={`${BRAND_AMBER}15`} color={BRAND_AMBER}>Not indexed</Pill>}
            {tracking.citedGPT && <Pill bg={`${BRAND_GREEN}15`} color={BRAND_GREEN}>GPT ✓</Pill>}
            {tracking.citedGemini && <Pill bg={`${BRAND_GREEN}15`} color={BRAND_GREEN}>Gemini ✓</Pill>}
            {tracking.citedPerplexity && <Pill bg={`${BRAND_GREEN}15`} color={BRAND_GREEN}>Perplexity ✓</Pill>}
            {!tracking.citedGPT && !tracking.citedGemini && !tracking.citedPerplexity && <Pill bg={`${BRAND_AMBER}15`} color={BRAND_AMBER}>Not cited yet</Pill>}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>IMPACT</div>
          <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: tracking.impactScore >= 70 ? BRAND_GREEN : tracking.impactScore >= 40 ? BRAND_AMBER : theme.text, fontVariantNumeric: "tabular-nums" }}>{tracking.impactScore}%</div>
        </div>
      </button>
      {expanded && (
        <div style={{ borderTop: `1px solid ${theme.border}`, padding: isMobile ? 14 : 20, background: theme.tableHeaderBg }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>Queries this article ranks for</div>
          {tracking.rankedQueries.length === 0 ? (
            <div style={{ fontSize: 13, color: theme.textSecondary }}>No queries detected yet — wait for engines to re-crawl.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Query</th>
                  <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Engine</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Rank</th>
                </tr>
              </thead>
              <tbody>
                {tracking.rankedQueries.map((rq, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: "10px", fontSize: 13, color: theme.text }}>{rq.query}</td>
                    <td style={{ padding: "10px", fontSize: 13 }}>
                      <Pill bg={`${BRAND_BLUE}15`} color={BRAND_BLUE}>{rq.engine.toUpperCase()}</Pill>
                    </td>
                    <td style={{ padding: "10px", fontSize: 13, fontWeight: 700, color: theme.text, textAlign: "right" }}>#{rq.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={tracking.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 13, fontWeight: 600, background: theme.cardBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: 7, textDecoration: "none" }}>
              <IconExternalLink size={12} /> Open article
            </a>
            <button onClick={recheckOne} disabled={rechecking} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 13, fontWeight: 600, background: theme.cardBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: 7, cursor: rechecking ? "wait" : "pointer", opacity: rechecking ? 0.6 : 1 }}>
              <span style={{ display: "inline-flex", animation: rechecking ? "spin 1s linear infinite" : "none" }}><IconRefresh size={12} /></span> {rechecking ? "Checking..." : "Re-check engines"}
            </button>
            <button onClick={exportOne} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 13, fontWeight: 600, background: theme.cardBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: 7, cursor: "pointer" }}>
              <IconDownload size={12} /> Export report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PUBLISHER · Analytics
// ============================================================

function PublisherAnalyticsView({ theme, isMobile, orders, tracking, getPrice, sites, sections }: { theme: Theme; isMobile: boolean; orders: Order[]; tracking: ArticleTracking[]; getPrice: (s: PublisherSection) => number; sites: PublisherSite[]; sections: PublisherSection[] }) {
  // ── Money flow ──
  const HISTORICAL_BASELINE = 348000;
  const liveRevenue = orders.filter((o) => o.status === "published" || o.status === "in_progress" || o.status === "approved").reduce((s, o) => s + o.totalPrice, 0);
  const totalRevenue = liveRevenue + HISTORICAL_BASELINE;
  const pendingRevenue = orders.filter((o) => o.status === "pending").reduce((s, o) => s + o.totalPrice, 0);
  const articlesSold = orders.filter((o) => o.status !== "rejected" && o.status !== "pending").length + 47;
  const avgOrderValue = Math.round(totalRevenue / Math.max(1, articlesSold));

  // ── Order funnel (uses GREEN at descending opacity for visual progression) ──
  const funnel = [
    { stage: "Submitted", count: orders.length + 60, opacity: 0.35 },
    { stage: "Approved", count: orders.filter((o) => o.status !== "pending" && o.status !== "rejected").length + 52, opacity: 0.55 },
    { stage: "In progress", count: orders.filter((o) => o.status === "in_progress" || o.status === "published").length + 49, opacity: 0.78 },
    { stage: "Published", count: orders.filter((o) => o.status === "published").length + 47, opacity: 1.0 },
  ];

  // ── 12-week revenue trend ──
  const trendWeeks = isMobile ? 8 : 12;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendData = useMemo(() => {
    const arr: { week: string; revenue: number }[] = [];
    const now = new Date();
    for (let i = trendWeeks - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const base = 22000 + (trendWeeks - 1 - i) * 4200;
      const noise = ((i * 73) % 9 - 4) * 1800;
      arr.push({ week: `${d.getDate()} ${monthNames[d.getMonth()]}`, revenue: Math.round(Math.max(8000, base + noise)) });
    }
    return arr;
  }, [trendWeeks]);
  const trendMax = Math.max(...trendData.map((d) => d.revenue));
  const trendAvg = Math.round(trendData.reduce((s, d) => s + d.revenue, 0) / trendData.length);
  const yAxisMax = Math.ceil(trendMax / 10000) * 10000; // round up to nearest 10k
  const yTicks = [0, yAxisMax / 4, yAxisMax / 2, (yAxisMax * 3) / 4, yAxisMax];

  // ── Per-section ROI ──
  const sectionPerf = useMemo(() => {
    return sections.map((sec) => {
      const site = sites.find((s) => s.id === sec.siteId);
      const ordersForSec = orders.filter((o) => o.sections.some((s) => s.sectionId === sec.id));
      const ordersCount = ordersForSec.length + ((sec.id.charCodeAt(sec.id.length - 1) % 5) + 1);
      const revenue = ordersCount * getPrice(sec);
      const trackedForSec = tracking.filter((t) => t.sectionId === sec.id);
      const aiCitedForSec = trackedForSec.filter((t) => t.citedGPT || t.citedGemini || t.citedPerplexity).length;
      const aiRate = trackedForSec.length === 0 ? 60 + ((sec.id.charCodeAt(0) * 7) % 35) : Math.round((aiCitedForSec / trackedForSec.length) * 100);
      return { sec, site, ordersCount, revenue, aiRate };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [sections, sites, orders, tracking, getPrice]);
  const topSections = sectionPerf.slice(0, 6);
  const totalRevByTop = topSections.reduce((s, x) => s + x.revenue, 0);

  // ── Per-site revenue split ──
  const siteRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    for (const x of sectionPerf) {
      if (!x.site) continue;
      map[x.site.id] = (map[x.site.id] || 0) + x.revenue;
    }
    return sites.map((s) => ({ site: s, revenue: map[s.id] || 0 })).sort((a, b) => b.revenue - a.revenue);
  }, [sectionPerf, sites]);
  const siteRevTotal = siteRevenue.reduce((s, x) => s + x.revenue, 0) || 1;

  // ── AI engine citation rates (vendor brand colors kept distinct) ──
  const engineStats = useMemo(() => {
    const total = tracking.length || 1;
    return [
      { name: "ChatGPT", val: Math.round((tracking.filter((t) => t.citedGPT).length / total) * 100) || 88, color: "#10A37F" },
      { name: "Gemini", val: Math.round((tracking.filter((t) => t.citedGemini).length / total) * 100) || 71, color: "#4285F4" },
      { name: "Perplexity", val: Math.round((tracking.filter((t) => t.citedPerplexity).length / total) * 100) || 42, color: "#20808D" },
    ];
  }, [tracking]);

  // Helpers
  const fmtKShort = (n: number) => n >= 1000 ? `₪${Math.round(n / 1000)}K` : `₪${n}`;

  return (
    <div>
      {/* Banner — clean single-tone green wash */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_GREEN}10 0%, ${BRAND_GREEN}03 100%)`, border: `1px solid ${BRAND_GREEN}30`, borderRadius: 12, padding: isMobile ? 16 : 22, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Analytics · Flow of Money & Performance</div>
        <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text }}>{fmtNIS(totalRevenue)} this month · {articlesSold} articles live</div>
        <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Revenue by site, order conversion funnel, and AI-citation moat — all updated live as orders move through the inbox.</div>
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
        <Kpi label="Revenue this month" value={fmtNIS(totalRevenue)} delta="+18.4%" theme={theme} positive tip="Sum of all approved + in-progress + published orders + historical baseline." />
        <Kpi label="Pending revenue" value={fmtNIS(pendingRevenue)} delta={pendingRevenue > 0 ? "Awaiting approval" : "No backlog"} theme={theme} positive={pendingRevenue === 0} tip="Submitted orders not yet approved. Sitting in your Inbox right now." accent={pendingRevenue > 0 ? BRAND_AMBER : undefined} />
        <Kpi label="Avg. order value" value={fmtNIS(avgOrderValue)} delta="+₪420" theme={theme} positive tip="Mean ₪ per order — useful for forecasting and pricing changes." />
        <Kpi label="AI-citation rate" value={`${Math.round(engineStats.reduce((s, e) => s + e.val, 0) / engineStats.length)}%`} delta="+8%" theme={theme} positive tip="Avg. share of articles cited by GPT, Gemini, or Perplexity. Drives the brand-discovery moat." />
      </div>

      {/* Revenue trend chart — proper SVG line+bar with grid + avg line */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 16 : 22, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, display: "inline-flex", alignItems: "center", gap: 6 }}>
              Revenue trend · last {trendWeeks} weeks
              <Tip text="Weekly ₪ revenue from accepted orders. Dashed line = period average." />
            </div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>Avg: <strong style={{ color: theme.text }}>{fmtNIS(trendAvg)}</strong>/week · Peak: <strong style={{ color: theme.text }}>{fmtNIS(trendMax)}</strong></div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: `${BRAND_GREEN}15`, color: BRAND_GREEN, borderRadius: 18, fontSize: 13, fontWeight: 700 }}>
            ▲ {Math.round(((trendData[trendData.length - 1].revenue - trendData[0].revenue) / trendData[0].revenue) * 100)}% growth
          </div>
        </div>

        {/* Chart with grid */}
        <div style={{ display: "flex", gap: 12, height: 200 }}>
          {/* Y-axis labels */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 24, paddingTop: 4, fontSize: 10, fontWeight: 600, color: theme.textMuted, minWidth: 36 }}>
            {[...yTicks].reverse().map((t) => <span key={t}>{fmtKShort(t)}</span>)}
          </div>

          {/* Bars + grid container */}
          <div style={{ flex: 1, position: "relative", paddingBottom: 24 }}>
            {/* Horizontal grid lines */}
            <div style={{ position: "absolute", inset: "0 0 24px 0", display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
              {yTicks.map((t) => (
                <div key={t} style={{ borderTop: `1px ${t === 0 ? "solid" : "dashed"} ${theme.border}`, height: 0 }} />
              ))}
            </div>

            {/* Average line */}
            <div style={{ position: "absolute", left: 0, right: 0, top: `${(1 - trendAvg / yAxisMax) * 100}%`, borderTop: `1.5px dashed ${BRAND_AMBER}`, pointerEvents: "none", zIndex: 2 }}>
              <span style={{ position: "absolute", right: 0, top: -8, fontSize: 10, fontWeight: 700, color: BRAND_AMBER, background: theme.cardBg, padding: "0 6px", borderRadius: 3 }}>avg</span>
            </div>

            {/* Bars */}
            <div style={{ position: "absolute", inset: "0 0 24px 0", display: "flex", alignItems: "flex-end", gap: isMobile ? 4 : 8 }}>
              {trendData.map((d, i) => {
                const h = (d.revenue / yAxisMax) * 100;
                const isLast = i === trendData.length - 1;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0, height: "100%", justifyContent: "flex-end" }}>
                    <div title={`${d.week}: ${fmtNIS(d.revenue)}`} style={{ width: "100%", height: `${h}%`, background: `linear-gradient(180deg, ${BRAND_GREEN} 0%, ${BRAND_GREEN}AA 100%)`, opacity: isLast ? 1 : 0.85, borderRadius: "5px 5px 2px 2px", minHeight: 4, transition: "all 0.3s", cursor: "help", boxShadow: isLast ? `0 0 0 2px ${BRAND_GREEN}30` : "none" }} />
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", gap: isMobile ? 4 : 8 }}>
              {trendData.map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: theme.textMuted, fontWeight: 600, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.week}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Funnel + AI engine */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 14, marginBottom: 14 }}>
        {/* Funnel — green opacity progression for consistency */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 16 : 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 4, display: "inline-flex", alignItems: "center", gap: 6 }}>
            Order funnel
            <Tip text="Conversion at each stage from agency submission to live article. Drop-offs help diagnose where friction lives." />
          </div>
          <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 16 }}>{Math.round((funnel[3].count / funnel[0].count) * 100)}% submission → published</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {funnel.map((f, i) => {
              const pct = (f.count / funnel[0].count) * 100;
              const widthPct = 35 + (pct / 100) * 65;
              return (
                <div key={f.stage} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 90, fontSize: 12, fontWeight: 600, color: theme.textSecondary, flexShrink: 0 }}>{f.stage}</div>
                  <div style={{ flex: 1, height: 34, background: theme.barTrack, borderRadius: 7, overflow: "hidden", position: "relative" }}>
                    <div style={{ width: `${widthPct}%`, height: "100%", background: BRAND_GREEN, opacity: f.opacity, display: "flex", alignItems: "center", paddingLeft: 14, color: "#fff", fontSize: 13, fontWeight: 700, transition: "width 0.4s", borderRadius: "7px 0 0 7px" }}>
                      {f.count}
                    </div>
                    {i > 0 && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 700, color: theme.textSecondary }}>{Math.round((f.count / funnel[i - 1].count) * 100)}%</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI engine */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 16 : 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 4, display: "inline-flex", alignItems: "center", gap: 6 }}>
            AI engine citation rate
            <Tip text="% of your articles cited by each AI engine. The big moat — owned & operated traditional + AI search." />
          </div>
          <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 16 }}>Higher = more brand discovery via AI answers</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {engineStats.map((e) => (
              <div key={e.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: theme.text, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: e.color, display: "inline-block" }} />
                    {e.name}
                  </span>
                  <span style={{ color: theme.text, fontWeight: 700 }}>{e.val}%</span>
                </div>
                <div style={{ height: 10, background: theme.barTrack, borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ width: `${e.val}%`, height: "100%", background: e.color, transition: "width 0.5s", borderRadius: 5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top sections + Site split — both green for consistency */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: 14 }}>
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 16 : 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 4, display: "inline-flex", alignItems: "center", gap: 6 }}>
            Top sections by revenue
            <Tip text="Sections ranked by ₪ revenue from accepted orders. Use this to spot what to price up or what to push to agencies." />
          </div>
          <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 14 }}>Top 6 of {sections.length} · {fmtNIS(totalRevByTop)} total</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topSections.map((x, i) => {
              const max = topSections[0]?.revenue || 1;
              return (
                <div key={x.sec.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 22, fontSize: 12, fontWeight: 700, color: theme.textSecondary, flexShrink: 0 }}>#{i + 1}</div>
                  {x.site && <Favicon domain={x.site.domain} size={20} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{x.site?.name} · {x.sec.name}</span>
                      <Pill bg={`${BRAND_GREEN}15`} color={BRAND_GREEN} small>{x.aiRate}% AI-cited</Pill>
                    </div>
                    <div style={{ height: 6, background: theme.barTrack, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(x.revenue / max) * 100}%`, height: "100%", background: BRAND_GREEN, opacity: 0.4 + (1 - i / topSections.length) * 0.6, transition: "width 0.4s" }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{fmtNIS(x.revenue)}</div>
                    <div style={{ fontSize: 10, color: theme.textMuted }}>{x.ordersCount} orders</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Site split — green at varying opacity for hierarchy */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 16 : 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 4, display: "inline-flex", alignItems: "center", gap: 6 }}>
            Revenue by site
            <Tip text="₪ split across all your owned-and-operated sites in the Yedioth group." />
          </div>
          <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 14 }}>Across {sites.length} O&O properties</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {siteRevenue.slice(0, 6).map((x, i) => {
              const pct = (x.revenue / siteRevTotal) * 100;
              return (
                <div key={x.site.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Favicon domain={x.site.domain} size={18} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: theme.text, fontWeight: 600 }}>{x.site.name}</span>
                      <span style={{ color: theme.textSecondary, fontWeight: 600 }}>{Math.round(pct)}%</span>
                    </div>
                    <div style={{ height: 6, background: theme.barTrack, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: BRAND_GREEN, opacity: 0.4 + (1 - i / 6) * 0.6, transition: "width 0.4s" }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.text, minWidth: 70, textAlign: "right" }}>{fmtNIS(x.revenue)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, delta, theme, positive, tip, accent }: { label: string; value: string; delta?: string; theme: Theme; positive?: boolean; tip?: string; accent?: string }) {
  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 11, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 5 }}>
        {label}
        {tip && <Tip text={tip} size={11} />}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent || theme.text, lineHeight: 1.1 }}>{value}</div>
      {delta && <div style={{ fontSize: 12, color: positive ? BRAND_GREEN : BRAND_AMBER, fontWeight: 600, marginTop: 6 }}>{delta}</div>}
    </div>
  );
}

// ============================================================
// ARTICLE PREVIEW — AdsGPT-style editorial layout
// Matches: hero, stats highlight box, intro, pull quote, H2/H3 sections,
// comparison table, key learnings callout, conclusion
// ============================================================

function ArticlePreview({ title, selectedQueries, theme, isMobile, mode = "agency", brand }: { title: string; selectedQueries: typeof DEMO_QUERIES; theme: Theme; isMobile: boolean; mode?: "agency" | "publisher"; brand?: typeof DEMO_BRAND }) {
  const articleBrand = brand ?? DEMO_BRAND;
  // GEO annotations — defaults ON for the demo. Each element gets a hoverable tooltip explaining
  // why it was structured/picked for AI-engine citation. Toggle off for a clean editorial preview.
  const [showGeoNotes, setShowGeoNotes] = useState(true);
  const wordCount = selectedQueries.length * 320 + 230; // intro + sections + conclusion
  const readMin = Math.max(2, Math.round(wordCount / 220));
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const categoriesPresent = Array.from(new Set(selectedQueries.map((q) => q.category))).slice(0, 3);

  // Stable mock numbers from query IDs
  const seedFromQueries = selectedQueries.map((q) => q.id).join("-");
  const seedHash = seedFromQueries.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const stat1 = 65 + (seedHash % 30); // AI citation %
  const stat2 = 12 + (seedHash % 18); // ranked queries
  const stat3 = (selectedQueries.length * 1.2 + (seedHash % 10) / 10).toFixed(1); // ROAS-style multiplier
  const stat4 = `${selectedQueries.length * 320}+`; // word count

  // Mock body text per query
  const bodyByQuery = (q: typeof DEMO_QUERIES[number], i: number): { paras: string[]; h3s: string[]; pullQuote?: string; bullets?: string[] } => {
    const angle = i % 3;
    return {
      paras: [
        `When ${articleBrand.name} customers ask "${q.text.toLowerCase()}", the answer used to live behind a logged-in dashboard or buried in a 60-page PDF. Today, the same customer types the question into ChatGPT — and the engine cites whichever source covered it best in the public web. That source is now the brand's storefront, even if the brand never planned it that way.`,
        `The shift matters for ${q.category.toLowerCase()} specifically because the audience here (${q.audience.slice(0, 2).join(" and ")}) tends to do their research before they ever click into a vendor site. If your competitor's article on Ynet ranks first, you've already lost the consideration phase before the user reaches your funnel.`,
      ],
      h3s: angle === 0 ? ["What the data actually shows", "How leading brands are responding"] : angle === 1 ? ["The numbers behind the trend", "What to watch for next quarter"] : ["Where most analyses get this wrong", "A practical framework for action"],
      pullQuote: i === 0 ? `If your audience is asking AI engines this question, every day you're not the cited answer is a day a competitor is.` : i === 1 ? undefined : i === 2 ? `The most expensive moment in customer acquisition is the one before they know your name exists.` : undefined,
      bullets: angle === 0 ? [`${stat1}% of ${q.audience[0] || "B2C"} buyers begin research outside owned channels`, `${q.category} queries on AI engines grew 4.2× year-over-year`, `Citation share — not click share — is becoming the leading indicator`] : undefined,
    };
  };

  // Comparison table data (shown after first H2 for variety)
  const comparisonRows = [
    { aspect: "Discovery channel", before: "Paid search + display", after: "AI-cited editorial + paid search" },
    { aspect: "Time to brand mention", before: "Click 3–5 of funnel", after: "Click 1 (the AI answer itself)" },
    { aspect: "Cost per qualified visit", before: "₪18–₪32", after: "₪6–₪11 (after CPC normalization)" },
    { aspect: "Trust signal", before: "Ad disclosure label", after: "Editorial citation in trusted publisher" },
  ];

  // Article container styling — matches AdsGPT editorial CSS
  const articleFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', system-ui, sans-serif";
  const editorialCol = isMobile ? "auto" : "auto";
  const articlePadding = isMobile ? "20px" : "32px 40px";

  return (
    <div style={{ marginBottom: 18 }}>
      {/* Step header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6 }}>
          {mode === "publisher" ? "Article preview · what the agency wants you to publish" : "Step 1.5 · Article preview (live)"}
          <Tip text={mode === "publisher" ? "This is the draft the agency built from their selected queries. Review the full article before approving — once approved, your editor takes it from here." : "Live preview of what Yedioth's editor will publish. Each query becomes a section. Edit your selection or title to update it."} />
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <button onClick={() => setShowGeoNotes(!showGeoNotes)} title={showGeoNotes ? "Hide GEO annotations" : "Show why each element was picked for AI search"} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12, fontWeight: 700, background: showGeoNotes ? "#10A37F15" : "transparent", color: showGeoNotes ? "#047857" : theme.textSecondary, border: `1.5px solid ${showGeoNotes ? "#10A37F" : theme.border}`, borderRadius: 7, cursor: "pointer", letterSpacing: 0.5, textTransform: "uppercase" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
            {showGeoNotes ? "GEO notes ON" : "GEO notes OFF"}
          </button>
          <div style={{ fontSize: 13, color: theme.textSecondary }}>~{wordCount} words · {readMin} min read · {selectedQueries.length} H2 sections</div>
        </div>
      </div>

      {/* Strategy summary — visible only when annotations are ON */}
      {showGeoNotes && (
        <div style={{ background: "#10A37F08", border: "1px solid #10A37F30", borderLeft: "4px solid #10A37F", borderRadius: 9, padding: isMobile ? "12px 14px" : "14px 18px", marginBottom: 12, fontSize: 13, color: theme.text, lineHeight: 1.6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#047857", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Why this article is structured this way</div>
          Hover any <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", background: "#10A37F15", color: "#047857", fontSize: 10, fontWeight: 700, borderRadius: 4, letterSpacing: 0.5, textTransform: "uppercase", border: "1px solid #10A37F40", verticalAlign: "middle" }}>GEO</span> badge below to see why each element was picked. Every choice — title format, byline, stat box, pull quotes, H2/H3 hierarchy, comparison table, conclusion — maps to a specific signal AI engines (ChatGPT, Gemini, Perplexity) and Google use to decide which source to cite.
        </div>
      )}

      {/* The article itself */}
      <article style={{ background: "#FFFFFF", color: "#1A1A1A", border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden", fontFamily: articleFont, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {/* Hero image placeholder */}
        <div style={{ height: isMobile ? 120 : 180, background: `linear-gradient(135deg, ${BRAND_GREEN}25 0%, ${BRAND_BLUE}20 100%)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#FFFFFF99", fontSize: 13, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", textShadow: "0 1px 2px rgba(0,0,0,0.2)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Featured image · provided by editor
            <GeoNote enabled={showGeoNotes} text="Featured images get extracted by Google Discover and AI engine card displays. Original imagery (not stock) signals editorial investment and improves CTR by ~22%. The publisher's editor picks an image that matches the article's primary entity — a known E-E-A-T signal." />
          </div>
        </div>

        <div style={{ padding: articlePadding, maxWidth: 760, margin: "0 auto" }}>
          {/* Category tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
            {categoriesPresent.map((c) => (
              <span key={c} style={{ display: "inline-block", padding: "4px 12px", fontSize: 12, fontWeight: 600, background: `${BRAND_GREEN}12`, color: BRAND_GREEN, borderRadius: 4, letterSpacing: 0.3 }}>{c}</span>
            ))}
            <span style={{ display: "inline-block", padding: "4px 12px", fontSize: 12, fontWeight: 600, background: "#F1F5F9", color: "#475569", borderRadius: 4, letterSpacing: 0.3 }}>Sponsored by {articleBrand.name}</span>
            <GeoNote enabled={showGeoNotes} text={`Category tags map the article into the publisher's topic graph. The "${categoriesPresent[0] ?? "category"}" tag tells Google + AI engines this content belongs to a recognized entity cluster — a topical authority signal. The sponsored disclosure is a trust marker (FTC-compliant, AI engines de-rank undisclosed paid content).`} />
          </div>

          {/* Title (H1) — large, bold, tight line-height */}
          <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 700, color: "#0F172A", lineHeight: 1.15, letterSpacing: "-0.5px", margin: "0 0 14px", position: "relative" }}>
            {title || `Your article title appears here once you fill it in below`}
            <span style={{ display: "inline-flex", marginLeft: 8, fontWeight: 400 }}>
              <GeoNote enabled={showGeoNotes} text={`H1 was auto-generated from your highest-opportunity query + brand modifier ("${articleBrand.name}'s complete 2026 guide"). This format wins because: (1) contains the primary search query verbatim — direct match for AI extraction, (2) brand mention forces co-citation, (3) "complete guide" + year = freshness + comprehensiveness signal, (4) ~60-70 chars optimizes for Google's title-display window without truncation.`} />
            </span>
          </h1>

          {/* Byline */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 18, marginBottom: 24, borderBottom: "1px solid #E2E8F0", fontSize: 14, color: "#64748B", flexWrap: "wrap" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${BRAND_GREEN}20`, color: BRAND_GREEN, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{articleBrand.agency.split(" ").map((w) => w[0]).slice(0, 3).join("").toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#0F172A", fontWeight: 600, display: "inline-flex", alignItems: "center", flexWrap: "wrap" }}>
                {articleBrand.agency}
                <GeoNote enabled={showGeoNotes} text="Named-author byline is a core E-E-A-T signal (Experience, Expertise, Authoritativeness, Trust). Google's quality rater guidelines explicitly weight bylines for YMYL topics. AI engines also extract author names when generating citations — anonymous content gets cited at 0.4× the rate of attributed content." />
              </div>
              <div style={{ fontSize: 13, display: "inline-flex", alignItems: "center", flexWrap: "wrap" }}>
                {today} · {readMin} min read
                <GeoNote enabled={showGeoNotes} text="Publication date drives the freshness score. AI engines re-cite content from the last 90 days at 3.4× the rate of older content. Reading-time estimate (~220 wpm) is rendered as machine-readable metadata so engines can match user intent — quick-answer queries get short articles, deep-dive intents get long ones." />
              </div>
            </div>
          </div>

          {selectedQueries.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14, fontStyle: "italic" }}>Select queries to see the article take shape</div>
          ) : (
            <>
              {/* Stats highlight box — AdsGPT-style 4-column grid callout */}
              <div style={{ background: `${BRAND_GREEN}08`, border: `1px solid ${BRAND_GREEN}30`, borderRadius: 8, padding: isMobile ? "16px" : "20px 24px", marginBottom: 12, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 14 : 20 }}>
                {[
                  { num: `+${stat1}%`, label: "AI citation lift" },
                  { num: `${stat2}`, label: "Queries ranked" },
                  { num: `${stat3}x`, label: "Brand-mention reach" },
                  { num: stat4, label: "Words of coverage" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: isMobile ? "left" : "center" }}>
                    <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: BRAND_GREEN, lineHeight: 1, letterSpacing: "-0.5px" }}>{s.num}</div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 24, display: "flex", justifyContent: "flex-end" }}>
                <GeoNote enabled={showGeoNotes} text="Numerical stat blocks above the fold are featured-snippet candidates. AI engines (especially Perplexity) extract these as structured data and surface them as direct answers. The 4-cell grid forces specificity — generic claims don't get cited; numbers do. Each number ties back to a query in this article so engines see internal consistency." />
              </div>

              {/* Intro paragraph */}
              <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.65, color: "#1E293B", margin: "0 0 8px", fontWeight: 400 }}>
                For {articleBrand.name}'s customer segment, the path from first question to first conversation has collapsed. The buyer who once spent 3 weeks comparing options now asks ChatGPT, Gemini, or Perplexity a single sharp question — and gets a single confident answer. This piece walks through {selectedQueries.length === 1 ? "the question" : `the ${selectedQueries.length} questions`} {articleBrand.name}'s audience is asking right now, and what the data says about each.
              </p>
              <div style={{ marginBottom: 24, display: "flex", justifyContent: "flex-end" }}>
                <GeoNote enabled={showGeoNotes} text={`The first 200 words = AI summary candidate. ChatGPT and Gemini frequently cite the opening paragraph verbatim when answering related queries. We force ${articleBrand.name}'s brand mention twice in the intro — once as subject, once as audience reference — so any extracted summary carries the brand name into the citation.`} />
              </div>

              {/* First pull-quote (AdsGPT style) */}
              <blockquote style={{ borderLeft: `5px solid ${BRAND_GREEN}`, padding: "8px 0 8px 22px", margin: "0 0 8px", fontSize: isMobile ? 17 : 20, fontStyle: "italic", color: "#334155", fontWeight: 500, lineHeight: 1.5 }}>
                "Creative fatigue has a cousin in publisher land — query fatigue. The brands winning AI search aren't writing more — they're writing the right {selectedQueries.length} questions, deeper than anyone else."
              </blockquote>
              <div style={{ marginBottom: 32, display: "flex", justifyContent: "flex-end" }}>
                <GeoNote enabled={showGeoNotes} text="Block-quote markup (<blockquote> tag) is parsed by AI engines as quotable. Pull quotes get extracted at 2.8× the rate of regular paragraphs and frequently surface as the answer-snippet on Google. This one is contrarian + specific = high citation odds." />
              </div>

              {/* H2 sections */}
              {selectedQueries.map((q, i) => {
                const body = bodyByQuery(q, i);
                return (
                  <section key={q.id} style={{ marginBottom: 36 }}>
                    <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: "#0F172A", lineHeight: 1.25, letterSpacing: "-0.4px", margin: "0 0 6px", scrollMarginTop: 80, display: "flex", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ flex: 1, minWidth: 0 }}>{q.text}</span>
                      <span style={{ fontWeight: 400, fontSize: 12, marginTop: 8 }}>
                        <GeoNote enabled={showGeoNotes} text={`H2 = the query verbatim ("${q.text}"). This is the most important GEO move — when a user asks ChatGPT or Gemini exactly this question, the engine looks for an article whose H2 matches it word-for-word. Direct H2 match = highest extraction probability. Audience: ${q.audience.slice(0, 2).join(" + ")}. Opportunity score: ${q.opportunity}/100.`} />
                      </span>
                    </h2>
                    <div style={{ marginBottom: 14, fontSize: 12, color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ display: "inline-block", padding: "2px 8px", fontSize: 11, fontWeight: 600, background: `${BRAND_BLUE}10`, color: BRAND_BLUE, borderRadius: 4 }}>{q.category}</span>
                      <span>·</span>
                      <span>Audience: {q.audience.slice(0, 3).join(", ")}</span>
                      <span>·</span>
                      <span>{q.gpt && <strong style={{ color: BRAND_GREEN }}>GPT priority</strong>}{q.gemini && <strong style={{ color: BRAND_GREEN }}>{q.gpt ? " · " : ""}Gemini priority</strong>}{!q.gpt && !q.gemini && "Untapped"}</span>
                    </div>

                    {body.paras.map((p, pi) => (
                      <p key={pi} style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: "0 0 16px" }}>{p}</p>
                    ))}

                    {/* H3 + content */}
                    <h3 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#0F172A", margin: "24px 0 10px", lineHeight: 1.3, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                      <span>{body.h3s[0]}</span>
                      <span style={{ fontWeight: 400 }}><GeoNote enabled={showGeoNotes && i === 0} text="H3 sub-headings extend the topical authority signal. Each H3 = a sub-question Google's PAA (People Also Ask) box surfaces. Including 2 H3s per H2 covers ~80% of related-question variations users ask AI engines after the primary query." /></span>
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: "0 0 16px" }}>
                      Across the {q.category.toLowerCase()} category, three patterns repeat: brands that publish on Yedioth-tier sites get cited 3.4× more often than brands relying on owned-blog content alone, citation rate compounds — once an engine starts citing you for one query, related queries follow within 6–8 weeks, and the topical authority shows up in Google Search Console before it shows up in revenue dashboards.
                    </p>

                    {/* Bullets if present */}
                    {body.bullets && (
                      <>
                        <ul style={{ margin: "0 0 6px", paddingLeft: 24, fontSize: 16, lineHeight: 1.75, color: "#334155" }}>
                          {body.bullets.map((b, bi) => (
                            <li key={bi} style={{ marginBottom: 6 }}>{b}</li>
                          ))}
                        </ul>
                        <div style={{ marginBottom: 18, display: "flex", justifyContent: "flex-end" }}>
                          <GeoNote enabled={showGeoNotes && i === 0} text="<ul> markup with concrete numbers is the most-extracted block type by AI engines. Perplexity surfaces bullet lists as direct answers ~70% of the time when the user's query starts with 'what are' or 'how to'. Each bullet here is structured: stat + context + so-what." />
                        </div>
                      </>
                    )}

                    {/* Pull quote inside section if present */}
                    {body.pullQuote && (
                      <>
                        <blockquote style={{ borderLeft: `4px solid ${BRAND_GREEN}`, padding: "6px 0 6px 18px", margin: "20px 0 6px", fontSize: 18, fontStyle: "italic", color: "#475569", fontWeight: 500, lineHeight: 1.5 }}>
                          "{body.pullQuote}"
                        </blockquote>
                        <div style={{ marginBottom: 24, display: "flex", justifyContent: "flex-end" }}>
                          <GeoNote enabled={showGeoNotes && i === 0} text="In-section pull quotes give the article 'shareability moments'. Reporters and bloggers pull these as out-of-context cites, building inbound links. Each citing link compounds the article's authority score, raising future AI-cite probability." />
                        </div>
                      </>
                    )}

                    <h3 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#0F172A", margin: "24px 0 10px", lineHeight: 1.3 }}>{body.h3s[1]}</h3>
                    <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: "0 0 16px" }}>
                      The practical move for {articleBrand.name} is to own this question on a Yedioth property where the audience already trusts the editorial voice. That's exactly what the {selectedQueries.length}-section article you're building does — each section answers one of the queries fully enough that GPT cites it, Gemini cites it, and Perplexity surfaces it as a primary source.
                    </p>

                    {/* Comparison table (insert after first section) */}
                    {i === 0 && (
                      <>
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, marginBottom: 4 }}>
                        <GeoNote enabled={showGeoNotes} text="Comparison tables are gold for GEO. Structured table data (<table> tag) gets parsed by Google as a comparison-snippet candidate and by AI engines as before/after structured data. We pre-formatted Aspect / Before / With Yedioth columns because that exact structure is what Gemini and Perplexity surface for 'is X worth it' / 'should I switch to X' queries." />
                      </div>
                      <div style={{ margin: "10px 0 24px", border: "1px solid #E2E8F0", borderRadius: 8, overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                          <thead>
                            <tr style={{ background: "#F8FAFC" }}>
                              <th style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>Aspect</th>
                              <th style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>Before AI search</th>
                              <th style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: BRAND_GREEN, borderBottom: "1px solid #E2E8F0" }}>With Yedioth coverage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparisonRows.map((r, ri) => (
                              <tr key={ri} style={{ background: ri % 2 === 0 ? "#FFFFFF" : "#FAFBFC" }}>
                                <td style={{ padding: "12px 14px", fontWeight: 600, color: "#0F172A", borderBottom: ri < comparisonRows.length - 1 ? "1px solid #E2E8F0" : "none" }}>{r.aspect}</td>
                                <td style={{ padding: "12px 14px", color: "#64748B", borderBottom: ri < comparisonRows.length - 1 ? "1px solid #E2E8F0" : "none" }}>{r.before}</td>
                                <td style={{ padding: "12px 14px", color: "#0F172A", borderBottom: ri < comparisonRows.length - 1 ? "1px solid #E2E8F0" : "none" }}>{r.after}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      </>
                    )}
                  </section>
                );
              })}

              {/* Key takeaways callout */}
              <div style={{ background: `${BRAND_GREEN}08`, borderLeft: `4px solid ${BRAND_GREEN}`, borderRadius: 6, padding: isMobile ? "18px" : "22px 28px", margin: "0 0 8px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12, display: "inline-flex", alignItems: "center" }}>Key Takeaways<GeoNote enabled={showGeoNotes} text="A 'Key Takeaways' block in known semantic format (callout box, ordered list, numbered) is one of the highest-extraction structures for AI engines. ChatGPT specifically recognizes this pattern and uses it as a TL;DR source. Each takeaway is one sentence — engines prefer atomic claims over long paragraphs." /></div>
                <ol style={{ margin: 0, paddingLeft: 22, fontSize: 16, lineHeight: 1.7, color: "#1E293B" }}>
                  <li style={{ marginBottom: 8 }}><strong>Cover the question, don't reference it.</strong> AI engines cite the most complete answer, not the most-linked one.</li>
                  <li style={{ marginBottom: 8 }}><strong>Pick the right room.</strong> A Yedioth section your audience already trusts beats 10 owned-blog posts.</li>
                  <li style={{ marginBottom: 8 }}><strong>Track per-item, not per-domain.</strong> One article can rank for {stat2} queries — measure each.</li>
                  <li><strong>Compound, don't sprint.</strong> Citation rate grows for 6–8 weeks after publish — patience is the moat.</li>
                </ol>
              </div>

              <div style={{ marginBottom: 32, display: "flex", justifyContent: "flex-end" }}>
                <GeoNote enabled={showGeoNotes} text="An ordered numbered-list inside a colored callout block is the single best AI-extractable summary structure. AI engines treat this as the article's distilled takeaway and reuse it as the answer when users ask 'what's the main point of X article'." />
              </div>

              {/* Conclusion */}
              <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: "#0F172A", lineHeight: 1.25, margin: "0 0 14px", display: "inline-flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                The bottom line
                <span style={{ fontWeight: 400, fontSize: 12 }}><GeoNote enabled={showGeoNotes} text="A final summary H2 with a 'bottom line' / 'TL;DR' / 'conclusion' label triggers AI engine recognition of the answer-summary pattern. Engines weight this section as the author's own short answer, and it gets cited at 1.6× the rate of the body when the user query is summary-style." /></span>
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: "0 0 14px" }}>
                The {selectedQueries.length === 1 ? "question above" : `${selectedQueries.length} questions above`} represent {Math.round(stat1 * 1.2)}% of high-intent discovery for {articleBrand.name}'s category. Owning the answer on Yedioth means owning the moment a buyer is most ready to remember a brand name.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#334155", margin: "0 0 8px" }}>
                For more on how {articleBrand.name} approaches {categoriesPresent[0]?.toLowerCase() ?? "this topic"}, visit <a href="#" style={{ color: BRAND_GREEN, fontWeight: 600, textDecoration: "underline" }}>{articleBrand.domain}</a>.<GeoNote enabled={showGeoNotes} text={`Editorial backlink to ${articleBrand.domain} from a publisher-grade domain (Yedioth Ahronoth tier) is worth more than 50 directory or guest-blog backlinks combined. Co-citation with the topic keyword in the surrounding sentence ("approaches ${categoriesPresent[0]?.toLowerCase() ?? "this topic"}") strengthens the brand-topic association in Google's knowledge graph.`} />
              </p>
            </>
          )}
        </div>
      </article>
    </div>
  );
}

// ============================================================
// AGENCY DASHBOARD
// ============================================================

type AgencyTab = "queries" | "order-flow" | "orders" | "tracking";

function AgencyDashboard({ theme, isMobile, orders, setOrders, tracking, getPrice, sites, sections, showToast, scanSource, effectiveBrand, deepLinkedQueryText, deepLinkedQueries, clearDeepLink, articleCredits, setArticleCredits, onOpenBank, setCreditLedger }: { theme: Theme; isMobile: boolean; orders: Order[]; setOrders: (v: Order[]) => void; tracking: ArticleTracking[]; getPrice: (s: PublisherSection) => number; sites: PublisherSite[]; sections: PublisherSection[]; showToast: (text: string, kind?: "success" | "info" | "warn") => void; scanSource?: { domain: string; brand?: string } | null; effectiveBrand: typeof DEMO_BRAND; deepLinkedQueryText?: string | null; deepLinkedQueries?: { id: string; text: string; persona?: string; stage?: string }[] | null; clearDeepLink?: () => void; articleCredits: number; setArticleCredits: React.Dispatch<React.SetStateAction<number>>; onOpenBank: () => void; setCreditLedger: React.Dispatch<React.SetStateAction<CreditLedgerEntry[]>> }) {
  const [tab, setTab] = useState<AgencyTab>("queries");
  const [selectedQueryIds, setSelectedQueryIds] = useState<string[]>([]);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  // Queries that arrived via deep-link from /scan but don't exist in DEMO_QUERIES (different brand).
  // Synthesized into the same shape as DEMO_QUERIES so every consumer (My Queries view, Order Flow
  // matching, ArticlePreview generator) treats them uniformly.
  const [customQueries, setCustomQueries] = useState<typeof DEMO_QUERIES>([]);
  // When the agency arrived from /scan for a specific brand, the canned Bank Hapoalim demo queries
  // are noise — they belong to a different client. Show only the scan-derived queries instead.
  const allQueries = useMemo<typeof DEMO_QUERIES>(() => scanSource ? customQueries : [...customQueries, ...DEMO_QUERIES], [customQueries, scanSource]);

  // Deep-link multi-query: arrives as ?queries=<JSON> from the /scan basket. For each item we either
  // find an existing DEMO_QUERIES entry (rare cross-brand) or synthesize a Query object from the text.
  useEffect(() => {
    if (!deepLinkedQueries || !deepLinkedQueries.length) return;
    const synthesized: typeof DEMO_QUERIES = [];
    const idsToSelect: string[] = [];
    for (const dq of deepLinkedQueries) {
      const lower = dq.text.toLowerCase();
      const existing = DEMO_QUERIES.find((q) => q.text.toLowerCase() === lower);
      if (existing) {
        idsToSelect.push(existing.id);
        continue;
      }
      // Synthesize a Query object — keep IDs prefixed so they don't collide with DEMO_QUERIES
      const lowerText = dq.text.toLowerCase();
      const inferredCategory = lowerText.includes("bank") || lowerText.includes("invest") || lowerText.includes("fund") || lowerText.includes("pension") || lowerText.includes("credit") ? "Finance"
        : lowerText.includes("real estate") || lowerText.includes("mortgage") || lowerText.includes("housing") ? "Real Estate"
        : lowerText.includes("tech") || lowerText.includes("ai") || lowerText.includes("cloud") || lowerText.includes("saas") || lowerText.includes("startup") ? "Tech"
        : lowerText.includes("therapy") || lowerText.includes("therapeutic") || lowerText.includes("riding") || lowerText.includes("horse") ? "Therapy"
        : lowerText.includes("insurance") ? "Insurance"
        : "Editorial";
      synthesized.push({
        id: `scan-${dq.id}`,
        text: dq.text,
        category: inferredCategory,
        audience: dq.persona ? [dq.persona] : ["Decision-makers"],
        gpt: false,
        gemini: false,
        perplexity: false,
        opportunity: 80,
      });
      idsToSelect.push(`scan-${dq.id}`);
    }
    if (synthesized.length) setCustomQueries(synthesized);
    if (idsToSelect.length) {
      setSelectedQueryIds((prev) => {
        const merged = [...prev];
        for (const id of idsToSelect) if (!merged.includes(id) && merged.length < 5) merged.push(id);
        return merged;
      });
      setTab("order-flow");
      showToast(`${idsToSelect.length} ${idsToSelect.length === 1 ? "query" : "queries"} attached from scan — building the article`, "info");
      // Clear basket on the /scan side so the user doesn't double-build
      if (typeof window !== "undefined") {
        try { localStorage.setItem("geoscale-scalepublish-basket", JSON.stringify([])); } catch { /* ignore */ }
      }
    }
    clearDeepLink?.();
  }, [deepLinkedQueries]); // eslint-disable-line react-hooks/exhaustive-deps

  // Legacy single-query deep-link (?queryText=...). Kept for backward compat with old links.
  useEffect(() => {
    if (!deepLinkedQueryText) return;
    const lower = deepLinkedQueryText.toLowerCase();
    const match = DEMO_QUERIES.find((q) => q.text.toLowerCase() === lower)
      ?? DEMO_QUERIES.find((q) => q.text.toLowerCase().includes(lower) || lower.includes(q.text.toLowerCase()));
    if (match) {
      setSelectedQueryIds((prev) => prev.includes(match.id) ? prev : [...prev, match.id].slice(0, 5));
      setTab("order-flow");
      showToast(`Query "${match.text}" attached — building the article`, "info");
    } else {
      // Synthesize for unmatched too (cross-brand deep-link with single ?queryText=)
      const synthId = `scan-text-${Date.now()}`;
      setCustomQueries((prev) => [{ id: synthId, text: deepLinkedQueryText, category: "Editorial", audience: ["Decision-makers"], gpt: false, gemini: false, perplexity: false, opportunity: 80 }, ...prev]);
      setSelectedQueryIds((prev) => prev.length < 5 ? [...prev, synthId] : prev);
      setTab("order-flow");
      showToast(`Query "${deepLinkedQueryText}" attached — building the article`, "info");
    }
    clearDeepLink?.();
  }, [deepLinkedQueryText]); // eslint-disable-line react-hooks/exhaustive-deps

  const myOrdersCount = orders.length;

  const TABS: { key: AgencyTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "queries", label: "My Queries", icon: <IconBookmark size={14} /> },
    { key: "order-flow", label: "Order Flow", icon: <IconCart size={14} />, badge: selectedQueryIds.length },
    { key: "orders", label: "My Orders", icon: <IconInbox size={14} />, badge: myOrdersCount },
    { key: "tracking", label: "Article Tracking", icon: <IconChart size={14} /> },
  ];

  return (
    <>
      {scanSource && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, padding: isMobile ? "14px 16px" : "16px 22px", marginBottom: 18, background: `${BRAND_GREEN}10`, border: `1.5px solid ${BRAND_GREEN}50`, borderLeft: `5px solid ${BRAND_GREEN}`, borderRadius: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", minWidth: 0, flex: 1 }}>
            <Favicon domain={scanSource.domain} size={32} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>External content for</div>
              <div style={{ fontSize: isMobile ? 17 : 19, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>{scanSource.brand ?? scanSource.domain}</div>
              <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4, lineHeight: 1.5 }}>Every order placed here is added as a line item to your client proposal for this brand.</div>
            </div>
          </div>
          <a href={`/scan?domain=${encodeURIComponent(scanSource.domain)}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: BRAND_GREEN, textDecoration: "none", padding: "10px 16px", border: `1.5px solid ${BRAND_GREEN}`, background: theme.cardBg, borderRadius: 8, whiteSpace: "nowrap" }}>← Back to scan</a>
        </div>
      )}
      <SubTabs tabs={TABS} active={tab} onChange={(k) => setTab(k as AgencyTab)} theme={theme} isMobile={isMobile} />
      {tab === "queries" && <AgencyQueriesView theme={theme} isMobile={isMobile} selectedIds={selectedQueryIds} setSelectedIds={setSelectedQueryIds} pinnedIds={pinnedIds} setPinnedIds={setPinnedIds} dismissedIds={dismissedIds} setDismissedIds={setDismissedIds} goToOrderFlow={() => setTab("order-flow")} allQueries={allQueries} customQueryIds={new Set(customQueries.map((q) => q.id))} scanSourceDomain={scanSource?.domain} effectiveBrand={effectiveBrand} />}
      {tab === "order-flow" && <AgencyOrderFlowView theme={theme} isMobile={isMobile} selectedIds={selectedQueryIds} setSelectedIds={setSelectedQueryIds} orders={orders} setOrders={setOrders} getPrice={getPrice} goToOrders={() => setTab("orders")} goToQueries={() => setTab("queries")} sites={sites} sections={sections} showToast={showToast} allQueries={allQueries} effectiveBrand={effectiveBrand} articleCredits={articleCredits} setArticleCredits={setArticleCredits} onOpenBank={onOpenBank} setCreditLedger={setCreditLedger} />}
      {tab === "orders" && <AgencyOrdersView theme={theme} isMobile={isMobile} orders={orders} setOrders={setOrders} sites={sites} sections={sections} agencyName={effectiveBrand.agency} showToast={showToast} />}
      {tab === "tracking" && <AgencyTrackingView theme={theme} isMobile={isMobile} tracking={tracking} sites={sites} sections={sections} showToast={showToast} />}
    </>
  );
}

// ============================================================
// AGENCY · My Queries (multi-select up to 5)
// ============================================================

function AgencyQueriesView({ theme, isMobile, selectedIds, setSelectedIds, pinnedIds, setPinnedIds, dismissedIds, setDismissedIds, goToOrderFlow, allQueries, customQueryIds, scanSourceDomain, effectiveBrand }: { theme: Theme; isMobile: boolean; selectedIds: string[]; setSelectedIds: (v: string[]) => void; pinnedIds: Set<string>; setPinnedIds: (v: Set<string>) => void; dismissedIds: Set<string>; setDismissedIds: (v: Set<string>) => void; goToOrderFlow: () => void; allQueries?: typeof DEMO_QUERIES; customQueryIds?: Set<string>; scanSourceDomain?: string; effectiveBrand?: typeof DEMO_BRAND }) {
  const brand = effectiveBrand ?? DEMO_BRAND;
  const MAX_SELECT = 5;
  const queryPool = allQueries ?? DEMO_QUERIES;
  const customIds = customQueryIds ?? new Set<string>();
  const visibleQueries = queryPool.filter((q) => !dismissedIds.has(q.id));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else if (selectedIds.length < MAX_SELECT) {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const togglePin = (id: string) => {
    const next = new Set(pinnedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setPinnedIds(next);
  };
  const dismiss = (id: string) => {
    const next = new Set(dismissedIds);
    next.add(id);
    setDismissedIds(next);
    setSelectedIds(selectedIds.filter((x) => x !== id));
  };
  const restoreAll = () => setDismissedIds(new Set());

  return (
    <div>
      {/* Banner */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_GREEN}10 0%, ${BRAND_GREEN}03 100%)`, border: `1px solid ${BRAND_GREEN}30`, borderRadius: 12, padding: isMobile ? 16 : 22, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Brand: {brand.name}</div>
        <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Queries with content opportunity</div>
        <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>Pick the queries you want to win. Select up to <strong style={{ color: theme.text }}>5 queries</strong> per article — fewer queries means deeper, higher-quality content. After selecting, you'll see Yedioth Ahronoth sections matched by audience, category, and intent.</div>
      </div>

      {/* Selection count + CTA — sticky, with bullet progress + recommendation */}
      <div style={{ position: "sticky", top: isMobile ? 60 : 72, zIndex: 30, padding: 14, background: selectedIds.length === MAX_SELECT ? `${BRAND_GREEN}10` : selectedIds.length > 0 ? `${BRAND_GREEN}06` : theme.cardBg, border: `1.5px solid ${selectedIds.length === MAX_SELECT ? BRAND_GREEN : selectedIds.length > 0 ? `${BRAND_GREEN}80` : theme.border}`, borderRadius: 11, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", boxShadow: selectedIds.length > 0 ? `0 2px 8px ${BRAND_GREEN}15` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {/* Bullet dots */}
          <div style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
            {Array.from({ length: MAX_SELECT }).map((_, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: i < selectedIds.length ? BRAND_GREEN : "transparent", border: `2px solid ${i < selectedIds.length ? BRAND_GREEN : theme.border}`, transition: "all 0.2s", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                {i < selectedIds.length && <IconCheck size={8} />}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>
              {selectedIds.length === 0 ? "Select up to 5 queries" : <><strong style={{ color: BRAND_GREEN }}>{selectedIds.length}</strong> of {MAX_SELECT} queries selected</>}
            </div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
              {selectedIds.length === 0 && "Pick the questions you want this article to win in AI search."}
              {selectedIds.length === MAX_SELECT && <span style={{ color: BRAND_GREEN, fontWeight: 600 }}>✓ Maximum reached — perfect coverage for one article</span>}
              {selectedIds.length > 0 && selectedIds.length < MAX_SELECT && <>Recommended: <strong style={{ color: theme.text }}>{MAX_SELECT}</strong> queries — pick {MAX_SELECT - selectedIds.length} more for richer content</>}
              {dismissedIds.size > 0 && <span style={{ marginLeft: 10, color: theme.textMuted }}>· {dismissedIds.size} dismissed <button onClick={restoreAll} style={{ background: "none", border: "none", color: BRAND_GREEN, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Restore</button></span>}
            </div>
          </div>
        </div>
        <button onClick={goToOrderFlow} disabled={selectedIds.length === 0} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 700, background: selectedIds.length > 0 ? BRAND_GREEN : theme.barTrack, color: selectedIds.length > 0 ? "#fff" : theme.textMuted, border: "none", borderRadius: 8, cursor: selectedIds.length > 0 ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: selectedIds.length > 0 ? `0 2px 8px ${BRAND_GREEN}40` : "none" }}>
          Next: build article <IconArrowRight size={13} />
        </button>
      </div>

      {/* "Out of queries" warning — fires whenever the user has fewer than 5 queries selected AND every visible query is already chosen (or zero exist). Common case: they came from /scan with a small basket. Gives a one-click path back to the scan's Queries tab to grab more before building. */}
      {selectedIds.length < MAX_SELECT && visibleQueries.length === selectedIds.length && (
        <div style={{ marginBottom: 16, padding: isMobile ? 14 : 18, background: `${BRAND_AMBER}10`, border: `1.5px solid ${BRAND_AMBER}50`, borderLeft: `5px solid ${BRAND_AMBER}`, borderRadius: 11, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: `${BRAND_AMBER}20`, color: BRAND_AMBER, flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 4 }}>
              {selectedIds.length === 0 ? (visibleQueries.length === 0 ? "No queries available" : "No queries selected yet") : `Only ${selectedIds.length} of ${MAX_SELECT} recommended queries`}
            </div>
            <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.5 }}>
              {selectedIds.length === 0 && visibleQueries.length === 0
                ? <>There are no queries to pick from in this view. Articles need queries to target — head back to the scan and queue some questions you want this brand to win.</>
                : <>You've selected every query available here. We recommend <strong style={{ color: theme.text }}>{MAX_SELECT} queries per article</strong> for full GEO coverage — each query becomes one H2 section, and {MAX_SELECT} sections is what AI engines need to crown your article the canonical answer. Go back to the scan to add more queries to your basket.</>
              }
            </div>
          </div>
          {scanSourceDomain ? (
            <a href={`/scan?domain=${encodeURIComponent(scanSourceDomain)}&tab=queries`} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 18px", fontSize: 14, fontWeight: 700, background: BRAND_AMBER, color: "#fff", border: "none", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><IconArrowRight size={13} /></span>
              Back to scan to add more
            </a>
          ) : dismissedIds.size > 0 ? (
            <button onClick={restoreAll} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 18px", fontSize: 14, fontWeight: 700, background: BRAND_AMBER, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              Restore {dismissedIds.size} dismissed {dismissedIds.size === 1 ? "query" : "queries"}
            </button>
          ) : (
            <a href="/scan?tab=queries" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 18px", fontSize: 14, fontWeight: 700, background: BRAND_AMBER, color: "#fff", border: "none", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><IconArrowRight size={13} /></span>
              Run a scan to add more
            </a>
          )}
        </div>
      )}

      {/* Query cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visibleQueries.map((q) => {
          const isSelected = selectedIds.includes(q.id);
          const isPinned = pinnedIds.has(q.id);
          const canSelect = selectedIds.length < MAX_SELECT || isSelected;
          return (
            <div key={q.id} style={{ background: theme.cardBg, border: `1px solid ${isSelected ? BRAND_GREEN : theme.border}`, borderRadius: 11, padding: isMobile ? 12 : 16, display: "flex", alignItems: "flex-start", gap: 14 }}>
              <button onClick={() => toggleSelect(q.id)} disabled={!canSelect} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isSelected ? BRAND_GREEN : theme.border}`, background: isSelected ? BRAND_GREEN : "transparent", color: "#fff", cursor: canSelect ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, opacity: canSelect ? 1 : 0.4 }}>
                {isSelected && <IconCheck size={11} />}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: theme.text, marginBottom: 6 }}>{q.text}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <Pill bg={`${BRAND_BLUE}15`} color={BRAND_BLUE}>{q.category}</Pill>
                  {q.audience.slice(0, 2).map((a) => <Pill key={a} bg={`${theme.textMuted}20`} color={theme.textSecondary} small>{a}</Pill>)}
                  <span style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 6 }}>
                    {q.gpt ? <span style={{ color: BRAND_GREEN, fontWeight: 600 }}>GPT ✓</span> : <span style={{ color: theme.textMuted }}>GPT ✗</span>} ·
                    {q.gemini ? <span style={{ color: BRAND_GREEN, fontWeight: 600 }}> Gemini ✓</span> : <span style={{ color: theme.textMuted }}> Gemini ✗</span>}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>OPPORTUNITY</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: q.opportunity >= 80 ? BRAND_GREEN : q.opportunity >= 60 ? BRAND_AMBER : theme.textSecondary }}>{q.opportunity}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => togglePin(q.id)} title={isPinned ? "Unpin" : "Pin"} style={{ padding: 7, background: isPinned ? `${BRAND_AMBER}15` : "transparent", border: `1px solid ${isPinned ? BRAND_AMBER : theme.border}`, color: isPinned ? BRAND_AMBER : theme.textSecondary, borderRadius: 6, cursor: "pointer", display: "inline-flex" }}>
                    <IconBookmark size={13} filled={isPinned} />
                  </button>
                  <button onClick={() => dismiss(q.id)} title="Dismiss" style={{ padding: 7, background: "transparent", border: `1px solid ${theme.border}`, color: theme.textSecondary, borderRadius: 6, cursor: "pointer", display: "inline-flex" }}>
                    <IconX size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleQueries.length === 0 && (
        <div style={{ padding: 60, textAlign: "center", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>All queries dismissed</div>
          <button onClick={restoreAll} style={{ marginTop: 10, padding: "8px 16px", background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Restore all</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// AGENCY · Order Flow (matching sites + cart + submit)
// ============================================================

function AgencyOrderFlowView({ theme, isMobile, selectedIds, setSelectedIds, orders, setOrders, getPrice, goToOrders, goToQueries, sites, sections, showToast, allQueries, effectiveBrand, articleCredits, setArticleCredits, onOpenBank, setCreditLedger }: { theme: Theme; isMobile: boolean; selectedIds: string[]; setSelectedIds: (v: string[]) => void; orders: Order[]; setOrders: (v: Order[]) => void; getPrice: (s: PublisherSection) => number; goToOrders: () => void; goToQueries: () => void; sites: PublisherSite[]; sections: PublisherSection[]; showToast: (text: string, kind?: "success" | "info" | "warn") => void; allQueries?: typeof DEMO_QUERIES; effectiveBrand?: typeof DEMO_BRAND; articleCredits: number; setArticleCredits: React.Dispatch<React.SetStateAction<number>>; onOpenBank: () => void; setCreditLedger: React.Dispatch<React.SetStateAction<CreditLedgerEntry[]>> }) {
  const queryPool = allQueries ?? DEMO_QUERIES;
  const brand = effectiveBrand ?? DEMO_BRAND;
  const selectedQueries = queryPool.filter((q) => selectedIds.includes(q.id));

  const [title, setTitle] = useState<string>("");
  const [contentMode, setContentMode] = useState<"empty" | "generate">("generate");
  const [cartSectionIds, setCartSectionIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // I-provide-copy mode editor state (per Inna call 2026-05-05)
  const [providedCopy, setProvidedCopy] = useState<string>("");
  const [copyView, setCopyView] = useState<"visual" | "code">("visual");
  const [aiScanRunning, setAiScanRunning] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<{ covered: { query: string; coverage: number }[]; missing: { query: string }[]; recommendations: string[] } | null>(null);
  // AI-draft body editor — agency can override AI-generated section text (title stays locked)
  const [draftEdits, setDraftEdits] = useState<Record<string, string>>({});
  const [editDraftMode, setEditDraftMode] = useState(false);
  // Submit success simulation (SMS to publisher director)
  const [smsSimulation, setSmsSimulation] = useState<{ to: string; body: string; sentAt: string } | null>(null);
  // Order summary for after-submit screen (so we can keep showing the SMS card)
  const [submittedOrderRef, setSubmittedOrderRef] = useState<{ id: string; total: number } | null>(null);
  // Publisher-site filter (Step 4): empty Set = show all sites; non-empty = restrict to chosen sites.
  const [siteFilter, setSiteFilter] = useState<Set<string>>(new Set());
  // Category (תחום) filter (Step 4): empty Set = all categories; non-empty = restrict by section category.
  const [categoryFilter, setCategoryFilter] = useState<Set<string>>(new Set());
  // Wizard step (1..5). Each step has its own panel + Back/Continue footer.
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  // Backlink (Alexei 2026-05-05): every article ALWAYS carries a do-follow link. Agency picks the
  // target URL (defaults to brand homepage) + anchor text (defaults to brand name).
  const [backlinkUrl, setBacklinkUrl] = useState<string>("");
  const [backlinkAnchor, setBacklinkAnchor] = useState<string>("");
  // Payment method selected at checkout. "cash" = invoice. "credits" = redeem from article-bank.
  // "hybrid" = mix when cart count > available balance (some sections billed in cash).
  const [payMethod, setPayMethod] = useState<"cash" | "credits" | "hybrid">("cash");

  // Auto-suggest title from first query
  useEffect(() => {
    if (selectedQueries.length > 0 && !title) {
      const base = selectedQueries[0].text;
      setTitle(`${base} — ${brand.name}'s complete 2026 guide`);
    }
  }, [selectedQueries.length, brand.name]);

  // Brand audience inference
  const brandAudience: AudienceTag[] = ["B2C", "B2B", "Decision-makers", "Affluent", "Mass market"];

  // Title-derived keywords for re-ranking
  const titleKeywords = useMemo(() => {
    const stop = new Set(["the", "and", "for", "with", "from", "this", "that", "complete", "guide", "best", "how", "what", "why", "ב", "של", "על", "את", "כל", "מה", "איך", "לי", "אני"]);
    return title.toLowerCase().split(/[\s\-—,·.]+/).filter((w) => w.length >= 3 && !stop.has(w)).slice(0, 8);
  }, [title]);

  // Compute matched sections — title affects ranking
  const matchedSections = useMemo(() => {
    if (selectedQueries.length === 0) return [];
    return sections
      .map((sec) => {
        const { score, reasons } = calculateMatch(sec, selectedQueries, { audience: brandAudience });
        // Title boost: each keyword found in section name/category adds to score
        let titleBoost = 0;
        const titleHits: string[] = [];
        for (const kw of titleKeywords) {
          if (sec.name.toLowerCase().includes(kw) || sec.category.toLowerCase().includes(kw)) {
            titleBoost += 8;
            titleHits.push(kw);
          }
        }
        const finalReasons = [...reasons];
        if (titleHits.length > 0) {
          finalReasons.unshift({ type: "query" as const, label: `Title: ${titleHits.slice(0, 2).join(", ")}` });
        }
        return { section: sec, score: Math.min(100, score + titleBoost), reasons: finalReasons };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [selectedQueries, titleKeywords, sections]);

  const cart = matchedSections.filter((m) => cartSectionIds.includes(m.section.id));
  const cartTotal = cart.reduce((s, m) => s + getPrice(m.section), 0);
  // Payment math: each cart section costs 1 credit. If credits cover all sections, pay 100% in
  // credits (cash = 0). Otherwise hybrid: spend N credits, bill remaining sections in cash.
  const cartCreditCount = cart.length; // each section = 1 article = 1 credit
  const creditsAvailable = articleCredits;
  const canPayAllCredits = creditsAvailable >= cartCreditCount && cartCreditCount > 0;
  // Computed payment breakdown based on selected method
  const paymentBreakdown = useMemo(() => {
    if (cartCreditCount === 0) return { creditsUsed: 0, cashAmount: cartTotal };
    if (payMethod === "cash") return { creditsUsed: 0, cashAmount: cartTotal };
    if (payMethod === "credits" && canPayAllCredits) return { creditsUsed: cartCreditCount, cashAmount: 0 };
    // hybrid (or credits-when-insufficient): apply available credits to highest-priced sections first
    const sortedByPriceDesc = [...cart].sort((a, b) => getPrice(b.section) - getPrice(a.section));
    const creditsUsed = Math.min(creditsAvailable, cartCreditCount);
    const sectionsCovered = sortedByPriceDesc.slice(0, creditsUsed);
    const cashSectionsCost = cart.filter((m) => !sectionsCovered.some((c) => c.section.id === m.section.id)).reduce((s, m) => s + getPrice(m.section), 0);
    return { creditsUsed, cashAmount: cashSectionsCost };
  }, [payMethod, cartCreditCount, creditsAvailable, cartTotal, cart, canPayAllCredits, getPrice]);
  // Auto-correct invalid pay method when credits change or cart changes
  useEffect(() => {
    if (payMethod === "credits" && !canPayAllCredits) {
      setPayMethod(creditsAvailable > 0 && cartCreditCount > 0 ? "hybrid" : "cash");
    }
  }, [canPayAllCredits, creditsAvailable, cartCreditCount, payMethod]);

  const toggleCart = (id: string) => {
    if (cartSectionIds.includes(id)) {
      setCartSectionIds(cartSectionIds.filter((x) => x !== id));
    } else {
      setCartSectionIds([...cartSectionIds, id]);
    }
  };

  const submitOrder = () => {
    setSubmitting(true);
    setTimeout(() => {
      // Backlink defaults: if URL blank → brand homepage. If anchor blank → brand name.
      const finalBacklinkUrl = backlinkUrl.trim() || `https://${brand.domain}`;
      const finalAnchorText = backlinkAnchor.trim() || brand.name;
      const newOrder: Order = {
        id: `ord-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        agencyName: brand.agency,
        agencyContact: brand.agencyContact,
        brand: brand.name,
        brandDomain: brand.domain,
        queries: selectedQueries.map((q) => q.text),
        title,
        contentMode,
        sections: cart.map((m) => ({ sectionId: m.section.id, siteId: m.section.siteId, price: getPrice(m.section) })),
        totalPrice: cartTotal,
        status: "pending",
        backlink: { targetUrl: finalBacklinkUrl, anchorText: finalAnchorText },
        payment: { method: payMethod, creditsUsed: paymentBreakdown.creditsUsed, cashAmount: paymentBreakdown.cashAmount },
      };
      setOrders([newOrder, ...orders]);
      // Deduct credits from balance now and log a ledger entry so publisher + agency see history
      if (paymentBreakdown.creditsUsed > 0) {
        setArticleCredits((prev) => Math.max(0, prev - paymentBreakdown.creditsUsed));
        setCreditLedger((prev) => [{ id: `ledger-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), delta: -paymentBreakdown.creditsUsed, reason: `Order ${newOrder.id.toUpperCase()} · ${cart.length} placement${cart.length === 1 ? "" : "s"}`, by: "system" }, ...prev]);
      }
      // Static SMS simulation (per Alexei's request — live demo gold for the Ynet meeting)
      const siteNames = Array.from(new Set(cart.map((m) => sites.find((s) => s.id === m.section.siteId)?.name).filter(Boolean))).join(", ");
      const payLabel = paymentBreakdown.creditsUsed > 0 ? `\nPayment: ${paymentBreakdown.creditsUsed} credits${paymentBreakdown.cashAmount > 0 ? ` + ${fmtNIS(paymentBreakdown.cashAmount)} cash` : ""}` : `\nPayment: ${fmtNIS(cartTotal)} cash`;
      const smsBody = `Geoscale ScalePublish · New order #${newOrder.id.toUpperCase()}\nAgency: ${brand.agency} (acting for ${brand.name})\nSites: ${siteNames}\nSections: ${cart.length} · Total: ${fmtNIS(cartTotal)}${payLabel}\nReview at geoscale.ai/publisher`;
      setSmsSimulation({ to: "+972-50-XXX-XXXX (Alexei · Yedioth)", body: smsBody, sentAt: new Date().toISOString() });
      setSubmittedOrderRef({ id: newOrder.id, total: cartTotal });
      setSubmitting(false);
      setSubmitted(true);
      const creditsMsg = paymentBreakdown.creditsUsed > 0 ? ` · ${paymentBreakdown.creditsUsed} credits redeemed` : "";
      showToast(`Order ${newOrder.id.toUpperCase()} sent to Yedioth${creditsMsg} · SMS dispatched`, "success");
    }, 800);
  };

  if (selectedQueries.length === 0 && !submitted) {
    return (
      <div style={{ padding: 60, textAlign: "center", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, marginBottom: 6 }}>No queries selected</div>
        <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 16 }}>Pick up to 5 queries from "My Queries" to begin building your article order.</div>
        <button onClick={goToQueries} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Go to My Queries</button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ padding: isMobile ? 32 : 60, textAlign: "center", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${BRAND_GREEN}20`, color: BRAND_GREEN, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <IconCheck size={28} />
          </div>
          <div style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Order submitted to Yedioth Ahronoth</div>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 18, maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>Yedioth's sales team will contact <strong style={{ color: theme.text }}>{brand.agencyContact}</strong> to confirm and collect payment. Estimated upload time: ~3 days per article. Tracking will appear under "Article Tracking" once published.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setSubmitted(false); setSmsSimulation(null); setSubmittedOrderRef(null); setSelectedIds([]); setCartSectionIds([]); setTitle(""); goToOrders(); }} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>View my orders</button>
            <button onClick={() => { setSubmitted(false); setSmsSimulation(null); setSubmittedOrderRef(null); setSelectedIds([]); setCartSectionIds([]); setTitle(""); goToQueries(); }} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer" }}>Place another order</button>
          </div>
        </div>

        {/* Live SMS simulation — shown for Ynet demo per Alexei's ask */}
        {smsSimulation && (
          <SmsSentCard sms={smsSimulation} theme={theme} isMobile={isMobile} orderRef={submittedOrderRef} />
        )}
      </div>
    );
  }

  // Wizard steps metadata for the progress header. Per agreement with Inna (call 2026-05-05),
  // Sites is now step 3 (BEFORE content) so the content engine can tailor copy per chosen site.
  const STEPS = [
    { num: 1, label: "Queries" },
    { num: 2, label: "Title" },
    { num: 3, label: "Sections" },
    { num: 4, label: "Content" },
    { num: 5, label: "Review" },
  ] as const;
  const canContinue = (() => {
    if (currentStep === 1) return selectedQueries.length > 0;
    if (currentStep === 2) return title.trim().length > 3;
    if (currentStep === 3) return cart.length > 0;
    if (currentStep === 4) return true;
    return false;
  })();
  const goNext = () => { if (currentStep < 5) setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4 | 5); };
  const goPrev = () => { if (currentStep > 1) setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4 | 5); };

  return (
    <div>
      {/* Wizard progress bar — clickable steps so users can jump back to anything they've completed */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? "12px 10px" : "14px 18px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 8, flexWrap: "wrap" }}>
          {STEPS.map((s, i) => {
            const isActive = currentStep === s.num;
            const isPast = currentStep > s.num;
            return (
              <React.Fragment key={s.num}>
                <button onClick={() => { if (isPast || isActive) setCurrentStep(s.num as 1 | 2 | 3 | 4 | 5); }} disabled={!isPast && !isActive} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: isMobile ? "6px 8px" : "7px 12px", background: isActive ? `${BRAND_GREEN}10` : "transparent", border: `1px solid ${isActive ? BRAND_GREEN : "transparent"}`, borderRadius: 8, cursor: isPast || isActive ? "pointer" : "default", opacity: isPast || isActive ? 1 : 0.55 }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: isPast ? BRAND_GREEN : isActive ? BRAND_GREEN : theme.barTrack, color: isPast || isActive ? "#fff" : theme.textMuted, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{isPast ? <IconCheck size={11} /> : s.num}</span>
                  <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: isActive ? 700 : 500, color: isActive ? theme.text : theme.textSecondary }}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <span style={{ flex: isMobile ? "0 0 8px" : "0 0 18px", height: 1, background: currentStep > s.num ? BRAND_GREEN : theme.border }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1 · Selected queries */}
      {currentStep === 1 && (
      <>
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 18, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>Step 1 · Confirm your selected queries</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: BRAND_GREEN }}>{selectedQueries.length}</span>
            <span style={{ fontSize: 13, color: theme.textSecondary }}>of 5 {selectedQueries.length < 5 && <span style={{ color: BRAND_AMBER, fontWeight: 600 }}>· {5 - selectedQueries.length} more recommended</span>}</span>
          </div>
        </div>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {selectedQueries.map((q, i) => (
            <li key={q.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: `${BRAND_GREEN}06`, border: `1px solid ${BRAND_GREEN}25`, borderRadius: 9 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: BRAND_GREEN, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0, fontSize: 14, color: theme.text, fontWeight: 500 }}>{q.text}</div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <Pill bg={`${BRAND_BLUE}15`} color={BRAND_BLUE} small>{q.category}</Pill>
                <button onClick={() => setSelectedIds(selectedIds.filter((x) => x !== q.id))} title="Remove" style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", padding: 4, display: "inline-flex", borderRadius: 4 }}>
                  <IconX size={13} />
                </button>
              </div>
            </li>
          ))}
        </ol>
        {selectedQueries.length < 5 && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: `${BRAND_AMBER}10`, border: `1px solid ${BRAND_AMBER}40`, borderRadius: 9, fontSize: 13, color: theme.text, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240, lineHeight: 1.5 }}>
              <strong style={{ color: theme.text }}>You have {selectedQueries.length} {selectedQueries.length === 1 ? "query" : "queries"} of 5.</strong> {5 - selectedQueries.length} more would let GPT/Gemini cover this topic from {5 - selectedQueries.length} more angles. You can continue, or go back and add more.
            </div>
            <button onClick={goToQueries} style={{ padding: "8px 14px", fontSize: 13, fontWeight: 700, background: BRAND_AMBER, color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><IconArrowRight size={12} /></span> Back to My Queries
            </button>
          </div>
        )}
      </div>

      {/* Article preview — visible from step 1 so user sees the live editorial draft as they confirm */}
      <ArticlePreview title={title} selectedQueries={selectedQueries} theme={theme} isMobile={isMobile} brand={brand} />
      </>
      )}

      {/* STEP 2 · Title */}
      {currentStep === 2 && (
      <>
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 18, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>Step 2 · Article title (auto-suggested, editable)</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter article title in Hebrew or English..." style={{ width: "100%", padding: "12px 14px", fontSize: 15, fontWeight: 600, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box" }} />
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>Editing the title re-evaluates which Yedioth sections are the best fit. The article preview below updates live.</div>
      </div>
      <ArticlePreview title={title} selectedQueries={selectedQueries} theme={theme} isMobile={isMobile} brand={brand} />
      </>
      )}

      {/* STEP 3 · Pick Yedioth sections (now BEFORE content — per call with Inna 2026-05-05) */}
      {currentStep === 3 && (
      <div style={{ marginBottom: 18 }}>
        {/* Backlink panel — every article carries a do-follow link by default. The agency just */}
        {/* picks the destination. URL defaults to brand homepage; anchor defaults to brand name. */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 18, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 4 }}>Backlink destination</div>
              <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.5 }}>Every article includes one do-follow link to your client's site. Pick where it points and what it says. Optional — leave blank to default to <strong style={{ color: theme.text }}>{brand.domain}</strong> with anchor "{brand.name}".</div>
            </div>
            <div style={{ padding: "5px 11px", fontSize: 11, fontWeight: 700, color: BRAND_GREEN, background: `${BRAND_GREEN}15`, borderRadius: 999, letterSpacing: 0.6, whiteSpace: "nowrap" }}>Always do-follow</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.textSecondary, display: "block", marginBottom: 4 }}>Target URL <span style={{ color: theme.textMuted, fontWeight: 400 }}>· optional</span></label>
              <input value={backlinkUrl} onChange={(e) => setBacklinkUrl(e.target.value)} placeholder={`https://${brand.domain}`} type="url" style={{ width: "100%", padding: "10px 12px", fontSize: 14, fontFamily: "monospace", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.textSecondary, display: "block", marginBottom: 4 }}>Anchor text <span style={{ color: theme.textMuted, fontWeight: 400 }}>· optional</span></label>
              <input value={backlinkAnchor} onChange={(e) => setBacklinkAnchor(e.target.value)} placeholder={brand.name} style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 8, lineHeight: 1.5 }}>The publisher embeds the link once per article in the 2nd or 3rd paragraph for natural placement. No price impact — backlinks are standard on every article.</div>
        </div>
        {/* AI top-3 site recommendations banner */}
        {matchedSections.length >= 3 && (() => {
          const top3 = matchedSections.slice(0, 3);
          const allSelected = top3.every((m) => cartSectionIds.includes(m.section.id));
          return (
            <div style={{ padding: isMobile ? 14 : 18, marginBottom: 12, background: `linear-gradient(135deg, ${BRAND_GREEN}10, ${BRAND_BLUE}08)`, border: `1.5px solid ${BRAND_GREEN}40`, borderLeft: `5px solid ${BRAND_GREEN}`, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 5 }}>AI recommends · top 3 fit</div>
                  <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: theme.text, marginBottom: 6, lineHeight: 1.4 }}>Based on your queries, brand audience, and article title — these 3 are the strongest fit:</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {top3.map((m) => {
                      const site = sites.find((s) => s.id === m.section.siteId);
                      if (!site) return null;
                      return (
                        <div key={m.section.id} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 11px", background: theme.cardBg, border: `1px solid ${BRAND_GREEN}50`, borderRadius: 8 }}>
                          <Favicon domain={site.domain} size={16} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{site.name}</span>
                          <span style={{ fontSize: 12, color: theme.textSecondary }}>· {m.section.name}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: BRAND_GREEN, marginLeft: 4 }}>{m.score}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button onClick={() => setCartSectionIds(allSelected ? cartSectionIds.filter((id) => !top3.some((m) => m.section.id === id)) : Array.from(new Set([...cartSectionIds, ...top3.map((m) => m.section.id)])))} style={{ padding: "10px 18px", fontSize: 13, fontWeight: 700, background: allSelected ? "transparent" : BRAND_GREEN, color: allSelected ? BRAND_GREEN : "#fff", border: `1.5px solid ${BRAND_GREEN}`, borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {allSelected ? "✓ Top 3 selected" : "Use AI's pick"}
                </button>
              </div>
            </div>
          );
        })()}
        {/* Multi-site warning — fires when 2+ sites are added to the cart */}
        {(() => {
          const cartSiteIds = new Set(cart.map((m) => m.section.siteId));
          if (cartSiteIds.size < 2) return null;
          const cartSiteNames = Array.from(cartSiteIds).map((id) => sites.find((s) => s.id === id)?.name).filter(Boolean);
          return (
            <div style={{ padding: isMobile ? 14 : 16, marginBottom: 12, background: `${BRAND_AMBER}10`, border: `1.5px solid ${BRAND_AMBER}50`, borderLeft: `5px solid ${BRAND_AMBER}`, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: BRAND_AMBER, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, fontWeight: 700 }}>!</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: BRAND_AMBER, marginBottom: 4 }}>Multi-site order · each site gets a uniquely-rewritten article</div>
                  <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.55, marginBottom: 6 }}>You've selected sections across <strong>{cartSiteIds.size} sites</strong> ({cartSiteNames.join(" + ")}). Same intent, different wording — every query is rephrased and every answer reworded so each site gets its own version.</div>
                  <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.5 }}><strong style={{ color: theme.text }}>Why:</strong> Google penalizes duplicate content across domains. Same article on multiple sites = wasted spend. We rewrite per site so each placement keeps its own SEO value.</div>
                </div>
              </div>
            </div>
          );
        })()}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>Step 3 · Yedioth sections matched to your queries (sorted by fit)</div>
          <div style={{ fontSize: 13, color: theme.textSecondary }}>{(() => { const visible = matchedSections.filter((m) => (siteFilter.size === 0 || siteFilter.has(m.section.siteId)) && (categoryFilter.size === 0 || categoryFilter.has(m.section.category))); return `${visible.length} of ${matchedSections.length} matches · ${cartSectionIds.length} selected`; })()}</div>
        </div>
        {/* Site filter chips — let agency narrow to specific Yedioth properties (Ynet, Calcalist, Mako…) */}
        {sites.length > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 8, padding: 10, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginRight: 4 }}>Site</span>
            <button onClick={() => setSiteFilter(new Set())} style={{ padding: "6px 12px", fontSize: 13, fontWeight: 600, background: siteFilter.size === 0 ? BRAND_GREEN : "transparent", color: siteFilter.size === 0 ? "#fff" : theme.textSecondary, border: `1px solid ${siteFilter.size === 0 ? BRAND_GREEN : theme.border}`, borderRadius: 6, cursor: "pointer" }}>All sites</button>
            {sites.map((s) => {
              const active = siteFilter.has(s.id);
              const matchCount = matchedSections.filter((m) => m.section.siteId === s.id).length;
              if (matchCount === 0) return null;
              return (
                <button key={s.id} onClick={() => { const next = new Set(siteFilter); if (active) next.delete(s.id); else next.add(s.id); setSiteFilter(next); }} style={{ padding: "6px 12px", fontSize: 13, fontWeight: 600, background: active ? BRAND_GREEN : "transparent", color: active ? "#fff" : theme.textSecondary, border: `1px solid ${active ? BRAND_GREEN : theme.border}`, borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Favicon domain={s.domain} size={14} />
                  {s.name}
                  <span style={{ fontSize: 11, color: active ? "#ffffffcc" : theme.textMuted }}>({matchCount})</span>
                </button>
              );
            })}
          </div>
        )}
        {/* Category (תחום) filter chips — narrow by editorial vertical (Tech, Finance, Real Estate, Lifestyle…) */}
        {(() => {
          const cats = Array.from(new Set(matchedSections.map((m) => m.section.category)));
          if (cats.length <= 1) return null;
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 10, padding: 10, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginRight: 4 }}>Category · תחום</span>
              <button onClick={() => setCategoryFilter(new Set())} style={{ padding: "6px 12px", fontSize: 13, fontWeight: 600, background: categoryFilter.size === 0 ? BRAND_BLUE : "transparent", color: categoryFilter.size === 0 ? "#fff" : theme.textSecondary, border: `1px solid ${categoryFilter.size === 0 ? BRAND_BLUE : theme.border}`, borderRadius: 6, cursor: "pointer" }}>All categories</button>
              {cats.map((c) => {
                const active = categoryFilter.has(c);
                const matchCount = matchedSections.filter((m) => m.section.category === c).length;
                return (
                  <button key={c} onClick={() => { const next = new Set(categoryFilter); if (active) next.delete(c); else next.add(c); setCategoryFilter(next); }} style={{ padding: "6px 12px", fontSize: 13, fontWeight: 600, background: active ? BRAND_BLUE : "transparent", color: active ? "#fff" : theme.textSecondary, border: `1px solid ${active ? BRAND_BLUE : theme.border}`, borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    {c}
                    <span style={{ fontSize: 11, color: active ? "#ffffffcc" : theme.textMuted }}>({matchCount})</span>
                  </button>
                );
              })}
            </div>
          );
        })()}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
          {matchedSections.filter((m) => (siteFilter.size === 0 || siteFilter.has(m.section.siteId)) && (categoryFilter.size === 0 || categoryFilter.has(m.section.category))).slice(0, 18).map((m, i, arr) => {
            const site = sites.find((s) => s.id === m.section.siteId);
            if (!site) return null;
            const inCart = cartSectionIds.includes(m.section.id);
            return (
              <div key={m.section.id} style={{ borderBottom: i < Math.min(17, arr.length - 1) ? `1px solid ${theme.border}` : "none", padding: isMobile ? 12 : 16, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", background: inCart ? `${BRAND_GREEN}05` : "transparent" }}>
                <div style={{ width: 36, fontSize: 14, fontWeight: 700, color: theme.textSecondary, flexShrink: 0 }}>#{i + 1}</div>
                <Favicon domain={site.domain} size={26} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{site.name}</span>
                    <span style={{ color: theme.textMuted }}>·</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{m.section.name}</span>
                    <span style={{ fontSize: 13, color: theme.textSecondary, direction: "rtl" }}>{m.section.hebrewName}</span>
                  </div>
                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {m.reasons.map((r, ri) => {
                      const styles = r.type === "audience" ? { bg: `${BRAND_GREEN}15`, color: BRAND_GREEN } : r.type === "category" ? { bg: `${BRAND_BLUE}15`, color: BRAND_BLUE } : { bg: `${BRAND_AMBER}15`, color: BRAND_AMBER };
                      return <Pill key={ri} bg={styles.bg} color={styles.color}>{r.label}</Pill>;
                    })}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: theme.textMuted, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span>{fmtNum(m.section.monthlyReadership)} readers</span>
                    <span>·</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><IconClock size={11} /> ~{m.section.estimatedUploadDays} days upload</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    MATCH SCORE
                    <span title={`How well this site/section matches your queries, brand audience, and article title. ${m.score >= 70 ? "Strong match — recommended." : m.score >= 40 ? "Decent match." : "Weak match — consider another section."}`} style={{ display: "inline-flex", cursor: "help", color: theme.textMuted }}>ⓘ</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: m.score >= 70 ? BRAND_GREEN : m.score >= 40 ? BRAND_AMBER : theme.textSecondary }}>{m.score}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, minWidth: 100 }}>
                  <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>PRICE</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>{fmtNIS(getPrice(m.section))}</div>
                </div>
                <button onClick={() => toggleCart(m.section.id)} style={{ padding: "9px 16px", fontSize: 13, fontWeight: 700, background: inCart ? BRAND_GREEN : "transparent", color: inCart ? "#fff" : theme.text, border: `1.5px solid ${inCart ? BRAND_GREEN : theme.border}`, borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {inCart ? <><IconCheck size={12} /> Added</> : <><IconPlus size={12} /> Add</>}
                </button>
              </div>
            );
          })}
          {matchedSections.filter((m) => (siteFilter.size === 0 || siteFilter.has(m.section.siteId)) && (categoryFilter.size === 0 || categoryFilter.has(m.section.category))).length === 0 && (
            <div style={{ padding: 24, textAlign: "center", fontSize: 14, color: theme.textSecondary }}>
              No sections match the current filters. <button onClick={() => { setSiteFilter(new Set()); setCategoryFilter(new Set()); }} style={{ background: "none", border: "none", color: BRAND_GREEN, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* STEP 4 · Content mode (now AFTER sections, so each site can get its own tailored draft) */}
      {currentStep === 4 && (
      <ContentStep
        theme={theme}
        isMobile={isMobile}
        contentMode={contentMode}
        setContentMode={setContentMode}
        cart={cart}
        sites={sites}
        title={title}
        selectedQueries={selectedQueries}
        brand={brand}
        providedCopy={providedCopy}
        setProvidedCopy={setProvidedCopy}
        copyView={copyView}
        setCopyView={setCopyView}
        aiScanRunning={aiScanRunning}
        setAiScanRunning={setAiScanRunning}
        aiScanResult={aiScanResult}
        setAiScanResult={setAiScanResult}
        draftEdits={draftEdits}
        setDraftEdits={setDraftEdits}
        editDraftMode={editDraftMode}
        setEditDraftMode={setEditDraftMode}
        showToast={showToast}
      />
      )}

      {/* STEP 5 · Review & submit */}
      {currentStep === 5 && (
      <div style={{ background: theme.cardBg, border: `1.5px solid ${cart.length > 0 ? BRAND_GREEN : theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 22 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Step 5 · Review &amp; submit</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div style={{ padding: 14, background: theme.tableHeaderBg, borderRadius: 9 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Brand &amp; Article</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{brand.name}</div>
            <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.5 }}>{title || <em style={{ color: BRAND_AMBER }}>(no title yet — go back to step 2)</em>}</div>
          </div>
          <div style={{ padding: 14, background: theme.tableHeaderBg, borderRadius: 9 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Queries &amp; Content</div>
            <div style={{ fontSize: 14, color: theme.text, fontWeight: 600 }}>{selectedQueries.length} {selectedQueries.length === 1 ? "query" : "queries"} selected</div>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 3 }}>{contentMode === "generate" ? "AI-generated draft, editor-reviewed" : "Agency-provided copy"}</div>
          </div>
        </div>
        {cart.length === 0 ? (
          <div style={{ fontSize: 14, color: theme.textSecondary, textAlign: "center", padding: 20, background: `${BRAND_AMBER}10`, border: `1px solid ${BRAND_AMBER}40`, borderRadius: 9 }}>
            <strong style={{ color: BRAND_AMBER }}>No sections selected yet.</strong> Go back to Step 3 to add Yedioth sections to this order.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Yedioth sections in this order</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {cart.map((m) => {
                const site = sites.find((s) => s.id === m.section.siteId);
                if (!site) return null;
                return (
                  <div key={m.section.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.tableHeaderBg }}>
                    <Favicon domain={site.domain} size={20} />
                    <div style={{ flex: 1, fontSize: 14, color: theme.text, fontWeight: 600 }}>{site.name} <span style={{ color: theme.textSecondary, fontWeight: 400 }}>· {m.section.name}</span></div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{fmtNIS(getPrice(m.section))}</div>
                  </div>
                );
              })}
            </div>
            {/* Backlink summary — preview of what publisher will embed */}
            <div style={{ marginBottom: 14, padding: "10px 14px", background: theme.tableHeaderBg, borderRadius: 9 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Do-follow backlink (every article)</div>
              <div style={{ fontSize: 13.5, color: theme.text, lineHeight: 1.5 }}>
                <span style={{ fontFamily: "monospace", color: BRAND_BLUE, wordBreak: "break-all" }}>{backlinkUrl.trim() || `https://${brand.domain}`}</span>
                <span style={{ color: theme.textMuted, margin: "0 8px" }}>·</span>
                anchor: <strong>"{backlinkAnchor.trim() || brand.name}"</strong>
              </div>
            </div>
            {/* Pricing summary */}
            <div style={{ marginBottom: 14, padding: "12px 14px", background: `${BRAND_GREEN}06`, border: `1px solid ${BRAND_GREEN}25`, borderRadius: 9, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <span style={{ fontSize: 13, color: theme.textSecondary }}>{cart.length} {cart.length === 1 ? "section" : "sections"} · {selectedQueries.length} queries · 1 article</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Total</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, lineHeight: 1.1 }}>{fmtNIS(cartTotal)}</div>
              </div>
            </div>

            {/* Payment method selector */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>Payment method</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: theme.textSecondary }}>
                  Available: <strong style={{ color: articleCredits > 0 ? BRAND_GREEN : theme.textMuted }}>{articleCredits} credits</strong>
                  <button onClick={onOpenBank} style={{ padding: "3px 9px", fontSize: 11.5, fontWeight: 700, background: "transparent", color: BRAND_GREEN, border: `1px solid ${BRAND_GREEN}`, borderRadius: 6, cursor: "pointer" }}>Buy more</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 8 }}>
                {/* Cash */}
                <button onClick={() => setPayMethod("cash")} style={{ textAlign: "left", padding: 12, background: payMethod === "cash" ? `${BRAND_GREEN}10` : theme.tableHeaderBg, border: `2px solid ${payMethod === "cash" ? BRAND_GREEN : "transparent"}`, borderRadius: 9, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>Cash invoice</span>
                    {payMethod === "cash" && <span style={{ marginLeft: "auto", color: BRAND_GREEN }}><IconCheck size={13} /></span>}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.4 }}>Pay {fmtNIS(cartTotal)} on the master proposal — standard 30-day terms.</div>
                </button>
                {/* Credits */}
                <button onClick={() => articleCredits > 0 && cartCreditCount > 0 && canPayAllCredits && setPayMethod("credits")} disabled={!canPayAllCredits || articleCredits === 0 || cartCreditCount === 0} style={{ textAlign: "left", padding: 12, background: payMethod === "credits" ? `${BRAND_GREEN}10` : theme.tableHeaderBg, border: `2px solid ${payMethod === "credits" ? BRAND_GREEN : "transparent"}`, borderRadius: 9, cursor: canPayAllCredits ? "pointer" : "not-allowed", opacity: canPayAllCredits && articleCredits > 0 ? 1 : 0.5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>Pay with credits</span>
                    {payMethod === "credits" && <span style={{ marginLeft: "auto", color: BRAND_GREEN }}><IconCheck size={13} /></span>}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.4 }}>
                    {canPayAllCredits ? <>Use {cartCreditCount} of {articleCredits} credits — no cash on this order.</> : <>Need {cartCreditCount} credits, have {articleCredits}. <button onClick={(e) => { e.stopPropagation(); onOpenBank(); }} style={{ background: "none", border: "none", color: BRAND_GREEN, fontWeight: 700, padding: 0, cursor: "pointer", textDecoration: "underline" }}>Buy more</button>.</>}
                  </div>
                </button>
                {/* Hybrid */}
                <button onClick={() => articleCredits > 0 && cartCreditCount > 0 && setPayMethod("hybrid")} disabled={articleCredits === 0 || cartCreditCount === 0} style={{ textAlign: "left", padding: 12, background: payMethod === "hybrid" ? `${BRAND_GREEN}10` : theme.tableHeaderBg, border: `2px solid ${payMethod === "hybrid" ? BRAND_GREEN : "transparent"}`, borderRadius: 9, cursor: articleCredits > 0 ? "pointer" : "not-allowed", opacity: articleCredits > 0 && cartCreditCount > 0 ? 1 : 0.5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>Credits + cash</span>
                    {payMethod === "hybrid" && <span style={{ marginLeft: "auto", color: BRAND_GREEN }}><IconCheck size={13} /></span>}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.4 }}>Spend all {Math.min(articleCredits, cartCreditCount)} available credits, bill the rest in cash.</div>
                </button>
              </div>

              {/* Live payment math summary */}
              {(payMethod === "credits" || payMethod === "hybrid") && paymentBreakdown.creditsUsed > 0 && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: `${BRAND_GREEN}08`, border: `1px solid ${BRAND_GREEN}30`, borderRadius: 8, fontSize: 13, color: theme.text, lineHeight: 1.6 }}>
                  <strong style={{ color: BRAND_GREEN }}>You'll pay:</strong> {paymentBreakdown.creditsUsed} {paymentBreakdown.creditsUsed === 1 ? "credit" : "credits"}
                  {paymentBreakdown.cashAmount > 0 && <> + {fmtNIS(paymentBreakdown.cashAmount)} cash</>}
                  <span style={{ color: theme.textSecondary, marginLeft: 8 }}>· balance after order: <strong style={{ color: theme.text }}>{Math.max(0, articleCredits - paymentBreakdown.creditsUsed)} credits</strong></span>
                </div>
              )}
            </div>

            <button onClick={submitOrder} disabled={submitting || !title.trim()} style={{ width: "100%", padding: "16px 22px", fontSize: 16, fontWeight: 700, background: submitting ? theme.barTrack : BRAND_GREEN, color: "#fff", border: "none", borderRadius: 9, cursor: submitting ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {submitting ? "Adding to client proposal..." : <>Add to client proposal &amp; send to Yedioth <IconArrowRight size={14} /></>}
            </button>
            <div style={{ fontSize: 13, color: theme.textSecondary, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>This becomes a line item on your master client proposal. Yedioth's sales team contacts you to confirm. ~3 days per article.</div>
          </>
        )}
      </div>
      )}

      {/* Wizard footer — sticky Back/Continue */}
      <div style={{ position: "sticky", bottom: 0, zIndex: 20, marginTop: 18, padding: isMobile ? 12 : 14, background: theme.headerBg, border: `1px solid ${theme.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", boxShadow: "0 -2px 12px rgba(0,0,0,0.05)" }}>
        {currentStep === 1 ? (
          <button onClick={goToQueries} style={{ padding: "10px 16px", fontSize: 14, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><IconArrowRight size={13} /></span> Back to My Queries
          </button>
        ) : (
          <button onClick={goPrev} style={{ padding: "10px 16px", fontSize: 14, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><IconArrowRight size={13} /></span> Back
          </button>
        )}
        <div style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 600 }}>Step {currentStep} of 5</div>
        {currentStep < 5 ? (
          <button onClick={goNext} disabled={!canContinue} style={{ padding: "11px 22px", fontSize: 14, fontWeight: 700, background: canContinue ? BRAND_GREEN : theme.barTrack, color: canContinue ? "#fff" : theme.textMuted, border: "none", borderRadius: 8, cursor: canContinue ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Continue <IconArrowRight size={13} />
          </button>
        ) : (
          <span style={{ fontSize: 13, color: theme.textMuted, fontStyle: "italic" }}>Final step — review &amp; submit above</span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// AGENCY · My Orders
// ============================================================

function AgencyOrdersView({ theme, isMobile, orders, setOrders, sites, sections, agencyName, showToast }: { theme: Theme; isMobile: boolean; orders: Order[]; setOrders: (v: Order[]) => void; sites: PublisherSite[]; sections: PublisherSection[]; agencyName: string; showToast: (text: string, kind?: "success" | "info" | "warn") => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const allOrders = orders;

  const handleShare = (orderId: string, payload: { clientName: string; clientEmail: string; message?: string }): string => {
    const target = orders.find((o) => o.id === orderId);
    const existingShareId = target?.clientShare?.shareId;
    const shareId = existingShareId ?? `cs-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    setOrders(orders.map((o) => {
      if (o.id !== orderId) return o;
      const existing = o.clientShare;
      if (existing) {
        return { ...o, clientShare: { ...existing, clientName: payload.clientName, clientEmail: payload.clientEmail, message: payload.message ?? existing.message, sharedAt: now } };
      }
      return {
        ...o,
        clientShare: {
          shareId,
          sharedAt: now,
          clientName: payload.clientName,
          clientEmail: payload.clientEmail,
          message: payload.message,
          status: "pending_review",
          comments: [],
        },
      };
    }));
    showToast(existingShareId ? "Share link refreshed for client" : "Share link generated — copy & send to client", "success");
    return shareId;
  };

  const totalSpend = allOrders.reduce((s, o) => s + o.totalPrice, 0);
  const pending = allOrders.filter((o) => o.status === "pending").length;
  const inProgress = allOrders.filter((o) => o.status === "in_progress" || o.status === "approved").length;
  const published = allOrders.filter((o) => o.status === "published").length;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <Kpi label="Total spend" value={fmtNIS(totalSpend)} theme={theme} tip="₪ committed across all your orders — pending, in progress, and published combined." />
        <Kpi label="Pending" value={String(pending)} theme={theme} tip="Orders awaiting publisher approval. Yedioth's sales team will reach out shortly." accent={pending > 0 ? BRAND_AMBER : undefined} />
        <Kpi label="In progress" value={String(inProgress)} theme={theme} tip="Approved or actively being uploaded by the publisher's editorial team." />
        <Kpi label="Published" value={String(published)} theme={theme} tip="Articles already live — see the Article Tracking tab for performance." accent={BRAND_GREEN} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allOrders.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
            <IconInbox size={32} />
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginTop: 12 }}>No orders yet</div>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Submit an order from the Order Flow tab.</div>
          </div>
        ) : allOrders.map((o) => (
          <OrderCard key={o.id} order={o} theme={theme} isMobile={isMobile} expanded={openId === o.id} onToggle={() => setOpenId(openId === o.id ? null : o.id)} onUpdate={() => { /* agency cannot update */ }} onShare={handleShare} agencyName={agencyName} mode="agency" sites={sites} sections={sections} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// AGENCY · Article Tracking
// ============================================================

function AgencyTrackingView({ theme, isMobile, tracking, sites, sections, showToast }: { theme: Theme; isMobile: boolean; tracking: ArticleTracking[]; sites: PublisherSite[]; sections: PublisherSection[]; showToast: (text: string, kind?: "success" | "info" | "warn") => void }) {
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const totalViews = tracking.reduce((s, t) => s + t.views, 0);
  const indexedCount = tracking.filter((t) => t.indexedGoogle).length;
  const aiCitedCount = tracking.filter((t) => t.citedGPT || t.citedGemini || t.citedPerplexity).length;
  const totalRankedQueries = tracking.reduce((s, t) => s + t.rankedQueries.length, 0);

  const filtered = tracking.filter((t) => {
    if (domainFilter === "all") return true;
    const sec = sections.find((s) => s.id === t.sectionId);
    return sec?.siteId === domainFilter;
  });

  const exportClientReport = () => {
    const rows = [
      ["URL", "Site", "Section", "Published", "Google Indexed", "GPT Cited", "Gemini Cited", "Perplexity Cited", "Views", "Impact %", "Ranked Queries"],
      ...tracking.map((t) => {
        const sec = sections.find((s) => s.id === t.sectionId);
        const site = sec ? sites.find((s) => s.id === sec.siteId) : null;
        return [t.url, site?.name ?? "", sec?.name ?? "", t.publishedAt, t.indexedGoogle ? "Yes" : "No", t.citedGPT ? "Yes" : "No", t.citedGemini ? "Yes" : "No", t.citedPerplexity ? "Yes" : "No", String(t.views), String(t.impactScore), t.rankedQueries.map((q) => `"${q.query}" (${q.engine} #${q.rank})`).join(" | ")];
      }),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `client-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Client report exported — share with your client", "success");
  };

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${BRAND_BLUE}10 0%, ${BRAND_BLUE}03 100%)`, border: `1px solid ${BRAND_BLUE}30`, borderRadius: 12, padding: isMobile ? 16 : 22, marginBottom: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_BLUE, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Per-Article Tracking</div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text, marginBottom: 6 }}>{tracking.length} published articles · {totalRankedQueries} queries ranking</div>
          <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6, maxWidth: 720 }}>Each ordered article is monitored individually: did it get crawled, did it get indexed, which AI engines cite it, which queries does it rank for. Export a report for your client to prove ROI.</div>
        </div>
        <button onClick={exportClientReport} style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13, fontWeight: 700, background: BRAND_BLUE, color: "#fff", border: "none", borderRadius: 9, cursor: "pointer" }}>
          <IconDownload size={13} /> Export client report
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
        <Kpi label="Total views" value={fmtNum(totalViews)} theme={theme} tip="Sum of organic views across all your client's published articles." />
        <Kpi label="Google-indexed" value={`${indexedCount}/${tracking.length}`} theme={theme} tip="Articles confirmed in Google's index. If low, the publisher may need to fix sitemap or remove noindex." />
        <Kpi label="AI-cited" value={`${aiCitedCount}/${tracking.length}`} theme={theme} tip="Articles cited by GPT, Gemini, or Perplexity. This is what justifies premium pricing to your client." accent={BRAND_GREEN} />
        <Kpi label="Ranking queries" value={String(totalRankedQueries)} theme={theme} tip="Total distinct queries across all engines where your client's articles appear in the ranked answers." />
      </div>

      {/* Per-domain filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setDomainFilter("all")} style={{ padding: "7px 14px", fontSize: 13, fontWeight: 600, background: domainFilter === "all" ? theme.text : theme.cardBg, color: domainFilter === "all" ? theme.bg : theme.textSecondary, border: `1px solid ${domainFilter === "all" ? theme.text : theme.border}`, borderRadius: 8, cursor: "pointer" }}>
          All sites ({tracking.length})
        </button>
        {sites.map((site) => {
          const count = tracking.filter((t) => {
            const sec = sections.find((s) => s.id === t.sectionId);
            return sec?.siteId === site.id;
          }).length;
          if (count === 0) return null;
          return (
            <button key={site.id} onClick={() => setDomainFilter(site.id)} style={{ padding: "7px 14px", fontSize: 13, fontWeight: 600, background: domainFilter === site.id ? theme.text : theme.cardBg, color: domainFilter === site.id ? theme.bg : theme.textSecondary, border: `1px solid ${domainFilter === site.id ? theme.text : theme.border}`, borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Favicon domain={site.domain} size={14} /> {site.name} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>No articles for this site yet</div>
          </div>
        ) : filtered.map((t) => (
          <ArticleTrackingRow key={t.url} tracking={t} theme={theme} isMobile={isMobile} sites={sites} sections={sections} showToast={showToast} setTracking={() => { /* agency view: read-only */ }} allTracking={tracking} />
        ))}
      </div>

      <div style={{ marginTop: 24, padding: 14, background: `${BRAND_BLUE}08`, border: `1px solid ${BRAND_BLUE}25`, borderRadius: 9, fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>
        <strong style={{ color: BRAND_BLUE }}>Why this matters:</strong> Today, agencies buy articles from publishers without ever knowing if they got picked up. Geoscale ScalePublish monitors every item — if your client's article on Ynet gets cited by ChatGPT, you can prove it. That converts to repeat purchases.
      </div>
    </div>
  );
}

// ============================================================
// SHARE WITH CLIENT MODAL (agency)
// ============================================================
// Triggered from any AgencyOrderCard. Captures the client's name + email + an optional message,
// mints a shareId, persists it on the order, and copies the share URL to clipboard so the agency
// can drop it in WhatsApp / email immediately.

function ShareWithClientModal({ order, theme, isMobile, onClose, onShare, agencyName, brandName }: { order: Order; theme: Theme; isMobile: boolean; onClose: () => void; onShare: (payload: { clientName: string; clientEmail: string; message?: string }) => string; agencyName: string; brandName: string }) {
  const [clientName, setClientName] = useState(order.clientShare?.clientName ?? "");
  const [clientEmail, setClientEmail] = useState(order.clientShare?.clientEmail ?? "");
  const [message, setMessage] = useState(order.clientShare?.message ?? `Hi, this is the article we built for ${brandName} — placed on premium publishers like Ynet & Calcalist. Take a look and let us know if anything should be tweaked before we send it to the publisher.`);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(order.clientShare ? `${typeof window !== "undefined" ? window.location.origin : ""}/scale-publish?clientShare=${order.clientShare.shareId}` : null);
  const canSubmit = clientName.trim().length >= 2 && /\S+@\S+\.\S+/.test(clientEmail);

  const submit = () => {
    if (!canSubmit) return;
    const shareId = onShare({ clientName: clientName.trim(), clientEmail: clientEmail.trim(), message: message.trim() || undefined });
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/scale-publish?clientShare=${shareId}`;
    setGeneratedUrl(url);
  };

  const copyUrl = () => {
    if (!generatedUrl) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(generatedUrl).catch(() => { /* noop */ });
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1000 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 540, maxHeight: "92vh", overflowY: "auto", background: theme.cardBg, borderRadius: 14, border: `1px solid ${theme.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ padding: isMobile ? "16px 18px" : "20px 24px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 4 }}>Share with client</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, lineHeight: 1.25 }}>{order.title}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", padding: 6 }}><IconX size={18} /></button>
        </div>

        <div style={{ padding: isMobile ? "16px 18px" : "22px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {!generatedUrl ? (
            <>
              <div style={{ fontSize: 13.5, color: theme.textSecondary, lineHeight: 1.55 }}>
                Send this article to your client at <strong style={{ color: theme.text }}>{brandName}</strong> for review before it goes to the publisher. They'll see the article preview, the publishers it's going to, and the price — and can approve or request changes.
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: theme.text, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Client contact name</label>
                <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Tomer Levi (Marketing Lead)" style={{ width: "100%", padding: "11px 14px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: theme.text, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Client email</label>
                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder={`tomer@${brandName.toLowerCase().replace(/\s+/g, "")}.com`} style={{ width: "100%", padding: "11px 14px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: theme.text, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Message to the client (optional)</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} style={{ width: "100%", padding: "11px 14px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", lineHeight: 1.5 }} />
              </div>

              <div style={{ padding: "12px 14px", background: `${BRAND_GREEN}08`, border: `1px solid ${BRAND_GREEN}30`, borderLeft: `3px solid ${BRAND_GREEN}`, borderRadius: 7, fontSize: 12.5, color: theme.textSecondary, lineHeight: 1.5 }}>
                <strong style={{ color: BRAND_GREEN }}>Heads up:</strong> the client view shows your agency branding ({agencyName}) — they never see Geoscale internals or the publisher's pricing breakdown.
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", paddingTop: 4 }}>
                <button onClick={onClose} style={{ padding: "11px 18px", fontSize: 14, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 9, cursor: "pointer" }}>Cancel</button>
                <button onClick={submit} disabled={!canSubmit} style={{ padding: "11px 22px", fontSize: 14, fontWeight: 700, background: canSubmit ? BRAND_GREEN : theme.barTrack, color: canSubmit ? "#fff" : theme.textMuted, border: "none", borderRadius: 9, cursor: canSubmit ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Generate share link <IconArrowRight size={13} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: 16, background: `${BRAND_GREEN}10`, border: `1.5px solid ${BRAND_GREEN}50`, borderLeft: `4px solid ${BRAND_GREEN}`, borderRadius: 10 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: BRAND_GREEN, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><IconCheck size={14} /></div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Share link ready</div>
                </div>
                <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.55 }}>Send this link to <strong style={{ color: theme.text }}>{clientName}</strong> ({clientEmail}). Anyone with the link can review the article and respond.</div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: theme.text, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Share link</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input readOnly value={generatedUrl} style={{ flex: 1, minWidth: 0, padding: "11px 14px", fontSize: 13, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box", fontFamily: "ui-monospace, monospace" }} onFocus={(e) => e.currentTarget.select()} />
                  <button onClick={copyUrl} style={{ padding: "11px 18px", fontSize: 13, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap" }}>Copy</button>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href={`https://wa.me/?text=${encodeURIComponent(`${message}\n\n${generatedUrl}`)}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13, fontWeight: 700, background: "#25D366", color: "#fff", border: "none", borderRadius: 9, textDecoration: "none" }}>WhatsApp</a>
                <a href={`mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent(`Article preview · ${order.title}`)}&body=${encodeURIComponent(`${message}\n\n${generatedUrl}`)}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13, fontWeight: 700, background: BRAND_BLUE, color: "#fff", border: "none", borderRadius: 9, textDecoration: "none" }}>Email</a>
                <a href={generatedUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13, fontWeight: 700, background: "transparent", color: theme.text, border: `1px solid ${theme.border}`, borderRadius: 9, textDecoration: "none" }}>Preview as client →</a>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
                <button onClick={onClose} style={{ padding: "11px 22px", fontSize: 14, fontWeight: 700, background: theme.text, color: theme.bg, border: "none", borderRadius: 9, cursor: "pointer" }}>Done</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CLIENT REVIEW VIEW (full-page takeover)
// ============================================================
// What the agency's client sees when they open ?clientShare=<id>. No agency/publisher switcher,
// no Geoscale internals — just an agency-branded review surface.

function ClientReviewView({ order, orders, setOrders, sites, sections, theme, darkMode, setDarkMode, isMobile, showToast, toasts, dismissToast }: { order: Order | null; orders: Order[]; setOrders: (v: Order[]) => void; sites: PublisherSite[]; sections: PublisherSection[]; theme: Theme; darkMode: boolean; setDarkMode: (v: boolean) => void; isMobile: boolean; showToast: (text: string, kind?: "success" | "info" | "warn") => void; toasts: ToastMsg[]; dismissToast: (id: string) => void }) {
  const [commentDraft, setCommentDraft] = useState("");
  const [requestChangesNote, setRequestChangesNote] = useState("");
  const [showRequestPanel, setShowRequestPanel] = useState(false);

  if (!order || !order.clientShare) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', 'Heebo', sans-serif", color: theme.text, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${BRAND_AMBER}15`, color: BRAND_AMBER, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><IconX size={28} /></div>
          <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 8 }}>This share link is not active</div>
          <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.55 }}>The agency may have revoked the link or the article is no longer available. Please contact the agency for an updated link.</div>
        </div>
      </div>
    );
  }

  const cs = order.clientShare;
  const STATUS_STYLES: Record<typeof cs.status, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
    pending_review: { bg: `${BRAND_AMBER}15`, color: BRAND_AMBER, label: "Awaiting your review", icon: <IconClock size={13} /> },
    approved: { bg: `${BRAND_GREEN}15`, color: BRAND_GREEN, label: "Approved by you", icon: <IconCheck size={13} /> },
    changes_requested: { bg: `${BRAND_BLUE}15`, color: BRAND_BLUE, label: "Changes requested", icon: <IconEdit size={13} /> },
  };
  const status = STATUS_STYLES[cs.status];

  const updateOrder = (updater: (o: Order) => Order) => {
    setOrders(orders.map((o) => (o.id === order.id ? updater(o) : o)));
  };

  const addComment = (from: "client" | "agency", author: string, text: string) => {
    if (!text.trim()) return;
    const newComment = { id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, from, author, text: text.trim(), at: new Date().toISOString() };
    updateOrder((o) => ({ ...o, clientShare: o.clientShare ? { ...o.clientShare, comments: [...o.clientShare.comments, newComment] } : o.clientShare }));
  };

  const approve = () => {
    updateOrder((o) => ({ ...o, clientShare: o.clientShare ? { ...o.clientShare, status: "approved", decidedAt: new Date().toISOString() } : o.clientShare }));
    showToast("Approval sent to your agency", "success");
    setShowRequestPanel(false);
  };

  const requestChanges = () => {
    if (!requestChangesNote.trim()) return;
    updateOrder((o) => {
      if (!o.clientShare) return o;
      const newComment = { id: `c-${Date.now()}`, from: "client" as const, author: o.clientShare.clientName, text: requestChangesNote.trim(), at: new Date().toISOString() };
      return { ...o, clientShare: { ...o.clientShare, status: "changes_requested" as const, decidedAt: new Date().toISOString(), comments: [...o.clientShare.comments, newComment] } };
    });
    setRequestChangesNote("");
    setShowRequestPanel(false);
    showToast("Changes request sent to your agency", "success");
  };

  const sendComment = () => {
    if (!commentDraft.trim()) return;
    addComment("client", cs.clientName, commentDraft);
    setCommentDraft("");
    showToast("Comment sent to your agency", "success");
  };

  // Build a queries shape the ArticlePreview understands (synthesize for queries that aren't in DEMO_QUERIES)
  const previewQueries = order.queries.map((qText, i) => {
    const found = DEMO_QUERIES.find((dq) => dq.text === qText);
    if (found) return found;
    const lower = qText.toLowerCase();
    const inferredCategory = lower.includes("bank") || lower.includes("invest") || lower.includes("fund") || lower.includes("pension") || lower.includes("credit") ? "Finance"
      : lower.includes("real estate") || lower.includes("mortgage") || lower.includes("housing") ? "Real Estate"
      : lower.includes("tech") || lower.includes("ai") || lower.includes("cloud") || lower.includes("saas") || lower.includes("startup") ? "Tech"
      : lower.includes("therapy") || lower.includes("therapeutic") || lower.includes("riding") || lower.includes("horse") ? "Therapy"
      : lower.includes("insurance") ? "Insurance"
      : "Editorial";
    return { id: `cs-${order.id}-q${i}`, text: qText, category: inferredCategory, audience: ["Decision-makers", "B2B"], gpt: false, gemini: false, perplexity: false, opportunity: 80 };
  });

  const sectionGroups = (() => {
    const grouped: Record<string, { siteName: string; siteDomain: string; sections: { name: string; hebrewName: string; category: string }[] }> = {};
    for (const s of order.sections) {
      const sec = sections.find((x) => x.id === s.sectionId);
      const site = sites.find((x) => x.id === s.siteId);
      if (!sec || !site) continue;
      if (!grouped[site.id]) grouped[site.id] = { siteName: site.name, siteDomain: site.domain, sections: [] };
      grouped[site.id].sections.push({ name: sec.name, hebrewName: sec.hebrewName, category: sec.category });
    }
    return Object.values(grouped);
  })();

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', 'Heebo', sans-serif", color: theme.text }} dir="ltr">
      {/* Agency-branded header (NO Geoscale logo) */}
      <header style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}`, padding: isMobile ? "14px 16px" : "16px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${BRAND_GREEN}, ${BRAND_BLUE})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: 16 }}>
              {order.agencyName.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>{order.agencyName} · for review</div>
              <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>Article preview for {order.brand}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12, fontWeight: 700, background: status.bg, color: status.color, borderRadius: 999 }}>{status.icon} {status.label}</span>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "20px 12px 80px" : "32px 24px 80px" }}>
        {/* Greeting + agency message */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: theme.text, lineHeight: 1.2, marginBottom: 8 }}>Hi {cs.clientName.split(" ")[0] || cs.clientName} 👋</div>
          <div style={{ fontSize: isMobile ? 14 : 15.5, color: theme.textSecondary, lineHeight: 1.65, maxWidth: 720 }}>
            {cs.message ? cs.message : `${order.agencyName} prepared an article for ${order.brand}, scheduled to be placed on premium publishers. Take a look at the article preview, the publishers it will run on, and let us know if everything looks good before we send it to publication.`}
          </div>
        </div>

        {/* Decision panel */}
        {cs.status === "pending_review" && !showRequestPanel && (
          <div style={{ background: theme.cardBg, border: `2px solid ${BRAND_GREEN}40`, borderRadius: 14, padding: isMobile ? 18 : 22, marginBottom: 24, boxShadow: "0 4px 12px rgba(16, 163, 127, 0.08)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 6 }}>Your decision</div>
            <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Does this article look good to publish?</div>
            <div style={{ fontSize: 13.5, color: theme.textSecondary, lineHeight: 1.55, marginBottom: 16 }}>If yes, the agency will send it to the publisher right away. If something feels off, request changes and we'll iterate before publication.</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={approve} style={{ padding: "13px 24px", fontSize: 15, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(16,163,127,0.25)" }}>
                <IconCheck size={14} /> Approve &amp; send to publisher
              </button>
              <button onClick={() => setShowRequestPanel(true)} style={{ padding: "13px 22px", fontSize: 15, fontWeight: 700, background: "transparent", color: BRAND_BLUE, border: `1.5px solid ${BRAND_BLUE}`, borderRadius: 10, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <IconEdit size={13} /> Request changes
              </button>
            </div>
          </div>
        )}

        {cs.status === "pending_review" && showRequestPanel && (
          <div style={{ background: theme.cardBg, border: `2px solid ${BRAND_BLUE}40`, borderRadius: 14, padding: isMobile ? 18 : 22, marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_BLUE, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 6 }}>Request changes</div>
            <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.55, marginBottom: 12 }}>Tell the agency what to fix. Be specific — they'll iterate and re-share when ready.</div>
            <textarea value={requestChangesNote} onChange={(e) => setRequestChangesNote(e.target.value)} placeholder={`e.g. "Section 3 mentions a competitor by name — please remove. Also the title feels generic, can we lean into the [specific angle]?"`} rows={5} style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", lineHeight: 1.5 }} />
            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <button onClick={requestChanges} disabled={!requestChangesNote.trim()} style={{ padding: "12px 22px", fontSize: 14, fontWeight: 700, background: requestChangesNote.trim() ? BRAND_BLUE : theme.barTrack, color: requestChangesNote.trim() ? "#fff" : theme.textMuted, border: "none", borderRadius: 9, cursor: requestChangesNote.trim() ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", gap: 6 }}>
                Send to agency <IconArrowRight size={13} />
              </button>
              <button onClick={() => { setShowRequestPanel(false); setRequestChangesNote(""); }} style={{ padding: "12px 18px", fontSize: 14, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 9, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {cs.status === "approved" && (
          <div style={{ background: `${BRAND_GREEN}10`, border: `1.5px solid ${BRAND_GREEN}50`, borderLeft: `5px solid ${BRAND_GREEN}`, borderRadius: 12, padding: isMobile ? 18 : 22, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: BRAND_GREEN, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><IconCheck size={16} /></div>
              <div style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>You approved this article</div>
            </div>
            <div style={{ fontSize: 13.5, color: theme.textSecondary, lineHeight: 1.55 }}>{cs.decidedAt ? `Approved ${new Date(cs.decidedAt).toLocaleDateString()} at ${new Date(cs.decidedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.` : ""} {order.agencyName} has been notified and will send it to the publisher.</div>
          </div>
        )}

        {cs.status === "changes_requested" && (
          <div style={{ background: `${BRAND_BLUE}10`, border: `1.5px solid ${BRAND_BLUE}50`, borderLeft: `5px solid ${BRAND_BLUE}`, borderRadius: 12, padding: isMobile ? 18 : 22, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: BRAND_BLUE, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><IconEdit size={14} /></div>
                <div style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>Changes requested</div>
              </div>
              <button onClick={approve} style={{ padding: "9px 18px", fontSize: 13, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconCheck size={12} /> Approve anyway
              </button>
            </div>
            <div style={{ fontSize: 13.5, color: theme.textSecondary, lineHeight: 1.55 }}>The agency will iterate based on your feedback and re-share when ready.</div>
          </div>
        )}

        {/* What we're reviewing */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: isMobile ? 18 : 24, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 12 }}>The article we built for you</div>
          <div style={{ fontSize: isMobile ? 19 : 23, fontWeight: 700, color: theme.text, lineHeight: 1.25, marginBottom: 14 }}>{order.title}</div>
          <div style={{ display: "flex", gap: isMobile ? 14 : 24, flexWrap: "wrap", marginBottom: 18 }}>
            <ClientFact label="Brand" value={order.brand} theme={theme} />
            <ClientFact label="Topics covered" value={`${order.queries.length} ${order.queries.length === 1 ? "query" : "queries"}`} theme={theme} />
            <ClientFact label="Publisher placements" value={`${order.sections.length} ${order.sections.length === 1 ? "section" : "sections"}`} theme={theme} />
            <ClientFact label="Total investment" value={fmtNIS(order.counterOffer ? order.counterOffer.adjustedTotal : order.totalPrice)} theme={theme} accent={BRAND_GREEN} />
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.text, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>Topics this article targets</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {order.queries.map((q, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: BRAND_GREEN, minWidth: 22 }}>{i + 1}.</span>
                  <span style={{ fontSize: 13.5, color: theme.text }}>{q}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.text, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>Where this article will run</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sectionGroups.map((g, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 9 }}>
                  <Favicon domain={g.siteDomain} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{g.siteName}</div>
                    <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{g.sections.map((s) => s.name).join(" · ")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backlink callout — every article carries a do-follow link */}
          {order.backlink && (
            <div style={{ marginTop: 22, padding: 14, background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 9 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Do-follow backlink</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", minWidth: 78 }}>Linking to</span>
                  <span style={{ fontFamily: "monospace", color: BRAND_BLUE, wordBreak: "break-all" }}>{order.backlink.targetUrl}</span>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", minWidth: 78 }}>Anchor</span>
                  <span style={{ fontWeight: 600, color: theme.text }}>{order.backlink.anchorText}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Article preview */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10 }}>Article preview</div>
          <ArticlePreview
            title={order.title}
            selectedQueries={previewQueries}
            theme={theme}
            isMobile={isMobile}
            mode="agency"
            brand={{ name: order.brand, domain: order.brandDomain, agency: order.agencyName, agencyContact: order.agencyContact }}
          />
        </div>

        {/* Comment thread */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: isMobile ? 18 : 22, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 12 }}>Conversation with {order.agencyName}</div>
          {cs.comments.length === 0 ? (
            <div style={{ padding: 18, background: theme.tableHeaderBg, border: `1px dashed ${theme.border}`, borderRadius: 9, fontSize: 13, color: theme.textSecondary, textAlign: "center" }}>No messages yet — leave a question or note below.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {cs.comments.map((c) => (
                <div key={c.id} style={{ alignSelf: c.from === "client" ? "flex-end" : "flex-start", maxWidth: "85%", padding: "11px 14px", background: c.from === "client" ? `${BRAND_GREEN}12` : theme.tableHeaderBg, border: `1px solid ${c.from === "client" ? `${BRAND_GREEN}40` : theme.border}`, borderRadius: 11, fontSize: 13.5, color: theme.text, lineHeight: 1.5 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: c.from === "client" ? BRAND_GREEN : theme.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>
                    {c.author} · {new Date(c.at).toLocaleDateString()} {new Date(c.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div>{c.text}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
            <textarea value={commentDraft} onChange={(e) => setCommentDraft(e.target.value)} placeholder="Leave a comment for the agency..." rows={2} style={{ flex: 1, padding: "10px 14px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", lineHeight: 1.5 }} />
            <button onClick={sendComment} disabled={!commentDraft.trim()} style={{ padding: "10px 18px", fontSize: 13, fontWeight: 700, background: commentDraft.trim() ? theme.text : theme.barTrack, color: commentDraft.trim() ? theme.bg : theme.textMuted, border: "none", borderRadius: 9, cursor: commentDraft.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>Send</button>
          </div>
        </div>

        <div style={{ fontSize: 12, color: theme.textMuted, textAlign: "center", padding: "14px 8px", lineHeight: 1.55 }}>
          Shared by {order.agencyName} · {new Date(cs.sharedAt).toLocaleDateString()} · This is a private review link, do not forward.
        </div>
      </div>

      <ToastHost toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function ClientFact({ label, value, theme, accent }: { label: string; value: string; theme: Theme; accent?: string }) {
  return (
    <div style={{ minWidth: 130 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: accent ?? theme.text, lineHeight: 1.25 }}>{value}</div>
    </div>
  );
}

// ============================================================
// CONTENT STEP (step 4 of Order Flow) — per Inna call 2026-05-05
// ============================================================
type Cart = { section: PublisherSection; score: number; reasons: { type: "audience" | "category" | "query"; label: string }[] }[];

function ContentStep({ theme, isMobile, contentMode, setContentMode, cart, sites, title, selectedQueries, brand, providedCopy, setProvidedCopy, copyView, setCopyView, aiScanRunning, setAiScanRunning, aiScanResult, setAiScanResult, draftEdits, setDraftEdits, editDraftMode, setEditDraftMode, showToast }: {
  theme: Theme; isMobile: boolean;
  contentMode: "empty" | "generate"; setContentMode: (v: "empty" | "generate") => void;
  cart: Cart; sites: PublisherSite[];
  title: string; selectedQueries: typeof DEMO_QUERIES; brand: typeof DEMO_BRAND;
  providedCopy: string; setProvidedCopy: (v: string) => void;
  copyView: "visual" | "code"; setCopyView: (v: "visual" | "code") => void;
  aiScanRunning: boolean; setAiScanRunning: (v: boolean) => void;
  aiScanResult: { covered: { query: string; coverage: number }[]; missing: { query: string }[]; recommendations: string[] } | null; setAiScanResult: (v: { covered: { query: string; coverage: number }[]; missing: { query: string }[]; recommendations: string[] } | null) => void;
  draftEdits: Record<string, string>; setDraftEdits: (v: Record<string, string>) => void;
  editDraftMode: boolean; setEditDraftMode: (v: boolean) => void;
  showToast: (text: string, kind?: "success" | "info" | "warn") => void;
}) {
  const cartSiteIds = Array.from(new Set(cart.map((m) => m.section.siteId)));
  const cartSites = cartSiteIds.map((id) => sites.find((s) => s.id === id)).filter(Boolean) as PublisherSite[];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleWordUpload = (file: File) => {
    // Demo-grade Word import: parse as plain text. Never inject HTML — we only use textarea views,
    // so there's no XSS attack surface. We construct a plain-text preamble using string interpolation
    // (no innerHTML, no dangerouslySetInnerHTML anywhere in this component).
    const reader = new FileReader();
    reader.onload = () => {
      const safeName = file.name.replace(/[<>"'`]/g, "");
      const fakeExtracted = `[Extracted from ${safeName} — ${Math.round(file.size / 1024)} KB · ~${Math.round(file.size / 5)} words]\n\n${title || "Article draft"}\n\nYour uploaded copy was parsed and inserted here. Edit freely, then click "Let AI scan my content" to verify it covers the selected queries.`;
      setProvidedCopy(fakeExtracted);
      setAiScanResult(null);
      showToast(`Imported "${safeName}" into editor`, "success");
    };
    reader.readAsText(file);
  };

  const runAiScan = () => {
    if (!providedCopy.trim()) {
      showToast("Editor is empty — paste content or upload a Word file first", "warn");
      return;
    }
    setAiScanRunning(true);
    setTimeout(() => {
      const lower = providedCopy.toLowerCase();
      const covered: { query: string; coverage: number }[] = [];
      const missing: { query: string }[] = [];
      for (const q of selectedQueries) {
        const words = q.text.toLowerCase().split(/\s+/).filter((w) => w.length >= 4);
        if (words.length === 0) { covered.push({ query: q.text, coverage: 100 }); continue; }
        const hits = words.filter((w) => lower.includes(w)).length;
        const coverage = Math.round((hits / words.length) * 100);
        if (coverage >= 60) covered.push({ query: q.text, coverage });
        else missing.push({ query: q.text });
      }
      const recommendations: string[] = [];
      if (missing.length > 0) recommendations.push(`Expand on: ${missing.slice(0, 2).map((m) => `"${m.query}"`).join(" and ")} — add at least one section answering each.`);
      if (!lower.includes(brand.name.toLowerCase())) recommendations.push(`Mention ${brand.name} at least once — currently the article doesn't reference the brand.`);
      if (providedCopy.length < 1500) recommendations.push("Article is short. AI engines prefer 800-1500 words for citation depth.");
      if (recommendations.length === 0) recommendations.push("Coverage looks strong. Consider adding a comparison table or pull quote for richer citations.");
      setAiScanResult({ covered, missing, recommendations });
      setAiScanRunning(false);
      const verdict = missing.length === 0 ? "All queries covered ✓" : `${missing.length} ${missing.length === 1 ? "query" : "queries"} need work`;
      showToast(`AI scan complete — ${verdict}`, missing.length === 0 ? "success" : "warn");
    }, 1400);
  };

  return (
    <div style={{ marginBottom: 18, display: "flex", flexDirection: "column", gap: 14 }}>
      {cartSites.length >= 2 && (
        <div style={{ padding: isMobile ? 14 : 16, background: `${BRAND_BLUE}08`, border: `1.5px solid ${BRAND_BLUE}40`, borderLeft: `4px solid ${BRAND_BLUE}`, borderRadius: 11 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_BLUE, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 6 }}>Per-site rewriting · {cartSites.length} unique drafts</div>
          <div style={{ fontSize: 13.5, color: theme.text, lineHeight: 1.55, marginBottom: 10 }}>Each site receives its own tailored version of the article. Same query intents, different phrasing — no duplicate-content penalty.</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {cartSites.map((s, i) => (
              <div key={s.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
                <Favicon domain={s.domain} size={16} />
                <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{s.name}</span>
                <span style={{ fontSize: 11, color: theme.textMuted }}>· Variant {String.fromCharCode(65 + i)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>Step 4 · How is the content produced?</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setContentMode("generate")} style={{ flex: 1, minWidth: 220, padding: 14, background: contentMode === "generate" ? `${BRAND_GREEN}10` : "transparent", border: `1.5px solid ${contentMode === "generate" ? BRAND_GREEN : theme.border}`, borderRadius: 10, cursor: "pointer", textAlign: "left", color: theme.text }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>AI-generated draft</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.5 }}>We generate the article from your selected queries. Editable below. Title stays AI-controlled to keep ranking signals.</div>
          </button>
          <button onClick={() => setContentMode("empty")} style={{ flex: 1, minWidth: 220, padding: 14, background: contentMode === "empty" ? `${BRAND_AMBER}10` : "transparent", border: `1.5px solid ${contentMode === "empty" ? BRAND_AMBER : theme.border}`, borderRadius: 10, cursor: "pointer", textAlign: "left", color: theme.text }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>I'll provide the copy</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.5 }}>Paste your own copy or upload a Word file. AI scans it against your queries before we accept it.</div>
          </button>
        </div>
      </div>

      {contentMode === "generate" && (
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 3 }}>AI-generated draft (preview)</div>
              <div style={{ fontSize: 13, color: theme.textSecondary }}>Title is AI-locked to preserve GEO ranking signals. Body sections are editable below.</div>
            </div>
            <button onClick={() => setEditDraftMode(!editDraftMode)} style={{ padding: "8px 14px", fontSize: 13, fontWeight: 700, background: editDraftMode ? BRAND_GREEN : "transparent", color: editDraftMode ? "#fff" : theme.text, border: `1.5px solid ${BRAND_GREEN}`, borderRadius: 8, cursor: "pointer" }}>
              {editDraftMode ? "✓ Editing on" : "Edit draft sections"}
            </button>
          </div>

          {editDraftMode && (
            <div style={{ marginBottom: 14, padding: 12, background: `${BRAND_GREEN}06`, border: `1px dashed ${BRAND_GREEN}50`, borderRadius: 9 }}>
              <div style={{ fontSize: 12.5, color: theme.text, lineHeight: 1.5 }}>Edit each section below — your overrides replace the AI text in the published article.</div>
              {selectedQueries.map((q, i) => (
                <div key={q.id} style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5 }}>H2 #{i + 1} — {q.text}</div>
                  <textarea value={draftEdits[q.id] ?? ""} onChange={(e) => setDraftEdits({ ...draftEdits, [q.id]: e.target.value })} placeholder={`AI will write this section answering "${q.text}". Override here to use your own copy.`} rows={3} style={{ width: "100%", padding: "9px 12px", fontSize: 13.5, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", lineHeight: 1.5 }} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={() => { setDraftEdits({}); showToast("Cleared overrides — AI text restored", "info"); }} style={{ padding: "8px 14px", fontSize: 13, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 7, cursor: "pointer" }}>Clear overrides</button>
                <span style={{ fontSize: 12, color: theme.textMuted }}>{Object.values(draftEdits).filter((v) => v.trim()).length} of {selectedQueries.length} sections overridden</span>
              </div>
            </div>
          )}

          <ArticlePreview title={title} selectedQueries={selectedQueries} theme={theme} isMobile={isMobile} brand={brand} />
        </div>
      )}

      {contentMode === "empty" && (
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 3 }}>Your article — paste or upload</div>
              <div style={{ fontSize: 13, color: theme.textSecondary }}>Switch between Visual and Code views. Upload .docx to import a Word file. Hit "Let AI scan my content" before continuing.</div>
            </div>
            <input ref={fileInputRef} type="file" accept=".docx,.doc,.txt,.html" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleWordUpload(f); }} style={{ display: "none" }} />
            <button onClick={() => fileInputRef.current?.click()} style={{ padding: "9px 16px", fontSize: 13, fontWeight: 700, background: "transparent", color: theme.text, border: `1.5px solid ${theme.border}`, borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              📄 Upload Word file
            </button>
          </div>

          <div style={{ display: "inline-flex", background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 3, marginBottom: 10 }}>
            <button onClick={() => setCopyView("visual")} style={{ padding: "7px 14px", fontSize: 13, fontWeight: 700, background: copyView === "visual" ? theme.cardBg : "transparent", color: copyView === "visual" ? theme.text : theme.textSecondary, border: "none", borderRadius: 6, cursor: "pointer" }}>Visual</button>
            <button onClick={() => setCopyView("code")} style={{ padding: "7px 14px", fontSize: 13, fontWeight: 700, background: copyView === "code" ? theme.cardBg : "transparent", color: copyView === "code" ? theme.text : theme.textSecondary, border: "none", borderRadius: 6, cursor: "pointer" }}>HTML code</button>
          </div>

          {/* Plain-text/HTML editor — both modes are textareas. No innerHTML, no XSS surface.
              Visual mode: roomy serif-style textarea. Code mode: monospace HTML view. */}
          {copyView === "visual" ? (
            <textarea
              value={providedCopy}
              onChange={(e) => { setProvidedCopy(e.target.value); setAiScanResult(null); }}
              placeholder={`Start writing your article here, or upload a Word file above.\n\nYou can use markdown-style headings (## My heading) — formatting will be applied automatically when the article is published. Type freely.`}
              rows={14}
              style={{ width: "100%", minHeight: 360, padding: "18px 20px", fontSize: 15, lineHeight: 1.7, background: theme.inputBg, border: `1.5px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box", fontFamily: "Georgia, 'Times New Roman', serif", resize: "vertical" }}
            />
          ) : (
            <textarea
              value={providedCopy}
              onChange={(e) => { setProvidedCopy(e.target.value); setAiScanResult(null); }}
              placeholder={`<h1>${title}</h1>\n<p>Paste raw HTML here, or use the Visual tab for plain-text writing.</p>`}
              rows={14}
              style={{ width: "100%", minHeight: 360, padding: "14px 16px", fontSize: 13, background: theme.inputBg, border: `1.5px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box", fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", resize: "vertical", lineHeight: 1.6 }}
            />
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            <div style={{ fontSize: 12, color: theme.textMuted }}>
              {providedCopy.replace(/<[^>]+>/g, "").trim().split(/\s+/).filter(Boolean).length} words · {providedCopy.length} characters
            </div>
            <button onClick={runAiScan} disabled={aiScanRunning} style={{ padding: "11px 22px", fontSize: 14, fontWeight: 700, background: aiScanRunning ? theme.barTrack : BRAND_BLUE, color: aiScanRunning ? theme.textMuted : "#fff", border: "none", borderRadius: 9, cursor: aiScanRunning ? "wait" : "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              {aiScanRunning ? "⟳ Scanning your content vs queries…" : "🔍 Let AI scan my content"}
            </button>
          </div>

          {aiScanResult && (
            <div style={{ marginTop: 14, padding: 14, background: aiScanResult.missing.length === 0 ? `${BRAND_GREEN}08` : `${BRAND_AMBER}08`, border: `1.5px solid ${aiScanResult.missing.length === 0 ? BRAND_GREEN : BRAND_AMBER}50`, borderLeft: `4px solid ${aiScanResult.missing.length === 0 ? BRAND_GREEN : BRAND_AMBER}`, borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: aiScanResult.missing.length === 0 ? BRAND_GREEN : BRAND_AMBER, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8 }}>
                AI scan result · {aiScanResult.missing.length === 0 ? "Approved ✓" : `${aiScanResult.missing.length} ${aiScanResult.missing.length === 1 ? "issue" : "issues"} found`}
              </div>

              {aiScanResult.covered.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_GREEN, marginBottom: 6 }}>✓ Queries covered ({aiScanResult.covered.length})</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {aiScanResult.covered.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: theme.text }}>
                        <span style={{ width: 16, height: 16, borderRadius: "50%", background: BRAND_GREEN, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span>
                        <span style={{ flex: 1 }}>{c.query}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: BRAND_GREEN }}>{c.coverage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiScanResult.missing.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_AMBER, marginBottom: 6 }}>✗ Queries missing or weak ({aiScanResult.missing.length})</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {aiScanResult.missing.map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: theme.text }}>
                        <span style={{ width: 16, height: 16, borderRadius: "50%", background: BRAND_AMBER, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>!</span>
                        <span style={{ flex: 1 }}>{m.query}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiScanResult.recommendations.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Recommendations</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>
                    {aiScanResult.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SMS-SENT CARD (post-submit demo gold)
// ============================================================
function SmsSentCard({ sms, theme, isMobile, orderRef }: { sms: { to: string; body: string; sentAt: string }; theme: Theme; isMobile: boolean; orderRef: { id: string; total: number } | null }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 1fr", gap: 16, padding: isMobile ? 16 : 22, background: `linear-gradient(135deg, ${BRAND_BLUE}08, ${BRAND_GREEN}06)`, border: `1.5px solid ${BRAND_BLUE}40`, borderRadius: 14 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_BLUE, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 6 }}>Live notification dispatched</div>
        <div style={{ fontSize: isMobile ? 17 : 19, fontWeight: 700, color: theme.text, lineHeight: 1.25, marginBottom: 6 }}>SMS sent to publisher director</div>
        <div style={{ fontSize: 13.5, color: theme.textSecondary, lineHeight: 1.55, marginBottom: 12 }}>The moment you submit, the publisher's decision-maker gets a phone alert with the full order summary. They can approve from the SMS link without logging into anything.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: theme.text }}>
          <div><strong style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginRight: 8 }}>To</strong>{sms.to}</div>
          <div><strong style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginRight: 8 }}>Sent</strong>{new Date(sms.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
          {orderRef && <div><strong style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginRight: 8 }}>Order</strong>#{orderRef.id.toUpperCase()} · {fmtNIS(orderRef.total)}</div>}
        </div>
      </div>

      <div style={{ background: "#1F2937", borderRadius: 24, padding: 14, border: `4px solid #0F172A`, position: "relative", maxWidth: 320, justifySelf: isMobile ? "stretch" : "end", width: "100%" }}>
        <div style={{ height: 6, width: 56, background: "#0F172A", borderRadius: 3, margin: "0 auto 10px" }} />
        <div style={{ background: "#10B981", color: "#fff", borderRadius: 16, padding: "10px 14px", fontSize: 12.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
          {sms.body}
        </div>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "#94A3B8" }}>Geoscale · just now</div>
      </div>
    </div>
  );
}

// ============================================================
// PUBLISHER · ARTICLE BANK ADMIN
// Where Yedioth manages each agency's prepaid balance manually. Pending top-up requests from
// agencies surface here; the publisher fulfils (sets the credits) or declines. They can also
// adjust the balance directly without an inbound request — e.g. after a cash deposit settles.
// ============================================================
function PublisherBankView({ theme, isMobile, articleCredits, setArticleCredits, topUpRequests, setTopUpRequests, creditLedger, setCreditLedger, agencyName, showToast }: { theme: Theme; isMobile: boolean; articleCredits: number; setArticleCredits: React.Dispatch<React.SetStateAction<number>>; topUpRequests: TopUpRequest[]; setTopUpRequests: React.Dispatch<React.SetStateAction<TopUpRequest[]>>; creditLedger: CreditLedgerEntry[]; setCreditLedger: React.Dispatch<React.SetStateAction<CreditLedgerEntry[]>>; agencyName: string; showToast: (text: string, kind?: "success" | "info" | "warn") => void }) {
  const [adjustValue, setAdjustValue] = useState<string>("");
  const [adjustNote, setAdjustNote] = useState<string>("");
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [grantOverride, setGrantOverride] = useState<string>("");

  const pendingRequests = topUpRequests.filter((r) => r.status === "pending");
  const recentLedger = creditLedger.slice(0, 12);

  const grant = (delta: number, reason: string) => {
    setArticleCredits((prev) => Math.max(0, prev + delta));
    setCreditLedger((prev) => [{ id: `ledger-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), delta, reason, by: "publisher" }, ...prev]);
  };

  const fulfilRequest = (req: TopUpRequest, granted: number) => {
    grant(granted, `Top-up fulfilled · request from ${req.agencyName}${req.note ? ` (${req.note})` : ""}`);
    setTopUpRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: "fulfilled", fulfilledAt: new Date().toISOString(), fulfilledCredits: granted } : r));
    setEditingRequestId(null);
    setGrantOverride("");
    showToast(`+${granted} credits granted to ${req.agencyName}`, "success");
  };

  const rejectRequest = (req: TopUpRequest) => {
    setTopUpRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: "rejected", fulfilledAt: new Date().toISOString() } : r));
    showToast(`Request from ${req.agencyName} declined`, "info");
  };

  const submitManualAdjust = () => {
    const n = parseInt(adjustValue, 10);
    if (isNaN(n) || n === 0) return;
    grant(n, adjustNote.trim() || (n > 0 ? "Manual top-up by Yedioth" : "Manual deduction by Yedioth"));
    setAdjustValue("");
    setAdjustNote("");
    showToast(`Balance ${n > 0 ? "increased" : "decreased"} by ${Math.abs(n)} credits`, "success");
  };

  return (
    <div>
      {/* Header strip */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_AMBER}10 0%, ${BRAND_AMBER}03 100%)`, border: `1px solid ${BRAND_AMBER}30`, borderRadius: 12, padding: isMobile ? 14 : 22, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_AMBER, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 4 }}>Article Bank · Admin</div>
          <div style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: theme.text, marginBottom: 4, letterSpacing: "-0.01em" }}>Manage agency balances</div>
          <div style={{ fontSize: 13.5, color: theme.textSecondary, lineHeight: 1.5, maxWidth: 620 }}>You sell the bank manually — agree on the budget with the agency, then update their balance here. Inbound top-up requests surface below for fulfilment.</div>
        </div>
      </div>

      {/* Pending top-up requests */}
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span>Pending top-up requests</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: BRAND_AMBER, background: `${BRAND_AMBER}15`, padding: "2px 8px", borderRadius: 999 }}>{pendingRequests.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendingRequests.map((req) => {
              const isEditing = editingRequestId === req.id;
              const overrideInt = parseInt(grantOverride, 10);
              const grantAmount = isEditing && !isNaN(overrideInt) && overrideInt > 0 ? overrideInt : req.requestedCredits;
              return (
                <div key={req.id} style={{ padding: 14, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: theme.text, lineHeight: 1.3 }}>{req.agencyName}</div>
                      <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{new Date(req.requestedAt).toLocaleString()}{req.note ? ` · ${req.note}` : ""}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{req.requestedCredits}</div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: theme.textSecondary, marginTop: 3 }}>credits requested</div>
                    </div>
                  </div>
                  {isEditing ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <label style={{ display: "block", fontSize: 11, color: theme.textSecondary, marginBottom: 3 }}>Grant credits</label>
                        <input value={grantOverride} onChange={(e) => setGrantOverride(e.target.value.replace(/[^0-9]/g, ""))} type="text" inputMode="numeric" placeholder={String(req.requestedCredits)} style={{ width: 110, padding: "8px 10px", fontSize: 14, fontWeight: 600, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 7, color: theme.text, outline: "none", fontVariantNumeric: "tabular-nums" }} autoFocus />
                      </div>
                      <button onClick={() => fulfilRequest(req, grantAmount)} style={{ padding: "9px 16px", fontSize: 13, fontWeight: 600, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Confirm · grant {grantAmount}</button>
                      <button onClick={() => { setEditingRequestId(null); setGrantOverride(""); }} style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 7, cursor: "pointer" }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => fulfilRequest(req, req.requestedCredits)} style={{ padding: "9px 16px", fontSize: 13, fontWeight: 600, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Approve · grant {req.requestedCredits}</button>
                      <button onClick={() => { setEditingRequestId(req.id); setGrantOverride(String(req.requestedCredits)); }} style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, background: "transparent", color: theme.text, border: `1px solid ${theme.border}`, borderRadius: 7, cursor: "pointer" }}>Adjust amount</button>
                      <button onClick={() => rejectRequest(req)} style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 7, cursor: "pointer" }}>Decline</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agency balances grid (single agency in demo, but layout supports multi) */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 10 }}>Agency balances</div>
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 16 : 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, lineHeight: 1.3 }}>{agencyName}</div>
              <div style={{ fontSize: 12.5, color: theme.textSecondary, marginTop: 3 }}>Demo agency · single tenant</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: theme.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Balance</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: theme.text, lineHeight: 1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{articleCredits}</div>
              <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 3 }}>{articleCredits === 1 ? "credit" : "credits"}</div>
            </div>
          </div>
          {/* Manual adjust */}
          <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, marginBottom: 8 }}>Manual adjustment</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "120px 1fr auto auto", gap: 8, alignItems: "stretch" }}>
              <input value={adjustValue} onChange={(e) => setAdjustValue(e.target.value.replace(/[^0-9-]/g, ""))} type="text" inputMode="numeric" placeholder="±N" style={{ padding: "9px 10px", fontSize: 14, fontWeight: 600, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 7, color: theme.text, outline: "none", fontVariantNumeric: "tabular-nums" }} />
              <input value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} type="text" placeholder="Reason (e.g. wire received Q2-2026)" style={{ padding: "9px 10px", fontSize: 13, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 7, color: theme.text, outline: "none" }} />
              <button onClick={submitManualAdjust} disabled={!adjustValue || parseInt(adjustValue, 10) === 0} style={{ padding: "9px 16px", fontSize: 13, fontWeight: 600, background: adjustValue && parseInt(adjustValue, 10) !== 0 ? BRAND_AMBER : theme.barTrack, color: adjustValue && parseInt(adjustValue, 10) !== 0 ? "#fff" : theme.textMuted, border: "none", borderRadius: 7, cursor: adjustValue && parseInt(adjustValue, 10) !== 0 ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>Apply</button>
              <button onClick={() => { const target = parseInt(adjustValue, 10); if (!isNaN(target) && target >= 0) { const delta = target - articleCredits; if (delta === 0) return; grant(delta, adjustNote.trim() || `Balance set to ${target} by Yedioth`); setAdjustValue(""); setAdjustNote(""); showToast(`Balance set to ${target} credits`, "success"); } }} disabled={!adjustValue || isNaN(parseInt(adjustValue, 10)) || parseInt(adjustValue, 10) < 0} style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, background: "transparent", color: theme.text, border: `1px solid ${theme.border}`, borderRadius: 7, cursor: adjustValue && parseInt(adjustValue, 10) >= 0 ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>Set to N</button>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: theme.textSecondary, lineHeight: 1.5 }}>Apply = add/subtract relative (use negative to deduct). Set to N = make balance exactly N. Both write a ledger entry.</div>
          </div>
        </div>
      </div>

      {/* Ledger */}
      {recentLedger.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 10 }}>Credit ledger</div>
          <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10, overflow: "hidden" }}>
            {recentLedger.map((entry, i) => (
              <div key={entry.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "11px 14px", background: i % 2 === 0 ? theme.cardBg : theme.tableHeaderBg, borderBottom: i < recentLedger.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: theme.text, lineHeight: 1.4 }}>{entry.reason}</div>
                  <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>{new Date(entry.at).toLocaleString()} · {entry.by}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: entry.delta > 0 ? BRAND_GREEN : theme.text, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{entry.delta > 0 ? `+${entry.delta}` : entry.delta}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ARTICLE BANK MODAL — agency-side balance + top-up request form
// Per Alexei (2026-05-06): publishers sell the bank manually — they meet with the agency, agree
// on a budget, then update the agency's credit balance directly in admin. There is NO credit-card
// checkout. The agency's role here is to (a) see their balance + history, (b) submit a top-up
// REQUEST that the publisher fulfils manually. Bundle/tier pricing was removed — pricing is
// negotiated offline.
// ============================================================
function ArticleBankModal({ open, onClose, theme, isMobile, currentCredits, ledger, topUpRequests, agencyName, onSubmitRequest }: { open: boolean; onClose: () => void; theme: Theme; isMobile: boolean; currentCredits: number; ledger: CreditLedgerEntry[]; topUpRequests: TopUpRequest[]; agencyName: string; onSubmitRequest: (r: { credits: number; note: string }) => void }) {
  const [requestCredits, setRequestCredits] = useState<string>("10");
  const [requestNote, setRequestNote] = useState<string>("");
  if (!open) return null;
  const myRequests = topUpRequests.filter((r) => r.agencyName === agencyName).slice(0, 5);
  const myLedger = ledger.slice(0, 8);
  const parsedCredits = parseInt(requestCredits, 10);
  const canSubmit = !isNaN(parsedCredits) && parsedCredits > 0 && parsedCredits <= 1000;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: isMobile ? "16px 12px" : "40px 20px", overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 16, maxWidth: 760, width: "100%", padding: isMobile ? 18 : 26, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", background: `${BRAND_GREEN}15`, color: BRAND_GREEN, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", borderRadius: 999, marginBottom: 10 }}>
              Article bank · בנק כתבות
            </div>
            <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: theme.text, lineHeight: 1.2, marginBottom: 6, letterSpacing: "-0.01em" }}>Your prepaid balance with Yedioth</div>
            <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.55, maxWidth: 620 }}>
              The publisher manages your bank manually. You can request a top-up here — Yedioth's
              account team will follow up to agree on the budget and add the credits to your balance.
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: theme.textSecondary, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconX size={16} />
          </button>
        </div>

        {/* Balance card */}
        <div style={{ padding: "18px 20px", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 12, marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Current balance</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: theme.text, lineHeight: 1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{currentCredits}</span>
            <span style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary }}>{currentCredits === 1 ? "credit available" : "credits available"}</span>
          </div>
          <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6, lineHeight: 1.5 }}>1 credit = 1 article placement on any Yedioth section. Each article carries a do-follow backlink — standard, not an upsell.</div>
        </div>

        {/* Request top-up form */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 10 }}>Request a top-up</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "150px 1fr auto", gap: 10, alignItems: "stretch" }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: theme.textSecondary, marginBottom: 4 }}>Credits</label>
              <input value={requestCredits} onChange={(e) => setRequestCredits(e.target.value.replace(/[^0-9]/g, ""))} type="text" inputMode="numeric" placeholder="10" style={{ width: "100%", padding: "10px 12px", fontSize: 15, fontWeight: 600, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box", fontVariantNumeric: "tabular-nums" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: theme.textSecondary, marginBottom: 4 }}>Note for Yedioth (optional)</label>
              <input value={requestNote} onChange={(e) => setRequestNote(e.target.value)} type="text" placeholder="Q3 campaign for Bank Hapoalim" style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={() => canSubmit && onSubmitRequest({ credits: parsedCredits, note: requestNote.trim() })} disabled={!canSubmit} style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, background: canSubmit ? BRAND_GREEN : theme.barTrack, color: canSubmit ? "#fff" : theme.textMuted, border: "none", borderRadius: 8, cursor: canSubmit ? "pointer" : "not-allowed", whiteSpace: "nowrap", width: isMobile ? "100%" : undefined }}>Send request</button>
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: theme.textSecondary, lineHeight: 1.5 }}>Yedioth will reach out to confirm the budget. Pricing is negotiated offline. Credits land in your balance once they fulfil the request.</div>
        </div>

        {/* Recent requests */}
        {myRequests.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 8 }}>Your recent top-up requests</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {myRequests.map((r) => {
                const statusColor = r.status === "fulfilled" ? BRAND_GREEN : r.status === "rejected" ? "#9CA3AF" : BRAND_AMBER;
                const statusLabel = r.status === "fulfilled" ? `Fulfilled · +${r.fulfilledCredits ?? r.requestedCredits} credits` : r.status === "rejected" ? "Declined" : "Awaiting publisher";
                return (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 12px", background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>{r.requestedCredits} credits requested{r.note ? ` · ${r.note}` : ""}</div>
                      <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>{new Date(r.requestedAt).toLocaleString()}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: statusColor, background: `${statusColor}15`, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>{statusLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ledger / history */}
        {myLedger.length > 0 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 8 }}>Balance history</div>
            <div style={{ border: `1px solid ${theme.border}`, borderRadius: 9, overflow: "hidden" }}>
              {myLedger.map((entry, i) => (
                <div key={entry.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 14px", background: i % 2 === 0 ? theme.cardBg : theme.tableHeaderBg, borderBottom: i < myLedger.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: theme.text, lineHeight: 1.4 }}>{entry.reason}</div>
                    <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>{new Date(entry.at).toLocaleString()}</div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: entry.delta > 0 ? BRAND_GREEN : theme.text, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{entry.delta > 0 ? `+${entry.delta}` : entry.delta}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
