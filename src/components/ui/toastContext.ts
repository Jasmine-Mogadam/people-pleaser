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
}

/**
 * Errors hang around longer, since they are the ones worth reading. Phone-sized
 * screens clear out faster and stack fewer, because four cards there cover the
 * game rather than sitting beside it.
 */
export const TOAST_LIFETIME = {
    default: { default: 5000, error: 8000 },
    small: { default: 2600, error: 4500 },
};

export const TOAST_STACK = { default: 4, small: 2 };

export const ToastContext = createContext<(toast: ToastInput) => void>(() => { });

export function useToast() {
    return useContext(ToastContext);
}
