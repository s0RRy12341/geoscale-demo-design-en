"use client";

import React, { useEffect, useMemo, useState } from "react";

// ════════════════════════════════════════════════════════════
// GEOSCALE SEO AUDIT TAB
// V1: visual mock that mirrors Ahrefs Site Audit on the scan page.
// All data is seeded for the demo. Real backend (DataForSEO OnPage API)
// gets wired in after Inna + Alexei approve the UX.
// ════════════════════════════════════════════════════════════

type Theme = {
  bg: string; cardBg: string; border: string; text: string; textSecondary: string; textMuted: string;
  headerBg: string; hoverBg: string; tableBg: string; tableHeaderBg: string; badgeBg: string;
  inputBg: string; barTrack: string; logoFill: string; logoStroke: string;
};

const BRAND_GREEN = "#10A37F";
const BRAND_AMBER = "#B45309";
const BRAND_RED = "#DC2626";
const BRAND_BLUE = "#0891B2";

// Single source of truth for hover behaviour across the SEO Audit + scan
// surfaces. Anywhere we want a row to feel "alive on hover" we add
// className="geoscale-row" / "geoscale-card" / "geoscale-link" — the green
// hover styles below take effect.
function GeoscaleHoverStyles() {
  return (
    <style>{`
      .geoscale-row { position: relative; }
      .geoscale-row:hover { background: rgba(16, 163, 127, 0.07) !important; }
      .geoscale-row:hover .geoscale-row-arrow { opacity: 1; transform: translateX(2px); }
      .geoscale-row:active { background: rgba(16, 163, 127, 0.13) !important; }

      .geoscale-card { position: relative; }
      .geoscale-card:hover { border-color: #10A37F !important; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(16, 163, 127, 0.12); }
      .geoscale-card:active { transform: translateY(0); box-shadow: 0 2px 6px rgba(16, 163, 127, 0.18); }

      .geoscale-link { transition: color 120ms ease; }
      .geoscale-link:hover { color: #0E7F62 !important; text-decoration: underline; text-underline-offset: 3px; }

      .geoscale-pill { transition: background 120ms ease, color 120ms ease, border-color 120ms ease, transform 120ms ease; }
      .geoscale-pill:hover { background: rgba(16, 163, 127, 0.1) !important; border-color: #10A37F !important; color: #10A37F !important; }
      .geoscale-pill:active { transform: scale(0.97); }

      .geoscale-cta { transition: background 120ms ease, transform 120ms ease, box-shadow 120ms ease; }
      .geoscale-cta:hover { background: #0E7F62 !important; box-shadow: 0 4px 12px rgba(16, 163, 127, 0.35); transform: translateY(-1px); }
      .geoscale-cta:active { transform: translateY(0); box-shadow: 0 2px 4px rgba(16, 163, 127, 0.35); }
    `}</style>
  );
}

type Severity = "error" | "warning" | "notice";
type Category = "crawlability" | "onpage" | "performance" | "links" | "structured";

const CATEGORY_LABEL: Record<Category, string> = {
  crawlability: "Crawlability & Indexability",
  onpage: "On-Page SEO",
  performance: "Performance / Core Web Vitals",
  links: "Links",
  structured: "Structured Data & Social",
};

const SEVERITY_COLOR: Record<Severity, string> = {
  error: BRAND_RED,
  warning: BRAND_AMBER,
  notice: BRAND_BLUE,
};

const SEVERITY_LABEL: Record<Severity, string> = {
  error: "Error",
  warning: "Warning",
  notice: "Notice",
};

type IssueDef = {
  id: string;
  name: string;
  category: Category;
  severity: Severity;
  description: string;
  fix: string;
};

// All 37 V1 checks. The mock data picks a subset to populate each audit.
const ISSUE_DEFS: IssueDef[] = [
  // Crawlability & Indexability (10)
  { id: "broken-4xx", name: "Broken pages (4xx)", category: "crawlability", severity: "error", description: "Internal pages returning a 4xx status code. Users and crawlers cannot reach them.", fix: "Restore the page, redirect to a relevant 200 page, or remove all internal links pointing at it." },
  { id: "server-5xx", name: "Server errors (5xx)", category: "crawlability", severity: "error", description: "Internal pages returning a 5xx server error.", fix: "Check the server logs and fix the underlying error. 5xx pages cannot be indexed." },
  { id: "redirect-chain", name: "Redirect chains (3+ hops)", category: "crawlability", severity: "warning", description: "URLs that redirect through 3 or more hops before reaching a 200 page.", fix: "Update internal links to point directly to the final URL. Each hop costs crawl budget." },
  { id: "redirect-loop", name: "Redirect loops", category: "crawlability", severity: "error", description: "URLs that redirect in a loop and never resolve.", fix: "Break the loop by removing or rewriting one of the rules." },
  { id: "robots-blocked", name: "Pages blocked by robots.txt", category: "crawlability", severity: "warning", description: "Pages that exist in the sitemap or internal links but are disallowed by robots.txt.", fix: "Either remove them from sitemap/internal links, or unblock them in robots.txt." },
  { id: "noindex-meta", name: "Pages with noindex meta", category: "crawlability", severity: "warning", description: "Pages with a meta robots noindex tag. Will not appear in search results.", fix: "Remove the noindex tag from pages you want indexed." },
  { id: "noindex-header", name: "Pages with noindex HTTP header", category: "crawlability", severity: "warning", description: "Pages serving an X-Robots-Tag noindex header. Hidden from search but easy to miss.", fix: "Check server config or CDN rules and remove the header where unintended." },
  { id: "missing-canonical", name: "Missing canonical tag", category: "crawlability", severity: "notice", description: "Pages without a self-referencing canonical tag.", fix: "Add a <link rel=\"canonical\"> pointing at the page's preferred URL." },
  { id: "canonical-bad-target", name: "Canonical points to non-200 / redirected URL", category: "crawlability", severity: "error", description: "Canonical tag points to a URL that is not 200 OK.", fix: "Update the canonical to point at a live page." },
  { id: "page-depth", name: "Page depth > 3 clicks from homepage", category: "crawlability", severity: "notice", description: "Pages buried more than 3 clicks deep. Lower crawl priority and harder for users to find.", fix: "Surface important pages with shorter paths or category links." },

  // On-Page SEO (12)
  { id: "missing-title", name: "Missing title tag", category: "onpage", severity: "error", description: "Pages with no <title> tag.", fix: "Add a unique, keyword-relevant title (30-60 chars)." },
  { id: "duplicate-title", name: "Duplicate title across pages", category: "onpage", severity: "warning", description: "Two or more pages share the same title.", fix: "Rewrite so each title is unique and reflects the page topic." },
  { id: "title-too-long", name: "Title too long (>60 chars)", category: "onpage", severity: "notice", description: "Title exceeds 60 characters and may be truncated in SERPs.", fix: "Shorten to 30-60 chars while keeping the primary keyword early." },
  { id: "title-too-short", name: "Title too short (<30 chars)", category: "onpage", severity: "notice", description: "Title is shorter than 30 characters and likely underspecified.", fix: "Expand the title to describe the page and include a relevant keyword." },
  { id: "missing-meta-desc", name: "Missing meta description", category: "onpage", severity: "warning", description: "Pages without a meta description.", fix: "Write a 120-160 char description summarising the page and inviting clicks." },
  { id: "duplicate-meta-desc", name: "Duplicate meta description", category: "onpage", severity: "warning", description: "Two or more pages share the same meta description.", fix: "Make each one unique to its page." },
  { id: "meta-desc-too-long", name: "Meta description too long (>160 chars)", category: "onpage", severity: "notice", description: "Description exceeds 160 chars and will be truncated in SERPs.", fix: "Cut to 120-160 chars and keep the call to action up front." },
  { id: "missing-h1", name: "Missing H1", category: "onpage", severity: "error", description: "Pages without any H1 tag.", fix: "Add one H1 per page that reflects the main topic." },
  { id: "multiple-h1", name: "Multiple H1s on one page", category: "onpage", severity: "warning", description: "Pages with more than one H1.", fix: "Keep one H1, convert the rest to H2 or H3." },
  { id: "thin-content", name: "Thin content (<200 words)", category: "onpage", severity: "warning", description: "Pages with less than 200 words of body content.", fix: "Expand the content with genuinely useful detail or noindex if the page is utility-only." },
  { id: "duplicate-content", name: "Duplicate content (>=80% similarity)", category: "onpage", severity: "error", description: "Clusters of pages with near-identical body content.", fix: "Consolidate via canonical or merge into a single canonical page." },
  { id: "missing-alt", name: "Images missing alt text", category: "onpage", severity: "notice", description: "Images without an alt attribute. Hurts accessibility and image search.", fix: "Add descriptive alt text. Decorative images can use alt=\"\"." },

  // Performance (5)
  { id: "lcp-slow", name: "LCP > 2.5s", category: "performance", severity: "warning", description: "Largest Contentful Paint above Google's 'Good' threshold.", fix: "Preload the hero image, reduce render-blocking JS/CSS, serve images in modern formats." },
  { id: "inp-slow", name: "INP > 200ms", category: "performance", severity: "warning", description: "Interaction to Next Paint above the 'Good' threshold.", fix: "Reduce main-thread JS work and split long tasks." },
  { id: "cls-high", name: "CLS > 0.1", category: "performance", severity: "warning", description: "Cumulative Layout Shift above the 'Good' threshold.", fix: "Reserve space for images, embeds, and ads. Avoid inserting content above existing content." },
  { id: "page-weight", name: "Total page weight > 5 MB", category: "performance", severity: "notice", description: "Total bytes downloaded for the page exceeds 5 MB.", fix: "Compress images, defer non-critical JS, code-split." },
  { id: "large-images", name: "Images > 500 KB", category: "performance", severity: "notice", description: "Individual images larger than 500 KB.", fix: "Convert to WebP/AVIF, serve responsive sizes, compress to ~80 quality." },

  // Links (5)
  { id: "broken-internal", name: "Broken internal links (4xx target)", category: "links", severity: "error", description: "Internal links pointing at 4xx URLs.", fix: "Update or remove the link, or restore the target page." },
  { id: "broken-external", name: "Broken external links (4xx / 5xx target)", category: "links", severity: "warning", description: "Outbound links pointing at dead URLs.", fix: "Update to a working URL or remove." },
  { id: "orphan", name: "Orphan pages (no inlinks)", category: "links", severity: "warning", description: "Pages with zero internal links pointing at them.", fix: "Add internal links from relevant pages or remove from the sitemap if intentional." },
  { id: "link-to-redirect", name: "Internal links to redirects", category: "links", severity: "notice", description: "Internal links pointing at URLs that redirect.", fix: "Update the link to the final URL to save a hop." },
  { id: "excessive-outbound", name: "Excessive outbound links (>100 on a page)", category: "links", severity: "notice", description: "Pages with more than 100 outbound links.", fix: "Audit whether all of them are necessary. Too many dilutes link equity." },

  // Structured Data & Social (5)
  { id: "missing-schema", name: "Missing schema.org on key page types", category: "structured", severity: "warning", description: "Article, Product, or Organization pages without structured data.", fix: "Add JSON-LD for the appropriate schema type." },
  { id: "invalid-schema", name: "Invalid schema.org (JSON-LD parse error)", category: "structured", severity: "error", description: "Schema markup that fails JSON-LD parsing or is missing required fields.", fix: "Validate with Google's Rich Results Test and fix the offending fields." },
  { id: "missing-og", name: "Missing Open Graph tags", category: "structured", severity: "notice", description: "Pages missing og:title, og:description, or og:image.", fix: "Add all three. Required for clean previews on Facebook, LinkedIn, WhatsApp." },
  { id: "missing-twitter", name: "Missing Twitter card", category: "structured", severity: "notice", description: "Pages missing twitter:card and related tags.", fix: "Add the summary_large_image card with title, description, and image." },
  { id: "hreflang-error", name: "Hreflang errors", category: "structured", severity: "warning", description: "Pages with missing return tags, invalid codes, or self-referential errors.", fix: "Make sure every hreflang has a return-tag pointing back and uses valid ISO codes." },
];

type AuditPage = {
  url: string;
  statusCode: number;
  title: string;
  titleLength: number;
  metaDescLength: number;
  h1: string;
  wordCount: number;
  depth: number;
  inlinks: number;
  outlinks: number;
  indexable: boolean;
  indexableReason?: string;
  issues: string[]; // issue ids
};

type AuditRun = {
  id: string;
  startedAt: string;
  finishedAt: string;
  durationSec: number;
  pagesCrawled: number;
  totalPages: number;
  healthScore: number;
  errorsCount: number;
  warningsCount: number;
  noticesCount: number;
  issues: { id: string; affected: number }[];
  settings: AuditSettings;
};

type AuditSettings = {
  seedSource: "homepage-sitemap" | "sitemap-only" | "custom";
  maxPages: 100 | 500 | 2000 | 5000;
  jsRendering: boolean;
  userAgent: "desktop" | "mobile";
  respectRobots: boolean;
  includeRegex?: string;
  excludeRegex?: string;
};

const DEFAULT_SETTINGS: AuditSettings = {
  seedSource: "homepage-sitemap",
  maxPages: 500,
  jsRendering: true,
  userAgent: "desktop",
  respectRobots: true,
};

