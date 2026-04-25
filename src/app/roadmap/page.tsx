"use client";

import { useState, useEffect, useMemo } from "react";

// ============================================================
// ROADMAP — Geoscale Feature Plan (English)
// Modern project-management dashboard layout
// 5 levels, 90 features (78 original + 12 Alexei new requirements)
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
  badgeGrayBg: string;
  badgeGrayText: string;
  badgeTealBg: string;
  badgeTealText: string;
  badgeGreenBg: string;
  badgeGreenText: string;
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
  tableHeaderBg: "#F7F8F9",
  badgeBg: "#F9F9F9",
  inputBg: "#FFFFFF",
  barTrack: "#E5E5E5",
  logoFill: "#141414",
  logoStroke: "#ABABAB",
  badgeGrayBg: "#F0F0F0",
  badgeGrayText: "#727272",
  badgeTealBg: "#E6F9F1",
  badgeTealText: "#0D8F6F",
  badgeGreenBg: "#DCFCE7",
  badgeGreenText: "#15803D",
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
  badgeGrayBg: "#2D333B",
  badgeGrayText: "#8B949E",
  badgeTealBg: "#0D8F6F22",
  badgeTealText: "#3FB68B",
  badgeGreenBg: "#15803D22",
  badgeGreenText: "#4ADE80",
  subtleBg: "#161B22",
};

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

// ── Geoscale Logo ──
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

// ── Mobile Icons ──
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

// ── Mobile Menu Overlay ──
function MobileMenu({ open, onClose, theme, darkMode, setDarkMode }: { open: boolean; onClose: () => void; theme: Theme; darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        background: theme.cardBg, borderBottom: `1px solid ${theme.border}`,
        padding: "16px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <GeoscaleLogoMark size={28} theme={theme} />
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <IconClose color={theme.text} />
          </button>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { href: "/", label: "Dashboard", active: false },
            { href: "/scan", label: "Scans", active: false },
            { href: "/scale-publish", label: "ScalePublish", active: false },
            { href: "/editor", label: "Content Editor", active: false },
            { href: "/roadmap", label: "Roadmap", active: true },
          ].map((item, i) => (
            <a key={i} href={item.href} onClick={onClose} style={{
              display: "block", padding: "14px 0", fontSize: 16,
              fontWeight: item.active ? 600 : 500,
              color: item.active ? theme.text : theme.textSecondary,
              textDecoration: "none", borderBottom: `1px solid ${theme.border}`,
            }}>{item.label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "10px 24px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none", textDecoration: "none", flex: 1, justifyContent: "center" }}>New Scan</a>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
        </div>
      </div>
    </div>
  );
}

