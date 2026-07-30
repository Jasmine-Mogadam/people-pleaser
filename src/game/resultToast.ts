import type { InteractionResult } from "./interactions";
import type { ToastInput } from "@/components/ui/toast";

/**
 * Turns an interaction result into a toast. Keeps game types out of the toast
 * component and toast types out of the game logic.
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
            fill: gain.max > 0 ? gain.gained / gain.max : 0,
            sub: gain.reasons,
        })),
        notes: result.learned,
    };
}
