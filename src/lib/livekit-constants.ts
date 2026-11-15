/**
 * The Kinora meeting runs on one phone placed between the parents. Both
 * parents share that phone's microphone; the agent uses STT diarization to
 * tell their voices apart. These values are shared by the token route and the
 * browser client, so they must stay client-safe (no server SDK imports).
 */
export const SHARED_PHONE_IDENTITY = "family_phone";
export const SHARED_PHONE_NAME = "Family phone";
