import type { InteractionResult } from "./interactions";
import type { ToastInput } from "@/components/ui/toastContext";

/**
 * Turns an interaction result into a toast. Keeps game types out of the toast
 * component and toast types out of the game logic.
 *
 * The bar is the friend's total friendship, not the share of some hidden
 * ceiling -- the player is meant to read the gauge and the reaction, not
 * reverse-engineer the payout.
 */
export function toastFromResult(result: InteractionResult): ToastInput {
    if (!result.ok) {
        return { title: result.title, tone: "error", message: result.message };
    }

    return {
        title: result.title,
        message: result.message || undefined,
        lines: result.gains.map(gain => ({
            label: gain.name,
            value: `${gain.gained >= 0 ? "+" : ""}${gain.gained}`,
            fill: gain.level / 100,
            meta: gain.tier,
            sub: gain.reaction ? [gain.reaction, ...gain.causes] : gain.causes,
        })),
        // Meeting somebody also gets its own dialog, but it belongs in the note
        // list too, otherwise the toast is blank and History records nothing.
        notes: [
            ...(result.metFriend ? [`You befriended ${result.metFriend}.`] : []),
            ...result.learned,
        ],
    };
}
