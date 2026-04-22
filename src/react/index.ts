/**
 * robot-toast — React bindings
 * ─────────────────────────────────────────────────────────────────────────────
 * Thin React wrapper around the framework-agnostic core. The toast manager is
 * already a module-level singleton, so there's no Provider / Context needed —
 * just a hook that hands you the `toast` function with a stable reference.
 *
 *   import { useRobotToast } from 'robot-toast/react';
 *
 *   function SaveButton() {
 *     const toast = useRobotToast();
 *     return <button onClick={() => toast.success('Saved!')}>Save</button>;
 *   }
 *
 * For mount-scoped toasts (fire on mount, auto-close on unmount), use
 * `useToastOnMount`. Typical case: surfacing a persistent loading/status toast
 * while a component is on screen.
 */

import { useEffect, useRef } from 'react';
// Self-reference via the package name so tsup treats it as external and the
// React bundle doesn't duplicate the core. Node resolves this back to the
// package's own `.` export at runtime via the `exports` field.
import { toast as coreToast } from 'robot-toast';
import type { RobotToastOptions } from 'robot-toast';

/**
 * Returns the `toast` function. Stable across re-renders.
 * Equivalent to `import { toast } from 'robot-toast'`, but follows the
 * idiomatic React hook shape some teams prefer.
 */
export function useRobotToast(): typeof coreToast {
  return coreToast;
}

/**
 * Fire a toast when the component mounts, close it when the component unmounts.
 * `options` is read once (on mount) — subsequent changes do not update the toast.
 * To show a new toast, remount the component (e.g. via `key`).
 */
export function useToastOnMount(options: RobotToastOptions): void {
  const idRef = useRef<number | null>(null);

  useEffect(() => {
    idRef.current = coreToast(options);
    return () => {
      if (idRef.current != null) coreToast.closeById(idRef.current);
    };
    // options deliberately excluded — toast is fire-once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// Re-export the core function for people who want everything from one place.
export { toast } from 'robot-toast';

export type {
  RobotToastOptions,
  RobotToastAPI,
  ToastPosition,
  ToastType,
  ToastTheme,
  TransitionType,
} from 'robot-toast';
