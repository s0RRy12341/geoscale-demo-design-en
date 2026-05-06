"use client";

import React from "react";

// ============================================================
// SCALEPUBLISH ROADMAP — for Inna (designer)
// Clean docs-style layout. Updated 2026-05-06 with Alexei's rejection round.
// ============================================================

const GREEN = "#10A37F";
const AMBER = "#B45309";
// Cyan-700 (was royal blue #1D4ED8). Alexei 2026-05-06: blue clashed with the GeoScale palette.
const BLUE = "#0891B2";
const INK = "#0B1220";
const TEXT = "#1F2937";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const SOFT_BG = "#FAFAFA";

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export default function ScalePublishRoadmapPage() {
  return (
    <div dir="ltr" style={{ fontFamily: FONT, background: "#FFFFFF", minHeight: "100vh", color: TEXT, fontSize: 16, lineHeight: 1.6, WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}>

      {/* ── TOP BAR ── */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, background: "#FFFFFF", position: "sticky", top: 0, zIndex: 50, backdropFilter: "saturate(180%) blur(8px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: MUTED, letterSpacing: "0.02em" }}>ScalePublish · Roadmap</div>
          <a href="/scale-publish" style={{ padding: "7px 14px", background: GREEN, color: "#fff", borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.01em" }}>Open the demo</a>
        </div>
      </div>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 120px" }}>

        {/* ── TITLE BLOCK ── */}
        <header style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: GREEN, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>Updated · 6 May 2026</div>
          <h1 style={{ fontSize: 44, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-0.025em", color: INK }}>What changed since our last call</h1>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: MUTED, margin: 0, fontWeight: 400 }}>
            Every decision from our meeting is now live in the demo. Alexei sent a rejection round on 6 May, and that is also reflected. Read straight through, then click any <em>See it live</em> link to jump into the actual screen.
          </p>
        </header>

        {/* ── RECAP ── */}
        <Lede>
          <span style={{ fontWeight: 600, color: INK }}>ScalePublish</span> is a marketplace where agencies buy article placements on Yedioth Ahronoth&rsquo;s 8 sites and 30 sections. The agency picks queries to win in AI search, our system suggests which sections fit best, the agency orders, the publisher approves and publishes, and we track every article&rsquo;s AI citations. Two views, one inbox.
        </Lede>

        {/* ── TOC ── */}
        <Toc items={[
          { href: "#meeting", label: "Decisions from our call", count: 11 },
          { href: "#alexei", label: "Alexei's additions", count: 4 },
          { href: "#alexei-fixes", label: "Alexei's rejection round (6 May)", count: 4 },
          { href: "#questions", label: "Open design questions", count: 6 },
          { href: "#status", label: "Built · Next sprint" },
        ]} />

        {/* ── MEETING DECISIONS ── */}
        <SectionHeader id="meeting" eyebrow="Section 1" title="Decisions from our call" subtitle="Eleven items we agreed on. Every one is built and live." />

        <Item n={1} title="Order Flow re-ordered: Sections before Content">
          <p>You called this out: writing content before knowing where it&rsquo;s going makes no sense. The wizard now goes:</p>
          <Steps items={[
            "Selected queries",
            "Article title (auto-suggested, editable, drives matching)",
            "Pick Yedioth sections + the do-follow backlink target",
            "Content mode (AI draft / agency provides copy)",
            "Review & submit",
          ]} />
          <Note>The progress bar at the top is clickable, so users can jump back to any completed step.</Note>
          <SeeLive href="/scale-publish" />
        </Item>

        <Item n={2} title="Multi-site warning banner">
          <p>When the agency adds sections from 2+ sites, a yellow banner appears in Step 3 explaining: <em>&ldquo;Same intent, different wording &mdash; every query is rephrased and every answer reworded so each site gets its own version. Google penalizes duplicate content across domains.&rdquo;</em></p>
          <Note>Triggered automatically when 2+ unique site IDs are in the cart.</Note>
        </Item>

        <Item n={3} title={`AI top-3 recommendations + "Use AI's pick"`}>
          <p>Before the section list, a green banner shows the top-3 highest-fit sections with a one-click <strong>Use AI&rsquo;s pick</strong> button that adds all three to the cart. Toggles to <strong>Top 3 selected</strong> when active.</p>
          <Note>Useful for agencies who don&rsquo;t want to read 18 rows of section matches.</Note>
        </Item>

        <Item n={4} title='"Match Score" rename + tooltip'>
          <p>The number next to each section was called <strong>FIT SCORE</strong>. Renamed to <strong>MATCH SCORE</strong> with an info-icon tooltip:</p>
          <Bullets items={[
            "70 and up — strong match, recommended",
            "40 to 69 — decent match",
            "Under 40 — weak match, consider another section",
          ]} />
        </Item>

        <Item n={5} title="Brand context selector (top-right)">
          <p>Agencies manage multiple brands. The header now has a brand dropdown with all 5 demo brands (Bank Hapoalim, all4horses, TechStart Israel, Paradise Gardening, Artisan Bread Co), each showing the latest scan date and query count. Clicking a brand routes to its ScalePublish context.</p>
          <Note>One entry per brand, latest scan only — never duplicates.</Note>
        </Item>

        <Item n={6} title="Content mode (Step 4) — XSS-safe rewrite">
          <p>Two safe textareas instead of contentEditable:</p>
          <Bullets items={[
            <><strong>Visual tab</strong> — serif Georgia styling for editorial feel</>,
            <><strong>Code tab</strong> — monospace for direct paste</>,
            <><strong>Word file upload</strong> — reads as plain text via FileReader (no innerHTML, no XSS surface)</>,
            <><strong>AI scan</strong> — one-click button returns covered queries (with coverage %), missing queries, and recommendations</>,
          ]} />
          <Note>Zero <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>dangerouslySetInnerHTML</code> in the entire codebase.</Note>
        </Item>

        <Item n={7} title="AI draft body editing">
          <p>For AI-generated mode, the agency can toggle <strong>Edit draft</strong> and override the body text per query (one textarea per H2 section). The article title stays locked — only section bodies are editable, so the structure can&rsquo;t drift from the matched queries.</p>
        </Item>

        <Item n={8} title="SMS-sent card after submit">
          <p>After hitting Submit, a phone-mockup card appears showing the SMS that was &ldquo;dispatched&rdquo; to the publisher director. Includes order ID, agency, sites, sections, total, and payment breakdown. Designed for the live Ynet demo.</p>
          <SeeLive href="/scale-publish" label="Submit any order to see the SMS card" />
        </Item>

        <Item n={9} title='"Scans" link hidden in publisher mode'>
          <p>Publishers don&rsquo;t manage scans. The header navigation hides <strong>Scans</strong> when the user is in Publisher view.</p>
        </Item>

        <Item n={10} title="Custom queries on the Scan page">
          <p>The Scan page now has an <strong>Add custom query</strong> button. Modal collects text + persona dropdown + journey stage. Custom queries are saved to localStorage and appear inline alongside AI-discovered ones.</p>
          <Note>So agencies can add queries the scan didn&rsquo;t auto-detect.</Note>
        </Item>

        <Item n={11} title="Client sharing flow (the missing piece)">
          <p>You raised this as the gap: agencies need to share with their client before sending to the publisher. Now built end-to-end:</p>
          <Bullets items={[
            <>Agency hits <strong>Share with client</strong> on any order — mints a shareId and opens a modal for client name, email, optional message</>,
            <>Generated share URL: <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>/scale-publish?clientShare=&lt;id&gt;</code></>,
            "Copy / WhatsApp / Email / Preview-as-client buttons in the share modal",
            "Client opens the URL — sees a clean, agency-branded review page (no Geoscale internals)",
            <>Client decides: <strong>Approve</strong> or <strong>Request changes</strong> with a note</>,
            "Bidirectional comment thread between agency and client, persisted on the order",
            "Status banner in the agency view: pending / approved / changes requested",
          ]} />
          <SeeLive href="/scale-publish" label="Agency view → My Orders → Share with client" />
        </Item>

        {/* ── ALEXEI'S ADDITIONS ── */}
        <SectionHeader id="alexei" eyebrow="Section 2" title="Alexei's additions" subtitle="Article bank, do-follow backlink, payment selector. Reflects the latest 6 May behaviour, not the original credit-tier proposal." />

        <Item n={1} title="Article Bank — prepaid balance, publisher-managed (NIS, not credits)">
          <p>Agencies hold a prepaid balance with Yedioth, denominated in NIS. Yedioth sells the bank manually (meetings, wire/invoice), then updates the balance directly in their admin. There is no credit-card checkout in the demo.</p>
          <Bullets items={[
            <><strong>Agency view</strong> — balance widget in the header (live NIS amount). Click opens the bank modal: balance, request top-up form (preset chips ₪25K / ₪50K / ₪100K / ₪250K / ₪500K plus free input), top-up history, full balance ledger.</>,
            <><strong>Publisher view</strong> — new <strong>Article Bank</strong> tab. Pending agency requests appear as cards: Approve · Adjust amount · Decline. Each agency has a manual adjustment row: <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>Apply ±₪N</code> (relative) and <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>Set to ₪N</code> (absolute). Both write a ledger entry with the publisher's reason note.</>,
            <><strong>Bank ledger</strong> — every grant, every order debit, every manual adjustment. Visible to both sides. Both sides know what the balance came from at any point in time.</>,
          ]} />
          <p>Demo seed: each agency starts with ₪50,000 (covers about five articles at the avg ₪9,400 anchor price), so the &ldquo;Pay from bank&rdquo; flow can be demoed without first asking the publisher to top up.</p>
          <SeeLive href="/scale-publish" label="Agency: bank widget in the header. Publisher: Article Bank tab" />
        </Item>

        <Item n={2} title="Do-follow backlink in every article">
          <p>Every article carries one do-follow link to the client&rsquo;s site. Standard, not an upsell. The agency just picks where the link points and what it says, both fields are optional with sensible defaults:</p>
          <Bullets items={[
            <><strong>Target URL</strong> — defaults to the brand&rsquo;s homepage if left blank</>,
            <><strong>Anchor text</strong> — defaults to the brand name if left blank</>,
          ]} />
          <Note>The publisher sees the embed instructions in the order detail (with a reminder not to add <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>rel=&quot;nofollow&quot;</code>). The client sees the destination + anchor in the review screen too.</Note>
        </Item>

        <Item n={3} title="Payment selector at checkout">
          <p>Step 5 (Review) has three payment options, all denominated in NIS:</p>
          <Bullets items={[
            <><strong>Cash invoice</strong> — pay {`{cartTotal}`} on the master proposal, 30-day terms</>,
            <><strong>Pay from bank</strong> — deduct {`{cartTotal}`} from the prepaid balance, no cash on this order. Disabled when balance &lt; cart total.</>,
            <><strong>Bank + cash</strong> — bank covers what it can (highest priority), the remainder is invoiced. Live math summary shows what comes from each.</>,
          ]} />
          <p>Live summary example: <em>&ldquo;You&rsquo;ll pay ₪32,000 from bank + ₪9,800 cash · balance after order: ₪18,000.&rdquo;</em></p>
          <Note>The bank is debited the moment the order is submitted. A ledger entry is written with the order ID and section count.</Note>
        </Item>

        <Item n={4} title="Order metadata flows everywhere">
          <p>Backlink + payment info appears in:</p>
          <Bullets items={[
            <>The agency&rsquo;s order list (badge: &ldquo;₪32,000 from bank + cash&rdquo;)</>,
            "The publisher's order inbox (full embed instructions)",
            "The client review page (target URL + anchor for transparency)",
            "The post-submit SMS to the publisher director",
          ]} />
        </Item>

        {/* ── ALEXEI'S REJECTION ROUND (6 MAY) ── */}
        <SectionHeader id="alexei-fixes" eyebrow="Section 3" title="Alexei's rejection round (6 May)" subtitle="Four rejection items after he saw the first build. Every one is addressed in the live demo." />

        <Item n={1} title="Article Bank: money, not credits. Publisher-managed, not credit-card checkout">
          <p>Original build: 4-tier credit bundle cards (Starter / Growth / Scale / Enterprise) with a &ldquo;Buy now&rdquo; checkout. Alexei&rsquo;s feedback: <em>&ldquo;They sell the bank themselves manually. People don&rsquo;t buy it with credit card. They&rsquo;ll arrange in meetings, the publisher updates the budget in admin, the agency can mark a request and that goes to the publisher.&rdquo;</em></p>
          <p>What we changed (now the publisher&rsquo;s default landing tab so the new flow is impossible to miss):</p>
          <Bullets items={[
            <>Removed all 4 bundle cards and the credit-tier pricing. The bank is now denominated in <strong>NIS, not credits</strong>. Each article&rsquo;s price deducts from the balance directly.</>,
            <>The agency modal is now a <strong>request top-up form</strong> (preset NIS amounts + free input + optional note). No checkout. Submitting creates a <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>TopUpRequest</code> that lands in the publisher&rsquo;s inbox for manual fulfilment.</>,
            <>The publisher gets a new <strong>Article Bank</strong> admin tab (defaulted as the first tab now) with three sections: pending top-up requests with Approve / Adjust / Decline, an agency balance row with manual <strong>Apply ±₪N</strong> and <strong>Set to ₪N</strong> controls, and the full bank ledger.</>,
            <>Order debits in NIS go into the same ledger that publisher top-ups go into, so both sides see one continuous money trail. Each entry shows reason and who made it (publisher / system).</>,
          ]} />
          <SeeLive href="/scale-publish" label="Publisher view → Article Bank tab (default)" />
        </Item>

        <Item n={2} title="Blue replaced with cyan">
          <p>Alexei: <em>&ldquo;The blue colour doesn&rsquo;t look good in GeoScale.&rdquo;</em> The old <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>#1D4ED8</code> royal blue clashed with the green/amber palette.</p>
          <Bullets items={[
            <><strong>BRAND_BLUE</strong> changed to <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>#0891B2</code> (cyan-700). Distinctly cool, fits the GeoScale name, plays well with brand green/amber.</>,
            <>Approved-status pill, target-URL link colour, AI-engine pills, in-progress button, tracking module header, and best-value badge: all moved to the new cyan automatically through the constant.</>,
          ]} />
        </Item>

        <Item n={3} title="Dark-mode contrast + typography pass">
          <p>Alexei: <em>&ldquo;The grey on black is hard to see, the font can&rsquo;t be grey inside black, big numbers can&rsquo;t be grey, reduce the bold a bit, have smaller fonts, not just regular and bold.&rdquo;</em></p>
          <Bullets items={[
            <><strong>Dark-theme tokens bumped lighter</strong>, <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>textSecondary</code> from <code style={{ fontSize: 13 }}>#9DA5B0</code> to <code style={{ fontSize: 13 }}>#B0B8C2</code>; <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>textMuted</code> from <code style={{ fontSize: 13 }}>#7B8590</code> to <code style={{ fontSize: 13 }}>#94A3B0</code>. Single-point fix, every existing usage benefits.</>,
            <><strong>Big numbers stay on the brightest text colour</strong>. Impact-score below 40 was rendering in <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>textSecondary</code>; now uses <code style={{ fontSize: 13, padding: "1px 5px", background: SOFT_BG, borderRadius: 4 }}>theme.text</code>.</>,
            <><strong>Bold density reduced</strong>. Every <code style={{ fontSize: 13 }}>fontWeight: 800</code> dropped to <code style={{ fontSize: 13 }}>700</code> (51 instances). Hierarchy now reads 500 / 600 / 700 instead of 600 / 700 / 800.</>,
            <><strong>Tabular numerals</strong> on every balance, ledger amount, KPI, and request total, so digits align cleanly between rows.</>,
          ]} />
        </Item>

        <Item n={4} title="Decorative icons stripped from the demo chrome">
          <p>Alexei (in passing, after seeing the build): <em>&ldquo;Lose the icons in GeoScale, they&rsquo;re ugly.&rdquo;</em> The demo had a leftover ChatGPT-feeling iconography (briefcase, cart, inbox, chart, sparkle, users, building) attached to nearly every chip and tab.</p>
          <Bullets items={[
            <>Tab rows in both views (Sites &amp; Sections, Order Inbox, Article Bank, Articles &amp; Tracking, Analytics on the publisher side, plus My Queries / Order Flow / My Orders / Article Tracking on the agency side) now render label-only.</>,
            <>Logged-in card no longer puts an SVG inside a coloured square; it now shows the brand or publisher initial in a neutral monogram tile.</>,
            <>Empty-state cards (no orders yet, no orders to show) lost the giant inbox glyph; copy alone now carries the state.</>,
            <>Action buttons (Share with client, Export CSV, Export client report, Export report, content-mode chip) and the section card&rsquo;s upload-time chip dropped their leading icon. Functional UX icons (chevrons, search field, close X, pin marker, the navigation arrow on Continue / Back) stay because they carry meaning.</>,
          ]} />
        </Item>

        {/* ── OPEN QUESTIONS ── */}
        <SectionHeader id="questions" eyebrow="Section 4" title="Open design questions" subtitle="Where I'd love your eye before Thursday." />

        <QuestionList items={[
          <><strong>Bank balance widget in header</strong> — currently shows the full NIS amount with the &ldquo;Request top-up&rdquo; CTA inline. On mobile it wraps below the user role row. Worth giving it a dedicated icon-only button on small screens?</>,
          <><strong>Publisher Article Bank tab layout</strong> — pending requests at the top, agency balances in the middle, ledger at the bottom. Is that the right priority order, or should the always-visible balance row be the hero?</>,
          <><strong>Backlink panel placement</strong> — lives at the top of Step 3. Would it feel better as a collapsed accordion (open by default) so the section list is the focus?</>,
          <><strong>Payment selector</strong> — 3 tiles in a row (cash / bank / hybrid). Should disabled tiles (when balance is 0 or insufficient) hide entirely, or stay visible greyed-out?</>,
          <><strong>Hero / feature image</strong> — still open from the last call. Editor uploads, AI generates from title, or agency provides?</>,
          <><strong>RTL Hebrew UI</strong> — needed for Yedioth&rsquo;s editor team, or English-LTR fine?</>,
        ]} />

        {/* ── STATUS ── */}
        <SectionHeader id="status" eyebrow="Section 5" title="Built · Next sprint" subtitle="Where we are honestly." />

        <StatusBlock title="Built and live" color={GREEN} items={[
          "Two-user toggle with shared state (Agency ↔ Publisher)",
          "5-bullet query selection · numbered query list · AdsGPT-style article preview",
          "List-not-boxes section matching with reason pills · title-affects-matching",
          "Editable pricing with toast feedback · Add/Delete site/section modals",
          "Order approval workflow · per-article tracking · Re-check engines · CSV exports",
          "Full Analytics view · per-domain filters · KPI tooltips · light/dark mode",
          "All 11 meeting decisions (steps reordered, multi-site warning, AI top-3, match-score tooltip, brand selector, content tabs, AI draft editing, SMS card, custom queries, hidden Scans link, client sharing)",
          "Client sharing flow end-to-end (mint, share, review, decision, comment thread)",
          "Article Bank, publisher-managed in NIS: agency widget, request-top-up modal, publisher admin tab with approve / adjust / decline + manual ±N / Set-to-N, full bank ledger",
          "Do-follow backlink in every article (target + anchor with defaults)",
          "Payment selector (cash / pay from bank / bank + cash) with live NIS math",
          "Cyan-700 instead of royal blue everywhere (also fixed the News pill on /scan). Dark-theme tokens bumped lighter for contrast. Bold density reduced (51 places). Tabular numerals on balances, KPIs, ledger rows.",
          "Decorative icons stripped from publisher and agency tabs, logged-in card, empty states, and export / share buttons. Functional icons (chevron, search, close, pin, arrow on Continue/Back) kept.",
          "Publisher view now defaults to the Article Bank tab so Alexei's new admin flow is the first thing visible after switching to Publisher View.",
          "Mobile responsive across all views",
        ]} />

        <StatusBlock title="Next sprint · after the Yedioth meeting" color={BLUE} items={[
          "Real CMS integration with Yedioth's publishing system (URL push-back)",
          "Real engine-check pipeline (replace simulated re-check with actual GPT/Gemini/Perplexity calls)",
          "Hebrew UI option for the editor team",
          "Multi-brand agency support · approval comments · email/Slack notifications",
          "Multi-tenant agency directory in the publisher Article Bank tab (right now it's a single-row demo)",
          "Editor in-line citation suggestions when articles aren't getting cited",
        ]} />

        {/* ── BOTTOM ── */}
        <div style={{ marginTop: 80, padding: "40px 32px", background: SOFT_BG, border: `1px solid ${BORDER}`, borderRadius: 14, textAlign: "center" }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: INK, letterSpacing: "-0.01em" }}>That&rsquo;s the whole update.</h3>
          <p style={{ fontSize: 16, color: MUTED, margin: "0 0 22px", lineHeight: 1.55 }}>Open the live demo and toggle Agency ↔ Publisher in the header.</p>
          <a href="/scale-publish" style={{ display: "inline-block", padding: "12px 28px", background: GREEN, color: "#fff", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "0.01em" }}>Open the live demo</a>
        </div>

      </main>
    </div>
  );
}

// ============================================================
// PRIMITIVES — clean, repeatable, no nested cards
// ============================================================

function Lede({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "20px 24px", background: SOFT_BG, borderLeft: `3px solid ${GREEN}`, borderRadius: 4, marginBottom: 36, fontSize: 16, lineHeight: 1.7, color: TEXT }}>
      {children}
    </div>
  );
}

function Toc({ items }: { items: { href: string; label: string; count?: number }[] }) {
  return (
    <nav style={{ marginBottom: 56, padding: "20px 24px", border: `1px solid ${BORDER}`, borderRadius: 10, background: "#FFFFFF" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>On this page</div>
      <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((it, i) => (
          <li key={i}>
            <a href={it.href} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, padding: "8px 0", fontSize: 15, fontWeight: 500, color: TEXT, textDecoration: "none", borderBottom: i < items.length - 1 ? `1px dashed ${BORDER}` : "none" }}>
              <span><span style={{ color: MUTED, fontVariantNumeric: "tabular-nums", marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>{it.label}</span>
              {typeof it.count === "number" && <span style={{ fontSize: 13, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{it.count} items</span>}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SectionHeader({ id, eyebrow, title, subtitle }: { id: string; eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div id={id} style={{ marginTop: 80, marginBottom: 32, paddingTop: 32, borderTop: `1px solid ${BORDER}`, scrollMarginTop: 80 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{eyebrow}</div>
      <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 10px", color: INK, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 17, color: MUTED, margin: 0, lineHeight: 1.55, fontWeight: 400 }}>{subtitle}</p>}
    </div>
  );
}

function Item({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <article style={{ display: "flex", gap: 20, paddingBottom: 32, marginBottom: 32, borderBottom: `1px solid ${BORDER}`, alignItems: "flex-start" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: SOFT_BG, color: INK, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0, fontVariantNumeric: "tabular-nums", border: `1px solid ${BORDER}`, marginTop: 2 }}>{n}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px", color: INK, lineHeight: 1.3, letterSpacing: "-0.01em" }}>{title}</h3>
        <div style={{ fontSize: 16, lineHeight: 1.7, color: TEXT }}>{children}</div>
      </div>
    </article>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol style={{ margin: "12px 0", padding: 0, listStyle: "none", counterReset: "step", display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "8px 12px", background: SOFT_BG, borderRadius: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, letterSpacing: "0.06em", minWidth: 50 }}>STEP {i + 1}</span>
          <span style={{ fontSize: 15, color: TEXT }}>{it}</span>
        </li>
      ))}
    </ol>
  );
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ margin: "12px 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: "flex", gap: 12, fontSize: 15.5, lineHeight: 1.65, color: TEXT }}>
          <span style={{ flexShrink: 0, marginTop: 9, width: 5, height: 5, borderRadius: "50%", background: MUTED }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ marginTop: 14, marginBottom: 0, fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{children}</p>
  );
}

function SeeLive({ href, label }: { href: string; label?: string }) {
  return (
    <a href={href} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "8px 14px", background: "#FFFFFF", color: INK, borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: "none", border: `1px solid ${BORDER}`, letterSpacing: "0.01em" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
      See it live{label ? ` · ${label}` : ""}
      <span style={{ color: MUTED, marginLeft: 2 }}>→</span>
    </a>
  );
}

function QuestionList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol style={{ margin: 0, padding: 0, listStyle: "none", counterReset: "q" }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: "flex", gap: 18, padding: "20px 0", borderBottom: i < items.length - 1 ? `1px solid ${BORDER}` : "none", alignItems: "flex-start" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: AMBER, letterSpacing: "0.06em", minWidth: 28, marginTop: 3, fontVariantNumeric: "tabular-nums" }}>Q{i + 1}</div>
          <div style={{ flex: 1, fontSize: 15.5, lineHeight: 1.7, color: TEXT }}>{it}</div>
        </li>
      ))}
    </ol>
  );
}

function StatusBlock({ title, color, items }: { title: string; color: string; items: React.ReactNode[] }) {
  return (
    <div style={{ marginBottom: 24, padding: "24px 28px", border: `1px solid ${BORDER}`, borderLeft: `4px solid ${color}`, borderRadius: 10, background: "#FFFFFF" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <h3 style={{ fontSize: 17, fontWeight: 700, color: INK, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
      </div>
      <Bullets items={items} />
    </div>
  );
}