// ── Icons ──
function IconChevronDown({ size = 14, rotated = false }: { size?: number; rotated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ transition: "transform 200ms", transform: rotated ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconCheck({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// ── Types ──
type Status = "not_started" | "in_progress" | "done";
type Priority = "P0" | "P1" | "P2";

interface Feature {
  name: string;
  description: string;
  priority: Priority;
  status: Status;
  ref: string;
}

interface Phase {
  id: number;
  title: string;
  features: Feature[];
  color: string;
}

// ── SEO Multi-Query Prompt (for copy) ──
const multiQueryPrompt = `## Multi-Query Architecture (NON-NEGOTIABLE)

Every article must target ONE umbrella keyword AND capture 5-10 related sub-queries within it. Each H2 section should independently answer a distinct search intent that people search for.

### How It Works
1. Before writing: For the given primary keyword, identify 5-10 related sub-queries that users also search. These become your H2 sections.
2. Each H2 = a standalone answer: Every section must be self-contained enough that Google could extract it as a featured snippet or PAA answer for its sub-query.
3. FAQ captures remaining long-tail: The FAQ section at the end targets 3-5 additional queries that didn't fit as H2 sections.

### Sub-Query Mapping Table
Before writing, create this mapping (do NOT include it in the output - this is your internal planning):
| Section (H2) | Sub-Query It Answers | Search Intent Type |
|---|---|---|
| H2 #1 | [related query] | informational / commercial / navigational |
| H2 #2 | [related query] | ... |
| FAQ Q1 | [long-tail query] | ... |

### Rules
- The primary keyword is the umbrella. Sub-queries are naturally related - never force unrelated topics.
- Each H2 section title should reflect its sub-query naturally (not verbatim keyword-stuffed).
- At least 3 of the sub-queries should be different intent types (informational, commercial, comparison, how-to, etc.).
- The article flows as one cohesive piece - readers should NOT feel like they're reading separate articles glued together.
- Include the primary keyword in the opening paragraph AND weave it through at least 2 H2 headings, but the sub-query keywords dominate their respective sections.
- Think of it like an umbrella page: one URL captures traffic from 8-15 different search queries.

### Example
Primary keyword: "therapeutic horseback riding"
| H2 Section | Sub-Query |
|---|---|
| What is therapeutic riding and who is it for | "what is therapeutic horseback riding" |
| Research-proven benefits | "benefits of therapeutic riding" |
| Therapeutic riding for children with ADHD | "therapeutic riding ADHD" |
| Difference between sport and therapeutic riding | "sport vs therapeutic riding" |
| How to choose the right equine therapy center | "how to choose equine therapy" |
| FAQ: cost / minimum age / duration | long-tail queries |`;

// ── Data ──
// Sorted by criticality - NO dates, just priority order
// ref field = where the implementation reference exists
const phases: Phase[] = [
  {
    id: 1,
    title: "Critical - Must Now",
    color: "#10A37F",
    features: [
      { name: "Multi-Query Content Engine", description: "Every article the system generates must include multiple sub-queries under one primary query. Each H2/H3 answers an independent query, FAQ captures additional long-tail", ref: "See full prompt below | Live example: adsgpt.io/blog/social-media-marketing-strategy", priority: "P0", status: "not_started" },
      { name: "Primary Time-Series Chart", description: "Large time-series chart at the top of the scan page: GPT+Gemini mention rate over time, with 7/30/90 day filter buttons", ref: "Demo: /scan -> 'Mention Trend' block | Production: completely missing from scan page", priority: "P0", status: "not_started" },
      { name: "Change Indicator (+/-) on Mention Rate", description: "Green/red arrow + change number next to mention percentage compared to previous scan", ref: "Demo: /scan -> top metric cards (up 2.3%) | Production: shows number only without comparison", priority: "P0", status: "not_started" },
      { name: "Change Indicator (+/-) on Average Position", description: "Green/red arrow + change number next to average position compared to previous scan", ref: "Demo: /scan -> 'Average Position' card | Production: shows number only", priority: "P0", status: "not_started" },
      { name: "Change Indicator (+/-) on Citation Quality", description: "Green/red arrow + change number next to citation quality score compared to previous scan", ref: "Demo: /scan -> 'Citation Quality' card | Production: shows number only", priority: "P0", status: "not_started" },
      { name: "AI Strategy Box - Strategic Recommendations", description: "Yellow/prominent block on scan page with 3-5 recommendations based on scan data: what to do to improve", ref: "Demo: /scan -> 'Recommended AI Strategy' block (yellow) | Production: does not exist", priority: "P0", status: "not_started" },
      { name: "What Worked (Green Block)", description: "Green box with bullet points: positive mentions, citations, queries where the brand appears", ref: "Demo: /scan -> green 'What Works' block | Production: does not exist", priority: "P0", status: "not_started" },
      { name: "What's Missing (Red Block)", description: "Red box with bullet points: queries without mentions, weak areas, missed opportunities", ref: "Demo: /scan -> red 'What's Missing' block | Production: does not exist", priority: "P0", status: "not_started" },
      { name: "AI Summary - ChatGPT Summary", description: "Block with textual summary of what ChatGPT says about the brand in AI responses", ref: "Demo: /scan -> 'ChatGPT says' block with logo | Production: does not exist", priority: "P0", status: "not_started" },
      { name: "AI Summary - Gemini Summary", description: "Block with textual summary of what Gemini says about the brand in AI responses", ref: "Demo: /scan -> 'Gemini says' block with logo | Production: does not exist", priority: "P0", status: "not_started" },
      { name: "SEO-GEO Correlation Table", description: "Table linking traditional keywords to AI queries: keyword, search volume, difficulty, related queries with SEO/GEO toggle", ref: "Demo: /scan -> 'SEO-GEO Correlations' tab | Production: does not exist", priority: "P0", status: "not_started" },
      { name: "Brand Logo Instead of Percentage Circle", description: "In scans/dashboard screens - replace the percentage circle next to brand name with the brand's logo (favicon/logo from domain)", ref: "Production: scale.geoscale.ai -> dashboard + scan list - the percentage circle next to brand name", priority: "P0", status: "not_started" },
      { name: "Tooltips on Every Metric", description: "Info icon (i) next to every number and metric with a popup explaining what the metric means and how it's calculated", ref: "Demo: /scan -> every metric card has (i) with hover | Production: no tooltips at all", priority: "P0", status: "not_started" },
      // Alexei NEW requirements - Level 1
      { name: "Mobile Responsiveness", description: "All pages must be fully mobile-responsive (logo, menu, layout, tables)", ref: "All pages: dashboard, scan, scale-publish, editor, roadmap", priority: "P0", status: "not_started" },
      { name: "Design Tokens System", description: "Single design tokens file for colors, typography, spacing across all pages", ref: "New system-wide file: tokens.ts or CSS variables", priority: "P0", status: "not_started" },
      { name: "Plan Builder Demo Flow", description: "End-to-end flow: scope selection -> publisher picking -> SEO/GEO per article -> quote with publisher logos", ref: "New full flow spanning scan + scale-publish + quote pages", priority: "P0", status: "not_started" },
      { name: "Brand/Non-Brand Mention Split", description: "Reputation Risk must separate branded vs non-branded query mention rates", ref: "Scan page -> Reputation Risk section: split by brand vs non-brand queries", priority: "P0", status: "not_started" },
      // New requirements from 2026-04-25 review with Nir
      { name: "Full-Width Responsive Charts", description: "All line/area charts must measure parent container width via ResizeObserver and render at full container width. Fixed-viewBox SVGs with preserveAspectRatio='meet' letterbox to ~76% width and look broken on wide screens", ref: "Demo: /scan -> Mention rate over time, SEO performance | Production: charts that don't fill the card", priority: "P0", status: "not_started" },
      { name: "Refined Color Palette - No Harsh Red", description: "Replace all #DC2626 (harsh red) with warm amber #B45309. Soften reputation risk styling - use amber sparingly as accent, not dominant color across whole sections", ref: "Demo: /scan, /dashboard - amber accents | Production: bright red on every reputation/risk element looks alarming, not professional", priority: "P0", status: "not_started" },
      { name: "Horizontal Brand Header on Scan Pages", description: "Compact horizontal header: logo + brand name + clickable URL + 1-line description on the left; GEO Score pill (ring + 'XX / 100') + Re-scan button on the right. No vertical-stack centered design", ref: "Demo: /scan -> top of every tab | Production: scan page header layout", priority: "P0", status: "not_started" },
      { name: "Mobile-Friendly Tooltips (Tap-to-Open)", description: "Tooltips must work on mobile: tap to open, tap outside to dismiss. Edge-clamping so tooltip doesn't overflow viewport. Larger tap target via padding/margin trick", ref: "Demo: /scan -> Tooltip component on every (i) icon | Production: tooltips broken or invisible on mobile", priority: "P0", status: "not_started" },
      { name: "Site SEO Metrics Card on Overview", description: "Ahrefs-style 6-column metrics card at top of scan overview: Domain Rating, Organic Traffic, Ranking Keywords, Backlinks, Ref Domains, Indexed Pages. Three of them are clickable to drilldown pages", ref: "Demo: /scan -> 'Site SEO Metrics' block | Production: missing entirely", priority: "P0", status: "not_started" },
      { name: "Keywords Drilldown Page", description: "Dedicated /keywords-detail page reachable from SEO Metrics: full keyword list with position, volume, KD, CPC, traffic, URL, trend. Position color pills (green ≤3, orange ≤10, gray >10)", ref: "Demo: /keywords-detail | Production: missing", priority: "P0", status: "not_started" },
      { name: "Traffic Drilldown Page", description: "Dedicated /traffic-detail page reachable from SEO Metrics: traffic distribution stacked bar, page-level breakdown (URL, title, traffic, top keyword, position, trend)", ref: "Demo: /traffic-detail | Production: missing", priority: "P0", status: "not_started" },
      { name: "Backlinks Drilldown Page", description: "Dedicated /backlinks-detail page reachable from SEO Metrics: backlink list, dofollow/nofollow filter, DR colored (green ≥80, teal 60-79, gray 40-59), Israeli site favicons", ref: "Demo: /backlinks-detail | Production: missing", priority: "P0", status: "not_started" },
      { name: "Subtle Font-Weight System (No Excessive Bold)", description: "Use 400 for body, 500 for labels/numbers, 600 only for active nav/CTAs/active tabs/H1. NEVER 700+. Color emphasis (green #10A37F, amber #B45309) replaces bold weight emphasis", ref: "Demo: all pages | Production: too much fontWeight 700 everywhere - feels heavy per Alexei", priority: "P0", status: "not_started" },
      { name: "Full-Width Graph Layout (No 50/50 Split for Charts)", description: "Chart-containing cards must stack vertically full-width, not split 1fr 1fr. AI engine comparison, Persona+Competitors, Sentiment+Citation must each span the entire row. Donut charts get lost in narrow halves - replace with horizontal stacked bars", ref: "Demo: /scan -> all chart sections | Production: charts compressed to 50% width", priority: "P0", status: "not_started" },
      // Citation Sources (Alexei) - 2026-04-25
      { name: "Citation Sources Table (Brand + Each Competitor)", description: "Reveal the exact third-party domains AI engines pull from when they cite a brand. Tab bar switches between brand + each competitor; per-row data: domain, type pill (Publication/Social/News/Blog/Review/Forum), URL count, which engines cite (ChatGPT/Gemini/Perplexity opacity-greyed when not cited). This is GEO's answer to backlinks - tells the user 'where to seed content/PR/guest posts/Reddit-Quora-G2 to enter AI answer sets'", ref: "Demo: /scan -> Citation Sources card under Competitors | Production: missing entirely - Alexei flagged 2026-04-25 (CITATIONS.png)", priority: "P0", status: "not_started" },
      { name: "Connect Citation Sources to Article Placement Flow", description: "From Citation Sources table, 'Plan article placement' link routes to /scale-publish prefilled with the cited publishers. Closes the loop: see where competitors get cited -> order articles on those exact sources via Geoscale's publisher network. This is the monetization wedge - external article ordering becomes data-driven, not blind", ref: "Demo: /scan -> Citation Sources -> 'Plan article placement' -> /scale-publish | Production: scale-publish picker has no input from citation data", priority: "P0", status: "not_started" },
      { name: "Backlinks Visibility Inside Geoscale (Not Just SEO Sidebar)", description: "Surface traditional backlinks AS PART of the GEO narrative - not buried as a single number in Site SEO Metrics. Show: top referring domains, anchor text breakdown, dofollow/nofollow split, gained/lost trend. Backlinks remain a strong AI training-data signal so they belong inside the GEO playbook, parallel to citation sources", ref: "Demo: /backlinks-detail (basic) -> needs richer integration on /scan | Production: backlinks invisible in GEO context - Alexei flagged 2026-04-25", priority: "P0", status: "not_started" },
    ],
  },
  {
    id: 2,
    title: "Important - Impacts Experience & Sales",
    color: "#10A37F",
    features: [
      { name: "Competitor Analysis - Horizontal Bar Chart", description: "Horizontal bar chart of 4-5 competitors with mention percentage, name and domain next to each", ref: "Demo: /scan -> 'Competitor Analysis' block with colored bars | Production: no competitor comparison at all", priority: "P0", status: "not_started" },
      { name: "Donut Chart - Sentiment", description: "Donut chart showing sentiment distribution: positive (green), neutral (gray), negative (red)", ref: "Demo: /scan -> donut in 'Sentiment' block | Production: simple bar only", priority: "P1", status: "not_started" },
      { name: "Donut Chart - Citation Quality", description: "Donut chart showing citation quality distribution: high, medium, low", ref: "Demo: /scan -> donut in 'Citation Quality' block | Production: simple bar only", priority: "P1", status: "not_started" },
      { name: "Product/Service Tags in Products Tab", description: "In products tab: product/service badge on each identified item", ref: "Production: /scan -> 'Products/Services' tab -> currently 'No products identified'", priority: "P1", status: "not_started" },
      { name: "B2C/B2B Tags in Products Tab", description: "In products tab: B2C or B2B badge on each item by audience type", ref: "Production: /scan -> 'Products/Services' tab", priority: "P1", status: "not_started" },
      { name: "Automatic Brand Logo Pull", description: "Automatic favicon/logo retrieval from the brand's domain during scanning", ref: "New - not in demo or production | Google Favicon API: google.com/s2/favicons?domain=X", priority: "P1", status: "not_started" },
      { name: "Automatic Product Image Pull", description: "Automatic product image retrieval from the brand's website via scraping/OG tags", ref: "New - not in demo or production | og:image meta tag from website", priority: "P1", status: "not_started" },
      { name: "Hover Effects on Buttons and Cards", description: "Every button and card should respond to hover with smooth color/shadow change", ref: "Demo: exists on most elements | Production: feels static - missing on most buttons", priority: "P1", status: "not_started" },
      { name: "Hover Effects on Table Rows", description: "Every row in tables (queries, audiences) should respond to hover with background highlight", ref: "Demo: rows respond to hover | Production: static tables", priority: "P1", status: "not_started" },
      { name: "Content Editor - WYSIWYG", description: "WYSIWYG interface for editing system-generated articles, with preview", ref: "Demo: /editor -> full editor | Production: /scan -> 'Content' tab -> only 'Create content ideas'", priority: "P1", status: "not_started" },
      { name: "Direct Publish from Editor", description: "'Publish' button in content editor that sends directly to target site (WordPress API / custom)", ref: "New - not in demo or production", priority: "P1", status: "not_started" },
      { name: "7-Day Filter", description: "7-day filter button for all data and charts", ref: "Demo: /scan -> 7/30/90 buttons on trend chart | Production: no time filtering", priority: "P1", status: "not_started" },
      { name: "30-Day Filter", description: "30-day filter button for all data and charts", ref: "Demo: /scan -> 7/30/90 buttons | Production: no time filtering", priority: "P1", status: "not_started" },
      { name: "90-Day Filter", description: "90-day filter button for all data and charts", ref: "Demo: /scan -> 7/30/90 buttons | Production: no time filtering", priority: "P1", status: "not_started" },
      { name: "Custom Date Range Filter", description: "Date picker with from/to for filtering data in a custom range", ref: "New - not in demo or production", priority: "P1", status: "not_started" },
      { name: "Reputation Alerts - Red Coloring", description: "Automatic red coloring on table rows when there is lack of mention or sharp decline", ref: "Production: query table -> rows with 'missing' are not highlighted at all", priority: "P1", status: "not_started" },
      { name: "Reputation Alerts - Rejected Sites", description: "Red coloring on rejected or low-reputation sites", ref: "New - relevant to ScalePublish tab", priority: "P1", status: "not_started" },
      { name: "Combined SEO+GEO Dashboard", description: "Unified dashboard screen with toggle: AI queries <-> traditional keywords, positions, search volume", ref: "Production: /dashboard -> shows only GEO | Demo: /scan -> has SEO/GEO toggle", priority: "P1", status: "not_started" },
      { name: "Quote - SEO Only Option", description: "Pricing option for SEO only: keywords, content, backlinks", ref: "New - not in demo or production", priority: "P1", status: "not_started" },
      { name: "Quote - GEO Only Option", description: "Pricing option for GEO only: AI optimization, brand mentions, citations", ref: "New - not in demo or production", priority: "P1", status: "not_started" },
      { name: "Quote - Combined Package", description: "Combined SEO+GEO package with 15% discount, visual comparison to separate options", ref: "New - not in demo or production", priority: "P1", status: "not_started" },
      { name: "Expand to 10 Personas Per Brand", description: "Expand persona system from 5 to 10 personas with unique queries for each", ref: "Production: /scan -> 'Audiences' tab -> currently 5 personas | Demo: 5 personas", priority: "P1", status: "not_started" },
      { name: "Per-Site Queries in ScalePublish Cart", description: "In cart: for each selected site, display relevant queries that content should target", ref: "Demo: /scale-publish -> cart with sites | Production: no ScalePublish", priority: "P1", status: "not_started" },
      // Alexei NEW requirements - Level 2
      { name: "Content Creation -> Ordering Flow", description: "Content creation ties to article ordering, 'own site vs external' choice", ref: "New flow: scan -> content tab -> order article -> choose own site or publisher", priority: "P1", status: "not_started" },
      { name: "Keywords Historical Data", description: "DB schema for daily/weekly snapshots, date filter, avoid re-fetching via API", ref: "New DB table: keyword_snapshots with brand_id, keyword, position, date", priority: "P1", status: "not_started" },
      { name: "Competitors Page Redesign", description: "Match SimilarWeb/Semrush competitor UI with SEO+GEO separation", ref: "Redesign /scan -> competitors section with tabbed SEO vs GEO view", priority: "P1", status: "not_started" },
      { name: "Overview Insights Reorder", description: "Data tables at top, content/writing insights at bottom (like GA4)", ref: "Scan page -> Overview tab: reorder sections", priority: "P1", status: "not_started" },
    ],
  },
  {
    id: 3,
    title: "Improvement - Adds Significant Value",
    color: "#10A37F",
    features: [
      { name: "Bing Chat / Copilot Scanning", description: "Add Bing Chat/Copilot as an additional AI engine for scanning", ref: "New - currently only GPT + Gemini", priority: "P1", status: "not_started" },
      { name: "Perplexity Scanning", description: "Add Perplexity as an additional AI engine for scanning", ref: "New - logo already exists: /public/logos/perplexity.svg", priority: "P1", status: "not_started" },
      { name: "Claude Scanning", description: "Add Claude as an additional AI engine for scanning", ref: "New - requires Anthropic API access", priority: "P1", status: "not_started" },
      { name: "SEO Dashboard - Keyword Rankings", description: "Standalone SEO dashboard: keyword table with position, volume, difficulty", ref: "New - separate from GEO | Connect to GSC API / Ahrefs API", priority: "P1", status: "not_started" },
      { name: "SEO Dashboard - Organic Traffic", description: "Organic traffic chart over time, connected to Google Search Console", ref: "New - connect to GSC API", priority: "P1", status: "not_started" },
      { name: "Automatic Quote - PDF", description: "PDF generation from work plan: 3 levels (aggressive/medium/conservative), pricing breakdown", ref: "Production: /scan -> 'Work Plan' tab -> has plan but no PDF export", priority: "P1", status: "not_started" },
      { name: "Send Quote to Client", description: "'Send to client' button that emails the PDF to the client directly from the system", ref: "New - on top of PDF export", priority: "P1", status: "not_started" },
      { name: "Article Recommendation Engine", description: "Automatic recommendation for weekly/monthly article count based on budget and goals", ref: "New - based on scan data + work plan", priority: "P1", status: "not_started" },
      { name: "ScalePublish - Publisher List", description: "Publisher table with rating, category, price, DR, status", ref: "Demo: /scale-publish -> table with publishers | Production: does not exist", priority: "P1", status: "not_started" },
      { name: "ScalePublish - Shopping Cart", description: "Shopping cart for selecting publishing sites with price and quantity summary", ref: "Demo: /scale-publish -> shopping cart | Production: does not exist", priority: "P1", status: "not_started" },
      { name: "ScalePublish - Ratings & Reviews", description: "Star rating and review system for publishers from agencies", ref: "Demo: /scale-publish -> stars next to each publisher | Production: does not exist", priority: "P1", status: "not_started" },
      { name: "Automatic SEO Rating for Publishers", description: "Check publishers against DataForSEO/Ahrefs: DR, keywords, organic traffic, Google index", ref: "New - API: DataForSEO domain_metrics + Ahrefs domain_rating", priority: "P1", status: "not_started" },
      { name: "Automatic GEO Rating for Publishers", description: "Check publisher appearances in ChatGPT, Gemini, Bing Chat on relevant queries", ref: "New - use Geoscale scanning engine on publisher domain", priority: "P1", status: "not_started" },
      { name: "Automatic Publisher Categorization", description: "AI-based categorization of publisher sites by topic + manual edit capability", ref: "New - LLM classification on publisher meta/content", priority: "P1", status: "not_started" },
      { name: "External Publishing - Target Site Selection", description: "In content tab: select target publisher site for article publication", ref: "Production: /scan -> 'Content' tab -> currently only 'Create ideas' | needs full workflow", priority: "P1", status: "not_started" },
      { name: "External Publishing - Content Upload", description: "Article upload workflow to publisher site: API/email/manual", ref: "New - on top of target site selection", priority: "P1", status: "not_started" },
      { name: "External Publishing - Status Tracking", description: "Publication status tracking: pending, published, rejected - with timestamps", ref: "New - status table", priority: "P1", status: "not_started" },
      { name: "Export Scan as PDF", description: "Export button for formatted PDF of scan page", ref: "Production: /scan -> 'Overview' tab -> no export button", priority: "P1", status: "not_started" },
      { name: "Export Queries as CSV", description: "Export button for queries table as CSV", ref: "Production: /scan -> 'Queries' tab -> no export button", priority: "P1", status: "not_started" },
      { name: "Export Audiences as CSV", description: "Export button for audiences/personas table as CSV", ref: "Production: /scan -> 'Audiences' tab -> no export button", priority: "P1", status: "not_started" },
      { name: "Share Report with Client - Invitation", description: "Client invitation interface for viewing their reports: enter email, send link", ref: "New - requires permission system", priority: "P1", status: "not_started" },
      { name: "Share Report with Client - White Label", description: "Read-only client view with agency logo and custom branding", ref: "New - requires theming + branding settings", priority: "P1", status: "not_started" },
      { name: "Email Alerts on Changes", description: "Automatic email when mentions drop, new competitor appears, or negative mention detected", ref: "New - requires email service (SendGrid/Resend) + trigger logic", priority: "P1", status: "not_started" },
      { name: "SMS Alerts on Changes", description: "Automatic SMS for critical changes (sharp decline, negative mention)", ref: "New - requires SMS service (Twilio) + trigger logic", priority: "P1", status: "not_started" },
      // Alexei NEW requirements - Level 3
      { name: "Marketplace Content Types", description: "SEO only / GEO only / SEO+GEO selection per publisher", ref: "ScalePublish -> publisher cards: add content type selector", priority: "P1", status: "not_started" },
      { name: "Publisher Discount Pricing", description: "Add sale/discount price option to publisher cards", ref: "ScalePublish -> publisher cards: show original + discounted price", priority: "P1", status: "not_started" },
      { name: "Products & Services Images", description: "Pull images from brand websites, add to product cards", ref: "Scan -> Products tab: scrape og:image / product images from brand site", priority: "P1", status: "not_started" },
      { name: "Tooltip System", description: "Every data point gets (i) icon with explanation tooltip, mobile-friendly tap targets", ref: "System-wide: reusable Tooltip component with mobile touch support", priority: "P1", status: "not_started" },
    ],
  },
  {
    id: 4,
    title: "Infrastructure - Required for Next Stages",
    color: "#10A37F",
    features: [
      { name: "DB Schema - Publishers Table", description: "DB schema: domain, DR, metrics, category, pricing, status, created_at, updated_at", ref: "New - prerequisite for ScalePublish | Supabase/Postgres", priority: "P0", status: "not_started" },
      { name: "DB Schema - Work Plans Table", description: "DB schema: brand_id, duration, speed, articles_count, budget, status", ref: "Production: /scan -> 'Work Plan' tab -> has UI but needs DB schema", priority: "P0", status: "not_started" },
      { name: "API - CRUD Publishers", description: "REST endpoints: GET/POST/PUT/DELETE /api/publishers - infrastructure for ScalePublish", ref: "New - Next.js API routes | prerequisite for ScalePublish UI", priority: "P0", status: "not_started" },
      { name: "Publisher Entry Interface", description: "Admin dashboard: manual entry + Excel upload, pricing management", ref: "New - admin panel | prerequisite for ScalePublish", priority: "P0", status: "not_started" },
      { name: "Standalone Publishers Portal", description: "Separate publisher interface: add sites, revenue dashboard, agencies that viewed/bought", ref: "New - requires separate UX spec + auth system", priority: "P1", status: "not_started" },
    ],
  },
  {
    id: 5,
    title: "Future - Nice to Have",
    color: "#727272",
    features: [
      { name: "Geoscale Logo - Match Website", description: "Update logo across all screens to exactly match the logo at geoscale.ai", ref: "Website: geoscale.ai -> header logo | Production: scale.geoscale.ai -> different logo", priority: "P2", status: "not_started" },
      { name: "Rejected Sites Repository", description: "Store rejected sites + rejection reasons + future re-check capability", ref: "New - on top of ScalePublish system", priority: "P2", status: "not_started" },
      { name: "Publisher Terms - Terms of Service", description: "Publisher contract with terms of service and no-price-change clause", ref: "New - requires legal consultation", priority: "P2", status: "not_started" },
      { name: "Publisher Terms - Digital Signature", description: "Digital signature mechanism for terms within Publishers Portal", ref: "New - DocuSign API / custom", priority: "P2", status: "not_started" },
      { name: "Agency Markup - Profit Margins", description: "Interface for managing 15-20% profit margins on publisher prices", ref: "New - settings UI | on top of ScalePublish pricing", priority: "P2", status: "not_started" },
      { name: "Agency Markup - Manual Editing", description: "Ability to manually edit final price per-publisher with rounding", ref: "New - on top of Agency Markup", priority: "P2", status: "not_started" },
      { name: "Analytics for Publishers", description: "Extended publisher dashboard: agencies that viewed/bought, revenue, detailed statistics", ref: "New - on top of Publishers Portal", priority: "P2", status: "not_started" },
      { name: "Mobile Responsive - Dashboard", description: "Adapt dashboard screen for mobile and tablet", ref: "Production: scale.geoscale.ai/dashboard -> not responsive", priority: "P2", status: "not_started" },
      { name: "Mobile Responsive - Scans", description: "Adapt scan screens and query tables for mobile", ref: "Production: scale.geoscale.ai/scan -> tables not responsive", priority: "P2", status: "not_started" },
      { name: "Mobile Responsive - Charts", description: "Adapt all charts (time-series, donut, bar) for mobile", ref: "New - on top of charts to be built", priority: "P2", status: "not_started" },
      { name: "Multi-Language - Hebrew/English Toggle", description: "Language toggle button in the interface with full text translation", ref: "Currently: separate demo for each language (demo-geoscale / demo-geoscale-en)", priority: "P2", status: "not_started" },
      { name: "Multi-Language - Translated Reports", description: "Export reports in client's chosen language (Hebrew/English)", ref: "New - on top of PDF/CSV export", priority: "P2", status: "not_started" },
      { name: "API Usage Dashboard", description: "Track credits, API calls, rate limiting with charts", ref: "Production: 'API usage' link in footer -> leads to empty page", priority: "P2", status: "not_started" },
    ],
  },
];

// ── Status Badge Component ──
function StatusBadge({ status, theme }: { status: Status; theme: Theme }) {
  if (status === "done") {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 13, fontWeight: 500, color: theme.badgeGreenText,
        background: theme.badgeGreenBg, padding: "3px 10px", borderRadius: 20,
        whiteSpace: "nowrap",
      }}>
        <IconCheck size={11} /> Done
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 13, fontWeight: 500, color: theme.badgeTealText,
        background: theme.badgeTealBg, padding: "3px 10px", borderRadius: 20,
        whiteSpace: "nowrap",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: "#10A37F", display: "inline-block" }} />
        In Progress
      </span>
    );
  }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 13, fontWeight: 500, color: theme.badgeGrayText,
      background: theme.badgeGrayBg, padding: "3px 10px", borderRadius: 20,
      whiteSpace: "nowrap",
    }}>
      Not started
    </span>
  );
}

