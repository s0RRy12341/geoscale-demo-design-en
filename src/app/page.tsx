"use client";

import { useState, useEffect, useRef } from "react";

// ============================================================
// GEOSCALE DASHBOARD — English version synced with Hebrew
// Header: logo RIGHT, nav center, actions LEFT
// Table-based brands, 5 metrics, tooltips, sort dropdown
// Top 5 trending up / needs attention sections
// Engine Coverage with custom logos
// Dark mode toggle
// Mobile responsive with hamburger menu
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

// ── Responsive Hook ──
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, [breakpoint]);
  return isMobile;
}

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsTablet(w >= 768 && w < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isTablet;
}

// ── Geoscale Logo (rendered as SVG) ──
function GeoscaleLogo({ width = 150, theme }: { width?: number; theme: Theme }) {
  return (
    <div style={{ direction: "ltr", width }}>
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

// ── Geoscale Logo Mark (circle only, for footer and mobile header) ──
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
function IconHamburger({ color = "#000" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
function IconClose({ color = "#000" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// ── Ahrefs-style Tooltip (mobile-friendly: tap to open, tap anywhere to dismiss) ──
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

  const updatePos = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      const tooltipWidth = 280;
      let left = r.left + r.width / 2;
      if (left - tooltipWidth / 2 < 12) left = tooltipWidth / 2 + 12;
      if (left + tooltipWidth / 2 > window.innerWidth - 12) left = window.innerWidth - tooltipWidth / 2 - 12;
      setPos({ top: r.top - 10, left });
    }
  };

  useEffect(() => {
    if (!show) return;
    const dismiss = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener("touchstart", dismiss);
    document.addEventListener("mousedown", dismiss);
    return () => { document.removeEventListener("touchstart", dismiss); document.removeEventListener("mousedown", dismiss); };
  }, [show]);

  return (
    <span ref={ref}
      style={{ display: "inline-flex", alignItems: "center", cursor: "help", flexShrink: 0, padding: 4, margin: -4 }}
      onMouseEnter={() => { if (!isTouchDevice) { updatePos(); setShow(true); } }}
      onMouseLeave={() => { if (!isTouchDevice) setShow(false); }}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); updatePos(); setShow(!show); }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={show ? "#10A37F" : "#B0B7BF"} strokeWidth="2" style={{ display: "block", transition: "stroke 150ms" }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      {show && (
        <div style={{
          position: "fixed", top: pos.top, left: pos.left,
          transform: "translate(-50%, -100%)",
          background: "#1B1F23", color: "#FFFFFF", fontSize: 14, lineHeight: 1.55,
          padding: "10px 14px", borderRadius: 8, whiteSpace: "normal", maxWidth: 280,
          zIndex: 99999, pointerEvents: "auto", boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
        }}>
          {text}
          <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 8, height: 8, background: "#1B1F23" }} />
        </div>
      )}
    </span>
  );
}

// ── Footer (matching geoscale.ai) ──
function Footer({ theme, isMobile }: { theme: Theme; isMobile: boolean }) {
  if (isMobile) {
    return (
      <footer style={{ borderTop: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "16px 16px", direction: "ltr" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <GeoscaleLogoMark size={24} theme={theme} />
              <span style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 400, textAlign: "center" }}>Powered by advanced AI</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
              {["Feedback", "Report a bug", "API usage"].map((label, i) => (
                <span
                  key={i}
                  style={{ fontSize: 12, fontWeight: 500, padding: "4px 10px", cursor: "pointer", color: theme.textSecondary, background: theme.badgeBg, borderRadius: 20, border: `1px solid ${theme.border}` }}
                >
                  {label}
                </span>
              ))}
            </div>
            <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 400 }}>GeoScale 2026 &copy;</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{ borderTop: `1px solid ${theme.border}` }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", direction: "ltr" }}>
        {/* Left: Logo + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <GeoscaleLogoMark size={28} theme={theme} />
          <span style={{ fontSize: 14, color: theme.textSecondary, fontWeight: 400 }}>Powered by advanced AI to analyze your search presence</span>
        </div>

        {/* Center: Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {["Feedback", "Report a bug", "Improvement ideas", "API usage"].map((label, i) => (
            <span
              key={i}
              style={{ fontSize: 12, fontWeight: 500, padding: "6px 12px", cursor: "pointer", color: theme.textSecondary, background: theme.badgeBg, borderRadius: 20, border: `1px solid ${theme.border}`, transition: "opacity 150ms" }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Right: Copyright */}
        <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 400 }}>GeoScale 2026 &copy;</span>
      </div>
    </footer>
  );
}

