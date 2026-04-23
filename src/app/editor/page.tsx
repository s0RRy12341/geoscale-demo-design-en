"use client";

import { Fragment, useState, useEffect } from "react";

type Theme = {
  bg: string; cardBg: string; border: string; text: string; textSecondary: string; textMuted: string;
  headerBg: string; hoverBg: string; tableBg: string; tableHeaderBg: string; badgeBg: string;
  inputBg: string; barTrack: string; logoFill: string; logoStroke: string;
};
const LIGHT_THEME: Theme = {
  bg: "#FFFFFF", cardBg: "#FFFFFF", border: "#E5E5E5", text: "#000000", textSecondary: "#727272",
  textMuted: "#A2A9B0", headerBg: "rgba(255,255,255,0.96)", hoverBg: "#FAFAFA",
  tableBg: "#FFFFFF", tableHeaderBg: "#FAFAFA", badgeBg: "#F9F9F9", inputBg: "#FFFFFF",
  barTrack: "#E5E5E5", logoFill: "#141414", logoStroke: "#ABABAB",
};
const DARK_THEME: Theme = {
  bg: "#0D1117", cardBg: "#161B22", border: "#30363D", text: "#E6EDF3", textSecondary: "#8B949E",
  textMuted: "#484F58", headerBg: "rgba(13,17,23,0.96)", hoverBg: "#1C2128",
  tableBg: "#161B22", tableHeaderBg: "#1C2128", badgeBg: "#1C2128", inputBg: "#0D1117",
  barTrack: "#30363D", logoFill: "#E6EDF3", logoStroke: "#484F58",
};

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

function DarkModeToggle({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: 34, height: 34, borderRadius: 8, border: "1px solid " + (darkMode ? "#30363D" : "#DDD"),
        background: darkMode ? "#1C2128" : "#FAFAFA", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        color: darkMode ? "#E6EDF3" : "#333",
      }}
    >
      {darkMode ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

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

function GeoscaleLogoMark({ size = 32, theme }: { size?: number; theme: Theme }) {
  return (
    <svg width={size} height={size} viewBox="0 0 102 102" fill="none">
      <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="10" fill="none" />
      <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
    </svg>
  );
}

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
            { href: "/editor", label: "Content Editor", active: true },
            { href: "/roadmap", label: "Roadmap", active: false },
          ].map((item, i) => (
            <a key={i} href={item.href} onClick={onClose} style={{
              display: "block", padding: "14px 0", fontSize: 16,
              fontWeight: item.active ? 700 : 500,
              color: item.active ? theme.text : theme.textSecondary,
              textDecoration: "none", borderBottom: `1px solid ${theme.border}`,
            }}>{item.label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "10px 24px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none", textDecoration: "none", flex: 1, justifyContent: "center" }}>New Scan</a>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
    </div>
  );
}

type ToolbarBtn = { label: string; key: string; title: string };

const TOOLBAR: ToolbarBtn[] = [
  { key: "h1", label: "H1", title: "Heading 1" },
  { key: "h2", label: "H2", title: "Heading 2" },
  { key: "h3", label: "H3", title: "Heading 3" },
  { key: "bold", label: "B", title: "Bold" },
  { key: "italic", label: "I", title: "Italic" },
  { key: "underline", label: "U", title: "Underline" },
  { key: "ul", label: "• ", title: "Bulleted list" },
  { key: "ol", label: "1.", title: "Numbered list" },
  { key: "quote", label: '"', title: "Quote" },
  { key: "link", label: "🔗", title: "Link" },
  { key: "img", label: "🖼", title: "Image" },
  { key: "undo", label: "↶", title: "Undo" },
  { key: "redo", label: "↷", title: "Redo" },
];

const SEO_RULES = [
  { id: 1, label: "Unique H1 with primary keyword", ok: true },
  { id: 2, label: "Meta description 150-160 chars", ok: true },
  { id: 3, label: "At least 3 H2 sub-headings", ok: true },
  { id: 4, label: "Primary keyword in first 100 words", ok: true },
  { id: 5, label: "2-3 relevant internal links", ok: false },
  { id: 6, label: "Alt text on every image", ok: true },
  { id: 7, label: "Keyword density 1-2%", ok: true },
  { id: 8, label: "Minimum 1,200 words", ok: true },
  { id: 9, label: "Structured data (Schema.org FAQ)", ok: false },
  { id: 10, label: "Entity coverage for main topic", ok: true },
];

