export default function InnaSpecPage() {
  return (
    <div dir="ltr" style={{ fontFamily: "'Inter', 'Heebo', sans-serif", background: "#FAFAFA", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ background: "#000", color: "#fff", padding: "40px 24px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 13, color: "#10A37F", fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>GEOSCALE DESIGN SPEC</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>Full design specification</h1>
          <p style={{ fontSize: 15, color: "#999", margin: 0 }}>For the design team — design direction for the Geoscale product</p>
          <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://geoscale-demo-design.vercel.app" target="_blank" style={{ padding: "8px 20px", background: "#10A37F", color: "#fff", borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View live demo</a>
            <a href="https://github.com/s0RRy12341/geoscale-demo-design" target="_blank" style={{ padding: "8px 20px", background: "transparent", color: "#fff", borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #555" }}>Source code</a>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 0" }}>
        <Card>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#333", margin: 0 }}>
            This document describes every screen in the Geoscale Demo Design — a platform that monitors brand presence across AI engines (ChatGPT, Gemini).
            The demo is built in Next.js as a clickable prototype with static data. Everything shown here is a <strong>design direction</strong>, not a finished product.
          </p>
          <p style={{ fontSize: 14, color: "#727272", marginTop: 8, marginBottom: 0 }}>
            <strong>Note:</strong> the entire design is LTR (English, left-to-right). Each section is accompanied by a screenshot from the live demo.
          </p>
        </Card>

        {/* TOC */}
        <div style={{ margin: "24px 0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Table of contents</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["#design-language", "1. Design language"],
              ["#header-footer", "2. Header & footer"],
              ["#dashboard", "3. Main dashboard"],
              ["#scan-overview", "4. Scan — Overview"],
              ["#scan-queries", "5. Scan — Queries"],
              ["#scan-audiences", "6. Scan — Audiences"],
              ["#scan-products", "7. Scan — Products"],
              ["#new-scan", "8. New scan (4 screens)"],
              ["#products-page", "9. Full products page"],
              ["#changelog", "10. Changes applied"],
              ["#priorities", "11. Priorities"],
            ].map(([href, label]) => (
              <a key={href} href={href} style={{ display: "block", padding: "8px 12px", background: "#fff", border: "1px solid #E0E0E0", borderRadius: 8, color: "#333", textDecoration: "none", fontSize: 14 }}>{label}</a>
            ))}
          </div>
        </div>

        {/* 1. Design Language */}
        <Section id="design-language" number={1} title="Design language">
          <h3 style={h3Style}>Colors — exact brand colors</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>HEX code</th>
                  <th style={thStyle}>Sample</th>
                  <th style={thStyle}>Usage</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Black", "#000000", "Main headings, primary text"],
                  ["Near-black", "#141414", "Logo wordmark, dark background"],
                  ["White", "#FFFFFF", "Main background, cards"],
                  ["Alt background", "#F9F9F9", "Secondary background (expanded rows, hover)"],
                  ["Teal", "#10A37F", "Single brand color — CTA, high percentages"],
                  ["Border", "#BFBFBF", "Card borders, divider lines"],
                  ["Thin border", "#DDDDDD", "Secondary borders, badges"],
                  ["Body text", "#333333", "Regular content text"],
                  ["Muted text", "#727272", "Secondary text, descriptions"],
                  ["Light text", "#777777", "Helper text"],
                  ["Gray icons", "#A2A9B0", "Icons, row numbers"],
                  ["Logo ring", "#ABABAB", "Gray ring of the logo"],
                  ["Gemini blue", "#4285F4", "Only for the Google Gemini icon"],
                ].map(([name, hex, usage]) => (
                  <tr key={hex}>
                    <td style={tdStyle}><strong>{name}</strong></td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13 }}>{hex}</td>
                    <td style={tdStyle}><span style={{ display: "inline-block", width: 28, height: 28, borderRadius: 6, background: hex, border: "1px solid #DDD", verticalAlign: "middle" }} /></td>
                    <td style={tdStyle}>{usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Alert type="warning">
            <strong>Key rules:</strong> no gradients at all. No shadows (box-shadow) at all. Only one color beyond black/white/gray: <code style={codeStyle}>#10A37F</code>. Everything is flat, minimal, clean.
          </Alert>

          <h3 style={h3Style}>Typography</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ padding: 16, background: "#fff", border: "1px solid #E0E0E0", borderRadius: 10 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Inter</div>
              <div style={{ fontSize: 13, color: "#727272" }}>Primary UI — buttons, navigation, numbers, labels</div>
            </div>
            <div style={{ padding: 16, background: "#fff", border: "1px solid #E0E0E0", borderRadius: 10 }}>
              <div style={{ fontFamily: "Heebo, sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Heebo</div>
              <div style={{ fontSize: 13, color: "#727272" }}>Fallback family — retained for multilingual support</div>
            </div>
          </div>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Element</th><th style={thStyle}>Size</th><th style={thStyle}>Weight</th></tr></thead>
            <tbody>
              {[
                ["Page title", "26px", "700"],
                ["Section title", "15-18px", "600"],
                ["Body text", "14px", "400"],
                ["Small text / badges", "12-13px", "—"],
                ["Large numbers (metrics)", "36-40px", "700"],
              ].map(([el, size, weight]) => (
                <tr key={el}><td style={tdStyle}>{el}</td><td style={tdStyle}>{size}</td><td style={tdStyle}>{weight}</td></tr>
              ))}
            </tbody>
          </table>

          <h3 style={h3Style}>Core components</h3>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Component</th><th style={thStyle}>Spec</th></tr></thead>
            <tbody>
              {[
                ["Card", "border: 1px solid #BFBFBF, border-radius: 10px, background: #FFFFFF"],
                ["Primary button", "background: #000, color: #FFF, border-radius: 9px, font-size: 13px, font-weight: 600"],
                ["Secondary button", "background: transparent, border: 1px solid #BFBFBF, border-radius: 9px"],
                ["Badge", "border: 1px solid #DDD, border-radius: 10px, padding: 2px 8px, font-size: 12px"],
                ["\"Mentioned\" badge", "border: 1px solid #10A37F, color: #10A37F + check icon"],
                ["\"Not mentioned\" badge", "border: 1px solid #DDD, color: #727272 + X icon"],
                ["Progress Ring", "SVG circle, stroke: #10A37F over #F9F9F9"],
              ].map(([name, spec]) => (
                <tr key={name}><td style={tdStyle}><strong>{name}</strong></td><td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12 }}>{spec}</td></tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* 2. Header & Footer */}
        <Section id="header-footer" number={2} title="Header & footer — consistent across all pages">
          <h3 style={h3Style}>Header</h3>
          <div style={{ padding: 16, background: "#1a1a1a", borderRadius: 10, color: "#ccc", fontFamily: "monospace", fontSize: 13, lineHeight: 1.8, marginBottom: 16, direction: "ltr", textAlign: "center" }}>
            ┌─────────────────────────────────────────────────────┐<br/>
            │ &nbsp;[Geoscale logo] &nbsp;&nbsp; [Dashboard | Scans] &nbsp;&nbsp; [New scan + Connected] │<br/>
            │ &nbsp;justifySelf: start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; auto-center &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; justifySelf: end &nbsp;&nbsp;│<br/>
            └─────────────────────────────────────────────────────┘
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              ["Height", "72px"],
              ["Max width", "1300px, centered"],
              ["Padding", "0 24px"],
              ["Background", "rgba(255,255,255,0.96)"],
              ["Bottom border", "1px solid #BFBFBF"],
              ["Position", "sticky, top: 0"],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "8px 12px", background: "#fff", border: "1px solid #E0E0E0", borderRadius: 8, fontSize: 13 }}>
                <strong>{k}:</strong> <code style={codeStyle}>{v}</code>
              </div>
            ))}
          </div>
          <Alert type="info">Navigation: only 2 tabs — <strong>Dashboard</strong> | <strong>Scans</strong>. &ldquo;Products / Services&rdquo; is <em>not</em> in the main menu.</Alert>

          <h3 style={h3Style}>Footer</h3>
          <p style={pStyle}>Top border: <code style={codeStyle}>1px solid #BFBFBF</code>, max width: 1300px</p>
          <ul style={ulStyle}>
            <li>Left side: circular logo + tagline &ldquo;Powered by advanced AI...&rdquo;</li>
            <li>Center: 4 links — Feedback | Report a bug | Improvement ideas | API usage</li>
            <li>Right side: © GeoScale 2026</li>
          </ul>
        </Section>

        {/* 3. Dashboard */}
        <Section id="dashboard" number={3} title="Page 1: Main dashboard ( / )">
          <Screenshot src="/spec-screenshots/01-dashboard-header.png" caption="Dashboard — top section (header + metrics + cards)" />
          <Screenshot src="/spec-screenshots/01-dashboard-full.png" caption="Dashboard — full page including pending actions and activity" />

          <h3 style={h3Style}>Title + primary metrics</h3>
          <ul style={ulStyle}>
            <li>Title: <strong>&ldquo;Brand monitoring&rdquo;</strong> — fontSize: 26px, fontWeight: 700</li>
            <li>Subtitle: &ldquo;Monitor brand presence across AI engines&rdquo; — fontSize: 14px, color: #727272</li>
            <li><strong>4 metric cards</strong> in a row: Brands (6), Scans (16), Queries (244), Average score (72%)</li>
          </ul>

          <h3 style={h3Style}>Brand cards</h3>
          <ul style={ulStyle}>
            <li>Title: <strong>&ldquo;Your brands&rdquo;</strong> + search field</li>
            <li>Each brand: name + domain + Progress Ring score + &ldquo;View scan&rdquo; button (black)</li>
            <li>3 small metrics: Articles | Pending | Presence score</li>
            <li>Required actions — action items list (teal links)</li>
            <li>Top query — quoted text</li>
          </ul>
          <p style={{ ...pStyle, color: "#727272" }}>6 example brands: All4Horses, Artisan Bakery, Orin Shapletter College, Bloomberg, Just In Time, Pest Control Co.</p>

          <h3 style={h3Style}>Bottom panel — two cards</h3>
          <ul style={ulStyle}>
            <li><strong>&ldquo;Pending actions&rdquo;</strong> (15 pending) — list of brands with score + action summary</li>
            <li><strong>&ldquo;Recent activity&rdquo;</strong> — list of completed scans with date + score</li>
          </ul>
        </Section>

        {/* 4. Scan Overview */}
        <Section id="scan-overview" number={4} title="Page 2: Scan — Overview tab ( /scan )">
          <Screenshot src="/spec-screenshots/02-scan-overview-top.png" caption="Overview — top section (header + brand + tabs + metrics)" />
          <Screenshot src="/spec-screenshots/02-scan-overview-full.png" caption="Overview — full page" />

          <h3 style={h3Style}>Brand Header</h3>
          <ul style={ulStyle}>
            <li>Large Progress Ring with score (76%)</li>
            <li>Brand name: <strong>All4Horses</strong> — fontSize: 26px, fontWeight: 700</li>
            <li>Badge <strong>&ldquo;Strong presence&rdquo;</strong> (teal border)</li>
            <li>Buttons: &ldquo;Dashboard&rdquo; (secondary) + &ldquo;New scan&rdquo; (black)</li>
          </ul>

          <h3 style={h3Style}>Four tabs</h3>
          <div style={{ padding: 12, background: "#fff", border: "1px solid #E0E0E0", borderRadius: 10, fontFamily: "monospace", fontSize: 14, textAlign: "center", marginBottom: 16 }}>
            [Overview] &nbsp;&nbsp; [Queries 37] &nbsp;&nbsp; [Audiences 5] &nbsp;&nbsp; [Products / Services]
          </div>
          <Alert type="warning">&ldquo;Products / Services&rdquo; is the fourth tab inside /scan — not in the main navigation! Each brand has its own products.</Alert>

          <h3 style={h3Style}>Metrics row — 4 cards</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
            {[
              ["76%", "Mention rate"],
              ["#9.7", "Average position"],
              ["70%", "Citation quality"],
              ["100%", "Reputation risk"],
            ].map(([val, label]) => (
              <div key={label} style={{ padding: 12, background: "#fff", border: "1px solid #E0E0E0", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: 12, color: "#727272" }}>{label}</div>
              </div>
            ))}
          </div>

          <h3 style={h3Style}>AI engine comparison — two cards</h3>
          <ul style={ulStyle}>
            <li><strong>ChatGPT (GPT-4o):</strong> 57% — teal progress bar — &ldquo;Mentioned in 25 / 37 queries&rdquo;</li>
            <li><strong>Google Gemini:</strong> 73% — blue progress bar <code style={codeStyle}>#4285F4</code> — &ldquo;Mentioned in 30 / 37 queries&rdquo;</li>
          </ul>
          <Alert type="info"><strong>No</strong> stacked bars, <strong>no</strong> bar charts — just two clean cards!</Alert>

          <h3 style={h3Style}>Customer journey stages — compact cards</h3>
          <p style={pStyle}>5 cards in a horizontal row (5-column grid). Scores &gt;= 80% are displayed in teal; below that, in black.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
            {[
              ["Awareness", "85%", true],
              ["Research", "78%", false],
              ["Decision", "62%", false],
              ["Support", "90%", true],
              ["Reputation", "95%", true],
            ].map(([name, pct, isTeal]) => (
              <div key={name as string} style={{ padding: 10, background: "#fff", border: "1px solid #E0E0E0", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: isTeal ? "#10A37F" : "#000" }}>{pct}</div>
                <div style={{ fontSize: 12, color: "#727272" }}>{name as string}</div>
              </div>
            ))}
          </div>

          <h3 style={h3Style}>Additional sections in the Overview tab</h3>
          <ul style={ulStyle}>
            <li><strong>Detected persona + competitors</strong> — two cards side by side</li>
            <li><strong>Sentiment + citation quality</strong> — two cards with donut charts</li>
            <li><strong>What worked + what&rsquo;s missing</strong> — green checks / gray X + bullet points</li>
            <li><strong>SEO vs. GEO connection</strong> — toggle buttons + table</li>
            <li><strong>Top 5 leading queries</strong> — minimal table</li>
          </ul>
        </Section>

        {/* 5. Scan Queries */}
        <Section id="scan-queries" number={5} title="Page 2: Scan — Queries tab">
          <Screenshot src="/spec-screenshots/03-scan-queries-tab.png" caption="Queries tab — table + filters" />
          <Screenshot src="/spec-screenshots/04-scan-query-expanded-snippet.png" caption="Expanded query with snippets + &ldquo;Show full answer&rdquo; button" />
          <Screenshot src="/spec-screenshots/05-scan-query-full-answer.png" caption="Full answer from ChatGPT (after clicking)" />

          <h3 style={h3Style}>Filters</h3>
          <ul style={ulStyle}>
            <li><strong>Status:</strong> All (37) | Mentioned (34) | Missing (3) | Negative (0)</li>
            <li><strong>Persona:</strong> All personas | Maya | Josh | Ori | David | Ronit</li>
          </ul>

          <h3 style={h3Style}>Query table</h3>
          <p style={pStyle}>Columns: # | Query | Persona (badge) | Stage (badge) | ChatGPT (check/X) | Gemini (check/X) | arrow</p>
          <p style={pStyle}><strong>Clicking a row</strong> → opens a panel below it with <code style={codeStyle}>#F9F9F9</code> background</p>

          <h3 style={h3Style}>Expanded panel — engine answers</h3>
          <ul style={ulStyle}>
            <li><strong>ChatGPT (GPT-4o):</strong> green icon + &ldquo;Mentioned&rdquo; / &ldquo;Not mentioned&rdquo; badge + short snippet</li>
            <li><strong>Google Gemini:</strong> blue icon + badge + snippet</li>
          </ul>

          <Alert type="info">
            <strong>&ldquo;Show full answer&rdquo; button</strong> — click → the snippet is replaced by the full answer (long text with bullet points).<br/>
            <strong>&ldquo;Hide full answer&rdquo; button</strong> — returns to the snippet.<br/><br/>
            GPT button: <code style={codeStyle}>#10A37F</code> border | Gemini button: <code style={codeStyle}>#4285F4</code> border
          </Alert>
        </Section>

        {/* 6. Scan Audiences */}
        <Section id="scan-audiences" number={6} title="Page 2: Scan — Audiences tab">
          <Screenshot src="/spec-screenshots/06-scan-audiences-tab.png" caption="Audiences tab — 5 persona cards" />

          <h3 style={h3Style}>Persona cards (3-column grid)</h3>
          <ul style={ulStyle}>
            <li>First letter of the name (filled colored circle) + <strong>name</strong> + <strong>role</strong></li>
            <li><strong>Relevance percentage</strong> (large, on the right side)</li>
            <li>Description + tag badges: age, location, domain, type</li>
            <li>Data row: X queries | X mentions</li>
            <li><strong>&ldquo;Show queries&rdquo;</strong> button (teal)</li>
          </ul>
          <p style={{ ...pStyle, color: "#727272" }}>5 personas: Maya (82%), Josh (71%), Ori (68%), David (75%), Ronit (63%)</p>
          <Alert type="warning">Top border of a persona card: <code style={codeStyle}>3px solid #10A37F</code> (teal — top side only)</Alert>
        </Section>

        {/* 7. Scan Products Tab */}
        <Section id="scan-products" number={7} title="Page 2: Scan — Products / Services tab">
          <Screenshot src="/spec-screenshots/07-scan-products-tab.png" caption="Products / services tab — 6 product cards" />

          <h3 style={h3Style}>Explainer banner</h3>
          <p style={pStyle}>Card with an info icon, title <strong>&ldquo;Products / services — what and why?&rdquo;</strong></p>

          <h3 style={h3Style}>Product cards (3-column grid)</h3>
          <p style={pStyle}>6 cards: Therapeutic riding (82%), Horse summer camp (68%), Riding lessons (75%), Riding accessories (45%), Horse tours (71%), Ranch events (58%)</p>
          <p style={pStyle}>Each card: name + type badge (product/service) + score + 3 metrics + top query</p>
          <Alert type="info"><strong>Note:</strong> this tab lives inside /scan — not in the main navigation! Each brand has its own products.</Alert>
        </Section>

        {/* 8. New Scan */}
        <Section id="new-scan" number={8} title="Page 3: New scan ( /new-scan ) — 4 screens">
          <h3 style={h3Style}>Screen 1: Brand details</h3>
          <Screenshot src="/spec-screenshots/08-newscan-screen1.png" caption="Screen 1 — details entry (brand form)" />
          <ul style={ulStyle}>
            <li>Green banner: &ldquo;AI Presence Check&rdquo;</li>
            <li>Step indicator: 3 stages — 1. Details (active) → 2. Audiences → 3. Scan</li>
            <li>Form: &ldquo;Website URL&rdquo; field + &ldquo;Brand name&rdquo; field</li>
            <li>&ldquo;Continue to audience selection&rdquo; button (black, full width)</li>
          </ul>

          <h3 style={h3Style}>Screen 2: Analysis animation</h3>
          <Screenshot src="/spec-screenshots/09-newscan-screen2.png" caption="Screen 2 — site analysis animation" />
          <ul style={ulStyle}>
            <li>Rotating logo animation with pulse rings</li>
            <li>&ldquo;Analyzing the site...&rdquo; + progress bar with shimmer</li>
          </ul>

          <h3 style={h3Style}>Screen 3: Audience / persona selection</h3>
          <Screenshot src="/spec-screenshots/10-newscan-screen3.png" caption="Screen 3 — persona selection (2-column grid)" />
          <ul style={ulStyle}>
            <li>Step indicator: stage 2 active</li>
            <li>Persona cards (2-column grid) with checkbox</li>
            <li>Stats: &ldquo;~ 35 queries will be tested&rdquo; | &ldquo;5 / 5 selected&rdquo;</li>
            <li>&ldquo;Start scan&rdquo; button (black)</li>
          </ul>

          <h3 style={h3Style}>Screen 4: Scan process</h3>
          <Screenshot src="/spec-screenshots/11-newscan-screen4.png" caption="Screen 4 — scan process with queries" />
          <ul style={ulStyle}>
            <li>Rotating logo animation + progress bar</li>
            <li>Tabs: Queries | GPT | Gemini | Analysis | Audiences | Site</li>
            <li>Query list with green checks + current query with typing cursor</li>
          </ul>

          <Alert type="info">
            <strong>Animations defined in globals.css:</strong> spin-slow, spin-reverse (gears), wave (audio bars), shimmer (progress bar), typing-cursor (blinking caret)
          </Alert>
        </Section>

        {/* 9. Products Page */}
        <Section id="products-page" number={9} title="Page 4: Products & services ( /products )">
          <Screenshot src="/spec-screenshots/12-products-page-full.png" caption="Full products / services page" />

          <h3 style={h3Style}>Explainer banner</h3>
          <p style={pStyle}>Info card with a detailed explanation and example (CallMobile) + 4 badges</p>

          <h3 style={h3Style}>Brand header</h3>
          <p style={pStyle}><strong>CallMobile</strong> (&ldquo;Example&rdquo; badge) — callmobile.com — 4 metrics: Products (6) | Queries (64) | Mentioned (46) | Score (68%)</p>

          <h3 style={h3Style}>Type filter</h3>
          <p style={pStyle}>3 buttons: <strong>All (6)</strong> | Products (3) | Services (3) — active button: black background</p>

          <h3 style={h3Style}>Product cards (3-column grid)</h3>
          <p style={pStyle}>6 cards: Mercedes-Benz (78%) | Hyundai (72%) | Kia (65%) | Fleet leasing (70%) | Auto insurance (58%) | Service center (62%)</p>
          <Alert type="warning">
            Top border on <strong>product</strong> cards: <code style={codeStyle}>3px solid #4285F4</code> (blue)<br/>
            Top border on <strong>service</strong> cards: <code style={codeStyle}>3px solid #10A37F</code> (teal)
          </Alert>

          <h3 style={h3Style}>Additional sections</h3>
          <ul style={ulStyle}>
            <li><strong>Competitors:</strong> AutoNation, Enterprise Fleet, Hertz Car Sales, Sixt Leasing — with progress bars</li>
            <li><strong>Gaps vs competitors:</strong> 5 bullet points</li>
            <li><strong>Coverage by customer journey stage:</strong> Awareness (72%) | Research (85%) | Decision (68%) | Support (76%)</li>
          </ul>
        </Section>

        {/* 10. Changelog */}
        <Section id="changelog" number={10} title="Changes applied after feedback">
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Change</th>
                <th style={thStyle}>Was</th>
                <th style={thStyle}>Now</th>
                <th style={thStyle}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Header — CSS Grid", "Flexbox", "3-column grid 1fr auto 1fr", "Consistent alignment across pages"],
                ["Products/services", "In the top menu", "4th tab inside /scan", "It's per-brand, not global"],
                ["Customer journey stages", "Horizontal progress bars", "Compact cards", "Feedback — took too much space"],
                ["AI comparison", "Stacked bars", "2 clean cards", "Didn't look good"],
                ["Full answer", "Didn't exist", "Show-full-answer button", "Request to show full responses"],
                ["Header + footer on new-scan", "Missing", "Added across all 4 screens", "Consistency"],
              ].map(([change, was, now, reason]) => (
                <tr key={change}>
                  <td style={tdStyle}><strong>{change}</strong></td>
                  <td style={tdStyle}>{was}</td>
                  <td style={tdStyle}>{now}</td>
                  <td style={tdStyle}>{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* 11. Priorities */}
        <Section id="priorities" number={11} title="What to design — priority order">
          <h3 style={{ ...h3Style, color: "#c0392b" }}>High priority</h3>
          <ul style={ulStyle}>
            <li>Main dashboard — brand cards + metrics + pending actions</li>
            <li>Scan page — Overview tab (metrics, AI comparison, journey stages, signals)</li>
            <li>Scan page — Queries tab (table + expanded row + full answer)</li>
            <li>Scan page — Audiences tab (persona cards)</li>
            <li>Header and footer (consistent template)</li>
          </ul>
          <h3 style={{ ...h3Style, color: "#e67e22" }}>Medium priority</h3>
          <ul style={ulStyle}>
            <li>New scan flow — 4 screens</li>
            <li>Scan page — Products / services tab</li>
            <li>Full products page (/products)</li>
          </ul>
          <h3 style={{ ...h3Style, color: "#27ae60" }}>Low priority</h3>
          <ul style={ulStyle}>
            <li>Scan process animations (can be simplified)</li>
            <li>Various states (loading, empty, error)</li>
          </ul>
        </Section>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "32px 0 48px", color: "#999", fontSize: 13 }}>
          Built with Claude Code (Opus 4.6) — design direction for the Geoscale product
        </div>
      </div>
    </div>
  );
}

