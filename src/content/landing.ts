export type Stat = {
  value: string;
  label: string;
  detail?: string;
  source: string;
};

export const problemStats: Stat[] = [
  {
    value: "48%",
    label: "of parents say stress is completely overwhelming most days",
    detail: "vs 26% of other adults",
    source: "U.S. Surgeon General, 2024",
  },
  {
    value: "62%",
    label: "say parenting is harder than they expected",
    source: "Pew Research Center, 2023",
  },
  {
    value: "~2 in 3",
    label: "couples see relationship satisfaction drop after their first baby",
    source: "Gottman et al., cited by APA",
  },
  {
    value: "~6 years",
    label: "is how long couples typically wait before seeking help",
    source: "Gottman",
  },
];

export type UseCase = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  icon: "mood" | "compass" | "chat" | "voice" | "child" | "book";
};

export const useCases: UseCase[] = [
  {
    id: "mood",
    title: "Know how the team is doing.",
    description:
      "Each parent taps Sunny, Cloudy, or Rainy. Kinora keeps a private timeline and turns it into a useful forecast, not a score.",
    bullets: [
      "Ten seconds per parent, per day",
      "A private 7-day and 30-day timeline",
      "Share only what you choose",
    ],
    icon: "mood",
  },
  {
    id: "next",
    title: "Always know the next small step.",
    description:
      "Kinora reads the family's real state and suggests one useful action: a ten-minute reset, a bedtime handoff, a three-minute discovery.",
    bullets: [
      "Opens the page that does the work",
      "Matched to moods and what is in progress",
      "One suggestion, not a feed",
    ],
    icon: "compass",
  },
  {
    id: "assistant",
    title: "Ask about your family, not the internet.",
    description:
      "Ask about bedtime, a school decision, or what happened in your last session. Kinora answers with your family's context.",
    bullets: [
      "Grounded in your check-ins and sessions",
      "Warm, brief, and never a verdict",
      "Shows which memories it used",
    ],
    icon: "chat",
  },
  {
    id: "sessions",
    title: "Talk it through, together.",
    description:
      "Kinora leads a structured voice or text conversation, hears both sides, and ends with one agreement you can keep.",
    bullets: [
      "Voice or text, on one phone or two",
      "A built-in pause when things get heated",
      "A written summary and a next course",
    ],
    icon: "voice",
  },
  {
    id: "children",
    title: "See the child in front of you.",
    description:
      "Age-banded activities turn what you already notice into a strengths map: what comes naturally, where to make room, and what to try this week.",
    bullets: [
      "Picture choices for ages 2 to 5, richer scenarios for 6 to 13",
      "A conversation starter, never a diagnosis",
      "Retake every 90 days as they grow",
    ],
    icon: "child",
  },
  {
    id: "courses",
    title: "Practice in five-minute reps.",
    description:
      "Short courses on repair, emotion coaching, fair load, and screens. Each ends with a quiz and one real-life thing to try.",
    bullets: [
      "Six evidence-grounded courses",
      "Suggested after a session or inside the assistant",
      "Pick up exactly where you left off",
    ],
    icon: "book",
  },
];

export const dayInLife = [
  {
    time: "7:30",
    title: "Two taps at breakfast",
    body: "Michael marks Sunny. Lucy marks Cloudy. The timeline updates, and nothing is shared beyond the two of them.",
  },
  {
    time: "9:10",
    title: "One useful nudge",
    body: "Kinora suggests a ten-minute reset for Lucy and a concrete handoff for tonight. One idea, not a feed.",
  },
  {
    time: "16:45",
    title: "A missing piece",
    body: "Sophie's profile is still empty. The home screen offers a three-minute picture-based discovery, not a score.",
  },
  {
    time: "20:30",
    title: "Twenty minutes, together",
    body: "They start a voice session about bedtime. Kinora hears both sides and helps them choose one agreement.",
  },
  {
    time: "21:05",
    title: "Something to keep",
    body: "The agreement is saved to the family memory. A six-minute repair course is suggested for the weekend.",
  },
];

export const faqs = [
  {
    q: "Is Kinora therapy?",
    a: "No. Kinora is coaching and skills education for parents. It does not diagnose or treat mental-health conditions and is not a substitute for a licensed clinician. Sessions use evidence-informed communication skills, with crisis routing built in.",
  },
  {
    q: "Why voice, not just text?",
    a: "Text is easy to misread, especially when a conversation is tense. A voice session lets Kinora hear tone, give each parent equal airtime, and pause when either of you is flooded. If you prefer to write, every session also works as text.",
  },
  {
    q: "How are the children's assessments built?",
    a: "They are age-banded parent-observation activities inspired by established developmental frameworks, not a clinical instrument. Results are a conversation starter: strengths, stretch zones, interests, and things to try. Not a diagnosis, a label, or a prediction.",
  },
  {
    q: "What data do you store about my child?",
    a: "Only what you enter: a first name, a birth date, an avatar color, and your assessment answers. There are no child accounts. This demo stores data locally in your app session; a production deployment uses the included Supabase schema with row-level security.",
  },
  {
    q: "Do we need two phones?",
    a: "No. Put one phone between you. Kinora listens to the room, uses speaker detection to tell your voices apart, and guides the conversation in turns. If the room is unavailable, the session still works as text.",
  },
  {
    q: "How much will it cost?",
    a: "A Family License is $149 a year for both partners, about $12 a month. That is less than one couples-therapy session. The demo does not charge anyone.",
  },
];

export const sources = [
  {
    label: "U.S. Surgeon General: Parents Under Pressure (2024)",
    href: "https://www.hhs.gov/surgeongeneral/priorities/parents/",
  },
  {
    label: "Pew Research Center: Parenting in America Today (2023)",
    href: "https://www.pewresearch.org/social-trends/2023/01/24/parenting-in-america-today/",
  },
  {
    label: "Gottman: Managing conflict, flooding and repair",
    href: "https://www.gottman.com/blog/manage-conflict-part-4/",
  },
  {
    label: "Online parenting programs meta-analysis (2020)",
    href: "https://pubmed.ncbi.nlm.nih.gov/31697102/",
  },
  {
    label: "Family Foundations: Penn State",
    href: "https://prevention.psu.edu/projects/perinatal-intervention-and-long-term-outcomes-family-foundations",
  },
  {
    label: "COPPA: amended rule (2025)",
    href: "https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule",
  },
];
