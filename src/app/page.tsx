"use client";

import { useState, useEffect, useRef } from "react";

// ============================================================
// GEOSCALE DASHBOARD — Exact brand design
// Header: logo LEFT, nav center, actions RIGHT
// Footer matching geoscale.ai
// Metrics like example10.png (big numbers)
// Clean minimal cards, proper RTL
// ============================================================

// ── Geoscale Logo (rendered as img from actual site) ──
function GeoscaleLogo({ width = 150 }: { width?: number }) {
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
        <circle cx="51" cy="51" r="41" stroke="#ABABAB" strokeWidth="13" fill="none" />
        {/* Dark ring (partial - animated in real logo) */}
        <circle cx="51" cy="51" r="41" stroke="#141414" strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
        {/* "Geoscale" wordmark */}
        <g fill="#141414">
          <text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text>
        </g>
      </svg>
    </div>
  );
}

// ── Geoscale Logo Mark (circle only, for footer) ──
function GeoscaleLogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 102 102" fill="none">
      <circle cx="51" cy="51" r="41" stroke="#ABABAB" strokeWidth="10" fill="none" />
      <circle cx="51" cy="51" r="41" stroke="#141414" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
    </svg>
  );
}

// ── SVG Icons ──
function IconCalendar({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#A2A9B0" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function IconCheck({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;
}
function IconChevronDown({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#A2A9B0" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>;
}
function IconChevronLeft({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#A2A9B0" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>;
}
function IconSearch({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#A2A9B0" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
}
function IconChart({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="1.5" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>;
}
function IconArrowUp() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>;
}
function IconScan({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#A2A9B0" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
}

// ── Brand Card ──
function BrandCard({ brand, onSelect }: { brand: typeof MOCK_BRANDS[0]; onSelect: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  useEffect(() => { if (ref.current) setH(ref.current.scrollHeight); }, [expanded]);

  return (
    <div
      className="bg-white overflow-hidden transition-all duration-200 cursor-pointer"
      style={{ border: "1px solid #BFBFBF", borderRadius: 10 }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Score - bigger, bolder */}
            <div className="flex items-center justify-center shrink-0" style={{ width: 48, height: 48, borderRadius: 10, background: brand.score >= 70 ? "#10A37F12" : "#F9F9F9" }}>
              <span className="text-lg font-bold" style={{ color: brand.score >= 70 ? "#10A37F" : "#000" }}>{brand.score}%</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold truncate" style={{ color: "#000" }}>{brand.name}</h3>
              <p className="text-xs" style={{ color: "#727272", direction: "ltr", textAlign: "left" }}>{brand.domain}</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className="text-xs font-semibold px-4 py-2 shrink-0 transition-all hover:opacity-80"
            style={{ background: "#000", color: "#fff", borderRadius: 9 }}
          >
            View scan
          </button>
        </div>

        {/* Info row */}
        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: "#727272" }}>
          <span className="flex items-center gap-1"><IconCalendar /> {brand.lastScan}</span>
          <span>{brand.scans} scans</span>
          <span>{brand.queries} queries</span>
        </div>

        {/* Quick metrics - 3 boxes */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center py-3" style={{ background: "#F9F9F9", borderRadius: 8 }}>
            <div className="text-lg font-bold" style={{ color: "#000" }}>{brand.articles}</div>
            <div className="text-[11px]" style={{ color: "#727272" }}>Articles</div>
          </div>
          <div className="text-center py-3" style={{ background: brand.pendingArticles > 0 ? "#FFF8F0" : "#F9F9F9", borderRadius: 8 }}>
            <div className="text-lg font-bold" style={{ color: brand.pendingArticles > 0 ? "#E07800" : "#000" }}>{brand.pendingArticles}</div>
            <div className="text-[11px]" style={{ color: "#727272" }}>Pending</div>
          </div>
          <div className="text-center py-3" style={{ background: "#F9F9F9", borderRadius: 8 }}>
            <div className="text-lg font-bold" style={{ color: "#10A37F" }}>{brand.score}%</div>
            <div className="text-[11px]" style={{ color: "#727272" }}>Visibility score</div>
          </div>
        </div>

        {/* Expandable section with smooth transition */}
        <div className="overflow-hidden transition-all duration-400 ease-in-out" style={{ maxHeight: expanded ? `${h}px` : 0, opacity: expanded ? 1 : 0 }}>
          <div ref={ref}>
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid #DDDDDD" }}>
              <p className="text-sm font-semibold mb-3" style={{ color: "#000" }}>Required actions</p>
              <div className="space-y-2 mb-4">
                {brand.actions.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {a.done ? (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#10A37F15" }}>
                        <IconCheck size={12} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full shrink-0" style={{ border: "1.5px solid #BFBFBF" }} />
                    )}
                    <span style={{ color: a.done ? "#A2A9B0" : "#333", textDecoration: a.done ? "line-through" : "none" }}>{a.label}</span>
                  </div>
                ))}
              </div>

              {/* Top query - full width, not cut off */}
              <div className="p-4" style={{ background: "#F9F9F9", borderRadius: 10, border: "1px solid #DDDDDD" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "#10A37F" }}>Top query</p>
                <p className="text-sm leading-relaxed" style={{ color: "#333" }}>"{brand.topQuery}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="flex justify-center mt-3">
          <div className="transition-transform duration-300" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
            <IconChevronDown />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Footer (matching example11 / geoscale.ai) ──
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #BFBFBF" }}>
      <div className="max-w-[1300px] mx-auto px-6 py-5 flex items-center justify-between" dir="ltr">
        {/* Left: Logo + tagline */}
        <div className="flex items-center gap-3">
          <GeoscaleLogoMark size={28} />
          <span className="text-sm" style={{ color: "#727272" }}>Powered by advanced AI to analyze your search presence</span>
        </div>

        {/* Center: Links */}
        <div className="flex items-center gap-3">
          {[
            { label: "Feedback", color: "#10A37F", bg: "#10A37F15" },
            { label: "Report a bug", color: "#E07800", bg: "#E0780015" },
            { label: "Improvement ideas", color: "#4285F4", bg: "#4285F415" },
            { label: "API usage", color: "#10A37F", bg: "#10A37F15" },
          ].map((link, i) => (
            <span
              key={i}
              className="text-xs font-medium px-3 py-1.5 cursor-pointer transition-opacity hover:opacity-70"
              style={{ color: link.color, background: link.bg, borderRadius: 20 }}
            >
              {link.label}
            </span>
          ))}
        </div>

        {/* Left: Copyright */}
        <span className="text-xs" style={{ color: "#A2A9B0" }}>GeoScale 2026 &copy;</span>
      </div>
    </footer>
  );
}

// ── Search Loader ──
function SearchLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: "2px solid #F9F9F9", borderTopColor: "#10A37F" }} />
        <span className="text-xs" style={{ color: "#727272" }}>Searching...</span>
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
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!searchQuery) { setIsSearching(false); setDisplayedBrands(MOCK_BRANDS); return; }
    setIsSearching(true);
    searchTimeout.current = setTimeout(() => {
      setDisplayedBrands(MOCK_BRANDS.filter(b => b.name.includes(searchQuery) || b.domain.includes(searchQuery.toLowerCase())));
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
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFFFF" }} dir="ltr">
      {/* ═══ HEADER — 3-column grid: actions | nav | logo ═══ */}
      <header className="sticky top-0 z-50" style={{ background: "rgba(255,255,255,0.96)", borderBottom: "1px solid #BFBFBF" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 72, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          {/* LEFT in LTR (grid col 1) = Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "start" }}>
            <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: "#000", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "1px solid #000", textDecoration: "none" }}>New Scan</a>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#727272" }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
              <span>Connected</span>
            </div>
          </div>

          {/* CENTER (grid col 2) = Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="/" style={{ fontSize: 14, fontWeight: 600, color: "#000", textDecoration: "none" }}>Dashboard</a>
            <a href="/scan" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none" }}>Scans</a>
          </nav>

          {/* RIGHT in LTR (grid col 3) = Logo */}
          <div style={{ justifySelf: "end" }}>
            <GeoscaleLogo width={150} />
          </div>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1">
        <div className="max-w-[1300px] mx-auto px-6 py-8">
          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-1" style={{ color: "#000", letterSpacing: "-1px" }}>Brand Monitoring</h1>
            <p className="text-base" style={{ color: "#727272" }}>Track brand presence across AI engines</p>
          </div>

          {/* ── Top Metrics (big numbers like example10) ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Brands", value: totalBrands, change: "+2" },
              { label: "Scans", value: totalScans },
              { label: "Queries", value: totalQueries },
              { label: "Avg. score", value: `${avgScore}%`, change: "+3.2%" },
            ].map((m, i) => (
              <div key={i} className="p-5 text-center" style={{ border: "1px solid #BFBFBF", borderRadius: 10 }}>
                <div className="text-4xl font-bold mb-1" style={{ color: "#000" }}>{m.value}</div>
                <div className="text-sm" style={{ color: "#727272" }}>{m.label}</div>
                {m.change && (
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs font-medium" style={{ color: "#10A37F" }}>
                    <IconArrowUp /> {m.change}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── AI Traffic & Bot Activity Row (Alexei reference cards) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {/* AI vs SEO Traffic */}
            <div className="p-6" style={{ border: "1px solid #BFBFBF", borderRadius: 10 }}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold" style={{ color: "#000" }}>AI vs Traditional SEO</h3>
              </div>
              <p className="text-xs mb-4" style={{ color: "#727272" }}>Traffic split - AI citations vs. organic results</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold" style={{ color: "#10A37F" }}>13.3%</span>
                <span className="text-xs font-semibold" style={{ color: "#10A37F" }}>+28.4%</span>
              </div>
              <div className="text-xs mb-3" style={{ color: "#727272" }}>23,847 visits from AI Engines</div>
              {/* Stacked bar */}
              <div className="flex h-2.5 overflow-hidden mb-3" style={{ borderRadius: 20 }}>
                <div style={{ width: "13.3%", background: "#10A37F" }} />
                <div style={{ width: "86.7%", background: "#E5E5E5" }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5" style={{ color: "#333" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
                  AI Engines · 23,847
                </span>
                <span className="flex items-center gap-1.5" style={{ color: "#333" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: "#BFBFBF", display: "inline-block" }} />
                  Traditional SEO · 156,234
                </span>
              </div>
            </div>

            {/* AI Bot Crawl Activity */}
            <div className="p-6" style={{ border: "1px solid #BFBFBF", borderRadius: 10 }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold" style={{ color: "#000" }}>AI Bot Crawl Activity</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5" style={{ background: "#10A37F15", color: "#10A37F", borderRadius: 20 }}>live</span>
              </div>
              <p className="text-xs mb-4" style={{ color: "#727272" }}>AI bots crawling your site</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { bot: "GPTBot", domain: "openai.com", pages: "1,247", ago: "2 hours ago", active: true },
                  { bot: "PerplexityBot", domain: "perplexity.ai", pages: "892", ago: "15 minutes ago", active: true },
                  { bot: "Claude-Web", domain: "anthropic.com", pages: "456", ago: "4 hours ago", active: true },
                  { bot: "BingBot", domain: "bing.com", pages: "2,134", ago: "1 hour ago", active: true },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${b.domain}&sz=64`}
                      alt=""
                      width={20}
                      height={20}
                      style={{ borderRadius: 4, flexShrink: 0, border: "1px solid #F0F0F0" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold" style={{ color: "#000" }}>{b.bot}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5" style={{ background: "#10A37F15", color: "#10A37F", borderRadius: 20 }}>active</span>
                      </div>
                      <div className="text-[11px]" style={{ color: "#727272" }}>{b.pages} pages · {b.ago}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engine Coverage Summary */}
            <div className="p-6" style={{ border: "1px solid #BFBFBF", borderRadius: 10 }}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold" style={{ color: "#000" }}>Engine Coverage Summary</h3>
              </div>
              <p className="text-xs mb-4" style={{ color: "#727272" }}>Coverage rate across each AI engine</p>
              <div className="flex flex-col gap-3">
                {[
                  { engine: "Google AIO", domain: "google.com", score: 78 },
                  { engine: "Bing Copilot", domain: "bing.com", score: 82 },
                  { engine: "ChatGPT Search", domain: "openai.com", score: 71 },
                  { engine: "Gemini", domain: "gemini.google.com", score: 69 },
                  { engine: "Perplexity", domain: "perplexity.ai", score: 85 },
                ].map((e, i) => {
                  const color = e.score >= 80 ? "#10A37F" : e.score >= 70 ? "#E07800" : "#DC2626";
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${e.domain}&sz=64`}
                            alt=""
                            width={14}
                            height={14}
                            style={{ borderRadius: 3, flexShrink: 0 }}
                          />
                          <span className="text-xs font-medium" style={{ color: "#333" }}>{e.engine}</span>
                        </div>
                        <span className="text-xs font-bold" style={{ color }}>{e.score}%</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 3, background: "#F0F0F0", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${e.score}%`, background: color, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Brands Section ── */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold" style={{ color: "#000" }}>Your brands</h2>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search brand..."
                  className="w-56 px-4 py-2.5 pr-10 text-sm focus:outline-none"
                  style={{ border: "1px solid #BFBFBF", borderRadius: 9 }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2"><IconSearch /></div>
              </div>
            </div>

            {isSearching ? <SearchLoader /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedBrands.map((brand) => (
                  <BrandCard key={brand.domain} brand={brand} onSelect={() => window.location.href = "/scan"} />
                ))}
              </div>
            )}

            {!isSearching && displayedBrands.length === 0 && (
              <div className="text-center py-12" style={{ border: "1px solid #BFBFBF", borderRadius: 10 }}>
                <p className="text-sm" style={{ color: "#727272" }}>No brands found for &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>

          {/* ── Bottom: Pending Actions + Recent Activity ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {/* Pending Actions */}
            <div className="p-6" style={{ border: "1px solid #BFBFBF", borderRadius: 10 }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold" style={{ color: "#000" }}>Pending actions</h3>
                <span className="text-sm font-semibold px-3 py-1" style={{ background: "#F9F9F9", borderRadius: 8, color: "#000" }}>
                  {totalPending} pending
                </span>
              </div>
              <div className="space-y-1">
                {MOCK_BRANDS.filter(b => b.actions.some(a => !a.done)).slice(0, 5).map((brand) => {
                  const pending = brand.actions.filter(a => !a.done).length;
                  return (
                    <a
                      key={brand.domain}
                      href="/scan"
                      className="flex items-center gap-4 p-3 transition-colors hover:bg-[#F9F9F9]"
                      style={{ borderRadius: 8, textDecoration: "none" }}
                    >
                      <div className="flex items-center justify-center shrink-0" style={{ width: 40, height: 40, borderRadius: 10, background: "#F9F9F9" }}>
                        <span className="text-sm font-bold" style={{ color: brand.score >= 70 ? "#10A37F" : "#000" }}>{brand.score}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "#000" }}>{brand.name}</p>
                        <p className="text-xs" style={{ color: "#727272" }}>{pending} actions · {brand.pendingArticles} articles pending</p>
                      </div>
                      <IconChevronLeft />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6" style={{ border: "1px solid #BFBFBF", borderRadius: 10 }}>
              <h3 className="text-base font-semibold mb-5" style={{ color: "#000" }}>Recent activity</h3>
              <div className="space-y-1">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 transition-colors hover:bg-[#F9F9F9]" style={{ borderRadius: 8 }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F9F9F9" }}>
                      <IconChart size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#000" }}>{a.brand}</p>
                      <p className="text-xs" style={{ color: "#727272" }}>Scan complete</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold" style={{ color: "#10A37F" }}>{a.score}%</span>
                      <p className="text-[11px]" style={{ color: "#A2A9B0", direction: "ltr" }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ═══ FOOTER ═══ */}
      <Footer />
    </div>
  );
}
