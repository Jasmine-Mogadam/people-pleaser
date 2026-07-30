import type { LucideIcon } from "lucide-react";
import type { Friend } from "./friend";
import type { Preference } from "./preference";

export const EntityKindEnum = {
    Friend: "friend",
    Gift: "gift",
    Hangout: "hangout",
};
export type EntityKind = typeof EntityKindEnum[keyof typeof EntityKindEnum];

// Every png under assets, keyed by path. Lets us ask "is there art for this yet?"
// instead of pointing an <img> at a URL that 404s.
const allImages = import.meta.glob("../assets/**/*.png", {
    eager: true,
    query: "?url",
    import: "default",
}) as Record<string, string>;

/** "Fast Food Joint" -> "fast_food_joint", which is also the asset filename. */
export function slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export function findImage(folder: string, slug: string): string | undefined {
    return allImages[`../assets/${folder}/${slug}.png`];
}

// Populated once by catalog.ts. Entities look each other up through here so that
// friend/gift/hangout never have to import each other directly.
const registry: Record<EntityKind, GameEntity[]> = {
    [EntityKindEnum.Friend]: [],
    [EntityKindEnum.Gift]: [],
    [EntityKindEnum.Hangout]: [],
};

export function registerEntities(entities: GameEntity[]): void {
    entities.forEach((entity) => registry[entity.kind].push(entity));
}

export function getEntities(kind: EntityKind): GameEntity[] {
    return registry[kind];
}

export function getEntity(kind: EntityKind, id: string): GameEntity | undefined {
    return registry[kind].find((entity) => entity.id === id);
}

/** Resolves a saved "hangout:retro_arcade" style key back into the live object. */
export function getEntityByKey(key: string): GameEntity | undefined {
    const [kind, id] = key.split(":");
    if (!registry[kind]) return undefined;
    return getEntity(kind, id);
}

// Friends, gifts and hangouts all extend this, so the "who likes this" and
// "roll a new friend" logic only exists in one place.
abstract class GameEntity {
    abstract readonly kind: EntityKind;
    name: string;
    description: string;
    /** Stands in for drawn art. Gifts use one; characters and places have images. */
    icon?: LucideIcon;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    get id(): string {
        return slugify(this.name);
    }

    /** Stable, serializable identifier. Safe to put in redux/localStorage. */
    get key(): string {
        return `${this.kind}:${this.id}`;
    }

    get image(): string | undefined {
        return findImage(this.kind, this.id);
    }

    /**
     * Friends who like or love this entity. Compares by key rather than name so a
     * gift and a friend sharing a name can never be mistaken for each other.
     */
    getPeopleWhoLikeThis(): Friend[] {
        return (registry[EntityKindEnum.Friend] as Friend[]).filter((friend) =>
            friend.getLikes().some((p: Preference) => p.target.key === this.key),
        );
    }

    getPeopleWhoDislikeThis(): Friend[] {
        return (registry[EntityKindEnum.Friend] as Friend[]).filter((friend) =>
            friend.getDislikes().some((p: Preference) => p.target.key === this.key),
        );
    }

    /**
     * Rolls for a stranger to run into because of this entity. Returns the friend
     * so the caller can dispatch; entities never touch the store themselves.
     * Rarest tier wins, and each tier falls through if its pool is empty.
     */
    rollNewFriend(knownIds: string[]): Friend | null {
        const strangers = (registry[EntityKindEnum.Friend] as Friend[]).filter(
            (f) => !knownIds.includes(f.id),
        );
        if (strangers.length === 0) return null; // everyone has been met already

        const luck = Math.random() * 100;
        const pools: Friend[][] = [];
        if (luck >= 95) pools.push(strangers); // 5%: anyone at all
        if (luck >= 75) pools.push(this.pickIntroductionPool(strangers)); // 25%: someone who likes this

        const pool = pools.find((p) => p.length > 0);
        if (!pool) return null; // no luck this time

        return pool[Math.floor(Math.random() * pool.length)];
    }

    /** Overridden by Friend so introductions prefer their favorite people. */
    protected pickIntroductionPool(strangers: Friend[]): Friend[] {
        return this.getPeopleWhoLikeThis().filter((f) => strangers.includes(f));
    }
}

export { GameEntity };
