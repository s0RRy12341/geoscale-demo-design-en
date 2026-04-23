"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";

// ============================================================
// SCALEPUBLISH — Publisher Marketplace
// Browse external publisher sites, view SEO/GIO metrics,
// add to cart, build work plans, publisher portal
// ============================================================

// ── Theme ──
type Theme = {
  bg: string; cardBg: string; border: string; text: string; textSecondary: string; textMuted: string;
  headerBg: string; hoverBg: string; tableBg: string; tableHeaderBg: string; badgeBg: string;
  inputBg: string; barTrack: string; logoFill: string; logoStroke: string;
};
const LIGHT_THEME: Theme = {
  bg: "#FFFFFF", cardBg: "#FFFFFF", border: "#E5E5E5", text: "#000000", textSecondary: "#727272",
  textMuted: "#A2A9B0", headerBg: "rgba(255,255,255,0.96)", hoverBg: "#FAFAFA",
  tableBg: "#FFFFFF", tableHeaderBg: "#FAFAFA", badgeBg: "#F9F9F9", inputBg: "#FFFFFF",
  barTrack: "#E5E5E5", logoFill: "#141414", logoStroke: "#ABABAB",
};
const DARK_THEME: Theme = {
  bg: "#0D1117", cardBg: "#161B22", border: "#30363D", text: "#E6EDF3", textSecondary: "#8B949E",
  textMuted: "#484F58", headerBg: "rgba(13,17,23,0.96)", hoverBg: "#1C2128",
  tableBg: "#161B22", tableHeaderBg: "#1C2128", badgeBg: "#1C2128", inputBg: "#0D1117",
  barTrack: "#30363D", logoFill: "#E6EDF3", logoStroke: "#484F58",
};

