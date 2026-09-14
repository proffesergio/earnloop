export type EarningCategory = "Microtasks" | "Surveys" | "Remote work" | "Freelance";

export type EarningOpportunity = {
  name: string;
  category: EarningCategory;
  availability: string;
  payout: string;
  effort: string;
  source: string;
  sourceLabel: string;
  description: string;
  safety: string;
};

export const earningOpportunities: EarningOpportunity[] = [
  { name: "Prolific", category: "Surveys", availability: "Many countries; eligibility varies", payout: "Cash via PayPal", effort: "Short research studies", source: "https://www.prolific.com/participants", sourceLabel: "Official participant page", description: "Academic and product research studies with transparent study information and participant screening.", safety: "Never pay to join. Complete your profile honestly and use only the official domain." },
  { name: "Clickworker", category: "Microtasks", availability: "Worldwide, subject to local availability", payout: "Payment methods vary by country", effort: "Categorisation, research and data tasks", source: "https://www.clickworker.com/clickworker-job/", sourceLabel: "Official worker information", description: "A task marketplace for research, data categorisation and other small digital jobs.", safety: "Check task fees and payment thresholds in your country before investing time." },
  { name: "UserTesting", category: "Microtasks", availability: "Selected countries and devices", payout: "Usually PayPal", effort: "Recorded product feedback", source: "https://www.usertesting.com/get-paid-to-test", sourceLabel: "Official contributor page", description: "Test websites and apps by speaking your thoughts while completing a scenario.", safety: "A legitimate test does not require your banking password, OTP or an upfront payment." },
  { name: "Upwork", category: "Freelance", availability: "Global freelance marketplace", payout: "Varies by contract and country", effort: "Proposal-based client work", source: "https://www.upwork.com/freelance-jobs/", sourceLabel: "Official jobs page", description: "Find project work in development, writing, design, marketing, data and operations.", safety: "Keep communication and payment on-platform until you understand the contract and terms." },
  { name: "We Work Remotely", category: "Remote work", availability: "Remote roles; location restrictions per listing", payout: "Employer salary", effort: "Application and interview process", source: "https://weworkremotely.com/", sourceLabel: "Official remote jobs board", description: "A global job board for full-time, contract and freelance remote roles.", safety: "Verify the employer's own careers page and never buy equipment or training from a recruiter." },
  { name: "Remotive", category: "Remote work", availability: "Global roles with listing-specific rules", payout: "Employer salary", effort: "Application and interview process", source: "https://remotive.com/remote-jobs", sourceLabel: "Official remote jobs board", description: "Curated remote opportunities across software, support, marketing, design and operations.", safety: "Treat requests for money, crypto or identity documents before an offer as a red flag." },
  { name: "Fiverr", category: "Freelance", availability: "Global seller marketplace", payout: "Varies by order", effort: "Productised services", source: "https://www.fiverr.com/start_selling", sourceLabel: "Official seller page", description: "Package a focused service such as thumbnail design, translation, editing or automation.", safety: "Use the platform inbox and delivery flow; do not move a buyer to an unverified payment link." },
  { name: "Amazon Mechanical Turk", category: "Microtasks", availability: "Worker access and tasks vary by country", payout: "Amazon or bank options vary", effort: "Human intelligence tasks", source: "https://www.mturk.com/worker", sourceLabel: "Official worker page", description: "Small data and research tasks posted by requesters on Amazon's marketplace.", safety: "Review requester approval history and effective hourly rate before accepting work." },
];

export const earningGuides = [
  { title: "The 30-minute opportunity audit", tag: "Start here", summary: "Compare a platform by effective hourly rate, payout rules, location and risk before you commit.", steps: ["Read the official worker terms and payout page.", "Calculate realistic time per task, including screening and rejection.", "Run a small test batch and record time, earnings and friction.", "Keep only opportunities that meet your personal minimum rate."] },
  { title: "Build a remote-work proof pack", tag: "Remote work", summary: "A compact portfolio, resume and work sample system that makes applications easier to repeat.", steps: ["Choose one role family and write a one-line outcome statement.", "Create two work samples with context, process and measurable result.", "Publish a simple portfolio or PDF with contact and availability.", "Track applications and improve one weak point each week."] },
  { title: "Turn one skill into a micro-service", tag: "Freelance", summary: "Productise a narrow service so clients can understand the outcome before a sales call.", steps: ["Pick one audience and one recurring problem.", "Define the input, deliverable, turnaround and revision boundary.", "Create three examples using original or permissioned material.", "Test the offer with ten targeted conversations and revise from evidence."] },
];
