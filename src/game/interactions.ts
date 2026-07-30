import { getFriend, getGift, getHangout } from "../objects/catalog";
import { EntityKindEnum, getEntities } from "../objects/entity";
import type { Friend } from "../objects/friend";
import { getHouse } from "../objects/house";
import { PreferenceEnum, PreferenceMultiplier } from "../objects/preference";
import { getUpgrade } from "../objects/upgrade";
import {
    addFriendship,
    addMoney,
    addRoommate,
    buyUpgrade,
    discoverFriend,
    discoverHangout,
    getItem,
    giftItem,
    nextWeek,
    promote,
    recordInteraction,
    revealPreference,
    setActionPoints,
    setHouse,
    setWeeklyInteractions,
    spendActionPoints,
    workShift,
    type FriendRecord,
} from "../state/gameStateSlice";
import type { AppDispatch, RootState } from "../state/store";
import {
    ActionPointCost,
    CHAT_BASE_GAIN,
    GIFT_BASE_GAIN,
    GROUP_DISLIKE_PENALTY,
    GROUP_LIKE_BONUS,
    HANGOUT_BASE_GAIN,
    HANGOUT_TIP_CHANCE,
    MAX_PROMOTIONS,
    OVERTIME_PAY,
    REVEAL_CHANCE,
    ROOMMATE_MIN_FRIENDSHIP,
    ROOMMATE_WEEKLY_GAIN,
    SHIFTS_PER_PROMOTION,
    SOLO_VISIT_MEET_CHANCE,
    WEEKLY_DECAY,
    diminishingMultiplier,
    friendshipTier,
    isGameOver,
    weeklyActionPoints,
    weeklySalary,
} from "./rules";

/**
 * Every player action lives here. Each one validates, dispatches, and returns a
 * report the UI can show: what was gained, out of what was possible, and why.
 * Nothing in this file renders, and nothing in the UI does game maths.
 */

export interface FriendGain {
    friendId: string;
    name: string;
    gained: number;
    /** Friendship after the change, for the total gauge. */
    level: number;
    /** Familiarity title at that level. */
    tier: string;
    /** How they took it: "Had a great time", "Loved it", and so on. */
    reaction?: string;
    /** What drove that reaction -- the place, the company, or seeing you too often. */
    causes: string[];
}

export interface InteractionResult {
    ok: boolean;
    title: string;
    /** Why it failed, or what happened. */
    message: string;
    gains: FriendGain[];
    apSpent: number;
    moneySpent: number;
    /** Set when the action introduced you to someone new. */
    metFriend?: string;
    /** Preferences and places uncovered, as mechanics notes. */
    learned: string[];
}

function failure(title: string, message: string): InteractionResult {
    return { ok: false, title, message, gains: [], apSpent: 0, moneySpent: 0, learned: [] };
}

/** Payouts wobble by +/-20% so the same plan is not perfectly repeatable. */
function roll(): number {
    return 0.8 + Math.random() * 0.4;
}

function record(state: RootState, id: string): FriendRecord | undefined {
    return state.friends.find(f => f.id === id);
}

function timesSeenThisWeek(state: RootState, id: string): number {
    return state.weeklyInteractions[id] ?? 0;
}

function headroom(state: RootState, id: string): number {
    return 100 - (record(state, id)?.friendshipLevel ?? 0);
}

function knownKeys(state: RootState, id: string): string[] {
    return record(state, id)?.discoveredPreferences ?? [];
}

/**
 * Player-facing text describes the effect, never the maths. Nothing here quotes
 * a multiplier, a ceiling or a chance -- the friendship gauge and the reaction
 * are what the player is meant to read.
 */
function repeatReason(repeats: number): string {
    return repeats === 1
        ? "Already saw them once this week"
        : `Already saw them ${repeats} times this week`;
}

/** How they felt about a gift, straight from their opinion of it. */
function itemReaction(opinion: string | null): string {
    switch (opinion) {
        case PreferenceEnum.Favorite:
            return "Loved it";
        case PreferenceEnum.Like:
            return "Liked it";
        case PreferenceEnum.Dislike:
            return "Disliked it";
        case PreferenceEnum.Hate:
            return "Hated it";
        default:
            return "No strong feelings";
    }
}

/**
 * How the outing went overall, measured against what a neutral trip would have
 * paid. The causes list says whether the venue or the company swung it.
 */
function outingReaction(amount: number, neutral: number): string {
    const ratio = neutral > 0 ? amount / neutral : 1;
    if (ratio >= 1.25) return "Had a great time";
    if (ratio <= 0.85) return "Had a bad time";
    return "Had a good time";
}

