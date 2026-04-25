"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// GEOSCALE DEMO — 4-Screen Flow
// Screen 1: Brand Input (domain + brand name)
// Screen 2: Analyzing Animation (1-2 min processing)
// Screen 3: Personas Display (static result)
// Screen 4: The Scan Process (queries → ChatGPT → Gemini → Analysis)
// ============================================================

// ── Brand Constants (Geoscale exact palette) ──
const BRAND = {
  teal: "#10A37F",
  tealLight: "#10A37F",
  tealDark: "#0D8C6D",
  black: "#000000",
  nearBlack: "#141414",
  gray50: "#F9F9F9",
  gray100: "#F9F9F9",
  gray200: "#DDDDDD",
  gray300: "#BFBFBF",
  gray400: "#A2A9B0",
  gray500: "#727272",
  gray600: "#54595F",
  gray700: "#333333",
  gray800: "#141414",
};

// ── Theme System ──
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

// ── Geoscale Logo SVG (actual brand) ──
function GeoscaleLogo({ size = 40, className = "", theme }: { size?: number; className?: string; theme?: Theme }) {
  return (
    <svg width={size} height={size} viewBox="0 0 102 102" fill="none" className={className}>
      <circle cx="51" cy="51" r="38" stroke={theme?.logoStroke ?? "#ABABAB"} strokeWidth="10" fill="none" />
      <circle cx="51" cy="51" r="25" stroke={theme?.logoFill ?? "#141414"} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="120 40" />
    </svg>
  );
}

