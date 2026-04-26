"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

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

const BRAND_GREEN = "#10A37F";
const BRAND_AMBER = "#B45309";
const BRAND_BLUE = "#1D4ED8";

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

  // ── Cross-view shared state ──
  const [orders, setOrders] = useState<Order[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [tracking, setTracking] = useState<ArticleTracking[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setOrders(loadFromLS<Order[]>(LS_KEY_ORDERS, SEED_ORDERS));
    setPrices(loadFromLS<Record<string, number>>(LS_KEY_PRICES, {}));
    setTracking(loadFromLS<ArticleTracking[]>(LS_KEY_TRACKING, SEED_TRACKING));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_ORDERS, orders); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_PRICES, prices); }, [prices, hydrated]);
  useEffect(() => { if (hydrated) saveToLS(LS_KEY_TRACKING, tracking); }, [tracking, hydrated]);

  // ── Effective price (overrides + base) ──
  const getPrice = useCallback((section: PublisherSection) => prices[section.id] ?? section.pricePerArticle, [prices]);

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
                <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
                <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 600, color: theme.text, textDecoration: "none" }}>ScalePublish</a>
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
            <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Scans</a>
            <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 600, color: theme.text, textDecoration: "none", padding: "8px 0" }}>ScalePublish</a>
            <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Content Editor</a>
            <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none", padding: "8px 0" }}>Roadmap</a>
          </div>
        )}
      </header>

      {/* ── User Mode Switcher ── */}
      <UserModeSwitcher userMode={userMode} setUserMode={setUserMode} theme={theme} darkMode={darkMode} isMobile={isMobile} pendingOrderCount={orders.filter((o) => o.status === "pending").length} />

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
          />
        ) : (
          <AgencyDashboard
            theme={theme}
            isMobile={isMobile}
            orders={orders}
            setOrders={setOrders}
            tracking={tracking}
            getPrice={getPrice}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// USER MODE SWITCHER (Agency / Publisher)
// ============================================================

function UserModeSwitcher({ userMode, setUserMode, theme, darkMode, isMobile, pendingOrderCount }: { userMode: "agency" | "publisher"; setUserMode: (v: "agency" | "publisher") => void; theme: Theme; darkMode: boolean; isMobile: boolean; pendingOrderCount: number }) {
  const isAgency = userMode === "agency";
  const userInfo = isAgency
    ? { name: DEMO_BRAND.agency, role: "Agency · Acting for: Bank Hapoalim", icon: <IconUsers size={16} /> }
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
  );
}

// ============================================================
// PUBLISHER DASHBOARD
// ============================================================

type PublisherTab = "sites" | "inbox" | "articles" | "analytics";