/** Builds the gauge fields shared by every payout. */
function levelAfter(state: RootState, friendId: string, gained: number) {
    const current = record(state, friendId)?.friendshipLevel ?? 0;
    const level = Math.max(0, Math.min(current + gained, 100));
    return { level, tier: friendshipTier(level) };
}

/**
 * Reveals one preference the player has not seen yet, so chatting is how you
 * learn what to buy and where to go.
 */
function revealSomething(
    dispatch: AppDispatch,
    state: RootState,
    friend: Friend,
): string | null {
    const known = knownKeys(state, friend.id);
    const unknown = friend.preferences.filter(p => !known.includes(p.target.key));
    if (unknown.length === 0) return null;

    const picked = unknown[Math.floor(Math.random() * unknown.length)];
    dispatch(revealPreference({ id: friend.id, key: picked.target.key }));
    return `${friend.name} ${picked.preference.toLowerCase()}s ${picked.target.name}.`;
}

/** Chatting can also point you at a place they like that you have not found. */
function maybeShareHangout(
    dispatch: AppDispatch,
    state: RootState,
    friend: Friend,
): string | null {
    if (Math.random() > HANGOUT_TIP_CHANCE) return null;
    const unknownSpots = friend
        .getLikes()
        .filter(
            p =>
                p.target.kind === EntityKindEnum.Hangout &&
                !state.discoveredHangouts.includes(p.target.id),
        );
    if (unknownSpots.length === 0) return null;

    const spot = unknownSpots[Math.floor(Math.random() * unknownSpots.length)].target;
    dispatch(discoverHangout(spot.id));
    return `${friend.name} told you about ${spot.name}. It is on your map now.`;
}

function maybeMeetSomeone(
    dispatch: AppDispatch,
    state: RootState,
    source: { rollNewFriend: (knownIds: string[]) => Friend | null },
): string | undefined {
    const met = source.rollNewFriend(state.friends.map(f => f.id));
    if (!met) return undefined;
    dispatch(discoverFriend(met.id));
    return met.name;
}

// ---------------------------------------------------------------- chat

export function chatWithFriend(
    dispatch: AppDispatch,
    state: RootState,
    friendId: string,
): InteractionResult {
    const friend = getFriend(friendId);
    if (!friend) return failure("Chat", `No character with the id "${friendId}".`);
    if (!record(state, friendId)) return failure("Chat", `You have not met ${friend.name} yet.`);
    if (state.actionPoints < ActionPointCost.Chat) {
        return failure("Chat", `Not enough action points. Chatting costs ${ActionPointCost.Chat} AP.`);
    }

    const repeats = timesSeenThisWeek(state, friendId);
    const gained = Math.min(
        Math.round(CHAT_BASE_GAIN * diminishingMultiplier(repeats) * roll()),
        headroom(state, friendId),
    );

    const causes: string[] = [];
    if (repeats > 0) causes.push(repeatReason(repeats));
    if (headroom(state, friendId) < CHAT_BASE_GAIN) causes.push("Close to maximum friendship");

    dispatch(spendActionPoints(ActionPointCost.Chat));
    dispatch(addFriendship({ id: friendId, amount: gained }));
    dispatch(recordInteraction(friendId));

    const learned: string[] = [];
    if (Math.random() < REVEAL_CHANCE) {
        const revealed = revealSomething(dispatch, state, friend);
        if (revealed) learned.push(revealed);
    }
    const tip = maybeShareHangout(dispatch, state, friend);
    if (tip) learned.push(tip);

    return {
        ok: true,
        title: `Messaged ${friend.name}`,
        message: "",
        gains: [
            { friendId, name: friend.name, gained, ...levelAfter(state, friendId, gained), causes },
        ],
        apSpent: ActionPointCost.Chat,
        moneySpent: 0,
        metFriend: maybeMeetSomeone(dispatch, state, friend),
        learned,
    };
}

// ---------------------------------------------------------------- hangout

/**
 * Going somewhere on your own. Earns no friendship, but it is how you meet
 * people when your contacts list is empty and WormGround is not cooperating.
 */
