"use client";

import React, { useState } from "react";

// ============================================================
// GEOSCALE SCAN ANALYSIS — Full Brand Scan Results Page
// Brand: All4Horses | all4horses.co.il | Score: 76%
// Tabs: Overview | Queries | Audiences | Products
// Design: Ultra-minimal Geoscale brand language
// ============================================================

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
  { id: 1, text: "רכיבה טיפולית לילדים עם ADHD", persona: "maya", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "רכיבה טיפולית היא שיטת טיפול משלים מוכחת לילדים עם הפרעות קשב וריכוז. חוות All4Horses מציעה תוכניות מותאמות אישית...", geminiSnippet: "מחקרים מראים כי רכיבה טיפולית מסייעת לשיפור ריכוז ושליטה מוטורית. All4Horses בישראל מתמחה בתוכניות טיפוליות לילדים עם ADHD...", gptFull: "רכיבה טיפולית היא שיטת טיפול משלים מוכחת לילדים עם הפרעות קשב וריכוז (ADHD). הטיפול כולל אינטראקציה עם סוסים בסביבה מובנית, כאשר הילד לומד לתקשר עם הסוס, לטפל בו ולרכוב עליו.\n\nהמחקרים מראים שרכיבה טיפולית מסייעת ב:\n• שיפור יכולת הריכוז והקשב — הסוס דורש תשומת לב מתמדת\n• פיתוח שליטה מוטורית ושיווי משקל\n• חיזוק ביטחון עצמי והערכה עצמית\n• שיפור מיומנויות חברתיות ורגשיות\n• הפחתת חרדה ומתח\n\nחוות All4Horses מציעה תוכניות מותאמות אישית לילדים עם ADHD, הכוללות הערכה ראשונית, תוכנית טיפול מובנית ומעקב שוטף. הצוות המקצועי כולל מטפלים מוסמכים בעלי ניסיון רב בעבודה עם ילדים עם הפרעות קשב.\n\nמומלץ להתחיל עם מפגש היכרות ולהתייעץ עם הצוות הטיפולי לגבי תדירות המפגשים המתאימה. רוב התוכניות כוללות מפגש שבועי אחד של 45-60 דקות.", geminiFull: "רכיבה טיפולית נחקרה רבות בשנים האחרונות כטיפול משלים יעיל להפרעות קשב וריכוז (ADHD) בילדים. מחקרים מראים כי האינטראקציה עם הסוס מסייעת לשיפור ריכוז ושליטה מוטורית באופן משמעותי.\n\nAll4Horses בישראל מתמחה בתוכניות טיפוליות לילדים עם ADHD. החווה מציעה:\n\n1. תוכנית טיפולית מובנית — מפגשים שבועיים עם מטפלים מוסמכים\n2. הערכה התפתחותית — מעקב אחר התקדמות הילד\n3. שילוב הורים — הדרכת הורים כחלק מהתהליך\n4. סביבה טבעית — הטיפול מתקיים בחוות סוסים מטופחת\n\nהמחקרים מצביעים על שיפור ב-70-85% מהמטופלים לאחר 12 מפגשים. היתרונות כוללים שיפור בוויסות רגשי, הפחתת אימפולסיביות, ופיתוח תחושת אחריות.\n\nהחווה ממוקמת באזור המרכז ומציעה גם שירותי הסעה לבתי ספר ומוסדות. ניתן לתאם מפגש היכרות ללא התחייבות." },
  { id: 2, text: "חוות סוסים באזור המרכז", persona: "yossi", stage: "חשיפה", gpt: true, gemini: true, gptSnippet: "ישנן מספר חוות סוסים מומלצות באזור המרכז, ביניהן All4Horses המציעה מגוון פעילויות...", geminiSnippet: "באזור המרכז ניתן למצוא חוות סוסים איכותיות. All4Horses היא אחת החוות המובילות...", gptFull: "ישנן מספר חוות סוסים מומלצות באזור המרכז, ביניהן All4Horses המציעה מגוון פעילויות רכיבה, טיפול ופנאי.\n\nחוות סוסים מובילות באזור המרכז:\n\n1. All4Horses — מובילה בתחום הרכיבה הטיפולית, ממוקמת באזור השרון. מציעה שיעורי רכיבה, רכיבה טיפולית, טיולי סוסים וימי כיף.\n2. חוות הזהב — חווה ותיקה המתמחה בשיעורי רכיבה ספורטיבית.\n3. רכיבה טיפולית ישראל — מתמקדת בטיפול באמצעות סוסים.\n\nAll4Horses נחשבת לבחירה מומלצת במיוחד בזכות השילוב בין רכיבה ספורטיבית לטיפולית, צוות מקצועי מנוסה, ומתקנים מודרניים. החווה מציעה שיעורי ניסיון למתחילים וניתן לתאם ביקור היכרות.", geminiFull: "באזור המרכז ניתן למצוא חוות סוסים איכותיות. All4Horses היא אחת החוות המובילות, המציעה מגוון שירותים:\n\n• שיעורי רכיבה למתחילים ומתקדמים\n• רכיבה טיפולית מוסמכת\n• טיולי סוסים וימי גיבוש\n• קייטנות וחוגים לילדים\n\nהחווה ממוקמת באזור השרון, נגישה מכל רחבי אזור המרכז. הצוות כולל מדריכים מוסמכים ומטפלים בעלי ניסיון.\n\nחוות נוספות באזור: חוות הזהב (רמת גן), רכיבה טיפולית ישראל (מודיעין). כל חווה מתמחה בתחום שונה, מומלץ לבדוק איזו מתאימה לצרכים שלכם." },
  { id: 3, text: "טיפול באמצעות סוסים — למי זה מתאים?", persona: "ori", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "טיפול באמצעות סוסים מתאים למגוון רחב של אוכלוסיות, כולל ילדים עם ADHD, אוטיזם, חרדות ועוד. All4Horses מציעה תוכניות מקצועיות...", geminiSnippet: "רכיבה טיפולית מתאימה לילדים ומבוגרים כאחד. בישראל, חוות All4Horses ידועה בגישה המקצועית שלה...", gptFull: "טיפול באמצעות סוסים מתאים למגוון רחב של אוכלוסיות:\n\n• ילדים עם ADHD — שיפור ריכוז ושליטה עצמית\n• ילדים על הספקטרום האוטיסטי — פיתוח מיומנויות חברתיות\n• נוער בסיכון — בניית ביטחון עצמי ותחושת שייכות\n• מבוגרים עם חרדה או דיכאון — הפחתת מתח וויסות רגשי\n• אנשים עם מוגבלויות פיזיות — שיפור מוטוריקה ושיווי משקל\n• ילדים עם שיתוק מוחין — חיזוק שרירים ותיאום\n\nAll4Horses מציעה תוכניות מקצועיות לכל אחת מהאוכלוסיות הללו. הצוות כולל מטפלים בעלי הכשרה ספציפית לכל תחום. בתחילת הטיפול מתבצעת הערכה מקצועית ונבנית תוכנית אישית.\n\nחשוב לציין שרכיבה טיפולית אינה מחליפה טיפולים רפואיים אלא משלימה אותם. מומלץ להתייעץ עם הרופא המטפל לפני תחילת הטיפול.", geminiFull: "רכיבה טיפולית מתאימה לילדים ומבוגרים כאחד. בישראל, חוות All4Horses ידועה בגישה המקצועית שלה לטיפול באמצעות סוסים.\n\nהטיפול מתאים במיוחד ל:\n\n1. ילדים עם הפרעות קשב (ADHD)\n2. ילדים ומבוגרים על הספקטרום האוטיסטי\n3. אנשים הסובלים מחרדות ודיכאון\n4. נוער בסיכון ונושרים ממערכת החינוך\n5. אנשים עם מוגבלויות פיזיות\n6. מתמודדים עם PTSD\n\nAll4Horses מפעילה תוכניות ייעודיות לכל קבוצת גיל ואבחנה. הטיפול מבוסס על מודלים מוכחים מחקרית ומותאם אישית לכל מטופל.\n\nהשלב הראשון הוא תמיד מפגש היכרות והערכה, שבו הצוות המקצועי מכיר את המטופל ובונה תוכנית טיפול מותאמת." },
  { id: 4, text: "כמה עולה שיעור רכיבה על סוסים", persona: "maya", stage: "החלטה", gpt: false, gemini: true, gptSnippet: "מחירי שיעורי רכיבה בישראל נעים בין 150-350 שקלים לשיעור, תלוי במיקום ובסוג השיעור. מומלץ לבדוק ישירות מול החוות.", geminiSnippet: "מחיר שיעור רכיבה נע בדרך כלל בין 180-300 שקלים. All4Horses מציעה חבילות במחירים תחרותיים..." },
  { id: 5, text: "יתרונות רכיבה טיפולית לילדים על הספקטרום", persona: "david", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "רכיבה טיפולית מציעה יתרונות רבים לילדים על הספקטרום: שיפור מיומנויות חברתיות, ויסות חושי... All4Horses מתמחה בתחום זה.", geminiSnippet: "מחקרים מראים שרכיבה טיפולית מסייעת לילדים אוטיסטים בפיתוח מיומנויות תקשורת. All4Horses הינה חוות סוסים מובילה בתחום..." },
  { id: 6, text: "שיעורי רכיבה למתחילים בדרום", persona: "yossi", stage: "חשיפה", gpt: false, gemini: true, gptSnippet: "ישנן מספר אפשרויות לשיעורי רכיבה בדרום הארץ. מומלץ לבדוק חוות סוסים באזור באר שבע וערד.", geminiSnippet: "בדרום הארץ ניתן למצוא חוות סוסים המציעות שיעורים למתחילים. All4Horses מפעילה סניף בדרום..." },
  { id: 7, text: "פעילויות טיפוליות לילדים עם צרכים מיוחדים", persona: "ronit", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "קיימות פעילויות טיפוליות מגוונות: טיפול באמנות, מוזיקה, בעלי חיים ועוד. All4Horses מציעה רכיבה טיפולית כחלק ממערך הטיפול.", geminiSnippet: "רכיבה טיפולית על סוסים נחשבת לאחת הפעילויות האפקטיביות ביותר. All4Horses מספקת תוכניות מותאמות לבתי ספר..." },
  { id: 8, text: "חוות סוסים עם הסעות לבתי ספר", persona: "ronit", stage: "החלטה", gpt: false, gemini: false, gptSnippet: "ישנן חוות סוסים המספקות שירותי הסעה לקבוצות מבתי ספר. מומלץ ליצור קשר ישירות לבירור.", geminiSnippet: "חלק מחוות הסוסים בארץ מציעות שירות הסעות לקבוצות. כדאי לברר ישירות מול החוות באזורכם." },
  { id: 9, text: "איך בוחרים חוות סוסים בטוחה", persona: "david", stage: "החלטה", gpt: true, gemini: true, gptSnippet: "בעת בחירת חוות סוסים, חשוב לבדוק: רישיונות, ביטוחים, הכשרת מדריכים. All4Horses עומדת בכל תקני הבטיחות...", geminiSnippet: "בטיחות היא השיקול הראשון. All4Horses מחזיקה בכל האישורים הנדרשים ומעסיקה מדריכים מוסמכים..." },
  { id: 10, text: "רכיבה טיפולית מחקרים ותוצאות", persona: "ori", stage: "מחקר", gpt: true, gemini: false, gptSnippet: "מחקרים אקדמיים מראים שרכיבה טיפולית משפרת שיווי משקל, ביטחון עצמי ומיומנויות חברתיות. All4Horses משתפת פעולה עם מוסדות מחקר.", geminiSnippet: "קיימים מחקרים רבים על יעילות רכיבה טיפולית. תוצאות מראות שיפור משמעותי בתחומים רגשיים ומוטוריים." },
  { id: 11, text: "הכשרה לרכיבה טיפולית בישראל", persona: "ori", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "בישראל ישנן מספר תוכניות הכשרה לרכיבה טיפולית. All4Horses מציעה קורסי הכשרה למטפלים...", geminiSnippet: "ההכשרה כוללת לימודים תיאורטיים ומעשיים. All4Horses מפעילה תוכנית הכשרה מקצועית..." },
  { id: 12, text: "טיולי סוסים לגיבוש צוותים", persona: "yossi", stage: "חשיפה", gpt: false, gemini: true, gptSnippet: "טיולי סוסים הם פעילות מצוינת לגיבוש צוותים. ניתן למצוא מגוון הצעות באזורים שונים בארץ.", geminiSnippet: "All4Horses מציעה חבילות גיבוש צוותים הכוללות רכיבה, סיור בחווה ופעילויות נוספות..." },
  { id: 13, text: "רכיבה על סוסים לילדים גיל 5", persona: "maya", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "ילדים מגיל 5 יכולים להתחיל שיעורי רכיבה מותאמים. All4Horses מציעה תוכניות מיוחדות לגילאי 4-7...", geminiSnippet: "גיל 5 הוא גיל מצוין להתחלת רכיבה. All4Horses מתמחה בשיעורים לגיל הרך עם סוסים מאולפים במיוחד..." },
  { id: 14, text: "סוסים וטיפול רגשי למבוגרים", persona: "ori", stage: "חשיפה", gpt: true, gemini: true, gptSnippet: "טיפול באמצעות סוסים אפקטיבי גם למבוגרים. All4Horses מפעילה תוכנית ייעודית למבוגרים...", geminiSnippet: "רכיבה טיפולית למבוגרים מתפתחת בקצב מהיר. All4Horses הרחיבה לאחרונה את שירותי הטיפול למבוגרים..." },
  { id: 15, text: "איך רכיבה על סוסים עוזרת לריכוז", persona: "maya", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "הרכיבה דורשת ריכוז, תיאום ותשומת לב — כישורים שמתחזקים עם הזמן. All4Horses מדווחת על שיפור אצל 85% מהילדים.", geminiSnippet: "הקשר בין הרוכב לסוס מחייב ריכוז מלא. מחקרים ב-All4Horses מראים שיפור משמעותי ביכולת הריכוז..." },
  { id: 16, text: "חוות סוסים ליד ירושלים", persona: "ronit", stage: "חשיפה", gpt: false, gemini: true, gptSnippet: "ישנן מספר חוות סוסים סביב ירושלים, כולל באזור הרי יהודה ובקעת הירדן.", geminiSnippet: "באזור ירושלים ניתן למצוא חוות סוסים איכותיות. All4Horses נמצאת במרחק נסיעה סביר מירושלים..." },
  { id: 17, text: "מה ההבדל בין רכיבה ספורטיבית לטיפולית", persona: "ori", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "רכיבה ספורטיבית מתמקדת בטכניקה ותחרויות, בעוד רכיבה טיפולית מתמקדת ביעדים רגשיים וקוגניטיביים. All4Horses מציעה שני המסלולים.", geminiSnippet: "ההבדל המרכזי הוא המטרה: ספורט לעומת טיפול. All4Horses היא מהחוות הבודדות המציעות את שני הכיוונים..." },
  { id: 18, text: "ביקורות על חוות All4Horses", persona: "maya", stage: "החלטה", gpt: true, gemini: true, gptSnippet: "All4Horses מקבלת ביקורות חיוביות רבות מהורים. ציון ממוצע של 4.8 מתוך 5 בגוגל...", geminiSnippet: "All4Horses זוכה לביקורות מצוינות. הורים רבים מדווחים על שיפור משמעותי אצל ילדיהם..." },
  { id: 19, text: "תוכנית קבוצתית לילדים עם צרכים מיוחדים", persona: "ronit", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "תוכניות קבוצתיות מאפשרות חוויה חברתית לצד הטיפול. All4Horses מפעילה קבוצות של עד 6 ילדים...", geminiSnippet: "קבוצות קטנות מאפשרות תשומת לב אישית. All4Horses מארגנת קבוצות טיפוליות בהנחיית צוות מקצועי..." },
  { id: 20, text: "עלות חודשית רכיבה טיפולית", persona: "david", stage: "החלטה", gpt: false, gemini: true, gptSnippet: "עלות חודשית לרכיבה טיפולית נעה בין 800-1,500 שקלים, תלוי בתדירות המפגשים.", geminiSnippet: "All4Horses מציעה מנויים חודשיים החל מ-900 שקלים לשיעור שבועי. ישנן הנחות למנויים שנתיים..." },
  { id: 21, text: "סוסים מטופלים — סטנדרטים ובריאות", persona: "david", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "בחוות סוסים מקצועית, בריאות הסוסים היא בראש סדר העדיפויות. All4Horses מחזיקה בסטנדרטים גבוהים...", geminiSnippet: "All4Horses משקיעה משאבים רבים בבריאות ורווחת הסוסים. כל הסוסים עוברים בדיקות וטרינריות שוטפות..." },
  { id: 22, text: "רכיבה טיפולית או טיפול התנהגותי CBT", persona: "maya", stage: "מחקר", gpt: true, gemini: false, gptSnippet: "שני הטיפולים אפקטיביים ויכולים להשלים זה את זה. All4Horses ממליצה על שילוב הגישות...", geminiSnippet: "CBT ורכיבה טיפולית פועלים במנגנונים שונים. מומלץ להתייעץ עם מטפל לבחירת הגישה המתאימה." },
  { id: 23, text: "חוות סוסים בצפון הארץ", persona: "ori", stage: "חשיפה", gpt: false, gemini: true, gptSnippet: "בצפון הארץ ישנן חוות סוסים רבות, במיוחד באזור הגלבוע, עמק יזרעאל והגולן.", geminiSnippet: "All4Horses מפעילה סניף בצפון הארץ. בנוסף, ישנן חוות נוספות באזור הגליל..." },
  { id: 24, text: "איך להתכונן לשיעור רכיבה ראשון", persona: "yossi", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "לשיעור הראשון: נעליים סגורות, מכנסיים ארוכים, קסדה (בדרך כלל מסופקת). All4Horses מספקת תדריך מקדים...", geminiSnippet: "All4Horses מספקת את כל הציוד הנדרש. מומלץ להגיע 15 דקות לפני השיעור להיכרות עם הסוס..." },
  { id: 25, text: "ביטוח לרכיבה טיפולית", persona: "ronit", stage: "החלטה", gpt: true, gemini: false, gptSnippet: "רוב חוות הסוסים מחזיקות ביטוח צד שלישי. All4Horses מחזיקה בביטוח מקיף הכולל כיסוי לתאונות...", geminiSnippet: "חשוב לוודא שהחווה מחזיקה ביטוח מתאים. מומלץ לברר ישירות על סוג הכיסוי הביטוחי." },
  { id: 26, text: "סוסים לילדים — בטיחות ופיקוח", persona: "david", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "בטיחות ילדים ברכיבה כוללת: קסדה, מדריך צמוד, סוסים מאולפים. All4Horses מקפידה על יחס 1:1...", geminiSnippet: "All4Horses שמה דגש מיוחד על בטיחות ילדים. כל שיעור מתנהל בפיקוח צמוד של מדריך מוסמך..." },
  { id: 27, text: "חוג רכיבה שבועי לילדים", persona: "maya", stage: "החלטה", gpt: false, gemini: true, gptSnippet: "חוגי רכיבה שבועיים זמינים ברוב חוות הסוסים. מחירים נעים בין 250-400 שקלים למפגש.", geminiSnippet: "All4Horses מפעילה חוגי רכיבה שבועיים בימים ב׳-ה׳. ניתן להירשם לשיעורי ניסיון בחינם..." },
  { id: 28, text: "רכיבה טיפולית לנוער בסיכון", persona: "ori", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "רכיבה טיפולית מוכחת כאפקטיבית עבור נוער בסיכון. All4Horses מפעילה תוכנית ייעודית בשיתוף רשויות הרווחה...", geminiSnippet: "תוכניות רכיבה טיפולית לנוער בסיכון מראות תוצאות מעודדות. All4Horses היא שותפה מוכרת של משרד הרווחה..." },
  { id: 29, text: "מה לקחת לטיול סוסים", persona: "yossi", stage: "מחקר", gpt: false, gemini: false, gptSnippet: "לטיול סוסים מומלץ לקחת: מים, קרם הגנה, כובע, נעליים סגורות ומכנסיים ארוכים.", geminiSnippet: "ציוד בסיסי לטיול: מים, הגנה מהשמש, נעליים מתאימות. הלבוש חשוב לנוחות הרכיבה." },
  { id: 30, text: "חוות סוסים עם לינה", persona: "yossi", stage: "חשיפה", gpt: false, gemini: true, gptSnippet: "ישנן חוות סוסים המציעות חבילות לינה, בעיקר בצפון ובנגב.", geminiSnippet: "All4Horses מציעה חבילות סופ\"ש הכוללות לינה, רכיבה ופעילויות נוספות..." },
  { id: 31, text: "מענק סל שיקום לרכיבה טיפולית", persona: "david", stage: "החלטה", gpt: true, gemini: true, gptSnippet: "רכיבה טיפולית עשויה להיכלל בסל שיקום. All4Horses מסייעת למשפחות בתהליך הבקשה...", geminiSnippet: "משפחות זכאיות יכולות לקבל מימון דרך סל שיקום. All4Horses מוכרת ככתובת לטיפול במסגרת סל שיקום..." },
  { id: 32, text: "איך סוסים עוזרים לויסות רגשי", persona: "maya", stage: "מחקר", gpt: true, gemini: true, gptSnippet: "הקשר עם הסוס יוצר שיקוף רגשי — הסוס מגיב לרגשות הרוכב. All4Horses מדגישה את ההיבט הטיפולי...", geminiSnippet: "סוסים הם בעלי חיים רגישים שמגיבים לרגשות. All4Horses משלבת את התגובתיות של הסוס כחלק מהטיפול..." },
  { id: 33, text: "רכיבה טיפולית תוצאות מוכחות", persona: "ori", stage: "תמיכה", gpt: true, gemini: true, gptSnippet: "מחקרים מראים שיפור של 70-85% במדדים רגשיים לאחר 12 מפגשים. All4Horses מפרסמת נתונים שנתיים...", geminiSnippet: "All4Horses מדווחת על שיעורי הצלחה גבוהים. 82% מהמשפחות מדווחות על שיפור משמעותי לאחר חודשיים..." },
  { id: 34, text: "ציוד רכיבה לילדים — מה צריך", persona: "maya", stage: "החלטה", gpt: false, gemini: false, gptSnippet: "ציוד בסיסי: קסדה, מגפי רכיבה, מכנסי רכיבה. רוב החוות מספקות קסדה.", geminiSnippet: "לשיעורים הראשונים לא נדרש ציוד מיוחד. עם הזמן מומלץ לרכוש קסדה אישית ומגפיים." },
  { id: 35, text: "חוות סוסים חוות דעת הורים", persona: "david", stage: "החלטה", gpt: true, gemini: true, gptSnippet: "הורים רבים ממליצים על All4Horses בזכות הגישה המקצועית והחמה. ציון 4.8/5 בגוגל...", geminiSnippet: "All4Horses נהנית ממוניטין מצוין בקרב הורים. חוות דעת חיוביות מדגישות את המקצועיות והתשומת לב..." },
  { id: 36, text: "שיתוף פעולה עם חוות סוסים למטפלים", persona: "ori", stage: "החלטה", gpt: true, gemini: false, gptSnippet: "All4Horses פתוחה לשיתופי פעולה עם מטפלים חיצוניים. ניתן לקיים מפגשים טיפוליים בחווה...", geminiSnippet: "מטפלים רבים משתפים פעולה עם חוות סוסים. מומלץ ליצור קשר ישיר לברר אפשרויות." },
  { id: 37, text: "רכיבה טיפולית עלויות והנחות", persona: "ronit", stage: "החלטה", gpt: false, gemini: true, gptSnippet: "עלויות רכיבה טיפולית משתנות. חלק מקופות החולים מסבסדות את הטיפול.", geminiSnippet: "All4Horses מציעה הנחות למוסדות חינוך ולקבוצות. ניתן לקבל הצעת מחיר מותאמת..." },
];

