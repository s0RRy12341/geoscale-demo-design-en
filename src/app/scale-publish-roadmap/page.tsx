"use client";

import React from "react";

// ============================================================
// SCALEPUBLISH ROADMAP — for Inna (design + product)
// Plain-language explainer of the Yedioth Ahronoth flow Alexei described
// ============================================================

const GREEN = "#10A37F";
const AMBER = "#B45309";
const BLUE = "#1D4ED8";
const TEXT = "#0F172A";
const TEXT_MUTED = "#64748B";
const BG = "#FAFBFC";
const CARD_BG = "#FFFFFF";
const BORDER = "#E2E8F0";

export default function ScalePublishRoadmapPage() {
  return (
    <div dir="ltr" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", background: BG, minHeight: "100vh", color: TEXT }}>
      <header style={{ background: "#000", color: "#fff", padding: "44px 24px 36px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: GREEN, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 10 }}>SCALEPUBLISH · ROADMAP FOR INNA</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 10px", lineHeight: 1.15, letterSpacing: "-0.5px" }}>The Yedioth Ahronoth flow — what we're building, what's already live, what's next</h1>
          <p style={{ fontSize: 16, color: "#CBD5E1", margin: "0 0 18px", lineHeight: 1.6 }}>
            For the Thursday Yedioth meeting. Built directly off Alexei's call (2026-04-26). Each section explains the feature in plain English, why Alexei wanted it, and the design decisions still open.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/scale-publish" style={{ padding: "10px 22px", background: GREEN, color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Open the live demo →</a>
            <a href="/roadmap" style={{ padding: "10px 22px", background: "transparent", color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid #475569" }}>Full product roadmap</a>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 24px 80px" }}>
        <Section title="TL;DR" subtitle="The 30-second version">
          <Card>
            <P><B>ScalePublish is a two-sided marketplace</B> where one side is Yedioth Ahronoth (the publisher selling article placements) and the other side is media-buying agencies (e.g., Bank Hapoalim's agency buying placements).</P>
            <P>The agency picks <B>up to 5 queries</B> (questions their brand wants to win on AI search), the system <B>matches Yedioth sections</B> by audience + category + intent, the agency builds the order, the publisher sees it in their inbox, and once published, every article is <B>tracked individually</B> for AI citations + Google indexing + ranked queries.</P>
            <P>The demo at <a href="/scale-publish" style={{ color: GREEN, fontWeight: 600 }}>/scale-publish</a> already shows this end-to-end. This doc explains every screen and what's still open.</P>
          </Card>
        </Section>

        <Section title="The two user types" subtitle="Toggle between them at the top of /scale-publish">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <Card accent={GREEN}>
              <Tag color={GREEN}>Agency view</Tag>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "10px 0 8px" }}>Just In Time Agency</h3>
              <P>Acts on behalf of a brand (Bank Hapoalim in the demo). Picks queries, builds orders, tracks live articles, exports client reports. This is the <B>buy side</B>.</P>
            </Card>
            <Card accent={AMBER}>
              <Tag color={AMBER}>Publisher view</Tag>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "10px 0 8px" }}>Yedioth Ahronoth Group</h3>
              <P>Manages 8 sites + 30 sections + pricing. Approves orders, marks articles published, tracks revenue + AI citations across the whole inventory. This is the <B>sell side</B>.</P>
            </Card>
          </div>
        </Section>

        <Section title="Agency flow — step by step" subtitle="Exactly what Alexei described, built piece by piece">
          <Step n={1} title="My Queries — pick up to 5">
            <P>Agency lands on a list of queries from a brand scan (12 in the demo, e.g., "Best banking app in Israel 2026"). They check the boxes on the queries they want to win.</P>
            <UL items={[
              <>5 bullet-dot progress indicator at the top — fills green as queries get selected, like a bullet-list checklist</>,
              <>Counter copy: <B>"3 of 5 selected · 2 more recommended"</B></>,
              <>Each query card has: text, category pill, audience pills, AI-engine status (GPT/Gemini found-or-not), opportunity score 0–100</>,
              <>Pin button (bookmark) and dismiss-with-X (Alexei: "they'll dismiss queries that don't matter")</>,
            ]} />
            <Quote author="Alexei">They have to be able to take a few queries — recommend up to 5, count it. If they picked 4, they can do next, but it should say "4 selected, recommended 5".</Quote>
          </Step>

          <Step n={2} title="Order Flow — the article gets built from the queries">
            <P>Once the agency continues from "My Queries", they hit a 5-step builder that shows the article taking shape live.</P>
            <UL items={[
              <><B>Step 1:</B> Selected queries shown as a numbered list (1, 2, 3...) — green badges, X to remove, "Add more" link back to /My Queries</>,
              <><B>Step 1.5 (NEW):</B> Article preview — full editorial mockup styled like an AdsGPT case study. Hero image, category tags, byline, stats highlight box, intro, pull-quote, then each query becomes its own H2 with H3 subheadings, sample paragraphs, and a comparison table inside section 1. Ends with a "Key Takeaways" box and a conclusion. Updates live as queries are added/removed and the title is edited.</>,
              <><B>Step 2:</B> Article title — auto-suggested from the first query, fully editable. Editing the title re-ranks the matched sections (title keywords boost section fit scores).</>,
              <><B>Step 3:</B> Content mode — "AI-generated draft" (we write it) or "I'll provide the copy" (agency writes it).</>,
              <><B>Step 4:</B> Yedioth sections matched to the queries — list view (NOT boxes), sorted by fit score, with match-reason pills (Audience: X / Category: Y / Title: Z).</>,
              <><B>Step 5:</B> Order summary cart — section list, total ₪, submit button. ~3-day publication window shown before submit.</>,
            ]} />
            <Quote author="Alexei">It needs to be a list, not boxes. Sorted by priority. Show why each section matched.</Quote>
          </Step>

          <Step n={3} title="Submit — order lands in publisher's inbox in real time">
            <P>The agency hits "Submit order to Yedioth Ahronoth". The order is saved to localStorage so the demo can show cross-state instantly when the user toggles Publisher View — the publisher sees a new pending order with the agency's name, brand, queries, sections, and total ₪.</P>
            <UL items={[
              <>Toast confirmation: "Order ORD-XXX sent to Yedioth · ₪32,400"</>,
              <>Confirmation screen: "Yedioth's sales team will contact you · ~3 days per article"</>,
              <>Two outbound buttons: "View my orders" / "Place another order"</>,
            ]} />
          </Step>

          <Step n={4} title="My Orders + Article Tracking">
            <P>Once the order is submitted, the agency tracks status in "My Orders" (pending → approved → in progress → published) and tracks live performance in "Article Tracking".</P>
            <UL items={[
              <><B>My Orders:</B> 4 KPI cards (Total spend, Pending, In progress, Published), expandable order cards with full breakdown</>,
              <><B>Article Tracking:</B> 4 KPIs (Total views, Google-indexed, AI-cited, Ranking queries), per-domain pill filter (All sites / Ynet / Calcalist...)</>,
              <>Each article row shows: URL, site/section, publish date, views, crawled?, indexed?, GPT/Gemini/Perplexity cited?, impact score</>,
              <>Expand a row to see ranked queries (table: query / engine / rank), "Re-check engines" button, "Export report" (text file per article)</>,
              <>Top-right banner button: <B>"Export client report"</B> (full CSV for the agency to send to their client)</>,
            ]} />
          </Step>
        </Section>

        <Section title="Publisher flow — Yedioth's side" subtitle="What the Yedioth team sees when they log in">
          <Step n={1} title="Sites & Sections — manage inventory + pricing">
            <P>Yedioth manages 8 sites (Ynet, Calcalist, Sport5, Mynet, Pnai Plus, Vi.B, Lady, Ynet Business) with 30 sub-sections. Every section has a price, an estimated upload time, and audience tags.</P>
            <UL items={[
              <>Tree view: each site collapses/expands to show its sections</>,
              <>Click any price to edit it inline — change goes live to all agencies instantly. Toast: <B>"Price updated to ₪7,500 — agencies see it live"</B></>,
              <>Add Site / Add Section buttons (modals) — fully functional, not placeholders</>,
              <>Delete section with confirm modal</>,
              <>4 KPI cards at top: Sites count, Sections count, Avg price, Avg upload time</>,
            ]} />
            <Quote author="Alexei">They have to be able to manage everything — add sites, add sections, change prices dynamically. The price they change is what the agency sees.</Quote>
          </Step>

          <Step n={2} title="Order Inbox — approve / reject / mark progress">
            <P>Every order submitted by an agency lands here with status pending. Yedioth's editor reviews, approves, and the sales team contacts the agency to collect payment.</P>
            <UL items={[
              <>4 status filter pills: All / Pending / Approved / In progress / Published — with counts</>,
              <>4 KPIs: Pending count, In-progress count, Published count, Avg order value</>,
              <>Each order is expandable: queries selected, sections ordered, content mode (AI vs empty), agency contact info</>,
              <>Action buttons depending on status: Approve & contact / Reject / Mark in progress / Mark published</>,
            ]} />
          </Step>

          <Step n={3} title="Articles & Tracking — every published item, monitored">
            <P>Once an order is marked Published, the article URL appears here and gets tracked individually. Alexei was emphatic: <B>per-item, not per-domain.</B></P>
            <UL items={[
              <>4 KPIs: Total views, Indexed (X/Y), AI-cited (X/Y), Avg impact</>,
              <>Per-site filter dropdown</>,
              <>Re-check engines button (animated spin, simulates engine response, updates GPT/Gemini/Perplexity citation flags + impact score)</>,
              <>Export CSV — full inventory for the publisher's records</>,
              <>Per-article row shows the same monitoring data the agency sees, plus the publisher can edit / re-check individual articles</>,
            ]} />
          </Step>

          <Step n={4} title="Analytics — flow of money">
            <P>This is the dashboard Alexei was most excited about — "they need to understand the flow of money and the flow of orders".</P>
            <UL items={[
              <>Hero banner: ₪X this month · N articles live</>,
              <>4 KPIs: Revenue this month, Pending revenue, Avg order value, AI-citation rate</>,
              <><B>Revenue trend chart</B> — last 12 weeks, vertical bars, dashed average line in amber, last bar gets a green ring (current week), Y-axis with ₪K labels and dashed grid lines</>,
              <><B>Order funnel:</B> Submitted → Approved → In progress → Published, green opacity bars (lighter to darker), conversion % at each stage</>,
              <><B>AI engine citation rates:</B> ChatGPT (teal), Gemini (Google blue), Perplexity (Perplexity teal) — vendor brand colors kept distinct, animated horizontal bars</>,
              <><B>Top 6 sections by ₪ revenue:</B> green bars with opacity by rank, AI-cited% pill on each</>,
              <><B>Revenue by site:</B> 6 sites with % share + ₪</>,
            ]} />
            <Quote author="Alexei">Flow of money. Flow of orders. They need to see it and feel it.</Quote>
          </Step>
        </Section>

        <Section title="What's built · what's open" subtitle="Honest status as of 2026-04-26">
          <Card>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: GREEN, margin: "0 0 12px" }}>✓ Built and live on the demo</h3>
            <UL items={[
              <>Two-user toggle (Agency / Publisher) with cross-state via localStorage</>,
              <>Pre-seeded data: 8 Yedioth sites, 30 sections with ₪ prices, 12 Bank Hapoalim queries, 1 pending order, 2 published+tracked articles</>,
              <>Agency: 5-bullet selection, numbered query list, AdsGPT-style article preview, list-not-boxes section matching, content mode toggle, cart & submit</>,
              <>Publisher: editable pricing with toast feedback, modals for Add Site/Section/Delete, order approval workflow, article tracking with re-check + export, full Analytics view</>,
              <>Tooltips on every KPI label (8+ views)</>,
              <>Per-domain filters on Articles & Tracking views</>,
              <>Title-affects-matching: title keywords boost section fit scores live</>,
              <>CSV exports: Articles full table, per-article report, Agency client report</>,
              <>Mobile-responsive across all views</>,
              <>Light/Dark mode toggle (top-right)</>,
            ]} />
          </Card>

          <Card style={{ marginTop: 14 }} accent={AMBER}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: AMBER, margin: "0 0 12px" }}>⚠ Design decisions to confirm with Inna</h3>
            <UL items={[
              <><B>Hero/feature image:</B> who provides it? Editor uploads at publish time, AI-generates from title, or agency provides? (Currently a gradient placeholder)</>,
              <><B>Article preview editing:</B> enable inline edits in the preview itself (live WYSIWYG), or keep preview read-only with editing happening in a dedicated step?</>,
              <><B>"I'll provide the copy" mode:</B> upload a Word/Google Doc, or paste in a rich-text editor inside the demo?</>,
              <><B>Premium pricing:</B> if a section is hot (high AI citation rate), should the publisher be able to raise its price dynamically and have agencies see a "Premium" badge?</>,
              <><B>Article-level URL push-back:</B> in the demo we mock the URLs. In production, does Yedioth's CMS push the live URL back into Geoscale via API or webhook?</>,
              <><B>Re-check engines cadence:</B> today simulated. In production, daily? On-demand only? Both?</>,
              <><B>Mobile order placement:</B> realistic, or do agencies always do this on desktop? Affects how much we polish mobile Order Flow.</>,
              <><B>RTL Hebrew UI:</B> needed for Yedioth's editor team, or is English-LTR fine since they're tech users?</>,
            ]} />
          </Card>

          <Card style={{ marginTop: 14 }} accent={BLUE}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: BLUE, margin: "0 0 12px" }}>→ Next sprint (after Yedioth meeting)</h3>
            <UL items={[
              <>Real CMS integration with Yedioth's publishing system (article URL push-back)</>,
              <>Real engine-check pipeline (replace simulated re-check with actual GPT / Gemini / Perplexity API calls + scheduled cron)</>,
              <>Hebrew UI option for editor team (RTL toggle independent of demo language)</>,
              <>Multi-brand agency support: an agency can act on behalf of multiple brands, switch between them</>,
              <>Approval comments: when publisher rejects, they leave a reason that the agency sees</>,
              <>Email/Slack notifications: new pending order in inbox, article published, citation milestone hit</>,
              <>Stripe / Tranzila integration for payment instead of "sales team contacts you"</>,
              <>Editor in-line suggestions: when an article isn't getting cited, suggest H2/H3 tweaks</>,
            ]} />
          </Card>
        </Section>

        <Section title="Demo data — what's hard-coded vs dynamic" subtitle="So you know what to trust in the demo">
          <Card>
            <UL items={[
              <><B>Sites & sections:</B> editable in the demo via Add/Delete; persist to localStorage. Reset by clearing browser storage.</>,
              <><B>Prices:</B> editable inline; persist. Resets the same way.</>,
              <><B>Orders:</B> starts with 1 pending order from Aradin Media Group + every order the user submits. Persists across page reloads.</>,
              <><B>Articles & tracking:</B> starts with 2 historical articles + auto-added when an order moves to Published. Re-check engines updates flags + impact scores randomly.</>,
              <><B>Analytics numbers:</B> revenue baseline of ₪348K + live order revenue. Growth trend bars are deterministic from a seed (so the chart looks consistent across reloads but isn't from a real DB).</>,
              <><B>Bank Hapoalim queries:</B> 12 hard-coded queries derived from a real brand scan, with categories and audience tags.</>,
              <><B>Yedioth Hebrew names:</B> each site/section has both English and Hebrew (RTL handled inline).</>,
              <><B>Currency:</B> ₪ (NIS) everywhere — never $.</>,
            ]} />
          </Card>
        </Section>

        <Section title="For the Thursday meeting" subtitle="Exactly what to show, in what order">
          <Card>
            <ol style={{ margin: 0, paddingLeft: 22, fontSize: 15, lineHeight: 1.8 }}>
              <li><B>Open /scale-publish in Agency view.</B> Show the 12 Bank Hapoalim queries. Pick 4 — the bullet dots fill, counter shows "4 of 5 · 1 more recommended". Pick a 5th — banner turns solid green, "Maximum reached".</li>
              <li><B>Click "Next: build article".</B> Land on Step 1 (numbered list) → scroll to the live Article Preview (AdsGPT-style mockup). Edit the title in Step 2 → preview title updates live. Show that re-arranging queries re-orders the H2 sections.</li>
              <li><B>Switch between AI / "I'll provide".</B> Briefly show both options.</li>
              <li><B>Step 4: section list.</B> Scroll the list — point out the match-reason pills (Audience / Category / Title). Add 3 sections to cart. Show the running total in Step 5.</li>
              <li><B>Submit the order.</B> Toast confirms.</li>
              <li><B>Toggle to Publisher view.</B> Order is sitting in the inbox with the queries, sections, total ₪. Click Approve → agency would be notified. Click Mark in progress → Mark published.</li>
              <li><B>Open Publisher · Sites & Sections.</B> Click any price (e.g., Ynet · Cars), change ₪7,500 → ₪9,800. Toast confirms. Toggle back to Agency view → the same section in Order Flow now shows the new price.</li>
              <li><B>Open Publisher · Analytics.</B> Walk through revenue trend (12-week bars), funnel, AI citation rates, top sections, revenue by site. Point out the avg line + current-week highlight on the trend chart.</li>
              <li><B>Open Articles & Tracking.</B> Click "Re-check engines" → animated, citation flags update. Click "Export CSV" → downloads.</li>
              <li><B>Toggle back to Agency · Article Tracking.</B> Show the per-domain filter, click "Export client report" → downloads CSV ready to send to Bank Hapoalim.</li>
            </ol>
          </Card>
        </Section>
      </div>
    </div>
  );
}

