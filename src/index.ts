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

// ─── Built-in robot images ─────────────────────────────────────────────────

export { ROBOT_IMAGES } from './robot-data';

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