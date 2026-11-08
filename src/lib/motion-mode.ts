/**
 * Per-browser "full motion" preference.
 * Off = lighter path (no projects pointer 3D).
 * On  = full FX for machines that can handle it.
 * VIEW PROJECT cursor stays available either way.
 */

export const MOTION_MODE_KEY = "rsr-full-motion";
export const MOTION_MODE_EVENT = "rsr:motion-mode";

/** Default on so hero/projects FX are active out of the box. */
export const DEFAULT_FULL_MOTION = true;

export function readFullMotion(): boolean {
  if (typeof window === "undefined") return DEFAULT_FULL_MOTION;
  try {
    const raw = localStorage.getItem(MOTION_MODE_KEY);
    if (raw === null) return DEFAULT_FULL_MOTION;
    return raw === "1" || raw === "true";
  } catch {
    return DEFAULT_FULL_MOTION;
  }
}

export function writeFullMotion(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MOTION_MODE_KEY, enabled ? "1" : "0");
  } catch {
    /* private mode */
  }
  window.dispatchEvent(
    new CustomEvent(MOTION_MODE_EVENT, { detail: { enabled } }),
  );
}
