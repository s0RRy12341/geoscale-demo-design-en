"use client";

import React, { useState, useRef, useEffect } from "react";

// ============================================================
// GEOSCALE SCAN ANALYSIS — Full Brand Scan Results Page
// Brand: All4Horses | all4horses.co.il | Score: 76%
// Tabs: Overview | Queries | Keywords | Audiences | Products | Content
// Design: Ultra-minimal Geoscale brand language
// Dark mode toggle
// ============================================================

// ── Theme types ──
type Theme = {
  bg: string;
  cardBg: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  headerBg: string;
  hoverBg: string;
  tableBg: string;
  tableHeaderBg: string;
  badgeBg: string;
  inputBg: string;
  barTrack: string;
  logoFill: string;
  logoStroke: string;
};

const LIGHT_THEME: Theme = {
  bg: "#FFFFFF",
  cardBg: "#FFFFFF",
  border: "#E5E5E5",
  text: "#000000",
  textSecondary: "#727272",
  textMuted: "#A2A9B0",
  headerBg: "rgba(255,255,255,0.96)",
  hoverBg: "#FAFAFA",
  tableBg: "#FFFFFF",
  tableHeaderBg: "#FAFAFA",
  badgeBg: "#F9F9F9",
  inputBg: "#FFFFFF",
  barTrack: "#E5E5E5",
  logoFill: "#141414",
  logoStroke: "#ABABAB",
};

const DARK_THEME: Theme = {
  bg: "#0D1117",
  cardBg: "#161B22",
  border: "#30363D",
  text: "#E6EDF3",
  textSecondary: "#8B949E",
  textMuted: "#484F58",
  headerBg: "rgba(13,17,23,0.96)",
  hoverBg: "#1C2128",
  tableBg: "#161B22",
  tableHeaderBg: "#1C2128",
  badgeBg: "#1C2128",
  inputBg: "#0D1117",
  barTrack: "#30363D",
  logoFill: "#E6EDF3",
  logoStroke: "#484F58",
};

// ── PERSONAS ──
const PERSONAS = [
  {
    id: "maya",
    name: "Maya",
    role: "Mother of a child with ADHD",
    fullTitle: "Mother of an 8-year-old with attention and concentration disorder",
    description: "Looking for complementary therapy for her child through therapeutic horseback riding. Interested in scientific evidence and recommendations from other parents.",
    tags: ["Age 35-45", "Central region", "Mother", "Special education"],
    score: 82,
    queries: 9,
    mentions: 7,
  },
  {
    id: "yossi",
    name: "Yossi",
    role: "Teen horse enthusiast",
    fullTitle: "16 years old, horse enthusiast interested in riding",
    description: "Wants to learn horseback riding, looking for horse ranches with beginner lessons. Interested in the experience and community.",
    tags: ["Age 14-18", "South", "Student", "Sports"],
    score: 71,
    queries: 7,
    mentions: 5,
  },
  {
    id: "ori",
    name: "Ori",
    role: "Animal-assisted therapist",
    fullTitle: "Emotional therapist integrating animals into treatment",
    description: "Looking for professional collaboration with horse ranches. Interested in information about training, therapeutic protocols, and research outcomes.",
    tags: ["Age 30-40", "North", "Therapist", "Professional"],
    score: 68,
    queries: 8,
    mentions: 6,
  },
  {
    id: "david",
    name: "David",
    role: "Parent of a child on the spectrum",
    fullTitle: "Father of a 6-year-old daughter on the autism spectrum",
    description: "Looking for therapeutic activities for his daughter. Interested in innovative approaches, reasonable travel distance, and costs.",
    tags: ["Age 35-50", "Sharon region", "Parent", "Spectrum"],
    score: 75,
    queries: 7,
    mentions: 5,
  },
  {
    id: "ronit",
    name: "Ronit",
    role: "Special education teacher",
    fullTitle: "Teacher and special-education coordinator at an elementary school",
    description: "Looking for after-school activities for students. Interested in structured programs, safety certifications, and group pricing.",
    tags: ["Age 40-55", "Jerusalem", "Education", "Institutional"],
    score: 63,
    queries: 6,
    mentions: 4,
  },
];