// ── MOCK DATA ────────────────────────────────────────────────
// 3 historical audits for the demo domain so the "compare vs previous" widget
// has real values to show.

const DEMO_DOMAIN = "all4horses.co.il";

const MOCK_AUDITS: AuditRun[] = [
  {
    id: "audit-3",
    startedAt: "2026-05-07T08:14:00Z",
    finishedAt: "2026-05-07T08:18:42Z",
    durationSec: 282,
    pagesCrawled: 487,
    totalPages: 487,
    healthScore: 78,
    errorsCount: 23,
    warningsCount: 41,
    noticesCount: 67,
    settings: DEFAULT_SETTINGS,
    issues: [
      { id: "broken-4xx", affected: 12 },
      { id: "missing-title", affected: 4 },
      { id: "missing-h1", affected: 6 },
      { id: "duplicate-content", affected: 5 },
      { id: "canonical-bad-target", affected: 3 },
      { id: "broken-internal", affected: 9 },
      { id: "invalid-schema", affected: 2 },
      { id: "redirect-chain", affected: 18 },
      { id: "robots-blocked", affected: 7 },
      { id: "noindex-meta", affected: 11 },
      { id: "duplicate-title", affected: 8 },
      { id: "missing-meta-desc", affected: 22 },
      { id: "duplicate-meta-desc", affected: 6 },
      { id: "multiple-h1", affected: 4 },
      { id: "thin-content", affected: 14 },
      { id: "lcp-slow", affected: 31 },
      { id: "cls-high", affected: 12 },
      { id: "inp-slow", affected: 8 },
      { id: "broken-external", affected: 16 },
      { id: "orphan", affected: 5 },
      { id: "missing-schema", affected: 28 },
      { id: "hreflang-error", affected: 9 },
      { id: "title-too-long", affected: 19 },
      { id: "title-too-short", affected: 6 },
      { id: "meta-desc-too-long", affected: 11 },
      { id: "page-depth", affected: 17 },
      { id: "missing-canonical", affected: 24 },
      { id: "missing-alt", affected: 42 },
      { id: "link-to-redirect", affected: 29 },
      { id: "excessive-outbound", affected: 3 },
      { id: "page-weight", affected: 21 },
      { id: "large-images", affected: 35 },
      { id: "missing-og", affected: 18 },
      { id: "missing-twitter", affected: 26 },
    ],
  },
  {
    id: "audit-2",
    startedAt: "2026-04-22T09:02:00Z",
    finishedAt: "2026-04-22T09:06:11Z",
    durationSec: 251,
    pagesCrawled: 462,
    totalPages: 462,
    healthScore: 71,
    errorsCount: 34,
    warningsCount: 48,
    noticesCount: 72,
    settings: DEFAULT_SETTINGS,
    issues: [
      { id: "broken-4xx", affected: 19 },
      { id: "missing-title", affected: 7 },
      { id: "missing-h1", affected: 9 },
      { id: "duplicate-content", affected: 8 },
      { id: "canonical-bad-target", affected: 5 },
      { id: "broken-internal", affected: 14 },
      { id: "invalid-schema", affected: 4 },
      { id: "redirect-chain", affected: 22 },
      { id: "robots-blocked", affected: 9 },
      { id: "noindex-meta", affected: 13 },
      { id: "duplicate-title", affected: 12 },
      { id: "missing-meta-desc", affected: 27 },
      { id: "thin-content", affected: 19 },
      { id: "lcp-slow", affected: 38 },
      { id: "missing-schema", affected: 33 },
      { id: "missing-alt", affected: 48 },
    ],
  },
  {
    id: "audit-1",
    startedAt: "2026-04-08T10:23:00Z",
    finishedAt: "2026-04-08T10:28:54Z",
    durationSec: 354,
    pagesCrawled: 421,
    totalPages: 421,
    healthScore: 64,
    errorsCount: 47,
    warningsCount: 55,
    noticesCount: 79,
    settings: DEFAULT_SETTINGS,
    issues: [
      { id: "broken-4xx", affected: 28 },
      { id: "missing-title", affected: 11 },
      { id: "missing-h1", affected: 14 },
      { id: "duplicate-content", affected: 12 },
      { id: "canonical-bad-target", affected: 8 },
      { id: "broken-internal", affected: 21 },
      { id: "missing-schema", affected: 41 },
      { id: "thin-content", affected: 24 },
      { id: "lcp-slow", affected: 46 },
    ],
  },
];

// Mock crawled pages for the latest audit (a sample, enough to feel real)
const MOCK_PAGES: AuditPage[] = [
  { url: "/", statusCode: 200, title: "All4Horses, ציוד וטיפוח לסוסים - חנות מובילה בישראל", titleLength: 51, metaDescLength: 142, h1: "All4Horses, ציוד לסוסים", wordCount: 412, depth: 0, inlinks: 287, outlinks: 64, indexable: true, issues: [] },
  { url: "/category/saddles", statusCode: 200, title: "אוכפים לרכיבה", titleLength: 14, metaDescLength: 0, h1: "אוכפים", wordCount: 187, depth: 1, inlinks: 24, outlinks: 31, indexable: true, issues: ["title-too-short", "missing-meta-desc", "thin-content"] },
  { url: "/category/feed", statusCode: 200, title: "מזון לסוסים, תוספי תזונה לסוס - All4Horses", titleLength: 44, metaDescLength: 156, h1: "מזון לסוסים", wordCount: 543, depth: 1, inlinks: 31, outlinks: 47, indexable: true, issues: [] },
  { url: "/category/grooming", statusCode: 200, title: "ציוד טיפוח לסוס - מברשות, סבונים ועוד", titleLength: 38, metaDescLength: 138, h1: "ציוד טיפוח", wordCount: 387, depth: 1, inlinks: 22, outlinks: 38, indexable: true, issues: ["missing-og"] },
  { url: "/product/saddle-pro", statusCode: 200, title: "אוכף Pro לרכיבה ספורטיבית", titleLength: 25, metaDescLength: 0, h1: "אוכף Pro", wordCount: 234, depth: 2, inlinks: 8, outlinks: 12, indexable: true, issues: ["missing-meta-desc", "missing-schema", "missing-alt"] },
  { url: "/product/saddle-basic", statusCode: 200, title: "אוכף Basic", titleLength: 10, metaDescLength: 0, h1: "אוכף Basic", wordCount: 156, depth: 2, inlinks: 5, outlinks: 11, indexable: true, issues: ["title-too-short", "missing-meta-desc", "thin-content", "missing-schema"] },
  { url: "/product/saddle-deluxe", statusCode: 200, title: "אוכף Deluxe", titleLength: 11, metaDescLength: 132, h1: "אוכף Deluxe", wordCount: 289, depth: 2, inlinks: 7, outlinks: 14, indexable: true, issues: ["title-too-short", "missing-schema"] },
  { url: "/blog/grooming-routine", statusCode: 200, title: "שגרת טיפוח יומית לסוס שלכם, מדריך מקיף", titleLength: 39, metaDescLength: 148, h1: "שגרת טיפוח יומית לסוס שלכם, מדריך מקיף", wordCount: 1287, depth: 2, inlinks: 18, outlinks: 22, indexable: true, issues: [] },
  { url: "/blog/feeding-tips", statusCode: 200, title: "טיפים להאכלת סוסים", titleLength: 19, metaDescLength: 0, h1: "טיפים להאכלת סוסים", wordCount: 612, depth: 2, inlinks: 14, outlinks: 19, indexable: true, issues: ["missing-meta-desc"] },
  { url: "/blog/winter-care", statusCode: 200, title: "טיפוח הסוס בחורף, מה חשוב לדעת על מזג אוויר קר", titleLength: 47, metaDescLength: 167, h1: "טיפוח הסוס בחורף", wordCount: 894, depth: 2, inlinks: 11, outlinks: 17, indexable: true, issues: ["meta-desc-too-long"] },
  { url: "/about", statusCode: 200, title: "אודות All4Horses, צוות מומחי הציוד לסוסים", titleLength: 41, metaDescLength: 0, h1: "אודות", wordCount: 312, depth: 1, inlinks: 16, outlinks: 8, indexable: true, issues: ["missing-meta-desc"] },
  { url: "/contact", statusCode: 200, title: "צרו קשר עם All4Horses", titleLength: 23, metaDescLength: 0, h1: "צרו קשר", wordCount: 142, depth: 1, inlinks: 19, outlinks: 6, indexable: true, issues: ["missing-meta-desc", "thin-content"] },
  { url: "/shipping", statusCode: 200, title: "מדיניות משלוחים", titleLength: 16, metaDescLength: 0, h1: "משלוחים", wordCount: 198, depth: 1, inlinks: 23, outlinks: 4, indexable: true, issues: ["title-too-short", "missing-meta-desc", "thin-content"] },
  { url: "/returns", statusCode: 404, title: "", titleLength: 0, metaDescLength: 0, h1: "", wordCount: 0, depth: 2, inlinks: 8, outlinks: 0, indexable: false, indexableReason: "404 Not Found", issues: ["broken-4xx", "missing-title", "missing-h1"] },
  { url: "/sitemap-archive", statusCode: 500, title: "", titleLength: 0, metaDescLength: 0, h1: "", wordCount: 0, depth: 3, inlinks: 2, outlinks: 0, indexable: false, indexableReason: "500 Server Error", issues: ["server-5xx", "missing-title", "missing-h1"] },
  { url: "/old-saddles", statusCode: 301, title: "Redirects to /category/saddles", titleLength: 30, metaDescLength: 0, h1: "", wordCount: 0, depth: 2, inlinks: 5, outlinks: 1, indexable: false, indexableReason: "Redirects", issues: ["link-to-redirect"] },
  { url: "/category/blankets", statusCode: 200, title: "פוטות, שמיכות וכיסויים לסוס", titleLength: 28, metaDescLength: 145, h1: "פוטות וכיסויים", wordCount: 421, depth: 1, inlinks: 18, outlinks: 29, indexable: true, issues: ["missing-og"] },
  { url: "/category/bits", statusCode: 200, title: "מתגים ורצועות לרכיבה", titleLength: 21, metaDescLength: 0, h1: "מתגים ורצועות", wordCount: 234, depth: 1, inlinks: 14, outlinks: 24, indexable: true, issues: ["missing-meta-desc"] },
  { url: "/category/boots", statusCode: 200, title: "מגפיים ונעלי רכיבה לרוכבים מקצועיים, יבואן רשמי", titleLength: 49, metaDescLength: 162, h1: "מגפיים ונעלי רכיבה", wordCount: 502, depth: 1, inlinks: 21, outlinks: 33, indexable: true, issues: ["meta-desc-too-long"] },
  { url: "/blog/choosing-saddle", statusCode: 200, title: "איך לבחור אוכף, מדריך מלא", titleLength: 26, metaDescLength: 0, h1: "איך לבחור אוכף", wordCount: 723, depth: 2, inlinks: 13, outlinks: 21, indexable: true, issues: ["missing-meta-desc"] },
];

// ── PER-ISSUE LOCATION DATA ────────────────────────────────
// For every issue id we list the URLs that triggered it, plus the *evidence*:
// the actual HTML/text snippet, where on the page it lives, and why it fails
// the check. This is the killer drilldown UX Ahrefs has — "show me the line
// that's wrong, not just the count."
type IssueLocation = {
  url: string;
  snippet: string;          // monospace code/text to render in a code block
  snippetLang?: "html" | "text" | "json" | "css" | "http";
  location: string;         // human-readable location (e.g. "<head>, line 14")
  detail: string;           // why this row fails (e.g. "14 chars, target 30-60")
  measurement?: string;     // optional metric (e.g. "LCP 4.2s · target ≤ 2.5s")
};

