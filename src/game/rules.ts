import { getUpgrade } from "../objects/upgrade";
import type { JobState } from "../state/gameStateSlice";

/**
 * Every tunable number in the game. Keeping them here means balance changes never
 * require touching the interaction logic or the UI.
 */

/** You move in on your birthday and the game ends on the next one. */
export const GAME_LENGTH_WEEKS = 52;

export const STARTING_MONEY = 100;
export const BASE_ACTION_POINTS = 5;
/** The two places you can find without anyone telling you about them. */
export const STARTING_HANGOUTS = ["fast_food_joint", "movie_theater"];

export const ActionPointCost = {
    Chat: 1,
    Hangout: 2,
    /** Going somewhere on your own, purely to run into people. */
    SoloVisit: 1,
    Gift: 1,
    Overtime: 1,
    Browse: 1,
};

/** Going alone is worse than WormGround for meeting people, but it always tries. */
export const SOLO_VISIT_MEET_CHANCE = 0.45;

// Work
export const BASE_SALARY = 120;
export const RAISE_PER_PROMOTION = 45;
export const OVERTIME_PAY = 40;
export const SHIFTS_PER_PROMOTION = 4;
export const MAX_PROMOTIONS = 6;

// Friendship payouts
export const CHAT_BASE_GAIN = 7;
export const HANGOUT_BASE_GAIN = 14;
export const GIFT_BASE_GAIN = 16;
/** Per attendee they like / dislike at a hangout. */
export const GROUP_LIKE_BONUS = 4;
export const GROUP_DISLIKE_PENALTY = 6;
/** Each repeat interaction with the same person in one week is worth this much of the last. */
export const DIMINISHING_FACTOR = 0.55;
/** Chance a chat reveals one of their preferences. */
export const REVEAL_CHANCE = 0.6;
/** Chance a chat points you at a hangout they like that you have not found yet. */
export const HANGOUT_TIP_CHANCE = 0.35;

/** Friendship lost each week with anyone you did not interact with. */
export const WEEKLY_DECAY = 2;

// Close friends occasionally give something back at the start of a week.
export const GIFT_BACK_MIN_FRIENDSHIP = 80;
export const GIFT_BACK_CHANCE = 0.3;

// Roommates
export const ROOMMATE_MIN_FRIENDSHIP = 70;
/** Roommates gain this much per week instead of decaying -- you live with them. */
export const ROOMMATE_WEEKLY_GAIN = 3;

/** Someone counts as an actual friend, for the header and the ending, at this level. */
export const FRIEND_THRESHOLD = 25;

const tiers = [
    { min: 85, label: "Best Friend" },
    { min: 60, label: "Good Friend" },
    { min: FRIEND_THRESHOLD, label: "Friend" },
    { min: 1, label: "Acquaintance" },
    { min: 0, label: "Stranger" },
];

export function friendshipTier(level: number): string {
    return tiers.find(t => level >= t.min)?.label ?? "Stranger";
}

export function weeklyActionPoints(upgradeIds: string[]): number {
    return upgradeIds.reduce(
        (total, id) => total + (getUpgrade(id)?.actionPointsPerWeek ?? 0),
        BASE_ACTION_POINTS,
    );
}

export function weeklySalary(job: JobState): number {
    return BASE_SALARY + job.promotions * RAISE_PER_PROMOTION;
}

export function weeksRemaining(currentWeek: number): number {
    return Math.max(0, GAME_LENGTH_WEEKS - currentWeek);
}

export function isGameOver(currentWeek: number): boolean {
    return currentWeek >= GAME_LENGTH_WEEKS;
}

/** Multiplier applied after `timesAlready` interactions with the same person this week. */
export function diminishingMultiplier(timesAlready: number): number {
    return DIMINISHING_FACTOR ** timesAlready;
}
