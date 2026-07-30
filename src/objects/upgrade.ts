/**
 * Things you buy once. Every effect is a flat number the rules layer reads, so
 * adding an upgrade never means touching the interaction code.
 */
class Upgrade {
    id: string;
    name: string;
    price: number;
    /** Extra action points granted at the start of every week. */
    actionPointsPerWeek: number;
    /** Extra dollars added to every paycheck. */
    salaryBonus: number;
    /** Requires this upgrade to be bought first, if set. */
    requires?: string;

    constructor(
        id: string,
        name: string,
        price: number,
        effects: { actionPointsPerWeek?: number; salaryBonus?: number; requires?: string },
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.actionPointsPerWeek = effects.actionPointsPerWeek ?? 0;
        this.salaryBonus = effects.salaryBonus ?? 0;
        this.requires = effects.requires;
    }
}
export { Upgrade };

// Named after what they do -- the price curve is the interesting part.
export const AllUpgrades: Upgrade[] = [
    new Upgrade("ap_1", "+1 Action Point / week", 250, { actionPointsPerWeek: 1 }),
    new Upgrade("ap_2", "+1 Action Point / week (II)", 700, {
        actionPointsPerWeek: 1,
        requires: "ap_1",
    }),
    new Upgrade("ap_3", "+2 Action Points / week (III)", 1800, {
        actionPointsPerWeek: 2,
        requires: "ap_2",
    }),
    new Upgrade("salary_1", "+$40 / paycheck", 400, { salaryBonus: 40 }),
    new Upgrade("salary_2", "+$90 / paycheck", 1200, { salaryBonus: 90, requires: "salary_1" }),
];

export function getUpgrade(id: string): Upgrade | undefined {
    return AllUpgrades.find((u) => u.id === id);
}