const MOCK_ISSUE_LOCATIONS: Record<string, IssueLocation[]> = {
  "broken-4xx": [
    { url: "/returns", location: "HTTP response", detail: "Page returns 404 Not Found. 8 internal links still point here.", measurement: "HTTP 404 · 412 ms · 0 bytes", snippetLang: "http", snippet: `GET https://all4horses.co.il/returns
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8
X-Powered-By: Next.js

<!DOCTYPE html>
<html><head><title>404, Page Not Found</title>...` },
    { url: "/blog/old-feeding-guide", location: "HTTP response", detail: "404 Not Found. Last seen working 2026-02-14.", measurement: "HTTP 404 · 380 ms", snippetLang: "http", snippet: `GET https://all4horses.co.il/blog/old-feeding-guide
HTTP/1.1 404 Not Found
Content-Length: 1,847` },
    { url: "/promo/winter-2025", location: "HTTP response", detail: "Expired campaign URL still linked from 3 blog posts.", measurement: "HTTP 404 · 421 ms", snippetLang: "http", snippet: `GET https://all4horses.co.il/promo/winter-2025
HTTP/1.1 404 Not Found` },
  ],
  "server-5xx": [
    { url: "/sitemap-archive", location: "HTTP response", detail: "Database timeout while building archive sitemap.", measurement: "HTTP 500 · 28,400 ms (timeout)", snippetLang: "http", snippet: `GET https://all4horses.co.il/sitemap-archive
HTTP/1.1 500 Internal Server Error
X-Error: Database query timeout (28.4s)
Content-Length: 0` },
  ],
  "redirect-chain": [
    { url: "/old-saddles", location: "HTTP redirect chain", detail: "3 hops before reaching a 200 page. Each hop costs crawl budget.", measurement: "3 redirects · 1,240 ms total", snippetLang: "http", snippet: `GET /old-saddles
  → 301 → /saddles-old
GET /saddles-old
  → 301 → /products/saddles
GET /products/saddles
  → 301 → /category/saddles
GET /category/saddles
  → 200 OK ✓` },
    { url: "/products/horse-feed", location: "HTTP redirect chain", detail: "Trailing-slash mismatch then category rewrite. Update internal links to land on /category/feed.", measurement: "2 redirects · 890 ms total", snippetLang: "http", snippet: `GET /products/horse-feed
  → 301 → /products/horse-feed/
  → 301 → /category/feed
  → 200 OK ✓` },
  ],
  "noindex-meta": [
    { url: "/cart", location: "<head>, line 23", detail: "Page tagged noindex but still appears in sitemap.xml — pick one.", snippetLang: "html", snippet: `<head>
  <title>סל קניות, All4Horses</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta name="robots" content="noindex, nofollow">   <!-- ← here -->
  <link rel="canonical" href="https://all4horses.co.il/cart">
</head>` },
    { url: "/checkout", location: "<head>, line 21", detail: "Intentional noindex on checkout — but it's still in sitemap.xml.", snippetLang: "html", snippet: `<meta name="robots" content="noindex, follow">` },
    { url: "/account/orders", location: "<head>, line 19", detail: "Member-only page indexed via noindex but no auth wall — recommend Basic Auth or removal from sitemap.", snippetLang: "html", snippet: `<meta name="robots" content="noindex">` },
  ],
  "robots-blocked": [
    { url: "/admin", location: "robots.txt rule", detail: "Disallowed by robots.txt yet present in sitemap.xml — Google logs a coverage warning.", snippetLang: "text", snippet: `# robots.txt
User-agent: *
Disallow: /admin
Disallow: /api
Sitemap: https://all4horses.co.il/sitemap.xml

# sitemap.xml (extract)
<url><loc>https://all4horses.co.il/admin</loc></url>   ← conflict` },
  ],
  "canonical-bad-target": [
    { url: "/blog/saddle-types", location: "<head>, line 12", detail: "Canonical points at a URL that 404s. Search engines will ignore the tag.", snippetLang: "html", snippet: `<link rel="canonical"
  href="https://all4horses.co.il/blog/saddle-types-old"> <!-- target = 404 -->` },
    { url: "/product/saddle-pro-2024", location: "<head>, line 14", detail: "Canonical resolves through a 301 chain (2 hops). Point directly at the final URL.", snippetLang: "html", snippet: `<link rel="canonical"
  href="https://all4horses.co.il/product/saddle-pro"> <!-- 301 → /products/saddle-pro -->` },
  ],
  "missing-canonical": [
    { url: "/category/feed?sort=price", location: "<head>", detail: "Faceted URL with no canonical pointing back at /category/feed.", snippetLang: "html", snippet: `<head>
  <title>מזון לסוסים, מיון לפי מחיר</title>
  <!-- ⚠ no <link rel="canonical"> here -->
</head>` },
  ],
  "page-depth": [
    { url: "/blog/category/care/sub/winter/blanket-fit", location: "Click path", detail: "5 clicks from homepage. Important blog post buried — surface from /blog hub.", snippetLang: "text", snippet: `/  →  /blog  →  /blog/category/care  →  /blog/category/care/sub  →  /blog/category/care/sub/winter  →  /blog/category/care/sub/winter/blanket-fit` },
  ],
  "missing-title": [
    { url: "/returns", location: "<head>", detail: "No <title> tag at all.", snippetLang: "html", snippet: `<head>
  <meta charset="utf-8">
  <!-- ⚠ no <title> tag -->
  <meta name="description" content="...">
</head>` },
    { url: "/sitemap-archive", location: "<head>", detail: "<title> tag present but empty.", snippetLang: "html", snippet: `<head>
  <title></title>   <!-- ← empty -->
</head>` },
  ],
  "duplicate-title": [
    { url: "/category/saddles", location: "<head>, line 7", detail: "Identical title used on 3 other URLs (/category/saddles?page=2, /category/saddles?sort=new, /shop/saddles).", snippetLang: "html", snippet: `<title>אוכפים לרכיבה</title>   <!-- duplicated on 3 URLs -->` },
    { url: "/category/saddles?page=2", location: "<head>, line 7", detail: "Same title as /category/saddles. Add 'עמוד 2' suffix or apply rel=canonical.", snippetLang: "html", snippet: `<title>אוכפים לרכיבה</title>` },
  ],
  "title-too-long": [
    { url: "/blog/everything-you-need-to-know-about-saddle-fit-for-arabian-horses", location: "<head>, line 8", detail: "78 chars — Google will truncate at ~580px (≈60 chars).", measurement: "78 chars · target 30-60", snippetLang: "html", snippet: `<title>כל מה שצריך לדעת על התאמת אוכף לסוסים ערביים, המדריך המלא של All4Horses</title>
<!--           target ≤ 60 chars ──────────────────────────────────┘ -->
<!--           actual 78 chars ────────────────────────────────────────────────┘ -->` },
    { url: "/category/winter-blankets-and-coverings", location: "<head>, line 9", detail: "67 chars — slightly over, last 7 chars will be cut.", measurement: "67 chars · target 30-60", snippetLang: "html", snippet: `<title>שמיכות חורף וכיסויים לסוס - All4Horses חנות ציוד מקצועית</title>` },
  ],
  "title-too-short": [
    { url: "/category/saddles", location: "<head>, line 7", detail: "Only 14 chars. Missing a brand suffix and a value modifier.", measurement: "14 chars · target 30-60", snippetLang: "html", snippet: `<title>אוכפים לרכיבה</title>
<!--    target ≥ 30 chars ──────────────┘ -->
<!--    actual 14 chars ───┘ -->` },
    { url: "/product/saddle-basic", location: "<head>, line 9", detail: "10 chars. Add product family and brand.", measurement: "10 chars · target 30-60", snippetLang: "html", snippet: `<title>אוכף Basic</title>` },
    { url: "/shipping", location: "<head>, line 6", detail: "16 chars. Add 'All4Horses' suffix and 'משלוח חינם' modifier.", measurement: "16 chars · target 30-60", snippetLang: "html", snippet: `<title>מדיניות משלוחים</title>` },
  ],
  "missing-meta-desc": [
    { url: "/category/saddles", location: "<head>", detail: "No meta description, Google will auto-extract from body text.", snippetLang: "html", snippet: `<head>
  <title>אוכפים לרכיבה</title>
  <!-- ⚠ no <meta name="description"> -->
  <link rel="canonical" href="...">
</head>` },
    { url: "/product/saddle-pro", location: "<head>", detail: "No meta description on a product page — losing click-through control.", snippetLang: "html", snippet: `<head>
  <title>אוכף Pro לרכיבה ספורטיבית</title>
  <!-- ⚠ no description -->
</head>` },
    { url: "/about", location: "<head>", detail: "Brand page with no description.", snippetLang: "html", snippet: `<!-- no <meta name="description"> -->` },
  ],
  "duplicate-meta-desc": [
    { url: "/category/saddles", location: "<head>, line 9", detail: "Same description on /category/saddles, /category/saddles?page=2 and /shop/saddles.", snippetLang: "html", snippet: `<meta name="description"
  content="חנות All4Horses, ציוד מקצועי לסוסים. משלוח חינם.">
<!-- exact same on 3 URLs -->` },
  ],
  "meta-desc-too-long": [
    { url: "/blog/winter-care", location: "<head>, line 12", detail: "167 chars — Google truncates ~160. Last 7 chars get cut.", measurement: "167 chars · target 120-160", snippetLang: "html", snippet: `<meta name="description"
  content="טיפוח הסוס בחורף, מה חשוב לדעת על מזג אוויר קר, איזה ציוד צריך, איך לשמור על מערכת החיסון של הסוס ומה אסור לשכוח. המדריך המלא מצוות All4Horses לרוכבים מנוסים.">
<!-- 167 chars · target ≤ 160 -->` },
    { url: "/category/boots", location: "<head>, line 13", detail: "162 chars. Trim 'יבואן רשמי, אחריות לכל החיים' to keep CTA visible.", measurement: "162 chars · target 120-160", snippetLang: "html", snippet: `<meta name="description" content="..." />   <!-- 162 chars -->` },
  ],
  "missing-h1": [
    { url: "/returns", location: "<body>", detail: "Page renders a custom 404 but has no <h1>.", snippetLang: "html", snippet: `<body>
  <main>
    <p>הדף שחיפשת לא נמצא.</p>   <!-- ⚠ no <h1> above -->
    <a href="/">חזרה לדף הבית</a>
  </main>
</body>` },
    { url: "/sitemap-archive", location: "<body>", detail: "500 error page with no semantic heading.", snippetLang: "html", snippet: `<body>
  <div class="error-page">
    <p>שגיאת שרת זמנית.</p>
  </div>
</body>` },
  ],
  "multiple-h1": [
    { url: "/blog/grooming-routine", location: "<body>", detail: "Hero + article both rendered as <h1>. Demote the hero to a styled <div> or to <h2>.", snippetLang: "html", snippet: `<body>
  <header class="site-hero">
    <h1>All4Horses, ציוד וטיפוח לסוסים</h1>   <!-- ← hero #1 -->
  </header>
  <article>
    <h1>שגרת טיפוח יומית לסוס שלכם</h1>   <!-- ← article #2 -->
  </article>
</body>` },
  ],
  "thin-content": [
    { url: "/shipping", location: "<body>", detail: "Only 198 words — Google considers this thin for an informational page. Recommended ≥ 400 for category/info, ≥ 1000 for guides.", measurement: "198 words · target ≥ 400", snippetLang: "text", snippet: `[Body text excerpt]
"משלוח חינם מעל 300₪. משלוח רגיל 35₪, עד 3 ימי עסקים. משלוח אקספרס 49₪, 24 שעות.
אפשרות איסוף עצמי מהמחסן שלנו בנתניה. החזרות תוך 14 יום, כל פריט במצב חדש."

(... continues for 198 words total)` },
    { url: "/product/saddle-basic", location: "<body>, product description", detail: "Product description is only 156 words. Add specs, use cases, sizing chart.", measurement: "156 words · target ≥ 300", snippetLang: "text", snippet: `[Product description]
"אוכף Basic לרוכבים מתחילים. עור איכותי, מותאם לסוסים בגדלים 15-17.
משקל 6 ק״ג. אחריות שנה."

(... only 156 words on the whole page)` },
    { url: "/contact", location: "<body>", detail: "142 words on contact page. Expected for utility pages — consider noindex if you don't want it ranked.", measurement: "142 words · noindex recommended", snippetLang: "text", snippet: `"צרו קשר עם All4Horses. טלפון: 09-1234567. דוא״ל: info@all4horses.co.il.
שעות פעילות: א-ה 9:00-19:00, ו 9:00-13:00."` },
  ],
  "duplicate-content": [
    { url: "/category/saddles", location: "<body>", detail: "94% similarity to /shop/saddles — same product grid, same intro paragraph.", measurement: "94% body similarity", snippetLang: "text", snippet: `Page A: /category/saddles
Page B: /shop/saddles
─────────────────────────
Shared paragraph (rendered identically on both):

"אוכפים לרכיבה ספורטיבית, אימון יומיומי ותחרויות. All4Horses מציעה מגוון אוכפים
מהמותגים המובילים בעולם — Wintec, Bates, Stubben — עם אחריות יבואן רשמי
ומשלוח חינם מעל 300₪."` },
  ],
  "missing-alt": [
    { url: "/product/saddle-pro", location: "<img>, line 84", detail: "Hero product image without alt. Accessibility + image search loss.", snippetLang: "html", snippet: `<img
  src="/media/saddle-pro-hero.jpg"
  width="1200" height="800"
  loading="eager">
<!--    ⚠ no alt attribute -->` },
    { url: "/blog/grooming-routine", location: "<img>, lines 47, 62, 79", detail: "3 inline images in the article without alt text.", snippetLang: "html", snippet: `<img src="/media/brush-1.jpg">           <!-- line 47, no alt -->
<img src="/media/brush-2.jpg">           <!-- line 62, no alt -->
<img src="/media/hoof-pick.jpg">         <!-- line 79, no alt -->` },
  ],
  "lcp-slow": [
    { url: "/", location: "LCP element", detail: "Hero <img> takes 4.2s to paint. Preload it and serve in AVIF.", measurement: "LCP 4.2s · target ≤ 2.5s", snippetLang: "html", snippet: `<!-- LCP element identified by Lighthouse -->
<img class="hero-banner"
  src="/media/homepage-hero.jpg"   <!-- 1.8 MB JPEG, no preload -->
  width="1920" height="900">

<!-- Fix: add to <head> -->
<link rel="preload" as="image"
  href="/media/homepage-hero.avif"
  fetchpriority="high">` },
    { url: "/category/saddles", location: "LCP element", detail: "Largest paint is a slider initialised by JS. Move it out of the critical path.", measurement: "LCP 3.4s · target ≤ 2.5s", snippetLang: "html", snippet: `<div id="hero-carousel"></div>
<script src="/vendor/swiper.min.js"></script>
<script>
  new Swiper('#hero-carousel', {...});   /* renders LCP image */
</script>` },
  ],
  "inp-slow": [
    { url: "/", location: "Interaction", detail: "Add-to-cart click takes 380ms to respond. Long task in cart.js.", measurement: "INP 380ms · target ≤ 200ms", snippetLang: "css", snippet: `Click on .add-to-cart button
  ↳ event handler (cart.js:84)
  ↳ recompute basket totals (140ms blocking)
  ↳ re-render mini-cart (210ms blocking)
  ↳ analytics flush (30ms)
  = 380ms before next paint` },
  ],
  "cls-high": [
    { url: "/", location: "Above the fold", detail: "Sticky nav inserts after 1.1s and pushes hero 60px down.", measurement: "CLS 0.22 · target ≤ 0.1", snippetLang: "html", snippet: `<header class="sticky-nav"
  style="position: sticky; top: 0;">
  <!-- height: auto, no reserved space -->
</header>

<!-- Fix -->
<header class="sticky-nav"
  style="position: sticky; top: 0;
         height: 60px; min-height: 60px;">` },
    { url: "/category/saddles", location: "Product grid", detail: "Product images load without dimensions — every row shifts as images arrive.", measurement: "CLS 0.18 · target ≤ 0.1", snippetLang: "html", snippet: `<img src="/media/p1.jpg">   <!-- ⚠ no width/height -->

<!-- Fix -->
<img src="/media/p1.jpg" width="400" height="400">` },
  ],
  "page-weight": [
    { url: "/", location: "Total transferred bytes", detail: "5.8 MB on first load. 2.4 MB is the hero JPEG, 1.1 MB is unused JS.", measurement: "5.8 MB · target ≤ 5 MB", snippetLang: "text", snippet: `Transferred:
  • homepage-hero.jpg .................. 2.4 MB  (re-encode AVIF: ~280 KB)
  • bundle.js .......................... 1.1 MB  (40% unused, code-split)
  • slider.js .......................... 380 KB  (defer)
  • Google Fonts (5 weights) ........... 240 KB  (subset to 2)
  • Other ............................. 1.7 MB
                                        ------
Total .................................. 5.8 MB` },
  ],
  "large-images": [
    { url: "/", location: "Image asset", detail: "Hero JPEG is 2.4 MB. Convert to AVIF, serve responsive sizes.", measurement: "2,418 KB · target ≤ 500 KB", snippetLang: "text", snippet: `/media/homepage-hero.jpg
  Format ............ JPEG, quality 95
  Dimensions ........ 3840 × 1800
  File size ......... 2,418 KB
  Recommendation .... AVIF @ 80% quality, srcset for 1920/1280/960 → ~280 KB` },
    { url: "/category/saddles", location: "Image asset · 12 files", detail: "12 product images > 500 KB each. Serve compressed thumbnails on grid.", measurement: "8.6 MB total · target ≤ 500 KB each", snippetLang: "text", snippet: `/media/p-saddle-pro-full.jpg  ..... 1,120 KB
/media/p-saddle-deluxe-full.jpg .. 980 KB
/media/p-saddle-basic-full.jpg ... 740 KB
(... 9 more)` },
  ],
  "broken-internal": [
    { url: "/blog/feeding-tips", location: "<a>, line 137", detail: "Link to /promo/winter-2025 which returns 404.", snippetLang: "html", snippet: `<a href="/promo/winter-2025">
  הצעת חורף — לא לפספס
</a>
<!-- target HTTP 404 Not Found -->` },
    { url: "/category/feed", location: "<a>, line 92", detail: "Link to /returns which returns 404.", snippetLang: "html", snippet: `<a href="/returns" class="footer-link">
  מדיניות החזרות
</a>
<!-- target HTTP 404 Not Found -->` },
  ],
  "broken-external": [
    { url: "/blog/saddle-types", location: "<a>, line 211", detail: "External link to wintec-international.com returns DNS failure.", snippetLang: "html", snippet: `<a href="https://wintec-international.com/saddle-care"
  rel="noopener" target="_blank">
  מדריך טיפוח אוכף מ-Wintec
</a>
<!-- DNS_PROBE_FINISHED_NXDOMAIN since 2026-03-12 -->` },
  ],
  "orphan": [
    { url: "/blog/leg-protection-guide", location: "Internal link graph", detail: "Indexed page with 0 inbound internal links. Add to /blog index or category nav.", snippetLang: "text", snippet: `Inbound internal links to /blog/leg-protection-guide:
  • (none)

Page exists in:
  • sitemap.xml ✓
  • Indexed by Google ✓ (organic traffic: 240 visits / month)

→ Orphaned. Add a link from /blog and from /category/boots.` },
  ],
  "link-to-redirect": [
    { url: "Multiple pages", location: "Anchor tags pointing at /products/* (legacy URL pattern)", detail: "29 internal links resolve through a 301 to /category/*. Update the hrefs to save crawl budget.", snippetLang: "html", snippet: `Found on:
  /                          (4 links)
  /blog/grooming-routine     (3 links)
  /about                     (2 links)
  ...

Pattern:
  <a href="/products/saddles">
        ↑
  ── update to /category/saddles ──
        ↓
  <a href="/category/saddles">` },
  ],
  "excessive-outbound": [
    { url: "/blog/saddle-types", location: "<body>", detail: "Article has 142 outbound links — most are repeated breadcrumb/footer/related-posts.", measurement: "142 outbound · threshold > 100", snippetLang: "text", snippet: `Outbound link distribution:
  • Breadcrumbs ............ 8
  • Main nav ............... 24
  • Article body ........... 14
  • "Related posts" grid ... 60   ← bloated
  • Footer ................. 36
                              ───
  Total .................... 142` },
  ],
  "missing-schema": [
    { url: "/product/saddle-pro", location: "<head>", detail: "Product page without Product JSON-LD. Missing rich snippets (price, rating, availability).", snippetLang: "html", snippet: `<head>
  <title>אוכף Pro לרכיבה ספורטיבית</title>
  <!-- ⚠ no <script type="application/ld+json"> -->
</head>

<!-- Recommended addition -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "אוכף Pro",
  "offers": { "@type": "Offer", "price": "2890", "priceCurrency": "ILS",
              "availability": "https://schema.org/InStock" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.7",
                       "reviewCount": "23" }
}
</script>` },
    { url: "/blog/grooming-routine", location: "<head>", detail: "Blog post without Article JSON-LD.", snippetLang: "html", snippet: `<!-- no Article schema -->` },
  ],
  "invalid-schema": [
    { url: "/product/saddle-deluxe", location: "<script type=\"application/ld+json\">, line 218", detail: "JSON-LD has a trailing comma which breaks parsing. Google ignores the whole block.", snippetLang: "json", snippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "אוכף Deluxe",
  "offers": {
    "@type": "Offer",
    "price": "4290",
    "priceCurrency": "ILS",
  }            ← trailing comma, invalid JSON
}
</script>` },
    { url: "/blog/winter-care", location: "<script type=\"application/ld+json\">, line 184", detail: "Article schema is missing the required 'author' field.", snippetLang: "json", snippet: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "טיפוח הסוס בחורף",
  "datePublished": "2025-12-08"
  /* ⚠ missing required: author, image, publisher */
}` },
  ],
  "missing-og": [
    { url: "/category/saddles", location: "<head>", detail: "No og:title / og:description / og:image. Link previews on WhatsApp, FB, LinkedIn will be broken.", snippetLang: "html", snippet: `<head>
  <title>אוכפים לרכיבה</title>
  <!-- ⚠ no Open Graph tags -->
</head>

<!-- Recommended -->
<meta property="og:title"       content="אוכפים לרכיבה - All4Horses">
<meta property="og:description" content="...">
<meta property="og:image"       content="https://all4horses.co.il/og/saddles.jpg">
<meta property="og:url"         content="https://all4horses.co.il/category/saddles">
<meta property="og:type"        content="website">` },
  ],
  "missing-twitter": [
    { url: "/category/saddles", location: "<head>", detail: "No twitter:card. X.com link previews fall back to plain text.", snippetLang: "html", snippet: `<!-- no twitter:* tags -->

<!-- Recommended -->
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="אוכפים לרכיבה - All4Horses">
<meta name="twitter:description" content="...">
<meta name="twitter:image"       content="https://all4horses.co.il/og/saddles.jpg">` },
  ],
  "hreflang-error": [
    { url: "/category/saddles", location: "<head>, hreflang block", detail: "English alternate points at /en/saddles which doesn't have a return tag back to /category/saddles.", snippetLang: "html", snippet: `<!-- on /category/saddles -->
<link rel="alternate" hreflang="he" href="https://all4horses.co.il/category/saddles">
<link rel="alternate" hreflang="en" href="https://all4horses.co.il/en/saddles">

<!-- on /en/saddles -->
<link rel="alternate" hreflang="en" href="https://all4horses.co.il/en/saddles">
<!-- ⚠ missing return tag to /category/saddles -->` },
  ],
};

