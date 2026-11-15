export type SafetyKind = "crisis" | "abuse";

export type SafetyResult = {
  flagged: boolean;
  kind?: SafetyKind;
  title?: string;
  message?: string;
  resources: { label: string; href: string; phone?: string }[];
};

const crisisPatterns = [
  /\b(kill|hurt|harm)\s+(myself|my self)\b/i,
  /\b(suicid(e|al)|end\s+my\s+life|don'?t\s+want\s+to\s+(live|be here)|self[-\s]?harm|cutting\s+myself)\b/i,
];

const abusePatterns = [
  /\b(hit|hits|hitting|slap|slaps|slapped|punch|punched|choke|choked|strangle|strangled)\s+(me|her|him)\b/i,
  /\b(he|she|my\s+(husband|wife|partner|boyfriend|girlfriend))\s+(hit|hits|hurt|hurts|threatened|threatens|choked|strangled|pushed)\s+me\b/i,
  /\b(i'?m|i\s+am)\s+(afraid|scared)\s+of\s+(him|her|my\s+(husband|wife|partner))\b/i,
  /\b(abusive|abusing\s+me|won'?t\s+let\s+me\s+leave|forces?\s+me)\b/i,
];

const crisisResources = [
  {
    label: "988 Suicide & Crisis Lifeline — call or text 988",
    href: "https://988lifeline.org",
    phone: "988",
  },
  {
    label: "Emergency — call 911",
    href: "tel:911",
    phone: "911",
  },
];

const abuseResources = [
  {
    label: "National Domestic Violence Hotline — 1-800-799-7233",
    href: "https://www.thehotline.org",
    phone: "1-800-799-7233",
  },
  {
    label: "Emergency — call 911",
    href: "tel:911",
    phone: "911",
  },
];

/**
 * Safety screening is deliberately conservative: if a message could be about
 * immediate danger, coaching stops and resources are surfaced. Kinora never
 * coaches "communication" through abuse.
 */
export function assessSafety(text: string): SafetyResult {
  if (!text) return { flagged: false, resources: [] };

  if (crisisPatterns.some((pattern) => pattern.test(text))) {
    return {
      flagged: true,
      kind: "crisis",
      title: "Your safety comes first",
      message:
        "I'm really glad you told me. This sounds like a moment that needs a human, right now. Please call or text 988, or call 911 if you are in immediate danger. I'm going to pause coaching here — your safety matters more than any exercise.",
      resources: crisisResources,
    };
  }

  if (abusePatterns.some((pattern) => pattern.test(text))) {
    return {
      flagged: true,
      kind: "abuse",
      title: "Coaching is not the right tool for this",
      message:
        "What you're describing may involve your safety. Please contact the National Domestic Violence Hotline at 1-800-799-7233 or thehotline.org, or call 911 if you are in immediate danger. Kinora will not continue a joint session while safety is in question.",
      resources: abuseResources,
    };
  }

  return { flagged: false, resources: [] };
}

export const SAFETY_FOOTER =
  "Kinora is coaching and skills education — not therapy, diagnosis, or crisis care.";