export function visitAlone(
    dispatch: AppDispatch,
    state: RootState,
    hangoutId: string,
): InteractionResult {
    const hangout = getHangout(hangoutId);
    if (!hangout) return failure("Hangout", `No hangout with the id "${hangoutId}".`);
    if (state.actionPoints < ActionPointCost.SoloVisit) {
        return failure(hangout.name, `Not enough action points. Going alone costs ${ActionPointCost.SoloVisit} AP.`);
    }
    if (hangout.costPerPerson > state.money) {
        return failure(hangout.name, `That costs $${hangout.costPerPerson} and you have $${state.money}.`);
    }

    dispatch(spendActionPoints(ActionPointCost.SoloVisit));
    if (hangout.costPerPerson > 0) dispatch(addMoney(-hangout.costPerPerson));

    const metFriend =
        Math.random() < SOLO_VISIT_MEET_CHANCE
            ? maybeMeetSomeone(dispatch, state, hangout)
            : undefined;

    return {
        ok: true,
        title: `${hangout.name}, on your own`,
        message: metFriend
            ? ""
            : "Nobody new turned up. Going alone only ever finds people, it never builds friendship.",
        gains: [],
        apSpent: ActionPointCost.SoloVisit,
        moneySpent: hangout.costPerPerson,
        metFriend,
        learned: [],
    };
}

export function startHangout(
    dispatch: AppDispatch,
    state: RootState,
    hangoutId: string,
    friendIds: string[],
): InteractionResult {
    const hangout = getHangout(hangoutId);
    if (!hangout) return failure("Hangout", `No hangout with the id "${hangoutId}".`);
    if (friendIds.length === 0) {
        return failure(hangout.name, "Pick at least one person to invite, or go alone instead.");
    }
    if (friendIds.length > hangout.capacity) {
        return failure(
            hangout.name,
            `${hangout.name} fits ${hangout.capacity} of you. Remove ${friendIds.length - hangout.capacity} guest(s).`,
        );
    }
    if (state.actionPoints < ActionPointCost.Hangout) {
        return failure(hangout.name, `Not enough action points. A hangout costs ${ActionPointCost.Hangout} AP.`);
    }

    const cost = hangout.costPerPerson * friendIds.length;
    if (cost > state.money) {
        return failure(hangout.name, `That costs $${cost} for ${friendIds.length} people and you have $${state.money}.`);
    }

    const attendees = friendIds.map(getFriend).filter((f): f is Friend => Boolean(f));
    const gains: FriendGain[] = [];
    const learned: string[] = [];

    attendees.forEach((friend) => {
        const causes: string[] = [];
        let amount = HANGOUT_BASE_GAIN;

        // The venue's contribution, called out separately from the company so the
        // player can tell which of the two swung the evening.
        const opinion = friend.preferenceFor(hangout);
        if (opinion) {
            amount *= PreferenceMultiplier[opinion];
            const positive =
                opinion === PreferenceEnum.Like || opinion === PreferenceEnum.Favorite;
            causes.push(
                positive
                    ? `${hangout.name} is their kind of place`
                    : `${hangout.name} is not their kind of place`,
            );
            if (!knownKeys(state, friend.id).includes(hangout.key)) {
                learned.push(`${friend.name} ${opinion.toLowerCase()}s ${hangout.name}.`);
            }
            dispatch(revealPreference({ id: friend.id, key: hangout.key }));
        }

        attendees
            .filter(other => other.id !== friend.id)
            .forEach((other) => {
                const feeling = friend.preferenceFor(other);
                if (feeling === PreferenceEnum.Like || feeling === PreferenceEnum.Favorite) {
                    amount += GROUP_LIKE_BONUS;
                    causes.push(`Glad ${other.name} came along`);
                    dispatch(revealPreference({ id: friend.id, key: other.key }));
                } else if (feeling === PreferenceEnum.Dislike || feeling === PreferenceEnum.Hate) {
                    amount -= GROUP_DISLIKE_PENALTY;
                    causes.push(`Put off by ${other.name} coming along`);
                    dispatch(revealPreference({ id: friend.id, key: other.key }));
                }
            });

        // Measured before the repeat penalty, so "had a bad time" is about the
        // outing itself rather than about having been seen too often.
        const reaction = outingReaction(amount, HANGOUT_BASE_GAIN);

        const repeats = timesSeenThisWeek(state, friend.id);
        if (repeats > 0) {
            amount *= diminishingMultiplier(repeats);
            causes.push(repeatReason(repeats));
        }

        const gained = Math.min(Math.round(amount * roll()), headroom(state, friend.id));

        dispatch(addFriendship({ id: friend.id, amount: gained }));
        dispatch(recordInteraction(friend.id));
        gains.push({
            friendId: friend.id,
            name: friend.name,
            gained,
            ...levelAfter(state, friend.id, gained),
            reaction,
            causes,
        });
    });

    dispatch(spendActionPoints(ActionPointCost.Hangout));
    if (cost > 0) dispatch(addMoney(-cost));

    const metFriend = maybeMeetSomeone(dispatch, state, hangout);

    return {
        ok: true,
        title: hangout.name,
        message: `Invite people who like the venue, and who like each other.`,
        gains,
        apSpent: ActionPointCost.Hangout,
        moneySpent: cost,
        metFriend,
        learned,
    };
}

