"use client";

import { useState, useEffect } from "react";

// ============================================================
// ROADMAP — Geoscale Feature Plan (English)
// Criticality-based structure matching Hebrew version
// 5 levels, 68 features, all not_started
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
    color: "#DC2626",
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
    ],
  },
  {
    id: 2,
    title: "Important - Impacts Experience & Sales",
    color: "#E07800",
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
    ],
  },
  {
    id: 4,
    title: "Infrastructure - Required for Next Stages",
    color: "#4285F4",
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

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  P0: { label: "P0 - Critical", color: "#DC2626", bg: "#DC262612" },
  P1: { label: "P1 - Important", color: "#E07800", bg: "#E0780012" },
  P2: { label: "P2 - Normal", color: "#727272", bg: "#72727212" },
};

const statusConfig: Record<Status, { label: string; color: string }> = {
  not_started: { label: "Not started", color: "#DC2626" },
  in_progress: { label: "In progress", color: "#E07800" },
  done: { label: "Done", color: "#10A37F" },
};

// ── Components ──

function StatusDot({ status }: { status: Status }) {
  const cfg = statusConfig[status];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: cfg.color, display: "inline-block", flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: cfg.color, fontWeight: 500 }}>{cfg.label}</span>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority];
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  );
}

function PhaseCard({ phase, theme }: { phase: Phase; theme: Theme }) {
  const [expanded, setExpanded] = useState(phase.id === 1);
  const featureCount = phase.features.length;
  const inProgressCount = phase.features.filter(f => f.status === "in_progress").length;
  const doneCount = phase.features.filter(f => f.status === "done").length;
  const progressPct = featureCount > 0 ? Math.round(((doneCount + inProgressCount * 0.5) / featureCount) * 100) : 0;

  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg, overflow: "hidden" }}>
      {/* Phase Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
          alignItems: "center",
          gap: 16,
          padding: "18px 24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          direction: "ltr",
          textAlign: "left",
        }}
      >
        {/* Phase indicator */}
        <div style={{ width: 6, height: 40, borderRadius: 3, background: phase.color, flexShrink: 0 }} />

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>Level {phase.id}: {phase.title}</span>
          </div>
          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
            <div style={{ width: 120, height: 4, borderRadius: 2, background: theme.barTrack, overflow: "hidden" }}>
              <div style={{ width: `${progressPct}%`, height: "100%", borderRadius: 2, background: phase.color, transition: "width 300ms" }} />
            </div>
            <span style={{ fontSize: 11, color: theme.textSecondary }}>{progressPct}%</span>
          </div>
        </div>

        {/* Feature count */}
        <span style={{ fontSize: 13, color: theme.textSecondary }}>{featureCount} features</span>

        {/* Chevron */}
        <div style={{ color: theme.textMuted }}>
          <IconChevronDown size={16} rotated={expanded} />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${theme.border}` }}>
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 2.5fr 2.5fr 0.8fr 0.8fr",
              gap: 12,
              padding: "10px 24px 10px 24px",
              background: theme.tableHeaderBg,
              direction: "ltr",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: "uppercase" }}>Feature</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: "uppercase" }}>Description</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: "uppercase" }}>Where / What to Implement</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: "uppercase" }}>Priority</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: "uppercase" }}>Status</span>
          </div>

          {/* Feature rows */}
          {phase.features.map((feature, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 2.5fr 2.5fr 0.8fr 0.8fr",
                gap: 12,
                padding: "14px 24px",
                direction: "ltr",
                borderTop: i > 0 ? `1px solid ${theme.border}` : "none",
                transition: "background 150ms",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = theme.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{feature.name}</span>
              <span style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.5 }}>{feature.description}</span>
              <span style={{ fontSize: 11, color: "#4285F4", lineHeight: 1.5, fontFamily: "monospace", background: "#4285F408", padding: "2px 6px", borderRadius: 4 }}>{feature.ref}</span>
              <PriorityBadge priority={feature.priority} />
              <StatusDot status={feature.status} />
            </div>
          ))}

          {/* Phase total */}
          <div style={{ display: "flex", justifyContent: "flex-start", padding: "12px 24px", background: theme.tableHeaderBg, borderTop: `1px solid ${theme.border}`, direction: "ltr" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>Level {phase.id}: {phase.features.length} features</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──
export default function RoadmapPage() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('geoscale-dark-mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('geoscale-dark-mode', darkMode.toString());
  }, [darkMode]);

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "start" }}>
            <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 13, fontWeight: 600, borderRadius: 9, border: darkMode ? "1px solid #E6EDF3" : "1px solid #000", textDecoration: "none" }}>New Scan</a>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: theme.textSecondary }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
              <span>Connected</span>
            </div>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="/" style={{ fontSize: 14, fontWeight: 400, color: theme.textSecondary, textDecoration: "none" }}>Dashboard</a>
            <a href="/scan" style={{ fontSize: 14, fontWeight: 400, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
            <a href="/scale-publish" style={{ fontSize: 14, fontWeight: 400, color: theme.textSecondary, textDecoration: "none" }}>ScalePublish</a>
            <a href="/editor" style={{ fontSize: 14, fontWeight: 400, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
            <a href="/roadmap" style={{ fontSize: 14, fontWeight: 600, color: theme.text, textDecoration: "none" }}>Roadmap</a>
          </nav>
          <div style={{ justifySelf: "end" }}>
            <GeoscaleLogo theme={theme} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, maxWidth: 1300, margin: "0 auto", padding: "32px 24px 48px", width: "100%" }} dir="ltr">
        {/* Title Section */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: theme.text, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
            Roadmap <span style={{ fontWeight: 400, color: theme.textSecondary }}>-</span> Geoscale Feature Plan
          </h1>
          <p style={{ fontSize: 14, color: theme.textSecondary }}>
            Features sorted by criticality level - what&apos;s missing in production vs. the demo and what clients need
          </p>
        </div>

        {/* Summary Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Features", value: "68", accent: false },
            { label: "Criticality Levels", value: "5", accent: false },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: 10,
                background: theme.cardBg,
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 500 }}>{stat.label}</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: stat.accent ? "#10A37F" : theme.text }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Phase Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {phases.map(phase => (
            <PhaseCard key={phase.id} phase={phase} theme={theme} />
          ))}
        </div>

        {/* Multi-Query SEO Prompt - Copy Section */}
        <div style={{ border: "2px solid #E07800", borderRadius: 10, background: darkMode ? "#1C1810" : "#FFFBF0", padding: 24, direction: "ltr", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>&#x1F4CB;</span>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.text, margin: 0 }}>Multi-Query Content Writing Prompt - Copy to Production</h3>
          </div>
          <p style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>
            This is the prompt that needs to be added to Geoscale&apos;s content writing engine. The idea: every article the system generates doesn&apos;t target just one query - but one primary query + 5-10 sub-queries. Each H2 answers a separate query that people search for, and the FAQ captures additional long-tail. This way one URL captures traffic from 8-15 different queries.
          </p>
          <p style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 16, lineHeight: 1.6 }}>
            <strong>Live example:</strong> See how adsgpt.io builds their articles - <span style={{ color: "#4285F4" }}>adsgpt.io/blog/social-media-marketing-strategy</span> - each section answers an independent query, and the full article ranks for dozens of related queries.
          </p>
          <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 20, overflow: "auto", maxHeight: 500 }}>
            <pre style={{ fontSize: 11, color: "#e0e0e0", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", fontFamily: "'Courier New', monospace", direction: "ltr", textAlign: "left" }}>
              {multiQueryPrompt}
            </pre>
          </div>
          <p style={{ fontSize: 11, color: theme.textSecondary, marginTop: 12 }}>
            * Copy this prompt and add it to the content writing engine&apos;s system prompt, after the basic settings (article length, writing style) and before the format instructions.
          </p>
        </div>

        {/* Bottom Summary */}
        <div style={{ border: `1px solid ${theme.border}`, borderRadius: 10, background: theme.cardBg, padding: 24, direction: "ltr" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Dependencies & Risks</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#DC2626", display: "inline-block", marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.6 }}>Multi-Query prompt requires Alexei&apos;s approval before integration into production system</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#DC2626", display: "inline-block", marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.6 }}>All visual features (charts, tooltips, alerts) are ready in the demo - only need migration to production</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#E07800", display: "inline-block", marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.6 }}>Access to DataForSEO/Ahrefs API for publisher ranking system and SEO dashboard</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#E07800", display: "inline-block", marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.6 }}>Publishers Portal requires separate UX spec + legal terms</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#E07800", display: "inline-block", marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.6 }}>Expanding AI engines (Perplexity, Claude, Bing) depends on API access and pricing</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${theme.border}` }}>
        <div className="max-w-[1300px] mx-auto px-6 py-5 flex items-center justify-between" dir="ltr">
          <div className="flex items-center gap-3">
            <GeoscaleLogoMark size={28} theme={theme} />
            <span className="text-sm" style={{ color: theme.textSecondary }}>Powered by advanced AI to analyze your search presence</span>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: "Feedback", color: "#10A37F", bg: "#10A37F15" },
              { label: "Report a bug", color: "#E07800", bg: "#E0780015" },
              { label: "Improvement ideas", color: "#4285F4", bg: "#4285F415" },
              { label: "API usage", color: "#10A37F", bg: "#10A37F15" },
            ].map((link, i) => (
              <span key={i} className="text-xs font-medium px-3 py-1.5 cursor-pointer transition-opacity hover:opacity-70" style={{ color: link.color, background: link.bg, borderRadius: 20 }}>
                {link.label}
              </span>
            ))}
          </div>
          <span className="text-xs" style={{ color: theme.textMuted }}>GeoScale 2026 &copy;</span>
        </div>
      </footer>
    </div>
  );
}