// ── Search Loader ──
function SearchLoader({ theme }: { theme: Theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${theme.border}`, borderTopColor: "#10A37F", animation: "spin-slow 1s linear infinite" }} />
        <span style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 400 }}>Searching...</span>
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

// ── Mobile Menu Overlay ──
function MobileMenu({ open, onClose, theme, darkMode, setDarkMode }: { open: boolean; onClose: () => void; theme: Theme; darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
      {/* Panel */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        background: theme.cardBg, borderBottom: `1px solid ${theme.border}`,
        padding: "16px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}>
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <GeoscaleLogoMark size={28} theme={theme} />
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <IconClose color={theme.text} />
          </button>
        </div>
        {/* Nav links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { href: "/", label: "Dashboard", active: true },
            { href: "/scan", label: "Scans", active: false },
            { href: "/scale-publish", label: "ScalePublish", active: false },
            { href: "/editor", label: "Content Editor", active: false },
            { href: "/roadmap", label: "Roadmap", active: false },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              onClick={onClose}
              style={{
                display: "block",
                padding: "14px 0",
                fontSize: 16,
                fontWeight: item.active ? 600 : 500,
                color: item.active ? theme.text : theme.textSecondary,
                textDecoration: "none",
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "10px 24px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none", textDecoration: "none", flex: 1, justifyContent: "center" }}>New Scan</a>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
        </div>
      </div>
    </div>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const isMobile = useIsMobile(768);
  const isTablet = useIsTablet();

  useEffect(() => {
    localStorage.setItem('geoscale-dark-mode', darkMode.toString());
  }, [darkMode]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: theme.bg }} dir="ltr">
      {/* Mobile Menu Overlay */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* ═══ HEADER ═══ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: theme.headerBg, borderBottom: `1px solid ${theme.border}`,
        backdropFilter: "blur(8px)",
      }}>
        {isMobile ? (
          /* ── Mobile Header ── */
          <div style={{ padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <IconHamburger color={theme.text} />
            </button>
            <GeoscaleLogoMark size={32} theme={theme} />
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>
        ) : (
          /* ── Desktop Header ── */
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
            {/* LEFT = Logo */}
            <div style={{ justifySelf: "start" }}>
              <GeoscaleLogo width={150} theme={theme} />
            </div>

            {/* CENTER = Nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <a href="/" style={{ fontSize: 15, fontWeight: 600, color: theme.text, textDecoration: "none" }}>Dashboard</a>
              <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
              <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>ScalePublish</a>
              <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
              <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Roadmap</a>
            </nav>

            {/* RIGHT = Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "end" }}>
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
              <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none", textDecoration: "none" }}>New Scan</a>
            </div>
          </div>
        )}
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{ flex: 1, width: "100%", minWidth: 0 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: isMobile ? "16px 16px" : "16px 24px", width: "100%", boxSizing: "border-box" }}>
          {/* Page title */}
          <div style={{ marginBottom: 16, textAlign: isMobile ? "center" : "left" }}>
            <h1 style={{
              fontSize: isMobile ? 18 : 20,
              fontWeight: 600,
              color: theme.text,
              letterSpacing: "-0.5px",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: isMobile ? "center" : "flex-start",
            }}>
              Brand Monitoring <Tooltip text="Central dashboard for monitoring brand presence across AI engines. Data is aggregated from scans across ChatGPT, Gemini, Perplexity, Bing Copilot and Google AIO." />
            </h1>
            <p style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 500, margin: "4px 0 0" }}>Track brand presence across AI engines</p>
          </div>

          {/* ── Top Metrics — GA-style KPI cards ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
            gap: isMobile ? 10 : 8,
            marginBottom: 16,
          }}>
            {[
              { label: "Brands", value: totalBrands, change: "+2", tooltip: "Number of active brands being monitored in the system. Each brand has its own domain and set of tracked queries." },
              { label: "Scans", value: totalScans, tooltip: "Total number of AI engine scans performed across all brands. Each scan checks how your brand appears in AI-generated answers." },
              { label: "Queries", value: totalQueries, tooltip: "Total number of search queries being tracked. These are the questions users ask AI engines that are relevant to your brands." },
              { label: "Avg. Score", value: `${avgScore}%`, change: "+3.2%", tooltip: "Average GEO visibility score across all brands. Higher means your brands appear more frequently and prominently in AI answers." },
              { label: "Pending", value: totalPending, color: totalPending > 0 ? "#10A37F" : undefined, tooltip: "Number of AI-optimized articles created and waiting to be published to WordPress or your CMS." },
            ].map((m, i) => (
              <div key={i} style={{ padding: isMobile ? "14px 16px" : "10px 12px", border: `1px solid ${theme.border}`, borderRadius: 8, background: theme.cardBg }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: theme.textSecondary, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  {m.label} <Tooltip text={m.tooltip} />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 28, fontWeight: 500, color: m.color || theme.text, letterSpacing: "-0.5px" }}>{m.value}</span>
                  {m.change && <span style={{ fontSize: 14, fontWeight: 500, color: "#10A37F", display: "inline-flex", alignItems: "center", gap: 2 }}><IconArrowUp /> {m.change}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* ── Top 5 Trending Up / Needs Attention ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}>
            {/* Trending Up */}
            <div style={{ padding: isMobile ? "14px 12px" : "14px 16px", border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 500, color: theme.text, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>Top 5 Trending Up <Tooltip text="Brands with the largest improvement in visibility score over the last 30 days. Score change is calculated from the previous scan." /></h3>
              </div>
              {[
                { name: "Calcalist", domain: "calcalist.co.il", score: 88, change: "+6.2%" },
                { name: "Techom Pest Control", domain: "techom-pest.co.il", score: 82, change: "+4.8%" },
                { name: "All4Horses", domain: "all4horses.co.il", score: 76, change: "+4.2%" },
                { name: "Artisan Bread", domain: "artisan-bread.co.il", score: 71, change: "+2.1%" },
                { name: "Orin Schaefer College", domain: "orin-college.co.il", score: 64, change: "+1.5%" },
              ].map((b, i) => (
                <a key={i} href="/scan" style={{
                  display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, padding: "8px", borderRadius: 6,
                  textDecoration: "none", borderBottom: i < 4 ? `1px solid ${theme.border}` : "none",
                  transition: "background 150ms",
                }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: theme.textMuted, width: 20, textAlign: "center", flexShrink: 0 }}>{i + 1}</span>
                  <img src={`https://www.google.com/s2/favicons?domain=${b.domain}&sz=64`} alt="" width={20} height={20} style={{ borderRadius: 4, flexShrink: 0, border: `1px solid ${theme.border}`, background: darkMode ? "#FFFFFF" : "transparent", padding: darkMode ? 1 : 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: theme.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#10A37F", flexShrink: 0 }}>{b.score}%</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#10A37F", flexShrink: 0 }}>{b.change}</span>
                </a>
              ))}
            </div>

            {/* Needs Attention */}
            <div style={{ padding: isMobile ? "14px 12px" : "14px 16px", border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 500, color: "#B45309", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>Top 5 Needs Attention <Tooltip text="Brands with declining visibility scores that require content intervention. Negative changes indicate reduced AI engine mentions." /></h3>
              </div>
              {[
                { name: "Just In Time", domain: "justintime.co.il", score: 52, change: "-5.1%" },
                { name: "Orin Schaefer College", domain: "orin-college.co.il", score: 64, change: "-3.2%" },
                { name: "Artisan Bread", domain: "artisan-bread.co.il", score: 71, change: "-1.8%" },
              ].map((b, i) => (
                <a key={i} href="/scan" style={{
                  display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, padding: "8px", borderRadius: 6,
                  textDecoration: "none", borderBottom: i < 2 ? `1px solid ${theme.border}` : "none",
                  transition: "background 150ms",
                }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: theme.textMuted, width: 20, textAlign: "center", flexShrink: 0 }}>{i + 1}</span>
                  <img src={`https://www.google.com/s2/favicons?domain=${b.domain}&sz=64`} alt="" width={20} height={20} style={{ borderRadius: 4, flexShrink: 0, border: `1px solid ${theme.border}`, background: darkMode ? "#FFFFFF" : "transparent", padding: darkMode ? 1 : 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: theme.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#B45309", flexShrink: 0 }}>{b.score}%</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#B45309", flexShrink: 0 }}>{b.change}</span>
                </a>
              ))}
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`empty-${i}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px", borderBottom: i < 1 ? `1px solid ${theme.border}` : "none" }}>
                  <span style={{ fontSize: 12, color: theme.textMuted }}>&mdash;</span>
                </div>
              ))}
            </div>
          </div>


          {/* ── Brands Table ── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: "flex",
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
              marginBottom: 12,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 8 : 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 500, color: theme.text, margin: 0 }}>Your Brands</h2>
                <Tooltip text="All brands you are managing. Click any row to view detailed scan results, query breakdown, and pending actions." />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    style={{
                      width: isMobile ? "100%" : 192,
                      padding: "8px 12px 8px 32px",
                      fontSize: 12,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      background: theme.inputBg,
                      color: theme.text,
                      outline: "none",
                      fontWeight: 400,
                    }}
                  />
                  <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}><IconSearch color={theme.textMuted} /></div>
                </div>
                <select style={{
                  fontSize: 12,
                  padding: "8px 12px",
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  color: theme.text,
                  background: theme.inputBg,
                  fontWeight: 400,
                }}>
                  <option>Sort: By urgency</option>
                  <option>Sort: Score high to low</option>
                  <option>Sort: Score low to high</option>
                  <option>Sort: Name A-Z</option>
                </select>
              </div>
            </div>

            {isSearching ? <SearchLoader theme={theme} /> : isMobile ? (
              /* ── Mobile: Card layout for brands ── */
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {displayedBrands.sort((a, b) => a.score - b.score).map((brand) => {
                  const scoreColor = brand.score >= 80 ? "#10A37F" : brand.score >= 65 ? "#727272" : "#B45309";
                  return (
                    <div key={brand.domain} onClick={() => window.location.href = "/scan"} style={{
                      padding: "14px 16px", border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg, cursor: "pointer",
                    }}>
                      {/* Brand header */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <img src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=64`} alt="" width={24} height={24} style={{ borderRadius: 5, flexShrink: 0, border: `1px solid ${theme.border}`, background: darkMode ? "#FFFFFF" : "transparent", padding: darkMode ? 1 : 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 500, color: theme.text }}>{brand.name}</div>
                          <div style={{ fontSize: 13, color: theme.textMuted, fontWeight: 400 }}>{brand.domain}</div>
                        </div>
                        <span style={{ fontSize: 22, fontWeight: 500, color: scoreColor }}>{brand.score}%</span>
                      </div>
                      {/* Metrics row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 500, textTransform: "uppercase" }}>Scans</div>
                          <div style={{ fontSize: 15, fontWeight: 500, color: theme.text }}>{brand.scans}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 500, textTransform: "uppercase" }}>Queries</div>
                          <div style={{ fontSize: 15, fontWeight: 500, color: theme.text }}>{brand.queries}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 500, textTransform: "uppercase" }}>Pending</div>
                          <div style={{ fontSize: 15, fontWeight: 500, color: brand.pendingArticles > 0 ? "#10A37F" : theme.text }}>{brand.pendingArticles}</div>
                        </div>
                      </div>
                      {/* Top query */}
                      <div style={{ marginTop: 8, fontSize: 13, color: theme.textSecondary, fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {brand.topQuery}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ── Desktop: Table layout ── */
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", fontSize: 15, borderCollapse: "collapse", minWidth: 700 }}>
                    <thead>
                      <tr style={{ background: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}` }}>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 500, color: theme.textSecondary, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>Brand</th>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 500, color: theme.textSecondary, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>GEO Score</th>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 500, color: theme.textSecondary, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>Scans</th>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 500, color: theme.textSecondary, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>Queries</th>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 500, color: theme.textSecondary, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>Pending</th>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 500, color: theme.textSecondary, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>Top Query</th>
                        <th style={{ width: 40 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedBrands.sort((a, b) => a.score - b.score).map((brand) => {
                        const scoreColor = brand.score >= 80 ? "#10A37F" : brand.score >= 65 ? "#727272" : "#B45309";
                        return (
                          <tr key={brand.domain} onClick={() => window.location.href = "/scan"} style={{ borderBottom: `1px solid ${theme.border}`, background: theme.tableBg, cursor: "pointer", transition: "background 150ms" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = theme.tableBg; }}>
                            <td style={{ padding: "10px 14px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <img src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=64`} alt="" width={22} height={22} style={{ borderRadius: 5, flexShrink: 0, border: `1px solid ${theme.border}`, background: darkMode ? "#FFFFFF" : "transparent", padding: darkMode ? 1 : 0 }} />
                                <div>
                                  <div style={{ fontSize: 15, fontWeight: 500, color: theme.text }}>{brand.name}</div>
                                  <div style={{ fontSize: 13, color: theme.textMuted, fontWeight: 400 }}>{brand.domain}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ fontSize: 15, fontWeight: 500, color: scoreColor }}>{brand.score}%</span>
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ fontSize: 15, color: theme.text, fontWeight: 400 }}>{brand.scans}</span>
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ fontSize: 15, color: theme.text, fontWeight: 400 }}>{brand.queries}</span>
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ fontSize: 15, fontWeight: 500, color: brand.pendingArticles > 0 ? "#10A37F" : theme.text }}>{brand.pendingArticles}</span>
                            </td>
                            <td style={{ padding: "10px 14px", maxWidth: 220 }}>
                              <span style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{brand.topQuery}</span>
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "center" }}><IconChevronRight color={theme.textMuted} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ═══ FOOTER ═══ */}
      <Footer theme={theme} isMobile={isMobile} />
    </div>
  );
}