// ── SVG Check icon for step indicator ──
function StepCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// ── SVG Arrow icons ──
function ArrowLeft({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ArrowRight({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ── Geoscale Wordmark ──
function GeoscaleWordmark({ className = "", theme }: { className?: string; theme?: Theme }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <GeoscaleLogo size={36} theme={theme} />
      <span className="text-2xl font-semibold tracking-tight" style={{ color: theme?.text ?? BRAND.black }}>
        Geoscale
      </span>
    </div>
  );
}

// ── Step Indicator ──
function StepIndicator({ current, steps, theme }: { current: number; steps: string[]; theme: Theme }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500"
              style={{
                background: i <= current ? BRAND.teal : theme.barTrack,
                color: i <= current ? "#fff" : theme.textSecondary,
              }}
            >
              {i < current ? <StepCheck /> : i + 1}
            </div>
            <span
              className="text-sm mt-1 font-medium"
              style={{ color: i <= current ? BRAND.teal : theme.textMuted }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="w-16 h-0.5 mb-5 transition-all duration-500"
              style={{ background: i < current ? BRAND.teal : theme.barTrack }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Mobile detection hook ──
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

// ── Geoscale Logo Mark (circle only, for mobile header) ──
function GeoscaleLogoMark({ size = 32, theme }: { size?: number; theme: Theme }) {
  return (
    <svg width={size} height={size} viewBox="0 0 102 102" fill="none">
      <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="10" fill="none" />
      <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
    </svg>
  );
}

// ── SVG Icons for mobile menu ──
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

// ── Dark Mode Toggle Button ──
function DarkModeToggle({ darkMode, setDarkMode, theme }: { darkMode: boolean; setDarkMode: (v: boolean) => void; theme?: Theme }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
      style={{
        background: darkMode ? "#30363D" : "#F3F4F6",
        border: `1px solid ${darkMode ? "#484F58" : "#E5E5E5"}`,
      }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6EDF3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

// ── Mobile Menu Overlay ──
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
            { href: "/editor", label: "Content Editor", active: false },
            { href: "/roadmap", label: "Roadmap", active: false },
          ].map((item, i) => (
            <a key={i} href={item.href} onClick={onClose} style={{
              display: "block", padding: "14px 0", fontSize: 16,
              fontWeight: item.active ? 600 : 500,
              color: item.active ? theme.text : theme.textSecondary,
              textDecoration: "none", borderBottom: `1px solid ${theme.border}`,
            }}>{item.label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "10px 24px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none", textDecoration: "none", flex: 1, justifyContent: "center" }}>New Scan</a>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
        </div>
      </div>
    </div>
  );
}

// ── Shared Footer (matching all Geoscale pages) ──
function GeoFooter({ theme, isMobile }: { theme: Theme; isMobile?: boolean }) {
  if (isMobile) {
    return (
      <footer style={{ borderTop: `1px solid ${theme.border}`, marginTop: "auto", background: theme.bg }}>
        <div dir="ltr" style={{ maxWidth: 1300, margin: "0 auto", padding: "16px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <GeoscaleLogoMark size={24} theme={theme} />
              <span style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 400, textAlign: "center" }}>Powered by advanced AI</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
              {["Feedback", "Report a bug", "API usage"].map((label, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 500, padding: "4px 10px", cursor: "pointer", color: theme.textSecondary, background: theme.badgeBg, borderRadius: 20, border: `1px solid ${theme.border}` }}>{label}</span>
              ))}
            </div>
            <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 400 }}>GeoScale 2026 &copy;</span>
          </div>
        </div>
      </footer>
    );
  }
  return (
    <footer style={{ borderTop: `1px solid ${theme.border}`, marginTop: "auto", background: theme.bg }}>
      <div dir="ltr" style={{ maxWidth: 1300, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width={28} height={28} viewBox="0 0 102 102" fill="none">
            <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="10" fill="none" />
            <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
          </svg>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>Powered by advanced AI to analyze your search presence</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {[
            { label: "Feedback", color: "#10A37F", bg: "#10A37F15" },
            { label: "Report a bug", color: "#727272", bg: "#72727215" },
            { label: "Improvement ideas", color: "#10A37F", bg: "#10A37F15" },
            { label: "API usage", color: "#10A37F", bg: "#10A37F15" },
          ].map((link, i) => (
            <span key={i} style={{ fontSize: 14, fontWeight: 500, padding: "4px 12px", borderRadius: 20, color: link.color, background: link.bg, cursor: "pointer" }}>{link.label}</span>
          ))}
        </div>
        <span style={{ fontSize: 14, color: theme.textMuted }}>&copy; GeoScale 2026</span>
      </div>
    </footer>
  );
}

// ════════════════════════════════════════════
// SCREEN 1: Brand Input
// ════════════════════════════════════════════
function Screen1({ onSubmit, theme, darkMode, setDarkMode, isMobile, menuOpen, setMenuOpen }: { onSubmit: (domain: string, brand: string) => void; theme: Theme; darkMode: boolean; setDarkMode: (v: boolean) => void; isMobile: boolean; menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const [domain, setDomain] = useState("");
  const [brandName, setBrandName] = useState("");

  return (
    <div className="screen-enter min-h-screen flex flex-col" dir="ltr" style={{ background: theme.bg }}>
      {/* Mobile Menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Header */}
      <header style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>
        {isMobile ? (
          <div style={{ padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <IconHamburger color={theme.text} />
            </button>
            <GeoscaleLogoMark size={32} theme={theme} />
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>
        ) : (
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
            <div style={{ justifySelf: "start", direction: "ltr" }}>
              <svg width={150} height={30} viewBox="0 0 510 102" fill="none">
                <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="13" fill="none" />
                <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
                <g fill={theme.logoFill}><text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text></g>
              </svg>
            </div>
            <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <a href="/" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Dashboard</a>
              <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
              <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>ScalePublish</a>
              <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
              <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Roadmap</a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "end" }}>
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: `1px solid ${darkMode ? "#E6EDF3" : "#000"}`, textDecoration: "none" }}>New Scan</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div
        className="relative px-4"
        style={{
          background: theme.badgeBg,
          padding: isMobile ? "24px 16px" : "48px 16px",
        }}
      >
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, ${theme.text} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <h1 className="font-semibold mb-4" style={{ color: theme.text, fontSize: isMobile ? 28 : undefined }}>
            {!isMobile && <span className="text-4xl md:text-5xl">AI Presence Check</span>}
            {isMobile && "AI Presence Check"}
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: isMobile ? 15 : 18 }}>
            See how AI models (GPT, Gemini) recognize and recommend your brand — for every audience
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-2xl mx-auto w-full px-4 mt-8">
        <StepIndicator current={0} steps={["Details", "Audiences", "Scan"]} theme={theme} />
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto w-full flex-1" style={{ padding: isMobile ? "0 12px 32px" : "0 16px 64px" }}>
        <div className="rounded-[10px]" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, padding: isMobile ? 20 : 32 }}>
          {/* Card Header */}
          <div className="flex items-center gap-2 mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BRAND.teal} strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <span className="font-medium text-xl" style={{ color: theme.text }}>Brand details</span>
          </div>

          {/* Domain Field */}
          <div className="mb-6">
            <label className="block text-[15px] font-medium mb-2" style={{ color: theme.text }}>
              Website URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="w-full px-4 py-3 rounded-xl text-base focus:outline-none focus:border-[#10A37F] focus:ring-1 focus:ring-[#10A37F]/20 transition-all"
                style={{ direction: "ltr", textAlign: "left", background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
            </div>
            <p className="text-sm mt-1.5" style={{ color: theme.textMuted }}>
              Enter the domain without https://
            </p>
          </div>

          {/* Brand Name Field */}
          <div className="mb-8">
            <label className="block text-[15px] font-medium mb-2" style={{ color: theme.text }}>
              Brand name
            </label>
            <div className="relative">
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your brand name"
                className="w-full px-4 py-3 rounded-xl text-base focus:outline-none focus:border-[#10A37F] focus:ring-1 focus:ring-[#10A37F]/20 transition-all"
                style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => onSubmit(domain || "example.com", brandName || "My brand")}
            className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: darkMode ? "#E6EDF3" : "#000",
              color: darkMode ? "#0D1117" : "#fff",
            }}
          >
            <span className="flex items-center justify-center gap-2">Continue to audience selection <ArrowRight size={18} color={darkMode ? "#0D1117" : "white"} /></span>
          </button>
        </div>

        {/* What's New Box */}
        <div className="mt-6 rounded-[10px] p-6" style={{ background: theme.cardBg, border: `1px solid ${theme.border}` }}>
          <h3 className="font-medium text-xl mb-3" style={{ color: BRAND.teal }}>
            What&apos;s new?
          </h3>
          <ul className="space-y-2 text-[15px]" style={{ color: theme.textSecondary }}>
            <li>The system generates <strong>relevant audiences</strong> for your brand</li>
            <li>You choose which audiences to test</li>
            <li>The scan is tailored <strong>to each audience separately</strong></li>
            <li>You see detailed results per audience</li>
          </ul>
        </div>
      </div>
      <GeoFooter theme={theme} isMobile={isMobile} />
    </div>
  );
}