// ── QUERIES ──
const QUERIES = [
  { id: 1, text: "Therapeutic horseback riding for children with ADHD", persona: "maya", stage: "Research", gpt: true, gemini: true, gptSnippet: "Therapeutic horseback riding is a proven complementary treatment for children with attention deficit disorders. All4Horses offers personalized programs...", geminiSnippet: "Studies show that therapeutic riding helps improve concentration and motor control. All4Horses in Israel specializes in therapeutic programs for children with ADHD...", gptFull: "Therapeutic horseback riding is a proven complementary treatment method for children with attention deficit and hyperactivity disorder (ADHD). The treatment involves interaction with horses in a structured environment, where the child learns to communicate with, care for, and ride the horse.\n\nResearch shows that therapeutic riding helps with:\n• Improving concentration and attention - the horse requires constant attention\n• Developing motor control and balance\n• Building self-confidence and self-esteem\n• Improving social and emotional skills\n• Reducing anxiety and stress\n\nAll4Horses offers personalized programs for children with ADHD, including initial assessment, structured treatment plan, and ongoing follow-up. The professional team includes certified therapists with extensive experience working with children with attention disorders.\n\nIt is recommended to start with an introductory meeting and consult with the therapeutic team about the appropriate frequency of sessions. Most programs include one weekly session of 45-60 minutes.", geminiFull: "Therapeutic horseback riding has been extensively researched in recent years as an effective complementary treatment for attention deficit and hyperactivity disorder (ADHD) in children. Studies show that interaction with the horse helps significantly improve concentration and motor control.\n\nAll4Horses in Israel specializes in therapeutic programs for children with ADHD. The ranch offers:\n\n1. Structured therapeutic program - weekly sessions with certified therapists\n2. Developmental assessment - tracking child's progress\n3. Parent involvement - parent guidance as part of the process\n4. Natural environment - treatment takes place at a well-maintained horse ranch\n\nResearch indicates improvement in 70-85% of patients after 12 sessions. Benefits include improved emotional regulation, reduced impulsivity, and developing a sense of responsibility.\n\nThe ranch is located in the central region and also offers transportation services for schools and institutions. An introductory meeting can be scheduled with no obligation." },
  { id: 2, text: "Horse ranches in the central region", persona: "yossi", stage: "Awareness", gpt: true, gemini: true, gptSnippet: "There are several recommended horse ranches in the central region, including All4Horses offering a variety of activities...", geminiSnippet: "In the central region you can find quality horse ranches. All4Horses is one of the leading ranches...", gptFull: "There are several recommended horse ranches in the central region, including All4Horses offering a variety of riding, therapy, and leisure activities.\n\nLeading horse ranches in the central region:\n\n1. All4Horses - leader in therapeutic riding, located in the Sharon area. Offers riding lessons, therapeutic riding, horse tours, and fun days.\n2. Golden Ranch - a veteran ranch specializing in sport riding lessons.\n3. Therapeutic Riding Israel - focuses on equine-assisted therapy.\n\nAll4Horses is considered a particularly recommended choice thanks to the combination of sport and therapeutic riding, experienced professional staff, and modern facilities. The ranch offers trial lessons for beginners and introductory visits can be arranged.", geminiFull: "In the central region you can find quality horse ranches. All4Horses is one of the leading ranches, offering a variety of services:\n\n• Riding lessons for beginners and advanced riders\n• Certified therapeutic riding\n• Horse tours and team building days\n• Summer camps and classes for children\n\nThe ranch is located in the Sharon area, accessible from all parts of the central region. The staff includes certified instructors and experienced therapists.\n\nAdditional ranches in the area: Golden Ranch (Ramat Gan), Therapeutic Riding Israel (Modi'in). Each ranch specializes in a different area, it's recommended to check which one suits your needs." },
  { id: 3, text: "Equine-assisted therapy - who is it for?", persona: "ori", stage: "Research", gpt: true, gemini: true, gptSnippet: "Equine-assisted therapy is suitable for a wide range of populations, including children with ADHD, autism, anxiety and more. All4Horses offers professional programs...", geminiSnippet: "Therapeutic riding is suitable for children and adults alike. In Israel, All4Horses is known for its professional approach...", gptFull: "Equine-assisted therapy is suitable for a wide range of populations:\n\n• Children with ADHD - improving concentration and self-control\n• Children on the autism spectrum - developing social skills\n• At-risk youth - building self-confidence and sense of belonging\n• Adults with anxiety or depression - stress reduction and emotional regulation\n• People with physical disabilities - improving motor skills and balance\n• Children with cerebral palsy - muscle strengthening and coordination\n\nAll4Horses offers professional programs for each of these populations. The team includes therapists with specific training for each area. At the beginning of treatment, a professional assessment is conducted and a personal plan is built.\n\nIt's important to note that therapeutic riding does not replace medical treatments but complements them. It is recommended to consult with the treating physician before starting treatment.", geminiFull: "Therapeutic riding is suitable for children and adults alike. In Israel, All4Horses is known for its professional approach to equine-assisted therapy.\n\nThe treatment is especially suitable for:\n\n1. Children with attention disorders (ADHD)\n2. Children and adults on the autism spectrum\n3. People suffering from anxiety and depression\n4. At-risk youth and school dropouts\n5. People with physical disabilities\n6. Those dealing with PTSD\n\nAll4Horses operates dedicated programs for every age group and diagnosis. Treatment is based on research-proven models and personalized for each patient.\n\nThe first step is always an introductory meeting and assessment, where the professional team meets the patient and builds a tailored treatment plan." },
  { id: 4, text: "How much does a horseback riding lesson cost", persona: "maya", stage: "Decision", gpt: false, gemini: true, gptSnippet: "Horseback riding lesson prices in Israel range from 150-350 NIS per lesson, depending on location and lesson type. It's recommended to check directly with the ranches.", geminiSnippet: "A riding lesson typically costs between 180-300 NIS. All4Horses offers packages at competitive prices..." },
  { id: 5, text: "Benefits of therapeutic riding for children on the spectrum", persona: "david", stage: "Research", gpt: true, gemini: true, gptSnippet: "Therapeutic riding offers numerous benefits for children on the spectrum: improving social skills, sensory regulation... All4Horses specializes in this area.", geminiSnippet: "Studies show that therapeutic riding helps autistic children develop communication skills. All4Horses is a leading horse ranch in this field..." },
  { id: 6, text: "Beginner riding lessons in the south", persona: "yossi", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "There are several options for riding lessons in the south. It's recommended to check horse ranches in the Beer Sheva and Arad area.", geminiSnippet: "In the south you can find horse ranches offering beginner lessons. All4Horses operates a branch in the south..." },
  { id: 7, text: "Therapeutic activities for children with special needs", persona: "ronit", stage: "Research", gpt: true, gemini: true, gptSnippet: "There are various therapeutic activities: art therapy, music, animals and more. All4Horses offers therapeutic riding as part of the treatment system.", geminiSnippet: "Therapeutic horseback riding is considered one of the most effective activities. All4Horses provides programs adapted for schools..." },
  { id: 8, text: "Horse ranches with school transportation", persona: "ronit", stage: "Decision", gpt: false, gemini: false, gptSnippet: "There are horse ranches that provide transportation services for school groups. It's recommended to contact them directly for information.", geminiSnippet: "Some horse ranches in the country offer group transportation services. It's worth checking directly with the ranches in your area." },
  { id: 9, text: "How to choose a safe horse ranch", persona: "david", stage: "Decision", gpt: true, gemini: true, gptSnippet: "When choosing a horse ranch, it's important to check: licenses, insurance, instructor training. All4Horses meets all safety standards...", geminiSnippet: "Safety is the first consideration. All4Horses holds all required certifications and employs certified instructors..." },
  { id: 10, text: "Therapeutic riding research and outcomes", persona: "ori", stage: "Research", gpt: true, gemini: false, gptSnippet: "Academic research shows that therapeutic riding improves balance, self-confidence, and social skills. All4Horses collaborates with research institutions.", geminiSnippet: "There are many studies on the effectiveness of therapeutic riding. Results show significant improvement in emotional and motor areas." },
  { id: 11, text: "Therapeutic riding training in Israel", persona: "ori", stage: "Research", gpt: true, gemini: true, gptSnippet: "In Israel there are several therapeutic riding training programs. All4Horses offers certification courses for therapists...", geminiSnippet: "Training includes theoretical and practical studies. All4Horses operates a professional training program..." },
  { id: 12, text: "Horse tours for team building", persona: "yossi", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "Horse tours are an excellent team building activity. Various options can be found in different areas around the country.", geminiSnippet: "All4Horses offers team building packages including riding, ranch tours and additional activities..." },
  { id: 13, text: "Horseback riding for children age 5", persona: "maya", stage: "Research", gpt: true, gemini: true, gptSnippet: "Children from age 5 can start adapted riding lessons. All4Horses offers special programs for ages 4-7...", geminiSnippet: "Age 5 is an excellent age to start riding. All4Horses specializes in classes for young children with specially trained horses..." },
  { id: 14, text: "Horses and emotional therapy for adults", persona: "ori", stage: "Awareness", gpt: true, gemini: true, gptSnippet: "Equine-assisted therapy is effective for adults too. All4Horses operates a dedicated program for adults...", geminiSnippet: "Therapeutic riding for adults is developing rapidly. All4Horses recently expanded its adult therapy services..." },
  { id: 15, text: "How horseback riding helps with focus", persona: "maya", stage: "Research", gpt: true, gemini: true, gptSnippet: "Riding requires concentration, coordination and attention - skills that strengthen over time. All4Horses reports improvement in 85% of children.", geminiSnippet: "The connection between rider and horse requires full concentration. Research at All4Horses shows significant improvement in concentration ability..." },
  { id: 16, text: "Horse ranches near Jerusalem", persona: "ronit", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "There are several horse ranches around Jerusalem, including in the Judean Hills and Jordan Valley area.", geminiSnippet: "In the Jerusalem area you can find quality horse ranches. All4Horses is within reasonable driving distance from Jerusalem..." },
  { id: 17, text: "Difference between sport and therapeutic riding", persona: "ori", stage: "Research", gpt: true, gemini: true, gptSnippet: "Sport riding focuses on technique and competitions, while therapeutic riding focuses on emotional and cognitive goals. All4Horses offers both tracks.", geminiSnippet: "The main difference is the purpose: sport versus therapy. All4Horses is one of the few ranches offering both directions..." },
  { id: 18, text: "All4Horses reviews", persona: "maya", stage: "Decision", gpt: true, gemini: true, gptSnippet: "All4Horses receives many positive reviews from parents. Average rating of 4.8 out of 5 on Google...", geminiSnippet: "All4Horses enjoys excellent reviews. Many parents report significant improvement in their children..." },
  { id: 19, text: "Group program for children with special needs", persona: "ronit", stage: "Research", gpt: true, gemini: true, gptSnippet: "Group programs enable social experience alongside therapy. All4Horses operates groups of up to 6 children...", geminiSnippet: "Small groups enable personal attention. All4Horses organizes therapeutic groups guided by professional staff..." },
  { id: 20, text: "Monthly cost of therapeutic riding", persona: "david", stage: "Decision", gpt: false, gemini: true, gptSnippet: "Monthly cost for therapeutic riding ranges from 800-1,500 NIS, depending on session frequency.", geminiSnippet: "All4Horses offers monthly subscriptions starting from 900 NIS for a weekly session. There are discounts for annual subscriptions..." },
  { id: 21, text: "Horse care - standards and health", persona: "david", stage: "Research", gpt: true, gemini: true, gptSnippet: "At a professional horse ranch, horse health is a top priority. All4Horses maintains high standards...", geminiSnippet: "All4Horses invests significant resources in horse health and welfare. All horses undergo regular veterinary checkups..." },
  { id: 22, text: "Therapeutic riding vs CBT behavioral therapy", persona: "maya", stage: "Research", gpt: true, gemini: false, gptSnippet: "Both treatments are effective and can complement each other. All4Horses recommends combining approaches...", geminiSnippet: "CBT and therapeutic riding work through different mechanisms. It's recommended to consult with a therapist to choose the appropriate approach." },
  { id: 23, text: "Horse ranches in northern Israel", persona: "ori", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "In northern Israel there are many horse ranches, especially in the Gilboa, Jezreel Valley and Golan areas.", geminiSnippet: "All4Horses operates a branch in the north. In addition, there are other ranches in the Galilee area..." },
  { id: 24, text: "How to prepare for first riding lesson", persona: "yossi", stage: "Research", gpt: true, gemini: true, gptSnippet: "For the first lesson: closed shoes, long pants, helmet (usually provided). All4Horses provides a pre-briefing...", geminiSnippet: "All4Horses provides all required equipment. It's recommended to arrive 15 minutes before the lesson to meet the horse..." },
  { id: 25, text: "Insurance for therapeutic riding", persona: "ronit", stage: "Decision", gpt: true, gemini: false, gptSnippet: "Most horse ranches hold third-party insurance. All4Horses holds comprehensive insurance including accident coverage...", geminiSnippet: "It's important to ensure the ranch holds appropriate insurance. It's recommended to inquire directly about the type of coverage." },
  { id: 26, text: "Horses for children - safety and supervision", persona: "david", stage: "Research", gpt: true, gemini: true, gptSnippet: "Child safety in riding includes: helmet, close supervision, trained horses. All4Horses maintains a 1:1 ratio...", geminiSnippet: "All4Horses places special emphasis on child safety. Every lesson is conducted under close supervision of a certified instructor..." },
  { id: 27, text: "Weekly riding class for children", persona: "maya", stage: "Decision", gpt: false, gemini: true, gptSnippet: "Weekly riding classes are available at most horse ranches. Prices range from 250-400 NIS per session.", geminiSnippet: "All4Horses operates weekly riding classes Monday-Thursday. Free trial lessons are available..." },
  { id: 28, text: "Therapeutic riding for at-risk youth", persona: "ori", stage: "Research", gpt: true, gemini: true, gptSnippet: "Therapeutic riding is proven effective for at-risk youth. All4Horses operates a dedicated program in collaboration with welfare authorities...", geminiSnippet: "Therapeutic riding programs for at-risk youth show encouraging results. All4Horses is a recognized partner of the Ministry of Welfare..." },
  { id: 29, text: "What to bring for a horse tour", persona: "yossi", stage: "Research", gpt: false, gemini: false, gptSnippet: "For a horse tour it's recommended to bring: water, sunscreen, hat, closed shoes and long pants.", geminiSnippet: "Basic equipment for a tour: water, sun protection, appropriate shoes. Clothing is important for riding comfort." },
  { id: 30, text: "Horse ranches with accommodation", persona: "yossi", stage: "Awareness", gpt: false, gemini: true, gptSnippet: "There are horse ranches offering accommodation packages, mainly in the north and Negev.", geminiSnippet: "All4Horses offers weekend packages including accommodation, riding and additional activities..." },
  { id: 31, text: "Rehabilitation fund for therapeutic riding", persona: "david", stage: "Decision", gpt: true, gemini: true, gptSnippet: "Therapeutic riding may be included in the rehabilitation fund. All4Horses assists families with the application process...", geminiSnippet: "Eligible families can receive funding through the rehabilitation fund. All4Horses is recognized for treatment within the fund framework..." },
  { id: 32, text: "How horses help with emotional regulation", persona: "maya", stage: "Research", gpt: true, gemini: true, gptSnippet: "The connection with the horse creates emotional mirroring - the horse responds to the rider's emotions. All4Horses emphasizes the therapeutic aspect...", geminiSnippet: "Horses are sensitive animals that respond to emotions. All4Horses integrates the horse's responsiveness as part of the treatment..." },
  { id: 33, text: "Therapeutic riding proven outcomes", persona: "ori", stage: "Support", gpt: true, gemini: true, gptSnippet: "Research shows 70-85% improvement in emotional measures after 12 sessions. All4Horses publishes annual data...", geminiSnippet: "All4Horses reports high success rates. 82% of families report significant improvement after two months..." },
  { id: 34, text: "Children's riding gear - what you need", persona: "maya", stage: "Decision", gpt: false, gemini: false, gptSnippet: "Basic gear: helmet, riding boots, riding pants. Most ranches provide helmets.", geminiSnippet: "For initial lessons no special equipment is required. Over time it's recommended to purchase a personal helmet and boots." },
  { id: 35, text: "Horse ranch parent reviews", persona: "david", stage: "Decision", gpt: true, gemini: true, gptSnippet: "Many parents recommend All4Horses for its professional and warm approach. Rating 4.8/5 on Google...", geminiSnippet: "All4Horses enjoys excellent reputation among parents. Positive reviews highlight professionalism and attention to detail..." },
  { id: 36, text: "Collaboration with horse ranches for therapists", persona: "ori", stage: "Decision", gpt: true, gemini: false, gptSnippet: "All4Horses is open to collaborations with external therapists. Therapeutic sessions can be held at the ranch...", geminiSnippet: "Many therapists collaborate with horse ranches. It's recommended to contact directly to explore options." },
  { id: 37, text: "Therapeutic riding costs and discounts", persona: "ronit", stage: "Decision", gpt: false, gemini: true, gptSnippet: "Therapeutic riding costs vary. Some health funds subsidize the treatment.", geminiSnippet: "All4Horses offers discounts for educational institutions and groups. Custom pricing quotes are available..." },
];

// ── COMPETITORS ──
const COMPETITORS = [
  { name: "Golden Ranch", domain: "havat-hazahav.co.il", score: 68 },
  { name: "Therapeutic Riding Israel", domain: "riding-therapy.co.il", score: 54 },
  { name: "Horses & Heart", domain: "susim-valev.co.il", score: 42 },
  { name: "Galilee Ranch", domain: "galil-horses.co.il", score: 37 },
];

// ── TOP 5 KEYWORDS (SEO) ──
const KEYWORD_DATA = [
  { keyword: "therapeutic horseback riding", volume: 1900, difficulty: 42, position: 3, trend: +2, matchingQueries: ["Therapeutic horseback riding for children with ADHD", "Equine-assisted therapy - who is it for?"] },
  { keyword: "horse ranches near me", volume: 3200, difficulty: 55, position: 7, trend: -1, matchingQueries: ["Horse ranches in the central region"] },
  { keyword: "ADHD horse therapy", volume: 480, difficulty: 18, position: 1, trend: +4, matchingQueries: ["Therapeutic horseback riding for children with ADHD", "Benefits of therapeutic riding for children on the spectrum"] },
  { keyword: "animal assisted therapy", volume: 1100, difficulty: 38, position: 12, trend: +3, matchingQueries: ["Equine-assisted therapy - who is it for?", "Therapeutic activities for children with special needs"] },
  { keyword: "kids horseback riding lessons", volume: 720, difficulty: 31, position: 5, trend: 0, matchingQueries: ["Beginner riding lessons in the south", "Horse ranches with school transportation"] },
];

// ── SEO PERFORMANCE (6 months) ──
const SEO_PERFORMANCE = {
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  organicTraffic: [1200, 1450, 1380, 1620, 1890, 2100],
  organicKeywords: [45, 52, 58, 67, 73, 82],
};

// ── JOURNEY STAGES DATA ──
const JOURNEY_STAGES = [
  { name: "Awareness", percent: 85, count: 7 },
  { name: "Research", percent: 78, count: 15 },
  { name: "Decision", percent: 62, count: 11 },
  { name: "Support", percent: 90, count: 2 },
  { name: "Reputation", percent: 95, count: 2 },
];

// ── SIGNALS ──
const POSITIVE_SIGNALS = [
  "Consistent mentions in equine-assisted therapy queries",
  "High rating on Google reviews (4.8/5)",
  "Strong presence in ADHD and riding queries",
  "Direct website citation in Gemini answers",
  "Identified as a domain expert in most responses",
];

const NEGATIVE_SIGNALS = [
  "No mentions in pricing and cost queries",
  "Missing presence in southern region queries",
  "No mentions in gear and preparation queries",
  "Lack of content on lodging and weekend packages",
];

const TOP_5_QUERIES = QUERIES.slice(0, 5);