// ---------------------------------------------------------------- gifts

export function giveGift(
    dispatch: AppDispatch,
    state: RootState,
    friendId: string,
    giftId: string,
): InteractionResult {
    const friend = getFriend(friendId);
    const gift = getGift(giftId);
    if (!friend || !gift) return failure("Gift", "That character or item no longer exists.");
    if (!record(state, friendId)) return failure("Gift", `You have not met ${friend.name} yet.`);
    if (!state.inventory.includes(giftId)) {
        return failure("Gift", `No ${gift.name} in your bag. Buy one from the shop first.`);
    }
    if (state.actionPoints < ActionPointCost.Gift) {
        return failure("Gift", `Not enough action points. Giving a gift costs ${ActionPointCost.Gift} AP.`);
    }

    const causes: string[] = [];
    let amount = GIFT_BASE_GAIN;
    const opinion = friend.preferenceFor(gift);
    if (opinion) {
        amount *= PreferenceMultiplier[opinion];
        dispatch(revealPreference({ id: friend.id, key: gift.key }));
    }
    const reaction = itemReaction(opinion);

    const repeats = timesSeenThisWeek(state, friendId);
    if (repeats > 0) {
        amount *= diminishingMultiplier(repeats);
        causes.push(repeatReason(repeats));
    }

    const raw = Math.round(amount * roll());
    const gained = raw >= 0 ? Math.min(raw, headroom(state, friendId)) : raw;

    dispatch(spendActionPoints(ActionPointCost.Gift));
    dispatch(giftItem(giftId));
    dispatch(addFriendship({ id: friendId, amount: gained }));
    dispatch(recordInteraction(friendId));

    return {
        ok: true,
        title: `Gave ${gift.name} to ${friend.name}`,
        message: "",
        gains: [
            {
                friendId,
                name: friend.name,
                gained,
                ...levelAfter(state, friendId, gained),
                reaction,
                causes,
            },
        ],
        apSpent: ActionPointCost.Gift,
        moneySpent: 0,
        learned: [],
    };
}

// ---------------------------------------------------------------- work & shop

export interface WorkResult {
    ok: boolean;
    message: string;
    earned: number;
    promoted: boolean;
}

/** Overtime trades an action point for cash now, and progress toward a raise. */
export function workOvertime(dispatch: AppDispatch, state: RootState): WorkResult {
    if (state.actionPoints < ActionPointCost.Overtime) {
        return {
            ok: false,
            message: `Not enough action points. A shift costs ${ActionPointCost.Overtime} AP.`,
            earned: 0,
            promoted: false,
        };
    }

    const earned = OVERTIME_PAY + state.job.promotions * 10;
    dispatch(spendActionPoints(ActionPointCost.Overtime));
    dispatch(addMoney(earned));

    const atMax = state.job.promotions >= MAX_PROMOTIONS;
    const promoted = !atMax && state.job.shiftsWorked + 1 >= SHIFTS_PER_PROMOTION;
    if (promoted) dispatch(promote());
    else dispatch(workShift());

    return {
        ok: true,
        message: promoted
            ? `Promoted. Your paycheck goes up from next week.`
            : atMax
              ? `You are at the top of the pay scale.`
              : `${SHIFTS_PER_PROMOTION - (state.job.shiftsWorked + 1)} more shift(s) until a raise.`,
        earned,
        promoted,
    };
}

export function buyGift(dispatch: AppDispatch, state: RootState, giftId: string): string {
    const gift = getGift(giftId);
    if (!gift) return "That item does not exist.";
    if (state.money < gift.price) return `${gift.name} costs $${gift.price} and you have $${state.money}.`;
    dispatch(addMoney(-gift.price));
    dispatch(getItem(giftId));
    return `Bought ${gift.name} for $${gift.price}.`;
}

export function purchaseUpgrade(dispatch: AppDispatch, state: RootState, upgradeId: string): string {
    const upgrade = getUpgrade(upgradeId);
    if (!upgrade) return "That upgrade does not exist.";
    if (state.upgrades.includes(upgradeId)) return `You already own ${upgrade.name}.`;
    if (state.money < upgrade.price) return `That costs $${upgrade.price} and you have $${state.money}.`;
    dispatch(addMoney(-upgrade.price));
    dispatch(buyUpgrade(upgradeId));
    return `Bought ${upgrade.name}. It applies from next week.`;
}

