"use client";

import React, { useState, useEffect, useMemo } from "react";

// ============================================================
// KEYWORDS DETAIL — Ahrefs-style ranking keywords table
// All4Horses | 347 ranking keywords
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
    const mq = window.matchMedia('(max-width: 767px)');
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
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

// ── Mock keyword data (15 rows) ──
type KeywordRow = {
  keyword: string;
  position: number;
  prevPosition: number;
  volume: number;
  kd: number;
  cpc: number;
  traffic: number;
  url: string;
};

const KEYWORDS: KeywordRow[] = [
  { keyword: "therapeutic horseback riding", position: 4, prevPosition: 7, volume: 1900, kd: 28, cpc: 1.80, traffic: 320, url: "/benefits-of-therapeutic-riding" },
  { keyword: "horse therapy ADHD children", position: 7, prevPosition: 8, volume: 720, kd: 15, cpc: 1.20, traffic: 87, url: "/horse-therapy-adhd" },
  { keyword: "equine assisted therapy israel", position: 12, prevPosition: 10, volume: 480, kd: 22, cpc: 2.40, traffic: 41, url: "/equine-therapy" },
  { keyword: "all4horses", position: 1, prevPosition: 1, volume: 1100, kd: 4, cpc: 0.30, traffic: 940, url: "/" },
  { keyword: "רכיבה תרפויטית", position: 2, prevPosition: 5, volume: 2400, kd: 31, cpc: 2.10, traffic: 612, url: "/benefits-of-therapeutic-riding" },
  { keyword: "טיפול עם סוסים", position: 3, prevPosition: 4, volume: 1300, kd: 24, cpc: 1.60, traffic: 287, url: "/equine-therapy" },
  { keyword: "horse riding lessons children", position: 9, prevPosition: 11, volume: 880, kd: 26, cpc: 1.40, traffic: 71, url: "/kids-riding-lessons" },
  { keyword: "autism horse therapy", position: 5, prevPosition: 5, volume: 590, kd: 19, cpc: 1.10, traffic: 89, url: "/horse-therapy-autism" },
  { keyword: "חוות סוסים מרכז", position: 6, prevPosition: 9, volume: 1600, kd: 33, cpc: 1.90, traffic: 198, url: "/locations" },
  { keyword: "hippotherapy benefits", position: 14, prevPosition: 12, volume: 390, kd: 17, cpc: 0.90, traffic: 28, url: "/benefits-of-therapeutic-riding" },
  { keyword: "kids horseback riding near me", position: 11, prevPosition: 14, volume: 1450, kd: 41, cpc: 2.30, traffic: 102, url: "/kids-riding-lessons" },
  { keyword: "רכיבה על סוסים לילדים", position: 4, prevPosition: 6, volume: 2900, kd: 36, cpc: 1.70, traffic: 487, url: "/kids-riding-lessons" },
  { keyword: "therapeutic riding ranch", position: 8, prevPosition: 8, volume: 320, kd: 14, cpc: 1.30, traffic: 38, url: "/about" },
  { keyword: "horse therapy special needs", position: 6, prevPosition: 9, volume: 510, kd: 21, cpc: 1.50, traffic: 76, url: "/special-needs-program" },
  { keyword: "סוסים לטיפול ADHD", position: 2, prevPosition: 3, volume: 880, kd: 18, cpc: 1.40, traffic: 264, url: "/horse-therapy-adhd" },
];

function positionColor(pos: number): string {
  if (pos <= 3) return "#10A37F";
  if (pos <= 10) return "#F59E0B";
  return "#727272";
}

function kdColor(kd: number): string {
  if (kd <= 14) return "#10A37F";
  if (kd <= 29) return "#F59E0B";
  if (kd <= 49) return "#EA580C";
  return "#DC2626";
}

function trendArrow(curr: number, prev: number) {
  const diff = prev - curr; // positive = improved (lower position is better)
  if (diff === 0) return { text: "—", color: "#A2A9B0" };
  if (diff > 0) return { text: `↑${diff}`, color: "#10A37F" };
  return { text: `↓${Math.abs(diff)}`, color: "#DC2626" };
}