// Folder structure derived from MOCK_PAGES
type FolderNode = {
  name: string;
  path: string;
  count: number;
  children: FolderNode[];
};

function buildFolderTree(pages: AuditPage[]): FolderNode {
  const root: FolderNode = { name: "/", path: "/", count: 0, children: [] };
  for (const page of pages) {
    const parts = page.url.split("/").filter(Boolean);
    let node = root;
    node.count += 1;
    let currentPath = "";
    for (const part of parts) {
      currentPath += "/" + part;
      let child = node.children.find((c) => c.name === part);
      if (!child) {
        child = { name: part, path: currentPath, count: 0, children: [] };
        node.children.push(child);
      }
      child.count += 1;
      node = child;
    }
  }
  return root;
}

// ════════════════════════════════════════════════════════════
// PROPS + MAIN COMPONENT
// ════════════════════════════════════════════════════════════

type Props = { theme: Theme; isMobile: boolean; darkMode: boolean };

type SubTab = "overview" | "issues" | "pages" | "structure";

type IssuesJump = { issueId?: string; category?: Category | "all"; severity?: Severity | "all" } | null;

export default function SeoAuditTab({ theme, isMobile, darkMode }: Props) {
  const [audits, setAudits] = useState<AuditRun[]>([]);
  const [activeAuditId, setActiveAuditId] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<SubTab>("overview");
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [inProgress, setInProgress] = useState<null | { phase: number; pagesDone: number; pagesTotal: number; log: string[] }>(null);
  const [issuesJump, setIssuesJump] = useState<IssuesJump>(null);

  const jumpToIssues = (opts?: IssuesJump) => {
    setIssuesJump(opts || null);
    setSubTab("issues");
  };

  // Seed audits + restore from localStorage so the demo persists.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("geoscale-seo-audits-v1");
      if (raw) {
        const parsed = JSON.parse(raw) as AuditRun[];
        setAudits(parsed);
        if (parsed.length) setActiveAuditId(parsed[0].id);
      } else {
        setAudits(MOCK_AUDITS);
        setActiveAuditId(MOCK_AUDITS[0].id);
        localStorage.setItem("geoscale-seo-audits-v1", JSON.stringify(MOCK_AUDITS));
      }
    } catch {
      setAudits(MOCK_AUDITS);
      setActiveAuditId(MOCK_AUDITS[0].id);
    }
  }, []);

  const persistAudits = (next: AuditRun[]) => {
    setAudits(next);
    try { localStorage.setItem("geoscale-seo-audits-v1", JSON.stringify(next)); } catch { /* noop */ }
  };

  const activeAudit = useMemo(() => audits.find((a) => a.id === activeAuditId) || null, [audits, activeAuditId]);
  const previousAudit = useMemo(() => {
    if (!activeAudit) return null;
    const idx = audits.findIndex((a) => a.id === activeAudit.id);
    return idx >= 0 && idx < audits.length - 1 ? audits[idx + 1] : null;
  }, [activeAudit, audits]);

  const startAudit = (settings: AuditSettings) => {
    setSettingsModalOpen(false);
    const pagesTotal = Math.min(settings.maxPages, 500);
    setInProgress({ phase: 0, pagesDone: 0, pagesTotal, log: [] });
  };

  // Drive the in-progress animation
  useEffect(() => {
    if (!inProgress) return;
    const { phase, pagesDone, pagesTotal } = inProgress;

    // Phase 0: Discover (1.5s)
    // Phase 1: Crawl (animated, pagesDone increments)
    // Phase 2: Render (1.5s)
    // Phase 3: Analyse (1.5s)
    // Phase 4: Score (0.8s, then finish)

    if (phase === 0) {
      const t = setTimeout(() => {
        setInProgress({ phase: 1, pagesDone: 0, pagesTotal, log: ["Discovered sitemap.xml", "Discovered sitemap-blog.xml", `Total URLs in frontier: ${pagesTotal}`] });
      }, 1400);
      return () => clearTimeout(t);
    }
    if (phase === 1) {
      if (pagesDone >= pagesTotal) {
        const t = setTimeout(() => setInProgress({ phase: 2, pagesDone, pagesTotal, log: inProgress.log }), 400);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        const increment = Math.max(1, Math.floor(pagesTotal / 60));
        const next = Math.min(pagesTotal, pagesDone + increment);
        const sampleUrls = ["/", "/category/saddles", "/category/feed", "/blog/grooming-routine", "/product/saddle-pro", "/about", "/contact", "/blog/feeding-tips", "/category/blankets", "/category/boots"];
        const url = sampleUrls[next % sampleUrls.length];
        const status = url === "/returns" ? "404" : "200";
        const log = [`Crawled ${url} (${status})`, ...inProgress.log].slice(0, 60);
        setInProgress({ phase: 1, pagesDone: next, pagesTotal, log });
      }, 60);
      return () => clearTimeout(t);
    }
    if (phase === 2) {
      const t = setTimeout(() => setInProgress({ phase: 3, pagesDone, pagesTotal, log: ["JavaScript rendering complete", ...inProgress.log].slice(0, 60) }), 1400);
      return () => clearTimeout(t);
    }
    if (phase === 3) {
      const t = setTimeout(() => setInProgress({ phase: 4, pagesDone, pagesTotal, log: ["Running 37 checks across all pages", ...inProgress.log].slice(0, 60) }), 1600);
      return () => clearTimeout(t);
    }
    if (phase === 4) {
      const t = setTimeout(() => {
        // Build a new audit run
        const newAudit: AuditRun = {
          id: `audit-${Date.now()}`,
          startedAt: new Date(Date.now() - pagesTotal * 600).toISOString(),
          finishedAt: new Date().toISOString(),
          durationSec: 240 + Math.floor(Math.random() * 120),
          pagesCrawled: pagesTotal,
          totalPages: pagesTotal,
          healthScore: 76 + Math.floor(Math.random() * 8),
          errorsCount: 20 + Math.floor(Math.random() * 8),
          warningsCount: 38 + Math.floor(Math.random() * 8),
          noticesCount: 62 + Math.floor(Math.random() * 10),
          settings: DEFAULT_SETTINGS,
          issues: MOCK_AUDITS[0].issues,
        };
        const next = [newAudit, ...audits];
        persistAudits(next);
        setActiveAuditId(newAudit.id);
        setInProgress(null);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [inProgress, audits]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── RENDER ──────────────────────────────────────────────

  // STATE A: in progress
  if (inProgress) {
    return <InProgressView phase={inProgress.phase} pagesDone={inProgress.pagesDone} pagesTotal={inProgress.pagesTotal} log={inProgress.log} theme={theme} isMobile={isMobile} />;
  }

  // STATE B: never audited (no audits at all)
  if (!activeAudit) {
    return (
      <>
        <GeoscaleHoverStyles />
        <EmptyState onRun={() => setSettingsModalOpen(true)} theme={theme} isMobile={isMobile} />
        {settingsModalOpen && <SettingsModal onClose={() => setSettingsModalOpen(false)} onSubmit={startAudit} theme={theme} isMobile={isMobile} darkMode={darkMode} />}
      </>
    );
  }

  // STATE C: has audit history
  return (
    <>
      <GeoscaleHoverStyles />
      <Header
        audit={activeAudit}
        previous={previousAudit}
        audits={audits}
        onSelectAudit={setActiveAuditId}
        onRunNew={() => setSettingsModalOpen(true)}
        theme={theme}
        isMobile={isMobile}
      />

      <SubTabs subTab={subTab} setSubTab={setSubTab} theme={theme} isMobile={isMobile} />

      <div style={{ marginTop: 18 }}>
        {subTab === "overview" && <OverviewView audit={activeAudit} previous={previousAudit} theme={theme} isMobile={isMobile} onJumpIssues={jumpToIssues} onJumpPages={() => setSubTab("pages")} />}
        {subTab === "issues" && <IssuesView audit={activeAudit} theme={theme} isMobile={isMobile} darkMode={darkMode} jumpTo={issuesJump} onConsumeJump={() => setIssuesJump(null)} onJumpPages={() => setSubTab("pages")} />}
        {subTab === "pages" && <PagesView theme={theme} isMobile={isMobile} darkMode={darkMode} />}
        {subTab === "structure" && <StructureView theme={theme} isMobile={isMobile} />}
      </div>

      {settingsModalOpen && <SettingsModal onClose={() => setSettingsModalOpen(false)} onSubmit={startAudit} theme={theme} isMobile={isMobile} darkMode={darkMode} />}
    </>
  );
}

// ════════════════════════════════════════════════════════════
// EMPTY STATE
// ════════════════════════════════════════════════════════════

function EmptyState({ onRun, theme, isMobile }: { onRun: () => void; theme: Theme; isMobile: boolean }) {
  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: isMobile ? 24 : 48, textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", background: `${BRAND_GREEN}15`, color: BRAND_GREEN, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", borderRadius: 999, marginBottom: 16 }}>SEO Audit</div>
      <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: theme.text, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Run a full technical SEO crawl of {DEMO_DOMAIN}</h2>
      <p style={{ fontSize: 15, color: theme.textSecondary, margin: "0 auto 28px", maxWidth: 560, lineHeight: 1.55 }}>We crawl every internal page, render JavaScript, check 37 technical SEO signals across 5 categories, and return a Health Score with a fix list ranked by severity. Typically takes 2-10 minutes.</p>

      <button className="geoscale-cta" onClick={onRun} style={{ padding: "12px 28px", fontSize: 15, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", letterSpacing: "0.01em" }}>Run audit</button>

      <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)", gap: 10 }}>
        {(Object.entries(CATEGORY_LABEL) as [Category, string][]).map(([key, label]) => {
          const count = ISSUE_DEFS.filter((i) => i.category === key).length;
          return (
            <div key={key} style={{ padding: "14px 12px", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 10, textAlign: "left" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13.5, color: theme.text }}>{count} {count === 1 ? "check" : "checks"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SETTINGS MODAL
// ════════════════════════════════════════════════════════════

function SettingsModal({ onClose, onSubmit, theme, isMobile, darkMode }: { onClose: () => void; onSubmit: (s: AuditSettings) => void; theme: Theme; isMobile: boolean; darkMode: boolean }) {
  const [s, setS] = useState<AuditSettings>(DEFAULT_SETTINGS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: isMobile ? "12px" : "40px 20px", overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, maxWidth: 580, width: "100%", padding: isMobile ? 18 : 26, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Configure audit</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.text, margin: 0, letterSpacing: "-0.01em" }}>Run audit for {DEMO_DOMAIN}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: theme.textSecondary }}>×</button>
        </div>

        {/* Seed source */}
        <Field label="Seed source" theme={theme}>
          <RadioGroup
            value={s.seedSource}
            onChange={(v) => setS({ ...s, seedSource: v as AuditSettings["seedSource"] })}
            options={[
              { value: "homepage-sitemap", label: "Homepage + sitemap" },
              { value: "sitemap-only", label: "Sitemap only" },
              { value: "custom", label: "Custom URL list" },
            ]}
            theme={theme}
          />
        </Field>

        {/* Max pages */}
        <Field label="Max pages to crawl" theme={theme}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[100, 500, 2000, 5000].map((n) => (
              <button key={n} onClick={() => setS({ ...s, maxPages: n as AuditSettings["maxPages"] })} style={{
                padding: "7px 14px", fontSize: 13, fontWeight: s.maxPages === n ? 600 : 500,
                background: s.maxPages === n ? `${BRAND_GREEN}15` : theme.tableHeaderBg,
                color: s.maxPages === n ? BRAND_GREEN : theme.textSecondary,
                border: `1px solid ${s.maxPages === n ? BRAND_GREEN : theme.border}`,
                borderRadius: 999, cursor: "pointer", fontVariantNumeric: "tabular-nums",
              }}>{n.toLocaleString()}</button>
            ))}
          </div>
        </Field>

        {/* JS Rendering */}
        <Field label="JavaScript rendering" theme={theme}>
          <Toggle value={s.jsRendering} onChange={(v) => setS({ ...s, jsRendering: v })} hint="Recommended for sites that build content with React/Vue/JS." theme={theme} />
        </Field>

        {/* User agent */}
        <Field label="User agent" theme={theme}>
          <RadioGroup
            value={s.userAgent}
            onChange={(v) => setS({ ...s, userAgent: v as AuditSettings["userAgent"] })}
            options={[
              { value: "desktop", label: "Desktop" },
              { value: "mobile", label: "Mobile" },
            ]}
            theme={theme}
          />
        </Field>

        {/* Robots.txt */}
        <Field label="Respect robots.txt" theme={theme}>
          <Toggle value={s.respectRobots} onChange={(v) => setS({ ...s, respectRobots: v })} hint="Off only for sites where you control the robots.txt directly." theme={theme} />
        </Field>

        {/* Advanced */}
        <div style={{ marginTop: 8, borderTop: `1px solid ${theme.border}`, paddingTop: 14 }}>
          <button onClick={() => setShowAdvanced(!showAdvanced)} style={{ background: "transparent", border: "none", color: theme.textSecondary, fontSize: 13, fontWeight: 500, cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", transform: showAdvanced ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 150ms" }}>▸</span> Advanced settings
          </button>
          {showAdvanced && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              <Field label="Include URLs matching regex" theme={theme}>
                <input value={s.includeRegex || ""} onChange={(e) => setS({ ...s, includeRegex: e.target.value })} placeholder="/blog/.*" style={inputStyle(theme)} />
              </Field>
              <Field label="Exclude URLs matching regex" theme={theme}>
                <input value={s.excludeRegex || ""} onChange={(e) => setS({ ...s, excludeRegex: e.target.value })} placeholder="\\?utm_" style={inputStyle(theme)} />
              </Field>
            </div>
          )}
        </div>

        <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "10px 18px", fontSize: 13, fontWeight: 500, background: "transparent", color: theme.textSecondary, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer" }}>Cancel</button>
          <button className="geoscale-cta" onClick={() => onSubmit(s)} style={{ padding: "10px 22px", fontSize: 13, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Start audit</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, theme }: { label: string; children: React.ReactNode; theme: Theme }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function RadioGroup({ value, onChange, options, theme }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; theme: Theme }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: "7px 14px", fontSize: 13, fontWeight: value === o.value ? 600 : 500,
          background: value === o.value ? `${BRAND_GREEN}15` : theme.tableHeaderBg,
          color: value === o.value ? BRAND_GREEN : theme.textSecondary,
          border: `1px solid ${value === o.value ? BRAND_GREEN : theme.border}`,
          borderRadius: 999, cursor: "pointer",
        }}>{o.label}</button>
      ))}
    </div>
  );
}

