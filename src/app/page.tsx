"use client";

import { useState, useEffect, useRef } from "react";

// ============================================================
// GEOSCALE DASHBOARD — English version synced with Hebrew
// Header: logo RIGHT, nav center, actions LEFT
// Table-based brands, 5 metrics, tooltips, sort dropdown
// Top 5 trending up / needs attention sections
// Engine Coverage with custom logos
// Dark mode toggle
// ============================================================

// ── Theme types ──
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
};

// ── Geoscale Logo (rendered as img from actual site) ──
function GeoscaleLogo({ width = 150, theme }: { width?: number; theme: Theme }) {
  return (
    <div style={{ direction: "ltr", width }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://www.geoscale.ai/wp-content/uploads/2025/09/data.json"
        alt="Geoscale"
        width={width}
        height={width * 0.2}
        style={{ display: "none" }}
      />
      {/* Static SVG matching the Lottie render */}
      <svg width={width} height={width * 0.2} viewBox="0 0 510 102" fill="none">
        {/* Gray ring */}
        <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="13" fill="none" />
        {/* Dark ring (partial - animated in real logo) */}
        <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
        {/* "Geoscale" wordmark */}
        <g fill={theme.logoFill}>
          <text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text>
        </g>
      </svg>
    </div>
  );
}

// ── Geoscale Logo Mark (circle only, for footer) ──
function GeoscaleLogoMark({ size = 32, theme }: { size?: number; theme: Theme }) {
  return (
    <svg width={size} height={size} viewBox="0 0 102 102" fill="none">
      <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="10" fill="none" />
      <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
    </svg>
  );
}

// ── SVG Icons ──
function IconCheck() {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;
}
function IconChevronRight({ color = "#A2A9B0" }: { color?: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>;
}
function IconSearch({ color = "#A2A9B0" }: { color?: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
}
function IconArrowUp() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>;
}

// ── Ahrefs-style Tooltip ──
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const handleEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.top - 10, left: r.left + r.width / 2 });
    }
    setShow(true);
  };
  return (
    <span ref={ref}
      style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B0B7BF" strokeWidth="2" style={{ display: "block", transition: "stroke 150ms" }} onMouseEnter={(e) => { (e.currentTarget as SVGElement).style.stroke = "#666"; }} onMouseLeave={(e) => { (e.currentTarget as SVGElement).style.stroke = "#B0B7BF"; }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      {show && (
        <div style={{
          position: "fixed", top: pos.top, left: pos.left,
          transform: "translate(-50%, -100%)",
          background: "#1B1F23", color: "#FFFFFF", fontSize: 14, lineHeight: 1.55,
          padding: "8px 12px", borderRadius: 6, whiteSpace: "normal", maxWidth: 280,
          zIndex: 99999, pointerEvents: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        }}>
          {text}
          <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 8, height: 8, background: "#1B1F23" }} />
        </div>
      )}
    </span>
  );
}

// ── Footer (matching geoscale.ai) ──
function Footer({ theme }: { theme: Theme }) {
  return (
    <footer style={{ borderTop: `1px solid ${theme.border}` }}>
      <div className="max-w-[1300px] mx-auto px-6 py-5 flex items-center justify-between" dir="ltr">
        {/* Left: Logo + tagline */}
        <div className="flex items-center gap-3">
          <GeoscaleLogoMark size={28} theme={theme} />
          <span className="text-sm" style={{ color: theme.textSecondary }}>Powered by advanced AI to analyze your search presence</span>
        </div>

        {/* Center: Links — standardized grey/subtle */}
        <div className="flex items-center gap-3">
          {["Feedback", "Report a bug", "Improvement ideas", "API usage"].map((label, i) => (
            <span
              key={i}
              className="text-xs font-medium px-3 py-1.5 cursor-pointer transition-opacity hover:opacity-70"
              style={{ color: theme.textSecondary, background: theme.badgeBg, borderRadius: 20, border: `1px solid ${theme.border}` }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Right: Copyright */}
        <span className="text-xs" style={{ color: theme.textMuted }}>GeoScale 2026 &copy;</span>
      </div>
    </footer>
  );
}

// ── Search Loader ──
function SearchLoader({ theme }: { theme: Theme }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: `2px solid ${theme.border}`, borderTopColor: "#10A37F" }} />
        <span className="text-xs" style={{ color: theme.textSecondary }}>Searching...</span>
      </div>
    </div>
  );
}