export default function KeywordsDetailPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"position" | "volume" | "kd" | "traffic">("traffic");
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
    let rows = KEYWORDS.filter((r) => r.keyword.toLowerCase().includes(search.toLowerCase()));
    rows = [...rows].sort((a, b) => {
      if (sortBy === "position") return a.position - b.position;
      if (sortBy === "volume") return b.volume - a.volume;
      if (sortBy === "kd") return a.kd - b.kd;
      return b.traffic - a.traffic;
    });
    return rows;
  }, [search, sortBy]);

  const top3 = KEYWORDS.filter((k) => k.position <= 3).length;
  const top10 = KEYWORDS.filter((k) => k.position <= 10).length;
  const top100 = KEYWORDS.length; // all are top 100 in our mock; show as full count
  const avgPosition = (KEYWORDS.reduce((acc, k) => acc + k.position, 0) / KEYWORDS.length).toFixed(1);

  const card: React.CSSProperties = { background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10 };

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
          <span style={{ color: theme.text, fontWeight: 500 }}>Keywords</span>
        </div>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: darkMode ? "#1C2128" : "#FFFFFF", overflow: "hidden", flexShrink: 0 }}>
            <img src="https://www.google.com/s2/favicons?domain=all4horses.co.il&sz=64" alt="" width={32} height={32} style={{ borderRadius: 4 }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 2 }}>all4horses.co.il</div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: theme.text, margin: 0, letterSpacing: "-0.5px" }}>
              <span style={{ color: theme.text, fontWeight: 500 }}>347</span>
              <span style={{ color: theme.textSecondary, fontWeight: 400, fontSize: 18, marginLeft: 8 }}>ranking keywords</span>
            </h1>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Top 3", value: "42", sub: "positions 1-3", color: "#10A37F" },
            { label: "Top 10", value: "118", sub: "positions 1-10", color: "#F59E0B" },
            { label: "Top 100", value: "347", sub: "positions 1-100", color: theme.text },
            { label: "Avg position", value: avgPosition, sub: "across all kw", color: theme.text },
          ].map((c, i) => (
            <div key={i} style={{ ...card, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 500, letterSpacing: "0.3px", textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: c.color, letterSpacing: "-0.5px", marginBottom: 2 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ ...card, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.inputBg }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keywords..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", color: theme.text, fontFamily: "inherit" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "position" | "volume" | "kd" | "traffic")}
              style={{ padding: "6px 10px", border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.inputBg, color: theme.text, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
            >
              <option value="traffic">Traffic (high → low)</option>
              <option value="volume">Volume (high → low)</option>
              <option value="position">Position (best first)</option>
              <option value="kd">KD (low → high)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}` }}>
                  {["Keyword", "Position", "Volume", "KD", "CPC", "Traffic", "URL", "Trend"].map((h, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: i === 0 || i === 6 ? "left" : "right", fontSize: 12, fontWeight: 500, color: theme.textSecondary, letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => {
                  const trend = trendArrow(row.position, row.prevPosition);
                  return (
                    <tr
                      key={i}
                      style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${theme.border}` : "none", transition: "background 120ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = theme.hoverBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "12px 14px", fontWeight: 400, color: theme.text }}>{row.keyword}</td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 28, padding: "2px 8px", borderRadius: 6, background: positionColor(row.position) + "15", color: positionColor(row.position), fontWeight: 500, fontSize: 13 }}>{row.position}</span>
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: theme.text, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{row.volume.toLocaleString()}</td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 28, padding: "2px 8px", borderRadius: 6, background: kdColor(row.kd) + "15", color: kdColor(row.kd), fontWeight: 500, fontSize: 13 }}>{row.kd}</span>
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: theme.textSecondary, fontWeight: 400, fontVariantNumeric: "tabular-nums" }}>${row.cpc.toFixed(2)}</td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: theme.text, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{row.traffic.toLocaleString()}</td>
                      <td style={{ padding: "12px 14px", textAlign: "left" }}>
                        <span style={{ fontSize: 13, color: theme.textSecondary, fontFamily: "ui-monospace, SFMono-Regular, monospace" }}>{row.url}</span>
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: trend.color }}>{trend.text}</span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: "40px 14px", textAlign: "center", color: theme.textMuted, fontSize: 14 }}>No keywords match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "10px 14px", borderTop: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: theme.textSecondary }}>
            <span>Showing <span style={{ color: theme.text, fontWeight: 500 }}>{filtered.length}</span> of <span style={{ color: theme.text, fontWeight: 500 }}>347</span> keywords</span>
            <span style={{ color: theme.textMuted, fontSize: 12 }}>Updated 2 days ago · Source: Ahrefs</span>
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