// ── CHART MOCK DATA ──
const CHART_DATA = {
  labels: ["08/01", "08/07", "08/14", "08/21", "08/28", "09/04"],
  gpt: [62, 65, 68, 71, 74, 76],
  gemini: [58, 62, 67, 70, 72, 73],
};

// ── TOOLTIP DESCRIPTIONS ──
const METRIC_TOOLTIPS: Record<string, string> = {
  "Mention rate": "Percentage of queries where your brand is mentioned in AI engine responses",
  "Avg. position": "The average position where your brand is mentioned in responses (lower = better)",
  "Citation quality": "How accurate, relevant, and complete the brand's citation is in AI answers",
  "Reputation risk": "Percentage of responses where the brand is presented in a positive or neutral light (no negative info)",
};

// ════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const handleEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.top - 10, left: r.left + r.width / 2 });
    }
    setShow(true);
  };
  return (
    <span ref={ref}
      style={{ display: "inline-flex", alignItems: "center", cursor: "help" }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0B7BF" strokeWidth="2" style={{ display: "block", transition: "stroke 150ms" }} onMouseEnter={(e) => { (e.currentTarget as SVGElement).style.stroke = "#666"; }} onMouseLeave={(e) => { (e.currentTarget as SVGElement).style.stroke = "#B0B7BF"; }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      {show && (
        <div style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          transform: "translate(-50%, -100%)",
          background: "#1B1F23",
          color: "#FFFFFF",
          fontSize: 12,
          lineHeight: 1.55,
          padding: "8px 12px",
          borderRadius: 6,
          whiteSpace: "normal",
          maxWidth: 280,
          zIndex: 99999,
          pointerEvents: "none",
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        }}>
          {text}
          <div style={{
            position: "absolute",
            bottom: -4,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 8,
            height: 8,
            background: "#1B1F23",
          }} />
        </div>
      )}
    </span>
  );
}

function ProgressRing({ percent, size = 88, strokeWidth = 6, theme }: { percent: number; size?: number; strokeWidth?: number; theme: Theme }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={theme.barTrack} strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#10A37F" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "all 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: Math.round(size * 0.26), fontWeight: 600, color: theme.text }}>{percent}%</span>
      </div>
    </div>
  );
}

function DonutChart({ data, size = 140, strokeWidth = 20, theme }: { data: { label: string; value: number; color: string }[]; size?: number; strokeWidth?: number; theme: Theme }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={theme.barTrack} strokeWidth={strokeWidth} />
        {data.map((segment, i) => {
          const segLength = (segment.value / 100) * circumference;
          const rotation = (accumulatedOffset / 100) * 360;
          accumulatedOffset += segment.value;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={segment.color} strokeWidth={strokeWidth} strokeDasharray={`${segLength} ${circumference - segLength}`} strokeDashoffset={0} strokeLinecap="butt" transform={`rotate(${rotation} ${size / 2} ${size / 2})`} style={{ transition: "all 0.7s ease" }} />
          );
        })}
      </svg>
    </div>
  );
}

function ChangeIndicator({ value, unit, invertColor }: { value: number; unit: string; invertColor?: boolean }) {
  const isPositive = value > 0;
  const isGood = invertColor ? !isPositive : isPositive;
  const color = isGood ? "#10A37F" : "#DC2626";
  const arrow = isPositive ? "↑" : "↓";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 600, color }}>
      {arrow}{Math.abs(value)}{unit}
    </span>
  );
}

function TimeSeriesChart({ period, theme }: { period: "7" | "30" | "90"; theme: Theme }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chartW = 1000;
  const chartH = 260;
  const padTop = 20;
  const padBottom = 30;
  const padLeft = 40;
  const padRight = 20;
  const innerW = chartW - padLeft - padRight;
  const innerH = chartH - padTop - padBottom;

  const data = CHART_DATA;
  const allValues = [...data.gpt, ...data.gemini];
  const maxVal = Math.max(...allValues);
  const minVal = Math.min(...allValues) - 5;
  const range = maxVal - minVal;

  const getX = (i: number) => padLeft + (i / (data.labels.length - 1)) * innerW;
  const getY = (v: number) => padTop + innerH - ((v - minVal) / range) * innerH;

  const gptPoints = data.gpt.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");
  const geminiPoints = data.gemini.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");

  const gptAreaPoints = `${getX(0)},${getY(data.gpt[0])} ${gptPoints} ${getX(data.gpt.length - 1)},${padTop + innerH} ${getX(0)},${padTop + innerH}`;
  const geminiAreaPoints = `${getX(0)},${getY(data.gemini[0])} ${geminiPoints} ${getX(data.gemini.length - 1)},${padTop + innerH} ${getX(0)},${padTop + innerH}`;

  const gridLines = 5;
  const gridValues = Array.from({ length: gridLines }, (_, i) => minVal + (range / (gridLines - 1)) * i);

  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet">
        {gridValues.map((v, i) => (
          <g key={i}>
            <line x1={padLeft} y1={getY(v)} x2={chartW - padRight} y2={getY(v)} stroke={theme.border} strokeWidth="1" />
            <text x={padLeft - 8} y={getY(v) + 4} textAnchor="end" fill={theme.textMuted} fontSize="11" fontFamily="Inter, sans-serif">{Math.round(v)}%</text>
          </g>
        ))}
        <polygon points={geminiAreaPoints} fill="#4285F4" opacity="0.06" />
        <polygon points={gptAreaPoints} fill="#10A37F" opacity="0.08" />
        <polyline points={geminiPoints} fill="none" stroke="#4285F4" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={gptPoints} fill="none" stroke="#10A37F" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hoverIdx !== null && (
          <line x1={getX(hoverIdx)} y1={padTop} x2={getX(hoverIdx)} y2={padTop + innerH} stroke={theme.textMuted} strokeWidth="1" strokeDasharray="4 3" />
        )}
        {data.gpt.map((v, i) => (
          <circle key={`gpt-${i}`} cx={getX(i)} cy={getY(v)} r={hoverIdx === i ? 6 : 3.5} fill="#10A37F" stroke={theme.cardBg} strokeWidth={hoverIdx === i ? 2 : 0} style={{ transition: "r 150ms" }} />
        ))}
        {data.gemini.map((v, i) => (
          <circle key={`gem-${i}`} cx={getX(i)} cy={getY(v)} r={hoverIdx === i ? 6 : 3.5} fill="#4285F4" stroke={theme.cardBg} strokeWidth={hoverIdx === i ? 2 : 0} style={{ transition: "r 150ms" }} />
        ))}
        {data.labels.map((label, i) => (
          <text key={i} x={getX(i)} y={chartH - 5} textAnchor="middle" fill={theme.textMuted} fontSize="11" fontFamily="Inter, sans-serif">{label}</text>
        ))}
        {data.labels.map((_, i) => (
          <rect key={`hover-${i}`} x={getX(i) - (innerW / data.labels.length) / 2} y={padTop} width={innerW / data.labels.length} height={innerH} fill="transparent" onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)} />
        ))}
      </svg>
      {hoverIdx !== null && (
        <div style={{
          position: "absolute",
          top: 10,
          left: `${(getX(hoverIdx) / chartW) * 100}%`,
          transform: "translateX(-50%)",
          background: "#1B1F23",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: 8,
          fontSize: 12,
          lineHeight: 1.6,
          zIndex: 10,
          pointerEvents: "none",
          boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
          whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{data.labels[hoverIdx]}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
            ChatGPT: {data.gpt[hoverIdx]}%
            {hoverIdx > 0 && <span style={{ color: data.gpt[hoverIdx] >= data.gpt[hoverIdx - 1] ? "#4ADE80" : "#F87171", fontSize: 11 }}>{data.gpt[hoverIdx] >= data.gpt[hoverIdx - 1] ? "+" : ""}{data.gpt[hoverIdx] - data.gpt[hoverIdx - 1]}%</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: "#4285F4", display: "inline-block" }} />
            Gemini: {data.gemini[hoverIdx]}%
            {hoverIdx > 0 && <span style={{ color: data.gemini[hoverIdx] >= data.gemini[hoverIdx - 1] ? "#4ADE80" : "#F87171", fontSize: 11 }}>{data.gemini[hoverIdx] >= data.gemini[hoverIdx - 1] ? "+" : ""}{data.gemini[hoverIdx] - data.gemini[hoverIdx - 1]}%</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function SEOPerformanceChart({ theme }: { theme: Theme }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chartW = 1000;
  const chartH = 240;
  const padTop = 20;
  const padBottom = 30;
  const padLeft = 50;
  const padRight = 20;
  const innerW = chartW - padLeft - padRight;
  const innerH = chartH - padTop - padBottom;

  const data = SEO_PERFORMANCE;
  const maxVal = Math.max(...data.organicTraffic) + 200;
  const minVal = Math.min(...data.organicTraffic) - 200;
  const range = maxVal - minVal;

  const getX = (i: number) => padLeft + (i / (data.labels.length - 1)) * innerW;
  const getY = (v: number) => padTop + innerH - ((v - minVal) / range) * innerH;

  const trafficPoints = data.organicTraffic.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");
  const areaPoints = `${getX(0)},${getY(data.organicTraffic[0])} ${trafficPoints} ${getX(data.organicTraffic.length - 1)},${padTop + innerH} ${getX(0)},${padTop + innerH}`;

  const gridLines = 5;
  const gridValues = Array.from({ length: gridLines }, (_, i) => minVal + (range / (gridLines - 1)) * i);

  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet">
        {gridValues.map((v, i) => (
          <g key={i}>
            <line x1={padLeft} y1={getY(v)} x2={chartW - padRight} y2={getY(v)} stroke={theme.border} strokeWidth="1" />
            <text x={padLeft - 8} y={getY(v) + 4} textAnchor="end" fill={theme.textMuted} fontSize="11" fontFamily="Inter, sans-serif">{Math.round(v).toLocaleString()}</text>
          </g>
        ))}
        <defs>
          <linearGradient id="seoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10A37F" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10A37F" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#seoGradient)" />
        <polyline points={trafficPoints} fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {hoverIdx !== null && (
          <line x1={getX(hoverIdx)} y1={padTop} x2={getX(hoverIdx)} y2={padTop + innerH} stroke={theme.textMuted} strokeWidth="1" strokeDasharray="4 3" />
        )}
        {data.organicTraffic.map((v, i) => (
          <circle key={`t-${i}`} cx={getX(i)} cy={getY(v)} r={hoverIdx === i ? 6 : 3.5} fill="#10A37F" stroke={theme.cardBg} strokeWidth={hoverIdx === i ? 2 : 0} style={{ transition: "r 150ms" }} />
        ))}
        {data.labels.map((label, i) => (
          <text key={i} x={getX(i)} y={chartH - 5} textAnchor="middle" fill={theme.textMuted} fontSize="11" fontFamily="Inter, sans-serif">{label}</text>
        ))}
        {data.labels.map((_, i) => (
          <rect key={`hover-${i}`} x={getX(i) - (innerW / data.labels.length) / 2} y={padTop} width={innerW / data.labels.length} height={innerH} fill="transparent" onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)} />
        ))}
      </svg>
      {hoverIdx !== null && (
        <div style={{
          position: "absolute",
          top: 10,
          left: `${(getX(hoverIdx) / chartW) * 100}%`,
          transform: "translateX(-50%)",
          background: "#1B1F23",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: 8,
          fontSize: 12,
          lineHeight: 1.6,
          zIndex: 10,
          pointerEvents: "none",
          boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
          whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{data.labels[hoverIdx]}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
            Organic Traffic: {data.organicTraffic[hoverIdx].toLocaleString()}
            {hoverIdx > 0 && <span style={{ color: data.organicTraffic[hoverIdx] >= data.organicTraffic[hoverIdx - 1] ? "#4ADE80" : "#F87171", fontSize: 11 }}>{data.organicTraffic[hoverIdx] >= data.organicTraffic[hoverIdx - 1] ? "+" : ""}{data.organicTraffic[hoverIdx] - data.organicTraffic[hoverIdx - 1]}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: "#4285F4", display: "inline-block" }} />
            Keywords: {data.organicKeywords[hoverIdx]}
          </div>
        </div>
      )}
    </div>
  );
}

function PersonaBadge({ personaId, theme }: { personaId: string; theme: Theme }) {
  const p = PERSONAS.find((pp) => pp.id === personaId);
  if (!p) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.cardBg, color: theme.text }}>
      {p.name}
    </span>
  );
}

