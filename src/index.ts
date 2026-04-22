/**
 * robot-toast v2
 * A lightweight, framework-agnostic toast notification library
 * with an animated robot character, multi-toast queue, and smooth drag.
 *
 * ── Basic usage ──────────────────────────────────────────────────────────────
 *   import { toast } from 'robot-toast';
 *   toast('Hello 🤖');
 *   toast({ message: 'Hello!', position: 'top-right', type: 'success' });
 *
 * ── Typed shorthands ─────────────────────────────────────────────────────────
 *   toast.success('Saved!');
 *   toast.error('Something went wrong');
 *   toast.info('Did you know…');
 *   toast.warning('Check your input');
 *
 * ── Class / manager ──────────────────────────────────────────────────────────
 *   import { RobotToast } from 'robot-toast';
 *   const manager = RobotToast.getInstance();
 *   const id = manager.show({ message: 'Hi!' });
 *   manager.closeById(id);
 */

import RobotToastManager from './toast';
import type { RobotToastOptions, RobotToastAPI } from './types';
import './styles-injector'; // Auto-inject styles

// ─── Core show function ────────────────────────────────────────────────────

type ToastInput = string | RobotToastOptions;

function normalise(input: ToastInput): RobotToastOptions {
  return typeof input === 'string' ? { message: input } : input;
}

/**
 * Show a toast notification.
 * Accepts either a plain string or a full options object.
 * Returns the toast id (useful for closeById).
 *
 * @example
 * toast('Hello 🤖');
 * toast({ message: 'Hello!', type: 'success', position: 'top-right' });
 */
function toast(input: ToastInput): number {
  if (typeof window === 'undefined') return -1;
  return RobotToastManager.getInstance().show(normalise(input));
}

// ── Typed shorthand helpers ───────────────────────────────────────────────────
toast.success = (input: ToastInput): number =>
  toast({ ...normalise(input), type: 'success' });

toast.error = (input: ToastInput): number =>
  toast({ ...normalise(input), type: 'error' });

toast.info = (input: ToastInput): number =>
  toast({ ...normalise(input), type: 'info' });

toast.warning = (input: ToastInput): number =>
  toast({ ...normalise(input), type: 'warning' });

// ── Close helpers ─────────────────────────────────────────────────────────────
/**
 * Close all visible toasts and clear the queue.
 */
toast.closeAll = (): void => {
  if (typeof window === 'undefined') return;
  RobotToastManager.getInstance().closeAll();
};

/**
 * Close a specific toast by the id returned from toast() / toast.show().
 */
toast.closeById = (id: number): void => {
  if (typeof window === 'undefined') return;
  RobotToastManager.getInstance().closeById(id);
};

// ── Promise helper ────────────────────────────────────────────────────────────

type PromiseMessage<T, E = unknown> = {
  loading: string | Partial<RobotToastOptions>;
  success: string | ((value: T) => string | Partial<RobotToastOptions>);
  error:   string | ((err: E) => string | Partial<RobotToastOptions>);
};

/**
 * Attach a toast lifecycle to a promise.
 * Shows a persistent `loading` toast; on settlement, closes it and shows a
 * `success` or `error` toast. Returns the original promise unchanged so
 * callers can still await / chain it.
 *
 * @example
 * toast.promise(fetch('/api/save'), {
 *   loading: 'Saving…',
 *   success: 'Saved!',
 *   error:   'Save failed',
 * });
 */
toast.promise = <T, E = unknown>(
  promise: Promise<T>,
  messages: PromiseMessage<T, E>,
): Promise<T> => {
  if (typeof window === 'undefined') return promise;

  const loadingOpts: RobotToastOptions =
    typeof messages.loading === 'string'
      ? { message: messages.loading }
      : { message: '', ...messages.loading };

  const loadingId = toast({
    autoClose: false,
    hideProgressBar: true,
    ...loadingOpts,
    // Override typeSpeed for loading so the text appears immediately — a loading
    // state that types letter-by-letter feels wrong.
    typeSpeed: loadingOpts.typeSpeed ?? 0,
  });

  const resolveOptions = (
    v: string | Partial<RobotToastOptions>,
    fallbackType: RobotToastOptions['type'],
  ): RobotToastOptions => {
    const base = typeof v === 'string' ? { message: v } : { message: '', ...v };
    return { type: fallbackType, ...base };
  };

  return promise.then(
    (value) => {
      toast.closeById(loadingId);
      const next = typeof messages.success === 'function'
        ? messages.success(value)
        : messages.success;
      toast(resolveOptions(next, 'success'));
      return value;
    },
    (err: E) => {
      toast.closeById(loadingId);
      const next = typeof messages.error === 'function'
        ? messages.error(err)
        : messages.error;
      toast(resolveOptions(next, 'error'));
      throw err;
    },
  );
};

export { toast };

// ─── Class export ──────────────────────────────────────────────────────────

export { default as RobotToast, RobotToastManager } from './toast';

// ─── Utilities ─────────────────────────────────────────────────────────────

export {
  ensureRobotToastReady,
  showRobotToast,
  closeAllRobotToasts,
  getRobotToastInstance,
} from './utils';

// ─── Types ─────────────────────────────────────────────────────────────────

export type {
  RobotToastOptions,
  RobotToastAPI,
  RobotToastInstance,
  ToastQueueItem,
  ToastPosition,
  ToastType,
  ToastTheme,
  TransitionType,
} from './types';

export {
  TOAST_POSITIONS,
  TOAST_TYPES,
  TOAST_THEMES,
  TOAST_TRANSITIONS,
} from './types';

// ─── Global registration (for script-tag / CDN usage) ──────────────────────

function registerGlobal(): void {
  if (typeof window === 'undefined') return;
  if (window.__robotToastLoaded) return;
  window.__robotToastLoaded = true;

  const api: RobotToastAPI = {
    show: (options: RobotToastOptions) => RobotToastManager.getInstance().show(options),
    closeAll: () => RobotToastManager.getInstance().closeAll(),
    closeById: (id: number) => RobotToastManager.getInstance().closeById(id),
    getInstance: () => RobotToastManager.getInstance(),
  };

  window.RobotToast = api;
}

registerGlobal();