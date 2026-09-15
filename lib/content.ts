export type EditorialPost = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  takeaways: string[];
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

export const editorialPosts: EditorialPost[] = [
  {
    slug: "first-dollar-content-service",
    title: "The first-dollar content service: sell a useful week, not a vague retainer",
    dek: "A practical way to turn writing, design, or research skills into a small offer a local business can understand and test.",
    category: "Services",
    readTime: "6 min read",
    publishedAt: "September 12, 2026",
    author: "EarnLoop editorial",
    takeaways: [
      "Choose one buyer and one recurring publishing problem.",
      "Package a seven-day outcome with a fixed number of assets.",
      "Use a sample week as proof before pitching a monthly plan.",
    ],
    sections: [
      { heading: "Start with the calendar gap", paragraphs: ["Small businesses rarely need an abstract content strategy. They need next week’s posts, a sharper offer, and fewer blank spaces in their calendar.", "Pick a buyer you can observe: a cafe, tutor, salon, repair shop, or independent professional. Review its public page and note three questions customers ask repeatedly. Those questions become your first content brief."] },
      { heading: "Make the first offer deliberately small", paragraphs: ["Offer five captions, two simple visuals, and one call-to-action rewrite delivered in seven days. State what the buyer provides, what you deliver, how many revisions are included, and what you do not promise.", "A small package gives you a useful constraint: you can finish it, learn what takes time, and collect a before-and-after example without pretending to be a full agency."] },
      { heading: "Build proof before chasing scale", paragraphs: ["Create one sample week for a real or clearly labelled fictional business. Show the reasoning behind each post and use original or permissioned assets.", "After delivery, ask which post created a reply, booking, or useful question. That evidence is more valuable than follower counts and tells you whether the offer should become a repeatable loop."] },
    ],
  },
  {
    slug: "newsletter-without-audience",
    title: "How to test a useful newsletter before you have an audience",
    dek: "A no-hype validation loop for turning one narrow information problem into a weekly email people may actually open.",
    category: "Audience",
    readTime: "5 min read",
    publishedAt: "September 8, 2026",
    author: "EarnLoop editorial",
    takeaways: [
      "Solve a recurring decision, not a broad topic.",
      "Publish three issues before redesigning the brand.",
      "Ask for replies and referrals before buying distribution.",
    ],
    sections: [
      { heading: "Narrow the promise", paragraphs: ["“Business news” is not a useful newsletter promise. “Three funding and tool changes for independent designers every Friday” is specific enough to test.", "Choose a reader who already spends time finding this information. Your early advantage is not reach; it is saving one person a repeated search."] },
      { heading: "Ship a three-issue test", paragraphs: ["Write three issues with the same structure: one important change, two useful links, one action the reader can take this week. Keep the format plain and make every link earn its place.", "Send each issue to a small, permission-based list. Ask one question at the end: what did you use, what was missing, or what should be checked next?"] },
      { heading: "Turn replies into the next loop", paragraphs: ["Replies reveal whether the newsletter is becoming a habit. Track replies, forwards, and link clicks alongside unsubscribes; do not treat a large list with no response as traction.", "If readers repeatedly ask for a template, checklist, or research service, that request may become the paid offer. The newsletter is then evidence, not the entire business model."] },
    ],
  },
  {
    slug: "ai-assisted-market-research",
    title: "Use AI for market research without outsourcing your judgment",
    dek: "A repeatable workflow for collecting customer language, spotting patterns, and avoiding confident nonsense in your next offer.",
    category: "AI workflow",
    readTime: "7 min read",
    publishedAt: "September 3, 2026",
    author: "EarnLoop editorial",
    takeaways: [
      "Collect real language before asking for summaries.",
      "Separate observed facts from AI-generated hypotheses.",
      "Validate the most important assumption with a human conversation.",
    ],
    sections: [
      { heading: "Bring evidence into the prompt", paragraphs: ["AI can organise customer language quickly, but it cannot make a weak source set reliable. Collect reviews, public questions, support threads, and interview notes that you are allowed to use.", "Ask the model to cluster exact phrases, count recurring pain points, and quote the source text. Keep the source beside the summary so you can check every strong claim."] },
      { heading: "Label the leap", paragraphs: ["A recurring complaint is an observation. “People will pay for this solution” is a hypothesis. Ask AI to label each conclusion as observed, inferred, or unverified.", "This simple separation makes the output more useful: you can turn unverified claims into questions for a call, landing-page test, or small paid pilot."] },
      { heading: "Close with one human check", paragraphs: ["Choose the riskiest assumption and ask five people who fit the audience about their current workaround. Do not lead with your proposed product.", "A good research loop ends in a decision: continue, narrow the buyer, change the offer, or stop. The goal is not a polished report; it is a cheaper next step."] },
    ],
  },
];

export function getEditorialPost(slug: string): EditorialPost | undefined {
  return editorialPosts.find((post) => post.slug === slug);
}