// ── Dark Mode Toggle ──
function DarkModeToggle({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 6,
        borderRadius: 8,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.2s",
      }}
    >
      {darkMode ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6EDF3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#727272" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
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
function IconCart({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>;
}
function IconTrash({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>;
}
function IconChevronDown({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>;
}
function IconRefresh({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>;
}
function IconFilter({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
}
function IconExternalLink({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>;
}

// ── Tooltip (Ahrefs-style) ──
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
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A2A9B0" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
      {show && (
        <div style={{
          position: "fixed", top: pos.top, left: pos.left,
          transform: "translate(-50%, -100%)",
          background: "#1B1F23", color: "#fff", fontSize: 13, fontWeight: 400, lineHeight: 1.5,
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

// ── Favicon helper ──
function Favicon({ domain, size = 24 }: { domain: string; size?: number }) {
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: 4, flexShrink: 0, objectFit: "contain", background: "#fff", border: "1px solid #F0F0F0" }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
    />
  );
}

// ── Types ──
interface Publisher {
  id: number;
  name: string;
  domain: string;
  category: string;
  dr: number;
  traffic: number;
  seoScore: number;
  gioScore: number;
  gptPresent: boolean;
  geminiPresent: boolean;
  googleIndex: boolean;
  pricePerArticle: number;
  status: "approved" | "rejected" | "pending";
  rejectionReason?: string;
  queries?: number;
}

// ── Mock Data ──
const PUBLISHERS: Publisher[] = [
  { id: 1, name: "CNN", domain: "cnn.com", category: "News", dr: 91, traffic: 14200000, seoScore: 94, gioScore: 88, gptPresent: true, geminiPresent: true, googleIndex: true, pricePerArticle: 1200, status: "approved", queries: 18 },
  { id: 2, name: "Bloomberg", domain: "bloomberg.com", category: "Finance", dr: 85, traffic: 6800000, seoScore: 89, gioScore: 81, gptPresent: true, geminiPresent: true, googleIndex: true, pricePerArticle: 900, status: "approved", queries: 14 },
  { id: 3, name: "TechCrunch", domain: "techcrunch.com", category: "Technology", dr: 72, traffic: 820000, seoScore: 82, gioScore: 78, gptPresent: true, geminiPresent: true, googleIndex: true, pricePerArticle: 600, status: "approved", queries: 11 },
  { id: 4, name: "Yahoo", domain: "yahoo.com", category: "Lifestyle", dr: 88, traffic: 9500000, seoScore: 91, gioScore: 76, gptPresent: true, geminiPresent: true, googleIndex: true, pricePerArticle: 1050, status: "approved", queries: 16 },
  { id: 5, name: "Forbes", domain: "forbes.com", category: "Business", dr: 84, traffic: 4300000, seoScore: 87, gioScore: 82, gptPresent: true, geminiPresent: true, googleIndex: true, pricePerArticle: 975, status: "approved", queries: 15 },
  { id: 6, name: "Zillow Media", domain: "zillow.com", category: "Real Estate", dr: 68, traffic: 1900000, seoScore: 79, gioScore: 62, gptPresent: false, geminiPresent: true, googleIndex: true, pricePerArticle: 525, status: "approved", queries: 9 },
  { id: 7, name: "Doctors Portal", domain: "doctorsportal.com", category: "Health", dr: 66, traffic: 720000, seoScore: 78, gioScore: 71, gptPresent: true, geminiPresent: true, googleIndex: true, pricePerArticle: 450, status: "approved", queries: 10 },
  { id: 8, name: "Business Insider", domain: "businessinsider.com", category: "Business", dr: 82, traffic: 3700000, seoScore: 86, gioScore: 79, gptPresent: true, geminiPresent: true, googleIndex: true, pricePerArticle: 875, status: "approved", queries: 13 },
  { id: 9, name: "Eater", domain: "eater.com", category: "Food", dr: 74, traffic: 2100000, seoScore: 81, gioScore: 70, gptPresent: true, geminiPresent: true, googleIndex: true, pricePerArticle: 550, status: "approved", queries: 11 },
  { id: 10, name: "BizPortal", domain: "bizportal.com", category: "Finance", dr: 70, traffic: 950000, seoScore: 77, gioScore: 68, gptPresent: true, geminiPresent: false, googleIndex: true, pricePerArticle: 490, status: "approved", queries: 9 },
  { id: 11, name: "BuzzFeed", domain: "buzzfeed.com", category: "Lifestyle", dr: 89, traffic: 8100000, seoScore: 92, gioScore: 80, gptPresent: true, geminiPresent: true, googleIndex: true, pricePerArticle: 1025, status: "pending", queries: 15 },
  { id: 12, name: "PCMag Lite", domain: "pcmag-lite.com", category: "Technology", dr: 38, traffic: 52000, seoScore: 48, gioScore: 31, gptPresent: false, geminiPresent: false, googleIndex: false, pricePerArticle: 115, status: "rejected", rejectionReason: "Low DR, not present in AI engines", queries: 5 },
  { id: 13, name: "HealthLine Mini", domain: "healthline-mini.com", category: "Health", dr: 29, traffic: 12000, seoScore: 31, gioScore: 15, gptPresent: false, geminiPresent: false, googleIndex: false, pricePerArticle: 90, status: "rejected", rejectionReason: "Site not indexed in Google, negligible organic traffic", queries: 6 },
];

const CATEGORIES = ["All", "News", "Technology", "Health", "Business", "Lifestyle", "Finance", "Real Estate", "Food"];
const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "price", label: "Price" },
  { value: "dr", label: "DR" },
];

type TabKey = "marketplace" | "planner" | "publishers" | "rejected";
type PlanType = "combined" | "seo" | "geo";

// ── Plan data ──
interface PlanRow {
  month: number;
  seoArticles: number;
  geoArticles: number;
  sites: number;
  budget: number;
}

function getPlanData(speed: "fast" | "medium" | "slow", duration: 3 | 6, planType: PlanType): PlanRow[] {
  const configs = {
    fast:   { seo: 8, geo: 4, sites: 6, seoBudget: 2125, geoBudget: 1775 },
    medium: { seo: 5, geo: 3, sites: 4, seoBudget: 1400, geoBudget: 1175 },
    slow:   { seo: 3, geo: 2, sites: 3, seoBudget: 875,  geoBudget: 725 },
  };
  const c = configs[speed];
  return Array.from({ length: duration }, (_, i) => {
    let seo = c.seo;
    let geo = c.geo;
    let budget: number;
    if (planType === "seo") {
      geo = 0;
      budget = c.seoBudget;
    } else if (planType === "geo") {
      seo = 0;
      budget = c.geoBudget;
    } else {
      // Combined = 15% discount vs buying separately
      budget = Math.round((c.seoBudget + c.geoBudget) * 0.85);
    }
    return {
      month: i + 1,
      seoArticles: seo,
      geoArticles: geo,
      sites: c.sites,
      budget,
    };
  });
}

function getDiscountInfo(speed: "fast" | "medium" | "slow", duration: 3 | 6) {
  const configs = {
    fast:   { seoBudget: 2125, geoBudget: 1775 },
    medium: { seoBudget: 1400, geoBudget: 1175 },
    slow:   { seoBudget: 875,  geoBudget: 725 },
  };
  const c = configs[speed];
  const separateMonthly = c.seoBudget + c.geoBudget;
  const combinedMonthly = Math.round(separateMonthly * 0.85);
  const savingsMonthly = separateMonthly - combinedMonthly;
  return {
    separateTotal: separateMonthly * duration,
    combinedTotal: combinedMonthly * duration,
    savingsTotal: savingsMonthly * duration,
    savingsPercent: 15,
    separateMonthly,
    combinedMonthly,
    savingsMonthly,
  };
}

// ── Number formatting ──
function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}
function fmtCurrency(n: number): string {
  return `$${fmtNum(n)}`;
}

// ── Score color ──
function scoreColor(score: number, isRejected = false): string {
  if (isRejected) return "#DC2626";
  if (score >= 70) return "#10A37F";
  if (score >= 50) return "#727272";
  return "#DC2626";
}

// ── Publisher Portal Data ──
interface PublisherSite {
  domain: string;
  category: string;
  dr: number;
  status: "approved" | "pending" | "rejected";
  agenciesViewed: number;
  articlesSold: number;
  revenue: number | null;
}

const PUBLISHER_SITES: PublisherSite[] = [
  { domain: "techil.com", category: "Technology", dr: 62, status: "approved", agenciesViewed: 8, articlesSold: 12, revenue: 3600 },
  { domain: "medical-portal.com", category: "Health", dr: 55, status: "approved", agenciesViewed: 12, articlesSold: 18, revenue: 6750 },
  { domain: "foodtaste.com", category: "Food", dr: 38, status: "approved", agenciesViewed: 5, articlesSold: 9, revenue: 1530 },
  { domain: "wellbeing.com", category: "Health", dr: 44, status: "pending", agenciesViewed: 3, articlesSold: 0, revenue: null },
  { domain: "digitech.com", category: "Technology", dr: 34, status: "rejected", agenciesViewed: 0, articlesSold: 0, revenue: null },
];

interface AgencyActivity {
  agency: string;
  action: string;
  site: string;
  time: string;
}

const AGENCY_ACTIVITIES: AgencyActivity[] = [
  { agency: "Just In Time", action: "viewed", site: "techil.com", time: "2 hours ago" },
  { agency: "All4Horses", action: "purchased an article on", site: "medical-portal.com", time: "5 hours ago" },
  { agency: "Bloomberg Agency", action: "added to cart", site: "techil.com", time: "Today" },
  { agency: "Artisan Bread", action: "viewed", site: "foodtaste.com", time: "Yesterday" },
];

// ── Main Page Component ──
export default function BestLinksPage() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('geoscale-dark-mode') === 'true';
    return false;
  });
  useEffect(() => {
    localStorage.setItem('geoscale-dark-mode', darkMode.toString());
  }, [darkMode]);
  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [activeTab, setActiveTab] = useState<TabKey>("marketplace");
  const [cart, setCart] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [approvedOnly, setApprovedOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [flashId, setFlashId] = useState<number | null>(null);
  const [agencyMargin, setAgencyMargin] = useState(20);
  const [priceOverrides, setPriceOverrides] = useState<Record<number, number>>({});

  // Plan builder state
  const [planSpeed, setPlanSpeed] = useState<"fast" | "medium" | "slow">("medium");
  const [planDuration, setPlanDuration] = useState<3 | 6>(6);
  const [planType, setPlanType] = useState<PlanType>("combined");

  // Auto open cart when items added
  useEffect(() => {
    if (cart.length > 0) setCartOpen(true);
  }, [cart.length]);

  const addToCart = useCallback((id: number) => {
    setCart(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      return [...prev, id];
    });
    setFlashId(id);
    setTimeout(() => setFlashId(null), 600);
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(x => x !== id));
  }, []);

  const cartPublishers = useMemo(() => PUBLISHERS.filter(p => cart.includes(p.id)), [cart]);
  const getPrice = useCallback((pub: Publisher) => priceOverrides[pub.id] ?? pub.pricePerArticle, [priceOverrides]);
  const cartTotal = useMemo(() => cartPublishers.reduce((s, p) => s + (priceOverrides[p.id] ?? p.pricePerArticle), 0), [cartPublishers, priceOverrides]);
  const cartQueries = useMemo(() => cartPublishers.reduce((s, p) => s + (p.queries || 8), 0), [cartPublishers]);
  const marginAmount = useMemo(() => Math.round(cartTotal * agencyMargin / 100), [cartTotal, agencyMargin]);
  const clientTotal = useMemo(() => cartTotal + marginAmount, [cartTotal, marginAmount]);

  // Filtered and sorted publishers for marketplace
  const filteredPublishers = useMemo(() => {
    let list = PUBLISHERS.filter(p => p.status === "approved" || (!approvedOnly && p.status === "pending"));
    if (approvedOnly) list = list.filter(p => p.status === "approved");
    if (selectedCategory !== "All") list = list.filter(p => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sortBy === "price") return a.pricePerArticle - b.pricePerArticle;
      if (sortBy === "dr") return b.dr - a.dr;
      return (b.seoScore + b.gioScore) - (a.seoScore + a.gioScore);
    });
    return list;
  }, [searchQuery, selectedCategory, sortBy, approvedOnly]);

  const rejectedPublishers = PUBLISHERS.filter(p => p.status === "rejected");
  const pendingPublishers = PUBLISHERS.filter(p => p.status === "pending");

  // Plan data
  const planData = useMemo(() => getPlanData(planSpeed, planDuration, planType), [planSpeed, planDuration, planType]);
  const planTotals = useMemo(() => ({
    articles: planData.reduce((s, r) => s + r.seoArticles + r.geoArticles, 0),
    budget: planData.reduce((s, r) => s + r.budget, 0),
  }), [planData]);

  const TABS: { key: TabKey; label: string; tooltip: string }[] = [
    { key: "marketplace", label: "Site Marketplace", tooltip: "Verified site database for SEO and GEO content publishing" },
    { key: "planner", label: "Plan Builder", tooltip: "Build a monthly work plan and generate a client quote" },
    { key: "publishers", label: "Publishers Portal", tooltip: "Manage your sites as a Publisher on the platform" },
    { key: "rejected", label: "Rejected Sites", tooltip: "Sites that did not meet quality criteria" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', 'Heebo', sans-serif", color: theme.text }} dir="ltr">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50" style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 24px",
          height: isMobile ? 60 : 72,
          display: isMobile ? "flex" : "grid",
          gridTemplateColumns: isMobile ? undefined : "1fr auto 1fr",
          alignItems: "center",
          justifyContent: isMobile ? "space-between" : undefined,
        }}>
          {isMobile ? (
            <>
              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: theme.text }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen ? (
                    <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  ) : (
                    <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                  )}
                </svg>
              </button>
              {/* Center logo mark */}
              <GeoscaleLogoMark size={32} theme={theme} />
              {/* Dark mode toggle */}
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </>
          ) : (
            <>
              {/* LEFT = Logo */}
              <div style={{ justifySelf: "start" }}>
                <GeoscaleLogo width={150} theme={theme} />
              </div>
              {/* CENTER = Nav */}
              <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <a href="/" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Dashboard</a>
                <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
                <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 700, color: theme.text, textDecoration: "none" }}>ScalePublish</a>
                <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
                <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Roadmap</a>
              </nav>
              {/* RIGHT = Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "end" }}>
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 15, fontWeight: 600, borderRadius: 9, border: `1px solid ${darkMode ? "#E6EDF3" : "#000"}`, textDecoration: "none" }}>New Scan</a>
              </div>
            </>
          )}
        </div>
        {/* Mobile dropdown menu */}
        {isMobile && menuOpen && (
          <div style={{
            background: theme.cardBg,
            borderBottom: `1px solid ${theme.border}`,
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            <a href="/" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Dashboard</a>
            <a href="/scan" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Scans</a>
            <a href="/scale-publish" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 700, color: theme.text, textDecoration: "none", padding: "8px 0" }}>ScalePublish</a>
            <a href="/editor" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Content Editor</a>
            <a href="/roadmap" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Roadmap</a>
            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 12, marginTop: 4, display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 15, fontWeight: 600, borderRadius: 9, border: `1px solid ${darkMode ? "#E6EDF3" : "#000"}`, textDecoration: "none" }}>New Scan</a>
            </div>
          </div>
        )}
      </header>

      {/* ── Sub-tabs ── */}
      <div style={{ borderBottom: `1px solid ${theme.border}`, background: theme.bg }}>
        <div style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: isMobile ? "0 12px" : "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 0,
          overflowX: isMobile ? "auto" : undefined,
          whiteSpace: isMobile ? "nowrap" : undefined,
          WebkitOverflowScrolling: "touch" as never,
        }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: isMobile ? "10px 14px" : "14px 24px",
                fontSize: isMobile ? 14 : 15,
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? theme.text : theme.textSecondary,
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.key ? `2px solid ${theme.text}` : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{tab.label} {!isMobile && <Tooltip text={tab.tooltip} />}</span>
              {tab.key === "rejected" && rejectedPublishers.length > 0 && (
                <span style={{ marginLeft: 6, background: "#DC262615", color: "#DC2626", fontSize: 14, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>{rejectedPublishers.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: isMobile ? "20px 12px 60px" : "32px 24px 80px" }}>
        {activeTab === "marketplace" && (
          <MarketplaceTab
            publishers={filteredPublishers}
            cart={cart}
            flashId={flashId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            approvedOnly={approvedOnly}
            setApprovedOnly={setApprovedOnly}
            onAddToCart={addToCart}
            getPrice={getPrice}
            setPriceOverrides={setPriceOverrides}
            theme={theme}
            darkMode={darkMode}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        )}
        {activeTab === "planner" && (
          <PlannerTab
            planSpeed={planSpeed}
            setPlanSpeed={setPlanSpeed}
            planDuration={planDuration}
            setPlanDuration={setPlanDuration}
            planData={planData}
            planTotals={planTotals}
            planType={planType}
            setPlanType={setPlanType}
            cartSiteCount={cart.length}
            cartQueries={cartQueries}
            cartTotal={cartTotal}
            goToMarketplace={() => setActiveTab("marketplace")}
            theme={theme}
            darkMode={darkMode}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        )}
        {activeTab === "publishers" && <PublishersTab theme={theme} darkMode={darkMode} isMobile={isMobile} isTablet={isTablet} />}
        {activeTab === "rejected" && <RejectedTab publishers={rejectedPublishers} pendingCount={pendingPublishers.length} theme={theme} darkMode={darkMode} isMobile={isMobile} isTablet={isTablet} />}
      </div>

      {/* ── Cart Sidebar ── */}
      {cart.length > 0 && (
        <>
          {/* Cart toggle button */}
          {!cartOpen && (
            <button
              onClick={() => setCartOpen(true)}
              style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
              }}
            >
              <IconCart size={20} />
              <span style={{ position: "absolute", top: -4, left: -4, width: 22, height: 22, borderRadius: 11, background: "#10A37F", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cart.length}</span>
            </button>
          )}

          {/* Cart panel */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: isMobile ? "100%" : 360,
              height: "100vh",
              background: theme.cardBg,
              borderLeft: isMobile ? "none" : `1px solid ${theme.border}`,
              zIndex: 200,
              transform: cartOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              flexDirection: "column",
              color: theme.text,
              overflowX: "hidden",
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <IconCart size={18} />
                <span style={{ fontSize: 16, fontWeight: 600 }}>Plan cart</span>
                <span style={{ fontSize: 15, color: theme.textSecondary }}>({cart.length} sites)</span>
              </div>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textSecondary, padding: 4 }}>
                <IconX size={18} />
              </button>
            </div>
            <div style={{ padding: "10px 24px", background: "#10A37F08", borderBottom: "1px solid #10A37F20", fontSize: 14, color: "#10A37F", lineHeight: 1.5 }}>
              Sites in the cart are automatically added to the <strong>quote</strong> being built in the Plan Builder
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px" }}>
              {cartPublishers.map(pub => (
                <div key={pub.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${theme.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Favicon domain={pub.domain} size={28} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{pub.name}</div>
                      <div style={{ fontSize: 14, color: theme.textSecondary }}>{pub.domain}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end" }}>
                        <span style={{ fontSize: 13, color: theme.textSecondary }}>$</span>
                        <input
                          type="number"
                          value={priceOverrides[pub.id] ?? pub.pricePerArticle}
                          onChange={e => setPriceOverrides(prev => ({ ...prev, [pub.id]: Number(e.target.value) }))}
                          style={{
                            width: 65, fontSize: 15, fontWeight: 600, color: theme.text,
                            border: "none", borderBottom: `1px dashed ${theme.textMuted}`,
                            background: "transparent", outline: "none", padding: "0 0 1px",
                            textAlign: "right",
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 14, color: theme.textSecondary }}>~{pub.queries || 8} queries</div>
                    </div>
                    <button onClick={() => removeFromCart(pub.id)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, padding: 2 }}>
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Agency Margin Section */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${theme.border}`, background: theme.badgeBg }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 10 }}>Agency margin</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={agencyMargin}
                  onChange={e => setAgencyMargin(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "#10A37F" }}
                />
                <span style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#10A37F",
                  background: "#10A37F15",
                  padding: "4px 12px",
                  borderRadius: 20,
                  minWidth: 48,
                  textAlign: "center",
                }}>{agencyMargin}%</span>
              </div>
            </div>

            <div style={{ padding: "20px 24px", borderTop: `1px solid ${theme.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 15 }}>
                <span style={{ color: theme.textSecondary, display: "inline-flex", alignItems: "center", gap: 4 }}>Total sites <Tooltip text="Number of sites selected for the plan" /></span>
                <span style={{ fontWeight: 600 }}>{cart.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 15 }}>
                <span style={{ color: theme.textSecondary, display: "inline-flex", alignItems: "center", gap: 4 }}>Total queries <Tooltip text="Total queries covered by the selected sites" /></span>
                <span style={{ fontWeight: 600 }}>{cartQueries}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 15 }}>
                <span style={{ color: theme.textSecondary, display: "inline-flex", alignItems: "center", gap: 4 }}>Base price <Tooltip text="Your cost before adding Agency margin" /></span>
                <span style={{ fontWeight: 600 }}>{fmtCurrency(cartTotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 15 }}>
                <span style={{ color: theme.textSecondary, display: "inline-flex", alignItems: "center", gap: 4 }}>Agency margin ({agencyMargin}%) <Tooltip text="Your profit — calculated as a percentage of the base price" /></span>
                <span style={{ fontWeight: 600, color: "#10A37F" }}>{fmtCurrency(marginAmount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 15, paddingTop: 8, borderTop: `1px solid ${theme.border}` }}>
                <span style={{ fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>Client total <Tooltip text="Amount the client pays — base price + Agency margin" /></span>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{fmtCurrency(clientTotal)}</span>
              </div>
              <button style={{ width: "100%", padding: "12px 0", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 15, fontWeight: 600, borderRadius: 9, border: "none", cursor: "pointer" }}>
                Generate quote
              </button>
            </div>
          </div>
          {/* Click-away area (no visual overlay, doesn't block page) */}
        </>
      )}

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${theme.border}` }}>
        <div style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: isMobile ? "20px 16px" : "20px 24px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "space-between",
          gap: isMobile ? 16 : 12,
          textAlign: isMobile ? "center" : undefined,
        }} dir="ltr">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <GeoscaleLogoMark size={28} theme={theme} />
            <span style={{ fontSize: 14, color: theme.textSecondary }}>Powered by advanced AI to analyze your search presence</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Feedback", color: "#10A37F", bg: "#10A37F15" },
              { label: "Report a bug", color: "#10A37F", bg: "#10A37F15" },
              { label: "Improvement ideas", color: "#10A37F", bg: "#10A37F15" },
              { label: "API usage", color: "#10A37F", bg: "#10A37F15" },
            ].map((link, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 500, padding: "6px 12px", cursor: "pointer", color: link.color, background: link.bg, borderRadius: 20 }}>
                {link.label}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 12, color: theme.textMuted }}>&copy; GeoScale 2026</span>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// TAB 1: Marketplace
// ============================================================
function MarketplaceTab({
  publishers, cart, flashId, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
  sortBy, setSortBy, approvedOnly, setApprovedOnly, onAddToCart, getPrice, setPriceOverrides, theme, darkMode, isMobile, isTablet,
}: {
  publishers: Publisher[];
  cart: number[];
  flashId: number | null;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  approvedOnly: boolean;
  setApprovedOnly: (v: boolean) => void;
  onAddToCart: (id: number) => void;
  getPrice: (pub: Publisher) => number;
  setPriceOverrides: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  theme: Theme;
  darkMode: boolean;
  isMobile: boolean;
  isTablet: boolean;
}) {
  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: isMobile ? 20 : 28 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: theme.text, marginBottom: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          ScalePublish <span style={{ fontWeight: 400, fontSize: isMobile ? 16 : 22 }}>— Content platform for agencies</span>
          <Tooltip text="Platform for choosing sites, building work plans, and generating client quotes" />
        </h1>
        <p style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.6 }}>
          Choose sites, build work plans, and generate quotes — SEO and GEO in one place
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ background: theme.badgeBg, borderRadius: 10, border: `1px solid ${theme.border}`, padding: isMobile ? "14px 14px" : "16px 20px", marginBottom: 24, display: "flex", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", alignItems: isMobile ? "stretch" : "center", gap: 12 }}>
        {/* Search */}
        <div style={{ position: "relative", minWidth: isMobile ? undefined : 220, width: isMobile ? "100%" : undefined }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <IconSearch size={15} color={theme.textMuted} />
          </span>
          <input
            type="text"
            placeholder="Search site..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 14px 9px 38px",
              fontSize: 15,
              border: `1px solid ${theme.border}`,
              borderRadius: 8,
              background: theme.inputBg,
              outline: "none",
              color: theme.text,
            }}
          />
        </div>

        {/* Divider */}
        {!isMobile && <div style={{ width: 1, height: 28, background: theme.border }} />}

        {/* Categories */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: isMobile ? undefined : 1, width: isMobile ? "100%" : undefined }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: isMobile ? "5px 10px" : "6px 14px",
                fontSize: isMobile ? 13 : 15,
                fontWeight: selectedCategory === cat ? 600 : 400,
                color: selectedCategory === cat ? (darkMode ? "#0D1117" : "#fff") : theme.text,
                background: selectedCategory === cat ? (darkMode ? "#E6EDF3" : "#000") : theme.inputBg,
                border: `1px solid ${selectedCategory === cat ? (darkMode ? "#E6EDF3" : "#000") : theme.border}`,
                borderRadius: 20,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Divider */}
        {!isMobile && <div style={{ width: 1, height: 28, background: theme.border }} />}

        {/* Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: isMobile ? "100%" : undefined }}>
          <span style={{ fontSize: 15, color: theme.textSecondary }}>Sort by:</span>
          <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                appearance: "none",
                padding: "7px 28px 7px 10px",
                fontSize: 15,
                fontWeight: 500,
                border: `1px solid ${theme.border}`,
                borderRadius: 8,
                background: theme.inputBg,
                cursor: "pointer",
                color: theme.text,
                outline: "none",
                width: isMobile ? "100%" : undefined,
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }}>
              <IconChevronDown size={12} />
            </span>
          </div>
        </div>

        {/* Divider */}
        {!isMobile && <div style={{ width: 1, height: 28, background: theme.border }} />}

        {/* Approved only toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 15, color: theme.text, whiteSpace: "nowrap" }}>
          <div
            onClick={() => setApprovedOnly(!approvedOnly)}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: approvedOnly ? "#10A37F" : theme.barTrack,
              position: "relative",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <div style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              background: theme.cardBg,
              position: "absolute",
              top: 2,
              transition: "all 0.2s",
              ...(approvedOnly ? { left: 18 } : { left: 2 }),
            }} />
          </div>
          Approved sites only
        </label>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 15, color: theme.textSecondary, marginBottom: 16 }}>
        {publishers.length} sites found
      </div>

      {/* Publisher Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 16 }}>
        {publishers.map(pub => (
          <PublisherCard
            key={pub.id}
            publisher={pub}
            inCart={cart.includes(pub.id)}
            isFlashing={flashId === pub.id}
            onToggleCart={() => onAddToCart(pub.id)}
            getPrice={getPrice}
            setPriceOverrides={setPriceOverrides}
            theme={theme}
            darkMode={darkMode}
          />
        ))}
      </div>

      {publishers.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: theme.textSecondary }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>0</div>
          <div style={{ fontSize: 15 }}>No sites found matching your search</div>
        </div>
      )}
    </div>
  );
}

// ── Publisher Card ──
function PublisherCard({ publisher: pub, inCart, isFlashing, onToggleCart, getPrice, setPriceOverrides, theme, darkMode }: {
  publisher: Publisher;
  inCart: boolean;
  isFlashing: boolean;
  onToggleCart: () => void;
  getPrice: (pub: Publisher) => number;
  setPriceOverrides: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  theme: Theme;
  darkMode: boolean;
}) {
  return (
    <div
      style={{
        border: `1px solid ${inCart ? "#10A37F" : theme.border}`,
        borderRadius: 10,
        padding: 20,
        background: isFlashing ? "#10A37F08" : theme.cardBg,
        transition: "all 0.3s",
        position: "relative",
      }}
    >
      {/* Status badge */}
      {pub.status === "pending" && (
        <span style={{ position: "absolute", top: 12, right: 12, fontSize: 14, fontWeight: 600, color: "#727272", background: "rgba(114,114,114,0.1)", padding: "3px 10px", borderRadius: 20 }}>
          Pending review
        </span>
      )}

      {/* Header */}
      <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
        <Favicon domain={pub.domain} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>{pub.name}</span>
            <a href={`https://${pub.domain}`} target="_blank" rel="noopener noreferrer" style={{ color: theme.textMuted, display: "inline-flex" }}>
              <IconExternalLink size={13} />
            </a>
          </div>
          <div style={{ fontSize: 15, color: theme.textSecondary }}>{pub.domain}</div>
        </div>
      </div>

      {/* Category */}
      <span style={{ display: "inline-block", fontSize: 14, fontWeight: 500, color: theme.text, background: theme.badgeBg, border: `1px solid ${theme.border}`, padding: "3px 12px", borderRadius: 20, marginBottom: 14 }}>
        {pub.category}
      </span>

      {/* Recommended badge */}
      {pub.seoScore + pub.gioScore >= 170 && pub.gptPresent && pub.geminiPresent && (
        <div style={{ marginBottom: 10, padding: "8px 10px", background: "#10A37F08", border: "1px solid #10A37F30", borderRadius: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#10A37F" }}>Recommended for All4Horses</span>
          </div>
          <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0, lineHeight: 1.5 }}>
            {pub.category === "Health" ? "Fits the therapeutic field - relevant audience for therapeutic riding and children's health"
            : pub.category === "News" ? "Maximum exposure - leading news site with high AI engine presence"
            : pub.category === "Lifestyle" ? "Fits the leisure and nature field - audience seeking outdoor activities"
            : `High match - SEO score ${pub.seoScore} and GEO score ${pub.gioScore}, full presence in ChatGPT and Gemini`}
          </p>
        </div>
      )}

      {/* Metrics row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        <MetricBox label="SEO Score" value={pub.seoScore} color={scoreColor(pub.seoScore)} tooltip="SEO quality score based on DR, traffic, and indexing" theme={theme} />
        <MetricBox label="GIO Score" value={pub.gioScore} color={scoreColor(pub.gioScore)} tooltip="AI engine presence score - GPT, Gemini" theme={theme} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        <StatItem label="DR" value={String(pub.dr)} tooltip="Domain Rating - domain authority score" theme={theme} />
        <StatItem label="Monthly traffic" value={fmtNum(pub.traffic)} tooltip="Estimated monthly organic traffic" theme={theme} />
        <StatItem
          label="Google Index"
          tooltip="Whether the site is indexed in Google"
          theme={theme}
          value={
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: pub.googleIndex ? "#10A37F" : "#DC2626", display: "inline-block" }} />
              <span style={{ fontSize: 14 }}>{pub.googleIndex ? "Active" : "No"}</span>
            </span>
          }
        />
      </div>

      {/* AI Presence */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <AiBadge engine="GPT" present={pub.gptPresent} />
        <AiBadge engine="Gemini" present={pub.geminiPresent} />
      </div>

      {/* Footer: Price + CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: `1px solid ${theme.border}` }}>
        <div>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 2 }}>Price per article</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 15, color: theme.textSecondary }}>$</span>
            <input
              type="number"
              value={getPrice(pub)}
              onChange={e => setPriceOverrides(prev => ({ ...prev, [pub.id]: Number(e.target.value) }))}
              onClick={e => e.stopPropagation()}
              style={{
                width: 80, fontSize: 20, fontWeight: 700, color: theme.text,
                border: "none", borderBottom: `1px dashed ${theme.textMuted}`,
                background: "transparent", outline: "none", padding: "0 0 2px",
              }}
            />
          </div>
        </div>
        <button
          onClick={onToggleCart}
          style={{
            padding: "9px 20px",
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            ...(inCart
              ? { background: "#10A37F", color: "#fff" }
              : { background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff" }
            ),
          }}
        >
          {inCart ? (
            <>
              <IconCheck size={13} />
              Added
            </>
          ) : (
            "Add to plan"
          )}
        </button>
      </div>
    </div>
  );
}

function MetricBox({ label, value, color, tooltip, theme }: { label: string; value: number; color: string; tooltip?: string; theme: Theme }) {
  return (
    <div style={{ background: theme.badgeBg, borderRadius: 8, padding: "10px 12px", border: `1px solid ${theme.border}` }}>
      <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>{label} {tooltip && <Tooltip text={tooltip} />}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function StatItem({ label, value, tooltip, theme }: { label: string; value: React.ReactNode; tooltip?: string; theme: Theme }) {
  return (
    <div>
      <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>{label} {tooltip && <Tooltip text={tooltip} />}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{value}</div>
    </div>
  );
}

function AILogo({ engine, size = 16 }: { engine: string; size?: number }) {
  const src = engine === "GPT" ? "/logos/chatgpt.svg" : engine === "Gemini" ? "/logos/gemini.svg" : "/logos/perplexity.svg";
  return <img src={src} width={size} height={size} alt={engine} style={{ display: "inline-block" }} />;
}

function AiBadge({ engine, present }: { engine: string; present: boolean }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 14,
      fontWeight: 500,
      padding: "4px 10px",
      borderRadius: 20,
      border: `1px solid ${present ? "#10A37F40" : "#DC262630"}`,
      color: present ? "#10A37F" : "#DC2626",
      background: present ? "#10A37F08" : "#DC262608",
    }}>
      <AILogo engine={engine} size={14} />
      {present ? "\u2713" : "\u2717"}
    </span>
  );
}

// ── Projection Panel: shows forecasted query appearances + exposure growth ──
function ProjectionPanel({
  speed, duration, planType, cartSiteCount, cartQueries, theme, isMobile,
}: {
  speed: "fast" | "medium" | "slow";
  duration: 3 | 6;
  planType: PlanType;
  cartSiteCount: number;
  cartQueries: number;
  theme: Theme;
  isMobile: boolean;
}) {
  const speedBase = { fast: 42, medium: 26, slow: 14 };
  const typeFactor: Record<PlanType, number> = { combined: 1, seo: 0.7, geo: 0.65 };
  const baseStart = Math.round(speedBase[speed] * typeFactor[planType]);
  const cartBoost = Math.round(cartQueries * 0.6);
  const startQ = baseStart + Math.round(cartBoost * 0.25);
  const endMultiplier = duration === 6 ? 4.1 : 2.3;
  const endQ = Math.round((baseStart * endMultiplier) + cartBoost);
  const exposureGrowthMap = {
    fast: { 3: 140, 6: 245 }, medium: { 3: 95, 6: 160 }, slow: { 3: 45, 6: 80 },
  } as const;
  const baseGrowth = exposureGrowthMap[speed][duration];
  const totalGrowth = Math.round(baseGrowth + cartSiteCount * 12);

  const points: number[] = Array.from({ length: duration }, (_, i) => {
    const progress = i / (duration - 1);
    const eased = Math.pow(progress, 1.35);
    return Math.round(startQ + (endQ - startQ) * eased);
  });

  const W = 620, H = 170, PAD_L = 36, PAD_R = 20, PAD_T = 20, PAD_B = 30;
  const maxY = Math.max(...points, 10) * 1.1;
  const pointCoords = points.map((v, i) => {
    const x = PAD_L + ((W - PAD_L - PAD_R) * i) / Math.max(1, points.length - 1);
    const y = H - PAD_B - ((H - PAD_T - PAD_B) * v) / maxY;
    return { x, y, v, i };
  });
  const pathD = "M " + pointCoords.map(p => `${p.x},${p.y}`).join(" L ");
  const areaD = pathD + ` L ${pointCoords[pointCoords.length - 1].x},${H - PAD_B} L ${pointCoords[0].x},${H - PAD_B} Z`;

  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: isMobile ? 16 : 24, marginBottom: 28, background: theme.cardBg }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "flex-start", justifyContent: "space-between", gap: isMobile ? 16 : 24, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 20, background: "#10A37F15", color: "#10A37F", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: "#10A37F" }} />
            Vision forecast
          </div>
          <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: theme.text, margin: "0 0 4px" }}>What this plan will deliver</h3>
          <p style={{ fontSize: isMobile ? 14 : 15, color: theme.textSecondary, margin: 0 }}>Projected appearances in AI queries and growth over {duration} months</p>
        </div>
        {/* KPIs */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
          <div style={{ padding: "12px 18px", borderRadius: 10, background: theme.badgeBg, border: `1px solid ${theme.border}`, minWidth: 140 }}>
            <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 4, fontWeight: 500 }}>Query appearances - end of period</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: theme.text }}>~{endQ}</span>
              <span style={{ fontSize: 15, color: theme.textSecondary }}>queries/month</span>
            </div>
            <div style={{ fontSize: 14, color: "#10A37F", fontWeight: 600, marginTop: 2 }}>from {startQ} → {endQ}</div>
          </div>
          <div style={{ padding: "12px 18px", borderRadius: 10, background: "#10A37F08", border: "1px solid #10A37F30", minWidth: 140 }}>
            <div style={{ fontSize: 14, color: "#10A37F", marginBottom: 4, fontWeight: 500 }}>Projected exposure growth</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#10A37F" }}>+{totalGrowth}%</span>
            </div>
            <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 2 }}>in AI engine presence</div>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }}>
          <defs>
            <linearGradient id="projFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10A37F" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10A37F" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Gridlines */}
          {[0.25, 0.5, 0.75, 1].map((f, i) => {
            const y = H - PAD_B - (H - PAD_T - PAD_B) * f;
            return <line key={i} x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke={theme.border} strokeWidth="1" />;
          })}
          {/* Y axis labels */}
          {[0, 0.5, 1].map((f, i) => {
            const y = H - PAD_B - (H - PAD_T - PAD_B) * f;
            const val = Math.round(maxY * f);
            return <text key={i} x={PAD_L - 8} y={y + 3} fontSize="13" fill={theme.textMuted} textAnchor="end">{val}</text>;
          })}
          {/* Area + line */}
          <path d={areaD} fill="url(#projFill)" />
          <path d={pathD} fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Points */}
          {pointCoords.map((p) => (
            <g key={p.i}>
              <circle cx={p.x} cy={p.y} r="4" fill={theme.cardBg} stroke="#10A37F" strokeWidth="2" />
              <text x={p.x} y={p.y - 10} fontSize="13" fill={theme.text} fontWeight="600" textAnchor="middle">{p.v}</text>
            </g>
          ))}
          {/* X axis labels */}
          {pointCoords.map((p) => (
            <text key={`x-${p.i}`} x={p.x} y={H - 10} fontSize="13" fill={theme.textSecondary} textAnchor="middle">Month {p.i + 1}</text>
          ))}
        </svg>
      </div>

      {/* Bottom: explanation + marketplace CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 16, padding: "14px 16px", borderRadius: 10, background: theme.badgeBg, border: `1px dashed ${theme.border}`, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          <div style={{ fontSize: 15, color: theme.text }}>
            {cartSiteCount > 0 ? (
              <span><strong style={{ color: "#10A37F" }}>{cartSiteCount} sites in cart</strong> - adding ~{cartQueries} queries to the forecast. Chart updated.</span>
            ) : (
              <span>Add publisher sites from the Marketplace to boost the forecast</span>
            )}
          </div>
        </div>
        <div style={{ fontSize: 14, color: theme.textMuted }}>Each additional site raises the ceiling by ~10-15%</div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 2: Plan Builder
// ============================================================
function PlannerTab({
  planSpeed, setPlanSpeed, planDuration, setPlanDuration, planData, planTotals, planType, setPlanType,
  cartSiteCount, cartQueries, cartTotal, goToMarketplace, theme, darkMode, isMobile, isTablet,
}: {
  planSpeed: "fast" | "medium" | "slow";
  setPlanSpeed: (v: "fast" | "medium" | "slow") => void;
  planDuration: 3 | 6;
  setPlanDuration: (v: 3 | 6) => void;
  planData: PlanRow[];
  planTotals: { articles: number; budget: number };
  planType: PlanType;
  setPlanType: (v: PlanType) => void;
  cartSiteCount: number;
  cartQueries: number;
  cartTotal: number;
  goToMarketplace: () => void;
  theme: Theme;
  darkMode: boolean;
  isMobile: boolean;
  isTablet: boolean;
}) {
  const discount = getDiscountInfo(planSpeed, planDuration);

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Work Plan Builder</h1>
        <p style={{ fontSize: 15, color: theme.textSecondary }}>Define brand, duration, and pace - get a personalized work plan with a quote</p>
      </div>

      {/* Configuration row */}
      <div style={{ background: theme.badgeBg, borderRadius: 10, border: `1px solid ${theme.border}`, padding: isMobile ? "16px 14px" : "20px 24px", marginBottom: 20, display: "flex", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 16 : 24 }}>
        {/* Brand selector */}
        <div style={{ width: isMobile ? "100%" : undefined }}>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>Brand <Tooltip text="Select the brand this plan is being built for" /></div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 16px",
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            background: theme.inputBg,
            fontSize: 15,
            fontWeight: 600,
            minWidth: 180,
            color: theme.text,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
            All4Horses
            <span style={{ marginLeft: "auto", color: theme.textMuted }}><IconChevronDown size={12} /></span>
          </div>
        </div>

        {/* Divider */}
        {!isMobile && <div style={{ width: 1, height: 48, background: theme.border }} />}

        {/* Duration */}
        <div style={{ width: isMobile ? "100%" : undefined }}>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>Plan duration <Tooltip text="3 months for quick results, 6 months for depth and control" /></div>
          <div style={{ display: "flex", gap: 0, border: `1px solid ${theme.border}`, borderRadius: 8, overflow: "hidden" }}>
            {([3, 6] as const).map(d => (
              <button
                key={d}
                onClick={() => setPlanDuration(d)}
                style={{
                  padding: "9px 20px",
                  fontSize: 15,
                  fontWeight: planDuration === d ? 600 : 400,
                  background: planDuration === d ? (darkMode ? "#E6EDF3" : "#000") : theme.inputBg,
                  color: planDuration === d ? (darkMode ? "#0D1117" : "#fff") : theme.text,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {d} months
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        {!isMobile && <div style={{ width: 1, height: 48, background: theme.border }} />}

        {/* Speed */}
        <div style={{ width: isMobile ? "100%" : undefined }}>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>Pace <Tooltip text="Aggressive = 8 articles/month, Medium = 5, Conservative = 3" /></div>
          <div style={{ display: "flex", gap: 0, border: `1px solid ${theme.border}`, borderRadius: 8, overflow: "hidden" }}>
            {([
              { key: "fast" as const, label: "Aggressive" },
              { key: "medium" as const, label: "Medium" },
              { key: "slow" as const, label: "Conservative" },
            ]).map(s => (
              <button
                key={s.key}
                onClick={() => setPlanSpeed(s.key)}
                style={{
                  padding: "9px 20px",
                  fontSize: 15,
                  fontWeight: planSpeed === s.key ? 600 : 400,
                  background: planSpeed === s.key ? (darkMode ? "#E6EDF3" : "#000") : theme.inputBg,
                  color: planSpeed === s.key ? (darkMode ? "#0D1117" : "#fff") : theme.text,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Images / Assets */}
      <div style={{ background: theme.cardBg, borderRadius: 10, border: `1px solid ${theme.border}`, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>Brand images & assets</div>
            <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 2 }}>Attach product shots, logos, or brand assets — auto-embedded into generated content</div>
          </div>
          <span style={{ fontSize: 14, color: theme.textMuted }}>3 items</span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { bg: "linear-gradient(135deg,rgba(16,163,127,0.1),rgba(16,163,127,0.3))", label: "logo" },
            { bg: "linear-gradient(135deg,rgba(16,163,127,0.08),rgba(16,163,127,0.2))", label: "horse-1.jpg" },
            { bg: "linear-gradient(135deg,rgba(16,163,127,0.06),rgba(16,163,127,0.25))", label: "ranch.png" },
          ].map((img, i) => (
            <div key={i} style={{ position: "relative", width: 84, height: 84, borderRadius: 8, background: img.bg, border: `1px solid ${theme.border}`, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", padding: "4px 6px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 14, fontWeight: 500, textAlign: "center" }}>{img.label}</div>
              <button aria-label="Remove" style={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: 9, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          ))}
          <label style={{ width: 84, height: 84, borderRadius: 8, border: `1.5px dashed ${theme.textMuted}`, background: theme.badgeBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 4, color: theme.textSecondary, transition: "all 0.15s" }}>
            <span style={{ fontSize: 22, lineHeight: 1, fontWeight: 300 }}>+</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Add image</span>
            <input type="file" accept="image/*" multiple style={{ display: "none" }} />
          </label>
        </div>
      </div>

      {/* Plan Type Cards — SEO / GEO / Combined with discount */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
        {/* SEO Only */}
        {(() => {
          const seoPrices: Record<string, number> = { fast: 2125, medium: 1400, slow: 875 };
          const geoPrices: Record<string, number> = { fast: 1775, medium: 1175, slow: 725 };
          const seoPrice = seoPrices[planSpeed];
          const geoPrice = geoPrices[planSpeed];
          return (
            <>
              <button
                onClick={() => setPlanType("seo")}
                style={{
                  padding: 20,
                  borderRadius: 10,
                  border: planType === "seo" ? `2px solid ${theme.text}` : `1px solid ${theme.border}`,
                  background: planType === "seo" ? theme.badgeBg : theme.cardBg,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  color: theme.text,
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 4 }}>SEO Only</div>
                <div style={{ fontSize: 15, color: theme.textSecondary, marginBottom: 10 }}>Focused articles for organic ranking</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: theme.text }}>{fmtCurrency(seoPrice)}</div>
                <div style={{ fontSize: 14, color: theme.textMuted }}>{fmtCurrency(seoPrice)} / month</div>
              </button>

              {/* GEO Only */}
              <button
                onClick={() => setPlanType("geo")}
                style={{
                  padding: 20,
                  borderRadius: 10,
                  border: planType === "geo" ? `2px solid ${theme.text}` : `1px solid ${theme.border}`,
                  background: planType === "geo" ? theme.badgeBg : theme.cardBg,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  color: theme.text,
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 4 }}>GEO Only</div>
                <div style={{ fontSize: 15, color: theme.textSecondary, marginBottom: 10 }}>Content optimized for AI engines</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: theme.text }}>{fmtCurrency(geoPrice)}</div>
                <div style={{ fontSize: 14, color: theme.textMuted }}>{fmtCurrency(geoPrice)} / month</div>
              </button>
            </>
          );
        })()}

        {/* Combined — with discount badge */}
        <button
          onClick={() => setPlanType("combined")}
          style={{
            position: "relative",
            padding: 20,
            borderRadius: 10,
            border: planType === "combined" ? "2px solid #10A37F" : `1px solid ${theme.border}`,
            background: planType === "combined" ? "#10A37F08" : theme.cardBg,
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s",
          }}
        >
          {/* Discount badge */}
          <div style={{
            position: "absolute",
            top: -10,
            right: 16,
            padding: "3px 12px",
            borderRadius: 20,
            background: "#10A37F",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
          }}>
            Save {discount.savingsPercent}%
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>SEO + GEO</div>
            <span style={{ fontSize: 14, padding: "2px 6px", borderRadius: 4, background: "#10A37F15", color: "#10A37F", fontWeight: 600 }}>Recommended</span>
          </div>
          <div style={{ fontSize: 15, color: theme.textSecondary, marginBottom: 10 }}>Combined bundle - organic ranking + AI presence</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#10A37F" }}>{fmtCurrency(discount.combinedMonthly)}</span>
            <span style={{ fontSize: 15, color: "#A2A9B0", textDecoration: "line-through" }}>{fmtCurrency(discount.separateMonthly)}</span>
          </div>
          <div style={{ fontSize: 14, color: "#10A37F", fontWeight: 500 }}>
            Save {fmtCurrency(discount.savingsMonthly)} per month
          </div>
        </button>
      </div>

      {/* Discount banner when combined is selected */}
      {planType === "combined" && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderRadius: 10, background: "#10A37F08", border: "1px solid #10A37F30", marginBottom: 20 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
          <div>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#10A37F" }}>Active discount: </span>
            <span style={{ fontSize: 15, color: theme.text }}>Save {fmtCurrency(discount.savingsTotal)} across the entire plan ({planDuration} months) by choosing the combined bundle</span>
          </div>
        </div>
      )}

      {/* Projection / Vision Panel */}
      <ProjectionPanel
        speed={planSpeed}
        duration={planDuration}
        planType={planType}
        cartSiteCount={cartSiteCount}
        cartQueries={cartQueries}
        theme={theme}
        isMobile={isMobile}
      />

      {/* Plan table */}
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 28, overflowX: isMobile ? "auto" : undefined, WebkitOverflowScrolling: "touch" as never }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 13 : 15, minWidth: isMobile ? 500 : undefined }}>
          <thead>
            <tr style={{ background: theme.tableHeaderBg }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>Month</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>SEO articles</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>GEO articles</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>Sites</th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>Monthly budget</th>
            </tr>
          </thead>
          <tbody>
            {planData.map(row => (
              <tr key={row.month} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: "14px 16px", fontWeight: 600 }}>Month {row.month}</td>
                <td style={{ padding: "14px 16px", textAlign: "center", color: planType === "geo" ? theme.textMuted : undefined }}>{planType === "geo" ? "—" : row.seoArticles}</td>
                <td style={{ padding: "14px 16px", textAlign: "center", color: planType === "seo" ? theme.textMuted : undefined }}>{planType === "seo" ? "—" : row.geoArticles}</td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}>{row.sites}</td>
                <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600 }}>{fmtCurrency(row.budget)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: theme.tableHeaderBg, fontWeight: 700 }}>
              <td style={{ padding: "14px 16px", borderTop: `1px solid ${theme.border}` }}>Total</td>
              <td style={{ padding: "14px 16px", textAlign: "center", borderTop: `1px solid ${theme.border}`, color: planType === "geo" ? theme.textMuted : undefined }}>{planType === "geo" ? "—" : planData.reduce((s, r) => s + r.seoArticles, 0)}</td>
              <td style={{ padding: "14px 16px", textAlign: "center", borderTop: `1px solid ${theme.border}`, color: planType === "seo" ? theme.textMuted : undefined }}>{planType === "seo" ? "—" : planData.reduce((s, r) => s + r.geoArticles, 0)}</td>
              <td style={{ padding: "14px 16px", textAlign: "center", borderTop: `1px solid ${theme.border}` }}>{planData.reduce((s, r) => s + r.sites, 0)}</td>
              <td style={{ padding: "14px 16px", textAlign: "right", borderTop: `1px solid ${theme.border}` }}>
                <span>{fmtCurrency(planTotals.budget)}</span>
                {planType === "combined" && (
                  <span style={{ fontSize: 14, color: theme.textMuted, textDecoration: "line-through", marginLeft: 8 }}>{fmtCurrency(discount.separateTotal)}</span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <SummaryCard label="Total articles" value={String(planTotals.articles)} accent={false} theme={theme} />
        <SummaryCard label="Total budget" value={fmtCurrency(planTotals.budget)} accent={false} theme={theme} />
        {planType === "combined" ? (
          <div style={{ border: "1px solid #10A37F30", borderRadius: 10, padding: 20, background: "#10A37F08" }}>
            <div style={{ fontSize: 14, color: "#10A37F", marginBottom: 8, fontWeight: 500 }}>Total savings</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#10A37F" }}>{fmtCurrency(discount.savingsTotal)}</div>
          </div>
        ) : (
          <SummaryCard label="Projected traffic growth" value={planSpeed === "fast" ? "+180%" : planSpeed === "medium" ? "+120%" : "+65%"} accent={true} theme={theme} />
        )}
        <SummaryCard label="Publisher sites in cart" value={String(cartSiteCount)} accent={cartSiteCount > 0} theme={theme} />
      </div>

      {/* Proposal Builder — connects SEO plan + Marketplace cart */}
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: 24, background: theme.cardBg, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, marginBottom: 18, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 600, marginBottom: 4, letterSpacing: 0.3 }}>Full quote</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.text, margin: 0 }}>What&apos;s included in the quote</h3>
            <p style={{ fontSize: 14, color: theme.textSecondary, margin: "4px 0 0" }}>The plan splits the quote into two components that connect automatically</p>
          </div>
        </div>

        {/* Two columns: SEO/GEO plan + External publisher cart */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 16 }}>
          {/* Left: content plan */}
          <div style={{ padding: 18, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.badgeBg }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: 6, background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>1</span>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>
                {planType === "seo" ? "SEO" : planType === "geo" ? "GEO" : "SEO + GEO"} content plan
              </div>
            </div>
            <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>
              {planTotals.articles} articles across {planDuration} months at {planSpeed === "fast" ? "aggressive" : planSpeed === "medium" ? "medium" : "conservative"} pace
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${theme.border}`, fontSize: 14 }}>
              <span style={{ color: theme.text }}>Total</span>
              <span style={{ fontWeight: 700, color: theme.text }}>{fmtCurrency(planTotals.budget)}</span>
            </div>
          </div>

          {/* Right: external publishers from cart */}
          <div style={{ padding: 18, borderRadius: 10, border: cartSiteCount > 0 ? "1px solid #10A37F30" : `1px dashed ${theme.border}`, background: cartSiteCount > 0 ? "#10A37F08" : theme.hoverBg }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: 6, background: cartSiteCount > 0 ? "#10A37F" : theme.textMuted, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>2</span>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>External amplification - placements on publisher sites</div>
            </div>
            {cartSiteCount > 0 ? (
              <>
                <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>
                  {cartSiteCount} sites from the Marketplace · coverage of ~{cartQueries} additional AI queries
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #10A37F30", fontSize: 14 }}>
                  <span style={{ color: theme.text }}>Total</span>
                  <span style={{ fontWeight: 700, color: "#10A37F" }}>{fmtCurrency(cartTotal)}</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>
                  No sites selected yet. Add sites from the Marketplace to include external placements in the quote.
                </div>
                <button
                  onClick={goToMarketplace}
                  style={{ padding: "8px 16px", fontSize: 14, fontWeight: 600, borderRadius: 8, border: `1px solid ${theme.text}`, background: theme.cardBg, color: theme.text, cursor: "pointer" }}
                >
                  + Add sites from Marketplace
                </button>
              </>
            )}
          </div>
        </div>

        {/* Grand total + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderRadius: 10, background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: darkMode ? "#484F58" : "#A2A9B0", marginBottom: 2, fontWeight: 500 }}>Total client quote</div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{fmtCurrency(planTotals.budget + cartTotal)}</div>
            <div style={{ fontSize: 13, color: darkMode ? "#484F58" : "#A2A9B0", marginTop: 2 }}>
              Content {fmtCurrency(planTotals.budget)} + external placements {fmtCurrency(cartTotal)}
            </div>
          </div>
          <button style={{ padding: "14px 36px", background: "#10A37F", color: "#fff", fontSize: 15, fontWeight: 600, borderRadius: 9, border: "none", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            Generate full quote
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent, theme }: { label: string; value: string; accent: boolean; theme: Theme }) {
  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: 20 }}>
      <div style={{ fontSize: 15, color: theme.textSecondary, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "#10A37F" : theme.text }}>{value}</div>
    </div>
  );
}

// ============================================================
// TAB 3: Publishers Portal
// ============================================================
function PublishersTab({ theme, darkMode, isMobile, isTablet }: { theme: Theme; darkMode: boolean; isMobile: boolean; isTablet: boolean }) {
  const [newDomain, setNewDomain] = useState("");
  const [newCategory, setNewCategory] = useState("Technology");
  const [newPrice, setNewPrice] = useState("");

  const stats = [
    { label: "Active sites", value: "9", color: "#10A37F" },
    { label: "Agencies viewed", value: "24", color: theme.text },
    { label: "Articles sold", value: "47", color: theme.text },
    { label: "Monthly revenue", value: "$8,100", color: "#10A37F" },
  ];

  const statusDot = (status: "approved" | "pending" | "rejected") => {
    const colors = { approved: "#10A37F", pending: "#727272", rejected: "#DC2626" };
    const labels = { approved: "Approved", pending: "Pending review", rejected: "Rejected" };
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[status], display: "inline-block" }} />
        <span style={{ fontSize: 14, color: colors[status], fontWeight: 500 }}>{labels[status]}</span>
      </span>
    );
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Publishers Portal</h1>
        <p style={{ fontSize: 15, color: theme.textSecondary }}>Manage your sites, track sales, and see agency activity</p>
      </div>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 12 : 16, marginBottom: 28 }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: isMobile ? "12px 14px" : "16px 20px" }}>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Add new site */}
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: "20px 24px", marginBottom: 28, background: theme.badgeBg }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 16 }}>Add a new site</div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 16 }}>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 6 }}>Domain</div>
            <input
              type="text"
              placeholder="example.com"
              value={newDomain}
              onChange={e => setNewDomain(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 14px",
                fontSize: 14,
                border: `1px solid ${theme.border}`,
                borderRadius: 8,
                background: theme.inputBg,
                outline: "none",
                color: theme.text,
              }}
            />
          </div>
          <div style={{ flex: "0 1 160px" }}>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 6 }}>Category</div>
            <div style={{ position: "relative" }}>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                style={{
                  width: "100%",
                  appearance: "none",
                  padding: "9px 28px 9px 14px",
                  fontSize: 14,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  background: theme.inputBg,
                  cursor: "pointer",
                  color: theme.text,
                  outline: "none",
                }}
              >
                {CATEGORIES.filter(c => c !== "All").map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }}>
                <IconChevronDown size={12} />
              </span>
            </div>
          </div>
          <div style={{ flex: "0 1 140px" }}>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 6 }}>Price per article $</div>
            <input
              type="number"
              placeholder="1,200"
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 14px",
                fontSize: 14,
                border: `1px solid ${theme.border}`,
                borderRadius: 8,
                background: theme.inputBg,
                outline: "none",
                color: theme.text,
              }}
            />
          </div>
          <button style={{
            padding: "9px 24px",
            background: darkMode ? "#E6EDF3" : "#000",
            color: darkMode ? "#0D1117" : "#fff",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
          }}>
            Add site
          </button>
        </div>
        <div style={{ marginTop: 10 }}>
          <span style={{ fontSize: 14, color: "#10A37F", cursor: "pointer", fontWeight: 500 }}>Upload CSV</span>
        </div>
      </div>

      {/* Publisher sites table */}
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 28, overflowX: isMobile ? "auto" : undefined, WebkitOverflowScrolling: "touch" as never }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 13 : 14, minWidth: isMobile ? 700 : undefined }}>
          <thead>
            <tr style={{ background: theme.tableHeaderBg }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>Site</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>Category</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>DR</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>Status</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>Agencies viewed</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>Articles sold</th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: theme.text, borderBottom: `1px solid ${theme.border}` }}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {PUBLISHER_SITES.map((site, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: "14px 16px", fontWeight: 600 }}>{site.domain}</td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}>
                  <span style={{ fontSize: 13, background: theme.badgeBg, border: `1px solid ${theme.border}`, padding: "3px 10px", borderRadius: 20 }}>{site.category}</span>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: 600 }}>{site.dr}</td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}>{statusDot(site.status)}</td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}>{site.agenciesViewed}</td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}>{site.articlesSold}</td>
                <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600 }}>{site.revenue !== null ? fmtCurrency(site.revenue) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Agency Interest */}
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: isMobile ? "14px 14px" : "20px 24px", marginBottom: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 16 }}>Agencies that recently showed interest</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {AGENCY_ACTIVITIES.map((activity, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < AGENCY_ACTIVITIES.length - 1 ? `1px solid ${theme.border}` : "none" }}>
              <div style={{ fontSize: 14 }}>
                <span style={{ fontWeight: 600 }}>{activity.agency}</span>
                <span style={{ color: theme.textSecondary }}> — {activity.action} </span>
                <span style={{ fontWeight: 500, color: "#10A37F" }}>{activity.site}</span>
              </div>
              <span style={{ fontSize: 14, color: theme.textMuted, whiteSpace: "nowrap" }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contract / Terms */}
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: "20px 24px" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 16 }}>Terms and conditions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {[
            "Fixed pricing — prices cannot be changed without updating the platform",
            "Price exclusivity — selling at different prices outside the platform is not allowed",
            "Content quality — commitment to publishing high-quality content on the agreed schedule",
            "Transparent reporting — share analytics with agencies upon request",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: theme.text }}>
              <span style={{ color: "#10A37F", fontWeight: 600, marginTop: 1 }}>
                <IconCheck size={14} />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{
            padding: "10px 24px",
            background: darkMode ? "#E6EDF3" : "#000",
            color: darkMode ? "#0D1117" : "#fff",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
          }}>
            Digital signature
          </button>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 600,
            color: "#10A37F",
            background: "#10A37F15",
            padding: "6px 14px",
            borderRadius: 20,
          }}>
            <IconCheck size={12} />
            Signed
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 4: Rejected Sites
// ============================================================
function RejectedTab({ publishers, pendingCount, theme, darkMode, isMobile, isTablet }: { publishers: Publisher[]; pendingCount: number; theme: Theme; darkMode: boolean; isMobile: boolean; isTablet: boolean }) {
  const totalPublishers = PUBLISHERS.length;
  const approvedCount = PUBLISHERS.filter(p => p.status === "approved").length;
  const rejectedCount = publishers.length;

  const stats = [
    { label: "Total in system", value: totalPublishers, color: theme.text },
    { label: "Approved", value: approvedCount, color: "#10A37F" },
    { label: "Rejected", value: rejectedCount, color: "#DC2626" },
    { label: "Pending review", value: pendingCount, color: "#727272" },
  ];

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Rejected Sites</h1>
        <p style={{ fontSize: isMobile ? 14 : 15, color: theme.textSecondary }}>Sites that were reviewed and did not meet our quality criteria</p>
      </div>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 12 : 16, marginBottom: 28 }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: isMobile ? "12px 14px" : "16px 20px" }}>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Rejected cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {publishers.map(pub => (
          <div key={pub.id} style={{ border: `1px solid ${theme.border}`, borderRadius: 10, padding: isMobile ? "14px 14px" : "18px 24px", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 12 : 24, background: theme.cardBg }}>
            {/* Info */}
            <div style={{ flex: isMobile ? undefined : "0 0 180px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 2 }}>{pub.name}</div>
              <div style={{ fontSize: 14, color: theme.textSecondary }}>{pub.domain}</div>
            </div>

            {/* Rejection reason */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 2 }}>Rejection reason</div>
              <div style={{ fontSize: 14, color: "#DC2626", fontWeight: 500 }}>{pub.rejectionReason}</div>
            </div>

            {/* Scores */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 2 }}>SEO</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#DC2626" }}>{pub.seoScore}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 2 }}>GIO</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#DC2626" }}>{pub.gioScore}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 2 }}>DR</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#DC2626" }}>{pub.dr}</div>
              </div>
            </div>

            {/* Date */}
            <div style={{ flex: "0 0 100px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 2 }}>Rejection date</div>
              <div style={{ fontSize: 14, color: theme.textSecondary, fontWeight: 500 }}>03/12/2026</div>
            </div>

            {/* Action */}
            <button style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px",
              fontSize: 14,
              fontWeight: 600,
              border: `1px solid ${theme.border}`,
              borderRadius: 9,
              background: theme.cardBg,
              color: theme.text,
              cursor: "pointer",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}>
              <IconRefresh size={13} />
              Re-check
            </button>
          </div>
        ))}
      </div>

      {publishers.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: theme.textSecondary }}>
          <div style={{ fontSize: 15 }}>No rejected sites at the moment</div>
        </div>
      )}
    </div>
  );
}