// ── COMPETITORS ──
const COMPETITORS = [
  { name: "Golden Ranch", domain: "havat-hazahav.co.il", score: 68 },
  { name: "Therapeutic Riding Israel", domain: "riding-therapy.co.il", score: 54 },
  { name: "Horses & Heart", domain: "susim-valev.co.il", score: 42 },
  { name: "Galilee Ranch", domain: "galil-horses.co.il", score: 37 },
];

// ── SEO-GEO CONNECTION DATA ──
const SEO_GEO_DATA = [
  { keyword: "Therapeutic riding", volume: 1900, difficulty: 42, relatedQueries: ["Therapeutic horseback riding for children with ADHD", "Therapeutic riding research and outcomes"] },
  { keyword: "Horse ranches", volume: 3200, difficulty: 55, relatedQueries: ["Horse ranches in the central region", "Horse ranches in the north"] },
  { keyword: "ADHD horses", volume: 480, difficulty: 18, relatedQueries: ["Therapeutic horseback riding for children with ADHD", "How horseback riding helps with focus"] },
  { keyword: "Animal-assisted therapy", volume: 1100, difficulty: 38, relatedQueries: ["Equine-assisted therapy — who is it for?", "Horses and emotional therapy for adults"] },
  { keyword: "Children's riding", volume: 720, difficulty: 31, relatedQueries: ["Horseback riding for 5-year-old children", "Weekly riding class for children"] },
];

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
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "help" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A2A9B0" strokeWidth="2" style={{ display: "block" }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      {show && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#333333",
          color: "#FFFFFF",
          fontSize: 12,
          lineHeight: 1.5,
          padding: "8px 12px",
          borderRadius: 8,
          whiteSpace: "nowrap",
          maxWidth: 260,
          zIndex: 100,
          pointerEvents: "none",
        }}>
          <span style={{ whiteSpace: "normal" }}>{text}</span>
        </div>
      )}
    </span>
  );
}