// ── Dark Mode Toggle ──
function DarkModeToggle({ darkMode, setDarkMode, theme }: { darkMode: boolean; setDarkMode: (v: boolean) => void; theme: Theme }) {
  return (
    <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "1px solid " + theme.border, borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
        {darkMode ? <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></> : <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>}
      </svg>
    </button>
  );
}

// ── Mock Data ──
const MOCK_BRANDS = [
  {
    name: "All4Horses",
    domain: "all4horses.co.il",
    score: 76,
    scans: 3,
    lastScan: "03/25/2026",
    queries: 37,
    topQuery: "Therapeutic horseback riding for children with ADHD",
    articles: 12,
    pendingArticles: 3,
    actions: [
      { label: "Publish 3 articles to WordPress", done: false },
      { label: "Update meta tags for service pages", done: false },
      { label: "Add Schema markup", done: true },
    ],
  },
  {
    name: "Artisan Bread",
    domain: "artisan-bread.co.il",
    score: 71,
    scans: 2,
    lastScan: "03/25/2026",
    queries: 28,
    topQuery: "Organic sourdough bread home delivery",
    articles: 8,
    pendingArticles: 5,
    actions: [
      { label: "Publish 5 articles to WordPress", done: false },
      { label: "Optimize for Gemini queries", done: false },
      { label: "Competitor visibility check", done: true },
    ],
  },
  {
    name: "Orin Schaefer College",
    domain: "orin-college.co.il",
    score: 64,
    scans: 1,
    lastScan: "03/20/2026",
    queries: 42,
    topQuery: "Interior design studies at an accredited college",
    articles: 15,
    pendingArticles: 0,
    actions: [
      { label: "Re-scan - 5 days elapsed", done: false },
      { label: "Create content for new queries", done: false },
      { label: "Add FAQ Schema", done: true },
    ],
  },
  {
    name: "Calcalist",
    domain: "calcalist.co.il",
    score: 88,
    scans: 5,
    lastScan: "03/25/2026",
    queries: 65,
    topQuery: "Israel business news today",
    articles: 32,
    pendingArticles: 2,
    actions: [
      { label: "Publish 2 new GEO articles", done: false },
      { label: "Update Schema - NewsArticle", done: true },
      { label: "Monthly client report", done: true },
    ],
  },
  {
    name: "Just In Time",
    domain: "justintime.co.il",
    score: 52,
    scans: 1,
    lastScan: "03/23/2026",
    queries: 22,
    topQuery: "Project management for small businesses",
    articles: 6,
    pendingArticles: 4,
    actions: [
      { label: "Publish 4 initial articles", done: false },
      { label: "Build target audience personas", done: true },
      { label: "Develop GEO strategy", done: false },
    ],
  },
  {
    name: "Techom Pest Control",
    domain: "techom-pest.co.il",
    score: 82,
    scans: 4,
    lastScan: "03/24/2026",
    queries: 50,
    topQuery: "Home cockroach extermination - natural methods",
    articles: 18,
    pendingArticles: 1,
    actions: [
      { label: "Publish article about ants", done: false },
      { label: "Update Schema - LocalBusiness", done: true },
      { label: "Monthly client report", done: true },
    ],
  },
];

