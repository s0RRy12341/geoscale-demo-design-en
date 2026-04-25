"use client";

import React, { useState, useEffect, useMemo } from "react";

// ============================================================
// TRAFFIC DETAIL — Ahrefs-style organic traffic table
// All4Horses | 8,240 monthly visitors
// ============================================================

type Theme = {
  bg: string;
  cardBg: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  headerBg: string;
  hoverBg: string;
  tableBg: string;
  tableHeaderBg: string;
  badgeBg: string;
  inputBg: string;
  barTrack: string;
  logoFill: string;
  logoStroke: string;
  subtleBg: string;
};

const LIGHT_THEME: Theme = {
  bg: "#FFFFFF",
  cardBg: "#FFFFFF",
  border: "#E5E5E5",
  text: "#000000",
  textSecondary: "#727272",
  textMuted: "#A2A9B0",
  headerBg: "rgba(255,255,255,0.96)",
  hoverBg: "#FAFAFA",
  tableBg: "#FFFFFF",
  tableHeaderBg: "#FAFAFA",
  badgeBg: "#F9F9F9",
  inputBg: "#FFFFFF",
  barTrack: "#E5E5E5",
  logoFill: "#141414",
  logoStroke: "#ABABAB",
  subtleBg: "#F9FAFB",
};

