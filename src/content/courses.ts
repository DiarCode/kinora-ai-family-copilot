import type { Course } from "@/lib/types";

export const courses: Course[] = [
  {
    slug: "repair-after-the-storm",
    title: "Repair After the Storm",
    subtitle:
      "The 20-minute pause and the conversation that makes conflict safe for your child.",
    category: "Repair",
    minutes: 6,
    icon: "heart",
    accent: "#B089FD",
    suggestedFor: ["Arguments that keep repeating", "Tension after a fight", "Parenting as a team"],
    slides: [
      {
        eyebrow: "The reframe",
        title: "Conflict is not the injury. Unrepaired conflict is.",
        body: "Children do not need parents who never disagree. Emotional-security research shows what matters is whether they see the disagreement end with warmth and repair. A visible repair is a lesson in how relationships survive.",
        bullets: [
          "Destructive conflict — contempt, stonewalling, threats — is what erodes a child's sense of safety.",
          "Constructive conflict and visible repair buffer that harm.",
          "The goal is not fewer feelings. It is a faster return to connection.",
        ],
        takeaway: "You are not trying to be a conflict-free family. You are building a repair habit.",
      },
      {
        eyebrow: "The biology",
        title: "When you are flooded, more words do not help.",
        body: "At a heart rate around 95–100 bpm the body shifts into threat mode. People cannot take in new information, empathize, or solve problems well. Gottman's prescription is a break of at least 20 minutes — and an agreed time to come back.",
        bullets: [
          "Say the return time out loud: “I need 20 minutes. Back at 8:40.”",
          "A pause is not walking away. It is a promise with a timestamp.",
          "No AI, no referee, no third voice during the flood.",
        ],
        takeaway: "Pause is a skill, not an escape — as long as you come back.",
      },
      {
        eyebrow: "The repair room",
        title: "Three questions, one small agreement.",
        body: "After the pause, each partner answers privately: What did I feel? What did I need? What was my part in it? Then you read each other's answers — or let Kinora reflect both sides neutrally — and choose one small agreement for the next time.",
        bullets: [
          "No verdicts. No “who started it”. Both sides get the same airtime.",
          "Name your own contribution before asking for a change.",
          "Make the agreement concrete, tiny, and repeatable.",
        ],
        takeaway: "Repair is not an apology contest. It is a design session for next time.",
      },
      {
        eyebrow: "For your child",
        title: "Show the repair in one minute.",
        body: "Children often assume a fight is their fault or the beginning of the end. A short, age-appropriate script closes that loop without asking them to carry adult detail.",
        bullets: [
          "Ages 2–5: “You saw us use loud voices. We fixed it. We love each other, and we love you.”",
          "Ages 6–9: “We disagreed about the plan. We listened and made a new plan. It is not your job to fix it.”",
          "Ages 10–13: “That was tense. We are working it out. If you have questions, you can ask.”",
        ],
        takeaway: "Repair in private is good. Repair in front of your child is a gift.",
      },
    ],
    quiz: [
      {
        question: "What makes conflict harmful to children?",
        options: [
          "Any disagreement in front of them",
          "Destructive conflict without visible repair",
          "Parents who take a 20-minute break",
        ],
        correctIndex: 1,
        explanation:
          "Emotional-security research points to destructive conflict and the absence of repair — not every disagreement.",
      },
      {
        question: "Why does a 20-minute break help?",
        options: [
          "It lets you win the argument later",
          "It gives the body time to leave the flooded, threat-response state",
          "It teaches your child to avoid hard conversations",
        ],
        correctIndex: 1,
        explanation:
          "At high emotional arousal, the body struggles to process new information. A pause with an agreed return time makes repair possible.",
      },
      {
        question: "Which is the best repair agreement?",
        options: [
          "“We will never argue again.”",
          "“Whoever is flooded says ‘pause’ and names a return time; we come back after 20 minutes.”",
          "“One of us decides and the other stops bringing it up.”",
        ],
        correctIndex: 1,
        explanation:
          "A concrete, repeatable protocol with a return time is more useful than an impossible promise or a silencing rule.",
      },
    ],
  },
  {
    slug: "emotion-coaching-in-90-seconds",
    title: "Emotion Coaching in 90 Seconds",
    subtitle:
      "Name it, validate it, hold the limit — without turning every tantrum into a lecture.",
    category: "Emotions",
    minutes: 5,
    icon: "cloud",
    accent: "#7C9CF5",
    suggestedFor: ["Tantrums", "Big feelings", "Hitting or shouting"],
    slides: [
      {
        eyebrow: "Step one",
        title: "Name it to tame it.",
        body: "A child in a storm is not ready for a lesson. Start by naming what you see, in plain words. Naming does not agree with the behavior; it tells the child that their inner world makes sense to you.",
        bullets: [
          "“You are furious that the tower fell.”",
          "“You wanted a turn and it did not come.”",
          "Keep it short. Two sentences beat a speech.",
        ],
        takeaway: "Emotion first, correction second.",
      },
      {
        eyebrow: "Step two",
        title: "Validate the feeling. Hold the limit.",
        body: "Validation and boundaries are not opposites. A child can be allowed to feel angry and still not be allowed to hit. Say both, calmly and together.",
        bullets: [
          "“It is okay to be furious. It is not okay to hit. I will keep everyone safe.”",
          "Do not bargain with the feeling. Do hold the behavior line.",
          "Move your body lower, slow your voice, reduce the audience.",
        ],
        takeaway: "All feelings are allowed. Not all actions are.",
      },
      {
        eyebrow: "Step three",
        title: "Coach the next step after the wave.",
        body: "Problem-solving belongs on the other side of the emotional wave. Once the body is calm, ask a small question that gives the child some agency.",
        bullets: [
          "“What could we try next time the tower falls?”",
          "“Do you want a hug, a sip of water, or two minutes alone?”",
          "Offer two acceptable choices, not an open menu.",
        ],
        takeaway: "Calm is the doorway to learning.",
      },
      {
        eyebrow: "The parent's repair",
        title: "You will get it wrong. Repair anyway.",
        body: "No parent hits the mark every time. What matters is returning after a snapped response. A 30-second repair models the exact skill you are teaching.",
        bullets: [
          "“I yelled. That was mine. I am sorry. I am going to take a breath and try again.”",
          "Do not add “but you…”. The repair is about your part.",
          "Children learn more from the return than from the rupture.",
        ],
        takeaway: "Repair beats perfection — every single time.",
      },
    ],
    quiz: [
      {
        question: "What is the first move when a child is mid-tantrum?",
        options: [
          "Explain why the rule exists",
          "Name the feeling you can see",
          "Send them to their room until they stop",
        ],
        correctIndex: 1,
        explanation:
          "Naming the emotion helps the child's nervous system settle and signals that you understand the experience.",
      },
      {
        question: "Which sentence holds both validation and a limit?",
        options: [
          "“You're fine. Stop crying.”",
          "“Be angry, but you cannot hit. I will keep everyone safe.”",
          "“If you stop crying, you can have a treat.”",
        ],
        correctIndex: 1,
        explanation:
          "It accepts the feeling and keeps the behavioral boundary without bargaining or shaming.",
      },
      {
        question: "When is the best time to problem-solve?",
        options: [
          "In the middle of the emotional wave",
          "After the child is calm and reconnected",
          "Never — children should figure it out alone",
        ],
        correctIndex: 1,
        explanation:
          "Problem-solving needs the thinking brain back online. Calm comes first; coaching follows.",
      },
    ],
  },
  {
    slug: "the-fair-load-reset",
    title: "The Fair-Load Reset",
    subtitle:
      "Make the invisible load visible, then design one cleaner handoff this week.",
    category: "Team",
    minutes: 6,
    icon: "scale",
    accent: "#F5B942",
    suggestedFor: ["“I do everything”", "Night shifts", "Chores and mental load"],
    slides: [
      {
        eyebrow: "The real problem",
        title: "It is rarely just the dishes.",
        body: "The friction after a baby is often about the invisible load: noticing, planning, remembering, and reminding. Research on US parents finds mothers of children under six doing about 7.5 hours of childcare a day, compared with 5.3 for fathers — and one in four posts in a large parenting community is about dividing childcare.",
        bullets: [
          "The fight is often about fairness, recognition, and exhaustion — not the specific task.",
          "“I have to ask” is itself a job. It is called the mental load.",
          "The goal is not a perfect 50/50. It is a split you both recognize as fair.",
        ],
        takeaway: "Make the invisible visible before you negotiate the split.",
      },
      {
        eyebrow: "The inventory",
        title: "Write down the whole job — including the noticing.",
        body: "For one ordinary week, list every recurring job in three columns: the task, the noticing/planning behind it, and who currently owns it. Ownership means it is handled without a reminder.",
        bullets: [
          "Include logistics: appointments, school forms, gifts, medications, clothes that still fit.",
          "Mark “noticed by” separately from “did by”. Both are work.",
          "Do not negotiate during the inventory. First, see the whole picture.",
        ],
        takeaway: "You cannot split what you have never named.",
      },
      {
        eyebrow: "The handoff",
        title: "Hand over ownership, not tasks.",
        body: "“Help me more” is too vague to change a week. A clean handoff names the domain, the outcome, and the decision rights. The other parent owns the whole loop — including noticing and follow-through.",
        bullets: [
          "“You own mornings: wake-up, breakfast, backpack, and the school messages.”",
          "“I own bedtime: bath, books, lights out, and the next day's clothes.”",
          "Agree on a check-in, not a supervisor. Ownership includes the right to do it differently.",
        ],
        takeaway: "A domain is clearer than a to-do list.",
      },
      {
        eyebrow: "The weekly reset",
        title: "Ten minutes, once a week, one change.",
        body: "Pick a recurring time. Review the load, name one thing that felt unfair, and change one thing — not everything. The point is a system that keeps adjusting as your child grows.",
        bullets: [
          "Start with appreciation: “I noticed you handled the school emails all week.”",
          "One change per week beats a total overhaul that collapses by Thursday.",
          "Revisit after sleep regressions, new jobs, or a new school year.",
        ],
        takeaway: "Fairness is a practice, not a one-time settlement.",
      },
    ],
    quiz: [
      {
        question: "What is the “invisible load”?",
        options: [
          "The chores nobody sees because they happen at night",
          "The noticing, planning, remembering and reminding behind the tasks",
          "The money spent on childcare",
        ],
        correctIndex: 1,
        explanation:
          "The mental load is the cognitive work that keeps the household running — often unseen and unequally distributed.",
      },
      {
        question: "Which is the strongest handoff?",
        options: [
          "“Can you help more with mornings?”",
          "“You own mornings — wake-up through school messages.”",
          "“I'll make a list and you can pick two items.”",
        ],
        correctIndex: 1,
        explanation:
          "A domain with clear ownership and decision rights removes the need for reminders and reduces the mental load.",
      },
      {
        question: "What makes the weekly reset work?",
        options: [
          "Changing everything at once so it is fixed",
          "One recurring time, appreciations first, and one small change",
          "Waiting until one partner is completely overwhelmed",
        ],
        correctIndex: 1,
        explanation:
          "Small, repeatable adjustments are more durable than a total overhaul — and appreciation keeps the conversation from becoming a scoreboard.",
      },
    ],
  },
  {
    slug: "connection-missions-by-age",
    title: "Connection Missions by Age",
    subtitle:
      "Ten minutes of child-led time that fits the age your child is actually in.",
    category: "Connection",
    minutes: 5,
    icon: "sparkles",
    accent: "#BD9FF7",
    suggestedFor: ["Feeling disconnected", "Screen battles", "One-on-one time"],
    slides: [
      {
        eyebrow: "The rule",
        title: "Ten minutes. Child-led. No teaching.",
        body: "Special time is not a reward for good behavior and it is not a lesson. It is a short, predictable window where the child chooses the play and the parent follows. The predictability matters as much as the minutes.",
        bullets: [
          "Put the phone in another room. Sit on the floor if you can.",
          "Narrate and imitate instead of directing: “You are making the tower wobbly on purpose.”",
          "No screens, no corrections, no questions with a right answer.",
        ],
        takeaway: "Connection is a rhythm you return to, not a grand gesture.",
      },
      {
        eyebrow: "Ages 0–3",
        title: "Serve and return.",
        body: "Babies and toddlers build language and security through back-and-forth exchanges. Follow their gaze, copy their sounds, and wait. You do not need a curriculum; you need a responsive face.",
        bullets: [
          "Name what they are looking at: “Ball. You see the red ball.”",
          "Narrate your care: “I am changing your diaper. Cold wipe.”",
          "Tummy time, floor time, and peekaboo count as connection.",
        ],
        takeaway: "Follow their attention, then add one small step.",
      },
      {
        eyebrow: "Ages 3–6",
        title: "Enter the pretend world.",
        body: "At this age, play is how children process feelings and practice power. Let them cast you as the student, the customer, or the sleepy dragon. Do not fix the story.",
        bullets: [
          "“The floor is lava” — build a path together.",
          "Emotion charades: make a face, guess the feeling, name a time you felt it.",
          "Rose and thorn at dinner: one good thing, one hard thing.",
        ],
        takeaway: "Let the child be the director for ten minutes.",
      },
      {
        eyebrow: "Ages 6–12",
        title: "Side by side, not face to face.",
        body: "Older children often talk more easily while doing something: walking, cooking, building, shooting hoops. Trade the interrogation for a shared task, and let silence be welcome.",
        bullets: [
          "A weekly 20-minute one-on-one “date” with no siblings and no agenda.",
          "Ask “What was the best part of today?” before “What did you get on the test?”",
          "Let them teach you something they love, even if you are bad at it.",
        ],
        takeaway: "Shared attention opens the door that direct questions close.",
      },
    ],
    quiz: [
      {
        question: "What makes “special time” different from normal play?",
        options: [
          "It is longer and more educational",
          "It is predictable, child-led, and free of teaching or correction",
          "It only happens after good behavior",
        ],
        correctIndex: 1,
        explanation:
          "The value is in the child's control and the parent's full attention — not in duration, lessons, or rewards.",
      },
      {
        question: "What does “serve and return” mean for a toddler?",
        options: [
          "Feeding and then cleaning up",
          "Following the child's attention and responding back and forth",
          "Teaching a new word every minute",
        ],
        correctIndex: 1,
        explanation:
          "Serve-and-return describes responsive back-and-forth interactions — following the child's focus and responding.",
      },
      {
        question: "Why do older kids often talk more side by side?",
        options: [
          "They are avoiding eye contact because they are lying",
          "Shared activity lowers the pressure of a direct face-to-face conversation",
          "They only talk when they are busy",
        ],
        correctIndex: 1,
        explanation:
          "Doing something together can make conversation feel less like an interview and more like companionship.",
      },
    ],
  },
  {
    slug: "the-weekly-team-huddle",
    title: "The Weekly Team Huddle",
    subtitle:
      "A ten-minute ritual that keeps the household from running on resentment.",
    category: "Team",
    minutes: 5,
    icon: "calendar",
    accent: "#8B5CF6",
    suggestedFor: ["Weekly rhythm", "Appreciation", "Planning the week"],
    slides: [
      {
        eyebrow: "Why a ritual",
        title: "The week gets a container.",
        body: "Problems that get raised in the middle of a rushed morning rarely get solved well. A standing ten-minute huddle gives the two of you a predictable place to review the week, notice each other, and choose one priority before the week chooses for you.",
        bullets: [
          "Same day, same time, same length. Put it on the calendar.",
          "Start with what went right, not what went wrong.",
          "One goal for the week — not a performance review.",
        ],
        takeaway: "A small ritual prevents a hundred rushed arguments.",
      },
      {
        eyebrow: "Appreciations",
        title: "Be specific about effort.",
        body: "“You're amazing” is sweet but hard to hold onto. Specific appreciation names what you saw and why it mattered. It also trains you to notice the invisible work.",
        bullets: [
          "“I noticed you handled the school emails all week. That took a load off me.”",
          "“You stayed calm at bedtime when I was done. Thank you.”",
          "No “but” after the appreciation. Let it land.",
        ],
        takeaway: "Noticed effort is fuel for the next week.",
      },
      {
        eyebrow: "The load check",
        title: "One question each: what felt heavy?",
        body: "Give each partner a turn without interruption. The listener reflects back what they heard before responding. Then pick one concrete thing to move, share, or drop.",
        bullets: [
          "“What felt heaviest this week?”",
          "“What do you need more of next week?”",
          "“What can we take off the list entirely?”",
        ],
        takeaway: "Understanding first. Solutions second.",
      },
      {
        eyebrow: "Close well",
        title: "End with one small plan and one bit of fun.",
        body: "A huddle that ends in a task list feels like a staff meeting. Close with something the two of you can look forward to — a walk, a show, a meal, ten minutes on the couch.",
        bullets: [
          "Name the one change for the week and who owns it.",
          "Put the next huddle on the calendar before you stand up.",
          "Choose one fun thing, even if it is tiny.",
        ],
        takeaway: "The ritual should feel like relief, not another job.",
      },
    ],
    quiz: [
      {
        question: "What is the best way to start a weekly huddle?",
        options: [
          "With the biggest unresolved complaint",
          "With specific appreciations for effort",
          "With a review of every chore that was missed",
        ],
        correctIndex: 1,
        explanation:
          "Starting with appreciation lowers defensiveness and trains attention toward the work that is already happening.",
      },
      {
        question: "How many changes should you aim for each week?",
        options: [
          "As many as possible",
          "One concrete change",
          "None — just talk about feelings",
        ],
        correctIndex: 1,
        explanation:
          "One small, owned change is more likely to stick than a total overhaul.",
      },
      {
        question: "What makes a huddle feel like a team ritual rather than a staff meeting?",
        options: [
          "A shared fun plan at the end",
          "A stricter agenda",
          "Assigning blame for the week's problems",
        ],
        correctIndex: 0,
        explanation:
          "Closing with something enjoyable protects the relationship from becoming purely logistical.",
      },
    ],
  },
  {
    slug: "screens-boundaries-big-feelings",
    title: "Screens, Boundaries & Big Feelings",
    subtitle:
      "A family media plan that survives the school year — and the meltdown at the end of the tablet.",
    category: "Digital",
    minutes: 6,
    icon: "phone",
    accent: "#7C9CF5",
    suggestedFor: ["Screen time", "First phone", "Limits and meltdowns"],
    slides: [
      {
        eyebrow: "The frame",
        title: "A contract beats a rule.",
        body: "Rules feel like a verdict from above; a contract feels like a family agreement. Co-create the plan while everyone is calm, write it down, and make it visible. Children follow agreements they helped make far more readily than rules that appeared overnight.",
        bullets: [
          "Cover when, where, what, and how long — not just “less”.",
          "Include device-free zones and times for the whole family, parents included.",
          "Agree on what happens when the plan is broken — in advance, without a courtroom.",
        ],
        takeaway: "Co-create it calm. Refer to it when things get loud.",
      },
      {
        eyebrow: "Ages 6–12",
        title: "Protect sleep, school, and people first.",
        body: "For children this age, the highest-leverage boundaries are simple: screens out of bedrooms and away from meals, a predictable wind-down, and device-free time for connection. Half of US children have a phone by age 11, so the first-phone plan deserves its own conversation.",
        bullets: [
          "No screens in bedrooms overnight; charge devices in a shared space.",
          "A 20–30 minute wind-down before lights out.",
          "For a first phone: start with calls and texts, add apps over time, review together.",
        ],
        takeaway: "Design the environment so the limit does not need to be renegotiated daily.",
      },
      {
        eyebrow: "The meltdown",
        title: "Validate the feeling. Hold the limit.",
        body: "The end of screen time is a transition, and transitions are hard for young brains. Name the disappointment, keep the limit, and offer a small choice that does not reopen the decision.",
        bullets: [
          "“You are disappointed the show is over. It is hard to stop. The tablet is done for today.”",
          "Offer two next steps: “Do you want to help me with dinner or build a track?”",
          "Do not negotiate the limit in the middle of the storm. Revisit the plan later.",
        ],
        takeaway: "The feeling gets a yes. The boundary stays a boundary.",
      },
      {
        eyebrow: "Model it",
        title: "Your phone is part of the plan.",
        body: "Children learn more from what we do than what we say. A family plan that applies only to children teaches that limits are a punishment. A plan that applies to everyone teaches that attention is a shared family value.",
        bullets: [
          "Pick one device-free window a day — dinner, the school walk, the first 20 minutes home.",
          "Narrate your own choice: “I am putting my phone away so I can listen.”",
          "Repair when you slip: “I was on my phone. Let me try that again.”",
        ],
        takeaway: "The most persuasive parental-control setting is a parent who puts the phone down.",
      },
    ],
    quiz: [
      {
        question: "Why is a family media contract more effective than a list of rules?",
        options: [
          "It is longer and more detailed",
          "It is co-created while calm, so children have ownership",
          "It removes the need for any consequences",
        ],
        correctIndex: 1,
        explanation:
          "Shared agreements made in calm moments are easier to remember and follow than rules imposed after a conflict.",
      },
      {
        question: "Which boundary has the highest leverage for ages 6–12?",
        options: [
          "Screens out of bedrooms and away from meals",
          "Only educational apps",
          "A strict one-hour timer with no exceptions",
        ],
        correctIndex: 0,
        explanation:
          "Protecting sleep, meals and connection is more protective than trying to perfectly meter every minute.",
      },
      {
        question: "What should you do when screen time ends in a meltdown?",
        options: [
          "Give five more minutes to stop the crying",
          "Validate the disappointment, hold the limit, and offer a small next choice",
          "Take away the tablet for a week",
        ],
        correctIndex: 1,
        explanation:
          "Validation keeps the connection; the held limit keeps the boundary. A small choice restores some agency.",
      },
    ],
  },
];

export const courseBySlug = (slug: string) =>
  courses.find((course) => course.slug === slug);

export const courseCategories: Course["category"][] = [
  "Repair",
  "Emotions",
  "Team",
  "Connection",
  "Digital",
];
