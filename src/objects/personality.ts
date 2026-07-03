export const PersonalityType = {
    Normal: "Normal",
    Shy: "Shy",
    Intense: "Intense",
    Refined: "Refined",
    Silly: "Silly",
}
export type Personality = typeof PersonalityType[keyof typeof PersonalityType];
// At least I can reuse the overcomplicated enum from storageManger here :3