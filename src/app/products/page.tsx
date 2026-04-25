"use client";

import React, { useState } from "react";

// ============================================================
// GEOSCALE — Products & Services Page
// Shows how products/services map to queries like personas do
// Example brand: CallMobile (auto retail: sales, leasing, service)
// Design: Ultra-minimal Geoscale brand language
// ============================================================

// ── PRODUCTS ──
const PRODUCTS = [
  {
    id: "mercedes",
    name: "Mercedes-Benz",
    type: "product" as const,
    description: "Mercedes-Benz vehicles — sales, leasing, and service",
    queries: 14,
    mentioned: 11,
    score: 78,
    topQuery: "Mercedes lease deals US pricing",
  },
  {
    id: "hyundai",
    name: "Hyundai",
    type: "product" as const,
    description: "Hyundai vehicles — sales, leasing, and service",
    queries: 12,
    mentioned: 9,
    score: 72,
    topQuery: "Hyundai Tucson 2026 price US",
  },
  {
    id: "kia",
    name: "Kia",
    type: "product" as const,
    description: "Kia vehicles — sales, leasing, and service",
    queries: 10,
    mentioned: 7,
    score: 65,
    topQuery: "Kia Sportage hybrid reviews",
  },
  {
    id: "fleet",
    name: "Corporate fleet leasing",
    type: "service" as const,
    description: "Operational fleet leasing for businesses — management, maintenance, insurance",
    queries: 11,
    mentioned: 8,
    score: 70,
    topQuery: "Corporate fleet leasing comparison US",
  },
  {
    id: "insurance",
    name: "Auto insurance",
    type: "service" as const,
    description: "Comprehensive auto insurance — liability, full coverage, third-party",
    queries: 8,
    mentioned: 5,
    score: 58,
    topQuery: "New car full coverage insurance CallMobile",
  },
  {
    id: "service-center",
    name: "Service & maintenance center",
    type: "service" as const,
    description: "Maintenance, inspections, repairs, and authorized warranty service",
    queries: 9,
    mentioned: 6,
    score: 62,
    topQuery: "Authorized Mercedes service center New York",
  },
];