export function moveHouse(dispatch: AppDispatch, state: RootState, houseId: string): string {
    const house = getHouse(houseId);
    if (house.id === state.house.id) return `You already live in the ${house.name}.`;
    if (state.money < house.price) return `The ${house.name} costs $${house.price} and you have $${state.money}.`;
    dispatch(addMoney(-house.price));
    dispatch(setHouse(house.id));
    return `Moved into the ${house.name}. Room for ${house.maxRoomates} roommate(s).`;
}

export function inviteRoommate(dispatch: AppDispatch, state: RootState, friendId: string): string {
    const friend = getFriend(friendId);
    if (!friend) return "That character does not exist.";
    const house = getHouse(state.house.id);
    if (state.house.roommateIds.length >= house.maxRoomates) {
        return `The ${house.name} has no free rooms.`;
    }
    const level = record(state, friendId)?.friendshipLevel ?? 0;
    if (level < ROOMMATE_MIN_FRIENDSHIP) {
        return `${friend.name} needs ${ROOMMATE_MIN_FRIENDSHIP} friendship to move in (currently ${Math.round(level)}).`;
    }
    dispatch(addRoommate(friendId));
    return `${friend.name} moved in. Roommates gain ${ROOMMATE_WEEKLY_GAIN} friendship a week instead of drifting.`;
}

// ---------------------------------------------------------------- wormground

/** One action point for a roll at a new place or a new person. */
export function browseWormGround(dispatch: AppDispatch, state: RootState): InteractionResult {
    if (state.actionPoints < ActionPointCost.Browse) {
        return failure("WormGround", `Not enough action points. A scroll costs ${ActionPointCost.Browse} AP.`);
    }
    dispatch(spendActionPoints(ActionPointCost.Browse));

    const undiscovered = allHangoutIds().filter(id => !state.discoveredHangouts.includes(id));
    const learned: string[] = [];
    let metFriend: string | undefined;

    const luck = Math.random();
    if (luck < 0.4 && undiscovered.length > 0) {
        const found = undiscovered[Math.floor(Math.random() * undiscovered.length)];
        dispatch(discoverHangout(found));
        learned.push(`Found ${getHangout(found)?.name ?? found}. It is on your map now.`);
    } else if (luck < 0.7) {
        const strangers = allFriendIds().filter(id => !state.friends.some(f => f.id === id));
        if (strangers.length > 0) {
            const id = strangers[Math.floor(Math.random() * strangers.length)];
            dispatch(discoverFriend(id));
            metFriend = getFriend(id)?.name;
        }
    }

    return {
        ok: true,
        title: "WormGround",
        message:
            learned.length === 0 && !metFriend
                ? "Nothing useful this time."
                : "",
        gains: [],
        apSpent: ActionPointCost.Browse,
        moneySpent: 0,
        metFriend,
        learned,
    };
}

// ---------------------------------------------------------------- the week

export interface WeekReport {
    week: number;
    salary: number;
    actionPoints: number;
    roommateGains: string[];
    drifted: string[];
    gameOver: boolean;
}

/**
 * Ends the week: pay day, action points refill, roommates warm up and everyone
 * you ignored drifts a little.
 */
export function advanceWeek(dispatch: AppDispatch, state: RootState): WeekReport {
    const salary = weeklySalary(state.job);
    const actionPoints = weeklyActionPoints(state.upgrades);
    const roommateGains: string[] = [];
    const drifted: string[] = [];

    state.friends.forEach((friendRecord) => {
        const name = getFriend(friendRecord.id)?.name ?? friendRecord.id;
        if (state.house.roommateIds.includes(friendRecord.id)) {
            dispatch(addFriendship({ id: friendRecord.id, amount: ROOMMATE_WEEKLY_GAIN }));
            roommateGains.push(`${name} +${ROOMMATE_WEEKLY_GAIN}`);
            return;
        }
        const seen = state.weeklyInteractions[friendRecord.id] ?? 0;
        if (seen === 0 && friendRecord.friendshipLevel > 0) {
            dispatch(addFriendship({ id: friendRecord.id, amount: -WEEKLY_DECAY }));
            drifted.push(`${name} -${WEEKLY_DECAY}`);
        }
    });

    dispatch(addMoney(salary));
    dispatch(setActionPoints(actionPoints));
    dispatch(setWeeklyInteractions({}));
    dispatch(nextWeek());

    const week = state.currentWeek + 1;
    return { week, salary, actionPoints, roommateGains, drifted, gameOver: isGameOver(week) };
}

function allHangoutIds(): string[] {
    return getEntities(EntityKindEnum.Hangout).map(entity => entity.id);
}

function allFriendIds(): string[] {
    return getEntities(EntityKindEnum.Friend).map(entity => entity.id);
}