function ProgressRing({ percent, size = 88, strokeWidth = 6 }: { percent: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F9F9F9" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#10A37F" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "all 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: Math.round(size * 0.26), fontWeight: 600, color: "#000000" }}>{percent}%</span>
      </div>
    </div>
  );
}

function DonutChart({ data, size = 140, strokeWidth = 20 }: { data: { label: string; value: number; color: string }[]; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F9F9F9" strokeWidth={strokeWidth} />
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
  // invertColor: for metrics where lower is better (like position), down arrow should be green
  const isGood = invertColor ? !isPositive : isPositive;
  const color = isGood ? "#10A37F" : "#DC2626";
  const arrow = isPositive ? "\u2191" : "\u2193";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 600, color }}>
      {arrow}{Math.abs(value)}{unit}
    </span>
  );
}

function TimeSeriesChart({ period }: { period: "7" | "30" | "90" }) {
  const chartW = 1000;
  const chartH = 240;
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

  // Horizontal grid lines
  const gridLines = 5;
  const gridValues = Array.from({ length: gridLines }, (_, i) => minVal + (range / (gridLines - 1)) * i);

  return (
    <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {gridValues.map((v, i) => (
        <g key={i}>
          <line x1={padLeft} y1={getY(v)} x2={chartW - padRight} y2={getY(v)} stroke="#F9F9F9" strokeWidth="1" />
          <text x={padLeft - 8} y={getY(v) + 4} textAnchor="end" fill="#A2A9B0" fontSize="11" fontFamily="Inter, sans-serif">{Math.round(v)}%</text>
        </g>
      ))}

      {/* Areas */}
      <polygon points={geminiAreaPoints} fill="#4285F4" opacity="0.08" />
      <polygon points={gptAreaPoints} fill="#10A37F" opacity="0.1" />

      {/* Lines */}
      <polyline points={geminiPoints} fill="none" stroke="#4285F4" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={gptPoints} fill="none" stroke="#10A37F" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Dots */}
      {data.gpt.map((v, i) => (
        <circle key={`gpt-${i}`} cx={getX(i)} cy={getY(v)} r="4" fill="#10A37F" />
      ))}
      {data.gemini.map((v, i) => (
        <circle key={`gem-${i}`} cx={getX(i)} cy={getY(v)} r="4" fill="#4285F4" />
      ))}

      {/* X-axis labels */}
      {data.labels.map((label, i) => (
        <text key={i} x={getX(i)} y={chartH - 5} textAnchor="middle" fill="#A2A9B0" fontSize="11" fontFamily="Inter, sans-serif">{label}</text>
      ))}
    </svg>
  );
}