const RECENT_ACTIVITY = [
  { brand: "Calcalist", score: 88, time: "10:30, 03/25" },
  { brand: "All4Horses", score: 76, time: "20:12, 03/25" },
  { brand: "Artisan Bread", score: 71, time: "11:09, 03/25" },
  { brand: "Techom Pest Control", score: 82, time: "09:30, 03/24" },
  { brand: "Just In Time", score: 52, time: "14:22, 03/23" },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [displayedBrands, setDisplayedBrands] = useState(MOCK_BRANDS);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('geoscale-dark-mode') === 'true';
    }
    return false;
  });
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('geoscale-dark-mode', darkMode.toString());
  }, [darkMode]);

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!searchQuery) { setIsSearching(false); setDisplayedBrands(MOCK_BRANDS); return; }
    setIsSearching(true);
    searchTimeout.current = setTimeout(() => {
      setDisplayedBrands(MOCK_BRANDS.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.domain.includes(searchQuery.toLowerCase())));
      setIsSearching(false);
    }, 700);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [searchQuery]);

  const totalBrands = MOCK_BRANDS.length;
  const totalScans = MOCK_BRANDS.reduce((s, b) => s + b.scans, 0);
  const totalQueries = MOCK_BRANDS.reduce((s, b) => s + b.queries, 0);
  const avgScore = Math.round(MOCK_BRANDS.reduce((s, b) => s + b.score, 0) / MOCK_BRANDS.length);
  const totalPending = MOCK_BRANDS.reduce((s, b) => s + b.pendingArticles, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bg }} dir="ltr">
      {/* ═══ HEADER — 3-column grid: actions | nav | logo ═══ */}
      <header className="sticky top-0 z-50" style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          {/* LEFT in LTR (grid col 1) = Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "start" }}>
            <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none", textDecoration: "none" }}>New Scan</a>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: theme.textSecondary }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
              <span>Connected</span>
            </div>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>

          {/* CENTER (grid col 2) = Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="/" style={{ fontSize: 15, fontWeight: 600, color: theme.text, textDecoration: "none" }}>Dashboard</a>
            <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
            <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>ScalePublish</a>
            <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
            <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Roadmap</a>
          </nav>

          {/* RIGHT in LTR (grid col 3) = Logo */}
          <div style={{ justifySelf: "end" }}>
            <GeoscaleLogo width={150} theme={theme} />
          </div>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1">
        <div className="max-w-[1300px] mx-auto px-6 py-4">
          {/* Page title */}
          <div className="mb-4">
            <h1 className="text-xl font-semibold mb-0 flex items-center gap-2" style={{ color: theme.text, letterSpacing: "-0.5px" }}>Brand Monitoring <Tooltip text="Central dashboard for monitoring brand presence across AI engines" /></h1>
            <p className="text-sm" style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 500 }}>Track brand presence across AI engines</p>
          </div>

          {/* ── Top Metrics — compact GA style with 5 columns ── */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            {[
              { label: "Brands", value: totalBrands, change: "+2", tooltip: "Number of active brands in the system" },
              { label: "Scans", value: totalScans, tooltip: "Total scans performed" },
              { label: "Queries", value: totalQueries, tooltip: "Number of queries checked against AI engines" },
              { label: "Avg. Score", value: `${avgScore}%`, change: "+3.2%", tooltip: "Average visibility score across all brands" },
              { label: "Pending", value: totalPending, color: totalPending > 0 ? "#10A37F" : undefined, tooltip: "Articles created and waiting to be published" },
            ].map((m, i) => (
              <div key={i} style={{ padding: "10px 12px", border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.cardBg }}>
                <div className="text-xs mb-1 flex items-center gap-1" style={{ color: theme.textSecondary, fontSize: 13, fontWeight: 500 }}>{m.label} {(m as any).tooltip && <Tooltip text={(m as any).tooltip} />}</div>
                <div className="flex items-baseline gap-2">
                  <span style={{ fontSize: 28, fontWeight: 700, color: (m as any).color || theme.text, letterSpacing: "-0.5px" }}>{m.value}</span>
                  {m.change && <span className="text-xs" style={{ color: "#10A37F", fontWeight: 600 }}><IconArrowUp /> {m.change}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* ── Top 5 Trending Up / Needs Attention ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
            <div style={{ padding: "14px 16px", border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg }}>
              <div className="flex items-center gap-2 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: theme.text, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>Top 5 Trending Up <Tooltip text="Brands with the largest improvement in visibility score" /></h3>
              </div>
              {[
                { name: "Calcalist", domain: "calcalist.co.il", score: 88, change: "+6.2%" },
                { name: "Techom Pest Control", domain: "techom-pest.co.il", score: 82, change: "+4.8%" },
                { name: "All4Horses", domain: "all4horses.co.il", score: 76, change: "+4.2%" },
                { name: "Artisan Bread", domain: "artisan-bread.co.il", score: 71, change: "+2.1%" },
                { name: "Orin Schaefer College", domain: "orin-college.co.il", score: 64, change: "+1.5%" },
              ].map((b, i) => (
                <a key={i} href="/scan" className="flex items-center gap-3 py-2 px-2 transition-colors" style={{ borderRadius: 6, textDecoration: "none", borderBottom: i < 4 ? `1px solid ${theme.border}` : "none" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <span className="text-xs w-5 text-center" style={{ color: theme.textMuted, fontWeight: 500 }}>{i + 1}</span>
                  <img src={`https://www.google.com/s2/favicons?domain=${b.domain}&sz=64`} alt="" width={20} height={20} style={{ borderRadius: 4, flexShrink: 0, border: `1px solid ${theme.border}`, background: darkMode ? "#FFFFFF" : "transparent", padding: darkMode ? 1 : 0 }} />
                  <span className="text-sm flex-1 truncate" style={{ color: theme.text, fontWeight: 500 }}>{b.name}</span>
                  <span className="text-sm" style={{ color: "#10A37F", fontWeight: 700 }}>{b.score}%</span>
                  <span className="text-xs" style={{ color: "#10A37F", fontWeight: 600 }}>{b.change}</span>
                </a>
              ))}
            </div>
            <div style={{ padding: "14px 16px", border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg }}>
              <div className="flex items-center gap-2 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#DC2626", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>Top 5 Needs Attention <Tooltip text="Brands with declining scores - require content intervention" /></h3>
              </div>
              {[
                { name: "Just In Time", domain: "justintime.co.il", score: 52, change: "-5.1%" },
                { name: "Orin Schaefer College", domain: "orin-college.co.il", score: 64, change: "-3.2%" },
                { name: "Artisan Bread", domain: "artisan-bread.co.il", score: 71, change: "-1.8%" },
              ].map((b, i) => (
                <a key={i} href="/scan" className="flex items-center gap-3 py-2 px-2 transition-colors" style={{ borderRadius: 6, textDecoration: "none", borderBottom: i < 2 ? `1px solid ${theme.border}` : "none" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <span className="text-xs w-5 text-center" style={{ color: theme.textMuted, fontWeight: 500 }}>{i + 1}</span>
                  <img src={`https://www.google.com/s2/favicons?domain=${b.domain}&sz=64`} alt="" width={20} height={20} style={{ borderRadius: 4, flexShrink: 0, border: `1px solid ${theme.border}`, background: darkMode ? "#FFFFFF" : "transparent", padding: darkMode ? 1 : 0 }} />
                  <span className="text-sm flex-1 truncate" style={{ color: theme.text, fontWeight: 500 }}>{b.name}</span>
                  <span className="text-sm" style={{ color: "#DC2626", fontWeight: 700 }}>{b.score}%</span>
                  <span className="text-xs" style={{ color: "#DC2626", fontWeight: 600 }}>{b.change}</span>
                </a>
              ))}
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-3 py-2 px-2" style={{ borderBottom: i < 1 ? `1px solid ${theme.border}` : "none" }}>
                  <span className="text-xs" style={{ color: theme.textMuted }}>&mdash;</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── AI Traffic & Bot Activity Row ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            <div style={{ padding: "14px 16px", border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: theme.text, marginBottom: 2 }}>AI vs Traditional SEO</h3>
              <p style={{ fontSize: 13, marginBottom: 10, color: theme.textSecondary }}>Traffic split</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span style={{ fontSize: 28, fontWeight: 700, color: "#10A37F" }}>13.3%</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#10A37F" }}>+28.4%</span>
              </div>
              <div className="flex h-2 overflow-hidden mb-2" style={{ borderRadius: 20 }}>
                <div style={{ width: "13.3%", background: "#10A37F" }} />
                <div style={{ width: "86.7%", background: theme.barTrack }} />
              </div>
              <div className="flex items-center justify-between" style={{ fontSize: 13, color: theme.textSecondary }}>
                <span>AI - 23,847</span>
                <span>SEO - 156,234</span>
              </div>
            </div>
            <div style={{ padding: "14px 16px", border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg }}>
              <div className="flex items-center justify-between mb-1">
                <h3 style={{ fontSize: 18, fontWeight: 600, color: theme.text }}>Bot Crawl Activity</h3>
                <span style={{ fontSize: 13, fontWeight: 600, padding: "1px 8px", background: "#10A37F15", color: "#10A37F", borderRadius: 20 }}>live</span>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                {[
                  { bot: "GPTBot", domain: "openai.com", pages: "1,247", ago: "2h" },
                  { bot: "PerplexityBot", domain: "perplexity.ai", pages: "892", ago: "15m" },
                  { bot: "Claude-Web", domain: "anthropic.com", pages: "456", ago: "4h" },
                  { bot: "BingBot", domain: "bing.com", pages: "2,134", ago: "1h" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <img src={`https://www.google.com/s2/favicons?domain=${b.domain}&sz=64`} alt="" width={16} height={16} style={{ borderRadius: 3, flexShrink: 0, background: darkMode ? "#FFFFFF" : "transparent", padding: darkMode ? 1 : 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 500, flex: 1, color: theme.text }}>{b.bot}</span>
                    <span style={{ fontSize: 13, color: theme.textSecondary }}>{b.pages}</span>
                    <span style={{ fontSize: 13, color: theme.textMuted }}>{b.ago}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "14px 16px", border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: theme.text }}>Engine Coverage</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { engine: "Google AIO", score: 78, icon: <img src="https://www.google.com/s2/favicons?domain=google.com&sz=64" alt="" width={12} height={12} style={{ borderRadius: 2, flexShrink: 0 }} /> },
                  { engine: "Bing Copilot", score: 82, icon: <img src="https://www.google.com/s2/favicons?domain=bing.com&sz=64" alt="" width={12} height={12} style={{ borderRadius: 2, flexShrink: 0 }} /> },
                  { engine: "ChatGPT", score: 71, icon: <img src="/logos/chatgpt.svg" width={12} height={12} alt="ChatGPT" style={{ display: "inline-block" }} /> },
                  { engine: "Gemini", score: 69, icon: <img src="/logos/gemini.svg" width={12} height={12} alt="Gemini" style={{ display: "inline-block" }} /> },
                  { engine: "Perplexity", score: 85, icon: <img src="/logos/perplexity.svg" width={12} height={12} alt="Perplexity" style={{ display: "inline-block" }} /> },
                ].map((e, i) => {
                  const color = e.score >= 80 ? "#10A37F" : e.score >= 70 ? "#727272" : "#DC2626";
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5">
                          {e.icon}
                          <span style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{e.engine}</span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color }}>{e.score}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: theme.barTrack, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${e.score}%`, background: color, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Brands Table (rows, not cards) ── */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: 18, fontWeight: 600, color: theme.text }}>Your Brands</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-48 px-3 py-2 pl-9 text-xs focus:outline-none" style={{ border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.inputBg, color: theme.text }} />
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2"><IconSearch color={theme.textMuted} /></div>
                </div>
                <select className="text-xs px-3 py-2" style={{ border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.text, background: theme.inputBg }}>
                  <option>Sort: By urgency</option>
                  <option>Sort: Score high to low</option>
                  <option>Sort: Score low to high</option>
                  <option>Sort: Name A-Z</option>
                </select>
              </div>
            </div>

            {isSearching ? <SearchLoader theme={theme} /> : (
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, overflow: "hidden" }}>
                <table style={{ width: "100%", fontSize: 15, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 13 }}>Brand</th>
                      <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 13 }}>GEO Score</th>
                      <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 13 }}>Scans</th>
                      <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 13 }}>Queries</th>
                      <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 13 }}>Pending</th>
                      <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 13 }}>Top Query</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedBrands.sort((a, b) => a.score - b.score).map((brand) => {
                      const scoreColor = brand.score >= 80 ? "#10A37F" : brand.score >= 65 ? "#727272" : "#DC2626";
                      return (
                        <tr key={brand.domain} onClick={() => window.location.href = "/scan"} className="cursor-pointer transition-colors" style={{ borderBottom: `1px solid ${theme.border}`, background: theme.tableBg }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = theme.tableBg; }}>
                          <td style={{ padding: "10px 14px" }}>
                            <div className="flex items-center gap-3">
                              <img src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=64`} alt="" width={22} height={22} style={{ borderRadius: 5, flexShrink: 0, border: `1px solid ${theme.border}`, background: darkMode ? "#FFFFFF" : "transparent", padding: darkMode ? 1 : 0 }} />
                              <div>
                                <div style={{ fontSize: 15, fontWeight: 500, color: theme.text }}>{brand.name}</div>
                                <div style={{ fontSize: 13, color: theme.textMuted }}>{brand.domain}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: scoreColor }}>{brand.score}%</span>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ fontSize: 15, color: theme.text }}>{brand.scans}</span>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ fontSize: 15, color: theme.text }}>{brand.queries}</span>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ fontSize: 15, fontWeight: 500, color: brand.pendingArticles > 0 ? "#10A37F" : theme.text }}>{brand.pendingArticles}</span>
                          </td>
                          <td style={{ padding: "10px 14px", maxWidth: 220 }}>
                            <span className="text-sm truncate block" style={{ color: theme.textSecondary, fontSize: 14 }}>{brand.topQuery}</span>
                          </td>
                          <td style={{ padding: "10px 14px", textAlign: "center" }}><IconChevronRight color={theme.textMuted} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ═══ FOOTER ═══ */}
      <Footer theme={theme} />
    </div>
  );
}
