"use client";

import React from "react";

// ============================================================
// SCALEPUBLISH SPEC — for Inna (designer)
// Story-first walkthrough. Read top to bottom, click links to see live.
// ============================================================

const GREEN = "#10A37F";
const AMBER = "#B45309";
const BLUE = "#1D4ED8";
const TEXT = "#0F172A";
const TEXT_MUTED = "#64748B";
const BG = "#FAFBFC";
const CARD_BG = "#FFFFFF";
const BORDER = "#E2E8F0";
const SOFT_GREEN = "#10A37F12";

export default function ScalePublishRoadmapPage() {
  return (
    <div dir="ltr" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", background: BG, minHeight: "100vh", color: TEXT }}>
      {/* ── HERO ── */}
      <header style={{ background: "linear-gradient(135deg, #0B1220 0%, #0F172A 100%)", color: "#fff", padding: "60px 24px 50px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: GREEN, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 14 }}>ScalePublish · Spec for Inna</div>
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: "0 0 14px", lineHeight: 1.1, letterSpacing: "-0.8px" }}>How the Yedioth flow works</h1>
          <p style={{ fontSize: 18, color: "#CBD5E1", margin: "0 0 26px", lineHeight: 1.6, maxWidth: 720 }}>
            A 5-minute read. Read the story first, then click any &ldquo;See it live&rdquo; link to open the actual screen. Every section ends with the design question I need your help on.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/scale-publish" style={{ padding: "12px 24px", background: GREEN, color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Open the live demo →</a>
            <a href="#story" style={{ padding: "12px 24px", background: "transparent", color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", border: "1px solid #475569" }}>Skip to the story</a>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "44px 24px 100px" }}>

        {/* ── STORY ── */}
        <Section id="story" eyebrow="The whole thing in one paragraph" title="What ScalePublish is">
          <Card style={{ background: SOFT_GREEN, borderLeft: `4px solid ${GREEN}` }}>
            <P style={{ fontSize: 17, lineHeight: 1.75 }}>
              Yedioth Ahronoth has 8 news sites and 30 sections. Brands like Bank Hapoalim want their messaging to show up when people ask AI assistants questions like &ldquo;<i>What&rsquo;s the best banking app in Israel?</i>&rdquo;. <B>ScalePublish is the marketplace that connects them.</B> The brand&rsquo;s agency picks 5 questions they want to win on, our system suggests which Yedioth sections fit best, the agency orders articles, Yedioth&rsquo;s editor approves and publishes them, and then we track every published article to see if AI assistants actually quote it. Two sides, one inbox, full-loop tracking.
            </P>
          </Card>
        </Section>

        {/* ── TWO ROLES ── */}
        <Section eyebrow="Two roles, one product" title="Who logs in">
          <P>The same /scale-publish URL has a toggle at the top. Both views share the same data &mdash; an order placed by the Agency shows up instantly in the Publisher&rsquo;s inbox.</P>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14, marginTop: 14 }}>
            <Card accent={GREEN}>
              <Tag color={GREEN}>Agency view</Tag>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: "12px 0 8px" }}>Buys placements</h3>
              <P style={{ margin: 0 }}>Just In Time Agency, on behalf of Bank Hapoalim. Picks queries → builds an article → orders sections → tracks AI citations → exports a client report.</P>
            </Card>
            <Card accent={AMBER}>
              <Tag color={AMBER}>Publisher view</Tag>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: "12px 0 8px" }}>Sells placements</h3>
              <P style={{ margin: 0 }}>Yedioth Ahronoth&rsquo;s editorial team. Manages 8 sites + 30 sections + pricing → reviews orders → publishes articles → watches the revenue dashboard.</P>
            </Card>
          </div>
        </Section>

        {/* ── FLOW DIAGRAM ── */}
        <Section eyebrow="The 4 moments that matter" title="The flow at a glance">
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, fontSize: 13 }}>
              <FlowStep n={1} label="Agency picks queries" sub="Up to 5" color={GREEN} />
              <FlowStep n={2} label="Article gets built" sub="Sections matched" color={GREEN} />
              <FlowStep n={3} label="Publisher approves" sub="Editor inbox" color={AMBER} />
              <FlowStep n={4} label="We track citations" sub="Per article" color={BLUE} last />
            </div>
            <P style={{ margin: "18px 0 0", fontSize: 14, color: TEXT_MUTED, textAlign: "center" }}>
              Steps 1&ndash;2 happen in the Agency view. Step 3 in the Publisher view. Step 4 is visible to both sides.
            </P>
          </Card>
        </Section>

        {/* ── AGENCY FLOW ── */}
        <Section eyebrow="Step by step" title="The Agency&rsquo;s journey">
          <P style={{ marginBottom: 18 }}>This is what a brand&rsquo;s agency does on a Monday morning when they want to win 5 new AI queries this week.</P>

          <Step n={1} title="Pick up to 5 queries">
            <P>The agency lands on a page with 12 questions Bank Hapoalim wants to win. They check the boxes on the most important ones.</P>
            <UL items={[
              <>5 dots at the top fill green as they pick &mdash; visual progress bar</>,
              <>Counter copy: <B>&ldquo;3 of 5 selected · 2 more recommended&rdquo;</B></>,
              <>Each query shows: text, category, audience, AI-engine status (Found in GPT? Gemini?), opportunity score</>,
            ]} />
            <DemoLink href="/scale-publish" label="Open Agency view → My Queries" />
            <Open>Should the 5-dot progress bar live at the top of the page (sticky), or only inline next to the &ldquo;Continue&rdquo; button?</Open>
          </Step>

          <Step n={2} title="Watch the article get built">
            <P>Once they hit Continue, a 5-step builder starts. Each step adds something to the article preview on the right.</P>
            <UL items={[
              <><B>2.1 &mdash; Selected queries:</B> shown as a numbered list with X to remove and an &ldquo;Add more&rdquo; link back to step 1.</>,
              <><B>2.2 &mdash; Article preview (the magic moment):</B> a full editorial mockup styled like an AdsGPT case study. Hero image, byline, stats highlight box, intro, pull-quote, then each query becomes its own H2. Updates live as the agency tweaks.</>,
              <><B>2.3 &mdash; Article title:</B> auto-suggested from the first query, fully editable. Editing the title <B>re-ranks</B> which Yedioth sections fit best.</>,
              <><B>2.4 &mdash; Content mode:</B> &ldquo;We&rsquo;ll write the draft&rdquo; or &ldquo;I&rsquo;ll provide the copy&rdquo;.</>,
              <><B>2.5 &mdash; Section list:</B> matched Yedioth sections sorted by fit, with reason pills (&ldquo;Audience match&rdquo;, &ldquo;Title keyword&rdquo;, &ldquo;Category&rdquo;). Agency picks which ones to buy.</>,
            ]} />
            <Quote author="Alexei">It needs to be a list, not boxes. Sorted by priority. Show why each section matched.</Quote>
            <DemoLink href="/scale-publish" label="Open Agency view → Order Flow" />
            <Open>The article preview is currently full-width below the steps. Would it work better as a sticky right-rail (steps on left, preview always visible on right)?</Open>
          </Step>

          <Step n={3} title="Submit the order">
            <P>Agency confirms, hits Submit. The order lands in Yedioth&rsquo;s inbox immediately.</P>
            <UL items={[
              <>Toast confirms: <B>&ldquo;Order ORD-128 sent to Yedioth · ₪32,400&rdquo;</B></>,
              <>Confirmation screen: &ldquo;Yedioth&rsquo;s sales team will contact you within 24h. Articles publish in ~3 days.&rdquo;</>,
              <>Two buttons: &ldquo;View my orders&rdquo; / &ldquo;Place another order&rdquo;</>,
            ]} />
            <Open>Should the agency see a delivery ETA per section (&ldquo;Ynet · Cars in 2 days&rdquo;) or just one global ETA?</Open>
          </Step>

          <Step n={4} title="Track every article">
            <P>Once published, every article is tracked individually. The agency can see if GPT, Gemini, and Perplexity quote it &mdash; and export a clean CSV report for their client.</P>
            <UL items={[
              <>4 KPIs: Total views · Google-indexed · AI-cited · Ranking queries</>,
              <>Per-domain pill filter (All sites / Ynet / Calcalist...)</>,
              <>Each row: URL, site/section, publish date, views, indexed?, GPT/Gemini/Perplexity cited?, impact score</>,
              <>&ldquo;Re-check engines&rdquo; button per row · &ldquo;Export client report&rdquo; CSV at the top</>,
            ]} />
            <DemoLink href="/scale-publish" label="Open Agency view → Article Tracking" />
            <Open>Currently the citation flags are colored chips (green/red). Would a single &ldquo;3 of 3 engines&rdquo; meter with engine logos read more cleanly?</Open>
          </Step>
        </Section>

        {/* ── PUBLISHER FLOW ── */}
        <Section eyebrow="Other side of the table" title="Yedioth&rsquo;s side">
          <P style={{ marginBottom: 18 }}>This is what Yedioth&rsquo;s editor and sales team see when they log in. Toggle to <B>Publisher view</B> in the top-right of /scale-publish to follow along.</P>

          <Step n={1} title="Manage inventory & pricing">
            <P>Yedioth manages their 8 sites and 30 sections. Every section has a price they can edit on the fly.</P>
            <UL items={[
              <>Tree view: each site collapses to show its sections</>,
              <>Click any price to edit inline &mdash; the change is immediately visible to all agencies</>,
              <>Add Site / Add Section / Delete buttons (full modals, not placeholders)</>,
              <>4 KPIs at the top: Sites, Sections, Avg price, Avg upload time</>,
            ]} />
            <Quote author="Alexei">They have to manage everything &mdash; add sites, add sections, change prices. The price they change is what the agency sees.</Quote>
            <DemoLink href="/scale-publish" label="Open Publisher view → Sites & Sections" />
            <Open>Right now Add Section opens a modal. Would inline-editing within the tree feel faster for editors who add sections often?</Open>
          </Step>

          <Step n={2} title="Approve orders from the inbox">
            <P>Every agency order lands here. Editor reviews, approves; sales team contacts the agency.</P>
            <UL items={[
              <>Status filter pills: All / Pending / Approved / In progress / Published</>,
              <>4 KPIs: Pending count, In-progress count, Published, Avg order value</>,
              <>Expand any order to see queries, sections, content mode, agency contact</>,
              <>Action buttons: Approve & contact / Reject / Mark in progress / Mark published</>,
            ]} />
            <DemoLink href="/scale-publish" label="Open Publisher view → Order Inbox" />
            <Open>When publisher rejects an order &mdash; should we ask for a reason that the agency sees, or just send a generic &ldquo;not approved&rdquo;?</Open>
          </Step>

          <Step n={3} title="Track every published article">
            <P>Once published, the article URL appears here and gets tracked individually. Per-item, not per-domain.</P>
            <UL items={[
              <>4 KPIs: Total views, Indexed (X/Y), AI-cited (X/Y), Avg impact</>,
              <>Per-site filter dropdown</>,
              <>Re-check engines button (animated, updates citation flags)</>,
              <>Export CSV for the publisher&rsquo;s records</>,
            ]} />
            <DemoLink href="/scale-publish" label="Open Publisher view → Articles & Tracking" />
            <Open>Should the publisher get a notification when an article they published gets cited by an AI engine for the first time? (Right now: silent.)</Open>
          </Step>

          <Step n={4} title="Watch the money flow">
            <P>The dashboard Alexei was most excited about. Revenue, funnel, AI citations &mdash; all in one view.</P>
            <UL items={[
              <>Hero: &ldquo;₪X this month · N articles live&rdquo;</>,
              <>4 KPIs: Revenue this month, Pending revenue, Avg order value, AI-citation rate</>,
              <>Revenue trend chart: 12-week bars, dashed average line, current week highlighted</>,
              <>Order funnel: Submitted → Approved → In progress → Published</>,
              <>AI engine citation rates: ChatGPT, Gemini, Perplexity (each in its brand color)</>,
              <>Top 6 sections by revenue · Revenue by site (% share)</>,
            ]} />
            <Quote author="Alexei">Flow of money. Flow of orders. They need to see it and feel it.</Quote>
            <DemoLink href="/scale-publish" label="Open Publisher view → Analytics" />
            <Open>Currently it&rsquo;s 6 widgets in a single column. Would a 2-column grid (revenue widgets left, AI/citation widgets right) read better on a 1440 monitor?</Open>
          </Step>
        </Section>

        {/* ── DESIGN QUESTIONS BUNDLED ── */}
        <Section eyebrow="The big questions" title="Where I need your eye">
          <P style={{ marginBottom: 14 }}>The functional flow is locked. These are the visual + interaction calls I&rsquo;d love your take on before Thursday.</P>
          <Card accent={AMBER}>
            <UL items={[
              <><B>Hero / feature image:</B> who provides it? Editor uploads, AI generates from title, or agency provides? (Right now: gradient placeholder.)</>,
              <><B>Article preview:</B> read-only mockup, or live WYSIWYG where the agency can edit copy in place?</>,
              <><B>&ldquo;I&rsquo;ll provide the copy&rdquo; mode:</B> upload a Word doc, or paste into a rich-text editor?</>,
              <><B>Premium pricing:</B> if a section has high AI-citation rates, should the publisher be able to mark it &ldquo;Premium&rdquo; with a badge agencies see?</>,
              <><B>RTL Hebrew UI:</B> needed for the Yedioth editor team, or is English-LTR fine since they&rsquo;re tech-comfortable?</>,
              <><B>Mobile order placement:</B> realistic, or do agencies always do this on desktop? Decides how much we polish mobile Order Flow.</>,
              <><B>Re-check cadence:</B> daily auto-refresh, on-demand only, or both?</>,
            ]} />
          </Card>
        </Section>

        {/* ── STATUS ── */}
        <Section eyebrow="Honest status" title="Built · Open · Next">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
            <Card accent={GREEN}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: GREEN, margin: "0 0 10px" }}>✓ Built and live</h3>
              <UL items={[
                <>Two-user toggle with shared state (Agency ↔ Publisher)</>,
                <>5-bullet query selection · numbered query list · AdsGPT-style article preview</>,
                <>List-not-boxes section matching with reason pills · title-affects-matching</>,
                <>Editable pricing with toast feedback · Add/Delete site/section modals</>,
                <>Order approval workflow · per-article tracking · Re-check engines · CSV exports</>,
                <>Full Analytics view · per-domain filters · KPI tooltips · light/dark mode</>,
                <>Mobile responsive across all views</>,
              ]} />
            </Card>
            <Card accent={BLUE}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: BLUE, margin: "0 0 10px" }}>→ Next sprint (after Yedioth meeting)</h3>
              <UL items={[
                <>Real CMS integration with Yedioth&rsquo;s publishing system (URL push-back)</>,
                <>Real engine-check pipeline (replace simulated re-check with actual GPT/Gemini/Perplexity calls)</>,
                <>Hebrew UI option for editor team</>,
                <>Multi-brand agency support · approval comments · email/Slack notifications</>,
                <>Stripe / Tranzila payment instead of &ldquo;sales contacts you&rdquo;</>,
                <>Editor in-line citation suggestions when articles aren&rsquo;t getting cited</>,
              ]} />
            </Card>
          </div>
        </Section>

        {/* ── GLOSSARY ── */}
        <Section eyebrow="One-line definitions" title="Glossary">
          <Card>
            <UL items={[
              <><B>AI citation</B> &mdash; when ChatGPT or Gemini quotes the article in an answer to a user&rsquo;s question.</>,
              <><B>Query</B> &mdash; a question a brand wants to be the answer to (&ldquo;Best banking app in Israel?&rdquo;).</>,
              <><B>Section</B> &mdash; a sub-page on a Yedioth site (e.g., Ynet · Cars). Each has its own price.</>,
              <><B>Order</B> &mdash; a bundle of sections an agency buys for one article.</>,
              <><B>AdsGPT-style preview</B> &mdash; the editorial mockup in step 2.2; modeled on the AdsGPT case study layout.</>,
              <><B>GEO / AEO</B> &mdash; Generative Engine Optimization / Answer Engine Optimization. Geoscale&rsquo;s category.</>,
              <><B>Impact score</B> &mdash; per-article composite of indexing + citation + ranking.</>,
            ]} />
          </Card>
        </Section>

        {/* ── BOTTOM CTA ── */}
        <div style={{ marginTop: 50, padding: "30px 24px", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", borderRadius: 14, color: "#fff", textAlign: "center" }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>That&rsquo;s the whole flow.</h3>
          <p style={{ fontSize: 15, color: "#CBD5E1", margin: "0 0 18px" }}>Click below to play with the live demo. Toggle Agency ↔ Publisher in the header.</p>
          <a href="/scale-publish" style={{ display: "inline-block", padding: "12px 28px", background: GREEN, color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Open the live demo →</a>
        </div>

      </div>
    </div>
  );
}

// ── Helpers ──
function Section({ id, eyebrow, title, children }: { id?: string; eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ margin: "44px 0 0" }}>
      <div style={{ marginBottom: 16 }}>
        {eyebrow && <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 6 }}>{eyebrow}</div>}
        <h2 style={{ fontSize: 28, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2, letterSpacing: "-0.4px" }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Card({ children, accent, style }: { children: React.ReactNode; accent?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderLeft: accent ? `4px solid ${accent}` : `1px solid ${BORDER}`, borderRadius: 12, padding: 22, ...style }}>
      {children}
    </div>
  );
}