function PersonaBadge({ personaId }: { personaId: string }) {
  const p = PERSONAS.find((pp) => pp.id === personaId);
  if (!p) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 10, border: "1px solid #DDDDDD", background: "#FFFFFF", color: "#333333" }}>
      {p.name}
    </span>
  );
}

function StageBadge({ stage }: { stage: string }) {
  return (
    <span style={{ display: "inline-flex", fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 10, border: "1px solid #DDDDDD", background: "#F9F9F9", color: "#333333" }}>
      {stage}
    </span>
  );
}

function MentionBadge({ mentioned }: { mentioned: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 10, background: mentioned ? "#FFFFFF" : "#F9F9F9", color: mentioned ? "#10A37F" : "#727272", border: `1px solid ${mentioned ? "#10A37F" : "#DDDDDD"}` }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        {mentioned ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
      </svg>
      {mentioned ? "Mentioned" : "Not mentioned"}
    </span>
  );
}

function HoverButton({ children, style, filled, onClick, href }: { children: React.ReactNode; style: React.CSSProperties; filled?: boolean; onClick?: (e: React.MouseEvent) => void; href?: string }) {
  const [hovered, setHovered] = useState(false);
  const hoverStyle: React.CSSProperties = filled
    ? { opacity: hovered ? 0.85 : 1 }
    : { background: hovered ? "#F9F9F9" : style.background || "#FFFFFF" };

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
  const [activeTab, setActiveTab] = useState<"overview" | "queries" | "audiences" | "products">("overview");
  const [expandedQuery, setExpandedQuery] = useState<number | null>(null);
  const [fullAnswerView, setFullAnswerView] = useState<{ queryId: number; engine: "gpt" | "gemini" } | null>(null);
  const [queryFilter, setQueryFilter] = useState<"all" | "mentioned" | "missing" | "negative">("all");
  const [personaFilter, setPersonaFilter] = useState<string>("all");
  const [seoToggle, setSeoToggle] = useState(true);
  const [geoToggle, setGeoToggle] = useState(true);
  const [showPersonaForm, setShowPersonaForm] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<"7" | "30" | "90">("30");

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

  const card: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #BFBFBF", borderRadius: 10 };
  const sectionTitle: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#000000", margin: 0 };
  const bodyText: React.CSSProperties = { fontSize: 14, color: "#333333" };
  const thinBorder = "1px solid #DDDDDD";

  // Reputation risk value
  const reputationValue = 100;
  const reputationColor = reputationValue < 80 ? "#DC2626" : "#000000";

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter', 'Heebo', sans-serif", display: "flex", flexDirection: "column" }} dir="ltr">

      {/* -- Sticky Header -- 3-column grid: actions | nav | logo -- */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.96)", borderBottom: "1px solid #BFBFBF" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", height: 72, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          {/* LEFT (grid col 1) = Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifySelf: "start" }}>
            <HoverButton filled href="/new-scan" style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", background: "#000", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "1px solid #000" }}>
              New Scan
            </HoverButton>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#727272" }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#10A37F", display: "inline-block" }} />
              <span>Connected</span>
            </div>
          </div>

          {/* CENTER (grid col 2) = Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="/" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none", transition: "all 150ms" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#000"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#727272"; }}>Dashboard</a>
            <a href="/scan" style={{ fontSize: 14, fontWeight: 600, color: "#000", textDecoration: "none" }}>Scans</a>
            <a href="/scale-publish" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none", transition: "all 150ms" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#000"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#727272"; }}>ScalePublish</a>
            <a href="/roadmap" style={{ fontSize: 14, fontWeight: 400, color: "#727272", textDecoration: "none", transition: "all 150ms" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#000"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#727272"; }}>Roadmap</a>
          </nav>

          {/* RIGHT (grid col 3) = Logo */}
          <div style={{ justifySelf: "end", direction: "ltr" }}>
            <svg width={150} height={30} viewBox="0 0 510 102" fill="none">
              <circle cx="51" cy="51" r="41" stroke="#ABABAB" strokeWidth="13" fill="none" />
              <circle cx="51" cy="51" r="41" stroke="#141414" strokeWidth="13" fill="none" strokeLinecap="round" strokeDasharray="180 78" />
              <g fill="#141414"><text x="120" y="66" fontFamily="'Inter', sans-serif" fontSize="52" fontWeight="600" letterSpacing="-2">Geoscale</text></g>
            </svg>
          </div>
        </div>
      </header>

      {/* -- Brand Header (compact) -- */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #BFBFBF" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <ProgressRing percent={76} size={60} strokeWidth={5} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 26, fontWeight: 600, color: "#000000", margin: 0 }}>All4Horses</h1>
                  <span style={{ fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 10, border: "1px solid #10A37F", color: "#10A37F", background: "#FFFFFF" }}>Strong presence</span>
                </div>
                <p style={{ fontSize: 13, color: "#727272", margin: "2px 0 0", direction: "ltr", textAlign: "left" }}>all4horses.co.il</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <HoverButton href="/" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#FFFFFF", color: "#333333", fontSize: 13, fontWeight: 500, border: "1px solid #BFBFBF", borderRadius: 9, cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                Dashboard
              </HoverButton>
              <HoverButton filled href="/new-scan" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#000000", color: "#FFFFFF", fontSize: 13, fontWeight: 600, border: "1px solid #000000", borderRadius: 9, cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                New Scan
              </HoverButton>
            </div>
          </div>
        </div>
      </div>

      {/* -- Tab Bar -- */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #BFBFBF" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: 0 }}>
            {([
              { key: "overview" as const, label: "Overview", iconPath: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" /> },
              { key: "queries" as const, label: "Queries", iconPath: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></>, count: totalQueries },
              { key: "audiences" as const, label: "Audiences", iconPath: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>, count: PERSONAS.length },
              { key: "products" as const, label: "Products / Services", iconPath: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></> },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", fontSize: 14,
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  color: activeTab === tab.key ? "#000000" : "#727272",
                  background: "transparent", border: "none",
                  borderBottom: activeTab === tab.key ? "2px solid #000000" : "2px solid transparent",
                  marginBottom: -1, cursor: "pointer",
                  transition: "all 150ms",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{tab.iconPath}</svg>
                {tab.label}
                {tab.count !== undefined && (
                  <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 10, background: "#F9F9F9", color: "#727272", border: "1px solid #DDDDDD" }}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* -- Main Content -- */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px 24px" }}>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* BIG TIME-SERIES CHART */}
            <div style={{ ...card, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ ...sectionTitle }}>Mention rate over time</h3>
                  <Tooltip text="Tracks your brand's mention rate across AI engines over time" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  {(["7", "30", "90"] as const).map((p) => (
                    <HoverButton
                      key={p}
                      onClick={() => setChartPeriod(p)}
                      style={{
                        padding: "6px 14px",
                        fontSize: 12,
                        fontWeight: chartPeriod === p ? 600 : 400,
                        background: chartPeriod === p ? "#000000" : "#FFFFFF",
                        color: chartPeriod === p ? "#FFFFFF" : "#333333",
                        border: chartPeriod === p ? "1px solid #000000" : "1px solid #BFBFBF",
                        borderRadius: p === "7" ? "9px 0 0 9px" : p === "90" ? "0 9px 9px 0" : "0",
                        cursor: "pointer",
                        marginLeft: p !== "7" ? -1 : 0,
                      }}
                      filled={chartPeriod === p}
                    >
                      {p} days
                    </HoverButton>
                  ))}
                </div>
              </div>
              {/* Legend */}
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 12, height: 3, borderRadius: 2, background: "#10A37F" }} />
                  <span style={{ fontSize: 12, color: "#333333" }}>ChatGPT</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 12, height: 3, borderRadius: 2, background: "#4285F4" }} />
                  <span style={{ fontSize: 12, color: "#333333" }}>Gemini</span>
                </div>
              </div>
              <div style={{ height: 240 }}>
                <TimeSeriesChart period={chartPeriod} />
              </div>
            </div>

            {/* 4 Stat Cards with change indicators + tooltips */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { label: "Mention rate", value: "76%", iconPath: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />, change: 4.2, unit: "%", invertColor: false },
                { label: "Avg. position", value: "#9.7", iconPath: <path d="M12 20V10M18 20V4M6 20v-4" />, change: -1.3, unit: "", invertColor: true },
                { label: "Citation quality", value: "70%", iconPath: <path d="M10 11V6l-6 6 6 6v-5c5.523 0 10 4.477 10 10 0-8.284-4.477-15-10-15z" />, change: 2.1, unit: "%", invertColor: false },
                { label: "Reputation risk", value: `${reputationValue}%`, iconPath: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />, change: 0, unit: "%", invertColor: false },
              ].map((stat, i) => (
                <div key={i} style={{ ...card, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2">{stat.iconPath}</svg>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 24, fontWeight: 600, color: stat.label === "Reputation risk" ? reputationColor : "#000000" }}>{stat.value}</span>
                    {stat.change !== 0 && <ChangeIndicator value={stat.change} unit={stat.unit} invertColor={stat.invertColor} />}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, color: "#727272" }}>{stat.label}</span>
                    <Tooltip text={METRIC_TOOLTIPS[stat.label] || ""} />
                  </div>
                </div>
              ))}
            </div>

            {/* GPT vs Gemini */}
            <div style={{ ...card, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <h3 style={{ ...sectionTitle }}>AI engine comparison</h3>
                <Tooltip text="Compares your brand's mention rates between ChatGPT and Google Gemini" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={{ border: thinBorder, borderRadius: 10, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#10A37F"><path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.702.418 6.004 6.004 0 005.354 2.08a5.974 5.974 0 00-3.994 2.9 6.042 6.042 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.702 22a6.003 6.003 0 006.349-1.662 5.98 5.98 0 003.994-2.9 6.042 6.042 0 00-.743-7.097l-.02-.02z" /></svg>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#000000" }}>ChatGPT (GPT-4o)</span>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 600, color: "#10A37F" }}>57%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#F9F9F9", overflow: "hidden" }}>
                    <div style={{ width: "57%", height: "100%", borderRadius: 3, background: "#10A37F", transition: "width 1s ease" }} />
                  </div>
                  <p style={{ fontSize: 12, color: "#727272", marginTop: 8 }}>{gptMentioned} / {totalQueries} queries mentioned</p>
                </div>
                <div style={{ border: thinBorder, borderRadius: 10, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 3.6c2.21 0 4.122.84 5.64 2.16l-2.4 2.4A5.356 5.356 0 0012 7.2c-2.652 0-4.8 2.148-4.8 4.8s2.148 4.8 4.8 4.8c2.316 0 4.128-1.488 4.56-3.6H12v-3.6h8.28c.12.6.12 1.2.12 1.8 0 4.644-3.156 8.4-8.4 8.4-4.632 0-8.4-3.768-8.4-8.4S7.368 3.6 12 3.6z" /></svg>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#000000" }}>Google Gemini</span>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 600, color: "#4285F4" }}>73%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#F9F9F9", overflow: "hidden" }}>
                    <div style={{ width: "73%", height: "100%", borderRadius: 3, background: "#4285F4", transition: "width 1s ease" }} />
                  </div>
                  <p style={{ fontSize: 12, color: "#727272", marginTop: 8 }}>{geminiMentioned} / {totalQueries} queries mentioned</p>
                </div>
              </div>
            </div>

            {/* Customer Journey -- compact cards */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${JOURNEY_STAGES.length}, 1fr)`, gap: 12 }}>
              {JOURNEY_STAGES.map((stage, i) => {
                const journeyTooltips: Record<string, string> = {
                  "Awareness": "Percent presence in initial brand-discovery queries",
                  "Research": "Percent presence in research and comparison queries",
                  "Decision": "Percent presence in decision-stage queries",
                  "Support": "Percent presence in service and support queries",
                  "Reputation": "Percent presence in review and rating queries",
                };
                return (
                  <div key={i} style={{ ...card, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: stage.percent >= 80 ? "#10A37F" : "#000000", marginBottom: 4 }}>{stage.percent}%</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "#000000", marginBottom: 2 }}>
                      {stage.name}
                      <Tooltip text={journeyTooltips[stage.name] || "Customer journey stage"} />
                    </div>
                    <div style={{ fontSize: 12, color: "#727272" }}>{stage.count} queries</div>
                  </div>
                );
              })}
            </div>

            {/* Persona + Competitors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ ...card, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <h3 style={{ ...sectionTitle }}>Identified persona</h3>
                  <Tooltip text="Target audience profile identified from analysis of queries and AI engine responses" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Target audience:", value: "Parents of children with special needs, therapists, special-education teachers, and youth" },
                    { label: "Industry:", value: "Therapeutic riding, horse ranches, complementary therapy" },
                    { label: "Location:", value: "Israel" },
                    { label: "Value proposition:", value: "Professional therapeutic riding combined with a personal, research-driven approach" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, flexShrink: 0, color: "#727272" }}>{item.label}</span>
                      <span style={{ ...bodyText }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...card, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <h3 style={{ ...sectionTitle }}>Competitors</h3>
                  <Tooltip text="Presence scores of leading competitors compared to your brand" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {COMPETITORS.map((comp, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: "1px solid #DDDDDD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#333333", flexShrink: 0 }}>{i + 1}</div>
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${comp.domain}&sz=64`}
                        alt=""
                        width={24}
                        height={24}
                        style={{ borderRadius: 5, flexShrink: 0, border: "1px solid #F0F0F0", background: "#fff" }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#333333" }}>{comp.name}</div>
                        <div style={{ fontSize: 11, color: "#A2A9B0" }}>{comp.domain}</div>
                      </div>
                      <div style={{ width: 80, height: 6, borderRadius: 3, overflow: "hidden", background: "#F9F9F9" }}>
                        <div style={{ width: `${comp.score}%`, height: "100%", borderRadius: 3, background: "#10A37F" }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, width: 36, textAlign: "right", color: "#000000" }}>{comp.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sentiment + Citation Quality */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ ...card, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#000000", margin: 0 }}>Sentiment</h3>
                  <Tooltip text="The overall tone in which AI engines present your brand - positive, neutral, or negative" />
                </div>
                <p style={{ fontSize: 12, color: "#727272", margin: "0 0 16px" }}>How AI talks about you</p>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <DonutChart size={110} strokeWidth={16} data={[{ label: "Positive", value: 80, color: "#10A37F" }, { label: "Neutral", value: 20, color: "#BFBFBF" }]} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: "#10A37F" }} /><span style={{ fontSize: 13, color: "#333333" }}>Positive</span><span style={{ fontSize: 13, fontWeight: 600, color: "#000000" }}>80%</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: "#BFBFBF" }} /><span style={{ fontSize: 13, color: "#333333" }}>Neutral</span><span style={{ fontSize: 13, fontWeight: 600, color: "#000000" }}>20%</span></div>
                  </div>
                </div>
              </div>
              <div style={{ ...card, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#000000", margin: 0 }}>Citation quality</h3>
                  <Tooltip text="How accurately and fully AI engines cite your brand" />
                </div>
                <p style={{ fontSize: 12, color: "#727272", margin: "0 0 16px" }}>How well AI links back to you</p>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <DonutChart size={110} strokeWidth={16} data={[{ label: "High", value: 35, color: "#10A37F" }, { label: "Medium", value: 30, color: "#BFBFBF" }, { label: "Low", value: 35, color: "#000000" }]} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: "#10A37F" }} /><span style={{ fontSize: 13, color: "#333333" }}>High</span><span style={{ fontSize: 13, fontWeight: 600, color: "#000000" }}>35%</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: "#BFBFBF" }} /><span style={{ fontSize: 13, color: "#333333" }}>Medium</span><span style={{ fontSize: 13, fontWeight: 600, color: "#000000" }}>30%</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: "#000000" }} /><span style={{ fontSize: 13, color: "#333333" }}>Low</span><span style={{ fontSize: 13, fontWeight: 600, color: "#000000" }}>35%</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Signals */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ ...card, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#000000", margin: 0 }}>What worked</h3>
                  <Tooltip text="Strengths - areas where the brand receives positive mentions in AI engines" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {POSITIVE_SIGNALS.map((signal, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: 3, marginTop: 7, flexShrink: 0, background: "#10A37F" }} />
                      <span style={{ ...bodyText }}>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* "What's missing" styled as RED ALERTS */}
              <div style={{ ...card, padding: 24, background: "#DC262608", borderColor: "#BFBFBF" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#DC2626", margin: 0 }}>What&apos;s missing</h3>
                  <Tooltip text="Risk alerts - areas with missing mentions and reputation risk" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {NEGATIVE_SIGNALS.map((signal, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", background: "#DC262608", borderLeft: "3px solid #DC2626", borderRadius: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0, background: "#DC2626" }} />
                      <span style={{ ...bodyText }}>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO + GEO */}
            <div style={{ ...card, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#000000", margin: 0 }}>SEO &amp; GEO connection</h3>
                  <Tooltip text="The relationship between organic SEO performance and AI engine presence (GEO)" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#333333" }}>SEO</span>
                    <button onClick={() => setSeoToggle(!seoToggle)} style={{ position: "relative", width: 36, height: 20, borderRadius: 10, border: "1px solid #BFBFBF", background: seoToggle ? "#10A37F" : "#F9F9F9", cursor: "pointer", transition: "background 0.3s ease" }}>
                      <div style={{ position: "absolute", width: 16, height: 16, borderRadius: 8, background: "#FFFFFF", top: 1, left: seoToggle ? 17 : 1, transition: "left 0.3s ease", border: "1px solid #DDDDDD" }} />
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#333333" }}>GEO</span>
                    <button onClick={() => setGeoToggle(!geoToggle)} style={{ position: "relative", width: 36, height: 20, borderRadius: 10, border: "1px solid #BFBFBF", background: geoToggle ? "#10A37F" : "#F9F9F9", cursor: "pointer", transition: "background 0.3s ease" }}>
                      <div style={{ position: "absolute", width: 16, height: 16, borderRadius: 8, background: "#FFFFFF", top: 1, left: geoToggle ? 17 : 1, transition: "left 0.3s ease", border: "1px solid #DDDDDD" }} />
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #BFBFBF" }}>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600, color: "#727272", fontSize: 13 }}>Keyword</th>
                      {seoToggle && <><th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600, color: "#727272", fontSize: 13 }}>Search volume</th><th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600, color: "#727272", fontSize: 13 }}>Difficulty</th></>}
                      {geoToggle && <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600, color: "#727272", fontSize: 13 }}>Related queries</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {SEO_GEO_DATA.map((row, i) => (
                      <tr key={i} style={{ borderBottom: thinBorder }}>
                        <td style={{ padding: "10px 12px" }}><span style={{ fontWeight: 500, color: "#000000" }}>{row.keyword}</span></td>
                        {seoToggle && <>
                          <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 14, fontWeight: 500, color: "#333333" }}>{row.volume.toLocaleString()}</span></td>
                          <td style={{ padding: "10px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 40, height: 4, borderRadius: 2, overflow: "hidden", background: "#F9F9F9" }}><div style={{ width: `${row.difficulty}%`, height: "100%", borderRadius: 2, background: "#10A37F" }} /></div>
                              <span style={{ fontSize: 12, color: "#333333" }}>{row.difficulty}</span>
                            </div>
                          </td>
                        </>}
                        {geoToggle && <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {row.relatedQueries.map((q, j) => (<span key={j} style={{ display: "inline-flex", fontSize: 12, padding: "3px 8px", borderRadius: 7, border: thinBorder, background: "#F9F9F9", color: "#333333" }}>{q}</span>))}
                          </div>
                        </td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top 5 Queries */}
            <div style={{ ...card, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#000000", margin: 0 }}>Top 5 queries</h3>
                  <Tooltip text="Queries with the highest brand presence across AI engines" />
                </div>
                <HoverButton onClick={() => setActiveTab("queries")} style={{ fontSize: 13, fontWeight: 500, color: "#10A37F", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  View all {totalQueries} queries
                </HoverButton>
              </div>
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #BFBFBF" }}>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: "#727272", fontSize: 13 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Query <Tooltip text="The query tested against AI engines" /></span></th>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: "#727272", fontSize: 13 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Persona <Tooltip text="The target-audience profile this query belongs to" /></span></th>
                    <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: "#727272", fontSize: 13 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Stage <Tooltip text="Customer journey stage: Awareness, Research, Decision, Support" /></span></th>
                    <th style={{ textAlign: "center", padding: "8px 10px", fontWeight: 600, color: "#727272", fontSize: 13 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>GPT <Tooltip text="Whether the brand is mentioned in the ChatGPT answer" /></span></th>
                    <th style={{ textAlign: "center", padding: "8px 10px", fontWeight: 600, color: "#727272", fontSize: 13 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Gemini <Tooltip text="Whether the brand is mentioned in the Google Gemini answer" /></span></th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_5_QUERIES.map((q) => (
                    <tr key={q.id} style={{ borderBottom: thinBorder }}>
                      <td style={{ padding: "10px 10px", fontWeight: 500, color: "#333333" }}>{q.text}</td>
                      <td style={{ padding: "10px 10px" }}><PersonaBadge personaId={q.persona} /></td>
                      <td style={{ padding: "10px 10px" }}><StageBadge stage={q.stage} /></td>
                      <td style={{ padding: "10px 10px", textAlign: "center" }}><MentionBadge mentioned={q.gpt} /></td>
                      <td style={{ padding: "10px 10px", textAlign: "center" }}><MentionBadge mentioned={q.gemini} /></td>
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
            <div style={{ ...card, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {([{ key: "all" as const, label: "All" }, { key: "mentioned" as const, label: "Mentioned" }, { key: "missing" as const, label: "Missing" }, { key: "negative" as const, label: "Negative" }]).map((f) => (
                    <HoverButton
                      key={f.key}
                      onClick={() => setQueryFilter(f.key)}
                      filled={queryFilter === f.key}
                      style={{
                        display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 9, fontSize: 12,
                        fontWeight: queryFilter === f.key ? 600 : 400,
                        background: queryFilter === f.key ? "#000000" : "#FFFFFF",
                        color: queryFilter === f.key ? "#FFFFFF" : "#333333",
                        border: queryFilter === f.key ? "1px solid #000000" : "1px solid #BFBFBF",
                        cursor: "pointer",
                      }}
                    >
                      {f.label} <span style={{ opacity: 0.7 }}>({filterCounts[f.key]})</span>
                    </HoverButton>
                  ))}
                </div>
                <div style={{ width: 1, height: 24, background: "#BFBFBF" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <HoverButton
                    onClick={() => setPersonaFilter("all")}
                    filled={personaFilter === "all"}
                    style={{
                      padding: "5px 12px", borderRadius: 9, fontSize: 12,
                      fontWeight: personaFilter === "all" ? 600 : 400,
                      background: personaFilter === "all" ? "#000000" : "#FFFFFF",
                      color: personaFilter === "all" ? "#FFFFFF" : "#333333",
                      border: personaFilter === "all" ? "1px solid #000000" : "1px solid #BFBFBF",
                      cursor: "pointer",
                    }}
                  >
                    All personas
                  </HoverButton>
                  {PERSONAS.map((p) => (
                    <HoverButton
                      key={p.id}
                      onClick={() => setPersonaFilter(p.id)}
                      filled={personaFilter === p.id}
                      style={{
                        padding: "5px 12px", borderRadius: 9, fontSize: 12,
                        fontWeight: personaFilter === p.id ? 600 : 400,
                        background: personaFilter === p.id ? "#000000" : "#FFFFFF",
                        color: personaFilter === p.id ? "#FFFFFF" : "#333333",
                        border: personaFilter === p.id ? "1px solid #000000" : "1px solid #BFBFBF",
                        cursor: "pointer",
                      }}
                    >
                      {p.name} - {p.role}
                    </HoverButton>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ ...card, overflow: "hidden" }}>
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F9F9F9", borderBottom: "1px solid #BFBFBF" }}>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: "#727272", fontSize: 13 }}>#</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: "#727272", fontSize: 13 }}>Query</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: "#727272", fontSize: 13 }}>Persona</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: "#727272", fontSize: 13 }}>Stage</th>
                    <th style={{ textAlign: "center", padding: "10px 14px", fontWeight: 600, color: "#727272", fontSize: 13 }}>ChatGPT</th>
                    <th style={{ textAlign: "center", padding: "10px 14px", fontWeight: 600, color: "#727272", fontSize: 13 }}>Gemini</th>
                    <th style={{ textAlign: "center", padding: "10px 14px", width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueries.map((q) => (
                    <React.Fragment key={q.id}>
                      <tr onClick={() => setExpandedQuery(expandedQuery === q.id ? null : q.id)} style={{ borderBottom: expandedQuery === q.id ? "none" : thinBorder, cursor: "pointer", transition: "all 150ms" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F9F9F9"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; }}>
                        <td style={{ padding: "10px 14px", fontWeight: 500, color: "#A2A9B0" }}>{q.id}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 500, color: "#333333", maxWidth: 320 }}>{q.text}</td>
                        <td style={{ padding: "10px 14px" }}><PersonaBadge personaId={q.persona} /></td>
                        <td style={{ padding: "10px 14px" }}><StageBadge stage={q.stage} /></td>
                        <td style={{ padding: "10px 14px", textAlign: "center" }}><MentionBadge mentioned={q.gpt} /></td>
                        <td style={{ padding: "10px 14px", textAlign: "center" }}><MentionBadge mentioned={q.gemini} /></td>
                        <td style={{ padding: "10px 14px", textAlign: "center" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#727272" strokeWidth="2" style={{ display: "inline-block", transform: expandedQuery === q.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}><path d="M6 9l6 6 6-6" /></svg>
                        </td>
                      </tr>
                      {expandedQuery === q.id && (
                        <tr key={`${q.id}-detail`}>
                          <td colSpan={7} style={{ padding: "0 14px 14px" }}>
                            <div style={{ borderRadius: 10, padding: 16, background: "#F9F9F9", border: thinBorder, display: "flex", flexDirection: "column", gap: 12 }}>
                              {/* ChatGPT Card */}
                              <div style={{ borderRadius: 10, padding: 14, background: "#FFFFFF", border: thinBorder }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#10A37F"><path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.702.418 6.004 6.004 0 005.354 2.08a5.974 5.974 0 00-3.994 2.9 6.042 6.042 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.702 22a6.003 6.003 0 006.349-1.662 5.98 5.98 0 003.994-2.9 6.042 6.042 0 00-.743-7.097l-.02-.02z" /></svg>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: "#10A37F" }}>ChatGPT (GPT-4o)</span>
                                  <MentionBadge mentioned={q.gpt} />
                                </div>
                                {fullAnswerView?.queryId === q.id && fullAnswerView?.engine === "gpt" ? (
                                  <div>
                                    <div style={{ fontSize: 13, lineHeight: 1.8, color: "#333333", whiteSpace: "pre-line" }}>{(q as { gptFull?: string }).gptFull || q.gptSnippet}</div>
                                    <HoverButton onClick={(e) => { e.stopPropagation(); setFullAnswerView(null); }} style={{ marginTop: 10, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "#10A37F", background: "none", border: "1px solid #10A37F", borderRadius: 9, cursor: "pointer" }}>
                                      Hide full answer
                                    </HoverButton>
                                  </div>
                                ) : (
                                  <div>
                                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "#333333", margin: 0 }}>{q.gptSnippet}</p>
                                    {(q as { gptFull?: string }).gptFull && (
                                      <HoverButton onClick={(e) => { e.stopPropagation(); setFullAnswerView({ queryId: q.id, engine: "gpt" }); }} style={{ marginTop: 8, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "#10A37F", background: "none", border: "1px solid #10A37F", borderRadius: 9, cursor: "pointer" }}>
                                        View full answer
                                      </HoverButton>
                                    )}
                                  </div>
                                )}
                              </div>
                              {/* Gemini Card */}
                              <div style={{ borderRadius: 10, padding: 14, background: "#FFFFFF", border: thinBorder }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 3.6c2.21 0 4.122.84 5.64 2.16l-2.4 2.4A5.356 5.356 0 0012 7.2c-2.652 0-4.8 2.148-4.8 4.8s2.148 4.8 4.8 4.8c2.316 0 4.128-1.488 4.56-3.6H12v-3.6h8.28c.12.6.12 1.2.12 1.8 0 4.644-3.156 8.4-8.4 8.4-4.632 0-8.4-3.768-8.4-8.4S7.368 3.6 12 3.6z" /></svg>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: "#4285F4" }}>Google Gemini</span>
                                  <MentionBadge mentioned={q.gemini} />
                                </div>
                                {fullAnswerView?.queryId === q.id && fullAnswerView?.engine === "gemini" ? (
                                  <div>
                                    <div style={{ fontSize: 13, lineHeight: 1.8, color: "#333333", whiteSpace: "pre-line" }}>{(q as { geminiFull?: string }).geminiFull || q.geminiSnippet}</div>
                                    <HoverButton onClick={(e) => { e.stopPropagation(); setFullAnswerView(null); }} style={{ marginTop: 10, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "#4285F4", background: "none", border: "1px solid #4285F4", borderRadius: 9, cursor: "pointer" }}>
                                      Hide full answer
                                    </HoverButton>
                                  </div>
                                ) : (
                                  <div>
                                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "#333333", margin: 0 }}>{q.geminiSnippet}</p>
                                    {(q as { geminiFull?: string }).geminiFull && (
                                      <HoverButton onClick={(e) => { e.stopPropagation(); setFullAnswerView({ queryId: q.id, engine: "gemini" }); }} style={{ marginTop: 8, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "#4285F4", background: "none", border: "1px solid #4285F4", borderRadius: 9, cursor: "pointer" }}>
                                        View full answer
                                      </HoverButton>
                                    )}
                                  </div>
                                )}
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
                <span style={{ fontSize: 12, color: "#727272" }}>Showing {filteredQueries.length} of {totalQueries} queries</span>
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12 }}>
                  <span style={{ color: "#10A37F" }}>Mentioned: {filterCounts.mentioned}</span>
                  <span style={{ color: "#000000" }}>Missing: {filterCounts.missing}</span>
                  <span style={{ color: "#727272" }}>Negative: 0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIENCES */}
        {activeTab === "audiences" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#000000", margin: "0 0 4px" }}>Identified target audiences</h2>
                <p style={{ fontSize: 13, color: "#727272", margin: 0 }}>{PERSONAS.length} personas identified in the latest scan</p>
              </div>
              <HoverButton filled onClick={() => setShowPersonaForm(!showPersonaForm)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#000000", color: "#FFFFFF", fontSize: 13, fontWeight: 600, border: "1px solid #000000", borderRadius: 9, cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                Suggest persona
              </HoverButton>
            </div>

            {showPersonaForm && (
              <div style={{ ...card, padding: 24, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#000000", margin: 0 }}>Suggest a new persona</h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#333333" }}>Persona name</label>
                    <input type="text" placeholder="Example: Sarah" style={{ width: "100%", padding: "8px 12px", borderRadius: 10, fontSize: 14, border: "1px solid #BFBFBF", color: "#000000", outline: "none", background: "#FFFFFF", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#333333" }}>Role / description</label>
                    <input type="text" placeholder="Example: Physiotherapist looking for collaboration" style={{ width: "100%", padding: "8px 12px", borderRadius: 10, fontSize: 14, border: "1px solid #BFBFBF", color: "#000000", outline: "none", background: "#FFFFFF", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#333333" }}>Detailed description</label>
                    <textarea rows={3} placeholder="Describe the persona, what they're looking for, what their needs are..." style={{ width: "100%", padding: "8px 12px", borderRadius: 10, fontSize: 14, border: "1px solid #BFBFBF", color: "#000000", outline: "none", resize: "none", background: "#FFFFFF", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#333333" }}>Tags</label>
                    <input type="text" placeholder="Age, location, field - comma separated" style={{ width: "100%", padding: "8px 12px", borderRadius: 10, fontSize: 14, border: "1px solid #BFBFBF", color: "#000000", outline: "none", background: "#FFFFFF", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <HoverButton filled onClick={() => setShowPersonaForm(false)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", background: "#000000", color: "#FFFFFF", fontSize: 13, fontWeight: 600, border: "1px solid #000000", borderRadius: 9, cursor: "pointer" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                      Submit suggestion
                    </HoverButton>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {PERSONAS.map((p) => (
                <div key={p.id} style={{ ...card, overflow: "hidden" }}>
                  <div style={{ height: 3, background: "#10A37F" }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid #BFBFBF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: "#000000", flexShrink: 0 }}>{p.name.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#000000", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</h3>
                        <p style={{ fontSize: 13, color: "#727272", margin: "2px 0 0" }}>{p.role}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: 600, color: "#000000" }}>{p.score}%</div>
                        <div style={{ fontSize: 11, color: "#A2A9B0" }}>Relevance</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "#333333", margin: "0 0 14px" }}>{p.description}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {p.tags.map((tag, i) => (<span key={i} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, border: thinBorder, background: "#F9F9F9", color: "#333333" }}>{tag}</span>))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 14, borderTop: thinBorder }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#727272" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                        <span style={{ fontSize: 12, color: "#727272" }}>{p.queries} queries</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#727272" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                        <span style={{ fontSize: 12, color: "#727272" }}>{p.mentions} mentions</span>
                      </div>
                      <div style={{ flex: 1 }} />
                      <HoverButton onClick={() => { setPersonaFilter(p.id); setActiveTab("queries"); }} style={{ fontSize: 12, fontWeight: 500, color: "#10A37F", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                        View queries
                      </HoverButton>
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
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#000000", margin: "0 0 4px" }}>All4Horses products &amp; services</h2>
                <p style={{ fontSize: 13, color: "#727272", margin: 0 }}>Brand presence per product and service - {(() => { const allP = [
                  { type: "Service" }, { type: "Service" }, { type: "Service" }, { type: "Service" }, { type: "Service" }, { type: "Product" }
                ]; return `${allP.filter(p => p.type === "Service").length} services, ${allP.filter(p => p.type === "Product").length} products`; })()}</p>
              </div>
            </div>

            {/* Products grouped: Services then Products */}
            {(() => {
              const allProducts = [
                { name: "Therapeutic riding", type: "Service", audience: "B2C", score: 82, queries: 15, mentioned: 12, topQuery: "Therapeutic horseback riding for children with ADHD" },
                { name: "Horse summer camp", type: "Service", audience: "B2C", score: 68, queries: 8, mentioned: 5, topQuery: "Horse summer camp 2026 central region" },
                { name: "Riding lessons", type: "Service", audience: "B2C", score: 75, queries: 11, mentioned: 9, topQuery: "Riding lessons for beginners pricing" },
                { name: "Riding gear", type: "Product", audience: "B2C", score: 45, queries: 6, mentioned: 2, topQuery: "Children's riding gear - what you need" },
                { name: "Horse tours", type: "Service", audience: "B2B+B2C", score: 71, queries: 9, mentioned: 7, topQuery: "Horse tours for team building" },
                { name: "Ranch events", type: "Service", audience: "B2B+B2C", score: 58, queries: 7, mentioned: 4, topQuery: "Birthday parties at a horse ranch" },
              ];
              const services = allProducts.filter((p) => p.type === "Service");
              const products = allProducts.filter((p) => p.type === "Product");

              const renderProductCard = (p: typeof allProducts[0], i: number) => (
                <div key={i} style={{ ...card, overflow: "hidden" }}>
                  <div style={{ height: 3, background: p.type === "Product" ? "#10A37F" : "#4285F4" }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#000000", margin: 0 }}>{p.name}</h3>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: p.type === "Product" ? "#10A37F15" : "#4285F415", color: p.type === "Product" ? "#10A37F" : "#4285F4", fontWeight: 500 }}>{p.type}</span>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: p.audience.includes("B2B") ? "#E0780015" : "#F9F9F9", color: p.audience.includes("B2B") ? "#E07800" : "#727272", fontWeight: 500, border: `1px solid ${p.audience.includes("B2B") ? "#E0780030" : "#DDDDDD"}` }}>{p.audience}</span>
                        </div>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: p.score >= 70 ? "#10A37F12" : "#F9F9F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: p.score >= 70 ? "#10A37F" : "#000000" }}>{p.score}%</span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                      <div style={{ textAlign: "center", padding: "6px 0", background: "#F9F9F9", borderRadius: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#000000" }}>{p.queries}</div>
                        <div style={{ fontSize: 11, color: "#727272" }}>Queries</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "6px 0", background: "#F9F9F9", borderRadius: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#10A37F" }}>{p.mentioned}</div>
                        <div style={{ fontSize: 11, color: "#727272" }}>Mentioned</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "6px 0", background: (p.queries - p.mentioned) > 3 ? "#FFF8F0" : "#F9F9F9", borderRadius: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: (p.queries - p.mentioned) > 3 ? "#E07800" : "#000000" }}>{p.queries - p.mentioned}</div>
                        <div style={{ fontSize: 11, color: "#727272" }}>Missing</div>
                      </div>
                    </div>
                    <div style={{ padding: 10, background: "#F9F9F9", borderRadius: 8, border: thinBorder }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#10A37F", margin: "0 0 4px" }}>Top query</p>
                      <p style={{ fontSize: 13, color: "#333333", margin: 0 }}>&quot;{p.topQuery}&quot;</p>
                    </div>
                  </div>
                </div>
              );

              return (
                <>
                  {/* Services section */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#000000", margin: 0 }}>Services</h3>
                      <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 10, background: "#F9F9F9", color: "#727272", border: thinBorder }}>{services.length}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                      {services.map((p, i) => renderProductCard(p, i))}
                    </div>
                  </div>

                  {/* Products section */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#000000", margin: 0 }}>Products</h3>
                      <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 10, background: "#F9F9F9", color: "#727272", border: thinBorder }}>{products.length}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                      {products.map((p, i) => renderProductCard(p, i))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* -- Footer -- */}
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
              <span key={i} style={{ fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 20, color: link.color, background: link.bg, cursor: "pointer", transition: "all 150ms" }}>{link.label}</span>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "#A2A9B0" }}>GeoScale 2026 &copy;</span>
        </div>
      </footer>
    </div>
  );
}
