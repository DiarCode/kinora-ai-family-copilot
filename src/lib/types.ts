export type MoodValue = "sunny" | "cloudy" | "rainy";

export type MoodEntry = {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  value: MoodValue;
  note?: string;
  createdAt: string;
};

export type Parent = {
  id: string;
  name: string;
  role: "husband" | "wife";
  avatarColor: string;
  pronouns: string;
};

export type Family = {
  id: string;
  name: string;
  createdAt: string;
  plan: "family" | "plus";
  members: Parent[];
};

export type TraitKey =
  | "creativity"
  | "analytical"
  | "social"
  | "emotional"
  | "physical"
  | "focus"
  | "leadership";

export type ChildProfile = {
  archetype: string;
  archetypeLine: string;
  summary: string;
  traits: Record<TraitKey, number>;
  strengths: string[];
  growth: string[];
  interests: string[];
  careerSeeds: string[];
  parentingTips: string[];
  activities: string[];
  completedAt: string;
  retakeAfter: string;
  assessmentId: string;
  ageBand: AgeBand;
};

export type AgeBand = "early" | "middle" | "teen";

export type AssessmentAnswer = {
  questionId: string;
  optionIndex: number;
};

export type Assessment = {
  id: string;
  childId: string;
  ageBand: AgeBand;
  answers: AssessmentAnswer[];
  traits: Record<TraitKey, number>;
  archetype: string;
  completedAt: string;
};

export type Child = {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  avatarColor: string;
  createdAt: string;
  profile?: ChildProfile;
  assessments: Assessment[];
  notes?: string;
};

export type SessionMode = "voice" | "text";
export type SessionStatus = "scheduled" | "active" | "completed";

export type TurnKind =
  | "question"
  | "reflection"
  | "agreement"
  | "safety"
  | "opening"
  | "closing";

export type Turn = {
  id: string;
  speakerId: "kinora" | string;
  speakerName: string;
  text: string;
  at: string;
  kind: TurnKind;
  /** who Kinora is inviting to speak next, when known */
  invite?: string;
  /** the phase of the coaching arc this turn belongs to */
  phase?: SessionPhase;
};

export type SessionPhase =
  | "opening"
  | "story"
  | "emotion"
  | "needs"
  | "common-ground"
  | "agreement"
  | "close"
  | "safety";

export type SessionSummary = {
  title: string;
  whatWeHeard: string;
  agreements: string[];
  nextStep: string;
  recommendedCourseSlug?: string;
  createdAt: string;
};

export type Session = {
  id: string;
  status: SessionStatus;
  mode: SessionMode;
  problem: string;
  createdAt: string;
  scheduledFor?: string;
  startedAt?: string;
  completedAt?: string;
  participants: string[];
  turns: Turn[];
  phase: SessionPhase;
  summary?: SessionSummary;
  acceptedAgreements?: string[];
  recommendedCourseSlug?: string;
  safetyFlagged?: boolean;
  roomName: string;
  title: string;
};

export type CourseCategory =
  | "Repair"
  | "Emotions"
  | "Team"
  | "Connection"
  | "Digital";

export type CourseSlide = {
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
  takeaway?: string;
};

export type CourseQuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  category: CourseCategory;
  minutes: number;
  icon: "heart" | "cloud" | "scale" | "sparkles" | "calendar" | "phone";
  accent: string;
  slides: CourseSlide[];
  quiz: CourseQuizQuestion[];
  suggestedFor: string[];
};

export type CourseProgress = {
  slug: string;
  slideIndex: number;
  startedAt: string;
  completedAt?: string;
  score?: number;
  total?: number;
  answers?: number[];
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: string;
  memoryUsed?: string[];
  flagged?: boolean;
};

export type AssistantThread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AssistantMessage[];
};

export type MemoryKind =
  | "mood"
  | "session"
  | "child"
  | "course"
  | "plan"
  | "agreement";

export type MemoryItem = {
  id: string;
  kind: MemoryKind;
  text: string;
  sourceId?: string;
  createdAt: string;
};

export type FamilyState = {
  version: number;
  family: Family;
  moods: MoodEntry[];
  children: Child[];
  sessions: Session[];
  courses: CourseProgress[];
  threads: AssistantThread[];
  memory: MemoryItem[];
  settings: {
    assistantName: string;
  };
};

export type NextAction = {
  id: string;
  title: string;
  description: string;
  reason: string;
  href: string;
  icon:
    | "sun"
    | "cloud"
    | "rain"
    | "calendar"
    | "heart"
    | "sparkles"
    | "user"
    | "book"
    | "voice";
  tone: "purple" | "sun" | "rain" | "cloud";
  priority: number;
};

export type StateResponse = {
  state: FamilyState;
  today: string;
  actions: NextAction[];
  ai?: { mode: "engine" | "llm"; model: string };
};
