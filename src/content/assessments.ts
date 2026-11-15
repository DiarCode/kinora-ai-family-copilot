import type { AgeBand, TraitKey } from "@/lib/types";

export type AssessmentOption = {
  label: string;
  emoji: string;
  weights: Partial<Record<TraitKey, number>>;
};

export type AssessmentQuestion = {
  id: string;
  prompt: string;
  helper?: string;
  options: AssessmentOption[];
};

export type AssessmentBand = {
  id: AgeBand;
  name: string;
  ages: string;
  minAge: number;
  maxAge: number;
  intro: string;
  note: string;
  questions: AssessmentQuestion[];
};

const LIKERT: AssessmentOption[] = [
  { label: "Almost never", emoji: "🌑", weights: { creativity: 0, analytical: 0, social: 0, emotional: 0, physical: 0, focus: 0, leadership: 0 } },
  { label: "Sometimes", emoji: "🌓", weights: { creativity: 1, analytical: 1, social: 1, emotional: 1, physical: 1, focus: 1, leadership: 1 } },
  { label: "Often", emoji: "🌕", weights: { creativity: 2, analytical: 2, social: 2, emotional: 2, physical: 2, focus: 2, leadership: 2 } },
  { label: "Almost always", emoji: "✨", weights: { creativity: 3, analytical: 3, social: 3, emotional: 3, physical: 3, focus: 3, leadership: 3 } },
];

/** Re-map a Likert option set so only one trait is scored. */
const likertFor = (trait: TraitKey): AssessmentOption[] =>
  LIKERT.map((option) => ({
    label: option.label,
    emoji: option.emoji,
    weights: { [trait]: option.weights[trait] ?? 0 },
  }));