// ════════════════════════════════════════════
// SCREEN 2: Analyzing Animation
// ════════════════════════════════════════════
function Screen2({ domain, brandName, onComplete, theme, darkMode, setDarkMode, isMobile, menuOpen, setMenuOpen }: { domain: string; brandName: string; onComplete: () => void; theme: Theme; darkMode: boolean; setDarkMode: (v: boolean) => void; isMobile: boolean; menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Connecting to site...");
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);

    // Progress simulation
    const stages = [
      { at: 5, text: "Connecting to site" },
      { at: 15, text: "Scanning site content" },
      { at: 30, text: "Analyzing the brand" },
      { at: 45, text: "Identifying potential audiences" },
      { at: 60, text: "Generating relevant personas" },
      { at: 75, text: "Matching queries to each audience" },
      { at: 90, text: "Finalizing analysis" },
      { at: 100, text: "Analysis complete!" },
    ];

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 0.5 + Math.random() * 1.5, 100);
        const stage = stages.filter((s) => s.at <= next).pop();
        if (stage) setStatusText(stage.text);
        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 800);
        }
        return next;
      });
    }, 120);

    return () => {
      clearInterval(dotInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="screen-enter min-h-screen flex flex-col" dir="ltr" style={{ background: theme.bg }}>
      {/* Mobile Menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Header */}
      <header style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>
        {isMobile ? (
          <div style={{ padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <IconHamburger color={theme.text} />
            </button>
            <GeoscaleLogoMark size={32} theme={theme} />
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>
        ) : (
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
            <div style={{ justifySelf: "start", direction: "ltr" }}>
              <svg width={150} height={30} viewBox="0 0 510 102" fill="none">
                <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="13" fill="none" />
                <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
                <g fill={theme.logoFill}><text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text></g>
              </svg>
            </div>
            <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <a href="/" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Dashboard</a>
              <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
              <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>ScalePublish</a>
              <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
              <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Roadmap</a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "end" }}>
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: `1px solid ${darkMode ? "#E6EDF3" : "#000"}`, textDecoration: "none" }}>New Scan</a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        {/* Animated Orb */}
        <div className="relative w-48 h-48 mb-8">
          {/* Outer pulse rings */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${BRAND.teal}`,
              opacity: 0.15,
              animation: "pulse-ring 2s ease-in-out infinite",
            }}
          />
          <div
            className="absolute inset-[-10px] rounded-full"
            style={{
              border: `1.5px solid ${BRAND.teal}`,
              opacity: 0.1,
              animation: "pulse-ring 2s ease-in-out infinite 0.5s",
            }}
          />
          <div
            className="absolute inset-[-20px] rounded-full"
            style={{
              border: `1px solid ${BRAND.teal}`,
              opacity: 0.05,
              animation: "pulse-ring 2s ease-in-out infinite 1s",
            }}
          />

          {/* Orbiting particles */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2"
              style={{
                width: "8px",
                height: "8px",
                marginTop: "-4px",
                marginLeft: "-4px",
                animation: `${i % 2 === 0 ? "orbit" : "orbit-reverse"} ${3 + i * 0.7}s linear infinite`,
              }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: i % 2 === 0 ? BRAND.teal : BRAND.tealLight,
                  opacity: 0.6 + (i * 0.05),
                }}
              />
            </div>
          ))}

          {/* Center morphing blob */}
          <div className="absolute inset-8 flex items-center justify-center">
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: theme.badgeBg,
                animation: "morph-circle 8s ease-in-out infinite",
              }}
            >
              {/* Geoscale icon in center */}
              <svg width="48" height="48" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={theme.textSecondary}
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="8 4"
                  style={{ animation: "spin-slow 8s linear infinite" }}
                />
                {/* Inner scanning element */}
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  stroke={BRAND.teal}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="20 60"
                  style={{ animation: "spin-reverse 2s linear infinite" }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <h2 className="text-2xl font-medium mb-2" style={{ color: theme.text }}>
          Analyzing the site{dots}
        </h2>
        <p className="text-base mb-8" style={{ color: BRAND.teal }}>
          The system is analyzing the brand and generating relevant personas
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-md">
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: theme.barTrack }}>
            <div
              className="h-full rounded-full progress-shimmer transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: "#10A37F",
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm" style={{ color: theme.textMuted }}>
              {Math.round(progress)}%
            </span>
            <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
              {statusText}
            </span>
          </div>
        </div>
      </div>

      <GeoFooter theme={theme} isMobile={isMobile} />
    </div>
  );
}

// ════════════════════════════════════════════
// SCREEN 3: Personas Display
// ════════════════════════════════════════════

const MOCK_PERSONAS = [
  {
    name: "Josh",
    title: "Horse-loving teenager",
    desc: "Josh, 16, a high school student who loves horses.",
    age: "15-19",
    location: "Central region",
    tags: ["#horses", "#teen"],
    match: 90,
    iconColor: "rgba(16,163,127,1.0)",
  },
  {
    name: "Maya",
    title: "Mother of a child with ADHD",
    desc: "Maya, 38, lives in Denver, looking for complementary therapy.",
    age: "35-44",
    location: "Denver",
    tags: ["#parents", "#special education"],
    match: 95,
    iconColor: "rgba(16,163,127,0.8)",
  },
  {
    name: "David",
    title: "Parent of a child on the spectrum",
    desc: "David, 47, looking for therapeutic activities for his daughter.",
    age: "45-54",
    location: "Boston",
    tags: ["#parent", "#spectrum"],
    match: 88,
    iconColor: "rgba(16,163,127,0.6)",
  },
  {
    name: "Ori",
    title: "Animal-assisted therapist",
    desc: "Ori, 32, an emotional therapist who integrates animals.",
    age: "30-40",
    location: "Austin",
    tags: ["#therapist", "#professional"],
    match: 88,
    iconColor: "rgba(16,163,127,0.4)",
  },
  {
    name: "Ronit",
    title: "Special education teacher",
    desc: "Ronit, 52, coordinates special education at a school.",
    age: "50-59",
    location: "Chicago",
    tags: ["#education", "#institutional"],
    match: 82,
    iconColor: "rgba(16,163,127,0.3)",
  },
];

function PersonaCard({ persona, index, theme }: { persona: typeof MOCK_PERSONAS[0]; index: number; theme: Theme }) {
  return (
    <div
      className="rounded-[10px] p-6 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s`, animation: "fade-in-up 0.5s ease-out forwards", opacity: 0, background: theme.cardBg, border: `1px solid ${theme.border}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ background: theme.badgeBg, color: theme.textSecondary }}>
          Persona
        </span>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${persona.iconColor}15` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={persona.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-medium mb-1" style={{ color: theme.text }}>
        {persona.name} — {persona.title}
      </h3>
      <p className="text-[15px] mb-4" style={{ color: theme.textSecondary }}>
        {persona.desc}
      </p>

      {/* Match Score */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: theme.barTrack }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${persona.match}%`,
              background: persona.match >= 90 ? BRAND.teal : persona.match >= 85 ? BRAND.tealLight : theme.textMuted,
            }}
          />
        </div>
        <span
          className="text-base font-medium"
          style={{ color: persona.match >= 90 ? BRAND.teal : theme.textSecondary, fontSize: 24 }}
        >
          {persona.match}%
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-sm px-2 py-1 rounded-full" style={{ background: theme.badgeBg, color: BRAND.tealDark }}>
          {persona.age}
        </span>
        <span className="text-sm px-2 py-1 rounded-full" style={{ background: theme.badgeBg, color: theme.textSecondary }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill={theme.textSecondary} stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
          {persona.location}
        </span>
        {persona.tags.map((tag) => (
          <span key={tag} className="text-sm px-2 py-1 rounded-full" style={{ background: theme.badgeBg, color: theme.textSecondary }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function Screen3({ onStartScan, theme, darkMode, setDarkMode, isMobile, menuOpen, setMenuOpen }: { onStartScan: () => void; theme: Theme; darkMode: boolean; setDarkMode: (v: boolean) => void; isMobile: boolean; menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  return (
    <div className="screen-enter min-h-screen flex flex-col" dir="ltr" style={{ background: theme.bg }}>
      {/* Mobile Menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Header */}
      <header style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>
        {isMobile ? (
          <div style={{ padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <IconHamburger color={theme.text} />
            </button>
            <GeoscaleLogoMark size={32} theme={theme} />
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>
        ) : (
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
            <div style={{ justifySelf: "start", direction: "ltr" }}>
              <svg width={150} height={30} viewBox="0 0 510 102" fill="none">
                <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="13" fill="none" />
                <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
                <g fill={theme.logoFill}><text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text></g>
              </svg>
            </div>
            <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <a href="/" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Dashboard</a>
              <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
              <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>ScalePublish</a>
              <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
              <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Roadmap</a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "end" }}>
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: `1px solid ${darkMode ? "#E6EDF3" : "#000"}`, textDecoration: "none" }}>New Scan</a>
            </div>
          </div>
        )}
      </header>
      {/* Hero section */}
      <div
        style={{
          background: theme.badgeBg,
          padding: isMobile ? "20px 16px" : "32px 16px",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-semibold mb-2" style={{ color: theme.text, fontSize: isMobile ? 24 : undefined }}>
            {!isMobile && <span className="text-3xl md:text-4xl">AI Presence Check</span>}
            {isMobile && "AI Presence Check"}
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: isMobile ? 14 : 16 }}>
            See how AI models (GPT, Gemini) recognize and recommend your brand — for every audience
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-4xl mx-auto w-full px-4 mt-4">
        <StepIndicator current={1} steps={["Details", "Audiences", "Scan"]} theme={theme} />
      </div>

      {/* Sub-header */}
      <div className="max-w-4xl mx-auto w-full mt-2" style={{ padding: isMobile ? "0 12px" : "0 16px" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span className="font-medium" style={{ color: theme.text, fontSize: isMobile ? 18 : 20 }}>Audience selection</span>
          </div>
          <span className="flex items-center gap-1 text-sm cursor-pointer" style={{ color: theme.textSecondary }}>
            <ArrowLeft size={14} color={theme.textSecondary} />
            Back
          </span>
        </div>

        {/* Info box */}
        <div className="rounded-xl p-4 mb-4" style={{ background: theme.hoverBg, border: `1px solid ${theme.border}` }}>
          <h4 className="font-medium text-[20px] mb-1" style={{ color: BRAND.teal }}>
            Why it matters
          </h4>
          <p className="text-[15px]" style={{ color: theme.textSecondary }}>
            Every audience searches differently. The scan checks how AI engines present your brand to different user types. Pick the ones relevant to you.
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm" style={{ color: theme.textMuted }}>
            ~ 35 queries will be tested
          </span>
          <span
            className="text-sm font-medium px-3 py-1 rounded-full"
            style={{ background: theme.badgeBg, color: BRAND.tealDark }}
          >
            5 / 5 selected
          </span>
        </div>
      </div>

      {/* Persona Grid */}
      <div className="max-w-4xl mx-auto w-full flex-1" style={{ padding: isMobile ? "0 12px 24px" : "0 16px 32px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_PERSONAS.map((persona, i) => (
            <PersonaCard key={persona.name} persona={persona} index={i} theme={theme} />
          ))}
        </div>

        {/* Start Scan Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onStartScan}
            className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: darkMode ? "#E6EDF3" : "#000",
              color: darkMode ? "#0D1117" : "#fff",
            }}
          >
            <span>Start scan</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#0D1117" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>

      </div>
      <GeoFooter theme={theme} isMobile={isMobile} />
    </div>
  );
}

// ════════════════════════════════════════════
// SCREEN 4: The Scan Process (THE BIG ONE)
// ════════════════════════════════════════════

type ScanPhase = "queries" | "chatgpt" | "gemini" | "analysis" | "complete";

const SCAN_PHASES: { id: ScanPhase; label: string; icon: string }[] = [
  { id: "queries", label: "Queries", icon: "Q" },
  { id: "chatgpt", label: "GPT", icon: "G" },
  { id: "gemini", label: "Gemini", icon: "Ge" },
  { id: "analysis", label: "Analysis", icon: "A" },
];

const MOCK_QUERIES = [
  "What is the best therapy for a child with ADHD?",
  "Therapeutic horseback riding for kids — pros and cons",
  "Recommended horse ranches in the central region",
  "Outdoor activities for kids with ADHD",
  "Animal-assisted therapy — what does the science say?",
  "Classes for kids with concentration difficulties",
  "Horseback riding — prices and locations",
  "Equine therapy for at-risk youth",
  "Benefits of therapeutic riding",
  "Horses and emotional therapy — a guide for parents",
];

// Audio Waveform visualization
function AudioWaveform({ active, color }: { active: boolean; color: string }) {
  return (
    <div className="flex items-center gap-0.5 h-8">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-150"
          style={{
            height: active ? `${12 + Math.sin(Date.now() / 200 + i * 0.5) * 12}px` : "4px",
            background: color,
            opacity: active ? 0.4 + Math.sin(Date.now() / 300 + i) * 0.3 : 0.15,
            animation: active ? `wave ${0.5 + (i % 5) * 0.1}s ease-in-out infinite ${i * 0.05}s` : "none",
          }}
        />
      ))}
    </div>
  );
}

// Neural Network Background
function NeuralBackground({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg className="w-full h-full">
        {Array.from({ length: 15 }).map((_, i) => (
          <line
            key={i}
            x1={`${10 + (i * 6)}%`}
            y1={`${20 + Math.sin(i) * 30}%`}
            x2={`${30 + (i * 5)}%`}
            y2={`${50 + Math.cos(i) * 20}%`}
            stroke={BRAND.teal}
            strokeWidth="1"
            strokeDasharray="5 10"
            style={{
              animation: `neural-pulse ${2 + i * 0.3}s ease-in-out infinite ${i * 0.2}s`,
              strokeDashoffset: 1000,
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle
            key={`c${i}`}
            cx={`${15 + i * 10}%`}
            cy={`${30 + Math.sin(i * 2) * 25}%`}
            r="3"
            fill={BRAND.teal}
            opacity={0.3}
          >
            <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="2;5;2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}

// Live query display with typing effect
function QueryStream({ queries, currentIndex, theme }: { queries: string[]; currentIndex: number; theme?: Theme }) {
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= queries.length) return;
    setDisplayText("");
    setCharIndex(0);
  }, [currentIndex, queries.length]);

  useEffect(() => {
    if (currentIndex >= queries.length) return;
    const current = queries[currentIndex];
    if (charIndex < current.length) {
      const timer = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 30 + Math.random() * 40);
      return () => clearTimeout(timer);
    }
  }, [charIndex, currentIndex, queries]);

  return (
    <div className="space-y-2 max-h-48 overflow-hidden">
      {/* Previously completed queries */}
      {queries.slice(Math.max(0, currentIndex - 3), currentIndex).map((q, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-[15px] py-1.5 px-3 rounded-lg transition-all"
          style={{
            background: theme?.badgeBg ?? BRAND.gray50,
            color: theme?.textMuted ?? BRAND.gray400,
            opacity: 0.5 + (i * 0.15),
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={BRAND.teal} stroke="none">
            <path d="M20 6L9 17l-5-5" stroke={BRAND.teal} strokeWidth="3" fill="none" />
          </svg>
          <span dir="ltr">{q}</span>
        </div>
      ))}

      {/* Current typing query */}
      {currentIndex < queries.length && (
        <div
          className="flex items-center gap-2 text-[15px] py-2 px-3 rounded-lg border"
          style={{
            background: theme?.cardBg ?? "white",
            borderColor: BRAND.teal,
            color: theme?.text ?? BRAND.black,
          }}
        >
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: BRAND.teal, animation: "ping-dot 1s ease-in-out infinite" }}
          />
          <span dir="ltr">
            {displayText}
            <span style={{ animation: "typing-cursor 0.8s infinite" }}>|</span>
          </span>
        </div>
      )}
    </div>
  );
}

// AI Engine Card with scanning animation
function AIEngineCard({
  name,
  icon,
  color,
  active,
  progress,
  currentQuery,
  theme,
}: {
  name: string;
  icon: React.ReactNode;
  color: string;
  active: boolean;
  progress: number;
  currentQuery?: string;
  theme?: Theme;
}) {
  return (
    <div
      className="relative rounded-[10px] border-2 p-5 transition-all duration-500 overflow-hidden"
      style={{
        borderColor: active ? color : (theme?.border ?? BRAND.gray200),
        background: active ? `${color}08` : (theme?.cardBg ?? "white"),
        boxShadow: active ? `0 0 30px ${color}20` : "none",
        animation: active ? "glow-pulse 2s ease-in-out infinite" : "none",
      }}
    >
      <NeuralBackground active={active} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: active ? color : (theme?.barTrack ?? BRAND.gray200),
                color: active ? "white" : (theme?.textSecondary ?? BRAND.gray500),
                transition: "all 0.5s",
              }}
            >
              {icon}
            </div>
            <div>
              <h3 className="font-medium text-lg" style={{ color: theme?.text }}>{name}</h3>
              <p className="text-[15px]" style={{ color: active ? color : (theme?.textMuted ?? BRAND.gray400) }}>
                {active ? "Scanning..." : progress >= 100 ? <span className="flex items-center gap-1">Done <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg></span> : "Waiting"}
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-1.5">
            {active && (
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: color,
                      animation: `float-particle 1s ease-in-out infinite ${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}
            {progress >= 100 && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: color }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Waveform */}
        <AudioWaveform active={active} color={color} />

        {/* Progress */}
        <div className="mt-3">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${color}20` }}>
            <div
              className="h-full rounded-full progress-shimmer transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${color}80, ${color})`,
              }}
            />
          </div>
        </div>

        {/* Current query being tested */}
        {active && currentQuery && (
          <div className="mt-3 text-[15px] py-2 px-3 rounded-lg" style={{ background: `${color}10`, color: theme?.textSecondary ?? BRAND.gray600 }} dir="ltr">
            <span style={{ color }}>Current query: </span>
            {currentQuery}
          </div>
        )}
      </div>
    </div>
  );
}