function Toggle({ value, onChange, hint, theme }: { value: boolean; onChange: (v: boolean) => void; hint?: string; theme: Theme }) {
  return (
    <div>
      <button onClick={() => onChange(!value)} style={{
        position: "relative", width: 42, height: 24, borderRadius: 999, border: "none",
        background: value ? BRAND_GREEN : theme.barTrack, cursor: "pointer", transition: "background 150ms",
      }}>
        <span style={{ position: "absolute", top: 2, left: value ? 20 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 150ms", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} />
      </button>
      {hint && <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

function inputStyle(theme: Theme): React.CSSProperties {
  return { width: "100%", padding: "8px 12px", fontSize: 13, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 7, color: theme.text, outline: "none", boxSizing: "border-box", fontFamily: "monospace" };
}

// ════════════════════════════════════════════════════════════
// IN-PROGRESS VIEW (5-phase animation)
// ════════════════════════════════════════════════════════════

const PHASES = [
  { id: 0, label: "Discover", body: "Reading sitemap, building URL frontier" },
  { id: 1, label: "Crawl", body: "Fetching every page" },
  { id: 2, label: "Render", body: "Executing JavaScript and snapshotting HTML" },
  { id: 3, label: "Analyse", body: "Running 37 SEO checks against every page" },
  { id: 4, label: "Score", body: "Computing Health Score and building reports" },
];

function InProgressView({ phase, pagesDone, pagesTotal, log, theme, isMobile }: { phase: number; pagesDone: number; pagesTotal: number; log: string[]; theme: Theme; isMobile: boolean }) {
  const pct = phase >= 4 ? 100 : phase === 1 ? Math.min(99, Math.round((pagesDone / pagesTotal) * 80)) : phase === 0 ? 6 : phase === 2 ? 88 : 95;
  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: isMobile ? 18 : 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Audit in progress</div>
          <h2 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: theme.text, margin: 0, letterSpacing: "-0.01em" }}>{PHASES[phase].label}</h2>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4 }}>{PHASES[phase].body}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: theme.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>{phase === 1 ? `${pagesDone.toLocaleString()} / ${pagesTotal.toLocaleString()} pages` : "elapsed"}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, background: theme.barTrack, borderRadius: 999, overflow: "hidden", marginBottom: 22 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: BRAND_GREEN, transition: "width 300ms ease" }} />
      </div>

      {/* Phase tabstrip */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {PHASES.map((p) => {
          const done = p.id < phase;
          const active = p.id === phase;
          const pending = p.id > phase;
          return (
            <div key={p.id} style={{
              padding: "8px 14px", fontSize: 12, fontWeight: active ? 700 : 500,
              background: done ? `${BRAND_GREEN}15` : active ? `${BRAND_GREEN}25` : theme.tableHeaderBg,
              color: done ? BRAND_GREEN : active ? BRAND_GREEN : theme.textMuted,
              border: `1px solid ${done || active ? BRAND_GREEN : theme.border}`,
              borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 6,
              opacity: pending ? 0.55 : 1,
            }}>
              {done && <span>✓</span>}
              {active && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: BRAND_GREEN, animation: "pulse 1s ease-in-out infinite" }} />}
              {p.label}
            </div>
          );
        })}
      </div>

      {/* Live log */}
      {log.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>Live log</div>
          <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 12, maxHeight: 240, overflowY: "auto", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6, color: theme.textSecondary }}>
            {log.map((line, i) => (
              <div key={i} style={{ opacity: 1 - i * 0.015 }}>{line}</div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.4); } }`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// HEADER (shows above all sub-tabs)
// ════════════════════════════════════════════════════════════

function Header({ audit, previous, audits, onSelectAudit, onRunNew, theme, isMobile }: {
  audit: AuditRun; previous: AuditRun | null; audits: AuditRun[]; onSelectAudit: (id: string) => void; onRunNew: () => void; theme: Theme; isMobile: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0, letterSpacing: "-0.01em" }}>SEO Audit</h2>
        {/* Audit picker */}
        <select value={audit.id} onChange={(e) => onSelectAudit(e.target.value)} style={{
          padding: "7px 12px", fontSize: 13, fontWeight: 500, background: theme.inputBg, color: theme.text,
          border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer", outline: "none",
        }}>
          {audits.map((a, idx) => (
            <option key={a.id} value={a.id}>{idx === 0 ? "Latest, " : ""}{new Date(a.startedAt).toLocaleString()}</option>
          ))}
        </select>
        {previous && <span style={{ fontSize: 12, color: theme.textSecondary }}>compared against {new Date(previous.startedAt).toLocaleDateString()}</span>}
      </div>
      <button className="geoscale-cta" onClick={onRunNew} style={{ padding: "9px 18px", fontSize: 13, fontWeight: 600, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Run new audit</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SUB-TABS
// ════════════════════════════════════════════════════════════

function SubTabs({ subTab, setSubTab, theme, isMobile }: { subTab: SubTab; setSubTab: (t: SubTab) => void; theme: Theme; isMobile: boolean }) {
  const tabs: { key: SubTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "issues", label: "Issues" },
    { key: "pages", label: "Pages" },
    { key: "structure", label: "Structure" },
  ];
  return (
    <div style={{ borderBottom: `1px solid ${theme.border}`, display: "flex", gap: 0, overflowX: "auto" }}>
      {tabs.map((t) => (
        <button key={t.key} onClick={() => setSubTab(t.key)} style={{
          padding: isMobile ? "10px 14px" : "12px 20px", fontSize: 14, fontWeight: subTab === t.key ? 600 : 500,
          color: subTab === t.key ? theme.text : theme.textSecondary,
          background: "transparent", border: "none",
          borderBottom: subTab === t.key ? `2px solid ${theme.text}` : "2px solid transparent",
          marginBottom: -1, cursor: "pointer", whiteSpace: "nowrap",
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// OVERVIEW SUB-TAB
// ════════════════════════════════════════════════════════════

function scoreBand(s: number): { label: string; color: string } {
  if (s >= 91) return { label: "Excellent", color: BRAND_GREEN };
  if (s >= 71) return { label: "Good", color: BRAND_GREEN };
  if (s >= 31) return { label: "Fair", color: BRAND_AMBER };
  return { label: "Weak", color: BRAND_RED };
}

function OverviewView({ audit, previous, theme, isMobile, onJumpIssues, onJumpPages }: { audit: AuditRun; previous: AuditRun | null; theme: Theme; isMobile: boolean; onJumpIssues: (opts?: IssuesJump) => void; onJumpPages: () => void }) {
  const band = scoreBand(audit.healthScore);
  const delta = previous ? audit.healthScore - previous.healthScore : null;

  const topIssues = audit.issues
    .map((i) => ({ ...i, def: ISSUE_DEFS.find((d) => d.id === i.id)! }))
    .filter((i) => i.def)
    .sort((a, b) => {
      const sevOrder: Record<Severity, number> = { error: 0, warning: 1, notice: 2 };
      const sa = sevOrder[a.def.severity];
      const sb = sevOrder[b.def.severity];
      if (sa !== sb) return sa - sb;
      return b.affected - a.affected;
    })
    .slice(0, 10);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Score gauge + Severity strip — single horizontal row, slim */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 0, display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden", alignItems: "stretch" }}>
        {/* Score block — inline with severity, tight */}
        <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, borderRight: !isMobile ? `1px solid ${theme.border}` : "none", borderBottom: isMobile ? `1px solid ${theme.border}` : "none", minWidth: isMobile ? "auto" : 240 }}>
          <ScoreGauge score={audit.healthScore} color={band.color} theme={theme} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: 1.2, textTransform: "uppercase" }}>Health Score</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: band.color }}>{band.label}</div>
            {delta !== null && delta !== 0 && (
              <div style={{ fontSize: 11, color: delta >= 0 ? BRAND_GREEN : BRAND_RED, fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} vs prev
              </div>
            )}
          </div>
        </div>

        {/* Severity row — three slim inline segments, each clickable */}
        <div style={{ flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row" }}>
          <SeveritySegment label="Errors" count={audit.errorsCount} delta={previous ? audit.errorsCount - previous.errorsCount : null} color={BRAND_RED} theme={theme} isMobile={isMobile} isFirst onClick={() => onJumpIssues({ severity: "error" })} />
          <SeveritySegment label="Warnings" count={audit.warningsCount} delta={previous ? audit.warningsCount - previous.warningsCount : null} color={BRAND_AMBER} theme={theme} isMobile={isMobile} onClick={() => onJumpIssues({ severity: "warning" })} />
          <SeveritySegment label="Notices" count={audit.noticesCount} delta={previous ? audit.noticesCount - previous.noticesCount : null} color={BRAND_BLUE} theme={theme} isMobile={isMobile} onClick={() => onJumpIssues({ severity: "notice" })} />
        </div>
      </div>

      {/* Audit metadata strip */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: isMobile ? 12 : 24, alignItems: "center", fontSize: 13, color: theme.textSecondary }}>
        <MetaPiece label="Started" value={new Date(audit.startedAt).toLocaleString()} theme={theme} />
        <MetaPiece label="Finished" value={new Date(audit.finishedAt).toLocaleString()} theme={theme} />
        <MetaPiece label="Duration" value={`${Math.floor(audit.durationSec / 60)}m ${audit.durationSec % 60}s`} theme={theme} />
        <MetaPiece label="Pages crawled" value={audit.pagesCrawled.toLocaleString()} theme={theme} clickable onClick={onJumpPages} />
        <MetaPiece label="JS rendering" value={audit.settings.jsRendering ? "On" : "Off"} theme={theme} />
        <MetaPiece label="User agent" value={audit.settings.userAgent === "desktop" ? "Desktop" : "Mobile"} theme={theme} />
      </div>

      {/* Top 10 issues */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: theme.text, margin: 0 }}>Top 10 issues</h3>
          <button className="geoscale-link" onClick={() => onJumpIssues()} style={{ fontSize: 13, fontWeight: 500, color: BRAND_GREEN, background: "transparent", border: "none", cursor: "pointer" }}>View all →</button>
        </div>
        <div>
          {topIssues.map((issue, i) => (
            <button
              key={issue.id}
              className="geoscale-row"
              onClick={() => onJumpIssues({ issueId: issue.id })}
              style={{
                width: "100%",
                padding: "12px 18px",
                borderBottom: i < topIssues.length - 1 ? `1px solid ${theme.border}` : "none",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                background: "transparent", border: "none", borderTop: "none", borderLeft: "none", borderRight: "none",
                cursor: "pointer", textAlign: "left",
                transition: "background 150ms ease, padding 150ms ease",
              }}
            >
              <div style={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", background: `${SEVERITY_COLOR[issue.def.severity]}15`, color: SEVERITY_COLOR[issue.def.severity], borderRadius: 999, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>{SEVERITY_LABEL[issue.def.severity]}</span>
                <span style={{ fontSize: 14, color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{issue.def.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontVariantNumeric: "tabular-nums" }}>{issue.affected} {issue.affected === 1 ? "page" : "pages"}</span>
                <span className="geoscale-row-arrow" style={{ fontSize: 14, color: BRAND_GREEN, opacity: 0, transition: "opacity 150ms ease, transform 150ms ease", display: "inline-block" }}>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5 category cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)", gap: 10 }}>
        {(Object.entries(CATEGORY_LABEL) as [Category, string][]).map(([key, label]) => {
          const issuesInCat = audit.issues.filter((i) => {
            const def = ISSUE_DEFS.find((d) => d.id === i.id);
            return def && def.category === key;
          });
          const total = issuesInCat.reduce((sum, i) => sum + i.affected, 0);
          return (
            <button key={key} className="geoscale-card" onClick={() => onJumpIssues({ category: key })} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "14px 14px", textAlign: "left", cursor: "pointer", transition: "border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, lineHeight: 1.3 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{total.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>{issuesInCat.length} {issuesInCat.length === 1 ? "issue type" : "issue types"}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScoreGauge({ score, color, theme }: { score: number; color: string; theme: Theme }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const size = 86;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={theme.barTrack} strokeWidth="7" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset 600ms ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: theme.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: theme.textMuted, marginTop: 1 }}>/ 100</span>
      </div>
    </div>
  );
}

function SeveritySegment({ label, count, delta, color, theme, isMobile, isFirst, onClick }: { label: string; count: number; delta: number | null; color: string; theme: Theme; isMobile: boolean; isFirst?: boolean; onClick?: () => void }) {
  const deltaGood = (label === "Errors" || label === "Warnings") ? (delta !== null && delta < 0) : false;
  const deltaBad = (label === "Errors" || label === "Warnings") ? (delta !== null && delta > 0) : false;
  return (
    <button onClick={onClick} className="geoscale-row" style={{
      flex: 1, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12,
      borderLeft: !isFirst && !isMobile ? `1px solid ${theme.border}` : "none",
      borderTop: !isFirst && isMobile ? `1px solid ${theme.border}` : "none",
      borderRight: "none", borderBottom: "none",
      minWidth: 0,
      background: "transparent", cursor: onClick ? "pointer" : "default",
      textAlign: "left", transition: "background 150ms ease",
    }}>
      <span style={{ width: 4, alignSelf: "stretch", background: color, borderRadius: 2, flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 1.2, textTransform: "uppercase" }}>{label}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: theme.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{count}</span>
          {delta !== null && delta !== 0 && (
            <span style={{ fontSize: 11, fontWeight: 600, color: deltaGood ? BRAND_GREEN : deltaBad ? BRAND_RED : theme.textSecondary, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              {delta > 0 ? "+" : ""}{delta} vs prev
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function MetaPiece({ label, value, theme, clickable, onClick }: { label: string; value: string; theme: Theme; clickable?: boolean; onClick?: () => void }) {
  const content = (
    <>
      <span style={{ fontSize: 11, color: theme.textMuted, marginRight: 6, letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: clickable ? BRAND_GREEN : theme.text, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </>
  );
  if (clickable) return <button onClick={onClick} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>{content}</button>;
  return <span>{content}</span>;
}

// ════════════════════════════════════════════════════════════
// ISSUES SUB-TAB
// ════════════════════════════════════════════════════════════

function IssuesView({ audit, theme, isMobile, darkMode, onJumpPages, jumpTo, onConsumeJump }: { audit: AuditRun; theme: Theme; isMobile: boolean; darkMode: boolean; onJumpPages: () => void; jumpTo: IssuesJump; onConsumeJump: () => void }) {
  const [catFilter, setCatFilter] = useState<Category | "all">("all");
  const [sevFilter, setSevFilter] = useState<Severity | "all">("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // When the user clicks a specific issue / category / severity on the Overview,
  // jumpTo arrives populated. Apply it once, then clear it.
  useEffect(() => {
    if (!jumpTo) return;
    if (jumpTo.issueId) {
      const def = ISSUE_DEFS.find((d) => d.id === jumpTo.issueId);
      // Clear filters that would hide the target, then expand it.
      setSevFilter("all");
      setCatFilter("all");
      setSearch("");
      setExpanded(jumpTo.issueId);
      // After paint, scroll the expanded row into view.
      requestAnimationFrame(() => {
        const el = document.getElementById(`issue-row-${jumpTo.issueId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      void def;
    } else {
      if (jumpTo.category) setCatFilter(jumpTo.category);
      if (jumpTo.severity) setSevFilter(jumpTo.severity);
      setExpanded(null);
    }
    onConsumeJump();
  }, [jumpTo, onConsumeJump]);

  const rows = audit.issues
    .map((i) => ({ ...i, def: ISSUE_DEFS.find((d) => d.id === i.id)! }))
    .filter((i) => i.def)
    .filter((i) => catFilter === "all" || i.def.category === catFilter)
    .filter((i) => sevFilter === "all" || i.def.severity === sevFilter)
    .filter((i) => !search || i.def.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const sevOrder: Record<Severity, number> = { error: 0, warning: 1, notice: 2 };
      const sa = sevOrder[a.def.severity];
      const sb = sevOrder[b.def.severity];
      if (sa !== sb) return sa - sb;
      return b.affected - a.affected;
    });

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "232px 1fr", gap: 14 }}>
      {/* Sticky filter rail */}
      <div style={{ position: isMobile ? "static" : "sticky", top: 84, alignSelf: "flex-start", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 14, maxHeight: isMobile ? "auto" : "calc(100vh - 100px)", overflowY: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Search</div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter issues..." style={{ ...inputStyle(theme), fontFamily: "inherit", marginBottom: 14 }} />

        <FilterGroup label="Severity" theme={theme}>
          <FilterPill label={`All (${audit.errorsCount + audit.warningsCount + audit.noticesCount})`} active={sevFilter === "all"} onClick={() => setSevFilter("all")} theme={theme} />
          <FilterPill label={`Errors (${audit.errorsCount})`} active={sevFilter === "error"} onClick={() => setSevFilter("error")} color={BRAND_RED} theme={theme} />
          <FilterPill label={`Warnings (${audit.warningsCount})`} active={sevFilter === "warning"} onClick={() => setSevFilter("warning")} color={BRAND_AMBER} theme={theme} />
          <FilterPill label={`Notices (${audit.noticesCount})`} active={sevFilter === "notice"} onClick={() => setSevFilter("notice")} color={BRAND_BLUE} theme={theme} />
        </FilterGroup>
        <FilterGroup label="Category" theme={theme}>
          <FilterPill label="All categories" active={catFilter === "all"} onClick={() => setCatFilter("all")} theme={theme} />
          {(Object.entries(CATEGORY_LABEL) as [Category, string][]).map(([key, label]) => {
            const count = audit.issues
              .map((i) => ISSUE_DEFS.find((d) => d.id === i.id))
              .filter((d) => d && d.category === key).length;
            return <FilterPill key={key} label={`${label} (${count})`} active={catFilter === key} onClick={() => setCatFilter(key)} theme={theme} />;
          })}
        </FilterGroup>

        <div style={{ marginTop: 10, paddingTop: 12, borderTop: `1px solid ${theme.border}`, fontSize: 11, color: theme.textMuted, lineHeight: 1.55 }}>
          Expand any issue to see the exact URLs, the offending HTML / text snippet, and the location on the page.
        </div>
      </div>

      {/* Issues list */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 13, color: theme.textSecondary }}>
            Showing <strong style={{ color: theme.text, fontVariantNumeric: "tabular-nums" }}>{rows.length}</strong> issue {rows.length === 1 ? "type" : "types"}
            <span style={{ color: theme.textMuted }}> · across {rows.reduce((s, r) => s + r.affected, 0).toLocaleString()} affected pages</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setExpanded(null)} style={{ fontSize: 12, fontWeight: 500, color: theme.textSecondary, background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>Collapse all</button>
            <button onClick={onJumpPages} style={{ fontSize: 12, fontWeight: 500, color: theme.textSecondary, background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>Open Page Explorer →</button>
          </div>
        </div>

        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
          {rows.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: theme.textSecondary }}>No issues match the current filters.</div>
          ) : (
            rows.map((row, i) => {
              const isOpen = expanded === row.id;
              const locations = MOCK_ISSUE_LOCATIONS[row.id] || [];
              return (
                <div id={`issue-row-${row.id}`} key={row.id} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${theme.border}` : "none", background: isOpen ? theme.bg : "transparent", transition: "background 150ms", scrollMarginTop: 84 }}>
                  <button className="geoscale-row" onClick={() => setExpanded(isOpen ? null : row.id)} style={{ width: "100%", padding: isMobile ? "12px 14px" : "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background 150ms ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", background: SEVERITY_COLOR[row.def.severity], color: "#fff", borderRadius: 4, letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap" }}>{SEVERITY_LABEL[row.def.severity]}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.def.name}</div>
                        {!isMobile && <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{CATEGORY_LABEL[row.def.category]}</div>}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{row.affected}</div>
                        <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2, letterSpacing: 0.4, textTransform: "uppercase" }}>{row.affected === 1 ? "page" : "pages"}</div>
                      </div>
                      <span style={{ fontSize: 16, color: BRAND_GREEN, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 200ms", display: "inline-block", width: 16, textAlign: "center" }}>▸</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ padding: isMobile ? "0 14px 16px" : "0 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
                        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 12 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Why it matters</div>
                          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.55 }}>{row.def.description}</div>
                        </div>
                        <div style={{ background: `${BRAND_GREEN}10`, border: `1px solid ${BRAND_GREEN}50`, borderRadius: 8, padding: 12 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>How to fix</div>
                          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.55 }}>{row.def.fix}</div>
                        </div>
                      </div>

                      <IssueLocations
                        issueId={row.id}
                        issueName={row.def.name}
                        severity={row.def.severity}
                        affected={row.affected}
                        locations={locations}
                        theme={theme}
                        isMobile={isMobile}
                        darkMode={darkMode}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ── PER-ISSUE LOCATIONS DRILLDOWN ─────────────────────────
function IssueLocations({ issueId, issueName, severity, affected, locations, theme, isMobile, darkMode }: {
  issueId: string; issueName: string; severity: Severity; affected: number; locations: IssueLocation[]; theme: Theme; isMobile: boolean; darkMode: boolean;
}) {
  const [urlSearch, setUrlSearch] = useState("");
  const [expandedUrl, setExpandedUrl] = useState<string | null>(locations.length > 0 ? locations[0].url + "::0" : null);

  const filtered = locations.filter((l) => !urlSearch || l.url.toLowerCase().includes(urlSearch.toLowerCase()));
  const isSampled = locations.length < affected;

  if (locations.length === 0) {
    return (
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 18, textAlign: "center", color: theme.textSecondary, fontSize: 13 }}>
        Per-URL evidence for this check will appear here once the live crawler runs. The demo seeds evidence for the most common issue types.
      </div>
    );
  }

  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", background: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: theme.textSecondary, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, color: theme.text, letterSpacing: 0.4, textTransform: "uppercase", fontSize: 11 }}>Affected URLs</span>
          <span style={{ color: theme.textMuted }}>·</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{isSampled ? `Showing ${filtered.length} of ${affected} (sample)` : `${filtered.length} of ${affected}`}</span>
        </div>
        <input value={urlSearch} onChange={(e) => setUrlSearch(e.target.value)} placeholder="Filter URLs..." style={{
          padding: "6px 10px", fontSize: 12, background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 6, color: theme.text, outline: "none", maxWidth: 240, width: "100%", fontFamily: "inherit",
        }} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: theme.textSecondary, fontSize: 13 }}>No URLs match the filter.</div>
      ) : (
        filtered.map((loc, idx) => {
          const key = loc.url + "::" + idx;
          const open = expandedUrl === key;
          return (
            <div key={key} style={{ borderTop: idx === 0 ? "none" : `1px solid ${theme.border}` }}>
              <button onClick={() => setExpandedUrl(open ? null : key)} style={{ width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                  <span style={{ width: 14, color: SEVERITY_COLOR[severity], fontSize: 11, flexShrink: 0, display: "inline-block", textAlign: "center", transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 150ms" }}>▸</span>
                  <span style={{ fontFamily: "monospace", fontSize: 12.5, color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{loc.url}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "monospace", whiteSpace: "nowrap", display: isMobile ? "none" : "inline" }}>{loc.location}</span>
                </div>
              </button>

              {open && (
                <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", background: `${SEVERITY_COLOR[severity]}15`, color: SEVERITY_COLOR[severity], borderRadius: 4, letterSpacing: 0.4, textTransform: "uppercase" }}>{SEVERITY_LABEL[severity]}</span>
                    <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "monospace" }}>📍 {loc.location}</span>
                    {loc.measurement && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: SEVERITY_COLOR[severity], fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}>{loc.measurement}</span>
                    )}
                  </div>

                  <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.55 }}>{loc.detail}</div>

                  <CodeBlock snippet={loc.snippet} lang={loc.snippetLang || "html"} theme={theme} darkMode={darkMode} />

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a href={`https://${DEMO_DOMAIN}${loc.url.startsWith("/") ? loc.url : "/" + loc.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: BRAND_GREEN, background: "transparent", border: `1px solid ${BRAND_GREEN}50`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                      Open live page ↗
                    </a>
                    <CopyButton text={loc.snippet} label="Copy snippet" theme={theme} />
                    {issueId.startsWith("missing-") || issueId === "duplicate-title" || issueId === "duplicate-meta-desc" ? (
                      <button onClick={() => alert(`(Demo) Would send a fix-it ticket for "${issueName}" on ${loc.url} to the editor.`)} style={{ fontSize: 12, fontWeight: 600, color: theme.textSecondary, background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>Send to editor →</button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {isSampled && (
        <div style={{ padding: "10px 14px", background: theme.tableHeaderBg, borderTop: `1px solid ${theme.border}`, fontSize: 12, color: theme.textMuted, textAlign: "center" }}>
          Showing a representative sample. The full list of {affected} URLs is available via CSV export once the live crawler runs.
        </div>
      )}
    </div>
  );
}

// ── CODE BLOCK with simple HTML/JSON tokenisation ──────────
function CodeBlock({ snippet, lang, theme, darkMode }: { snippet: string; lang: "html" | "text" | "json" | "css" | "http"; theme: Theme; darkMode: boolean }) {
  const lines = snippet.split("\n");
  const bg = darkMode ? "#0B1015" : "#0F172A";
  const baseColor = darkMode ? "#D6DEE8" : "#E2E8F0";
  return (
    <div style={{ background: bg, borderRadius: 8, overflow: "hidden", border: `1px solid ${darkMode ? "#1A2330" : "#1E293B"}` }}>
      <div style={{ padding: "6px 12px", background: darkMode ? "#0F1722" : "#1E293B", borderBottom: `1px solid ${darkMode ? "#1A2330" : "#0F172A"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#7BA9C9", letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "monospace" }}>{lang}</span>
        <span style={{ fontSize: 10, color: "#5C7896", fontFamily: "monospace" }}>{lines.length} {lines.length === 1 ? "line" : "lines"}</span>
      </div>
      <pre style={{ margin: 0, padding: "10px 0", fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace", fontSize: 12, lineHeight: 1.65, color: baseColor, overflowX: "auto", whiteSpace: "pre", direction: "ltr" }}>
        {lines.map((line, i) => (
          <div key={i} style={{ padding: "0 14px 0 12px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ width: 24, flexShrink: 0, textAlign: "right", color: "#475569", userSelect: "none", fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
            <span style={{ flex: 1, minWidth: 0 }}>{tokenize(line, lang)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function tokenize(line: string, lang: "html" | "text" | "json" | "css" | "http"): React.ReactNode {
  if (!line.trim()) return " ";
  const commentColor = "#64748B";
  const commentStyle = { color: commentColor, fontStyle: "italic" as const };

  if (lang === "html") {
    const commentMatch = line.match(/^(\s*)(<!--.*?-->)(.*)$/);
    if (commentMatch) {
      return <><span>{commentMatch[1]}</span><span style={commentStyle}>{commentMatch[2]}</span><span>{commentMatch[3]}</span></>;
    }
    const tagMatches = Array.from(line.matchAll(/(<\/?[\w-]+)([^>]*?)(>|$)/g));
    if (tagMatches.length === 0) return line;
    const parts: React.ReactNode[] = [];
    let cursor = 0;
    tagMatches.forEach((m, mi) => {
      const start = m.index ?? 0;
      if (start > cursor) parts.push(<span key={`pre${mi}`}>{line.slice(cursor, start)}</span>);
      parts.push(<span key={`open${mi}`} style={{ color: "#7DD3FC" }}>{m[1]}</span>);
      const attrs = m[2];
      const attrMatches = Array.from(attrs.matchAll(/([\w-]+)(=)("[^"]*"|'[^']*')/g));
      if (attrMatches.length === 0) {
        parts.push(<span key={`attrs${mi}`}>{attrs}</span>);
      } else {
        let acursor = 0;
        attrMatches.forEach((am, ami) => {
          const astart = am.index ?? 0;
          if (astart > acursor) parts.push(<span key={`ap${mi}-${ami}`}>{attrs.slice(acursor, astart)}</span>);
          parts.push(<span key={`an${mi}-${ami}`} style={{ color: "#FCD34D" }}>{am[1]}</span>);
          parts.push(<span key={`ae${mi}-${ami}`}>{am[2]}</span>);
          parts.push(<span key={`av${mi}-${ami}`} style={{ color: "#86EFAC" }}>{am[3]}</span>);
          acursor = astart + am[0].length;
        });
        if (acursor < attrs.length) parts.push(<span key={`ar${mi}`}>{attrs.slice(acursor)}</span>);
      }
      parts.push(<span key={`close${mi}`} style={{ color: "#7DD3FC" }}>{m[3]}</span>);
      cursor = start + m[0].length;
    });
    if (cursor < line.length) parts.push(<span key="tail">{line.slice(cursor)}</span>);
    return <>{parts}</>;
  }

  if (lang === "json") {
    const commentMatch = line.match(/^(\s*)(\/\*.*?\*\/|\/\/.*)$/);
    if (commentMatch) return <><span>{commentMatch[1]}</span><span style={commentStyle}>{commentMatch[2]}</span></>;
    const keyMatch = line.match(/^(\s*)("[^"]+")(\s*:\s*)(.*)$/);
    if (keyMatch) {
      const valuePart = keyMatch[4];
      const stringValue = valuePart.match(/^(".*?")(.*)$/);
      const numericValue = valuePart.match(/^(-?\d+\.?\d*)(.*)$/);
      return (
        <>
          <span>{keyMatch[1]}</span>
          <span style={{ color: "#7DD3FC" }}>{keyMatch[2]}</span>
          <span>{keyMatch[3]}</span>
          {stringValue ? <><span style={{ color: "#86EFAC" }}>{stringValue[1]}</span><span>{stringValue[2]}</span></>
            : numericValue ? <><span style={{ color: "#FCA5A5" }}>{numericValue[1]}</span><span>{numericValue[2]}</span></>
            : <span>{valuePart}</span>}
        </>
      );
    }
    return line;
  }

  if (lang === "http") {
    const statusMatch = line.match(/^(HTTP\/[\d.]+)\s+(\d{3})\s+(.+)$/);
    if (statusMatch) {
      const code = parseInt(statusMatch[2], 10);
      const codeColor = code >= 500 ? "#FCA5A5" : code >= 400 ? "#FCA5A5" : code >= 300 ? "#FCD34D" : "#86EFAC";
      return <><span style={{ color: "#7DD3FC" }}>{statusMatch[1]}</span> <span style={{ color: codeColor, fontWeight: 700 }}>{statusMatch[2]}</span> <span style={{ color: codeColor }}>{statusMatch[3]}</span></>;
    }
    const methodMatch = line.match(/^(GET|POST|HEAD|PUT|DELETE)\s+(.+)$/);
    if (methodMatch) return <><span style={{ color: "#FCD34D", fontWeight: 700 }}>{methodMatch[1]}</span> <span>{methodMatch[2]}</span></>;
    const headerMatch = line.match(/^([\w-]+):(.*)$/);
    if (headerMatch) return <><span style={{ color: "#7DD3FC" }}>{headerMatch[1]}</span><span>:</span><span style={{ color: "#86EFAC" }}>{headerMatch[2]}</span></>;
    if (line.includes("→")) return <span style={{ color: "#FCD34D" }}>{line}</span>;
    return line;
  }

  return line;
}

function CopyButton({ text, label, theme }: { text: string; label: string; theme: Theme }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }
    }} style={{ fontSize: 12, fontWeight: 600, color: copied ? BRAND_GREEN : theme.textSecondary, background: theme.tableHeaderBg, border: `1px solid ${copied ? BRAND_GREEN : theme.border}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", transition: "all 150ms" }}>
      {copied ? "Copied ✓" : label}
    </button>
  );
}

function FilterGroup({ label, children, theme }: { label: string; children: React.ReactNode; theme: Theme }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{children}</div>
    </div>
  );
}

function FilterPill({ label, active, onClick, color, theme }: { label: string; active: boolean; onClick: () => void; color?: string; theme: Theme }) {
  const c = color || BRAND_GREEN;
  return (
    <button className={active ? "" : "geoscale-pill"} onClick={onClick} style={{
      padding: "7px 10px", fontSize: 13, fontWeight: active ? 600 : 500, textAlign: "left",
      background: active ? `${c}15` : "transparent",
      color: active ? c : theme.text,
      border: `1px solid ${active ? c : "transparent"}`,
      borderRadius: 7, cursor: "pointer",
      transition: "background 120ms ease, color 120ms ease, border-color 120ms ease",
    }}>{label}</button>
  );
}

// ════════════════════════════════════════════════════════════
// PAGES SUB-TAB (Page Explorer)
// ════════════════════════════════════════════════════════════

function PagesView({ theme, isMobile, darkMode }: { theme: Theme; isMobile: boolean; darkMode: boolean }) {
  const [statusFilter, setStatusFilter] = useState<"all" | "200" | "redirect" | "4xx" | "5xx">("all");
  const [search, setSearch] = useState("");
  const [hasIssuesOnly, setHasIssuesOnly] = useState(false);
  const [drawer, setDrawer] = useState<AuditPage | null>(null);
  const [sort, setSort] = useState<{ col: keyof AuditPage; dir: "asc" | "desc" }>({ col: "depth", dir: "asc" });

  const filtered = useMemo(() => {
    return MOCK_PAGES
      .filter((p) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "200") return p.statusCode === 200;
        if (statusFilter === "redirect") return p.statusCode >= 300 && p.statusCode < 400;
        if (statusFilter === "4xx") return p.statusCode >= 400 && p.statusCode < 500;
        if (statusFilter === "5xx") return p.statusCode >= 500;
        return true;
      })
      .filter((p) => !hasIssuesOnly || p.issues.length > 0)
      .filter((p) => !search || p.url.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const av = a[sort.col]; const bv = b[sort.col];
        if (typeof av === "number" && typeof bv === "number") return sort.dir === "asc" ? av - bv : bv - av;
        if (typeof av === "string" && typeof bv === "string") return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        return 0;
      });
  }, [statusFilter, search, hasIssuesOnly, sort]);

  const headerCol = (label: string, col: keyof AuditPage, align: "left" | "right" = "left") => (
    <th onClick={() => setSort({ col, dir: sort.col === col && sort.dir === "asc" ? "desc" : "asc" })} style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, color: theme.textSecondary, textAlign: align, cursor: "pointer", whiteSpace: "nowrap", borderBottom: `1px solid ${theme.border}`, background: theme.tableHeaderBg, position: "sticky", top: 0, letterSpacing: 0.3 }}>
      {label} {sort.col === col && (sort.dir === "asc" ? "↑" : "↓")}
    </th>
  );

  return (
    <>
      {/* Filter bar */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 12, marginBottom: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search URL or title..." style={{ ...inputStyle(theme), maxWidth: 260, fontFamily: "inherit" }} />
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "200", "redirect", "4xx", "5xx"] as const).map((k) => (
            <button key={k} onClick={() => setStatusFilter(k)} style={{
              padding: "7px 12px", fontSize: 12, fontWeight: statusFilter === k ? 600 : 500,
              background: statusFilter === k ? `${BRAND_GREEN}15` : theme.tableHeaderBg,
              color: statusFilter === k ? BRAND_GREEN : theme.textSecondary,
              border: `1px solid ${statusFilter === k ? BRAND_GREEN : theme.border}`,
              borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
            }}>{k === "all" ? "All" : k.toUpperCase()}</button>
          ))}
        </div>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: theme.textSecondary, cursor: "pointer" }}>
          <input type="checkbox" checked={hasIssuesOnly} onChange={(e) => setHasIssuesOnly(e.target.checked)} />
          With issues only
        </label>
        <span style={{ marginLeft: "auto", fontSize: 12, color: theme.textSecondary }}>{filtered.length} of {MOCK_PAGES.length} pages</span>
      </div>

      {/* Table */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", maxHeight: 600 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {headerCol("URL", "url")}
                {headerCol("Status", "statusCode", "right")}
                {headerCol("Title", "title")}
                {headerCol("Words", "wordCount", "right")}
                {headerCol("Depth", "depth", "right")}
                {headerCol("Inlinks", "inlinks", "right")}
                {headerCol("Indexable", "indexable")}
                <th style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, color: theme.textSecondary, textAlign: "right", borderBottom: `1px solid ${theme.border}`, background: theme.tableHeaderBg, position: "sticky", top: 0 }}>Issues</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const statusColor = p.statusCode >= 500 ? BRAND_RED : p.statusCode >= 400 ? BRAND_RED : p.statusCode >= 300 ? BRAND_AMBER : BRAND_GREEN;
                return (
                  <tr key={p.url} className="geoscale-row" onClick={() => setDrawer(p)} style={{ cursor: "pointer", background: i % 2 === 0 ? theme.cardBg : theme.bg, borderBottom: i < filtered.length - 1 ? `1px solid ${theme.border}` : "none", transition: "background 120ms ease" }}>
                    <td style={{ padding: "10px 12px", color: theme.text, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace", fontSize: 12 }}>{p.url}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right" }}><span style={{ color: statusColor, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{p.statusCode}</span></td>
                    <td style={{ padding: "10px 12px", color: theme.text, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title || <span style={{ color: theme.textMuted, fontStyle: "italic" }}>missing</span>}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{p.wordCount}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{p.depth}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: theme.text }}>{p.inlinks}</td>
                    <td style={{ padding: "10px 12px" }}>
                      {p.indexable ? <span style={{ fontSize: 12, color: BRAND_GREEN, fontWeight: 500 }}>Yes</span> : <span style={{ fontSize: 12, color: theme.textMuted }}>{p.indexableReason || "No"}</span>}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right" }}>
                      {p.issues.length > 0 ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: BRAND_AMBER }}>{p.issues.length}</span> : <span style={{ fontSize: 12, color: theme.textMuted }}>0</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {drawer && <PageDrawer page={drawer} onClose={() => setDrawer(null)} theme={theme} isMobile={isMobile} darkMode={darkMode} />}
    </>
  );
}