/* ---- Reusable Components ---- */

function Section({ id, number, title, children }: { id: string; number: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingTop: 24 }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "#10A37F", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{number}</span>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 20, background: "#fff", border: "1px solid #E0E0E0", borderRadius: 10, marginBottom: 16 }}>
      {children}
    </div>
  );
}

function Screenshot({ src, caption }: { src: string; caption: string }) {
  return (
    <figure style={{ margin: "16px 0" }}>
      <div style={{ border: "1px solid #E0E0E0", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption} style={{ width: "100%", display: "block" }} />
      </div>
      <figcaption style={{ fontSize: 12, color: "#999", textAlign: "center", marginTop: 6 }}>{caption}</figcaption>
    </figure>
  );
}

function Alert({ type, children }: { type: "info" | "warning"; children: React.ReactNode }) {
  const colors = type === "warning"
    ? { bg: "#FFF8E1", border: "#FFD54F", icon: "⚠" }
    : { bg: "#E8F5E9", border: "#10A37F", icon: "ℹ" };
  return (
    <div style={{ padding: "12px 16px", background: colors.bg, borderLeft: `3px solid ${colors.border}`, borderRadius: 8, marginBottom: 16, fontSize: 14, lineHeight: 1.7 }}>
      <span style={{ marginRight: 6 }}>{colors.icon}</span> {children}
    </div>
  );
}

/* ---- Shared Styles ---- */

const h3Style: React.CSSProperties = { fontSize: 16, fontWeight: 600, margin: "20px 0 8px" };
const pStyle: React.CSSProperties = { fontSize: 14, lineHeight: 1.7, color: "#333", margin: "0 0 12px" };
const ulStyle: React.CSSProperties = { fontSize: 14, lineHeight: 1.8, color: "#333", margin: "0 0 16px", paddingLeft: 20 };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginBottom: 16, fontSize: 13, background: "#fff", borderRadius: 10, overflow: "hidden" };
const thStyle: React.CSSProperties = { padding: "10px 12px", textAlign: "left", background: "#F5F5F5", borderBottom: "1px solid #E0E0E0", fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: "8px 12px", borderBottom: "1px solid #F0F0F0", verticalAlign: "top" };
const codeStyle: React.CSSProperties = { background: "#F5F5F5", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 12 };