function Screen4({ brandName, theme, darkMode, setDarkMode, isMobile, menuOpen, setMenuOpen }: { brandName: string; theme: Theme; darkMode: boolean; setDarkMode: (v: boolean) => void; isMobile: boolean; menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const [phase, setPhase] = useState<ScanPhase>("queries");
  const [overallProgress, setOverallProgress] = useState(0);
  const [queryIndex, setQueryIndex] = useState(0);
  const [gptProgress, setGptProgress] = useState(0);
  const [geminiProgress, setGeminiProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentQueryForEngine, setCurrentQueryForEngine] = useState("");
  const [statusMessage, setStatusMessage] = useState("Generating tailored queries...");
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Phase progression logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (phase === "queries") {
      setStatusMessage("Generating tailored queries...");
      timer = setInterval(() => {
        setQueryIndex((prev) => {
          if (prev >= MOCK_QUERIES.length - 1) {
            clearInterval(timer);
            setTimeout(() => setPhase("chatgpt"), 1000);
            return prev;
          }
          setOverallProgress(((prev + 1) / MOCK_QUERIES.length) * 25);
          return prev + 1;
        });
      }, 2500);
    }

    if (phase === "chatgpt") {
      setStatusMessage("Scanning in ChatGPT...");
      timer = setInterval(() => {
        setGptProgress((prev) => {
          const next = Math.min(prev + 1 + Math.random() * 2, 100);
          setOverallProgress(25 + (next / 100) * 25);
          setCurrentQueryForEngine(MOCK_QUERIES[Math.floor((next / 100) * (MOCK_QUERIES.length - 1))]);
          if (next >= 100) {
            clearInterval(timer);
            setTimeout(() => setPhase("gemini"), 800);
          }
          return next;
        });
      }, 150);
    }

    if (phase === "gemini") {
      setStatusMessage("Scanning in Gemini...");
      timer = setInterval(() => {
        setGeminiProgress((prev) => {
          const next = Math.min(prev + 1 + Math.random() * 2, 100);
          setOverallProgress(50 + (next / 100) * 25);
          setCurrentQueryForEngine(MOCK_QUERIES[Math.floor((next / 100) * (MOCK_QUERIES.length - 1))]);
          if (next >= 100) {
            clearInterval(timer);
            setTimeout(() => setPhase("analysis"), 800);
          }
          return next;
        });
      }, 150);
    }

    if (phase === "analysis") {
      setStatusMessage("Analyzing results...");
      timer = setInterval(() => {
        setAnalysisProgress((prev) => {
          const next = Math.min(prev + 1 + Math.random() * 3, 100);
          setOverallProgress(75 + (next / 100) * 25);
          if (next >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setPhase("complete");
              setStatusMessage("Scan complete!");
            }, 500);
          }
          return next;
        });
      }, 100);
    }

    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div className="screen-enter min-h-screen flex flex-col" dir="ltr" style={{ background: theme.bg }}>
      {/* Mobile Menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Header */}
      <header style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>
        {isMobile ? (
          <div style={{ padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <IconHamburger color={theme.text} />
            </button>
            <GeoscaleLogoMark size={32} theme={theme} />
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
          </div>
        ) : (
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
            <div style={{ justifySelf: "start", direction: "ltr" }}>
              <svg width={150} height={30} viewBox="0 0 510 102" fill="none">
                <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="13" fill="none" />
                <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
                <g fill={theme.logoFill}><text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text></g>
              </svg>
            </div>
            <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <a href="/" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Dashboard</a>
              <a href="/scan" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Scans</a>
              <a href="/scale-publish" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>ScalePublish</a>
              <a href="/editor" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Content Editor</a>
              <a href="/roadmap" style={{ fontSize: 15, fontWeight: 500, color: theme.textSecondary, textDecoration: "none" }}>Roadmap</a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "end" }}>
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff", fontSize: 14, fontWeight: 600, borderRadius: 9, border: `1px solid ${darkMode ? "#E6EDF3" : "#000"}`, textDecoration: "none" }}>New Scan</a>
            </div>
          </div>
        )}
      </header>
      {/* Top Bar */}
      <div
        style={{
          background: theme.badgeBg,
          padding: isMobile ? "16px 16px" : "24px 16px",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-semibold mb-1" style={{ color: theme.text, fontSize: isMobile ? 22 : 30 }}>
            AI Presence Check
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: isMobile ? 14 : 16 }}>
            See how AI models (GPT, Gemini) recognize and recommend your brand — for every audience
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto w-full px-4 mt-4">
        <StepIndicator current={2} steps={["Details", "Audiences", "Scan"]} theme={theme} />
      </div>

      {/* Main Scan Area */}
      <div className="max-w-3xl mx-auto w-full flex-1" style={{ padding: isMobile ? "0 12px 24px" : "0 16px 48px" }}>
        {/* Scan Status Card */}
        <div className="rounded-[10px] relative overflow-hidden" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, padding: isMobile ? 16 : 32 }}>
          {/* Animated corner accent */}
          {phase !== "complete" && (
            <div
              className="absolute top-0 right-0 w-32 h-32 opacity-10"
              style={{
                background: `radial-gradient(circle at top right, ${BRAND.teal}, transparent)`,
              }}
            />
          )}

          {/* Center animation */}
          <div className="flex flex-col items-center mb-8">
            {/* Spinning scan icon */}
            <div className="relative w-20 h-20 mb-4">
              {phase !== "complete" ? (
                <>
                  {/* Outer ring */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80" style={{ animation: "spin-slow 4s linear infinite" }}>
                    <circle cx="40" cy="40" r="36" fill="none" stroke={BRAND.teal} strokeWidth="2" strokeDasharray="12 8" opacity={0.3} />
                  </svg>
                  {/* Inner ring */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80" style={{ animation: "spin-reverse 3s linear infinite" }}>
                    <circle cx="40" cy="40" r="26" fill="none" stroke={BRAND.teal} strokeWidth="2.5" strokeDasharray="20 40" opacity={0.6} />
                  </svg>
                  {/* Center dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{
                        background: BRAND.teal,
                        animation: "ping-dot 2s ease-in-out infinite",
                      }}
                    />
                    <div
                      className="absolute w-3 h-3 rounded-full"
                      style={{ background: BRAND.teal }}
                    />
                  </div>
                </>
              ) : (
                /* Complete state — checkmark */
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center animate-fade-in-up"
                  style={{ background: darkMode ? "#E6EDF3" : "#000" }}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#0D1117" : "white"} strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              )}
            </div>

            {/* Status Text */}
            <h2 className="text-2xl font-medium mb-1" style={{ color: theme.text }}>
              {statusMessage}
            </h2>
            <p className="text-base font-medium" style={{ color: theme.textSecondary }}>
              {Math.round(overallProgress)}% complete
            </p>

            {/* Main Progress Bar */}
            <div className="w-full max-w-sm mt-4">
              <div className="h-3 rounded-full overflow-hidden" style={{ background: theme.barTrack }}>
                <div
                  className="h-full rounded-full progress-shimmer transition-all duration-300"
                  style={{
                    width: `${overallProgress}%`,
                    background: "#10A37F",
                  }}
                />
              </div>
            </div>

            {/* Scanning for X audiences */}
            <p className="text-sm mt-3" style={{ color: theme.textMuted }}>
              Scanning for 5 audiences
            </p>
          </div>

          {/* Phase Tabs */}
          <div className="flex items-center justify-center gap-1 mb-6 flex-wrap" dir="ltr">
            {[
              { id: "queries" as ScanPhase, label: "Queries" },
              { id: "chatgpt" as ScanPhase, label: "GPT" },
              { id: "gemini" as ScanPhase, label: "Gemini" },
              { id: "analysis" as ScanPhase, label: "Analysis" },
            ].map((tab) => {
              const isActive = phase === tab.id;
              const isPast =
                (tab.id === "queries" && ["chatgpt", "gemini", "analysis", "complete"].includes(phase)) ||
                (tab.id === "chatgpt" && ["gemini", "analysis", "complete"].includes(phase)) ||
                (tab.id === "gemini" && ["analysis", "complete"].includes(phase)) ||
                (tab.id === "analysis" && phase === "complete");

              return (
                <div
                  key={tab.id}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    background: isActive ? BRAND.teal : isPast ? theme.badgeBg : "transparent",
                    color: isActive ? "white" : isPast ? BRAND.teal : theme.textMuted,
                    border: `1.5px solid ${isActive ? BRAND.teal : theme.border}`,
                  }}
                >
                  <span className="flex items-center gap-1">{isPast && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}{tab.label}</span>
                </div>
              );
            })}

            {/* Additional inactive tabs for context */}
            {["Audiences", "Site"].map((label) => (
              <div
                key={label}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: "transparent",
                  color: theme.textMuted,
                  border: `1.5px solid ${theme.border}`,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Phase-specific content */}
          <div className="min-h-[200px]">
            {/* QUERIES PHASE */}
            {phase === "queries" && (
              <div className="animate-fade-in-up">
                <h3 className="text-[20px] font-medium mb-3" style={{ color: theme.textSecondary }}>
                  Generating queries ({queryIndex + 1}/{MOCK_QUERIES.length})
                </h3>
                <QueryStream queries={MOCK_QUERIES} currentIndex={queryIndex} theme={theme} />
              </div>
            )}

            {/* CHATGPT PHASE */}
            {phase === "chatgpt" && (
              <div className="animate-fade-in-up">
                <AIEngineCard
                  name="ChatGPT"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.11.584 6.047 6.047 0 004.626 3.6a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0012.89 23.4a6.046 6.046 0 006.483-3.017 5.986 5.986 0 003.998-2.9 6.046 6.046 0 00-.743-7.097" />
                    </svg>
                  }
                  color="#10A37F"
                  active={true}
                  progress={gptProgress}
                  currentQuery={currentQueryForEngine}
                  theme={theme}
                />
              </div>
            )}

            {/* GEMINI PHASE */}
            {phase === "gemini" && (
              <div className="animate-fade-in-up">
                <AIEngineCard
                  name="ChatGPT"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.11.584 6.047 6.047 0 004.626 3.6a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0012.89 23.4a6.046 6.046 0 006.483-3.017 5.986 5.986 0 003.998-2.9 6.046 6.046 0 00-.743-7.097" />
                    </svg>
                  }
                  color="#10A37F"
                  active={false}
                  progress={100}
                  currentQuery={undefined}
                  theme={theme}
                />
                <div className="mt-4">
                  <AIEngineCard
                    name="Gemini"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z"/></svg>}
                    color="#10A37F"
                    active={true}
                    progress={geminiProgress}
                    currentQuery={currentQueryForEngine}
                    theme={theme}
                  />
                </div>
              </div>
            )}

            {/* ANALYSIS PHASE */}
            {phase === "analysis" && (
              <div className="animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <AIEngineCard
                    name="ChatGPT"
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.11.584 6.047 6.047 0 004.626 3.6a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0012.89 23.4a6.046 6.046 0 006.483-3.017 5.986 5.986 0 003.998-2.9 6.046 6.046 0 00-.743-7.097" />
                      </svg>
                    }
                    color="#10A37F"
                    active={false}
                    progress={100}
                    currentQuery={undefined}
                    theme={theme}
                  />
                  <AIEngineCard
                    name="Gemini"
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z"/></svg>}
                    color="#10A37F"
                    active={false}
                    progress={100}
                    currentQuery={undefined}
                    theme={theme}
                  />
                </div>

                {/* Analysis specific content */}
                <div
                  className="rounded-xl p-5 border"
                  style={{
                    borderColor: BRAND.teal,
                    background: `${BRAND.teal}08`,
                    animation: "glow-pulse 2s ease-in-out infinite",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: BRAND.teal }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-[20px]" style={{ color: theme.text }}>Analyzing results</h4>
                      <p className="text-[15px]" style={{ color: theme.textSecondary }}>
                        Comparing models and computing presence scores
                      </p>
                    </div>
                  </div>

                  {/* Analysis items appearing one by one */}
                  <div className="space-y-2">
                    {[
                      { label: "Mention classification", done: analysisProgress > 20 },
                      { label: "Sentiment analysis", done: analysisProgress > 40 },
                      { label: "Model comparison", done: analysisProgress > 60 },
                      { label: "Presence score calculation", done: analysisProgress > 80 },
                      { label: "Insight extraction", done: analysisProgress >= 100 },
                    ].map((item, i) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 text-[15px]"
                        style={{
                          opacity: analysisProgress > i * 20 ? 1 : 0.3,
                          transition: "opacity 0.5s",
                        }}
                      >
                        {item.done ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BRAND.teal} strokeWidth="2.5">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          <div
                            className="w-4 h-4 rounded-full border-2"
                            style={{
                              borderColor: BRAND.teal,
                              borderTopColor: "transparent",
                              animation: "spin-slow 1s linear infinite",
                            }}
                          />
                        )}
                        <span style={{ color: item.done ? theme.text : theme.textMuted }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COMPLETE */}
            {phase === "complete" && (
              <div className="animate-fade-in-up text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `${BRAND.teal}15` }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={BRAND.teal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-medium mb-2" style={{ color: theme.text }}>
                  Scan complete!
                </h3>
                <p className="text-base mb-6" style={{ color: theme.textSecondary }}>
                  Scanned 10 queries across 5 audiences in ChatGPT and Gemini
                </p>
                <button
                  className="px-8 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]"
                  style={{ background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff" }}
                >
                  <span className="flex items-center justify-center gap-2">View results <ArrowRight size={16} color={darkMode ? "#0D1117" : "white"} /></span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <GeoFooter theme={theme} isMobile={isMobile} />
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN APP — Screen Router
// ════════════════════════════════════════════
export default function Home() {
  const [screen, setScreen] = useState<1 | 2 | 3 | 4>(1);
  const [domain, setDomain] = useState("example.com");
  const [brandName, setBrandName] = useState("My brand");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('geoscale-dark-mode') === 'true';
    return false;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => { localStorage.setItem('geoscale-dark-mode', darkMode.toString()); }, [darkMode]);
  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  const handleScreen1Submit = useCallback((d: string, b: string) => {
    setDomain(d);
    setBrandName(b);
    setScreen(2);
  }, []);

  const handleScreen2Complete = useCallback(() => {
    setScreen(3);
  }, []);

  const handleStartScan = useCallback(() => {
    setScreen(4);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Dev Navigation — for Inna to switch between screens */}
      <div className="fixed bottom-4 left-4 z-50 flex gap-2" dir="ltr">
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            onClick={() => setScreen(s as 1 | 2 | 3 | 4)}
            className="w-10 h-10 rounded-full text-sm font-medium transition-all hover:scale-110"
            style={{
              background: screen === s ? BRAND.teal : theme.cardBg,
              color: screen === s ? "white" : theme.textSecondary,
              border: `2px solid ${screen === s ? BRAND.teal : theme.border}`,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {screen === 1 && <Screen1 onSubmit={handleScreen1Submit} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
      {screen === 2 && <Screen2 domain={domain} brandName={brandName} onComplete={handleScreen2Complete} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
      {screen === 3 && <Screen3 onStartScan={handleStartScan} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
      {screen === 4 && <Screen4 brandName={brandName} theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
    </main>
  );
}