export const assessmentBands: AssessmentBand[] = [
  {
    id: "early",
    name: "Little Explorer",
    ages: "Ages 2–5",
    minAge: 2,
    maxAge: 5,
    intro:
      "Six picture-first questions about what you have noticed. There are no wrong answers — pick what feels most like your child on an ordinary day.",
    note: "Parent observation · about 2 minutes",
    questions: [
      {
        id: "early-new-box",
        prompt: "A new box arrives. What does {name} do first?",
        options: [
          { label: "Turns it into a castle, a car, or a secret cave", emoji: "🏰", weights: { creativity: 3, leadership: 1 } },
          { label: "Opens it carefully and sorts what is inside", emoji: "🧩", weights: { analytical: 3, focus: 2 } },
          { label: "Calls someone over to open it together", emoji: "🤝", weights: { social: 3, emotional: 1 } },
        ],
      },
      {
        id: "early-friend-crying",
        prompt: "A friend is crying. {name}…",
        options: [
          { label: "Goes over to comfort them", emoji: "🫂", weights: { emotional: 3, social: 2 } },
          { label: "Tries to make them laugh", emoji: "🤡", weights: { creativity: 2, social: 2, emotional: 1 } },
          { label: "Watches, then finds a grown-up", emoji: "👀", weights: { analytical: 2, emotional: 1, social: 1 } },
        ],
      },
      {
        id: "early-play",
        prompt: "Which sounds most like playtime with {name}?",
        options: [
          { label: "Pretend worlds with characters and voices", emoji: "🎭", weights: { creativity: 3, emotional: 1 } },
          { label: "Puzzles, blocks, or taking things apart", emoji: "🔧", weights: { analytical: 3, focus: 3 } },
          { label: "Running, climbing, dancing, rough-and-tumble", emoji: "🏃", weights: { physical: 3, social: 1 } },
        ],
      },
      {
        id: "early-loses-game",
        prompt: "A game does not go {name}'s way. {name}…",
        options: [
          { label: "Feels it big and needs a cuddle", emoji: "😢", weights: { emotional: 3, social: 1 } },
          { label: "Wants to try again right away", emoji: "🔁", weights: { focus: 2, analytical: 2, physical: 1 } },
          { label: "Invents a new game or changes the rules", emoji: "💡", weights: { creativity: 3, leadership: 2 } },
        ],
      },
      {
        id: "early-group",
        prompt: "In a group of children, {name} usually…",
        options: [
          { label: "Takes charge of the game", emoji: "👑", weights: { leadership: 3, social: 1 } },
          { label: "Joins in and follows the group", emoji: "🎈", weights: { social: 3, emotional: 1 } },
          { label: "Plays nearby in their own world", emoji: "🌙", weights: { focus: 2, creativity: 2 } },
        ],
      },
      {
        id: "early-best-ten",
        prompt: "The best ten minutes with {name} looks like…",
        options: [
          { label: "Making up a story together", emoji: "📖", weights: { creativity: 2, emotional: 2 } },
          { label: "Building or solving something side by side", emoji: "🧱", weights: { analytical: 2, focus: 2 } },
          { label: "A race, a dance party, or a trip to the park", emoji: "⚽", weights: { physical: 3, social: 1 } },
        ],
      },
    ],
  },
  {
    id: "middle",
    name: "Discovery Quest",
    ages: "Ages 6–9",
    minAge: 6,
    maxAge: 9,
    intro:
      "Ten everyday scenarios. Choose the response that sounds most like {name}. Think about the last month, not a single unusual day.",
    note: "Parent observation · about 3 minutes",
    questions: [
      {
        id: "middle-project",
        prompt: "A school project is assigned. {name} is most excited to…",
        options: [
          { label: "Make it look and feel original", emoji: "🎨", weights: { creativity: 3, leadership: 1 } },
          { label: "Research the topic and make a plan", emoji: "🔎", weights: { analytical: 3, focus: 2 } },
          { label: "Work with a friend or present to the class", emoji: "🗣️", weights: { social: 3, leadership: 2 } },
        ],
      },
      {
        id: "middle-free-afternoon",
        prompt: "A free afternoon at home. {name} gravitates toward…",
        options: [
          { label: "Inventing a game, comic, or project", emoji: "🚀", weights: { creativity: 3, focus: 1 } },
          { label: "Finishing a LEGO set, puzzle, or level", emoji: "🧱", weights: { focus: 3, analytical: 2 } },
          { label: "Being outside, moving, or playing a sport", emoji: "🌳", weights: { physical: 3, social: 1 } },
        ],
      },
      {
        id: "middle-disagreement",
        prompt: "A disagreement with a friend. {name} tends to…",
        options: [
          { label: "Talk it through and repair quickly", emoji: "💬", weights: { social: 2, emotional: 2, leadership: 1 } },
          { label: "Need some time alone first", emoji: "🚪", weights: { emotional: 2, focus: 2 } },
          { label: "Suggest a compromise or a new plan", emoji: "⚖️", weights: { leadership: 3, analytical: 1 } },
        ],
      },
      {
        id: "middle-homework",
        prompt: "Homework gets hard. {name}…",
        options: [
          { label: "Keeps trying until it clicks", emoji: "💪", weights: { focus: 3, analytical: 1 } },
          { label: "Asks for help or works with someone", emoji: "🙋", weights: { social: 3, emotional: 1 } },
          { label: "Tries a completely different approach", emoji: "🧠", weights: { creativity: 2, analytical: 2 } },
        ],
      },
      {
        id: "middle-parent-upset",
        prompt: "You are having a hard day. {name}…",
        options: [
          { label: "Notices and comes to comfort you", emoji: "❤️", weights: { emotional: 3, social: 1 } },
          { label: "Asks what happened and wants details", emoji: "❓", weights: { analytical: 2, social: 2 } },
          { label: "Tries to distract you or make you laugh", emoji: "😄", weights: { creativity: 2, social: 2 } },
        ],
      },
      {
        id: "middle-group-work",
        prompt: "In group work at school, {name} is the one who…",
        options: [
          { label: "Takes charge and keeps everyone on task", emoji: "📋", weights: { leadership: 3, focus: 1 } },
          { label: "Makes sure quieter kids are included", emoji: "🤲", weights: { social: 2, emotional: 3 } },
          { label: "Comes up with the big idea", emoji: "💡", weights: { creativity: 3, leadership: 1 } },
        ],
      },
      {
        id: "middle-new-sport",
        prompt: "A new sport or game is introduced. {name}…",
        options: [
          { label: "Jumps in and learns by doing", emoji: "🏃", weights: { physical: 3, focus: 1 } },
          { label: "Watches first and learns the rules", emoji: "👀", weights: { analytical: 3, focus: 1 } },
          { label: "Wants a friend to try it with them", emoji: "👫", weights: { social: 3, emotional: 1 } },
        ],
      },
      {
        id: "middle-loses",
        prompt: "After losing a competition, {name}…",
        options: [
          { label: "Wants to practice and get better", emoji: "🎯", weights: { focus: 2, physical: 2, analytical: 1 } },
          { label: "Talks about what felt unfair", emoji: "🗯️", weights: { emotional: 3, leadership: 1 } },
          { label: "Shrugs it off and moves to the next thing", emoji: "🌈", weights: { creativity: 2, emotional: 1 } },
        ],
      },
      {
        id: "middle-favorite-story",
        prompt: "{name}'s favorite stories or shows are mostly about…",
        options: [
          { label: "Fantasy worlds, magic, and big imagination", emoji: "🪄", weights: { creativity: 3, emotional: 1 } },
          { label: "Facts, inventions, and how things work", emoji: "⚙️", weights: { analytical: 3, focus: 1 } },
          { label: "People, friendships, and feelings", emoji: "💞", weights: { emotional: 3, social: 2 } },
        ],
      },
      {
        id: "middle-big-feeling",
        prompt: "When a big feeling hits, {name} usually…",
        options: [
          { label: "Can name it and talk about it", emoji: "🗣️", weights: { emotional: 3, social: 1 } },
          { label: "Wants a hug or to be close", emoji: "🫂", weights: { emotional: 2, social: 2 } },
          { label: "Needs to move, build, or do something with their hands", emoji: "🤸", weights: { physical: 3, focus: 1 } },
        ],
      },
    ],
  },
  {
    id: "teen",
    name: "Potential Map",
    ages: "Ages 10–13",
    minAge: 10,
    maxAge: 13,
    intro:
      "Twelve statements about the last month. Answer from what you actually see, not what you hope is true. Your child's own view can be added later.",
    note: "Parent observation · about 3 minutes",
    questions: [
      { id: "teen-ideas", prompt: "{name} invents original ideas, projects, or ways of doing things.", options: likertFor("creativity") },
      { id: "teen-patterns", prompt: "{name} notices patterns, inconsistencies, or how things work.", options: likertFor("analytical") },
      { id: "teen-friends", prompt: "{name} starts conversations and keeps friendships going.", options: likertFor("social") },
      { id: "teen-feelings", prompt: "{name} can name what they are feeling and why.", options: likertFor("emotional") },
      { id: "teen-movement", prompt: "{name} seeks movement, sport, or hands-on activity.", options: likertFor("physical") },
      { id: "teen-focus", prompt: "{name} sticks with a hard task for 30 minutes or more.", options: likertFor("focus") },
      { id: "teen-organizes", prompt: "{name} organizes group activities or takes responsibility.", options: likertFor("leadership") },
      { id: "teen-why", prompt: "{name} asks “why” and wants evidence before accepting an answer.", options: likertFor("analytical") },
      { id: "teen-makes", prompt: "{name} makes art, stories, music, or builds things for fun.", options: likertFor("creativity") },
      { id: "teen-notices", prompt: "{name} checks in on how other people feel.", options: likertFor("emotional") },
      { id: "teen-recovers", prompt: "{name} recovers after a setback without giving up on themselves.", options: likertFor("focus") },
      { id: "teen-team", prompt: "{name} steps up when a group needs direction.", options: likertFor("leadership") },
    ],
  },
];