export default function EditorPage() {
  const [activeToolbar, setActiveToolbar] = useState<string | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("geoscale-dark-mode") === "true";
    return false;
  });
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("geoscale-dark-mode", darkMode.toString());
  }, [darkMode]);

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#0D1117" : "#F5F5F5", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />
      {/* Header */}
      <header style={{
        background: theme.cardBg, borderBottom: "1px solid " + theme.border,
        padding: isMobile ? "0 16px" : "0 32px",
        height: 56,
        display: isMobile ? "flex" : "grid",
        gridTemplateColumns: isMobile ? undefined : "1fr auto 1fr",
        justifyContent: isMobile ? "space-between" : undefined,
        alignItems: "center",
      }}>
        {isMobile ? (
          <>
            <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <IconHamburger color={theme.text} />
            </button>
            <GeoscaleLogoMark size={32} theme={theme} />
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </>
        ) : (
          <>
            <div style={{ justifySelf: "start" }}><GeoscaleLogo width={140} theme={theme} /></div>
            <nav style={{ display: "flex", gap: 32 }}>
              <a href="/" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Dashboard</a>
              <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
              <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>ScalePublish</a>
              <a href="/editor" style={{ fontSize: 15, fontWeight: 700, color: theme.text, textDecoration: "none" }}>Content Editor</a>
              <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Roadmap</a>
            </nav>
            <div style={{ justifySelf: "end", display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: theme.textSecondary }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F" }} />
                <span>Auto-saved 3s ago</span>
              </div>
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none", textDecoration: "none" }}>New Scan</a>
            </div>
          </>
        )}
      </header>

      {/* Breadcrumb bar */}
      <div style={{ background: theme.cardBg, borderBottom: "1px solid " + theme.border, padding: isMobile ? "10px 16px" : "10px 32px", fontSize: isMobile ? 13 : 14, color: theme.textSecondary, wordBreak: "break-word" }}>
        All4Horses / 6-month plan / Article #3 of 24 / <span style={{ color: theme.text, fontWeight: 600 }}>Therapeutic riding for children with ADHD</span>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "16px 12px" : "24px 32px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: isMobile ? 16 : 24 }}>
        {/* MAIN EDITOR */}
        <div style={{ background: theme.cardBg, borderRadius: 12, border: "1px solid " + theme.border, overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ borderBottom: "1px solid " + theme.border, display: "flex", padding: "0 20px" }}>
            {(["edit", "preview"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "14px 18px", background: "none", border: "none", borderBottom: tab === t ? "2px solid " + theme.text : "2px solid transparent",
                fontSize: 14, fontWeight: tab === t ? 600 : 400, color: tab === t ? theme.text : theme.textSecondary, cursor: "pointer",
              }}>
                {t === "edit" ? "Edit" : "Preview"}
              </button>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: theme.textSecondary }}>
              <span>Generated by</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: darkMode ? "rgba(16,163,127,0.15)" : "rgba(16,163,127,0.08)", border: "1px solid " + (darkMode ? "rgba(16,163,127,0.3)" : "rgba(16,163,127,0.2)"), color: "#10A37F", fontSize: 14, fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: "#10A37F" }} />
                Claude Opus 4.6 - Anthropic
              </span>
            </div>
          </div>

          {/* Toolbar */}
          <div style={{ padding: "10px 20px", borderBottom: "1px solid " + theme.border, display: "flex", gap: 4, flexWrap: "wrap", background: theme.hoverBg }}>
            {TOOLBAR.map((t, i) => (
              <Fragment key={t.key}>
                {(i === 3 || i === 6 || i === 9 || i === 11) && <div style={{ width: 1, height: 22, background: theme.border, margin: "3px 4px" }} />}
                <button title={t.title} onClick={() => setActiveToolbar(t.key)} style={{
                  minWidth: 32, height: 28, padding: "0 8px", border: "1px solid transparent", borderRadius: 5,
                  background: activeToolbar === t.key ? theme.barTrack : "transparent",
                  fontSize: t.key.startsWith("h") ? 14 : 15, fontWeight: t.key === "bold" ? 700 : t.key.startsWith("h") ? 700 : 500,
                  fontStyle: t.key === "italic" ? "italic" : "normal",
                  textDecoration: t.key === "underline" ? "underline" : "none",
                  color: theme.text, cursor: "pointer",
                }}>{t.label}</button>
              </Fragment>
            ))}
          </div>

          {/* Article */}
          <div style={{ padding: isMobile ? "16px 16px" : "32px 48px", minHeight: isMobile ? 400 : 600 }}>
            <input defaultValue="Therapeutic Riding for Children with ADHD — Complete 2026 Guide" style={{
              width: "100%", fontSize: isMobile ? 22 : 30, fontWeight: 700, border: "none", outline: "none", marginBottom: 16, color: theme.text, background: "transparent",
            }} />
            <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 24, display: "flex", gap: 16 }}>
              <span>{"📝"} 1,847 words</span>
              <span>{"⏱"} 8 min read</span>
              <span>{"🎯"} Primary keyword: &quot;therapeutic riding ADHD&quot;</span>
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.8, color: darkMode ? "#C9D1D9" : "#222", marginBottom: 20 }}>
              Therapeutic horseback riding is a proven complementary therapy that helps children with <strong>attention-deficit/hyperactivity disorder (ADHD)</strong> improve focus, self-regulation, and social skills. In this guide we&apos;ll review the benefits, supporting research, and how to choose the right therapeutic program for your child.
            </p>

            <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 32, marginBottom: 14, color: theme.text }}>What is therapeutic riding?</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: darkMode ? "#C9D1D9" : "#222", marginBottom: 20 }}>
              Therapeutic riding (Equine-Assisted Therapy) is a treatment method in which the horse serves as a therapeutic tool. The child learns to communicate with, care for, and ride the horse — a process that develops motor control, focus, and self-confidence.
            </p>

            <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 32, marginBottom: 14, color: theme.text }}>5 key benefits for children with ADHD</h2>
            <ul style={{ fontSize: 16, lineHeight: 1.9, color: darkMode ? "#C9D1D9" : "#222", paddingLeft: 20, marginBottom: 20 }}>
              <li><strong>Improved focus</strong> — the horse demands constant attention</li>
              <li><strong>Emotional regulation</strong> — the horse mirrors the child&apos;s emotions</li>
              <li><strong>Motor control</strong> — strengthens core and balance</li>
              <li><strong>Self-confidence</strong> — managing measured challenges</li>
              <li><strong>Social skills</strong> — interaction with the ranch team</li>
            </ul>

            <blockquote style={{ borderLeft: "3px solid #10A37F", padding: "12px 18px", background: darkMode ? "rgba(16,163,127,0.15)" : "rgba(16,163,127,0.1)", fontSize: 15, fontStyle: "italic", color: "#10A37F", marginBottom: 24 }}>
              &quot;Research shows 70-85% improvement in focus and emotional regulation in children after 12 therapeutic riding sessions.&quot; — Tel Aviv University review, 2024
            </blockquote>

            <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 32, marginBottom: 14, color: theme.text }}>How to choose a therapeutic riding ranch</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: darkMode ? "#C9D1D9" : "#222", marginBottom: 20 }}>
              Make sure the ranch holds proper licensing, that therapists are certified in equine-assisted therapy, and that the horses are trained for work with children. A leading ranch in this field is All4Horses in the Sharon region.
            </p>

            <div style={{ padding: 16, background: theme.badgeBg, borderRadius: 8, fontSize: 14, color: theme.textSecondary, fontStyle: "italic" }}>
              [Article continues — 1,200 more words]
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ padding: isMobile ? "14px 16px" : "14px 20px", borderTop: "1px solid " + theme.border, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 10 : 0, background: theme.hoverBg }}>
            <div style={{ fontSize: 14, color: theme.textSecondary }}>Version 3 - last edited by you 12 minutes ago</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ padding: "9px 18px", background: theme.cardBg, border: "1px solid " + theme.border, borderRadius: 7, fontSize: 14, fontWeight: 500, cursor: "pointer", color: theme.text, flex: isMobile ? 1 : undefined }}>Save draft</button>
              <button style={{ padding: "9px 18px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: "pointer", flex: isMobile ? 1 : undefined }}>Publish to site</button>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* AI learning */}
          <div style={{ background: theme.cardBg, borderRadius: 12, border: "1px solid " + theme.border, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: "#10A37F", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>{"✦"}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>AI learning from your edits</div>
            </div>
            <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
              Claude analyzes edits you and the editor make and adapts the writing style automatically.
            </div>
            <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 4 }}>Edits learned this week</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: theme.text }}>37</span>
              <span style={{ fontSize: 14, color: "#10A37F", fontWeight: 600 }}>{"↑"} 18% style match</span>
            </div>
            <div style={{ height: 4, background: theme.barTrack, borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: "72%", height: "100%", background: "#10A37F" }} />
            </div>
            <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4 }}>72% brand style match</div>
          </div>

          {/* SEO checklist (Inna's rules) */}
          <div style={{ background: theme.cardBg, borderRadius: 12, border: "1px solid " + theme.border, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>SEO check — Nir&apos;s prompt</div>
              <span style={{ fontSize: 14, padding: "2px 8px", borderRadius: 10, background: "#10A37F15", color: "#10A37F", fontWeight: 600 }}>8/10</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {SEO_RULES.map(r => (
                <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 9, background: r.ok ? "#10A37F" : theme.barTrack, color: r.ok ? "#fff" : theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{r.ok ? "✓" : "!"}</span>
                  <span style={{ color: r.ok ? (darkMode ? "#C9D1D9" : "#333") : "#DC2626", lineHeight: 1.5 }}>{r.label}</span>
                </div>
              ))}
            </div>
            <a href="/editor-roadmap" style={{ display: "block", fontSize: 14, color: "#10A37F", marginTop: 12, textDecoration: "none" }}>View full prompt {"→"}</a>
          </div>

          {/* Quick stats */}
          <div style={{ background: theme.cardBg, borderRadius: 12, border: "1px solid " + theme.border, padding: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: theme.text }}>Real-time metrics</div>
            {[
              { k: "Keyword density", v: "1.4%", good: true },
              { k: "Readability score", v: "8.2/10", good: true },
              { k: "E-E-A-T signals", v: "Strong", good: true },
              { k: "AI Answer fit", v: "92%", good: true },
            ].map(s => (
              <div key={s.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid " + (darkMode ? "#21262D" : "#F5F5F5"), fontSize: 14 }}>
                <span style={{ color: theme.textSecondary }}>{s.k}</span>
                <span style={{ fontWeight: 600, color: s.good ? "#10A37F" : "#DC2626" }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