// ── Priority label ──
function PriorityLabel({ priority, theme }: { priority: Priority; theme: Theme }) {
  const labels: Record<Priority, string> = { P0: "Critical", P1: "High", P2: "Normal" };
  const colors: Record<Priority, string> = { P0: "#10A37F", P1: "#10A37F", P2: theme.textSecondary };
  return (
    <span style={{ fontSize: 13, fontWeight: 500, color: colors[priority] }}>
      {labels[priority]}
    </span>
  );
}

// ── Stat Card ──
function StatCard({ label, value, subtext, theme, accent }: { label: string; value: string | number; subtext?: string; theme: Theme; accent?: boolean }) {
  return (
    <div style={{
      border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg,
      padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4, minWidth: 0,
    }}>
      <span style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 26, fontWeight: 500, color: accent ? "#10A37F" : theme.text, lineHeight: 1.2 }}>{value}</span>
      {subtext && <span style={{ fontSize: 13, color: theme.textMuted }}>{subtext}</span>}
    </div>
  );
}

// ── Progress Bar ──
function ProgressBar({ pct, theme, height = 6 }: { pct: number; theme: Theme; height?: number }) {
  return (
    <div style={{ width: "100%", height, borderRadius: height / 2, background: theme.barTrack, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: height / 2, background: "#10A37F", transition: "width 400ms ease" }} />
    </div>
  );
}

