import type { EarnLoopSideHustle } from "@/types/earnloop";

export const hustleSeed: EarnLoopSideHustle[] = [
  {
    schemaVersion: "1.0.0",
    slug: "printable-planners-canva-gemini",
    title: "Sell AI-designed printable planners on Etsy",
    summary:
      "Use Gemini and Canva to ship one niche planner, list it, and collect your first five dollars without holding inventory.",
    category: "commerce",
    difficulty: "easy",
    setupHoursBand: "2-8",
    capitalBand: "0",
    aiTools: ["gemini", "canva", "chatgpt"],
    tags: ["etsy", "printables", "zero-capital"],
    heroMetric: "First listing in one focused afternoon",
    overview:
      "You are not building a planner empire on day one. You pick a narrow buyer (exam season, Ramadan fasting log, freelance invoice week), generate a structured interior with Gemini, lay it out in Canva, export PDF, and list with honest photos. Income is not guaranteed; the loop is listing quality plus a handful of genuine reviews.",
    audience: {
      for: [
        "People who can spend 3–6 hours at a laptop",
        "Anyone comfortable with Canva Free",
        "Sellers who will write a specific listing, not 'best planner ever'"
      ],
      notFor: [
        "Anyone expecting sales with zero marketing",
        "People unwilling to check copyright on icons"
      ]
    },
    blueprint: [
      {
        order: 1,
        title: "Pick a buyer who already searches",
        body:
          "Write one sentence: who, when, and what they need dated. Example: 'Final-year students who need an 8-week revision timetable they can print at home.' Reject generic 'productivity'.",
        effortMinutes: 25,
        isFreePreview: true
      },
      {
        order: 2,
        title: "Draft the interior structure",
        body:
          "List 8–12 page types (cover, how to use, weekly, habit, notes). Keep page count under 30 for v1 so you actually finish.",
        effortMinutes: 40,
        isFreePreview: true
      },
      {
        order: 3,
        title: "Generate copy and layout prompts",
        body:
          "Run the gated prompts. Paste Gemini output into Canva. Use free fonts only. Export print-ready PDF (A4 and US Letter).",
        effortMinutes: 90,
        isFreePreview: false
      },
      {
        order: 4,
        title: "List and ask for one proof",
        body:
          "Upload to Etsy or a Gumroad link. Price modestly. Share with three real people and save the listing URL as your EarnLoop proof.",
        effortMinutes: 50,
        isFreePreview: false
      }
    ],
    prompts: [
      {
        title: "Niche validator",
        tool: "gemini",
        gated: false,
        prompt:
          "I want to sell a printable planner. Buyer: {{buyer}}. Season or constraint: {{constraint}}. List 10 specific Etsy-style titles that a real person might search. Flag any that sound like trademarked exam boards. Then pick the strongest 3 and explain why in one sentence each."
      },
      {
        title: "Interior page spec",
        tool: "gemini",
        gated: true,
        prompt:
          "Create a page-by-page spec for a {{pageCount}}-page printable for {{buyer}}. For each page: purpose, sections, empty fields the user fills, and a Canva layout hint (columns, checkboxes). No medical or financial advice. Tone: calm, practical."
      }
    ],
    monetization: {
      model: "Digital product, one SKU, then variations",
      steps: [
        "Sell the PDF (Etsy or Gumroad)",
        "Add a dated version each quarter",
        "Bundle three related printables after 10 sales"
      ],
      affiliateNotes: "If you recommend Canva Pro, disclose the affiliate link."
    },
    metrics: {
      leading: ["Listing live", "10 product photos", "3 human shares"],
      lagging: ["First paid order", "5 reviews over 90 days"]
    },
    xpCompletion: 80,
    seo: {
      title: "Sell printable planners with Gemini and Canva",
      description:
        "A realistic EarnLoop blueprint: niche, layout, list, and log proof of your first digital product."
    }
  },
  {
    schemaVersion: "1.0.0",
    slug: "local-ai-brand-gig",
    title: "Package a local AI brand refresh for small businesses",
    summary:
      "Use a simple offer for profile refreshes, short-form hooks, and a one-page service site to win your first local client.",
    category: "freelance",
    difficulty: "medium",
    setupHoursBand: "2-8",
    capitalBand: "1-50",
    aiTools: ["chatgpt", "gemini", "canva"],
    tags: ["local business", "design", "lead gen"],
    heroMetric: "One service package, three demo posts, one first client",
    overview:
      "The strongest local offer is not 'AI marketing' in general. It is a specific problem like 'show up better on Google Maps and Instagram.' You build a mini brand kit for a dentist, cafe, or clinic, then offer a fast turnaround with a fixed scope. A few clean before-and-after samples are worth more than a big pitch deck.",
    audience: {
      for: [
        "People with some design or copywriting comfort",
        "Service workers who want recurring retainers",
        "Operators who can do one call and one revision"
      ],
      notFor: [
        "People who want a passive SaaS business",
        "Anyone who cannot tolerate quick client feedback rounds"
      ]
    },
    blueprint: [
      {
        order: 1,
        title: "Choose one vertical and one promise",
        body:
          "Pick one niche like clinics, law offices, or cafes. Focus on a clear promise: more calls, more bookings, or more profile trust.",
        effortMinutes: 30,
        isFreePreview: true
      },
      {
        order: 2,
        title: "Create a mini portfolio",
        body:
          "Make three sample posts and one profile banner for a mock local business. Show the before, the offer, and the result in plain copy.",
        effortMinutes: 60,
        isFreePreview: true
      },
      {
        order: 3,
        title: "Package a fixed-scope service",
        body:
          "Offer a 'Google Business Profile + 3 story posts + one landing section' sprint for a fee. Write the deliverables and timeline up front.",
        effortMinutes: 75,
        isFreePreview: false
      },
      {
        order: 4,
        title: "Pitch with proof",
        body:
          "Reach out to 15 businesses with a short message and your mock sample. Keep a spreadsheet and track replies, not just leads.",
        effortMinutes: 45,
        isFreePreview: false
      }
    ],
    prompts: [
      {
        title: "Offer write-up",
        tool: "chatgpt",
        gated: false,
        prompt:
          "Write a concise offer for a local business brand refresh. Audience: {{business_type}}. Offer: {{deliverables}}. Keep the tone practical, not flashy. Include a guarantee, pricing range, and a short CTA."
      },
      {
        title: "Sample content pack",
        tool: "gemini",
        gated: true,
        prompt:
          "Generate 3 social media caption ideas and 1 profile bio for {{business_name}} in {{city}}. Make them local, trust-focused, and conversion-oriented. Include hooks and call-to-action variants."
      }
    ],
    monetization: {
      model: "Fixed-scope local service packages with monthly retention",
      steps: [
        "Sell a sprint package",
        "Add monthly post support",
        "Upsell a review or ad creative bundle"
      ],
      affiliateNotes: "Mention any software you recommend but keep the package simple and honest."
    },
    metrics: {
      leading: ["15 outreach messages", "3 sample assets", "1 booked discovery call"],
      lagging: ["First paid client", "2 repeat monthly retainer clients"]
    },
    xpCompletion: 95,
    seo: {
      title: "Start a local AI brand refresh service without a full agency",
      description:
        "A compact EarnLoop blueprint for packaged local design and content services using AI tooling."
    }
  },
  {
    schemaVersion: "1.0.0",
    slug: "micro-digital-bundle",
    title: "Build a niche digital bundle and sell it as a starter kit",
    summary:
      "Turn a real process like mock interview prep or small business checklists into a paid bundle with a clear buyer problem.",
    category: "content",
    difficulty: "easy",
    setupHoursBand: "0-2",
    capitalBand: "0",
    aiTools: ["chatgpt", "notion", "canva"],
    tags: ["digital products", "notion", "bundle"],
    heroMetric: "One simple bundle, one real buyer, one tidy funnel",
    overview:
      "A good digital bundle is not a giant library. It is a focused outcome for a specific person with a measurable pain point. You use AI to generate the structure, refine it with your own judgement, and package it in a clean format. EarnLoop rewards shipped artifacts over perfect ideas.",
    audience: {
      for: [
        "People with a niche audience or personal experience",
        "Creators who already have a process they reuse",
        "Builders who can format a PDF or Notion pack"
      ],
      notFor: [
        "Anyone chasing a 'viral template' without a buyer",
        "People unwilling to test a small offer first"
      ]
    },
    blueprint: [
      {
        order: 1,
        title: "Choose a painful process",
        body:
          "Write down a repeated task from your own experience. Example: applying for remote jobs, making a portfolio, or managing customer follow-up.",
        effortMinutes: 20,
        isFreePreview: true
      },
      {
        order: 2,
        title: "Turn it into an end-user checklist",
        body:
          "Turn the process into a tidy resource: worksheets, templates, prompts, and example outputs. Keep it specific and readable.",
        effortMinutes: 45,
        isFreePreview: true
      },
      {
        order: 3,
        title: "Package and test the offer",
        body:
          "Upload a simple landing page or Gumroad listing. Use one price point and ask for feedback from three real prospects.",
        effortMinutes: 80,
        isFreePreview: false
      },
      {
        order: 4,
        title: "Improve from proof",
        body:
          "Review questions, friction, and objections. Update the bundle to remove confusion before adding more pages or tools.",
        effortMinutes: 30,
        isFreePreview: false
      }
    ],
    prompts: [
      {
        title: "Bundle outline",
        tool: "chatgpt",
        gated: false,
        prompt:
          "Create a digital bundle outline for {{audience}} struggling with {{pain_point}}. Include 5 sections, a problem-solution structure, a pricing angle, and three CTA variations."
      },
      {
        title: "Checklist draft",
        tool: "notion",
        gated: true,
        prompt:
          "Turn the process of {{process}} into a step-by-step checklist with success criteria, common mistakes, and a simple review rubric. Keep it practical and beginner-friendly."
      }
    ],
    monetization: {
      model: "Starter bundle sold as a one-time digital product",
      steps: [
        "Sell a single problem-solving bundle",
        "Bundle three related packs after 5 sales",
        "Offer a setup call or template update as premium add-on"
      ],
      affiliateNotes: "Disclose any tool referral links clearly in the product footer."
    },
    metrics: {
      leading: ["Buyer problem defined", "Bundle outline tested", "Three feedback calls"],
      lagging: ["First sale", "Five repeat buyers or referrals"]
    },
    xpCompletion: 65,
    seo: {
      title: "Build a small digital bundle people actually buy",
      description:
        "Use AI to package a focused process into a digital product with a real buyer and clear outcomes."
    }
  }
];

export function getHustleBySlug(slug: string): EarnLoopSideHustle | null {
  return hustleSeed.find((item) => item.slug === slug) ?? null;
}