export const bandForAge = (age: number): AssessmentBand => {
  if (age >= 10) return assessmentBands[2];
  if (age >= 6) return assessmentBands[1];
  return assessmentBands[0];
};

export const bandById = (id: AgeBand): AssessmentBand =>
  assessmentBands.find((band) => band.id === id) ?? assessmentBands[0];

export const traitLabels: Record<TraitKey, string> = {
  creativity: "Creativity",
  analytical: "Analytical thinking",
  social: "Social connection",
  emotional: "Emotional awareness",
  physical: "Physical energy",
  focus: "Focus & persistence",
  leadership: "Leadership",
};

export const traitShort: Record<TraitKey, string> = {
  creativity: "Imagines",
  analytical: "Figures out",
  social: "Connects",
  emotional: "Feels deeply",
  physical: "Moves",
  focus: "Sticks with it",
  leadership: "Leads",
};

export const traitDescriptions: Record<TraitKey, string> = {
  creativity:
    "Generates original ideas, turns ordinary materials into something new, and thinks in possibilities.",
  analytical:
    "Looks for patterns and reasons, asks how things work, and likes to understand the rules before playing.",
  social:
    "Energized by people, quick to include others, and able to keep a group connected.",
  emotional:
    "Notices feelings — their own and other people's — and makes sense of them through words or play.",
  physical:
    "Learns by doing, needs movement, and often understands a challenge best with their body.",
  focus:
    "Can stay with a task, return after a setback, and take satisfaction in finishing something hard.",
  leadership:
    "Sees what a group needs, offers direction, and is willing to take responsibility for the outcome.",
};

export const traitStretchTips: Record<TraitKey, string> = {
  creativity:
    "Offer open-ended materials with no right answer — a box, tape, paper, and ten minutes of your attention.",
  analytical:
    "Wonder aloud together: “How do you think that works?” Let them test a theory before you explain.",
  social:
    "Set up one small, low-pressure playdate or a family game where everyone has a role.",
  emotional:
    "Name feelings in the wild — yours included — and ask, “What do you think that character felt?”",
  physical:
    "Put movement before hard sitting tasks: a run, a dance, or ten jumping jacks can reset attention.",
  focus:
    "Protect one longer block of uninterrupted play or work each day, and narrate the effort, not just the result.",
  leadership:
    "Give them one real decision to own this week — a meal, a family outing, or the plan for Sunday.",
};

