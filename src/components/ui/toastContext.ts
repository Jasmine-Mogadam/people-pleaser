import { createContext, useContext } from "react";

/**
 * Split out from toast.tsx so that file only exports components, which is what
 * fast refresh wants.
 */

export interface ToastLine {
    label: string;
    value?: string;
    /** 0-1, drawn as a small bar under the line. */
    fill?: number;
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

/** Errors hang around longer, since they are the ones worth reading. */
export const TOAST_LIFETIME = { default: 5000, error: 8000 };

export const ToastContext = createContext<(toast: ToastInput) => void>(() => { });

export function useToast() {
    return useContext(ToastContext);
}