function PageDrawer({ page, onClose, theme, isMobile, darkMode }: { page: AuditPage; onClose: () => void; theme: Theme; isMobile: boolean; darkMode: boolean }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: theme.cardBg, width: isMobile ? "100%" : 640, height: "100vh", overflowY: "auto", padding: 22, boxShadow: "-8px 0 30px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 10 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Page details</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text, margin: 0, wordBreak: "break-all", lineHeight: 1.3, fontFamily: "monospace" }}>{page.url}</h3>
            <a href={`https://${DEMO_DOMAIN}${page.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: BRAND_GREEN, textDecoration: "none", marginTop: 6, display: "inline-block" }}>Open live page ↗</a>
          </div>
          <button onClick={onClose} style={{ background: theme.tableHeaderBg, border: `1px solid ${theme.border}`, borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: theme.textSecondary, flexShrink: 0 }}>×</button>
        </div>

        <Row label="Status code" value={String(page.statusCode)} theme={theme} />
        <Row label="Indexable" value={page.indexable ? "Yes" : page.indexableReason || "No"} theme={theme} />
        <Row label="Title" value={page.title || "missing"} theme={theme} />
        <Row label="Title length" value={`${page.titleLength} chars`} theme={theme} />
        <Row label="Meta description length" value={page.metaDescLength ? `${page.metaDescLength} chars` : "missing"} theme={theme} />
        <Row label="H1" value={page.h1 || "missing"} theme={theme} />
        <Row label="Word count" value={String(page.wordCount)} theme={theme} />
        <Row label="Depth" value={`${page.depth} clicks from homepage`} theme={theme} />
        <Row label="Inlinks" value={String(page.inlinks)} theme={theme} />
        <Row label="Outlinks" value={String(page.outlinks)} theme={theme} />

        {page.issues.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 10 }}>Issues found on this page ({page.issues.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {page.issues.map((id) => {
                const def = ISSUE_DEFS.find((d) => d.id === id);
                if (!def) return null;
                const loc = (MOCK_ISSUE_LOCATIONS[id] || []).find((l) => l.url === page.url) || (MOCK_ISSUE_LOCATIONS[id] || [])[0];
                return (
                  <div key={id} style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: loc ? `1px solid ${theme.border}` : "none" }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", background: SEVERITY_COLOR[def.severity], color: "#fff", borderRadius: 4, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>{SEVERITY_LABEL[def.severity]}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{def.name}</div>
                        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{CATEGORY_LABEL[def.category]}</div>
                      </div>
                    </div>
                    {loc && (
                      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "monospace" }}>📍 {loc.location}</span>
                          {loc.measurement && <span style={{ fontSize: 11, fontWeight: 600, color: SEVERITY_COLOR[def.severity], fontFamily: "monospace" }}>{loc.measurement}</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: theme.text, lineHeight: 1.5 }}>{loc.detail}</div>
                        <CodeBlock snippet={loc.snippet} lang={loc.snippetLang || "html"} theme={theme} darkMode={darkMode} />
                        <div style={{ fontSize: 12, color: theme.textSecondary, padding: "8px 10px", background: `${BRAND_GREEN}10`, border: `1px solid ${BRAND_GREEN}30`, borderRadius: 6, lineHeight: 1.5 }}>
                          <strong style={{ color: BRAND_GREEN, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Fix</strong>
                          {def.fix}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, theme }: { label: string; value: string; theme: Theme }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: `1px solid ${theme.border}`, fontSize: 13 }}>
      <span style={{ color: theme.textSecondary }}>{label}</span>
      <span style={{ color: theme.text, fontWeight: 500, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STRUCTURE SUB-TAB
// ════════════════════════════════════════════════════════════

function StructureView({ theme, isMobile }: { theme: Theme; isMobile: boolean }) {
  const tree = useMemo(() => buildFolderTree(MOCK_PAGES), []);
  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 14 }}>URL distribution by folder. V2 will replace this with an interactive treemap.</div>
      <TreeNode node={tree} depth={0} theme={theme} />
    </div>
  );
}

function TreeNode({ node, depth, theme }: { node: FolderNode; depth: number; theme: Theme }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children.length > 0;
  return (
    <div>
      <button onClick={() => hasChildren && setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", width: "100%", background: "transparent", border: "none", cursor: hasChildren ? "pointer" : "default", textAlign: "left", borderRadius: 6 }}>
        <span style={{ width: 16, color: theme.textMuted, fontSize: 11, display: "inline-block" }}>{hasChildren ? (open ? "▾" : "▸") : "·"}</span>
        <span style={{ fontFamily: "monospace", fontSize: 13, color: theme.text }}>{node.name === "/" ? "/ (root)" : node.name}</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: theme.textSecondary, fontVariantNumeric: "tabular-nums" }}>{node.count} {node.count === 1 ? "URL" : "URLs"}</span>
      </button>
      {open && hasChildren && (
        <div style={{ marginLeft: 16, borderLeft: `1px solid ${theme.border}`, paddingLeft: 8 }}>
          {node.children.sort((a, b) => b.count - a.count).map((child) => (
            <TreeNode key={child.path} node={child} depth={depth + 1} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}