// ── Level Section ──
function LevelSection({ phase, theme, defaultExpanded }: { phase: Phase; theme: Theme; defaultExpanded: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const total = phase.features.length;
  const doneCount = phase.features.filter(f => f.status === "done").length;
  const inProgressCount = phase.features.filter(f => f.status === "in_progress").length;
  const pct = total > 0 ? Math.round(((doneCount + inProgressCount * 0.5) / total) * 100) : 0;

  // Truncate description
  const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max) + "..." : s;

  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg, overflow: "hidden" }}>
      {/* Section header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 16,
          padding: "16px 20px", background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Color bar */}
        <div style={{ width: 4, height: 36, borderRadius: 2, background: phase.color, flexShrink: 0 }} />

        {/* Title + progress */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18, fontWeight: 500, color: theme.text }}>
              Level {phase.id}
            </span>
            <span style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary }}>
              {phase.title}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, maxWidth: 200 }}>
              <ProgressBar pct={pct} theme={theme} height={4} />
            </div>
            <span style={{ fontSize: 13, color: theme.textSecondary, whiteSpace: "nowrap" }}>{pct}% complete</span>
          </div>
        </div>

        {/* Counts */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>
            {total} feature{total !== 1 ? "s" : ""}
          </span>
          {doneCount > 0 && (
            <span style={{ fontSize: 13, color: theme.badgeGreenText, fontWeight: 500 }}>{doneCount} done</span>
          )}
          {inProgressCount > 0 && (
            <span style={{ fontSize: 13, color: "#10A37F", fontWeight: 500 }}>{inProgressCount} in progress</span>
          )}
        </div>

        {/* Chevron */}
        <div style={{ color: theme.textMuted, flexShrink: 0 }}>
          <IconChevronDown size={16} rotated={expanded} />
        </div>
      </button>

      {/* Feature table */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${theme.border}`, overflowX: "auto" }}>
          {/* Table header */}
          <div
            className="roadmap-table-header"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(180px, 2fr) minmax(200px, 3fr) minmax(80px, 0.7fr) minmax(90px, 0.8fr) minmax(160px, 2fr)",
              gap: 8, padding: "8px 20px", background: theme.tableHeaderBg,
            }}
          >
            {["Feature", "Description", "Priority", "Status", "Implementation"].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 500, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {phase.features.map((f, i) => (
            <div
              key={i}
              className="roadmap-table-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(180px, 2fr) minmax(200px, 3fr) minmax(80px, 0.7fr) minmax(90px, 0.8fr) minmax(160px, 2fr)",
                gap: 8, padding: "10px 20px",
                borderTop: i > 0 ? `1px solid ${theme.border}` : "none",
                transition: "background 120ms",
                alignItems: "center",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = theme.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 14, fontWeight: 500, color: theme.text, lineHeight: 1.4 }}>{f.name}</span>
              <span style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.5 }}>{truncate(f.description, 120)}</span>
              <PriorityLabel priority={f.priority} theme={theme} />
              <StatusBadge status={f.status} theme={theme} />
              <span style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.4, fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace" }}>{truncate(f.ref, 80)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ── Main Page ──
export default function RoadmapPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile(768);

  useEffect(() => {
    const saved = localStorage.getItem("geoscale-dark-mode");
    if (saved === "true") setDarkMode(true);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("geoscale-dark-mode", darkMode.toString());
    }
  }, [darkMode, isHydrated]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  // Compute global stats
  const stats = useMemo(() => {
    const allFeatures = phases.flatMap(p => p.features);
    const total = allFeatures.length;
    const done = allFeatures.filter(f => f.status === "done").length;
    const inProgress = allFeatures.filter(f => f.status === "in_progress").length;
    const notStarted = allFeatures.filter(f => f.status === "not_started").length;
    const pct = total > 0 ? Math.round(((done + inProgress * 0.5) / total) * 100) : 0;
    return { total, done, inProgress, notStarted, pct };
  }, []);

  // Avoid hydration mismatch
  if (!isHydrated) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", display: "flex", flexDirection: "column", color: theme.text }}>
      {/* -- Responsive CSS -- */}
      <style>{`
        @media (max-width: 768px) {
          .roadmap-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .roadmap-header-inner { grid-template-columns: 1fr !important; gap: 8px !important; height: auto !important; padding: 8px 16px !important; }
          .roadmap-table-header, .roadmap-table-row {
            grid-template-columns: 1fr !important;
            gap: 4px !important;
          }
          .roadmap-table-header { display: none !important; }
          .roadmap-table-row {
            display: flex !important; flex-direction: column !important;
            gap: 6px !important; padding: 12px 16px !important;
          }
          .roadmap-footer-inner { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
          .roadmap-footer-links { flex-wrap: wrap !important; justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .roadmap-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Header */}
      {/* Mobile Menu Overlay */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />

      <header className="sticky top-0 z-50" style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}`, backdropFilter: "blur(12px)" }}>
        {isMobile ? (
          <div style={{ padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <IconHamburger color={theme.text} />
            </button>
            <GeoscaleLogoMark size={32} theme={theme} />
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>
        ) : (
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
            {/* LEFT = Logo */}
            <div style={{ justifySelf: "start" }}>
              <GeoscaleLogo theme={theme} />
            </div>
            {/* CENTER = Nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <a href="/" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Dashboard</a>
              <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
              <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>ScalePublish</a>
              <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
              <a href="/roadmap" style={{ fontSize: 15, fontWeight: 600, color: theme.text, textDecoration: "none" }}>Roadmap</a>
            </nav>
            {/* RIGHT = Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "end" }}>
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
              <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: darkMode ? "1px solid #E6EDF3" : "1px solid #000", textDecoration: "none" }}>New Scan</a>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main style={{ flex: 1, maxWidth: 1300, margin: "0 auto", padding: isMobile ? "20px 12px 32px" : "32px 24px 48px", width: "100%", minWidth: 0, boxSizing: "border-box" }} dir="ltr">
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: theme.text, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>
            Feature Roadmap
          </h1>
          <p style={{ fontSize: 14, color: theme.textSecondary, margin: 0 }}>
            Production tasks for scale.geoscale.ai &mdash; use this demo as a visual reference for each feature. &quot;Implementation&quot; column shows where to find the demo preview.
          </p>
        </div>

        {/* Summary Stats Row */}
        <div className="roadmap-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
          <StatCard label="Total Features" value={stats.total} theme={theme} />
          <StatCard label="Completion" value={`${stats.pct}%`} theme={theme} accent />
          <StatCard label="Done" value={stats.done} subtext={`of ${stats.total}`} theme={theme} />
          <StatCard label="In Progress" value={stats.inProgress} subtext={`of ${stats.total}`} theme={theme} />
          <StatCard label="Not Started" value={stats.notStarted} subtext={`of ${stats.total}`} theme={theme} />
        </div>

        {/* Overall progress bar */}
        <div style={{ marginBottom: 32, padding: "0 2px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: theme.textSecondary }}>Overall Progress</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#10A37F" }}>{stats.pct}%</span>
          </div>
          <ProgressBar pct={stats.pct} theme={theme} height={8} />
        </div>

        {/* Level Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
          {phases.map(phase => (
            <LevelSection key={phase.id} phase={phase} theme={theme} defaultExpanded={phase.id === 1} />
          ))}
        </div>

        {/* Multi-Query SEO Prompt - Copy Section */}
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.subtleBg, padding: 24, direction: "ltr", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#10A37F18", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: theme.text, margin: 0 }}>Multi-Query Content Writing Prompt</h3>
          </div>
          <p style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>
            This prompt needs to be added to Geoscale&apos;s content writing engine. Every article targets one primary query + 5-10 sub-queries. Each H2 answers a separate search intent, and the FAQ captures additional long-tail queries. One URL captures traffic from 8-15 different queries.
          </p>
          <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 14, lineHeight: 1.6 }}>
            <strong>Live example:</strong> See how adsgpt.io structures their articles -- <span style={{ color: "#10A37F" }}>adsgpt.io/blog/social-media-marketing-strategy</span>
          </p>
          <details style={{ cursor: "pointer" }}>
            <summary style={{ fontSize: 14, fontWeight: 500, color: "#10A37F", marginBottom: 10, userSelect: "none" }}>
              Show full prompt
            </summary>
            <div style={{ background: darkMode ? "#0D1117" : "#1a1a2e", borderRadius: 8, padding: 20, overflow: "auto", maxHeight: 400 }}>
              <pre style={{ fontSize: 13, color: "#e0e0e0", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", fontFamily: "'Courier New', monospace", direction: "ltr", textAlign: "left" }}>
                {multiQueryPrompt}
              </pre>
            </div>
          </details>
        </div>

        {/* Dependencies & Risks */}
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg, padding: 24, direction: "ltr" }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, color: theme.text, marginBottom: 14 }}>Dependencies & Risks</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { text: "Multi-Query prompt requires Alexei's approval before integration into production system", critical: true },
              { text: "All visual features (charts, tooltips, alerts) are ready in the demo - only need migration to production", critical: true },
              { text: "Access to DataForSEO/Ahrefs API for publisher ranking system and SEO dashboard", critical: false },
              { text: "Publishers Portal requires separate UX spec + legal terms", critical: false },
              { text: "Expanding AI engines (Perplexity, Claude, Bing) depends on API access and pricing", critical: false },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: item.critical ? "#B45309" : "#10A37F", display: "inline-block", marginTop: 6, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${theme.border}` }}>
        <div className="roadmap-footer-inner" style={{ maxWidth: 1300, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }} dir="ltr">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <GeoscaleLogoMark size={24} theme={theme} />
            <span style={{ fontSize: 13, color: theme.textSecondary }}>Powered by advanced AI to analyze your search presence</span>
          </div>
          <div className="roadmap-footer-links" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {["Feedback", "Report a bug", "Improvement ideas", "API usage"].map((label, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 500, color: "#10A37F", background: "#10A37F12", padding: "4px 12px", borderRadius: 20, cursor: "pointer" }}>
                {label}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 12, color: theme.textMuted }}>GeoScale 2026 &copy;</span>
        </div>
      </footer>
    </div>
  );
}
