export const PersonalityEnum = {
    Relaxed: "Relaxed",
    Shy: "Shy",
    Intense: "Intense",
    Refined: "Refined",
    Silly: "Silly",
}
export type Personality = typeof PersonalityEnum[keyof typeof PersonalityEnum];
// At least I can reuse the overcomplicated enum from storageManger here :3