// ── Helpers ──
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section style={{ margin: "36px 0 0" }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2, letterSpacing: "-0.3px" }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 4 }}>{subtitle}</div>}
      </div>
      {children}
    </section>
  );
}

function Card({ children, accent, style }: { children: React.ReactNode; accent?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderLeft: accent ? `4px solid ${accent}` : `1px solid ${BORDER}`, borderRadius: 10, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return <span style={{ display: "inline-block", padding: "4px 12px", fontSize: 11, fontWeight: 700, background: `${color}15`, color, borderRadius: 4, letterSpacing: 1, textTransform: "uppercase" }}>{children}</span>;
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 18, alignItems: "flex-start" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: GREEN, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flexShrink: 0, marginTop: 2 }}>{n}</div>
      <Card style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: "0 0 10px" }}>{title}</h3>
        <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.65 }}>{children}</div>
      </Card>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155", margin: "0 0 12px" }}>{children}</p>;
}

function B({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: TEXT, fontWeight: 700 }}>{children}</strong>;
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ margin: "0 0 0", paddingLeft: 22, fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
      {items.map((it, i) => (
        <li key={i} style={{ marginBottom: 6 }}>{it}</li>
      ))}
    </ul>
  );
}

function Quote({ children, author }: { children: React.ReactNode; author: string }) {
  return (
    <blockquote style={{ borderLeft: `4px solid ${GREEN}`, padding: "8px 0 8px 18px", margin: "14px 0 4px", fontSize: 15, fontStyle: "italic", color: "#475569", lineHeight: 1.5 }}>
      "{children}"
      <span style={{ display: "block", marginTop: 6, fontStyle: "normal", fontSize: 12, fontWeight: 700, color: TEXT_MUTED }}>— {author}</span>
    </blockquote>
  );
}