function PublisherDashboard({ theme, isMobile, orders, setOrders, prices, setPrices, tracking, getPrice }: { theme: Theme; isMobile: boolean; orders: Order[]; setOrders: (v: Order[]) => void; prices: Record<string, number>; setPrices: (v: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void; tracking: ArticleTracking[]; setTracking: (v: ArticleTracking[]) => void; getPrice: (s: PublisherSection) => number }) {
  const [tab, setTab] = useState<PublisherTab>("sites");
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const publishedCount = tracking.length + orders.filter((o) => o.status === "published").length;

  const TABS: { key: PublisherTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "sites", label: "Sites & Sections", icon: <IconBuilding size={14} /> },
    { key: "inbox", label: "Order Inbox", icon: <IconInbox size={14} />, badge: pendingCount },
    { key: "articles", label: "Articles & Tracking", icon: <IconChart size={14} />, badge: publishedCount },
    { key: "analytics", label: "Analytics", icon: <IconChart size={14} /> },
  ];

  return (
    <>
      <SubTabs tabs={TABS} active={tab} onChange={(k) => setTab(k as PublisherTab)} theme={theme} isMobile={isMobile} />
      {tab === "sites" && <PublisherSitesView theme={theme} isMobile={isMobile} prices={prices} setPrices={setPrices} getPrice={getPrice} />}
      {tab === "inbox" && <PublisherInboxView theme={theme} isMobile={isMobile} orders={orders} setOrders={setOrders} />}
      {tab === "articles" && <PublisherArticlesView theme={theme} isMobile={isMobile} tracking={tracking} orders={orders} />}
      {tab === "analytics" && <PublisherAnalyticsView theme={theme} isMobile={isMobile} orders={orders} tracking={tracking} getPrice={getPrice} />}
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

function PublisherSitesView({ theme, isMobile, prices, setPrices, getPrice }: { theme: Theme; isMobile: boolean; prices: Record<string, number>; setPrices: (v: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void; getPrice: (s: PublisherSection) => number }) {
  const [search, setSearch] = useState("");
  const [expandedSites, setExpandedSites] = useState<Record<string, boolean>>(() => Object.fromEntries(YEDIOTH_SITES.map((s) => [s.id, true])));
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");

  const sectionsBySite = useMemo(() => {
    const map: Record<string, PublisherSection[]> = {};
    for (const sec of YEDIOTH_SECTIONS) {
      if (search) {
        const q = search.toLowerCase();
        if (!sec.name.toLowerCase().includes(q) && !sec.hebrewName.includes(search) && !sec.category.toLowerCase().includes(q)) continue;
      }
      if (!map[sec.siteId]) map[sec.siteId] = [];
      map[sec.siteId].push(sec);
    }
    return map;
  }, [search]);

  const totalSections = Object.values(sectionsBySite).reduce((s, arr) => s + arr.length, 0);
  const avgPrice = useMemo(() => {
    if (YEDIOTH_SECTIONS.length === 0) return 0;
    return Math.round(YEDIOTH_SECTIONS.reduce((s, sec) => s + getPrice(sec), 0) / YEDIOTH_SECTIONS.length);
  }, [getPrice]);

  const toggleSite = (id: string) => setExpandedSites((p) => ({ ...p, [id]: !p[id] }));

  const startEditPrice = (section: PublisherSection) => {
    setEditingPriceId(section.id);
    setTempPrice(String(getPrice(section)));
  };
  const savePrice = (sectionId: string) => {
    const n = parseInt(tempPrice.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(n) && n > 0) {
      setPrices((prev) => ({ ...prev, [sectionId]: n }));
    }
    setEditingPriceId(null);
  };

  return (
    <div>
      {/* Header banner */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_AMBER}10 0%, ${BRAND_AMBER}03 100%)`, border: `1px solid ${BRAND_AMBER}30`, borderRadius: 12, padding: isMobile ? 16 : 22, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_AMBER, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Publisher Inventory</div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text }}>Yedioth Ahronoth Group</div>
          <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Manage your sites, sections, and pricing. Changes are visible to agencies in real time.</div>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <Stat label="Sites" value={String(YEDIOTH_SITES.length)} theme={theme} />
          <Stat label="Sections" value={String(YEDIOTH_SECTIONS.length)} theme={theme} />
          <Stat label="Avg. price" value={fmtNIS(avgPrice)} theme={theme} />
          <Stat label="Upload time" value="~3 days" theme={theme} />
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><IconSearch size={14} color={theme.textMuted} /></div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sites, sections, categories..." style={{ width: "100%", padding: "10px 14px 10px 38px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box" }} />
        </div>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13, fontWeight: 600, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, cursor: "pointer" }}>
          <IconPlus size={13} /> Add Site
        </button>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13, fontWeight: 600, background: BRAND_AMBER, color: "#fff", border: "none", borderRadius: 9, cursor: "pointer" }}>
          <IconPlus size={13} /> Add Section
        </button>
      </div>

      {/* Sites tree */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {YEDIOTH_SITES.map((site) => {
          const sections = sectionsBySite[site.id] || [];
          if (search && sections.length === 0) return null;
          const expanded = expandedSites[site.id];
          const siteRevenue = sections.reduce((s, sec) => s + getPrice(sec), 0);
          return (
            <div key={site.id} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => toggleSite(site.id)} style={{ width: "100%", padding: isMobile ? 14 : 18, background: "none", border: "none", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0, color: theme.textSecondary }}>
                  <IconChevronRight size={14} />
                </div>
                <Favicon domain={site.domain} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: theme.text }}>{site.name}</span>
                    <span style={{ fontSize: 13, color: theme.textSecondary, direction: "rtl" }}>{site.hebrewName}</span>
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                    {site.domain} · {fmtNum(site.monthlyTraffic)} monthly visits · DR {site.dr}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>{sections.length} SECTIONS</div>
                    <div style={{ fontSize: 13, color: theme.text, fontWeight: 600 }}>{fmtNIS(siteRevenue)} total</div>
                  </div>
                </div>
              </button>
              {expanded && sections.length > 0 && (
                <div style={{ borderTop: `1px solid ${theme.border}`, background: theme.tableBg }}>
                  {sections.map((sec) => {
                    const isEditing = editingPriceId === sec.id;
                    const overridden = prices[sec.id] !== undefined;
                    return (
                      <div key={sec.id} style={{ padding: isMobile ? "12px 14px" : "14px 18px 14px 50px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{sec.name}</span>
                            <span style={{ fontSize: 13, color: theme.textSecondary, direction: "rtl" }}>{sec.hebrewName}</span>
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
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                          {isEditing ? (
                            <>
                              <span style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 600 }}>₪</span>
                              <input value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} autoFocus onBlur={() => savePrice(sec.id)} onKeyDown={(e) => { if (e.key === "Enter") savePrice(sec.id); if (e.key === "Escape") setEditingPriceId(null); }} style={{ width: 90, padding: "6px 10px", fontSize: 14, fontWeight: 600, background: theme.inputBg, border: `1px solid ${BRAND_AMBER}`, borderRadius: 6, color: theme.text, outline: "none", textAlign: "right" }} />
                            </>
                          ) : (
                            <button onClick={() => startEditPrice(sec)} style={{ padding: "6px 12px", fontSize: 14, fontWeight: 700, background: overridden ? `${BRAND_AMBER}15` : "transparent", color: overridden ? BRAND_AMBER : theme.text, border: `1px solid ${overridden ? BRAND_AMBER : theme.border}`, borderRadius: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, minWidth: 100, justifyContent: "flex-end" }}>
                              {fmtNIS(getPrice(sec))} <IconEdit size={11} />
                            </button>
                          )}
                          <button title="Delete section" style={{ padding: 8, background: "none", border: "none", color: theme.textMuted, cursor: "pointer", borderRadius: 6 }}>
                            <IconTrash size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ padding: isMobile ? "10px 14px" : "10px 18px 12px 50px" }}>
                    <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, background: "none", border: `1px dashed ${theme.border}`, color: theme.textSecondary, borderRadius: 7, cursor: "pointer" }}>
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
    </div>
  );
}

// ── Helpers ──
function Stat({ label, value, theme }: { label: string; value: string; theme: Theme }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function Pill({ children, bg, color, small = false }: { children: React.ReactNode; bg: string; color: string; small?: boolean }) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: small ? "2px 7px" : "3px 9px", fontSize: small ? 10 : 11, fontWeight: 600, background: bg, color, borderRadius: 6, lineHeight: 1.4 }}>{children}</span>;
}

// ============================================================
// PUBLISHER · Order Inbox
// ============================================================

function PublisherInboxView({ theme, isMobile, orders, setOrders }: { theme: Theme; isMobile: boolean; orders: Order[]; setOrders: (v: Order[]) => void }) {
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
  };

  return (
    <div>
      {/* Banner */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_GREEN}10 0%, ${BRAND_GREEN}03 100%)`, border: `1px solid ${BRAND_GREEN}30`, borderRadius: 12, padding: isMobile ? 16 : 22, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Order Inbox</div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text }}>{counts.pending} pending {counts.pending === 1 ? "order" : "orders"} · {fmtNIS(orders.filter((o) => o.status === "pending").reduce((s, o) => s + o.totalPrice, 0))} potential revenue</div>
          <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Orders submitted by agencies — your sales team contacts the agency to collect payment, then you publish the article.</div>
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
            <OrderCard key={order.id} order={order} theme={theme} isMobile={isMobile} expanded={openOrderId === order.id} onToggle={() => setOpenOrderId(openOrderId === order.id ? null : order.id)} onUpdate={updateStatus} mode="publisher" />
          ))}
        </div>
      )}
    </div>
  );
}