function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return <span style={{ display: "inline-block", padding: "5px 12px", fontSize: 11, fontWeight: 700, background: `${color}15`, color, borderRadius: 4, letterSpacing: 1.2, textTransform: "uppercase" }}>{children}</span>;
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: GREEN, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, flexShrink: 0, marginTop: 2 }}>{n}</div>
      <Card style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: 19, fontWeight: 700, color: TEXT, margin: "0 0 10px" }}>{title}</h3>
        <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.7 }}>{children}</div>
      </Card>
    </div>
  );
}

function FlowStep({ n, label, sub, color, last }: { n: number; label: string; sub: string; color: string; last?: boolean }) {
  return (
    <div style={{ position: "relative", textAlign: "center", padding: "16px 8px", background: `${color}08`, borderRadius: 10, border: `1px solid ${color}30` }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, marginBottom: 8 }}>{n}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: TEXT_MUTED }}>{sub}</div>
      {!last && <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", color: TEXT_MUTED, fontSize: 14, fontWeight: 700 }}>→</div>}
    </div>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155", margin: "0 0 12px", ...style }}>{children}</p>;
}

function B({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: TEXT, fontWeight: 700 }}>{children}</strong>;
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ margin: "0 0 0", paddingLeft: 22, fontSize: 15, lineHeight: 1.75, color: "#334155" }}>
      {items.map((it, i) => (
        <li key={i} style={{ marginBottom: 7 }}>{it}</li>
      ))}
    </ul>
  );
}

function Quote({ children, author }: { children: React.ReactNode; author: string }) {
  return (
    <blockquote style={{ borderLeft: `4px solid ${GREEN}`, padding: "8px 0 8px 18px", margin: "14px 0 4px", fontSize: 15, fontStyle: "italic", color: "#475569", lineHeight: 1.55 }}>
      &ldquo;{children}&rdquo;
      <span style={{ display: "block", marginTop: 6, fontStyle: "normal", fontSize: 12, fontWeight: 700, color: TEXT_MUTED }}>&mdash; {author}</span>
    </blockquote>
  );
}

function DemoLink({ href, label }: { href: string; label: string }) {
  return (
    <div style={{ marginTop: 14 }}>
      <a href={href} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: SOFT_GREEN, color: GREEN, borderRadius: 7, fontSize: 13, fontWeight: 700, textDecoration: "none", border: `1px solid ${GREEN}30` }}>
        ▶ {label}
      </a>
    </div>
  );
}

function Open({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 14, padding: "12px 14px", background: `${AMBER}08`, borderLeft: `3px solid ${AMBER}`, borderRadius: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: AMBER, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Design question for you</div>
      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}
