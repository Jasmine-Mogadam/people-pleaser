import { createContext, useContext } from "react";

/**
 * Split out from toast.tsx so that file only exports components, which is what
 * fast refresh wants.
 */

export interface ToastLine {
    label: string;
    value?: string;
    /** 0-1 total, drawn as a bar under the line. */
    fill?: number;
    /** 0-1 of that total which this action just added (or removed, if negative). */
    delta?: number;
    /** Sits under the bar, e.g. the familiarity title. */
    meta?: string;
    sub?: string[];
}

export interface ToastInput {
    title: string;
    tone?: "default" | "error";
    message?: string;
    lines?: ToastLine[];
    notes?: string[];
}

export interface Toast extends ToastInput {
    id: number;
    /** On its way out, and being held in the tree long enough to animate off. */
    leaving?: boolean;
}

/**
 * Errors hang around longer, since they are the ones worth reading. Phone-sized
 * screens clear out faster, because a banner there covers the game rather than
 * sitting over a corner of it.
 */
export const TOAST_LIFETIME = {
    default: { default: 5000, error: 8000 },
    small: { default: 2600, error: 4500 },
};

export const ToastContext = createContext<(toast: ToastInput) => void>(() => { });

export function useToast() {
    return useContext(ToastContext);
}

/**
 * The other half of the toast context: what is currently showing, for whoever
 * draws it. These arrive as banner notifications on the phone, so the provider
 * holds the state and the handset renders it -- one at a time, the way a phone
 * shows a notification, with a new one replacing whatever was still up.
 */
export interface ToastFeed {
    current: Toast | undefined;
    dismiss: (id: number) => void;
}

export const ToastFeedContext = createContext<ToastFeed>({
    current: undefined,
    dismiss: () => { },
});

export function useToastFeed() {
    return useContext(ToastFeedContext);
}
