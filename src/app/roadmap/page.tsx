"use client";

import { useState } from "react";

// ============================================================
// ROADMAP — ScalePublish Development Plan
// Professional dev roadmap for Aina, visible to client Alexei
// ============================================================

// ── Geoscale Logo ──
function GeoscaleLogo({ width = 150 }: { width?: number }) {
  return (
    <div style={{ direction: "ltr", width }}>
      <svg width={width} height={width * 0.2} viewBox="0 0 510 102" fill="none">
        <circle cx="51" cy="51" r="41" stroke="#ABABAB" strokeWidth="13" fill="none" />
        <circle cx="51" cy="51" r="41" stroke="#141414" strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
        <g fill="#141414">
          <text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text>
        </g>
      </svg>
    </div>
  );
}

function GeoscaleLogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 102 102" fill="none">
      <circle cx="51" cy="51" r="41" stroke="#ABABAB" strokeWidth="10" fill="none" />
      <circle cx="51" cy="51" r="41" stroke="#141414" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
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
}

interface Phase {
  id: number;
  title: string;
  features: Feature[];
  color: string;
}

// ── Data ──
const phases: Phase[] = [
  {
    id: 1,
    title: "Infrastructure & UX",
    color: "#000000",
    features: [
      { name: "UX design in Slice", description: "Flow design for site selection, categorization, shopping cart. Detailed spec + approval before dev", priority: "P0", status: "in_progress" },
      { name: "Data model - Publishers", description: "DB schema for sites: domain, DR, metrics, category, pricing, status", priority: "P0", status: "not_started" },
      { name: "Data model - Work Plans", description: "DB schema for work plans: brand, duration, speed, articles, budget", priority: "P0", status: "not_started" },
      { name: "Core API - CRUD Publishers", description: "REST endpoints: list, create, update, delete publishers", priority: "P0", status: "not_started" },
    ],
  },
  {
    id: 2,
    title: "Site Inventory & Ranking",
    color: "#10A37F",
    features: [
      { name: "Publisher interface for site onboarding", description: "Publisher dashboard: manual/excel site entry, pricing management, agency analytics", priority: "P0", status: "not_started" },
      { name: "Automated ranking system (SEO)", description: "Check against DataForSEO/Ahrefs: DR, keywords, organic traffic, Google index", priority: "P0", status: "not_started" },
      { name: "Automated ranking system (GIO)", description: "Check visibility in ChatGPT, Gemini, Bing Chat. Relevant queries", priority: "P1", status: "not_started" },
      { name: "Automatic categorization", description: "AI-based site categorization + manual override capability", priority: "P1", status: "not_started" },
      { name: "Rejected sites repository", description: "Store rejected sites + reasons + re-check capability", priority: "P2", status: "not_started" },
      { name: "Publishers portal", description: "Publisher interface for manual/excel site entry, dashboard with agencies that viewed/bought, revenue, analytics", priority: "P0", status: "not_started" },
      { name: "Terms & digital signature", description: "Publisher contract: terms of service, no-price-change clause, digital signature", priority: "P2", status: "not_started" },
    ],
  },
  {
    id: 3,
    title: "Pricing & Shopping Cart",
    color: "#0D8A6A",
    features: [
      { name: "Pricing system", description: "Set prices per publisher, agency margin percentages (15-20%), rounding", priority: "P0", status: "done" },
      { name: "Cart Widget", description: "Floating widget: budget, article count, queries, sites. Real-time add/remove", priority: "P0", status: "done" },
      { name: "Automated quote generation", description: "PDF/report from cart: 3 options (Aggressive/Medium/Conservative), pricing breakdown", priority: "P1", status: "not_started" },
      { name: "Terms & digital signature", description: "Publisher contract: terms of service, no-price-change clause, digital signature", priority: "P2", status: "not_started" },
      { name: "Agency Markup & Margins", description: "15-20% margin on publisher prices, manual editing, rounding, auto-calculation", priority: "P0", status: "done" },
    ],
  },
  {
    id: 4,
    title: "Work Plan & Dashboard",
    color: "#5CCFAA",
    features: [
      { name: "Work plan builder", description: "Select duration (3-6 months), speed (Aggressive/Medium/Conservative), auto-schedule distribution", priority: "P0", status: "done" },
      { name: "Unified SEO+GEO Dashboard", description: "Unified UI with toggle/filter: queries <-> keywords, positions, search volume", priority: "P1", status: "not_started" },
      { name: "Automatic recommendation engine", description: "Recommended weekly/monthly article count based on budget and goals", priority: "P1", status: "not_started" },
      { name: "Publisher Analytics", description: "Publisher dashboard: agencies that viewed/bought, revenue, analytics", priority: "P2", status: "done" },
      { name: "SEO/GEO/Combined quote", description: "3 separate pricing options with 15% discount on combined SEO+GEO package", priority: "P1", status: "done" },
    ],
  },
  {
    id: 5,
    title: "UX Dashboard & Alexei's Requirements",
    color: "#4285F4",
    features: [
      { name: "Tooltips on every metric", description: "Info/eye icon next to every number and metric explaining what it means - on all screens", priority: "P0", status: "done" },
      { name: "Primary time-series chart (like Ahrefs/GA)", description: "Large time-series chart at the top of every screen: GPT+Gemini mention rate from past scans, with time filtering", priority: "P0", status: "done" },
      { name: "Hover effects on all buttons", description: "Every interactive button must respond to hover with visual change and transition", priority: "P0", status: "done" },
      { name: "Change indicator (+/-)", description: "Next to each mention rate and average position: up/down arrow with number, compared to previous period", priority: "P0", status: "done" },
      { name: "Red reputation alerts", description: "When something is off (rejected sites, lack of mentions) - should be colored red as ALERT across all tables", priority: "P0", status: "done" },
      { name: "Product/service split + B2C/B2B", description: "In Products tab: clear separation between products and services, with B2C / B2B tags per item", priority: "P1", status: "done" },
      { name: "Auto-pull product name and design", description: "If there are products, auto-pull the name, image, and design from the product itself", priority: "P1", status: "not_started" },
      { name: "Data from all AI engines", description: "Expand beyond GPT and Gemini: add Bing Chat, Perplexity, Claude, and more engines", priority: "P1", status: "not_started" },
      { name: "Standalone SEO Dashboard", description: "Independent SEO dashboard with keyword data, rankings, organic traffic - separate from GEO", priority: "P1", status: "not_started" },
      { name: "Time filter chart (Data Filter)", description: "Ability to filter all data and charts by custom time range", priority: "P1", status: "not_started" },
      { name: "Geoscale logo matching site", description: "Update the logo to exactly match the logo at geoscale.ai", priority: "P2", status: "not_started" },
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

function PhaseCard({ phase }: { phase: Phase }) {
  const [expanded, setExpanded] = useState(phase.id === 1);
  const featureCount = phase.features.length;
  const inProgressCount = phase.features.filter(f => f.status === "in_progress").length;
  const doneCount = phase.features.filter(f => f.status === "done").length;
  const progressPct = featureCount > 0 ? Math.round(((doneCount + inProgressCount * 0.5) / featureCount) * 100) : 0;

  return (
    <div style={{ border: "1px solid #DDDDDD", borderRadius: 10, background: "#fff", overflow: "hidden" }}>
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
            <span style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Phase {phase.id}: {phase.title}</span>
          </div>
          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
            <div style={{ width: 120, height: 4, borderRadius: 2, background: "#EEEEEE", overflow: "hidden" }}>
              <div style={{ width: `${progressPct}%`, height: "100%", borderRadius: 2, background: phase.color, transition: "width 300ms" }} />
            </div>
            <span style={{ fontSize: 11, color: "#727272" }}>{progressPct}%</span>
          </div>
        </div>

        {/* Feature count */}
        <span style={{ fontSize: 13, color: "#727272" }}>{featureCount} features</span>

        {/* Chevron */}
        <div style={{ color: "#A2A9B0" }}>
          <IconChevronDown size={16} rotated={expanded} />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: "1px solid #EEEEEE" }}>
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 3fr 1fr 1fr",
              gap: 12,
              padding: "10px 24px 10px 24px",
              background: "#FAFAFA",
              direction: "ltr",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: "#727272", textTransform: "uppercase" }}>Feature</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#727272", textTransform: "uppercase" }}>Description</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#727272", textTransform: "uppercase" }}>Priority</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#727272", textTransform: "uppercase" }}>Status</span>
          </div>

          {/* Feature rows */}
          {phase.features.map((feature, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 3fr 1fr 1fr",
                gap: 12,
                padding: "14px 24px",
                direction: "ltr",
                borderTop: i > 0 ? "1px solid #F0F0F0" : "none",
                transition: "background 150ms",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>{feature.name}</span>
              <span style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{feature.description}</span>
              <PriorityBadge priority={feature.priority} />
              <StatusDot status={feature.status} />
            </div>
          ))}

          {/* Phase total */}
          <div style={{ display: "flex", justifyContent: "flex-start", padding: "12px 24px", background: "#FAFAFA", borderTop: "1px solid #EEEEEE", direction: "ltr" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>Phase {phase.id}: {phase.features.length} features</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──
export default function RoadmapPage() {
  return (
    <div style={{ background: "#F9F9F9", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: "rgba(255,255,255,0.96)", borderBottom: "1px solid #BFBFBF" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 72, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "start" }}>
            <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: "#000", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "1px solid #000", textDecoration: "none" }}>New Scan</a>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#727272" }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
              <span>Connected</span>
            </div>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="/" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none" }}>Dashboard</a>
            <a href="/scan" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none" }}>Scans</a>
            <a href="/scale-publish" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none" }}>ScalePublish</a>
            <a href="/roadmap" style={{ fontSize: 14, fontWeight: 600, color: "#000", textDecoration: "none" }}>Roadmap</a>
          </nav>
          <div style={{ justifySelf: "end" }}>
            <GeoscaleLogo />
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, maxWidth: 1300, margin: "0 auto", padding: "32px 24px 48px", width: "100%" }} dir="ltr">
        {/* Title Section */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#000", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
            Roadmap <span style={{ fontWeight: 400, color: "#727272" }}>-</span> ScalePublish Development Plan
          </h1>
          <p style={{ fontSize: 14, color: "#727272", fontFamily: "'Heebo', sans-serif" }}>
            Detailed development plan with milestones
          </p>
        </div>

        {/* Summary Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Features", value: "32", accent: false },
            { label: "Phases", value: "5", accent: false },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #DDDDDD",
                borderRadius: 10,
                background: "#fff",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 12, color: "#727272", fontWeight: 500 }}>{stat.label}</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: stat.accent ? "#10A37F" : "#000" }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Phase Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {phases.map(phase => (
            <PhaseCard key={phase.id} phase={phase} />
          ))}
        </div>

        {/* Bottom Summary */}
        <div style={{ border: "1px solid #DDDDDD", borderRadius: 10, background: "#fff", padding: 24, direction: "ltr" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#000", marginBottom: 16 }}>Dependencies & Risks</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#E07800", display: "inline-block", marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>UX approval from Alexei before starting Phase 2 development</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#E07800", display: "inline-block", marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>Access to DataForSEO/Ahrefs API for the ranking system</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#E07800", display: "inline-block", marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>Defining agency margin percentages before the Pricing phase</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#E07800", display: "inline-block", marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>Publishers portal requires separate UX spec for publisher interface</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#E07800", display: "inline-block", marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>Agency Markup requires rigorous QA to prevent pricing errors</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #BFBFBF" }}>
        <div className="max-w-[1300px] mx-auto px-6 py-5 flex items-center justify-between" dir="ltr">
          <div className="flex items-center gap-3">
            <GeoscaleLogoMark size={28} />
            <span className="text-sm" style={{ color: "#727272" }}>Powered by advanced AI to analyze your search presence</span>
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
          <span className="text-xs" style={{ color: "#A2A9B0" }}>GeoScale 2026 &copy;</span>
        </div>
      </footer>
    </div>
  );
}