// ── ORDER CARD (shared between Publisher inbox & Agency orders) ──
function OrderCard({ order, theme, isMobile, expanded, onToggle, onUpdate, mode }: { order: Order; theme: Theme; isMobile: boolean; expanded: boolean; onToggle: () => void; onUpdate: (id: string, status: Order["status"]) => void; mode: "publisher" | "agency" }) {
  const STATUS_STYLES: Record<Order["status"], { bg: string; color: string; label: string }> = {
    pending: { bg: "#FEF3C7", color: "#B45309", label: "Pending approval" },
    approved: { bg: "#DBEAFE", color: "#1D4ED8", label: "Approved" },
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
            <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text }}>{fmtNIS(order.totalPrice)}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Total order value</div>
          </div>
        </div>
      </button>
      {expanded && (
        <div style={{ borderTop: `1px solid ${theme.border}`, padding: isMobile ? 14 : 20, background: theme.tableHeaderBg }}>
          <Section title="Selected queries" theme={theme}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {order.queries.map((q, i) => (
                <div key={i} style={{ fontSize: 13, color: theme.text, padding: "6px 10px", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 7 }}>
                  {i + 1}. {q}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Sections ordered" theme={theme}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {order.sections.map((s, i) => {
                const sec = YEDIOTH_SECTIONS.find((y) => y.id === s.sectionId);
                const site = YEDIOTH_SITES.find((y) => y.id === s.siteId);
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

          <Section title="Agency contact" theme={theme}>
            <div style={{ fontSize: 13, color: theme.text }}>{order.agencyName} · {order.agencyContact}</div>
          </Section>

          {/* Action buttons */}
          {mode === "publisher" && order.status === "pending" && (
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <button onClick={() => onUpdate(order.id, "approved")} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IconCheck size={13} /> Approve & contact agency
              </button>
              <button onClick={() => onUpdate(order.id, "rejected")} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer" }}>
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
    </div>
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

function PublisherArticlesView({ theme, isMobile, tracking, orders }: { theme: Theme; isMobile: boolean; tracking: ArticleTracking[]; orders: Order[] }) {
  const [search, setSearch] = useState("");
  const filtered = tracking.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const sec = YEDIOTH_SECTIONS.find((s) => s.id === t.sectionId);
    return t.url.toLowerCase().includes(q) || (sec?.name.toLowerCase().includes(q));
  });

  const totalViews = tracking.reduce((s, t) => s + t.views, 0);
  const indexedCount = tracking.filter((t) => t.indexedGoogle).length;
  const aiCitedCount = tracking.filter((t) => t.citedGPT || t.citedGemini || t.citedPerplexity).length;
  const avgImpact = tracking.length === 0 ? 0 : Math.round(tracking.reduce((s, t) => s + t.impactScore, 0) / tracking.length);

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${BRAND_BLUE}10 0%, ${BRAND_BLUE}03 100%)`, border: `1px solid ${BRAND_BLUE}30`, borderRadius: 12, padding: isMobile ? 16 : 22, marginBottom: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_BLUE, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Article-Level Tracking</div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text }}>{tracking.length} published articles · monitored per item</div>
          <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Each article (item) is tracked individually — crawl status, AI citations, ranked queries, views.</div>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <Stat label="Total views" value={fmtNum(totalViews)} theme={theme} />
          <Stat label="Indexed" value={`${indexedCount}/${tracking.length}`} theme={theme} />
          <Stat label="AI-cited" value={`${aiCitedCount}/${tracking.length}`} theme={theme} />
          <Stat label="Avg. impact" value={`${avgImpact}%`} theme={theme} />
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: 18 }}>
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><IconSearch size={14} color={theme.textMuted} /></div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles by URL or section..." style={{ width: "100%", padding: "10px 14px 10px 38px", fontSize: 14, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((t) => (
          <ArticleTrackingRow key={t.url} tracking={t} theme={theme} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function ArticleTrackingRow({ tracking, theme, isMobile }: { tracking: ArticleTracking; theme: Theme; isMobile: boolean }) {
  const sec = YEDIOTH_SECTIONS.find((s) => s.id === tracking.sectionId);
  const site = sec ? YEDIOTH_SITES.find((s) => s.id === sec.siteId) : null;
  const [expanded, setExpanded] = useState(false);

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
          <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: tracking.impactScore >= 70 ? BRAND_GREEN : tracking.impactScore >= 40 ? BRAND_AMBER : theme.textSecondary }}>{tracking.impactScore}%</div>
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
            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 13, fontWeight: 600, background: theme.cardBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: 7, cursor: "pointer" }}>
              <IconRefresh size={12} /> Re-check engines
            </button>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 13, fontWeight: 600, background: theme.cardBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: 7, cursor: "pointer" }}>
              Export report
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

function PublisherAnalyticsView({ theme, isMobile, orders, tracking, getPrice }: { theme: Theme; isMobile: boolean; orders: Order[]; tracking: ArticleTracking[]; getPrice: (s: PublisherSection) => number }) {
  const totalRevenue = orders.filter((o) => o.status === "published" || o.status === "in_progress" || o.status === "approved").reduce((s, o) => s + o.totalPrice, 0) + 348000; // baseline historical
  const articlesSold = orders.filter((o) => o.status !== "rejected" && o.status !== "pending").length + 47;
  const topSections = useMemo(() => {
    return [...YEDIOTH_SECTIONS]
      .sort((a, b) => getPrice(b) * b.monthlyReadership - getPrice(a) * a.monthlyReadership)
      .slice(0, 5);
  }, [getPrice]);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <Kpi label="Revenue this month" value={fmtNIS(totalRevenue)} delta="+18.4%" theme={theme} positive />
        <Kpi label="Articles sold" value={String(articlesSold)} delta="+12" theme={theme} positive />
        <Kpi label="Avg. order value" value={fmtNIS(Math.round(totalRevenue / Math.max(1, articlesSold)))} delta="+₪420" theme={theme} positive />
        <Kpi label="AI-citation rate" value="74%" delta="+8%" theme={theme} positive />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: 14 }}>
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 16 : 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 14 }}>Top sections by revenue potential</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topSections.map((sec, i) => {
              const site = YEDIOTH_SITES.find((s) => s.id === sec.siteId);
              const revenue = getPrice(sec) * Math.max(1, Math.round(sec.monthlyReadership / 200000));
              const max = topSections[0] ? getPrice(topSections[0]) * Math.max(1, Math.round(topSections[0].monthlyReadership / 200000)) : 1;
              return (
                <div key={sec.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 24, fontSize: 12, fontWeight: 700, color: theme.textSecondary }}>#{i + 1}</div>
                  {site && <Favicon domain={site.domain} size={20} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 4 }}>{site?.name} · {sec.name}</div>
                    <div style={{ height: 6, background: theme.barTrack, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(revenue / max) * 100}%`, height: "100%", background: BRAND_AMBER }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{fmtNIS(revenue)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 16 : 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 14 }}>AI engine performance</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[{ name: "ChatGPT", val: 88, color: BRAND_GREEN }, { name: "Gemini", val: 71, color: BRAND_BLUE }, { name: "Perplexity", val: 42, color: BRAND_AMBER }].map((e) => (
              <div key={e.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: theme.text, fontWeight: 600 }}>{e.name}</span>
                  <span style={{ color: theme.textSecondary }}>{e.val}% citation rate</span>
                </div>
                <div style={{ height: 8, background: theme.barTrack, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${e.val}%`, height: "100%", background: e.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, delta, theme, positive }: { label: string; value: string; delta?: string; theme: Theme; positive?: boolean }) {
  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 11, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, lineHeight: 1.1 }}>{value}</div>
      {delta && <div style={{ fontSize: 12, color: positive ? BRAND_GREEN : BRAND_AMBER, fontWeight: 600, marginTop: 6 }}>{delta}</div>}
    </div>
  );
}

// ============================================================
// AGENCY DASHBOARD
// ============================================================

type AgencyTab = "queries" | "order-flow" | "orders" | "tracking";

function AgencyDashboard({ theme, isMobile, orders, setOrders, tracking, getPrice }: { theme: Theme; isMobile: boolean; orders: Order[]; setOrders: (v: Order[]) => void; tracking: ArticleTracking[]; getPrice: (s: PublisherSection) => number }) {
  const [tab, setTab] = useState<AgencyTab>("queries");
  const [selectedQueryIds, setSelectedQueryIds] = useState<string[]>([]);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const myOrdersCount = orders.length;

  const TABS: { key: AgencyTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "queries", label: "My Queries", icon: <IconBookmark size={14} /> },
    { key: "order-flow", label: "Order Flow", icon: <IconCart size={14} />, badge: selectedQueryIds.length },
    { key: "orders", label: "My Orders", icon: <IconInbox size={14} />, badge: myOrdersCount },
    { key: "tracking", label: "Article Tracking", icon: <IconChart size={14} /> },
  ];

  return (
    <>
      <SubTabs tabs={TABS} active={tab} onChange={(k) => setTab(k as AgencyTab)} theme={theme} isMobile={isMobile} />
      {tab === "queries" && <AgencyQueriesView theme={theme} isMobile={isMobile} selectedIds={selectedQueryIds} setSelectedIds={setSelectedQueryIds} pinnedIds={pinnedIds} setPinnedIds={setPinnedIds} dismissedIds={dismissedIds} setDismissedIds={setDismissedIds} goToOrderFlow={() => setTab("order-flow")} />}
      {tab === "order-flow" && <AgencyOrderFlowView theme={theme} isMobile={isMobile} selectedIds={selectedQueryIds} setSelectedIds={setSelectedQueryIds} orders={orders} setOrders={setOrders} getPrice={getPrice} goToOrders={() => setTab("orders")} goToQueries={() => setTab("queries")} />}
      {tab === "orders" && <AgencyOrdersView theme={theme} isMobile={isMobile} orders={orders} />}
      {tab === "tracking" && <AgencyTrackingView theme={theme} isMobile={isMobile} tracking={tracking} />}
    </>
  );
}

// ============================================================
// AGENCY · My Queries (multi-select up to 5)
// ============================================================

function AgencyQueriesView({ theme, isMobile, selectedIds, setSelectedIds, pinnedIds, setPinnedIds, dismissedIds, setDismissedIds, goToOrderFlow }: { theme: Theme; isMobile: boolean; selectedIds: string[]; setSelectedIds: (v: string[]) => void; pinnedIds: Set<string>; setPinnedIds: (v: Set<string>) => void; dismissedIds: Set<string>; setDismissedIds: (v: Set<string>) => void; goToOrderFlow: () => void }) {
  const MAX_SELECT = 5;
  const visibleQueries = DEMO_QUERIES.filter((q) => !dismissedIds.has(q.id));

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
        <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Brand: {DEMO_BRAND.name}</div>
        <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Queries with content opportunity</div>
        <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>Pick the queries you want to win. Select up to <strong style={{ color: theme.text }}>5 queries</strong> per article — fewer queries means deeper, higher-quality content. After selecting, you'll see Yedioth Ahronoth sections matched by audience, category, and intent.</div>
      </div>

      {/* Selection count + CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 14, background: selectedIds.length > 0 ? `${BRAND_GREEN}08` : theme.cardBg, border: `1px solid ${selectedIds.length > 0 ? BRAND_GREEN : theme.border}`, borderRadius: 11, marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 14, color: theme.text }}>
          <strong>{selectedIds.length}</strong> of {MAX_SELECT} queries selected
          {dismissedIds.size > 0 && <span style={{ marginLeft: 12, fontSize: 12, color: theme.textMuted }}>· {dismissedIds.size} dismissed <button onClick={restoreAll} style={{ background: "none", border: "none", color: BRAND_GREEN, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Restore</button></span>}
        </div>
        <button onClick={goToOrderFlow} disabled={selectedIds.length === 0} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 700, background: selectedIds.length > 0 ? BRAND_GREEN : theme.barTrack, color: selectedIds.length > 0 ? "#fff" : theme.textMuted, border: "none", borderRadius: 8, cursor: selectedIds.length > 0 ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", gap: 6 }}>
          Continue to content creation <IconArrowRight size={13} />
        </button>
      </div>

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

function AgencyOrderFlowView({ theme, isMobile, selectedIds, setSelectedIds, orders, setOrders, getPrice, goToOrders, goToQueries }: { theme: Theme; isMobile: boolean; selectedIds: string[]; setSelectedIds: (v: string[]) => void; orders: Order[]; setOrders: (v: Order[]) => void; getPrice: (s: PublisherSection) => number; goToOrders: () => void; goToQueries: () => void }) {
  const selectedQueries = DEMO_QUERIES.filter((q) => selectedIds.includes(q.id));

  const [title, setTitle] = useState<string>("");
  const [contentMode, setContentMode] = useState<"empty" | "generate">("generate");
  const [cartSectionIds, setCartSectionIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Auto-suggest title from first query
  useEffect(() => {
    if (selectedQueries.length > 0 && !title) {
      const base = selectedQueries[0].text;
      setTitle(`${base} — Bank Hapoalim's complete 2026 guide`);
    }
  }, [selectedQueries.length]);

  // Brand audience inference
  const brandAudience: AudienceTag[] = ["B2C", "B2B", "Decision-makers", "Affluent", "Mass market"];

  // Compute matched sections
  const matchedSections = useMemo(() => {
    if (selectedQueries.length === 0) return [];
    return YEDIOTH_SECTIONS
      .map((sec) => {
        const { score, reasons } = calculateMatch(sec, selectedQueries, { audience: brandAudience });
        return { section: sec, score, reasons };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [selectedQueries]);

  const cart = matchedSections.filter((m) => cartSectionIds.includes(m.section.id));
  const cartTotal = cart.reduce((s, m) => s + getPrice(m.section), 0);

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
      const newOrder: Order = {
        id: `ord-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        agencyName: DEMO_BRAND.agency,
        agencyContact: DEMO_BRAND.agencyContact,
        brand: DEMO_BRAND.name,
        brandDomain: DEMO_BRAND.domain,
        queries: selectedQueries.map((q) => q.text),
        title,
        contentMode,
        sections: cart.map((m) => ({ sectionId: m.section.id, siteId: m.section.siteId, price: getPrice(m.section) })),
        totalPrice: cartTotal,
        status: "pending",
      };
      setOrders([newOrder, ...orders]);
      setSubmitting(false);
      setSubmitted(true);
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
      <div style={{ padding: 60, textAlign: "center", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${BRAND_GREEN}20`, color: BRAND_GREEN, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <IconCheck size={28} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Order submitted to Yedioth Ahronoth</div>
        <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 18, maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>Yedioth's sales team will contact <strong style={{ color: theme.text }}>{DEMO_BRAND.agencyContact}</strong> to confirm and collect payment. Estimated upload time: ~3 days per article. Tracking will appear under "Article Tracking" once published.</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => { setSubmitted(false); setSelectedIds([]); setCartSectionIds([]); setTitle(""); goToOrders(); }} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>View my orders</button>
          <button onClick={() => { setSubmitted(false); setSelectedIds([]); setCartSectionIds([]); setTitle(""); goToQueries(); }} style={{ padding: "10px 22px", fontSize: 14, fontWeight: 600, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer" }}>Place another order</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Selected queries chips */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 18, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>Step 1 · Selected queries ({selectedQueries.length}/5)</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {selectedQueries.map((q) => (
            <div key={q.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px 6px 12px", background: `${BRAND_GREEN}10`, border: `1px solid ${BRAND_GREEN}30`, borderRadius: 18, fontSize: 13, color: theme.text }}>
              {q.text}
              <button onClick={() => setSelectedIds(selectedIds.filter((x) => x !== q.id))} style={{ background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", padding: 0, marginLeft: 4, display: "inline-flex" }}><IconX size={12} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Title editor */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 18, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>Step 2 · Article title (auto-suggested, editable)</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter article title in Hebrew or English..." style={{ width: "100%", padding: "12px 14px", fontSize: 15, fontWeight: 600, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 9, color: theme.text, outline: "none", boxSizing: "border-box" }} />
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>Editing the title re-evaluates which Yedioth sections are the best fit.</div>
      </div>

      {/* Content mode */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 18, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>Step 3 · Content</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setContentMode("generate")} style={{ flex: 1, minWidth: 220, padding: 14, background: contentMode === "generate" ? `${BRAND_GREEN}10` : "transparent", border: `1.5px solid ${contentMode === "generate" ? BRAND_GREEN : theme.border}`, borderRadius: 10, cursor: "pointer", textAlign: "left", color: theme.text }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <IconSparkle size={14} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>AI-generated draft</span>
            </div>
            <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.5 }}>We generate the article content from the selected queries. Yedioth's editor reviews and publishes.</div>
          </button>
          <button onClick={() => setContentMode("empty")} style={{ flex: 1, minWidth: 220, padding: 14, background: contentMode === "empty" ? `${BRAND_AMBER}10` : "transparent", border: `1.5px solid ${contentMode === "empty" ? BRAND_AMBER : theme.border}`, borderRadius: 10, cursor: "pointer", textAlign: "left", color: theme.text }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <IconEdit size={14} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>I'll provide the copy</span>
            </div>
            <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.5 }}>You write the article (or your client does). We just place it on the chosen Yedioth sections.</div>
          </button>
        </div>
      </div>

      {/* Matching sections list (priority sorted, NOT boxes) */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>Step 4 · Yedioth sections matched to your queries (sorted by fit)</div>
          <div style={{ fontSize: 12, color: theme.textSecondary }}>{matchedSections.length} matches · {cartSectionIds.length} selected</div>
        </div>
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
          {matchedSections.slice(0, 18).map((m, i) => {
            const site = YEDIOTH_SITES.find((s) => s.id === m.section.siteId);
            if (!site) return null;
            const inCart = cartSectionIds.includes(m.section.id);
            return (
              <div key={m.section.id} style={{ borderBottom: i < Math.min(17, matchedSections.length - 1) ? `1px solid ${theme.border}` : "none", padding: isMobile ? 12 : 16, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", background: inCart ? `${BRAND_GREEN}05` : "transparent" }}>
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
                  <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>FIT SCORE</div>
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
        </div>
      </div>

      {/* Cart + submit */}
      <div style={{ background: theme.cardBg, border: `1.5px solid ${cart.length > 0 ? BRAND_GREEN : theme.border}`, borderRadius: 12, padding: isMobile ? 14 : 22 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>Step 5 · Order summary</div>
        {cart.length === 0 ? (
          <div style={{ fontSize: 14, color: theme.textSecondary, textAlign: "center", padding: 20 }}>Add at least one section above to place your order.</div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {cart.map((m) => {
                const site = YEDIOTH_SITES.find((s) => s.id === m.section.siteId);
                if (!site) return null;
                return (
                  <div key={m.section.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}>
                    <Favicon domain={site.domain} size={18} />
                    <div style={{ flex: 1, fontSize: 13, color: theme.text }}>{site.name} · {m.section.name}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{fmtNIS(getPrice(m.section))}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>{cart.length} {cart.length === 1 ? "section" : "sections"} · {selectedQueries.length} queries · 1 article</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>TOTAL</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: theme.text }}>{fmtNIS(cartTotal)}</div>
              </div>
            </div>
            <button onClick={submitOrder} disabled={submitting || !title.trim()} style={{ width: "100%", padding: "14px 22px", fontSize: 15, fontWeight: 700, background: submitting ? theme.barTrack : BRAND_GREEN, color: "#fff", border: "none", borderRadius: 9, cursor: submitting ? "wait" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {submitting ? "Sending to Yedioth..." : <>Submit order to Yedioth Ahronoth <IconArrowRight size={14} /></>}
            </button>
            <div style={{ fontSize: 11, color: theme.textMuted, textAlign: "center", marginTop: 10 }}>Yedioth's sales team will contact your agency to confirm and collect payment. ~3 day publication window per article.</div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// AGENCY · My Orders
// ============================================================

function AgencyOrdersView({ theme, isMobile, orders }: { theme: Theme; isMobile: boolean; orders: Order[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const myOrders = orders.filter((o) => o.agencyName === DEMO_BRAND.agency || o.brand === DEMO_BRAND.name);
  const allOrders = orders; // Show all for demo purposes

  const totalSpend = allOrders.reduce((s, o) => s + o.totalPrice, 0);
  const pending = allOrders.filter((o) => o.status === "pending").length;
  const inProgress = allOrders.filter((o) => o.status === "in_progress" || o.status === "approved").length;
  const published = allOrders.filter((o) => o.status === "published").length;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <Kpi label="Total spend" value={fmtNIS(totalSpend)} theme={theme} />
        <Kpi label="Pending" value={String(pending)} theme={theme} />
        <Kpi label="In progress" value={String(inProgress)} theme={theme} />
        <Kpi label="Published" value={String(published)} theme={theme} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allOrders.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
            <IconInbox size={32} />
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginTop: 12 }}>No orders yet</div>
            <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Submit an order from the Order Flow tab.</div>
          </div>
        ) : allOrders.map((o) => (
          <OrderCard key={o.id} order={o} theme={theme} isMobile={isMobile} expanded={openId === o.id} onToggle={() => setOpenId(openId === o.id ? null : o.id)} onUpdate={() => { /* agency cannot update */ }} mode="agency" />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// AGENCY · Article Tracking
// ============================================================

function AgencyTrackingView({ theme, isMobile, tracking }: { theme: Theme; isMobile: boolean; tracking: ArticleTracking[] }) {
  const totalViews = tracking.reduce((s, t) => s + t.views, 0);
  const indexedCount = tracking.filter((t) => t.indexedGoogle).length;
  const aiCitedCount = tracking.filter((t) => t.citedGPT || t.citedGemini || t.citedPerplexity).length;
  const totalRankedQueries = tracking.reduce((s, t) => s + t.rankedQueries.length, 0);

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${BRAND_BLUE}10 0%, ${BRAND_BLUE}03 100%)`, border: `1px solid ${BRAND_BLUE}30`, borderRadius: 12, padding: isMobile ? 16 : 22, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_BLUE, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Per-Article Tracking</div>
        <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: theme.text, marginBottom: 6 }}>{tracking.length} published articles · {totalRankedQueries} queries currently ranking</div>
        <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>Each ordered article (item) is monitored individually: did it get crawled, did it get indexed, which AI engines cite it, which queries does it rank for. Export a report for your client to prove ROI.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <Kpi label="Total views" value={fmtNum(totalViews)} theme={theme} />
        <Kpi label="Google-indexed" value={`${indexedCount}/${tracking.length}`} theme={theme} />
        <Kpi label="AI-cited" value={`${aiCitedCount}/${tracking.length}`} theme={theme} />
        <Kpi label="Ranking queries" value={String(totalRankedQueries)} theme={theme} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tracking.map((t) => (
          <ArticleTrackingRow key={t.url} tracking={t} theme={theme} isMobile={isMobile} />
        ))}
      </div>

      <div style={{ marginTop: 24, padding: 14, background: `${BRAND_BLUE}08`, border: `1px solid ${BRAND_BLUE}25`, borderRadius: 9, fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>
        <strong style={{ color: BRAND_BLUE }}>Why this matters:</strong> Today, agencies buy articles from publishers without ever knowing if they got picked up. Geoscale ScalePublish monitors every item — if Bank Hapoalim's article on Ynet gets cited by ChatGPT, you can prove it. That converts to repeat purchases.
      </div>
    </div>
  );
}
