import { EntityKindEnum, GameEntity, type EntityKind } from "./entity";
import type { Personality } from "./personality";
import { PreferenceEnum, type Preference, type PreferenceType } from "./preference";

/**
 * A character. This is catalog data only -- how they feel about *you* lives in
 * redux as a FriendRecord, because these instances cannot be saved to storage:
 * their preferences point at each other in a loop, which JSON.stringify hates.
 */
class Friend extends GameEntity {
    readonly kind: EntityKind = EntityKindEnum.Friend;
    owner: string;
    ownerUrl: string;
    personality: Personality;
    preferences: Preference[] = [];

    constructor(name: string, owner: string, personality: Personality, description = "") {
        super(name, description);
        this.owner = owner;
        this.ownerUrl = `https://artfight.net/~${owner}`;
        this.personality = personality;
    }

    getLikes(): Preference[] {
        return this.preferences.filter(
            (p) => p.preference === PreferenceEnum.Like || p.preference === PreferenceEnum.Favorite,
        );
    }

    getDislikes(): Preference[] {
        return this.preferences.filter(
            (p) => p.preference === PreferenceEnum.Dislike || p.preference === PreferenceEnum.Hate,
        );
    }

    getFavorites(): Preference[] {
        return this.preferences.filter((p) => p.preference === PreferenceEnum.Favorite);
    }

    /** How they feel about one specific thing, or null if they have no opinion on it. */
    preferenceFor(target: GameEntity): PreferenceType | null {
        return this.preferences.find((p) => p.target.key === target.key)?.preference ?? null;
    }

    /**
     * Only people. Filtering on kind rather than name means a hangout or gift that
     * happens to share a name with a character can never sneak in here.
     */
    getFriends(): Friend[] {
        return this.getLikes()
            .filter((p) => p.target.kind === EntityKindEnum.Friend)
            .map((p) => p.target as Friend);
    }

    /** The people they actively favorite, not just the ones they tolerate. */
    getBestFriends(): Friend[] {
        return this.getFavorites()
            .filter((p) => p.target.kind === EntityKindEnum.Friend)
            .map((p) => p.target as Friend);
    }

    /** Friends introduce their favorite people first, then anyone else they like. */
    protected override pickIntroductionPool(strangers: Friend[]): Friend[] {
        const best = this.getBestFriends().filter((f) => strangers.includes(f));
        if (best.length > 0) return best;
        return this.getFriends().filter((f) => strangers.includes(f));
    }
}

export { Friend };
