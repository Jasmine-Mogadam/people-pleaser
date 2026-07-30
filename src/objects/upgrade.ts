import { AlarmClock, CalendarDays, Dumbbell, type LucideIcon } from "lucide-react";

/**
 * Things you buy once. Every effect is a flat number the rules layer reads, so
 * adding an upgrade never means touching the interaction code.
 */
class Upgrade {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    price: number;
    /** Extra action points granted at the start of every week. */
    actionPointsPerWeek: number;

    constructor(
        id: string,
        name: string,
        description: string,
        icon: LucideIcon,
        price: number,
        actionPointsPerWeek: number,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.price = price;
        this.actionPointsPerWeek = actionPointsPerWeek;
    }

    /** Spelled out for the shop, so flavour and mechanics never get confused. */
    get effect(): string {
        const points = this.actionPointsPerWeek;
        return `+${points} action point${points === 1 ? "" : "s"} each week`;
    }
}
export { Upgrade };

export const AllUpgrades: Upgrade[] = [
    new Upgrade("calendar", "Calendar", "plan your days out a bit better", CalendarDays, 250, 1),
    new Upgrade("alarm_clock", "Alarm Clock", "the early bird gets the friend", AlarmClock, 700, 1),
    new Upgrade("gym_membership", "Gym Membership", "build stamina to walk longer distances", Dumbbell, 1800, 1),
];

export function getUpgrade(id: string): Upgrade | undefined {
    return AllUpgrades.find((u) => u.id === id);
}