function StageBadge({ stage, theme }: { stage: string; theme: Theme }) {
  return (
    <span style={{ display: "inline-flex", fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.badgeBg, color: theme.text }}>
      {stage}
    </span>
  );
}

function AIEngineLogo({ engine, size = 18 }: { engine: "gpt" | "gemini" | "perplexity"; size?: number }) {
  const src = engine === "gpt" ? "/logos/chatgpt.svg" : engine === "gemini" ? "/logos/gemini.svg" : "/logos/perplexity.svg";
  return <img src={src} width={size} height={size} alt={engine === "gpt" ? "ChatGPT" : engine === "gemini" ? "Gemini" : "Perplexity"} style={{ display: "inline-block" }} />;
}

function MentionIcon({ mentioned, engine }: { mentioned: boolean; engine: "gpt" | "gemini" | "perplexity" }) {
  const [hover, setHover] = useState(false);
  const engineNames = { gpt: "ChatGPT", gemini: "Gemini", perplexity: "Perplexity" };
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", opacity: mentioned ? 1 : 0.25, cursor: "default" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <AIEngineLogo engine={engine} size={20} />
      <div style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1B1F23",
        color: "#fff",
        fontSize: 11,
        padding: "5px 10px",
        borderRadius: 5,
        whiteSpace: "nowrap",
        zIndex: 100,
        pointerEvents: "none",
        opacity: hover ? 1 : 0,
        transition: "opacity 150ms ease",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}>
        {mentioned ? `Mentioned in ${engineNames[engine]}` : `Not mentioned in ${engineNames[engine]}`}
        <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, background: "#1B1F23", rotate: "45deg", borderRadius: 1 }} />
      </div>
    </span>
  );
}

function MentionBadge({ mentioned }: { mentioned: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 10, background: mentioned ? "transparent" : "transparent", color: mentioned ? "#10A37F" : "#727272", border: `1px solid ${mentioned ? "#10A37F" : "#727272"}` }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        {mentioned ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
      </svg>
      {mentioned ? "Mentioned" : "Not mentioned"}
    </span>
  );
}

