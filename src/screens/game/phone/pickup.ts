/**
 * The phone is a physical object lying at the bottom of the scene, so opening it
 * swings the handset up into the hand rather than sliding it straight up.
 *
 * The four keys below are sampled from the reference animation: the handset
 * kicks left and rotates as it comes up, overshoots to the right, then settles.
 * Running them through a monotone cubic keeps the curve from bulging past the
 * keys, which is what made the naive spline look like the phone was thrown.
 */

const KEY_T = [0, 54.05, 78.38, 100];
const KEY_X = [640, 504, 676, 640];
const KEY_Y = [350, -110, -65.3, 16];
const KEY_R = [0, -13.7, 2.7, 0];

/** Lifting takes longer than putting down, the way a real pickup does. */
export const OPEN_MS = 780;
export const CLOSE_MS = 700;

/** How much of the handset stays on screen once it is put away. */
const PEEK = 100;
/** How far below the top of its slot the handset rests when it is up. */
const RAISED = 48;

/**
 * Slopes for a monotone cubic through the keys. A slope is flattened to zero
 * wherever the curve changes direction, so the handset never overshoots a key it
 * was supposed to stop at.
 */
function autoTangents(ts: number[], vs: number[]): number[] {
    const slopes: number[] = [];
    for (let i = 0; i < ts.length; i++) {
        if (i === 0 || i === ts.length - 1) {
            slopes[i] = 0;
            continue;
        }
        const before = (vs[i] - vs[i - 1]) / (ts[i] - ts[i - 1]);
        const after = (vs[i + 1] - vs[i]) / (ts[i + 1] - ts[i]);
        if (before * after <= 0) {
            slopes[i] = 0;
            continue;
        }
        const slope = (vs[i + 1] - vs[i - 1]) / (ts[i + 1] - ts[i - 1]);
        const limit = 1.9 * Math.min(Math.abs(before), Math.abs(after));
        slopes[i] = Math.abs(slope) > limit ? Math.sign(slope) * limit : slope;
    }
    return slopes;
}

/** Samples one channel of the track at a progress value between 0 and 100. */
function track(ts: number[], vs: number[]): (t: number) => number {
    const slopes = autoTangents(ts, vs);
    return (t) => {
        let i = 0;
        while (i < ts.length - 2 && t > ts[i + 1]) i++;
        const span = ts[i + 1] - ts[i];
        const u = (t - ts[i]) / span;
        const v = 1 - u;
        const p0 = vs[i];
        const p1 = vs[i] + (slopes[i] * span) / 3;
        const p2 = vs[i + 1] - (slopes[i + 1] * span) / 3;
        const p3 = vs[i + 1];
        return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3;
    };
}

const trackX = track(KEY_T, KEY_X);
const trackY = track(KEY_T, KEY_Y);
const trackR = track(KEY_T, KEY_R);

/** Where the handset sits once nothing is animating. */
export function restTransform(height: number, open: boolean): string {
    const y = open ? RAISED : height - PEEK;
    return `translate(0px, ${y}px) rotate(0deg)`;
}

/**
 * Plays the swing on `el` and returns a cancel function. Written straight to the
 * element rather than through state: this runs every frame, and re-rendering the
 * whole phone sixty times a second to move one box would drop frames.
 */
export function playPickup(el: HTMLElement, open: boolean): () => void {
    const height = el.offsetHeight || 700;
    const duration = open ? OPEN_MS : CLOSE_MS;
    const travel = height - RAISED - PEEK;
    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
        // Closing is the same curve read backwards, so the handset retraces the
        // arc it came up on instead of taking a second, different route down.
        const elapsed = Math.min(1, (now - start) / duration) * 100;
        const t = open ? elapsed : 100 - elapsed;
        // The y channel runs 350 -> 16 across the swing; rescale it to the
        // fraction of the slot the handset still has to cover.
        const fraction = (trackY(t) - 16) / 334;
        const x = (trackX(t) - 640) * 0.5;
        const y = RAISED + fraction * travel;
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${trackR(t).toFixed(3)}deg)`;

        if (open ? t >= 100 : t <= 0) el.style.transform = restTransform(height, open);
        else raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
}
