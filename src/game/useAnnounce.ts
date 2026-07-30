import { useCallback } from "react";
import { useToast } from "@/components/ui/toastContext";
import type { ToastInput } from "@/components/ui/toastContext";
import { addHistory } from "@/state/gameStateSlice";
import { useAppDispatch } from "@/state/hooks";
import store from "@/state/store";

/**
 * Shows a toast and files the same text in the History app. Everything the
 * player does goes through here, so the log is complete without each screen
 * having to remember to record itself.
 */
export function useAnnounce() {
    const toast = useToast();
    const dispatch = useAppDispatch();

    return useCallback(
        (input: ToastInput) => {
            toast(input);

            const lines: string[] = [];
            if (input.message) lines.push(input.message);
            input.lines?.forEach(line => {
                const head = [line.label, line.value].filter(Boolean).join(" ");
                lines.push(line.meta ? `${head} (${line.meta})` : head);
                line.sub?.forEach(sub => lines.push(sub));
            });
            input.notes?.forEach(note => lines.push(note));

            dispatch(
                addHistory({
                    week: store.getState().currentWeek,
                    title: input.title,
                    lines,
                }),
            );
        },
        [toast, dispatch],
    );
}