// ── QUERIES PER PRODUCT/SERVICE ──
const PRODUCT_QUERIES: Record<string, { id: number; text: string; stage: string; gpt: boolean; gemini: boolean; gptSnippet: string; geminiSnippet: string }[]> = {
  mercedes: [
    { id: 1, text: "Mercedes lease deals US pricing", stage: "Decision", gpt: true, gemini: true, gptSnippet: "CallMobile offers competitive lease terms on the full Mercedes-Benz lineup across the US...", geminiSnippet: "Mercedes leasing through CallMobile includes insurance, maintenance, and extended warranty..." },
    { id: 2, text: "Mercedes C-Class 2026 reviews", stage: "Research", gpt: true, gemini: true, gptSnippet: "The 2026 Mercedes C-Class brings notable upgrades. CallMobile is among the leading retailers...", geminiSnippet: "The new C-Class is earning strong reviews. CallMobile offers it with attractive lease terms..." },
    { id: 3, text: "Mercedes EQS electric range", stage: "Research", gpt: true, gemini: false, gptSnippet: "The Mercedes EQS delivers up to 480 miles of range. CallMobile offers test drives at its showrooms...", geminiSnippet: "EQS range varies by trim. In the US it's available through authorized dealers." },
    { id: 4, text: "Mercedes vs BMW 3 Series comparison", stage: "Research", gpt: true, gemini: true, gptSnippet: "Both deliver excellent performance. CallMobile specializes in Mercedes and offers added value...", geminiSnippet: "The C-Class and 3 Series are direct rivals. CallMobile wins on Mercedes lease pricing..." },
    { id: 5, text: "Mercedes US warranty coverage", stage: "Decision", gpt: false, gemini: true, gptSnippet: "Mercedes US warranty typically covers 4 years or 50,000 miles.", geminiSnippet: "CallMobile provides extended warranty on Mercedes models that includes routine maintenance..." },
    { id: 6, text: "Mercedes GLC price US 2026", stage: "Decision", gpt: true, gemini: true, gptSnippet: "The 2026 Mercedes GLC starts at $48,000. CallMobile offers financing plans...", geminiSnippet: "The 2026 GLC is available through CallMobile starting at $47,500 on lease..." },
    { id: 7, text: "Mercedes trade-in vehicle swap", stage: "Decision", gpt: false, gemini: true, gptSnippet: "Trade-in service is available at most dealerships. Getting quotes from several is recommended.", geminiSnippet: "CallMobile offers a smooth trade-in experience — vehicle appraisal in under an hour..." },
    { id: 8, text: "Mercedes OEM parts", stage: "Support", gpt: true, gemini: true, gptSnippet: "OEM Mercedes parts are available through authorized dealers. CallMobile stocks genuine parts...", geminiSnippet: "CallMobile maintains inventory of genuine Mercedes-Benz parts..." },
    { id: 9, text: "Mercedes lease no down payment", stage: "Awareness", gpt: true, gemini: false, gptSnippet: "Some lease companies offer zero-down options. CallMobile provides flexible lease plans...", geminiSnippet: "Zero-down lease plans are available at some providers. Check directly for current offers." },
    { id: 10, text: "Mercedes AMG performance US", stage: "Awareness", gpt: true, gemini: true, gptSnippet: "Mercedes-AMG models deliver exceptional performance. CallMobile stocks a wide AMG selection...", geminiSnippet: "The AMG lineup is available in the US. CallMobile is among the leading AMG dealers..." },
    { id: 11, text: "Mercedes year-end deals US", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "Year-end Mercedes promotions vary. Checking directly with dealers is recommended.", geminiSnippet: "CallMobile runs attractive year-end promotions across many Mercedes models..." },
    { id: 12, text: "Mercedes V-Class for business US", stage: "Research", gpt: false, gemini: true, gptSnippet: "The V-Class is a popular executive vehicle for business use. Available at authorized dealers.", geminiSnippet: "CallMobile offers the V-Class for business customers with custom build options and dedicated lease plans..." },
    { id: 13, text: "Mercedes state inspection where to go", stage: "Support", gpt: true, gemini: true, gptSnippet: "Mercedes state inspections can be done at any authorized shop. CallMobile operates service centers...", geminiSnippet: "CallMobile service centers offer full inspection service for Mercedes vehicles..." },
    { id: 14, text: "Mercedes full coverage insurance price", stage: "Decision", gpt: false, gemini: false, gptSnippet: "Full coverage for a Mercedes typically runs $750-$2,000 per year.", geminiSnippet: "Full coverage cost for a Mercedes depends on model, vehicle age, and driver profile." },
  ],
  hyundai: [
    { id: 101, text: "Hyundai Tucson 2026 price US", stage: "Decision", gpt: true, gemini: true, gptSnippet: "The 2026 Hyundai Tucson starts at $28,000. CallMobile offers attractive financing terms...", geminiSnippet: "The 2026 Tucson is available at CallMobile with a range of trim levels. Competitive market pricing..." },
    { id: 102, text: "Hyundai Ioniq 5 electric range", stage: "Research", gpt: true, gemini: true, gptSnippet: "The Ioniq 5 delivers up to 303 miles of range. CallMobile offers test drives at its showrooms...", geminiSnippet: "The Ioniq 5 is among the most popular EVs. CallMobile offers it on lease..." },
    { id: 103, text: "Hyundai Venue compact price", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "The Hyundai Venue is a small, efficient car. Starting around $20,000.", geminiSnippet: "CallMobile offers the new Venue with special promotions for first-time drivers..." },
    { id: 104, text: "Tucson vs RAV4 comparison", stage: "Research", gpt: true, gemini: true, gptSnippet: "Both rivals compete in the compact SUV segment. The Tucson has the warranty advantage...", geminiSnippet: "CallMobile recommends the Tucson for its longer warranty and richer feature set..." },
    { id: 105, text: "Hyundai 10-year warranty US", stage: "Research", gpt: true, gemini: false, gptSnippet: "Hyundai offers a 10-year / 100,000-mile powertrain warranty. CallMobile adds VIP service...", geminiSnippet: "The 10-year warranty is a key Hyundai advantage. CallMobile provides extended coverage." },
    { id: 106, text: "Hyundai Santa Fe 7-seater", stage: "Research", gpt: true, gemini: true, gptSnippet: "The Santa Fe seats 7. CallMobile offers test drives across its lineup...", geminiSnippet: "The Santa Fe is a successful family SUV. CallMobile offers it with attractive lease terms..." },
    { id: 107, text: "Hyundai EV charging network US", stage: "Research", gpt: false, gemini: true, gptSnippet: "The US charging network is expanding. Hyundai EVs are compatible with most stations.", geminiSnippet: "CallMobile offers a full charging solution including home charger installation for Hyundai EV customers..." },
    { id: 108, text: "Hyundai deals US", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "Hyundai promotions vary by season. Check directly for current offers.", geminiSnippet: "CallMobile runs ongoing Hyundai promotions, including loyalty discounts..." },
    { id: 109, text: "Hyundai corporate leasing for employees", stage: "Decision", gpt: true, gemini: true, gptSnippet: "Many companies offer subsidized lease plans for employees. CallMobile delivers corporate solutions...", geminiSnippet: "CallMobile runs an employee lease program for larger organizations..." },
    { id: 110, text: "Authorized Hyundai service Northeast", stage: "Support", gpt: true, gemini: true, gptSnippet: "Authorized Hyundai service centers are spread across the Northeast. CallMobile operates shops in NYC, Boston, and NJ...", geminiSnippet: "CallMobile runs a network of authorized Hyundai service shops across the Northeast..." },
    { id: 111, text: "Hyundai Kona Electric price 2026", stage: "Decision", gpt: true, gemini: false, gptSnippet: "The Kona Electric starts at $34,000. CallMobile offers financing plans...", geminiSnippet: "The Kona Electric is available in the US. Pricing depends on trim level." },
    { id: 112, text: "Hyundai Tucson diesel vs gas", stage: "Research", gpt: false, gemini: false, gptSnippet: "Diesel Tucson is more efficient on long trips. Gas is better suited for city driving.", geminiSnippet: "In the US, the gas Tucson is more popular. CallMobile recommends testing both." },
  ],
  kia: [
    { id: 201, text: "Kia Sportage hybrid reviews", stage: "Research", gpt: true, gemini: true, gptSnippet: "The Kia Sportage HEV earns excellent reviews. CallMobile offers test drives...", geminiSnippet: "The Sportage hybrid is considered among the top cars in its segment. CallMobile provides full service..." },
    { id: 202, text: "Kia EV6 range and price US", stage: "Research", gpt: true, gemini: true, gptSnippet: "The EV6 delivers up to 328 miles of range. CallMobile offers it with competitive lease terms...", geminiSnippet: "The Kia EV6 is available at CallMobile with special launch promotions..." },
    { id: 203, text: "Kia Niro compact electric", stage: "Awareness", gpt: true, gemini: false, gptSnippet: "The Niro EV is a compact, efficient electric SUV. CallMobile offers it on lease...", geminiSnippet: "The Niro Electric is a popular choice. Available through authorized dealers." },
    { id: 204, text: "Kia 10-year warranty", stage: "Research", gpt: true, gemini: true, gptSnippet: "Kia offers an impressive 10-year powertrain warranty. CallMobile honors it in full...", geminiSnippet: "Kia's 10-year warranty is among the best in the market. As an authorized dealer, CallMobile delivers full coverage..." },
    { id: 205, text: "Kia Telluride 7-seater family", stage: "Research", gpt: false, gemini: true, gptSnippet: "The Telluride seats 7 for family trips.", geminiSnippet: "CallMobile offers the Telluride in 7-seater config with family-friendly lease terms..." },
    { id: 206, text: "Kia Sportage lease monthly price", stage: "Decision", gpt: true, gemini: true, gptSnippet: "Sportage lease pricing runs around $350-$500 per month. CallMobile offers several plan tiers...", geminiSnippet: "CallMobile publishes competitive Sportage lease pricing starting at $329/month..." },
    { id: 207, text: "Kia Soul price US", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "The Soul is a compact, efficient SUV. Starts around $22,000.", geminiSnippet: "CallMobile offers the Soul with launch promotions and special terms..." },
    { id: 208, text: "Kia service center aftersales", stage: "Support", gpt: true, gemini: true, gptSnippet: "Kia aftersales service includes authorized shops. CallMobile operates service centers...", geminiSnippet: "CallMobile provides full aftersales service for all Kia models at service centers nationwide..." },
    { id: 209, text: "Kia EV charging stations", stage: "Research", gpt: false, gemini: false, gptSnippet: "The charging network supports all Kia EV models.", geminiSnippet: "CallMobile helps with home charger installation for its customers." },
    { id: 210, text: "Kia Rio entry-level price", stage: "Awareness", gpt: true, gemini: true, gptSnippet: "The Rio is Kia's entry-level vehicle. CallMobile offers it at competitive prices...", geminiSnippet: "The new Rio is available at CallMobile with promotions for first-time drivers..." },
  ],
  fleet: [
    { id: 301, text: "Corporate fleet leasing comparison US", stage: "Research", gpt: true, gemini: true, gptSnippet: "CallMobile offers comprehensive fleet leasing for companies including management, maintenance, and insurance...", geminiSnippet: "Corporate fleet leasing through CallMobile delivers an end-to-end solution..." },
    { id: 302, text: "Business fleet management solutions", stage: "Research", gpt: true, gemini: true, gptSnippet: "Fleet management covers tracking, maintenance, and optimization. CallMobile provides an advanced platform...", geminiSnippet: "CallMobile offers a digital fleet management platform with real-time reporting..." },
    { id: 303, text: "Fleet lease price per employee", stage: "Decision", gpt: true, gemini: false, gptSnippet: "Fleet lease cost per employee depends on model and terms. CallMobile offers volume discounts...", geminiSnippet: "Fleet lease pricing varies by vehicle type and employee count." },
    { id: 304, text: "Fleet vehicle replacement guide", stage: "Research", gpt: false, gemini: true, gptSnippet: "Fleet replacement takes careful planning. Consulting an expert is recommended.", geminiSnippet: "CallMobile offers full fleet-transition management — from appraisal to new-vehicle delivery..." },
    { id: 305, text: "Fleet leasing vs buying benefits", stage: "Research", gpt: true, gemini: true, gptSnippet: "Fleet leasing offers tax, flexibility, and peace-of-mind benefits. CallMobile explains the differences...", geminiSnippet: "CallMobile recommends fleet leasing for businesses thanks to predictable expenses and tax advantages..." },
    { id: 306, text: "Green EV fleet leasing for business", stage: "Awareness", gpt: true, gemini: true, gptSnippet: "Transitioning a business fleet to EVs. CallMobile offers a green leasing package...", geminiSnippet: "CallMobile launched a green EV lease track for companies looking to cut emissions..." },
    { id: 307, text: "Executive luxury fleet leasing", stage: "Decision", gpt: false, gemini: true, gptSnippet: "Luxury vehicle leasing for executives is available in several plans.", geminiSnippet: "CallMobile offers luxury lease plans including Mercedes and BMW for corporate executives..." },
    { id: 308, text: "Fleet ESG reporting", stage: "Support", gpt: true, gemini: false, gptSnippet: "ESG reporting on fleets matters for public companies. CallMobile provides emissions data...", geminiSnippet: "Companies must report emissions. Green fleet management helps meet those goals." },
    { id: 309, text: "Fleet maintenance service", stage: "Support", gpt: true, gemini: true, gptSnippet: "CallMobile delivers comprehensive maintenance service for corporate fleets, including loaner vehicles...", geminiSnippet: "CallMobile's fleet maintenance service includes auto reminders, shop scheduling, and loaner cars..." },
    { id: 310, text: "Monthly fleet management report", stage: "Support", gpt: false, gemini: true, gptSnippet: "Fleet management reports matter for expense tracking.", geminiSnippet: "CallMobile delivers detailed monthly reports on expenses, mileage, and fleet performance..." },
    { id: 311, text: "Fleet leasing for startups", stage: "Awareness", gpt: true, gemini: true, gptSnippet: "Startups can benefit from flexible fleet leasing. CallMobile offers tailored packages...", geminiSnippet: "CallMobile developed especially flexible lease tracks for startups and early-stage companies..." },
  ],
  insurance: [
    { id: 401, text: "New car full coverage insurance CallMobile", stage: "Decision", gpt: true, gemini: true, gptSnippet: "CallMobile offers full coverage bundled with purchase or lease. Advantage — everything under one roof...", geminiSnippet: "Full coverage through CallMobile includes special discounts for lease customers..." },
    { id: 402, text: "Third-party insurance price US", stage: "Research", gpt: true, gemini: false, gptSnippet: "Third-party insurance runs $500-$1,500 per year. CallMobile offers bundled packages...", geminiSnippet: "Third-party insurance rates vary by driver profile." },
    { id: 403, text: "Auto insurance company comparison", stage: "Research", gpt: false, gemini: true, gptSnippet: "Comparing quotes from multiple carriers is recommended.", geminiSnippet: "CallMobile compares offers from leading insurers and provides the best quote..." },
    { id: 404, text: "Online auto insurance renewal", stage: "Decision", gpt: true, gemini: true, gptSnippet: "Online renewal is becoming common. CallMobile enables full digital renewal...", geminiSnippet: "CallMobile offers simple digital insurance renewal through the app..." },
    { id: 405, text: "Electric vehicle insurance price", stage: "Research", gpt: true, gemini: true, gptSnippet: "EV insurance can run higher. CallMobile offers dedicated plans...", geminiSnippet: "CallMobile developed EV-tailored insurance packages at competitive rates..." },
    { id: 406, text: "Auto insurance claims process", stage: "Support", gpt: true, gemini: false, gptSnippet: "The claims process covers reporting, appraisal, and repair. CallMobile guides you through all stages...", geminiSnippet: "Filing a claim can take time. Documenting everything is recommended." },
    { id: 407, text: "Auto insurance for young drivers", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "Young-driver insurance typically runs higher.", geminiSnippet: "CallMobile offers young-driver discounts when you purchase or lease through them..." },
    { id: 408, text: "Online auto insurance in minutes", stage: "Awareness", gpt: true, gemini: true, gptSnippet: "Buying insurance online is fast and easy. CallMobile delivers a quote in 3 minutes...", geminiSnippet: "CallMobile enables full digital auto insurance purchase in minutes..." },
  ],
  "service-center": [
    { id: 501, text: "Authorized Mercedes service center New York", stage: "Support", gpt: true, gemini: true, gptSnippet: "CallMobile runs an authorized Mercedes service center in New York with an expert team...", geminiSnippet: "CallMobile's New York service center specializes in Mercedes and offers express service..." },
    { id: 502, text: "10,000-mile service price", stage: "Research", gpt: true, gemini: true, gptSnippet: "10,000-mile service pricing varies by model. CallMobile offers monthly maintenance packages...", geminiSnippet: "CallMobile publishes transparent service pricing. Lease customers enjoy full coverage..." },
    { id: 503, text: "Mercedes tire replacement shop", stage: "Support", gpt: false, gemini: true, gptSnippet: "Mercedes tire replacement is recommended at authorized shops.", geminiSnippet: "CallMobile offers tire replacement service including balancing and suspension check..." },
    { id: 504, text: "Online service appointment booking", stage: "Support", gpt: true, gemini: true, gptSnippet: "Online appointment booking is becoming common. CallMobile enables digital scheduling...", geminiSnippet: "CallMobile offers online service appointments through the app..." },
    { id: 505, text: "Vehicle pickup roadside service", stage: "Support", gpt: true, gemini: false, gptSnippet: "Some shops offer vehicle pickup and delivery. CallMobile provides this for VIP customers...", geminiSnippet: "Home or office vehicle pickup is available at select dealerships." },
    { id: 506, text: "Loaner car during service", stage: "Research", gpt: true, gemini: true, gptSnippet: "CallMobile provides loaner cars during service. This is included in lease packages...", geminiSnippet: "CallMobile guarantees a loaner car for every lease customer during service or repair..." },
    { id: 507, text: "Automatic service reminder", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "Automatic service reminders help keep a car healthy.", geminiSnippet: "The CallMobile app sends automatic reminders for service and inspections..." },
    { id: 508, text: "Authorized Hyundai service Boston", stage: "Support", gpt: true, gemini: true, gptSnippet: "CallMobile runs an authorized Hyundai service shop in Boston...", geminiSnippet: "CallMobile's Boston service center handles every Hyundai model..." },
    { id: 509, text: "Pre-purchase vehicle inspection", stage: "Research", gpt: true, gemini: true, gptSnippet: "CallMobile offers comprehensive pre-purchase inspection including a detailed report...", geminiSnippet: "CallMobile provides professional vehicle inspection service including accident history..." },
  ],
};