const DARK_THEME: Theme = {
  bg: "#0D1117",
  cardBg: "#161B22",
  border: "#30363D",
  text: "#E6EDF3",
  textSecondary: "#8B949E",
  textMuted: "#484F58",
  headerBg: "rgba(13,17,23,0.96)",
  hoverBg: "#1C2128",
  tableBg: "#161B22",
  tableHeaderBg: "#1C2128",
  badgeBg: "#1C2128",
  inputBg: "#0D1117",
  barTrack: "#30363D",
  logoFill: "#E6EDF3",
  logoStroke: "#484F58",
  subtleBg: "#161B22",
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function GeoscaleLogo({ theme }: { theme: Theme }) {
  return (
    <svg width={150} height={30} viewBox="0 0 510 102" fill="none">
      <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="13" fill="none" />
      <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
      <g fill={theme.logoFill}><text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text></g>
    </svg>
  );
}

function GeoscaleLogoMark({ theme, size = 32 }: { theme: Theme; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 102 102" fill="none">
      <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="10" fill="none" />
      <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
    </svg>
  );
}

type TrafficRow = {
  url: string;
  title: string;
  traffic: number;
  topKeyword: string;
  topPosition: number;
  trendPct: number;
};

const PAGES: TrafficRow[] = [
  { url: "/benefits-of-therapeutic-riding", title: "5 Key Benefits of Therapeutic Riding for Children with ADHD", traffic: 1420, topKeyword: "therapeutic horseback riding", topPosition: 4, trendPct: 18 },
  { url: "/", title: "All4Horses — Therapeutic Riding Israel", traffic: 1150, topKeyword: "all4horses", topPosition: 1, trendPct: 5 },
  { url: "/horse-therapy-adhd", title: "Horse Therapy for ADHD: Complete Guide", traffic: 980, topKeyword: "horse therapy ADHD children", topPosition: 7, trendPct: 12 },
  { url: "/equine-therapy", title: "Equine-Assisted Therapy in Israel — Programs & Pricing", traffic: 870, topKeyword: "טיפול עם סוסים", topPosition: 3, trendPct: 22 },
  { url: "/kids-riding-lessons", title: "Kids Horseback Riding Lessons — Ages 4-12", traffic: 760, topKeyword: "רכיבה על סוסים לילדים", topPosition: 4, trendPct: 9 },
  { url: "/horse-therapy-autism", title: "Horse Therapy for Children on the Autism Spectrum", traffic: 640, topKeyword: "autism horse therapy", topPosition: 5, trendPct: 14 },
  { url: "/special-needs-program", title: "Special Needs Riding Program — Therapeutic Sessions", traffic: 580, topKeyword: "horse therapy special needs", topPosition: 6, trendPct: 7 },
  { url: "/locations", title: "Our Ranches Across Israel — Locations & Directions", traffic: 510, topKeyword: "חוות סוסים מרכז", topPosition: 6, trendPct: -3 },
  { url: "/about", title: "About All4Horses — Our Mission and Team", traffic: 420, topKeyword: "therapeutic riding ranch", topPosition: 8, trendPct: 4 },
  { url: "/blog/first-lesson-guide", title: "What to Expect at Your First Riding Lesson", traffic: 380, topKeyword: "first horseback riding lesson", topPosition: 9, trendPct: 28 },
  { url: "/blog/horse-care-101", title: "Horse Care 101 — A Beginner's Guide", traffic: 290, topKeyword: "horse care for beginners", topPosition: 11, trendPct: -8 },
  { url: "/contact", title: "Contact Us — Book a Trial Session", traffic: 240, topKeyword: "all4horses contact", topPosition: 1, trendPct: 11 },
];

// total = 8240
const TOTAL_TRAFFIC = PAGES.reduce((acc, p) => acc + p.traffic, 0);

function positionColor(pos: number): string {
  if (pos <= 3) return "#10A37F";
  if (pos <= 10) return "#F59E0B";
  return "#727272";
}

export default function TrafficDetailPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"traffic" | "trend" | "position">("traffic");
  const isMobile = useIsMobile();

  useEffect(() => {
    const stored = localStorage.getItem("geoscale-dark-mode");
    if (stored === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("geoscale-dark-mode", darkMode.toString());
  }, [darkMode]);

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  const btnFilled: React.CSSProperties = { background: darkMode ? "#E6EDF3" : "#000000", color: darkMode ? "#0D1117" : "#FFFFFF", border: darkMode ? "1px solid #E6EDF3" : "1px solid #000000" };

  const filtered = useMemo(() => {
    let rows = PAGES.filter((r) =>
      r.url.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.topKeyword.toLowerCase().includes(search.toLowerCase())
    );
    rows = [...rows].sort((a, b) => {
      if (sortBy === "trend") return b.trendPct - a.trendPct;
      if (sortBy === "position") return a.topPosition - b.topPosition;
      return b.traffic - a.traffic;
    });
    return rows;
  }, [search, sortBy]);

  const card: React.CSSProperties = { background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10 };

  // distribution (top 5 colored, rest "Other")
  const top5 = PAGES.slice(0, 5).sort((a, b) => b.traffic - a.traffic).slice(0, 5);
  const top5Sum = top5.reduce((acc, p) => acc + p.traffic, 0);
  const distSegments = [
    ...top5.map((p, i) => ({ label: p.url, value: p.traffic, color: ["#10A37F", "#0D8F6F", "#3FB68B", "#7AC9A8", "#A8DCC2"][i] })),
    { label: "Other pages", value: TOTAL_TRAFFIC - top5Sum, color: theme.barTrack },
  ];

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', 'Heebo', sans-serif", display: "flex", flexDirection: "column" }} dir="ltr">

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: isMobile ? "0 12px" : "0 24px", height: 56, display: isMobile ? "flex" : "grid", gridTemplateColumns: isMobile ? undefined : "1fr auto 1fr", alignItems: "center", justifyContent: isMobile ? "space-between" : undefined }}>
          {isMobile ? (
            <>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", alignItems: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2">
                  {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></>}
                </svg>
              </button>
              <GeoscaleLogoMark theme={theme} />
              <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                  {darkMode ? <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></> : <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>}
                </svg>
              </button>
            </>
          ) : (
            <>
              <div style={{ justifySelf: "start" }}>
                <GeoscaleLogo theme={theme} />
              </div>
              <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <a href="/" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Dashboard</a>
                <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
                <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>ScalePublish</a>
                <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
                <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Roadmap</a>
              </nav>
              <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "end" }}>
                <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                    {darkMode ? <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></> : <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>}
                  </svg>
                </button>
                <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", ...btnFilled, fontSize: 15, fontWeight: 600, borderRadius: 9, textDecoration: "none" }}>
                  New Scan
                </a>
              </div>
            </>
          )}
        </div>
        {isMobile && mobileMenuOpen && (
          <nav style={{ display: "flex", flexDirection: "column", padding: "8px 12px 16px", borderTop: `1px solid ${theme.border}`, background: theme.headerBg }}>
            {[
              { href: "/", label: "Dashboard" },
              { href: "/scan", label: "Scans" },
              { href: "/scale-publish", label: "ScalePublish" },
              { href: "/editor", label: "Content Editor" },
              { href: "/roadmap", label: "Roadmap" },
            ].map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "10px 8px", borderBottom: `1px solid ${theme.border}` }}>{item.label}</a>
            ))}
            <div style={{ display: "flex", padding: "10px 8px" }}>
              <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", ...btnFilled, fontSize: 15, fontWeight: 600, borderRadius: 9, textDecoration: "none" }}>New Scan</a>
            </div>
          </nav>
        )}
      </header>

      {/* MAIN */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: isMobile ? "16px 12px" : "24px", flex: 1, width: "100%", boxSizing: "border-box" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: theme.textSecondary }}>
          <a href="/scan" style={{ color: theme.textSecondary, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to scan
          </a>
          <span style={{ color: theme.textMuted }}>/</span>
          <span style={{ color: theme.textSecondary }}>All4Horses</span>
          <span style={{ color: theme.textMuted }}>/</span>
          <span style={{ color: theme.text, fontWeight: 500 }}>Traffic</span>
        </div>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: darkMode ? "#1C2128" : "#FFFFFF", overflow: "hidden", flexShrink: 0 }}>
            <img src="https://www.google.com/s2/favicons?domain=all4horses.co.il&sz=64" alt="" width={32} height={32} style={{ borderRadius: 4 }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 2 }}>all4horses.co.il</div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: theme.text, margin: 0, letterSpacing: "-0.5px", display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <span style={{ color: theme.text, fontWeight: 500 }}>{TOTAL_TRAFFIC.toLocaleString()}</span>
              <span style={{ color: theme.textSecondary, fontWeight: 400, fontSize: 18 }}>monthly visitors</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#10A37F" }}>↑ 12% vs last month</span>
            </h1>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Top page traffic", value: "1,420", sub: "/benefits-of-therapeutic-riding", color: "#10A37F" },
            { label: "Direct entries", value: "2,180", sub: "26% of total", color: theme.text },
            { label: "Bounce rate", value: "38%", sub: "↓ 4% vs last mo", color: "#10A37F" },
            { label: "Avg session", value: "2:14", sub: "↑ 8s vs last mo", color: "#10A37F" },
          ].map((c, i) => (
            <div key={i} style={{ ...card, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 500, letterSpacing: "0.3px", textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: c.color, letterSpacing: "-0.5px", marginBottom: 2 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: theme.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Traffic distribution stacked bar */}
        <div style={{ ...card, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: theme.text, letterSpacing: "0.3px", textTransform: "uppercase" }}>Traffic distribution</span>
            <span style={{ fontSize: 12, color: theme.textMuted }}>by top pages</span>
          </div>
          <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", background: theme.barTrack }}>
            {distSegments.map((s, i) => (
              <div key={i} title={`${s.label} — ${s.value.toLocaleString()}`} style={{ width: `${(s.value / TOTAL_TRAFFIC) * 100}%`, background: s.color, transition: "width 600ms" }} />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
            {distSegments.map((s, i) => (
              <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: theme.textSecondary }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: s.color, display: "inline-block" }} />
                <span style={{ fontFamily: i < 5 ? "ui-monospace, SFMono-Regular, monospace" : "inherit", fontSize: 12 }}>{s.label}</span>
                <span style={{ color: theme.textMuted }}>{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ ...card, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.inputBg }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages, titles, keywords..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", color: theme.text, fontFamily: "inherit" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "traffic" | "trend" | "position")}
              style={{ padding: "6px 10px", border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.inputBg, color: theme.text, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
            >
              <option value="traffic">Traffic (high → low)</option>
              <option value="trend">Trend (best growth)</option>
              <option value="position">Top position (best first)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}` }}>
                  {[
                    { label: "Page URL", align: "left" },
                    { label: "Title", align: "left" },
                    { label: "Traffic", align: "right" },
                    { label: "Top Keyword", align: "left" },
                    { label: "Top Pos.", align: "right" },
                    { label: "Trend", align: "right" },
                  ].map((h, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: h.align as "left" | "right", fontSize: 12, fontWeight: 500, color: theme.textSecondary, letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${theme.border}` : "none", transition: "background 120ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = theme.hoverBg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 14px", fontFamily: "ui-monospace, SFMono-Regular, monospace", fontSize: 13, color: theme.text, fontWeight: 400 }}>{row.url}</td>
                    <td style={{ padding: "12px 14px", color: theme.text, fontWeight: 400, maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.title}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: theme.text, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{row.traffic.toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", color: theme.textSecondary, fontWeight: 400, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.topKeyword}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 28, padding: "2px 8px", borderRadius: 6, background: positionColor(row.topPosition) + "15", color: positionColor(row.topPosition), fontWeight: 500, fontSize: 13 }}>{row.topPosition}</span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: row.trendPct > 0 ? "#10A37F" : row.trendPct < 0 ? "#DC2626" : theme.textMuted }}>
                        {row.trendPct > 0 ? "↑" : row.trendPct < 0 ? "↓" : "—"} {row.trendPct !== 0 ? `${Math.abs(row.trendPct)}%` : ""}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px 14px", textAlign: "center", color: theme.textMuted, fontSize: 14 }}>No pages match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "10px 14px", borderTop: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: theme.textSecondary }}>
            <span>Showing <span style={{ color: theme.text, fontWeight: 500 }}>{filtered.length}</span> of <span style={{ color: theme.text, fontWeight: 500 }}>89</span> indexed pages</span>
            <span style={{ color: theme.textMuted, fontSize: 12 }}>Updated 2 days ago · Source: Google Search Console + Ahrefs</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${theme.border}`, marginTop: "auto" }}>
        <div dir="ltr" style={{ maxWidth: 1300, margin: "0 auto", padding: isMobile ? "12px" : "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <GeoscaleLogoMark theme={theme} size={28} />
            {!isMobile && <span style={{ fontSize: 15, color: theme.textSecondary }}>Powered by advanced AI to analyze your search presence</span>}
          </div>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {["Feedback", "Report a bug", "Improvement ideas", "API usage"].map((label, i) => (
                <span key={i} style={{ fontSize: 15, fontWeight: 500, padding: "4px 12px", borderRadius: 20, color: theme.textSecondary, background: theme.badgeBg, border: `1px solid ${theme.border}`, cursor: "pointer", transition: "all 150ms" }}>{label}</span>
              ))}
            </div>
          )}
          <span style={{ fontSize: 15, color: theme.textMuted }}>GeoScale 2026 &copy;</span>
        </div>
      </footer>
    </div>
  );
}