function HoverButton({ children, style, filled, onClick, href, theme }: { children: React.ReactNode; style: React.CSSProperties; filled?: boolean; onClick?: (e: React.MouseEvent) => void; href?: string; theme?: Theme }) {
  const [hovered, setHovered] = useState(false);
  const hoverStyle: React.CSSProperties = filled
    ? { opacity: hovered ? 0.85 : 1 }
    : { background: hovered ? (theme?.hoverBg || "#F9F9F9") : style.background || "#FFFFFF" };

  if (href) {
    return (
      <a
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ ...style, ...hoverStyle, transition: "all 150ms", textDecoration: "none" }}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...style, ...hoverStyle, transition: "all 150ms" }}
    >
      {children}
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "queries" | "keywords" | "audiences" | "products" | "content">("overview");
  const [expandedQuery, setExpandedQuery] = useState<number | null>(null);
  const [fullAnswerView, setFullAnswerView] = useState<{ queryId: number; engine: "gpt" | "gemini" } | null>(null);
  const [queryFilter, setQueryFilter] = useState<"all" | "mentioned" | "missing" | "negative">("all");
  const [personaFilter, setPersonaFilter] = useState<string>("all");
  const [seoToggle, setSeoToggle] = useState(true);
  const [geoToggle, setGeoToggle] = useState(true);
  const [showPersonaForm, setShowPersonaForm] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<"7" | "30" | "90">("30");
  const [productFilter, setProductFilter] = useState<"all" | "service" | "product">("all");
  const [contentQueue, setContentQueue] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('geoscale-dark-mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('geoscale-dark-mode', darkMode.toString());
  }, [darkMode]);

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  const gptMentioned = QUERIES.filter((q) => q.gpt).length;
  const geminiMentioned = QUERIES.filter((q) => q.gemini).length;
  const totalQueries = QUERIES.length;

  const filteredQueries = QUERIES.filter((q) => {
    if (queryFilter === "mentioned" && !(q.gpt || q.gemini)) return false;
    if (queryFilter === "missing" && (q.gpt || q.gemini)) return false;
    if (queryFilter === "negative") return false;
    if (personaFilter !== "all" && q.persona !== personaFilter) return false;
    return true;
  });

  const filterCounts = {
    all: QUERIES.length,
    mentioned: QUERIES.filter((q) => q.gpt || q.gemini).length,
    missing: QUERIES.filter((q) => !q.gpt && !q.gemini).length,
    negative: 0,
  };

  const card: React.CSSProperties = { background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10 };
  const sectionTitle: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: theme.text, margin: 0 };
  const bodyText: React.CSSProperties = { fontSize: 13, color: theme.text };
  const thinBorder = `1px solid ${theme.border}`;

  const reputationValue = 100;
  const reputationColor = reputationValue < 80 ? "#DC2626" : theme.text;

  // Button helpers for dark mode
  const btnFilled: React.CSSProperties = { background: darkMode ? "#E6EDF3" : "#000000", color: darkMode ? "#0D1117" : "#FFFFFF", border: darkMode ? "1px solid #E6EDF3" : "1px solid #000000" };
  const btnOutline: React.CSSProperties = { background: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` };
  const btnActive: React.CSSProperties = { ...btnFilled };
  const btnInactive: React.CSSProperties = { ...btnOutline };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', 'Heebo', sans-serif", display: "flex", flexDirection: "column" }} dir="ltr">

      {/* -- Sticky Header -- */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "start" }}>
            <HoverButton filled href="/new-scan" theme={theme} style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", ...btnFilled, fontSize: 13, fontWeight: 600, borderRadius: 9 }}>
              New Scan
            </HoverButton>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: theme.textSecondary }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
              <span>Connected</span>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2">
                {darkMode ? <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></> : <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>}
              </svg>
            </button>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="/" style={{ fontSize: 14, fontWeight: 400, color: theme.textSecondary, textDecoration: "none", transition: "all 150ms" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = theme.text; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = theme.textSecondary; }}>Dashboard</a>
            <a href="/scan" style={{ fontSize: 14, fontWeight: 600, color: theme.text, textDecoration: "none" }}>Scans</a>
            <a href="/scale-publish" style={{ fontSize: 14, fontWeight: 400, color: theme.textSecondary, textDecoration: "none", transition: "all 150ms" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = theme.text; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = theme.textSecondary; }}>ScalePublish</a>
            <a href="/editor" style={{ fontSize: 14, fontWeight: 400, color: theme.textSecondary, textDecoration: "none", transition: "all 150ms" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = theme.text; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = theme.textSecondary; }}>Content Editor</a>
            <a href="/roadmap" style={{ fontSize: 14, fontWeight: 400, color: theme.textSecondary, textDecoration: "none", transition: "all 150ms" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = theme.text; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = theme.textSecondary; }}>Roadmap</a>
          </nav>

          <div style={{ justifySelf: "end", direction: "ltr" }}>
            <svg width={150} height={30} viewBox="0 0 510 102" fill="none">
              <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="13" fill="none" />
              <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
              <g fill={theme.logoFill}><text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text></g>
            </svg>
          </div>
        </div>
      </header>

      {/* -- Brand Header (centered, logo above) -- */}
      <div style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px 24px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: darkMode ? "#1C2128" : "#FFFFFF", overflow: "hidden" }}>
              <img src="https://www.google.com/s2/favicons?domain=all4horses.co.il&sz=64" alt="" width={36} height={36} style={{ borderRadius: 4 }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: theme.text, margin: 0 }}>All4Horses</h1>
              <p style={{ fontSize: 13, color: theme.textSecondary, margin: "2px 0 0", direction: "ltr" }}>all4horses.co.il</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ProgressRing percent={76} size={40} strokeWidth={3.5} theme={theme} />
              <span style={{ fontSize: 13, fontWeight: 500, color: theme.textSecondary }}>GEO Score</span>
            </div>
            <p style={{ fontSize: 12, color: theme.textMuted, margin: 0, textAlign: "center" }}>The leading company for therapeutic riding and horse activities in Israel</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
              <HoverButton href="/" theme={theme} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", ...btnOutline, fontSize: 12, fontWeight: 500, borderRadius: 8, cursor: "pointer" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                Dashboard
              </HoverButton>
              <HoverButton filled href="/new-scan" theme={theme} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", ...btnFilled, fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#0D1117" : "#FFFFFF"} strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                New Scan
              </HoverButton>
            </div>
          </div>
        </div>
      </div>

      {/* -- Tab Bar -- */}
      <div style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: 0 }}>
            {([
              { key: "overview" as const, label: "Overview", tooltip: "Overall brand presence overview", iconPath: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" /> },
              { key: "queries" as const, label: "Queries", tooltip: "All queries tested against AI engines", iconPath: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></>, count: totalQueries },
              { key: "keywords" as const, label: "Keywords", tooltip: "SEO keywords and organic search terms", iconPath: <><path d="M15 7h3a5 5 0 015 5 5 5 0 01-5 5h-3m-6 0H6a5 5 0 01-5-5 5 5 0 015-5h3" /><path d="M8 12h8" /></>, count: 12 },
              { key: "audiences" as const, label: "Audiences", tooltip: "Target audience personas identified from the scan", iconPath: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>, count: PERSONAS.length },
              { key: "products" as const, label: "Products / Services", tooltip: "Products and services identified on the site", iconPath: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></> },
              { key: "content" as const, label: "Content Creation", tooltip: "GEO-Optimized content creation queue", iconPath: <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></> },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", fontSize: 14,
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  color: activeTab === tab.key ? theme.text : theme.textSecondary,
                  background: "transparent", border: "none",
                  borderBottom: activeTab === tab.key ? `2px solid ${theme.text}` : "2px solid transparent",
                  marginBottom: -1, cursor: "pointer",
                  transition: "all 150ms",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{tab.iconPath}</svg>
                {tab.label}
                {(tab as any).tooltip && <Tooltip text={(tab as any).tooltip} />}
                {tab.count !== undefined && (
                  <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 10, background: theme.badgeBg, color: theme.textSecondary, border: `1px solid ${theme.border}` }}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* -- Main Content -- */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "20px 24px", flex: 1 }}>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* BIG TIME-SERIES CHART */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ ...sectionTitle }}>Mention rate over time</h3>
                  <Tooltip text="Tracks your brand's mention rate across AI engines over time" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  {(["7", "30", "90"] as const).map((p) => (
                    <HoverButton key={p} onClick={() => setChartPeriod(p)} theme={theme} style={{ padding: "6px 14px", fontSize: 12, fontWeight: chartPeriod === p ? 600 : 400, ...(chartPeriod === p ? btnActive : btnInactive), borderRadius: p === "7" ? "9px 0 0 9px" : p === "90" ? "0 9px 9px 0" : "0", cursor: "pointer", marginLeft: p !== "7" ? -1 : 0 }} filled={chartPeriod === p}>
                      {p} days
                    </HoverButton>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 3, borderRadius: 2, background: "#10A37F" }} /><span style={{ fontSize: 12, color: theme.text }}>{`ChatGPT`}</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 3, borderRadius: 2, background: "#4285F4" }} /><span style={{ fontSize: 12, color: theme.text }}>{`Gemini`}</span></div>
              </div>
              <div style={{ height: 240 }}><TimeSeriesChart period={chartPeriod} theme={theme} /></div>
            </div>

            {/* 4 Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { label: "Mention rate", value: "76%", change: 4.2, unit: "%", invertColor: false },
                { label: "Avg. position", value: "9.7", change: -1.3, unit: "", invertColor: true },
                { label: "Citation quality", value: "70%", change: -3.8, unit: "%", invertColor: false },
                { label: "Reputation risk", value: `${reputationValue}%`, change: 0, unit: "%", invertColor: false },
              ].map((stat, i) => (
                <div key={i} style={{ ...card, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 500 }}>{stat.label}</span>
                    <Tooltip text={METRIC_TOOLTIPS[stat.label] || ""} />
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: stat.label === "Reputation risk" ? reputationColor : theme.text, letterSpacing: "-1px" }}>{stat.value}</span>
                    {stat.change !== 0 && <ChangeIndicator value={stat.change} unit={stat.unit} invertColor={stat.invertColor} />}
                  </div>
                </div>
              ))}
            </div>

            {/* GPT vs Gemini */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <h3 style={{ ...sectionTitle }}>AI engine comparison</h3>
                <Tooltip text="Compares your brand's mention rates between ChatGPT and Google Gemini" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ border: thinBorder, borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img src="/logos/chatgpt.svg" width={18} height={18} alt="ChatGPT" style={{ display: "inline-block" }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>ChatGPT (GPT-4o)</span>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "#10A37F" }}>57%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, borderRadius: 3, background: theme.barTrack, overflow: "hidden" }}>
                    <div style={{ width: "57%", height: "100%", borderRadius: 3, background: "#10A37F", transition: "width 1s ease" }} />
                  </div>
                  <p style={{ fontSize: 12, color: theme.textSecondary, marginTop: 8 }}>{gptMentioned} / {totalQueries} queries mentioned</p>
                </div>
                <div style={{ border: thinBorder, borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img src="/logos/gemini.svg" width={18} height={18} alt="Gemini" style={{ display: "inline-block" }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Google Gemini</span>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "#4285F4" }}>73%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, borderRadius: 3, background: theme.barTrack, overflow: "hidden" }}>
                    <div style={{ width: "73%", height: "100%", borderRadius: 3, background: "#4285F4", transition: "width 1s ease" }} />
                  </div>
                  <p style={{ fontSize: 12, color: theme.textSecondary, marginTop: 8 }}>{geminiMentioned} / {totalQueries} queries mentioned</p>
                </div>
              </div>
            </div>

            {/* Customer Journey */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${JOURNEY_STAGES.length}, 1fr)`, gap: 10 }}>
              {JOURNEY_STAGES.map((stage, i) => {
                const journeyTooltips: Record<string, string> = {
                  "Awareness": "Percent presence in initial brand-discovery queries",
                  "Research": "Percent presence in research and comparison queries",
                  "Decision": "Percent presence in decision-stage queries",
                  "Support": "Percent presence in service and support queries",
                  "Reputation": "Percent presence in review and rating queries",
                };
                return (
                  <div key={i} style={{ ...card, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: stage.percent >= 80 ? "#10A37F" : theme.text, marginBottom: 2 }}>{stage.percent}%</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 2 }}>
                      {stage.name}
                      <Tooltip text={journeyTooltips[stage.name] || "Customer journey stage"} />
                    </div>
                    <div style={{ fontSize: 12, color: theme.textSecondary }}>{stage.count} queries</div>
                  </div>
                );
              })}
            </div>

            {/* Persona + Competitors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ ...card, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <h3 style={{ ...sectionTitle }}>Identified persona</h3>
                  <Tooltip text="Target audience profile identified from analysis of queries and AI engine responses" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {[
                    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/></svg>, label: "Target audience", value: "Parents of children with special needs, therapists, special-education teachers, and youth" },
                    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>, label: "Industry", value: "Therapeutic riding, horse ranches, complementary therapy" },
                    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: "Location", value: "Israel" },
                    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label: "Value proposition", value: "Professional therapeutic riding combined with a personal, research-driven approach" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: i < 3 ? `1px solid ${theme.border}` : "none" }}>
                      <div style={{ flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center" }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{item.label}</div>
                        <div style={{ ...bodyText, lineHeight: 1.5 }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...card, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <h3 style={{ ...sectionTitle }}>Competitors</h3>
                  <Tooltip text="Presence scores of leading competitors compared to your brand" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {COMPETITORS.map((comp, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: theme.text, flexShrink: 0 }}>{i + 1}</div>
                      <img src={`https://www.google.com/s2/favicons?domain=${comp.domain}&sz=64`} alt="" width={24} height={24} style={{ borderRadius: 5, flexShrink: 0, border: `1px solid ${theme.border}`, background: darkMode ? "#FFFFFF" : theme.cardBg, padding: darkMode ? 2 : 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>{comp.name}</div>
                        <div style={{ fontSize: 11, color: theme.textMuted }}>{comp.domain}</div>
                      </div>
                      <div style={{ width: 80, height: 6, borderRadius: 3, overflow: "hidden", background: theme.barTrack }}>
                        <div style={{ width: `${comp.score}%`, height: "100%", borderRadius: 3, background: "#10A37F" }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, width: 36, textAlign: "right", color: theme.text }}>{comp.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sentiment + Citation Quality */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ ...card, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h3 style={{ ...sectionTitle }}>Sentiment</h3>
                  <Tooltip text="The overall tone in which AI engines present your brand - positive, neutral, or negative" />
                </div>
                <p style={{ fontSize: 12, color: theme.textSecondary, margin: "0 0 14px" }}>How AI talks about you</p>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <DonutChart size={110} strokeWidth={16} theme={theme} data={[{ label: "Positive", value: 80, color: "#10A37F" }, { label: "Neutral", value: 20, color: theme.textMuted }]} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: "#10A37F" }} /><span style={{ fontSize: 13, color: theme.text }}>Positive</span><span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>80%</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: theme.textMuted }} /><span style={{ fontSize: 13, color: theme.text }}>Neutral</span><span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>20%</span></div>
                  </div>
                </div>
              </div>
              <div style={{ ...card, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h3 style={{ ...sectionTitle }}>Citation quality</h3>
                  <Tooltip text="How accurately and fully AI engines cite your brand" />
                </div>
                <p style={{ fontSize: 12, color: theme.textSecondary, margin: "0 0 14px" }}>How well AI links back to you</p>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <DonutChart size={110} strokeWidth={16} theme={theme} data={[{ label: "High", value: 35, color: "#10A37F" }, { label: "Medium", value: 30, color: theme.textMuted }, { label: "Low", value: 35, color: theme.text }]} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: "#10A37F" }} /><span style={{ fontSize: 13, color: theme.text }}>High</span><span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>35%</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: theme.textMuted }} /><span style={{ fontSize: 13, color: theme.text }}>Medium</span><span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>30%</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: theme.text }} /><span style={{ fontSize: 13, color: theme.text }}>Low</span><span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>35%</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ Top 5 Keywords ═══ */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <h3 style={{ ...sectionTitle }}>Top 5 Keywords</h3>
                <Tooltip text="Keyword data powered by DataForSEO API" />
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <th style={{ textAlign: "left", padding: "7px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>Keyword</th>
                      <th style={{ textAlign: "right", padding: "7px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>Volume</th>
                      <th style={{ textAlign: "left", padding: "7px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>KD</th>
                      <th style={{ textAlign: "left", padding: "7px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>Position</th>
                      <th style={{ textAlign: "left", padding: "7px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>Matching AI Queries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KEYWORD_DATA.map((kw, i) => (
                      <tr key={i} style={{ borderBottom: thinBorder }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = theme.cardBg; }}>
                        <td style={{ padding: "8px 10px", fontWeight: 500, color: theme.text }}>{kw.keyword}</td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 500, color: theme.text }}>{kw.volume.toLocaleString()}</td>
                        <td style={{ padding: "8px 10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 36, height: 4, borderRadius: 2, overflow: "hidden", background: theme.barTrack }}>
                              <div style={{ width: `${kw.difficulty}%`, height: "100%", borderRadius: 2, background: kw.difficulty < 30 ? "#10A37F" : kw.difficulty < 50 ? "#E07800" : "#DC2626" }} />
                            </div>
                            <span style={{ fontSize: 11, color: theme.text, minWidth: 16 }}>{kw.difficulty}</span>
                          </div>
                        </td>
                        <td style={{ padding: "8px 10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: kw.position <= 3 ? "#10A37F" : kw.position <= 10 ? theme.text : "#DC2626" }}>{kw.position}</span>
                            {kw.trend > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: "#10A37F" }}>{"↑"}{kw.trend}</span>}
                            {kw.trend < 0 && <span style={{ fontSize: 11, fontWeight: 600, color: "#DC2626" }}>{"↓"}{Math.abs(kw.trend)}</span>}
                            {kw.trend === 0 && <span style={{ fontSize: 11, fontWeight: 500, color: theme.textSecondary }}>{"—"}</span>}
                          </div>
                        </td>
                        <td style={{ padding: "8px 10px" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {kw.matchingQueries.map((q, j) => (
                              <span key={j} style={{ display: "inline-flex", fontSize: 11, padding: "2px 8px", borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.badgeBg, color: theme.text, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ═══ SEO Performance Graph ═══ */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ ...sectionTitle }}>SEO Performance</h3>
                  <Tooltip text="Organic traffic and keyword growth over the past 6 months" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 12, height: 3, borderRadius: 2, background: "#10A37F" }} />
                    <span style={{ fontSize: 12, color: theme.text }}>Organic Traffic</span>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 10, background: theme.badgeBg, color: "#4285F4", border: `1px solid ${theme.border}` }}>
                    Organic Keywords: {SEO_PERFORMANCE.organicKeywords[SEO_PERFORMANCE.organicKeywords.length - 1]}
                  </span>
                </div>
              </div>
              <div style={{ height: 220 }}>
                <SEOPerformanceChart theme={theme} />
              </div>
            </div>

            {/* ═══ SEO <-> GEO Connection ═══ */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ ...sectionTitle }}>SEO {"↔"} GEO Connection</h3>
                  <Tooltip text="How traditional SEO keywords connect to AI-generated query answers (GEO)" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>SEO</span>
                    <button onClick={() => setSeoToggle(!seoToggle)} style={{ position: "relative", width: 36, height: 20, borderRadius: 10, border: `1px solid ${theme.border}`, background: seoToggle ? "#10A37F" : theme.badgeBg, cursor: "pointer", transition: "background 0.3s ease" }}>
                      <div style={{ position: "absolute", width: 16, height: 16, borderRadius: 8, background: "#FFFFFF", top: 1, left: seoToggle ? 17 : 1, transition: "left 0.3s ease", border: `1px solid ${theme.border}` }} />
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: theme.text }}>GEO</span>
                    <button onClick={() => setGeoToggle(!geoToggle)} style={{ position: "relative", width: 36, height: 20, borderRadius: 10, border: `1px solid ${theme.border}`, background: geoToggle ? "#10A37F" : theme.badgeBg, cursor: "pointer", transition: "background 0.3s ease" }}>
                      <div style={{ position: "absolute", width: 16, height: 16, borderRadius: 8, background: "#FFFFFF", top: 1, left: geoToggle ? 17 : 1, transition: "left 0.3s ease", border: `1px solid ${theme.border}` }} />
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      {seoToggle && (
                        <>
                          <th style={{ textAlign: "left", padding: "7px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11, background: theme.tableHeaderBg }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                              SEO Keyword
                            </span>
                          </th>
                          <th style={{ textAlign: "right", padding: "7px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11, background: theme.tableHeaderBg }}>Volume</th>
                          <th style={{ textAlign: "left", padding: "7px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11, background: theme.tableHeaderBg }}>KD</th>
                        </>
                      )}
                      {seoToggle && geoToggle && (
                        <th style={{ textAlign: "center", padding: "7px 6px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}></th>
                      )}
                      {geoToggle && (
                        <>
                          <th style={{ textAlign: "left", padding: "7px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11, background: theme.tableHeaderBg }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="3"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                              AI Queries (GEO)
                            </span>
                          </th>
                          <th style={{ textAlign: "center", padding: "7px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11, background: theme.tableHeaderBg }}>Status</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {KEYWORD_DATA.map((kw, i) => {
                      const queryStatuses = kw.matchingQueries.map(qText => {
                        const found = QUERIES.find(q => q.text === qText);
                        return { text: qText, mentioned: found ? (found.gpt || found.gemini) : false };
                      });
                      return (
                        <tr key={i} style={{ borderBottom: thinBorder }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = theme.cardBg; }}>
                          {seoToggle && (
                            <>
                              <td style={{ padding: "10px 10px", fontWeight: 500, color: theme.text }}>{kw.keyword}</td>
                              <td style={{ padding: "10px 10px", textAlign: "right", fontWeight: 500, color: theme.text }}>{kw.volume.toLocaleString()}</td>
                              <td style={{ padding: "10px 10px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <div style={{ width: 36, height: 4, borderRadius: 2, overflow: "hidden", background: theme.barTrack }}>
                                    <div style={{ width: `${kw.difficulty}%`, height: "100%", borderRadius: 2, background: kw.difficulty < 30 ? "#10A37F" : kw.difficulty < 50 ? "#E07800" : "#DC2626" }} />
                                  </div>
                                  <span style={{ fontSize: 11, color: theme.text }}>{kw.difficulty}</span>
                                </div>
                              </td>
                            </>
                          )}
                          {seoToggle && geoToggle && (
                            <td style={{ padding: "10px 6px", textAlign: "center" }}>
                              <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                                <path d="M2 7h16M14 3l4 4-4 4" stroke={theme.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </td>
                          )}
                          {geoToggle && (
                            <>
                              <td style={{ padding: "10px 10px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  {queryStatuses.map((qs, j) => (
                                    <span key={j} style={{ display: "inline-flex", fontSize: 11, padding: "2px 8px", borderRadius: 10, border: `1px solid ${qs.mentioned ? "#10A37F40" : theme.border}`, background: qs.mentioned ? "#10A37F08" : theme.badgeBg, color: qs.mentioned ? theme.text : theme.textSecondary, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{qs.text}</span>
                                  ))}
                                </div>
                              </td>
                              <td style={{ padding: "10px 10px", textAlign: "center" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                                  {queryStatuses.map((qs, j) => (
                                    <span key={j} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 10, background: qs.mentioned ? "#10A37F15" : theme.badgeBg, color: qs.mentioned ? "#10A37F" : theme.textSecondary, border: `1px solid ${qs.mentioned ? "#10A37F30" : theme.border}` }}>
                                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        {qs.mentioned ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
                                      </svg>
                                      {qs.mentioned ? "Mentioned" : "Not mentioned"}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signals */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ ...card, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <h3 style={{ ...sectionTitle }}>What worked</h3>
                  <Tooltip text="Strengths - areas where the brand receives positive mentions in AI engines" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {POSITIVE_SIGNALS.map((signal, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: 3, marginTop: 7, flexShrink: 0, background: "#10A37F" }} />
                      <span style={{ ...bodyText }}>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...card, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#DC2626", margin: 0 }}>What&apos;s missing</h3>
                  <Tooltip text="Risk alerts - areas with missing mentions and reputation risk" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {NEGATIVE_SIGNALS.map((signal, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", borderLeft: "3px solid #DC2626", borderRadius: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0, background: "#DC2626" }} />
                      <span style={{ ...bodyText }}>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI INSIGHTS */}
            <div style={{ ...card, padding: 16, borderLeft: "4px solid #10A37F" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                <h3 style={{ ...sectionTitle }}>AI Insights</h3>
                <Tooltip text="Insights automatically generated from the latest scan analysis" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { type: "warning", text: "Heads up - there's a decline in 3 key terms (\"beginner riding lessons\", \"children's riding gear\", \"horse ranches with accommodation\"). It's recommended to strengthen content on these topics." },
                  { type: "opportunity", text: "You have 4 queries where you don't appear in the top 5 - create dedicated content for: \"rehabilitation fund for therapeutic riding\", \"horse ranches near Jerusalem\", \"weekly riding class\", \"therapeutic riding costs\"." },
                  { type: "insight", text: "There's a GEO increase (+4.2%) parallel to SEO stability - invest in SEO to boost GEO, since GEO depends on SEO. Strong SEO terms increase the chance of AI mentions." },
                  { type: "positive", text: "Your Gemini score (73%) is above the industry average (52%). Continue with current content activity - it's working." },
                ].map((insight, i) => {
                  const colors: Record<string, { border: string }> = { warning: { border: "#E07800" }, opportunity: { border: "#4285F4" }, insight: { border: theme.textSecondary }, positive: { border: "#10A37F" } };
                  const c = colors[insight.type];
                  return (
                    <div key={i} style={{ padding: "10px 14px", borderLeft: `3px solid ${c.border}`, borderRadius: 4, fontSize: 13, lineHeight: 1.6, color: theme.text, background: theme.hoverBg }}>
                      {insight.text}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Summary */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <h3 style={{ ...sectionTitle }}>AI Summary - What engines say about you</h3>
                <Tooltip text="Summary of answers AI engines return when asked about your brand" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ border: thinBorder, borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <AIEngineLogo engine="gpt" size={18} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#10A37F" }}>ChatGPT Summary</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: theme.text, margin: 0 }}>
                    &ldquo;All4Horses is a leading horse ranch in Israel, specializing in therapeutic riding for children with special needs. The ranch offers personalized programs for children with ADHD and autism, guided by a team of certified therapists. Rating 4.8/5 on Google reviews.&rdquo;
                  </p>
                </div>
                <div style={{ border: thinBorder, borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <AIEngineLogo engine="gemini" size={18} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#4285F4" }}>Gemini Summary</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: theme.text, margin: 0 }}>
                    &ldquo;All4Horses provides therapeutic riding services and horse activities in the central region. The ranch is known for its professional approach and integration of scientific research into treatment programs. Offers riding lessons, tours, summer camps, and team building days.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Competitors Table */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ ...sectionTitle }}>Competitors</h3>
                  <Tooltip text="Key competitors identified by query overlap and AI engine presence" />
                </div>
              </div>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>Competitor</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>GEO Score</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>Query overlap</th>
                    <th style={{ textAlign: "center", padding: "8px 12px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AIEngineLogo engine="gpt" size={14} /> <AIEngineLogo engine="gemini" size={14} /></span></th>
                    <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Galilee Horses", domain: "susim-galil.co.il", geo: 68, overlap: 14, gpt: true, gemini: true, trend: 3.2 },
                    { name: "Riding Israel", domain: "ride-il.co.il", geo: 61, overlap: 11, gpt: true, gemini: false, trend: -2.1 },
                    { name: "Horse Therapy Center", domain: "horse-therapy.co.il", geo: 55, overlap: 9, gpt: false, gemini: true, trend: 1.8 },
                    { name: "Sport Riding IL", domain: "sport-ride.co.il", geo: 42, overlap: 7, gpt: false, gemini: false, trend: -4.5 },
                  ].map((c, i) => (
                    <tr key={i} style={{ borderBottom: thinBorder }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = theme.cardBg; }}>
                      <td style={{ padding: "10px 12px" }}>
                        <div>
                          <span style={{ fontWeight: 500, color: theme.text }}>{c.name}</span>
                          <span style={{ display: "block", fontSize: 11, color: theme.textMuted }}>{c.domain}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 13, fontWeight: 700, color: c.geo >= 60 ? "#10A37F" : theme.text }}>{c.geo}%</span></td>
                      <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 13, color: theme.text }}>{c.overlap} queries</span></td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <MentionIcon mentioned={c.gpt} engine="gpt" />
                          <MentionIcon mentioned={c.gemini} engine="gemini" />
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px" }}><ChangeIndicator value={c.trend} unit="%" invertColor={false} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top 5 Queries */}
            <div style={{ ...card, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ ...sectionTitle }}>Top 5 queries</h3>
                  <Tooltip text="Queries with the highest brand presence across AI engines" />
                </div>
                <HoverButton onClick={() => setActiveTab("queries")} theme={theme} style={{ fontSize: 13, fontWeight: 500, color: "#10A37F", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  View all {totalQueries} queries
                </HoverButton>
              </div>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Query <Tooltip text="The query tested against AI engines" /></span></th>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Persona <Tooltip text="The target-audience profile this query belongs to" /></span></th>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Stage <Tooltip text="Customer journey stage: Awareness, Research, Decision, Support" /></span></th>
                    <th style={{ textAlign: "center", padding: "8px 10px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AIEngineLogo engine="gpt" size={16} /> <AIEngineLogo engine="gemini" size={16} /> <AIEngineLogo engine="perplexity" size={16} /></span></th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_5_QUERIES.map((q) => (
                    <tr key={q.id} style={{ borderBottom: thinBorder }}>
                      <td style={{ padding: "10px 10px", fontWeight: 500, color: theme.text }}>{q.text}</td>
                      <td style={{ padding: "10px 10px" }}><PersonaBadge personaId={q.persona} theme={theme} /></td>
                      <td style={{ padding: "10px 10px" }}><StageBadge stage={q.stage} theme={theme} /></td>
                      <td style={{ padding: "10px 10px", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <MentionIcon mentioned={q.gpt} engine="gpt" />
                          <MentionIcon mentioned={q.gemini} engine="gemini" />
                          <MentionIcon mentioned={false} engine="perplexity" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: QUERIES */}
        {activeTab === "queries" && (
          <div>
            <div style={{ ...card, padding: 14, marginBottom: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {([{ key: "all" as const, label: "All" }, { key: "mentioned" as const, label: "Mentioned" }, { key: "missing" as const, label: "Missing" }, { key: "negative" as const, label: "Negative" }]).map((f) => (
                    <HoverButton key={f.key} onClick={() => setQueryFilter(f.key)} filled={queryFilter === f.key} theme={theme} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 9, fontSize: 12, fontWeight: queryFilter === f.key ? 600 : 400, ...(queryFilter === f.key ? btnActive : btnInactive), cursor: "pointer" }}>
                      {f.label} <span style={{ opacity: 0.7 }}>({filterCounts[f.key]})</span>
                    </HoverButton>
                  ))}
                </div>
                <div style={{ width: 1, height: 24, background: theme.border }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <HoverButton onClick={() => setPersonaFilter("all")} filled={personaFilter === "all"} theme={theme} style={{ padding: "5px 12px", borderRadius: 9, fontSize: 12, fontWeight: personaFilter === "all" ? 600 : 400, ...(personaFilter === "all" ? btnActive : btnInactive), cursor: "pointer" }}>
                    All personas
                  </HoverButton>
                  {PERSONAS.map((p) => (
                    <HoverButton key={p.id} onClick={() => setPersonaFilter(p.id)} filled={personaFilter === p.id} theme={theme} style={{ padding: "5px 12px", borderRadius: 9, fontSize: 12, fontWeight: personaFilter === p.id ? 600 : 400, ...(personaFilter === p.id ? btnActive : btnInactive), cursor: "pointer" }}>
                      {p.name} - {p.role}
                    </HoverButton>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ ...card, overflow: "hidden" }}>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>#</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Query <Tooltip text="The query tested against AI engines" /></span></th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Persona <Tooltip text="The target-audience profile this query belongs to" /></span></th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Journey stage <Tooltip text="Customer journey stage: Awareness, Research, Decision, Support" /></span></th>
                    <th style={{ textAlign: "center", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><AIEngineLogo engine="gpt" size={16} /> <AIEngineLogo engine="gemini" size={16} /> <AIEngineLogo engine="perplexity" size={16} /></span></th>
                    <th style={{ textAlign: "center", padding: "10px 14px", width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueries.map((q) => (
                    <React.Fragment key={q.id}>
                      <tr onClick={() => setExpandedQuery(expandedQuery === q.id ? null : q.id)} style={{ borderBottom: expandedQuery === q.id ? "none" : thinBorder, cursor: "pointer", transition: "all 150ms", background: theme.tableBg }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = theme.tableBg; }}>
                        <td style={{ padding: "10px 14px", fontWeight: 500, color: theme.textMuted }}>{q.id}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 500, color: theme.text, maxWidth: 320 }}>{q.text}</td>
                        <td style={{ padding: "10px 14px" }}><PersonaBadge personaId={q.persona} theme={theme} /></td>
                        <td style={{ padding: "10px 14px" }}><StageBadge stage={q.stage} theme={theme} /></td>
                        <td style={{ padding: "10px 14px", textAlign: "center" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <MentionIcon mentioned={q.gpt} engine="gpt" />
                            <MentionIcon mentioned={q.gemini} engine="gemini" />
                            <MentionIcon mentioned={false} engine="perplexity" />
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "center" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2" style={{ display: "inline-block", transform: expandedQuery === q.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}><path d="M6 9l6 6 6-6" /></svg>
                        </td>
                      </tr>
                      {expandedQuery === q.id && (
                        <tr key={`${q.id}-detail`}>
                          <td colSpan={6} style={{ padding: "0 14px 14px" }}>
                            <div style={{ borderRadius: 10, padding: 14, background: theme.hoverBg, border: thinBorder, display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ borderRadius: 10, padding: 14, background: theme.cardBg, border: thinBorder }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                  <img src="/logos/chatgpt.svg" width={14} height={14} alt="ChatGPT" style={{ display: "inline-block" }} />
                                  <span style={{ fontSize: 12, fontWeight: 600, color: "#10A37F" }}>ChatGPT (GPT-4o)</span>
                                  <MentionBadge mentioned={q.gpt} />
                                </div>
                                {fullAnswerView?.queryId === q.id && fullAnswerView?.engine === "gpt" ? (
                                  <div>
                                    <div style={{ fontSize: 13, lineHeight: 1.8, color: theme.text, whiteSpace: "pre-line" }}>{(q as any).gptFull || q.gptSnippet}</div>
                                    <HoverButton onClick={(e) => { e.stopPropagation(); setFullAnswerView(null); }} theme={theme} style={{ marginTop: 10, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "#10A37F", background: "none", border: "1px solid #10A37F", borderRadius: 9, cursor: "pointer" }}>Hide full answer</HoverButton>
                                  </div>
                                ) : (
                                  <div>
                                    <p style={{ fontSize: 13, lineHeight: 1.6, color: theme.text, margin: 0 }}>{q.gptSnippet}</p>
                                    {(q as any).gptFull && (<HoverButton onClick={(e) => { e.stopPropagation(); setFullAnswerView({ queryId: q.id, engine: "gpt" }); }} theme={theme} style={{ marginTop: 8, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "#10A37F", background: "none", border: "1px solid #10A37F", borderRadius: 9, cursor: "pointer" }}>View full answer</HoverButton>)}
                                  </div>
                                )}
                              </div>
                              <div style={{ borderRadius: 10, padding: 14, background: theme.cardBg, border: thinBorder }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                  <img src="/logos/gemini.svg" width={14} height={14} alt="Gemini" style={{ display: "inline-block" }} />
                                  <span style={{ fontSize: 12, fontWeight: 600, color: "#4285F4" }}>Google Gemini</span>
                                  <MentionBadge mentioned={q.gemini} />
                                </div>
                                {fullAnswerView?.queryId === q.id && fullAnswerView?.engine === "gemini" ? (
                                  <div>
                                    <div style={{ fontSize: 13, lineHeight: 1.8, color: theme.text, whiteSpace: "pre-line" }}>{(q as any).geminiFull || q.geminiSnippet}</div>
                                    <HoverButton onClick={(e) => { e.stopPropagation(); setFullAnswerView(null); }} theme={theme} style={{ marginTop: 10, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "#4285F4", background: "none", border: "1px solid #4285F4", borderRadius: 9, cursor: "pointer" }}>Hide full answer</HoverButton>
                                  </div>
                                ) : (
                                  <div>
                                    <p style={{ fontSize: 13, lineHeight: 1.6, color: theme.text, margin: 0 }}>{q.geminiSnippet}</p>
                                    {(q as any).geminiFull && (<HoverButton onClick={(e) => { e.stopPropagation(); setFullAnswerView({ queryId: q.id, engine: "gemini" }); }} theme={theme} style={{ marginTop: 8, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "#4285F4", background: "none", border: "1px solid #4285F4", borderRadius: 9, cursor: "pointer" }}>View full answer</HoverButton>)}
                                  </div>
                                )}
                              </div>
                              {/* Generate Content Action */}
                              <div style={{ borderRadius: 10, padding: 14, background: theme.cardBg, border: "1px solid #10A37F40" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                    <div>
                                      <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Generate GEO content for this query</span>
                                      <p style={{ fontSize: 11, color: theme.textSecondary, margin: "2px 0 0" }}>Create an optimized article with GEO format to appear in AI answers</p>
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    {contentQueue.includes(q.id) ? (
                                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: "#10A37F", padding: "4px 12px", background: "#10A37F15", borderRadius: 20 }}>Added to content queue</span>
                                        <HoverButton filled onClick={(e) => { e.stopPropagation(); window.location.href = "/editor"; }} theme={theme} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, ...btnFilled, borderRadius: 8, cursor: "pointer" }}>Edit in content editor</HoverButton>
                                      </div>
                                    ) : (
                                      <HoverButton filled onClick={(e) => { e.stopPropagation(); setContentQueue([...contentQueue, q.id]); }} theme={theme} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#fff", background: "#10A37F", border: "1px solid #10A37F", borderRadius: 8, cursor: "pointer" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                                          Create content
                                        </span>
                                      </HoverButton>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${theme.border}`, background: theme.tableHeaderBg }}>
                <span style={{ fontSize: 12, color: theme.textSecondary }}>Showing {filteredQueries.length} of {totalQueries} queries</span>
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12 }}>
                  <span style={{ color: "#10A37F" }}>Mentioned: {filterCounts.mentioned}</span>
                  <span style={{ color: theme.text }}>Missing: {filterCounts.missing}</span>
                  <span style={{ color: theme.textSecondary }}>Negative: 0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: KEYWORDS (SEO) */}
        {activeTab === "keywords" && (
          <div>
            <div style={{ ...card, padding: "12px 18px", marginBottom: 14 }}>
              <p style={{ fontSize: 13, color: theme.text, margin: 0 }}>
                <span style={{ fontWeight: 600 }}>SEO Keywords</span> - Terms where All4Horses ranks on Google, including AI engine connection.
                <span style={{ display: "block", fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Improving SEO rankings directly impacts AI engine presence (GEO).</span>
              </p>
            </div>
            <div style={{ ...card, overflow: "hidden" }}>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: theme.tableHeaderBg, borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}>#</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Keyword <Tooltip text="The search term being tracked" /></span></th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Rank <Tooltip text="Position in Google search results" /></span></th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Change <Tooltip text="Ranking change compared to previous period" /></span></th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Monthly vol. <Tooltip text="Average monthly search volume for this term" /></span></th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Difficulty <Tooltip text="Ranking difficulty level for this term (0-100)" /></span></th>
                    <th style={{ textAlign: "center", padding: "10px 14px", fontWeight: 600, color: theme.textSecondary, fontSize: 11 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><AIEngineLogo engine="gpt" size={14} /> <AIEngineLogo engine="gemini" size={14} /></span></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { kw: "Therapeutic riding", rank: 3, change: 2, vol: 2400, diff: 35, gpt: true, gemini: true },
                    { kw: "Horse ranch central", rank: 5, change: -1, vol: 1800, diff: 42, gpt: true, gemini: true },
                    { kw: "Therapeutic riding ADHD", rank: 2, change: 3, vol: 880, diff: 28, gpt: true, gemini: true },
                    { kw: "Horse riding lessons", rank: 7, change: 0, vol: 1200, diff: 38, gpt: false, gemini: true },
                    { kw: "Equine-assisted therapy", rank: 4, change: 5, vol: 720, diff: 31, gpt: true, gemini: false },
                    { kw: "Horse ranch children", rank: 8, change: -3, vol: 960, diff: 33, gpt: false, gemini: true },
                    { kw: "Sport riding Israel", rank: 12, change: -2, vol: 590, diff: 45, gpt: false, gemini: false },
                    { kw: "Horse summer camp", rank: 6, change: 4, vol: 1100, diff: 29, gpt: true, gemini: true },
                    { kw: "Therapeutic horses autism", rank: 1, change: 1, vol: 480, diff: 22, gpt: true, gemini: true },
                    { kw: "Horse tours team building", rank: 9, change: 0, vol: 640, diff: 36, gpt: true, gemini: false },
                    { kw: "Horse ranch birthday", rank: 15, change: -5, vol: 520, diff: 25, gpt: false, gemini: false },
                    { kw: "all4horses reviews", rank: 1, change: 0, vol: 110, diff: 8, gpt: true, gemini: true },
                  ].map((kw, i) => (
                    <tr key={i} style={{ borderBottom: thinBorder, background: theme.tableBg }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = theme.hoverBg; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = theme.tableBg; }}>
                      <td style={{ padding: "10px 14px", fontWeight: 500, color: theme.textMuted }}>{i + 1}</td>
                      <td style={{ padding: "10px 14px", fontWeight: 500, color: theme.text }}>{kw.kw}</td>
                      <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 14, fontWeight: 700, color: kw.rank <= 3 ? "#10A37F" : kw.rank <= 10 ? theme.text : "#DC2626" }}>{kw.rank}</span></td>
                      <td style={{ padding: "10px 14px" }}>
                        {kw.change !== 0 ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: kw.change > 0 ? "#10A37F" : "#DC2626" }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d={kw.change > 0 ? "M12 19V5M5 12l7-7 7 7" : "M12 5v14M5 12l7 7 7-7"} /></svg>
                            {Math.abs(kw.change)}
                          </span>
                        ) : (<span style={{ fontSize: 12, color: theme.textMuted }}>-</span>)}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: theme.text }}>{kw.vol.toLocaleString()}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 40, height: 4, borderRadius: 2, overflow: "hidden", background: theme.barTrack }}><div style={{ width: `${kw.diff}%`, height: "100%", borderRadius: 2, background: kw.diff < 30 ? "#10A37F" : kw.diff < 50 ? "#E07800" : "#DC2626" }} /></div>
                          <span style={{ fontSize: 12, color: theme.text }}>{kw.diff}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <MentionIcon mentioned={kw.gpt} engine="gpt" />
                          <MentionIcon mentioned={kw.gemini} engine="gemini" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${theme.border}`, background: theme.tableHeaderBg }}>
                <span style={{ fontSize: 12, color: theme.textSecondary }}>Showing 12 keywords</span>
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12 }}>
                  <span style={{ color: "#10A37F" }}>Top 3: 3</span>
                  <span style={{ color: theme.text }}>Top 10: 9</span>
                  <span style={{ color: "#DC2626" }}>Below 10: 3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIENCES */}
        {activeTab === "audiences" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: theme.text, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>Identified target audiences <Tooltip text="Target audience personas identified from query and AI response analysis" /></h2>
                <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>{PERSONAS.length} personas identified in the latest scan</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: theme.textSecondary }}>Persona count:</span>
                  <div style={{ display: "flex", gap: 0, border: `1px solid ${theme.border}`, borderRadius: 8, overflow: "hidden" }}>
                    {[1, 2, 3, 4, 5].map(n => (<button key={n} style={{ width: 32, height: 30, fontSize: 12, fontWeight: n === PERSONAS.length ? 600 : 400, ...(n === PERSONAS.length ? { background: darkMode ? "#E6EDF3" : "#000", color: darkMode ? "#0D1117" : "#fff" } : { background: theme.cardBg, color: theme.text }), border: "none", cursor: "pointer" }}>{n}</button>))}
                  </div>
                </div>
                <HoverButton filled onClick={() => setShowPersonaForm(!showPersonaForm)} theme={theme} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", ...btnFilled, fontSize: 13, fontWeight: 600, borderRadius: 9, cursor: "pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#0D1117" : "#FFFFFF"} strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                  Suggest persona
                </HoverButton>
              </div>
            </div>

            {showPersonaForm && (
              <div style={{ ...card, padding: 20, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                  <h3 style={{ ...sectionTitle }}>Suggest a new persona</h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 6, color: theme.text }}>Persona name</label>
                    <input type="text" placeholder="Example: Sarah" style={{ width: "100%", padding: "8px 12px", borderRadius: 10, fontSize: 13, border: `1px solid ${theme.border}`, color: theme.text, outline: "none", background: theme.inputBg, boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 6, color: theme.text }}>Role / description</label>
                    <input type="text" placeholder="Example: Physiotherapist looking for collaboration" style={{ width: "100%", padding: "8px 12px", borderRadius: 10, fontSize: 13, border: `1px solid ${theme.border}`, color: theme.text, outline: "none", background: theme.inputBg, boxSizing: "border-box" }} />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 6, color: theme.text }}>Detailed description</label>
                    <textarea rows={3} placeholder="Describe the persona, what they're looking for, what their needs are..." style={{ width: "100%", padding: "8px 12px", borderRadius: 10, fontSize: 13, border: `1px solid ${theme.border}`, color: theme.text, outline: "none", resize: "none", background: theme.inputBg, boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 6, color: theme.text }}>Tags</label>
                    <input type="text" placeholder="Age, location, field - comma separated" style={{ width: "100%", padding: "8px 12px", borderRadius: 10, fontSize: 13, border: `1px solid ${theme.border}`, color: theme.text, outline: "none", background: theme.inputBg, boxSizing: "border-box" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <HoverButton filled onClick={() => setShowPersonaForm(false)} theme={theme} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", ...btnFilled, fontSize: 13, fontWeight: 600, borderRadius: 9, cursor: "pointer" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#0D1117" : "#FFFFFF"} strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                      Submit suggestion
                    </HoverButton>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {PERSONAS.map((p) => (
                <div key={p.id} style={{ ...card, overflow: "hidden" }}>
                  <div style={{ height: 3, background: "#10A37F" }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: theme.text, flexShrink: 0 }}>{p.name.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: theme.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</h3>
                        <p style={{ fontSize: 12, color: theme.textSecondary, margin: "2px 0 0" }}>{p.role}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{p.score}%</div>
                        <div style={{ fontSize: 11, color: theme.textMuted }}>Relevance</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: theme.text, margin: "0 0 12px" }}>{p.description}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                      {p.tags.map((tag, i) => (<span key={i} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, border: thinBorder, background: theme.badgeBg, color: theme.text }}>{tag}</span>))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 12, borderTop: thinBorder }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                        <span style={{ fontSize: 12, color: theme.textSecondary }}>{p.queries} queries</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                        <span style={{ fontSize: 12, color: theme.textSecondary }}>{p.mentions} mentions</span>
                      </div>
                      <div style={{ flex: 1 }} />
                      <HoverButton onClick={() => { setPersonaFilter(p.id); setActiveTab("queries"); }} theme={theme} style={{ fontSize: 12, fontWeight: 500, color: "#10A37F", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>View queries</HoverButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS / SERVICES */}
        {activeTab === "products" && (
          <div>
            <div style={{ ...card, padding: "12px 18px", marginBottom: 14 }}>
              <p style={{ fontSize: 13, color: theme.text, margin: 0 }}>
                <span style={{ fontWeight: 600 }}>GeoScale identified</span> <span style={{ fontWeight: 600 }}>5 services and 1 product</span> from scanning <span style={{ fontWeight: 500 }}>all4horses.co.il</span>.
                <span style={{ display: "block", fontSize: 12, color: theme.textSecondary, marginTop: 4 }}><strong>Services</strong> - activities the business provides to clients (riding, therapy, tours). <strong>Products</strong> - physical items for sale (gear, accessories).</span>
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              {([{ key: "all" as const, label: "All", count: 6 }, { key: "service" as const, label: "Services", count: 5 }, { key: "product" as const, label: "Products", count: 1 }]).map((f) => (
                <HoverButton key={f.key} onClick={() => setProductFilter(f.key)} filled={productFilter === f.key} theme={theme} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: productFilter === f.key ? 600 : 400, ...(productFilter === f.key ? btnActive : btnInactive), cursor: "pointer" }}>
                  {f.label} ({f.count})
                </HoverButton>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: theme.text, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
                  {productFilter === "all" ? "All4Horses products & services" : productFilter === "service" ? "All4Horses services" : "All4Horses products"}
                  <Tooltip text="Products and services identified on the site and tested against AI engines" />
                </h2>
              </div>
            </div>
            {(() => {
              const allProducts = [
                { name: "Therapeutic riding", type: "Service", audience: "B2C", score: 82, queries: 15, mentioned: 12, topQuery: "Therapeutic horseback riding for children with ADHD" },
                { name: "Horse summer camp", type: "Service", audience: "B2C", score: 68, queries: 8, mentioned: 5, topQuery: "Horse summer camp 2026 central region" },
                { name: "Riding lessons", type: "Service", audience: "B2C", score: 75, queries: 11, mentioned: 9, topQuery: "Riding lessons for beginners pricing" },
                { name: "Riding gear", type: "Product", audience: "B2C", score: 45, queries: 6, mentioned: 2, topQuery: "Children's riding gear - what you need" },
                { name: "Horse tours", type: "Service", audience: "B2B+B2C", score: 71, queries: 9, mentioned: 7, topQuery: "Horse tours for team building" },
                { name: "Ranch events", type: "Service", audience: "B2B+B2C", score: 58, queries: 7, mentioned: 4, topQuery: "Birthday parties at a horse ranch" },
              ];
              const filtered = productFilter === "all" ? allProducts : productFilter === "service" ? allProducts.filter(p => p.type === "Service") : allProducts.filter(p => p.type === "Product");
              const services = filtered.filter((p) => p.type === "Service");
              const products = filtered.filter((p) => p.type === "Product");
              const renderProductCard = (p: typeof allProducts[0], i: number) => (
                <div key={i} style={{ ...card, overflow: "hidden" }}>
                  <div style={{ height: 3, background: p.type === "Product" ? "#10A37F" : "#4285F4" }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <h3 style={{ fontSize: 14, fontWeight: 600, color: theme.text, margin: 0 }}>{p.name}</h3>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: theme.badgeBg, color: p.type === "Product" ? "#10A37F" : "#4285F4", fontWeight: 500, border: `1px solid ${theme.border}` }}>{p.type}</span>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: theme.badgeBg, color: theme.textSecondary, fontWeight: 500, border: `1px solid ${theme.border}` }}>{p.audience}</span>
                        </div>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: theme.hoverBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: p.score >= 70 ? "#10A37F" : theme.text }}>{p.score}%</span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
                      <div style={{ textAlign: "center", padding: "6px 0", background: theme.hoverBg, borderRadius: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{p.queries}</div>
                        <div style={{ fontSize: 11, color: theme.textSecondary }}>Queries</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "6px 0", background: theme.hoverBg, borderRadius: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#10A37F" }}>{p.mentioned}</div>
                        <div style={{ fontSize: 11, color: theme.textSecondary }}>Mentioned</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "6px 0", background: theme.hoverBg, borderRadius: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: (p.queries - p.mentioned) > 3 ? "#E07800" : theme.text }}>{p.queries - p.mentioned}</div>
                        <div style={{ fontSize: 11, color: theme.textSecondary }}>Missing</div>
                      </div>
                    </div>
                    <div style={{ padding: 8, background: theme.hoverBg, borderRadius: 8, border: thinBorder }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#10A37F", margin: "0 0 4px" }}>Top query</p>
                      <p style={{ fontSize: 13, color: theme.text, margin: 0 }}>&quot;{p.topQuery}&quot;</p>
                    </div>
                  </div>
                </div>
              );
              return (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: theme.text, margin: 0 }}>Services</h3>
                      <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 10, background: theme.badgeBg, color: theme.textSecondary, border: thinBorder }}>{services.length}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>{services.map((p, i) => renderProductCard(p, i))}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: theme.text, margin: 0 }}>Products</h3>
                      <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 10, background: theme.badgeBg, color: theme.textSecondary, border: thinBorder }}>{products.length}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>{products.map((p, i) => renderProductCard(p, i))}</div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* CONTENT CREATION TAB */}
        {activeTab === "content" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: theme.text, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>Content Creation <Tooltip text="GEO-Optimized article creation queue for selected queries" /></h2>
                <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 10, background: theme.badgeBg, color: theme.textSecondary, border: thinBorder }}>{contentQueue.length} items</span>
              </div>
              <HoverButton filled onClick={() => setActiveTab("queries")} theme={theme} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, ...btnFilled, borderRadius: 8, cursor: "pointer" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#0D1117" : "#fff"} strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                  Add query
                </span>
              </HoverButton>
            </div>
            <div style={{ ...card, padding: "12px 18px", marginBottom: 16, borderLeft: "3px solid #10A37F" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><AIEngineLogo engine="gpt" size={16} /><AIEngineLogo engine="gemini" size={16} /><AIEngineLogo engine="perplexity" size={16} /></div>
                <p style={{ fontSize: 12, color: theme.text, margin: 0 }}><span style={{ fontWeight: 600 }}>GEO-Optimized format</span> - Content is built to appear in AI engine answers. Each article is optimized for a specific query.</p>
              </div>
            </div>
            {contentQueue.length === 0 ? (
              <div style={{ ...card, padding: 48, textAlign: "center" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="1.5" style={{ margin: "0 auto 16px" }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                <p style={{ fontSize: 14, fontWeight: 600, color: theme.text, margin: "0 0 6px" }}>No content in queue</p>
                <p style={{ fontSize: 13, color: theme.textSecondary, margin: "0 0 16px" }}>Go to the <strong>Queries</strong> tab, expand a query and click <strong>&quot;Create content&quot;</strong> to get started.</p>
                <HoverButton onClick={() => setActiveTab("queries")} theme={theme} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#10A37F", background: "transparent", border: "1px solid #10A37F", borderRadius: 8, cursor: "pointer" }}>Go to queries</HoverButton>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {contentQueue.map((qId) => {
                  const q = QUERIES.find((x) => x.id === qId);
                  if (!q) return null;
                  return (
                    <div key={qId} style={{ ...card, overflow: "hidden" }}>
                      <div style={{ height: 3, background: "linear-gradient(90deg, #10A37F, #4285F4)" }} />
                      <div style={{ padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <h3 style={{ fontSize: 14, fontWeight: 600, color: theme.text, margin: 0 }}>{q.text}</h3>
                              <PersonaBadge personaId={q.persona} theme={theme} />
                              <StageBadge stage={q.stage} theme={theme} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                              <MentionIcon mentioned={q.gpt} engine="gpt" />
                              <MentionIcon mentioned={q.gemini} engine="gemini" />
                              <MentionIcon mentioned={false} engine="perplexity" />
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <HoverButton filled onClick={() => window.location.href = "/editor"} theme={theme} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#fff", background: "#10A37F", border: "1px solid #10A37F", borderRadius: 8, cursor: "pointer" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit in content editor</span>
                            </HoverButton>
                            <HoverButton onClick={() => setContentQueue(contentQueue.filter((id) => id !== qId))} theme={theme} style={{ padding: "6px 10px", fontSize: 12, color: "#DC2626", background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </HoverButton>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
                          {[{ label: "Word count", value: "1,500" }, { label: "Format", value: "GEO-Optimized" }, { label: "Language", value: "English" }, { label: "Status", value: "Pending creation" }].map((s, i) => (
                            <div key={i} style={{ textAlign: "center", padding: "8px 0", background: theme.hoverBg, borderRadius: 8 }}>
                              <div style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 2 }}>{s.label}</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{s.value}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ padding: "10px 14px", background: theme.hoverBg, borderRadius: 8, border: thinBorder }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <AIEngineLogo engine="gpt" size={14} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Preview - AI answer</span>
                          </div>
                          <p style={{ fontSize: 12, lineHeight: 1.6, color: theme.textSecondary, margin: 0 }}>{q.gptSnippet}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* -- Footer -- */}
      <footer style={{ borderTop: `1px solid ${theme.border}`, marginTop: "auto" }}>
        <div dir="ltr" style={{ maxWidth: 1300, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width={28} height={28} viewBox="0 0 102 102" fill="none">
              <circle cx="51" cy="51" r="41" stroke={theme.logoStroke} strokeWidth="10" fill="none" />
              <circle cx="51" cy="51" r="41" stroke={theme.logoFill} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
            </svg>
            <span style={{ fontSize: 13, color: theme.textSecondary }}>Powered by advanced AI to analyze your search presence</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {["Feedback", "Report a bug", "Improvement ideas", "API usage"].map((label, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 20, color: theme.textSecondary, background: theme.badgeBg, border: `1px solid ${theme.border}`, cursor: "pointer", transition: "all 150ms" }}>{label}</span>
            ))}
          </div>
          <span style={{ fontSize: 12, color: theme.textMuted }}>GeoScale 2026 &copy;</span>
        </div>
      </footer>
    </div>
  );
}
