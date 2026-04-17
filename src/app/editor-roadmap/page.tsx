"use client";

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

type Phase = {
  id: number;
  title: string;
  subtitle: string;
  deliverables: string[];
  status: "done" | "in_progress" | "queued";
  color: string;
};

const PHASES: Phase[] = [
  {
    id: 1,
    title: "WYSIWYG editor",
    subtitle: "Editor UI with toolbar — headings, lists, links, images",
    deliverables: ["Full toolbar (H1-H3, B/I/U, lists, quote)", "Drag & drop image upload", "Auto-save", "Version history"],
    status: "in_progress",
    color: "#000",
  },
  {
    id: 2,
    title: "Switch writing model to Claude",
    subtitle: "Migrate from current model to Claude Opus 4.6 by Anthropic",
    deliverables: ["Anthropic API integration", "Brand-specific prompt engineering", "System-prompt caching", "Fallback to secondary model"],
    status: "queued",
    color: "#D97706",
  },
  {
    id: 3,
    title: "Nir's SEO writing prompt",
    subtitle: "Master prompt that guides every article generation (shared with Inna)",
    deliverables: ["Nir's master prompt as system prompt", "Per-brand context injection", "Real-time validation against the prompt", "Continuous prompt refinement"],
    status: "queued",
    color: "#10A37F",
  },
  {
    id: 4,
    title: "AI that learns from edits",
    subtitle: "Learning loop — every edit is captured and feeds the next prompt",
    deliverables: ["Diff engine — detect changes between versions", "Edit classification (style/grammar/content)", "Dynamic system-prompt updates", "Learning dashboard"],
    status: "queued",
    color: "#7C3AED",
  },
  {
    id: 5,
    title: "QA + client beta",
    subtitle: "End-to-end QA and first client rollout",
    deliverables: ["QA test scripts", "RTL/LTR validation", "User documentation", "Beta to first 3 clients"],
    status: "queued",
    color: "#0EA5E9",
  },
];

const NIR_PROMPT = `<role>
You are a senior SEO content writer creating a cornerstone article for {brand} in the {vertical} vertical. The article must rank in Google's top 3 results and be cited by generative engines (ChatGPT, Gemini, Perplexity) as the authoritative source on "{primary_keyword}".
</role>

<article_structure>
1. H1 that opens with {primary_keyword} and promises concrete value.
2. Opening paragraph (40-60 words) answering the query directly — the "snippet-able" answer that AI engines quote.
3. At least 3 H2 sections using semantic variations of {primary_keyword}. Do NOT reuse the exact keyword as H2.
4. Under each H2: short lead paragraph, then either a bulleted list, a numbered process, a comparison table, or a pull quote. Mix the formats — never repeat the same pattern.
5. One FAQ section (3-5 Qs) optimized for People Also Ask — phrase the H3 as a real question with "?".
6. Closing CTA paragraph that references {brand_url} and the product naturally, not as a sales pitch.
</article_structure>

<seo_rules>
- Primary keyword appears in the first 100 words and in the meta description (150-160 chars, include a CTA).
- Keyword density 1-2% — never stuff.
- Include 2-3 internal links to cornerstone pages on {brand_url}. Each link appears exactly once.
- Add descriptive alt text on every image, keyword-adjacent when relevant.
- Minimum 1,200 words. Aim for 1,500-2,000 for competitive keywords.
- Emit Schema.org FAQ JSON-LD for the FAQ section.
- Cover related entities ({entity_list}) to satisfy topical depth.
</seo_rules>

<geo_rules>
- Write so that any paragraph can be extracted and quoted by an AI engine as a standalone answer.
- Use concrete numbers, dates, and proper nouns — vague generalities don't get cited.
- Place the single most quotable sentence within the first 3 paragraphs.
- Reference sources by name (Pew, McKinsey, Gartner) when citing stats; never invent them.
</geo_rules>

<voice>
- Match {brand_voice}: {voice_examples}.
- No emdashes (—). Use regular hyphens.
- No AI filler phrases ("delve into", "in today's world", "unlock the potential").
- Write for a skimmer: the reader should get the answer from H2s + first line of each section alone.
</voice>

<output>
Return the article as clean HTML — semantic tags only (h1, h2, h3, p, ul, ol, blockquote, table, a). No inline styles.
Include a JSON block at the end with: { "title", "meta_description", "primary_keyword", "internal_links_used", "word_count", "faq_schema" }.
</output>`;

