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

export default function SeoAuditTab({ theme, isMobile, darkMode }: Props) {
  const [audits, setAudits] = useState<AuditRun[]>([]);
  const [activeAuditId, setActiveAuditId] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<SubTab>("overview");
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [inProgress, setInProgress] = useState<null | { phase: number; pagesDone: number; pagesTotal: number; log: string[] }>(null);

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
        <EmptyState onRun={() => setSettingsModalOpen(true)} theme={theme} isMobile={isMobile} />
        {settingsModalOpen && <SettingsModal onClose={() => setSettingsModalOpen(false)} onSubmit={startAudit} theme={theme} isMobile={isMobile} darkMode={darkMode} />}
      </>
    );
  }

  // STATE C: has audit history
  return (
    <>
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
        {subTab === "overview" && <OverviewView audit={activeAudit} previous={previousAudit} theme={theme} isMobile={isMobile} onJumpIssues={() => setSubTab("issues")} onJumpPages={() => setSubTab("pages")} />}
        {subTab === "issues" && <IssuesView audit={activeAudit} theme={theme} isMobile={isMobile} onJumpPages={() => setSubTab("pages")} />}
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

      <button onClick={onRun} style={{ padding: "12px 28px", fontSize: 15, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", letterSpacing: "0.01em" }}>Run audit</button>

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
          <button onClick={() => onSubmit(s)} style={{ padding: "10px 22px", fontSize: 13, fontWeight: 700, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Start audit</button>
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
      <button onClick={onRunNew} style={{ padding: "9px 18px", fontSize: 13, fontWeight: 600, background: BRAND_GREEN, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Run new audit</button>
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

function OverviewView({ audit, previous, theme, isMobile, onJumpIssues, onJumpPages }: { audit: AuditRun; previous: AuditRun | null; theme: Theme; isMobile: boolean; onJumpIssues: () => void; onJumpPages: () => void }) {
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

      {/* Score + Severity row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "320px 1fr", gap: 14 }}>

        {/* Score card */}
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>Health Score</div>
          <ScoreGauge score={audit.healthScore} color={band.color} theme={theme} />
          <div style={{ fontSize: 14, fontWeight: 600, color: band.color, marginTop: 10 }}>{band.label}</div>
          {delta !== null && (
            <div style={{ fontSize: 13, color: delta >= 0 ? BRAND_GREEN : BRAND_RED, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} vs previous
            </div>
          )}
        </div>

        {/* Severity counters */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 10 }}>
          <SeverityCard label="Errors" count={audit.errorsCount} delta={previous ? audit.errorsCount - previous.errorsCount : null} color={BRAND_RED} hint="Must fix, lower Health Score" theme={theme} onClick={onJumpIssues} />
          <SeverityCard label="Warnings" count={audit.warningsCount} delta={previous ? audit.warningsCount - previous.warningsCount : null} color={BRAND_AMBER} hint="Fix after errors" theme={theme} onClick={onJumpIssues} />
          <SeverityCard label="Notices" count={audit.noticesCount} delta={previous ? audit.noticesCount - previous.noticesCount : null} color={BRAND_BLUE} hint="Nudges, cosmetic" theme={theme} onClick={onJumpIssues} />
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
          <button onClick={onJumpIssues} style={{ fontSize: 13, fontWeight: 500, color: BRAND_GREEN, background: "transparent", border: "none", cursor: "pointer" }}>View all →</button>
        </div>
        <div>
          {topIssues.map((issue, i) => (
            <div key={issue.id} style={{ padding: "12px 18px", borderBottom: i < topIssues.length - 1 ? `1px solid ${theme.border}` : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
              <div style={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", background: `${SEVERITY_COLOR[issue.def.severity]}15`, color: SEVERITY_COLOR[issue.def.severity], borderRadius: 999, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>{SEVERITY_LABEL[issue.def.severity]}</span>
                <span style={{ fontSize: 14, color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{issue.def.name}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{issue.affected} {issue.affected === 1 ? "page" : "pages"}</span>
            </div>
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
            <button key={key} onClick={onJumpIssues} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "14px 14px", textAlign: "left", cursor: "pointer" }}>
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
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke={theme.barTrack} strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset 600ms ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: theme.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function SeverityCard({ label, count, delta, color, hint, theme, onClick }: { label: string; count: number; delta: number | null; color: string; hint: string; theme: Theme; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderLeft: `4px solid ${color}`, borderRadius: 10, padding: "16px 18px", textAlign: "left", cursor: "pointer" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: theme.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{count}</span>
        {delta !== null && delta !== 0 && (
          <span style={{ fontSize: 13, fontWeight: 600, color: (label === "Errors" || label === "Warnings") ? (delta < 0 ? BRAND_GREEN : BRAND_RED) : theme.textSecondary, fontVariantNumeric: "tabular-nums" }}>
            {delta > 0 ? "+" : ""}{delta}
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 6 }}>{hint}</div>
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

function IssuesView({ audit, theme, isMobile, onJumpPages }: { audit: AuditRun; theme: Theme; isMobile: boolean; onJumpPages: () => void }) {
  const [catFilter, setCatFilter] = useState<Category | "all">("all");
  const [sevFilter, setSevFilter] = useState<Severity | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const rows = audit.issues
    .map((i) => ({ ...i, def: ISSUE_DEFS.find((d) => d.id === i.id)! }))
    .filter((i) => i.def)
    .filter((i) => catFilter === "all" || i.def.category === catFilter)
    .filter((i) => sevFilter === "all" || i.def.severity === sevFilter)
    .sort((a, b) => {
      const sevOrder: Record<Severity, number> = { error: 0, warning: 1, notice: 2 };
      const sa = sevOrder[a.def.severity];
      const sb = sevOrder[b.def.severity];
      if (sa !== sb) return sa - sb;
      return b.affected - a.affected;
    });

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr", gap: 14 }}>
      {/* Filter rail */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 14, height: "fit-content" }}>
        <FilterGroup label="Severity" theme={theme}>
          <FilterPill label="All" active={sevFilter === "all"} onClick={() => setSevFilter("all")} theme={theme} />
          <FilterPill label={`Errors (${audit.errorsCount})`} active={sevFilter === "error"} onClick={() => setSevFilter("error")} color={BRAND_RED} theme={theme} />
          <FilterPill label={`Warnings (${audit.warningsCount})`} active={sevFilter === "warning"} onClick={() => setSevFilter("warning")} color={BRAND_AMBER} theme={theme} />
          <FilterPill label={`Notices (${audit.noticesCount})`} active={sevFilter === "notice"} onClick={() => setSevFilter("notice")} color={BRAND_BLUE} theme={theme} />
        </FilterGroup>
        <FilterGroup label="Category" theme={theme}>
          <FilterPill label="All" active={catFilter === "all"} onClick={() => setCatFilter("all")} theme={theme} />
          {(Object.entries(CATEGORY_LABEL) as [Category, string][]).map(([key, label]) => (
            <FilterPill key={key} label={label} active={catFilter === key} onClick={() => setCatFilter(key)} theme={theme} />
          ))}
        </FilterGroup>
      </div>

      {/* Issues list */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
        {rows.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: theme.textSecondary }}>No issues match the current filters.</div>
        ) : (
          rows.map((row, i) => {
            const isOpen = expanded === row.id;
            return (
              <div key={row.id} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                <button onClick={() => setExpanded(isOpen ? null : row.id)} style={{ width: "100%", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", background: `${SEVERITY_COLOR[row.def.severity]}15`, color: SEVERITY_COLOR[row.def.severity], borderRadius: 999, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>{SEVERITY_LABEL[row.def.severity]}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.def.name}</span>
                    <span style={{ fontSize: 11, color: theme.textMuted, whiteSpace: "nowrap" }}>· {CATEGORY_LABEL[row.def.category]}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontVariantNumeric: "tabular-nums" }}>{row.affected} {row.affected === 1 ? "page" : "pages"}</span>
                    <span style={{ fontSize: 14, color: theme.textMuted, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 150ms" }}>▸</span>
                  </div>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 18px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.55 }}>{row.def.description}</div>
                    <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_GREEN, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>How to fix</div>
                      <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.55 }}>{row.def.fix}</div>
                    </div>
                    <button onClick={onJumpPages} style={{ alignSelf: "flex-start", fontSize: 13, fontWeight: 600, color: BRAND_GREEN, background: "transparent", border: `1px solid ${BRAND_GREEN}50`, borderRadius: 7, padding: "7px 14px", cursor: "pointer" }}>View {row.affected} affected pages →</button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
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
    <button onClick={onClick} style={{
      padding: "7px 10px", fontSize: 13, fontWeight: active ? 600 : 500, textAlign: "left",
      background: active ? `${c}15` : "transparent",
      color: active ? c : theme.text,
      border: `1px solid ${active ? c : "transparent"}`,
      borderRadius: 7, cursor: "pointer",
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
                  <tr key={p.url} onClick={() => setDrawer(p)} style={{ cursor: "pointer", background: i % 2 === 0 ? theme.cardBg : theme.bg, borderBottom: i < filtered.length - 1 ? `1px solid ${theme.border}` : "none" }}>
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
      {drawer && <PageDrawer page={drawer} onClose={() => setDrawer(null)} theme={theme} isMobile={isMobile} />}
    </>
  );
}

function PageDrawer({ page, onClose, theme, isMobile }: { page: AuditPage; onClose: () => void; theme: Theme; isMobile: boolean }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: theme.cardBg, width: isMobile ? "100%" : 560, height: "100vh", overflowY: "auto", padding: 22, boxShadow: "-8px 0 30px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 10 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Page details</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text, margin: 0, wordBreak: "break-all", lineHeight: 1.3, fontFamily: "monospace" }}>{page.url}</h3>
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
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 10 }}>Issues found ({page.issues.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {page.issues.map((id) => {
                const def = ISSUE_DEFS.find((d) => d.id === id);
                if (!def) return null;
                return (
                  <div key={id} style={{ padding: "10px 12px", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", background: `${SEVERITY_COLOR[def.severity]}15`, color: SEVERITY_COLOR[def.severity], borderRadius: 999, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>{SEVERITY_LABEL[def.severity]}</span>
                    <span style={{ fontSize: 13, color: theme.text }}>{def.name}</span>
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