export const traitInterestSeeds: Record<TraitKey, string[]> = {
  creativity: ["Storytelling and comics", "Drawing, music, or making", "Building imaginary worlds"],
  analytical: ["Puzzles and strategy games", "Science experiments", "Coding and how-things-work kits"],
  social: ["Team games and clubs", "Hosting friends", "Group projects and performances"],
  emotional: ["Journaling or feelings charts", "Caring for pets or younger kids", "Books with rich characters"],
  physical: ["Sports and movement games", "Outdoor challenges", "Dance, martial arts, or climbing"],
  focus: ["LEGO and model building", "Chess and logic puzzles", "Long-form projects with a finish line"],
  leadership: ["Planning family events", "Student council or group roles", "Teaching a skill to someone else"],
};

export const traitCareerSeeds: Record<TraitKey, string[]> = {
  creativity: ["Designer or filmmaker", "Writer or storyteller", "Product inventor"],
  analytical: ["Engineer or scientist", "Data analyst or researcher", "Architect"],
  social: ["Teacher or coach", "Community organizer", "People-facing product roles"],
  emotional: ["Counselor or psychologist", "Healthcare or care work", "Mediator or people leader"],
  physical: ["Athlete or coach", "Surgeon or physiotherapist", "Outdoor or trades work"],
  focus: ["Researcher or engineer", "Surgeon or pilot", "Craftsperson or builder"],
  leadership: ["Team lead or founder", "Teacher or principal", "Public service or law"],
};

export const traitActivitySeeds: Record<TraitKey, string> = {
  creativity: "Make a ten-minute comic together where {name} invents the hero.",
  analytical: "Build a small experiment: which paper airplane flies farthest, and why?",
  social: "Invite one friend for a simple two-hour playdate and let {name} plan one activity.",
  emotional: "Do a feelings check-in at dinner: one proud moment, one hard moment, one hope.",
  physical: "Go outside for a ten-minute obstacle course — {name} designs the rules.",
  focus: "Choose one long project for the week and protect a daily 15-minute block for it.",
  leadership: "Let {name} plan one family evening end to end, with a small budget and a timeline.",
};

export const PAIR_ARCHETYPES: Record<string, { name: string; line: string }> = {
  "analytical+creativity": { name: "The Inventor", line: "Imagines freely, then wants to know if it actually works." },
  "creativity+social": { name: "The Storyteller", line: "Turns ideas into experiences other people want to join." },
  "creativity+emotional": { name: "The Dreamer", line: "Feels deeply and gives those feelings a shape — stories, art, play." },
  "creativity+physical": { name: "The Maker in Motion", line: "Thinks with their hands and learns by building, moving, and trying." },
  "creativity+focus": { name: "The Deep Diver", line: "Follows an idea all the way down and comes back with something original." },
  "creativity+leadership": { name: "The Creative Director", line: "Sees a new possibility and gathers people around it." },
  "analytical+social": { name: "The Collaborator", line: "Thinks clearly and brings other people's thinking into the room." },
  "analytical+emotional": { name: "The Thoughtful Analyst", line: "Wants to understand both the mechanism and the human experience." },
  "analytical+physical": { name: "The Problem Solver", line: "Learns by testing, building, and figuring out how things work in the real world." },
  "analytical+focus": { name: "The Builder", line: "Patient, systematic, and happiest with a problem that takes real time." },
  "analytical+leadership": { name: "The Strategist", line: "Sees the whole board and wants to make a plan others can follow." },
  "emotional+social": { name: "The Connector", line: "Reads the room, includes people, and keeps relationships warm." },
  "physical+social": { name: "The Team Captain", line: "Energized by people and movement; brings a group together through play." },
  "focus+social": { name: "The Listen & Learn", line: "Pays attention, remembers details, and builds trust over time." },
  "leadership+social": { name: "The Natural Leader", line: "Steps forward when a group needs direction and brings people with them." },
  "emotional+physical": { name: "The Brave Heart", line: "Feels strongly and meets those feelings with action and courage." },
  "emotional+focus": { name: "The Quiet Observer", line: "Notices what others miss and sits with complexity before speaking." },
  "emotional+leadership": { name: "The Care Captain", line: "Leads with empathy and takes responsibility for how others feel." },
  "focus+physical": { name: "The Athlete", line: "Builds mastery through repetition, practice, and physical challenge." },
  "leadership+physical": { name: "The Trailblazer", line: "Moves first, takes the risk, and makes the path easier for everyone behind." },
  "focus+leadership": { name: "The Quarterback", line: "Sees the plan, stays with it, and helps the team execute." },
};

export const pickArchetype = (traits: Record<TraitKey, number>) => {
  const ordered = (Object.keys(traits) as TraitKey[]).sort(
    (a, b) => traits[b] - traits[a],
  );
  const key = [ordered[0], ordered[1]].sort().join("+");
  return (
    PAIR_ARCHETYPES[key] ?? {
      name: "The Explorer",
      line: "Curious across many kinds of play, still discovering where their energy gathers.",
    }
  );
};