export default function EditorRoadmapPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F5", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #DDD", padding: "14px 32px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
        <div style={{ justifySelf: "start" }}><GeoscaleLogo width={140} /></div>
        <nav style={{ display: "flex", gap: 24 }}>
          <a href="/" style={{ fontSize: 14, color: "#727272", textDecoration: "none" }}>Dashboard</a>
          <a href="/editor" style={{ fontSize: 14, color: "#727272", textDecoration: "none" }}>Content editor</a>
          <a href="/editor-roadmap" style={{ fontSize: 14, fontWeight: 600, color: "#000", textDecoration: "none" }}>Roadmap</a>
        </nav>
        <div style={{ justifySelf: "end" }}><a href="/" style={{ fontSize: 13, color: "#727272", textDecoration: "none" }}>← Dashboard</a></div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px" }}>
        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 12, background: "#000", color: "#fff", fontSize: 11, fontWeight: 600, marginBottom: 12 }}>
            ROADMAP · Smart content editor
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#000", marginBottom: 8 }}>
            WYSIWYG editor + Claude + learning from edits
          </h1>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, maxWidth: 780 }}>
            A new feature that lets clients edit auto-generated content — with a full toolbar, live validation
            against Nir's SEO writing prompt, and an AI (Claude Opus 4.6) that learns from the edits and adapts the writing style to the brand.
          </p>
        </div>

        {/* Phase flow */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DDD", padding: 24, marginBottom: 32 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Development flow</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PHASES.map((p, idx) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: idx < PHASES.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: p.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{p.id}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "#727272", marginTop: 2 }}>{p.subtitle}</div>
                </div>
                <span style={{
                  fontSize: 11, padding: "4px 12px", borderRadius: 10, fontWeight: 600,
                  background: p.status === "in_progress" ? "#FFF7ED" : "#F5F5F5",
                  color: p.status === "in_progress" ? "#D97706" : "#727272",
                  whiteSpace: "nowrap",
                }}>
                  {p.status === "in_progress" ? "● In progress" : "○ Queued"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase cards */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Phase details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {PHASES.map(p => (
              <div key={p.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #DDD", padding: 20, borderTop: `4px solid ${p.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: "#727272" }}>Phase {p.id}</div>
                  <span style={{
                    fontSize: 10, padding: "3px 10px", borderRadius: 10, fontWeight: 600,
                    background: p.status === "in_progress" ? "#FFF7ED" : "#F5F5F5",
                    color: p.status === "in_progress" ? "#D97706" : "#727272",
                  }}>
                    {p.status === "in_progress" ? "● In progress" : "○ Queued"}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#000", marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5, marginBottom: 12 }}>{p.subtitle}</div>
                <div style={{ fontSize: 11, color: "#727272", marginBottom: 6 }}>Deliverables:</div>
                <ul style={{ fontSize: 12, color: "#333", lineHeight: 1.7, paddingLeft: 16, margin: 0 }}>
                  {p.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Nir's SEO prompt */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #DDD", padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Nir's SEO writing prompt</div>
              <div style={{ fontSize: 12, color: "#727272", marginTop: 4 }}>The system prompt Nir shared with Inna — feeds every article generation</div>
            </div>
            <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 12, background: "#F0FDF4", color: "#10A37F", fontWeight: 600 }}>Built in phase 3</span>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: "#A2A9B0" }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: "#10A37F" }} />
              system prompt · Claude Opus 4.6
            </div>
            <pre style={{
              background: "#0B0F17", color: "#D4D4D4", padding: "18px 20px", borderRadius: 8, fontSize: 12,
              lineHeight: 1.7, fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
              overflowX: "auto", whiteSpace: "pre-wrap", margin: 0,
            }}>{NIR_PROMPT}</pre>
          </div>
          <div style={{ fontSize: 11, color: "#727272", marginTop: 10, fontStyle: "italic" }}>
            Variables in {"{curly_braces}"} are populated per article from brand context, keyword research, and entity maps.
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: "linear-gradient(135deg,#000,#1a1a1a)", color: "#fff", borderRadius: 12, padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#A2A9B0", marginBottom: 8 }}>End result</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Smart content editor with auto-learning</div>
          <div style={{ fontSize: 13, color: "#DDD" }}>{PHASES.length} phases · Beta release to first 3 clients</div>
        </div>
      </div>
    </div>
  );
}