// ── COMPETITORS FOR CALLMOBILE ──
const COMPETITORS = [
  { name: "AutoNation", score: 72 },
  { name: "Enterprise Fleet", score: 61 },
  { name: "Hertz Car Sales", score: 48 },
  { name: "Sixt Leasing", score: 55 },
];

// ════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | "product" | "service">("all");
  const [expandedQuery, setExpandedQuery] = useState<number | null>(null);

  const filteredProducts = PRODUCTS.filter(p => typeFilter === "all" || p.type === typeFilter);
  const selectedQueries = selectedProduct ? (PRODUCT_QUERIES[selectedProduct] || []) : [];

  const totalProductQueries = PRODUCTS.reduce((s, p) => s + p.queries, 0);
  const totalMentioned = PRODUCTS.reduce((s, p) => s + p.mentioned, 0);
  const avgProductScore = Math.round(PRODUCTS.reduce((s, p) => s + p.score, 0) / PRODUCTS.length);

  const card: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #BFBFBF", borderRadius: 10 };
  const thinBorder = "1px solid #DDDDDD";

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter', 'Heebo', sans-serif", display: "flex", flexDirection: "column" }} dir="ltr">

      {/* ── Header — 3-column grid: logo | nav | actions ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.96)", borderBottom: "1px solid #BFBFBF" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 72, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          {/* LEFT (grid col 1) = Logo */}
          <div style={{ justifySelf: "start" }}>
            <svg width={150} height={30} viewBox="0 0 510 102" fill="none">
              <circle cx="51" cy="51" r="41" stroke="#ABABAB" strokeWidth="13" fill="none" />
              <circle cx="51" cy="51" r="41" stroke="#141414" strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
              <g fill="#141414"><text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text></g>
            </svg>
          </div>

          {/* CENTER (grid col 2) = Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="/" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none" }}>Dashboard</a>
            <a href="/scan" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none" }}>Scans</a>
            <a href="/scale-publish" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none" }}>ScalePublish</a>
            <a href="/roadmap" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none" }}>Roadmap</a>
          </nav>

          {/* RIGHT (grid col 3) = Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "end" }}>
            <a href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: "#000", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "1px solid #000", textDecoration: "none" }}>New scan</a>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#727272" }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
              <span>Connected</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 24px" }}>

          {/* ── Intro banner ── */}
          <div style={{ ...card, padding: 24, marginBottom: 32, borderLeft: "4px solid #10A37F" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#10A37F15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 500, color: "#000", margin: "0 0 8px" }}>Products & services — what and why?</h2>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#333", margin: "0 0 12px" }}>
                  In addition to personas (audiences), Geoscale lets you scan brand presence by specific <strong>products and services</strong>. Each product or service generates a dedicated query set — exactly like a persona generates queries based on audience profile.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#333", margin: "0 0 12px" }}>
                  <strong>Example:</strong> CallMobile sells Mercedes, Hyundai, and Kia vehicles (products) and provides fleet leasing, insurance, and maintenance (services). Each has different queries people ask ChatGPT and Gemini.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "#10A37F15", color: "#10A37F", fontWeight: 500 }}>Query research per product</span>
                  <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "#10A37F15", color: "#10A37F", fontWeight: 500 }}>Competitive gap analysis</span>
                  <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "#10A37F15", color: "#10A37F", fontWeight: 500 }}>Filter by product / service</span>
                  <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "#10A37F15", color: "#10A37F", fontWeight: 500 }}>Similar to persona filtering</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Brand Header ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <h1 style={{ fontSize: 24, fontWeight: 600, color: "#000", margin: 0 }}>CallMobile</h1>
                <span style={{ fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 10, border: "1px solid #10A37F", color: "#10A37F" }}>Example</span>
              </div>
              <p style={{ fontSize: 13, color: "#727272", margin: 0, textAlign: "left" }}>callmobile.com — vehicles, leasing, insurance, and service</p>
            </div>
          </div>

          {/* ── Top Metrics ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Products & services", value: PRODUCTS.length },
              { label: "Total queries", value: totalProductQueries },
              { label: "Mentioned in AI", value: totalMentioned },
              { label: "Average score", value: `${avgProductScore}%` },
            ].map((m, i) => (
              <div key={i} style={{ ...card, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 500, color: "#000", marginBottom: 2 }}>{m.value}</div>
                <div style={{ fontSize: 13, color: "#727272" }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* ── Type Filter ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            {([
              { key: "all" as const, label: "All", count: PRODUCTS.length },
              { key: "product" as const, label: "Products", count: PRODUCTS.filter(p => p.type === "product").length },
              { key: "service" as const, label: "Services", count: PRODUCTS.filter(p => p.type === "service").length },
            ]).map(f => (
              <button key={f.key} onClick={() => { setTypeFilter(f.key); setSelectedProduct(null); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 9, fontSize: 13, fontWeight: typeFilter === f.key ? 600 : 400, background: typeFilter === f.key ? "#000" : "#FFF", color: typeFilter === f.key ? "#FFF" : "#333", border: typeFilter === f.key ? "1px solid #000" : "1px solid #BFBFBF", cursor: "pointer" }}>
                {f.label} <span style={{ opacity: 0.7 }}>({f.count})</span>
              </button>
            ))}
          </div>

          {/* ── Products/Services Grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(selectedProduct === p.id ? null : p.id)}
                style={{ ...card, cursor: "pointer", overflow: "hidden", borderColor: selectedProduct === p.id ? "#10A37F" : "#BFBFBF", transition: "border-color 0.2s" }}
              >
                {/* Type indicator */}
                <div style={{ height: 3, background: p.type === "product" ? "#10A37F" : "#4285F4" }} />
                <div style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 500, color: "#000", margin: 0 }}>{p.name}</h3>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: p.type === "product" ? "#10A37F15" : "#4285F415", color: p.type === "product" ? "#10A37F" : "#4285F4", fontWeight: 500 }}>
                          {p.type === "product" ? "Product" : "Service"}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#727272", margin: 0 }}>{p.description}</p>
                    </div>
                    <div style={{ width: 48, height: 48, borderRadius: 10, background: p.score >= 70 ? "#10A37F12" : "#F9F9F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 16, fontWeight: 500, color: p.score >= 70 ? "#10A37F" : "#000" }}>{p.score}%</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                    <div style={{ textAlign: "center", padding: "8px 0", background: "#F9F9F9", borderRadius: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 500, color: "#000" }}>{p.queries}</div>
                      <div style={{ fontSize: 11, color: "#727272" }}>Queries</div>
                    </div>
                    <div style={{ textAlign: "center", padding: "8px 0", background: "#F9F9F9", borderRadius: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 500, color: "#10A37F" }}>{p.mentioned}</div>
                      <div style={{ fontSize: 11, color: "#727272" }}>Mentioned</div>
                    </div>
                    <div style={{ textAlign: "center", padding: "8px 0", background: p.queries - p.mentioned > 3 ? "#FFF8F0" : "#F9F9F9", borderRadius: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 500, color: p.queries - p.mentioned > 3 ? "#E07800" : "#000" }}>{p.queries - p.mentioned}</div>
                      <div style={{ fontSize: 11, color: "#727272" }}>Missing</div>
                    </div>
                  </div>

                  {/* Top Query */}
                  <div style={{ padding: 12, background: "#F9F9F9", borderRadius: 8, border: thinBorder }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: "#10A37F", margin: "0 0 4px" }}>Top query</p>
                    <p style={{ fontSize: 13, color: "#333", margin: 0 }}>"{p.topQuery}"</p>
                  </div>

                  {/* Click indicator */}
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A2A9B0" strokeWidth="2" style={{ transform: selectedProduct === p.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Selected Product Queries ── */}
          {selectedProduct && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 500, color: "#000", margin: 0 }}>
                    Queries for: {PRODUCTS.find(p => p.id === selectedProduct)?.name}
                  </h2>
                  <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 10, background: "#F9F9F9", border: thinBorder, color: "#727272" }}>
                    {selectedQueries.length} queries
                  </span>
                </div>
              </div>

              <div style={{ ...card, overflow: "hidden" }}>
                <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F9F9F9", borderBottom: "1px solid #BFBFBF" }}>
                      <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 500, color: "#727272", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>#</th>
                      <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 500, color: "#727272", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>Query</th>
                      <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 500, color: "#727272", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>Stage</th>
                      <th style={{ textAlign: "center", padding: "10px 14px", fontWeight: 500, color: "#727272", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>ChatGPT</th>
                      <th style={{ textAlign: "center", padding: "10px 14px", fontWeight: 500, color: "#727272", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>Gemini</th>
                      <th style={{ textAlign: "center", padding: "10px 14px", width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQueries.map((q, idx) => (
                      <React.Fragment key={q.id}>
                        <tr
                          onClick={() => setExpandedQuery(expandedQuery === q.id ? null : q.id)}
                          style={{ borderBottom: expandedQuery === q.id ? "none" : thinBorder, cursor: "pointer" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F9F9F9"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; }}
                        >
                          <td style={{ padding: "10px 14px", fontWeight: 400, color: "#A2A9B0" }}>{idx + 1}</td>
                          <td style={{ padding: "10px 14px", fontWeight: 400, color: "#333" }}>{q.text}</td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ display: "inline-flex", fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 10, border: thinBorder, background: "#F9F9F9", color: "#333" }}>{q.stage}</span>
                          </td>
                          <td style={{ padding: "10px 14px", textAlign: "center" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 10, background: q.gpt ? "#FFF" : "#F9F9F9", color: q.gpt ? "#10A37F" : "#727272", border: `1px solid ${q.gpt ? "#10A37F" : "#DDDDDD"}` }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                {q.gpt ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
                              </svg>
                              {q.gpt ? "Mentioned" : "Missing"}
                            </span>
                          </td>
                          <td style={{ padding: "10px 14px", textAlign: "center" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 10, background: q.gemini ? "#FFF" : "#F9F9F9", color: q.gemini ? "#10A37F" : "#727272", border: `1px solid ${q.gemini ? "#10A37F" : "#DDDDDD"}` }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                {q.gemini ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
                              </svg>
                              {q.gemini ? "Mentioned" : "Missing"}
                            </span>
                          </td>
                          <td style={{ padding: "10px 14px", textAlign: "center" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#727272" strokeWidth="2" style={{ display: "inline-block", transform: expandedQuery === q.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}><path d="M6 9l6 6 6-6" /></svg>
                          </td>
                        </tr>
                        {expandedQuery === q.id && (
                          <tr>
                            <td colSpan={6} style={{ padding: "0 14px 14px" }}>
                              <div style={{ borderRadius: 10, padding: 16, background: "#F9F9F9", border: thinBorder, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ borderRadius: 10, padding: 14, background: "#FFF", border: thinBorder }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#10A37F"><path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.702.418 6.004 6.004 0 005.354 2.08a5.974 5.974 0 00-3.994 2.9 6.042 6.042 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.702 22a6.003 6.003 0 006.349-1.662 5.98 5.98 0 003.994-2.9 6.042 6.042 0 00-.743-7.097l-.02-.02z" /></svg>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: "#10A37F" }}>ChatGPT (GPT-4o)</span>
                                  </div>
                                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "#333", margin: 0 }}>{q.gptSnippet}</p>
                                </div>
                                <div style={{ borderRadius: 10, padding: 14, background: "#FFF", border: thinBorder }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 3.6c2.21 0 4.122.84 5.64 2.16l-2.4 2.4A5.356 5.356 0 0012 7.2c-2.652 0-4.8 2.148-4.8 4.8s2.148 4.8 4.8 4.8c2.316 0 4.128-1.488 4.56-3.6H12v-3.6h8.28c.12.6.12 1.2.12 1.8 0 4.644-3.156 8.4-8.4 8.4-4.632 0-8.4-3.768-8.4-8.4S7.368 3.6 12 3.6z" /></svg>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: "#4285F4" }}>Google Gemini</span>
                                  </div>
                                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "#333", margin: 0 }}>{q.geminiSnippet}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #BFBFBF", background: "#F9F9F9" }}>
                  <span style={{ fontSize: 12, color: "#727272" }}>Showing {selectedQueries.length} queries for {PRODUCTS.find(p => p.id === selectedProduct)?.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12 }}>
                    <span style={{ color: "#10A37F" }}>Mentioned: {selectedQueries.filter(q => q.gpt || q.gemini).length}</span>
                    <span style={{ color: "#000" }}>Missing: {selectedQueries.filter(q => !q.gpt && !q.gemini).length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Competitors ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            <div style={{ ...card, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 500, color: "#000", margin: "0 0 16px" }}>Competitors — products & services</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {COMPETITORS.map((comp, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, border: thinBorder, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#333" }}>{i + 1}</div>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#333" }}>{comp.name}</span>
                    <div style={{ width: 80, height: 6, borderRadius: 3, overflow: "hidden", background: "#F9F9F9" }}>
                      <div style={{ width: `${comp.score}%`, height: "100%", borderRadius: 3, background: "#10A37F" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, width: 36, textAlign: "right", color: "#000" }}>{comp.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...card, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 500, color: "#000", margin: "0 0 16px" }}>Gaps vs competitors</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Missing coverage on EV insurance queries",
                  "Competitors mentioned more often on fleet leasing queries",
                  "No content on Kia electric (EV6, Niro)",
                  "No presence in trade-in and vehicle-swap queries",
                  "Weak on loaner car and roadside service queries",
                ].map((w, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: 3, marginTop: 7, flexShrink: 0, background: "#000" }} />
                    <span style={{ fontSize: 14, color: "#333" }}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Coverage by Journey Stage ── */}
          <div style={{ ...card, padding: 24, marginBottom: 32 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: "#000", margin: "0 0 20px" }}>Coverage by customer journey stage</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { name: "Awareness", percent: 72, count: 18 },
                { name: "Research", percent: 85, count: 28 },
                { name: "Decision", percent: 68, count: 22 },
                { name: "Support", percent: 76, count: 14 },
              ].map((stage, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, width: 80, flexShrink: 0, color: "#333" }}>{stage.name}</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, overflow: "hidden", background: "#F9F9F9" }}>
                    <div style={{ width: `${stage.percent}%`, height: "100%", borderRadius: 4, background: "#10A37F", transition: "width 1s ease" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, width: 40, textAlign: "right", color: "#000" }}>{stage.percent}%</span>
                  <span style={{ fontSize: 12, width: 80, textAlign: "right", color: "#727272" }}>{stage.count} queries</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #BFBFBF", marginTop: "auto" }}>
        <div dir="ltr" style={{ maxWidth: 1300, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width={28} height={28} viewBox="0 0 102 102" fill="none">
              <circle cx="51" cy="51" r="41" stroke="#ABABAB" strokeWidth="10" fill="none" />
              <circle cx="51" cy="51" r="41" stroke="#141414" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
            </svg>
            <span style={{ fontSize: 14, color: "#727272" }}>Powered by advanced AI to analyze your search presence</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {[
              { label: "Feedback", color: "#10A37F", bg: "#10A37F15" },
              { label: "Report a bug", color: "#E07800", bg: "#E0780015" },
              { label: "Improvement ideas", color: "#4285F4", bg: "#4285F415" },
              { label: "API usage", color: "#10A37F", bg: "#10A37F15" },
            ].map((link, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 20, color: link.color, background: link.bg, cursor: "pointer" }}>{link.label}</span>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "#A2A9B0" }}>&copy; GeoScale 2026</span>
        </div>
      </footer>
    </div>
  );
}
