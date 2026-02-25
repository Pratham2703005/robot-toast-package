/**
 * RobotToast Utilities v2
 * Helper functions for safer access to the RobotToast API.
 * Handles async readiness checks, SSR guards, and error boundaries.
 * Useful when loading robot-toast via a CDN <script> tag.
 */

import type { RobotToastOptions, RobotToastAPI } from './types';

/**
 * Wait for window.RobotToast to be available, up to `timeout` ms.
 * Resolves immediately if it is already loaded.
 * Useful when the library is loaded via a <script> tag and you need
 * to call it from another script that may execute first.
 */
export function ensureRobotToastReady(timeout = 5000): Promise<RobotToastAPI> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('[RobotToast] Cannot run outside of a browser environment.'));
      return;
    }

    if (window.RobotToast) {
      resolve(window.RobotToast);
      return;
    }

    const startTime   = Date.now();
    const interval    = setInterval(() => {
      if (window.RobotToast) {
        clearInterval(interval);
        resolve(window.RobotToast);
        return;
      }
      if (Date.now() - startTime >= timeout) {
        clearInterval(interval);
        reject(new Error(`[RobotToast] Failed to load within ${timeout}ms.`));
      }
    }, 80);
  });
}

/**
 * Show a robot toast notification.
 * Waits for the library to be ready before showing.
 * Returns the toast id or -1 on failure.
 */
export async function showRobotToast(options: RobotToastOptions): Promise<number> {
  try {
    const api = await ensureRobotToastReady();
    return api.show(options);
  } catch (err) {
    console.error('[RobotToast] showRobotToast failed:', err);
    return -1;
  }
}

/**
 * Close all visible toasts and clear the queue.
 */
export async function closeAllRobotToasts(): Promise<void> {
  try {
    const api = await ensureRobotToastReady();
    api.closeAll();
  } catch (err) {
    console.error('[RobotToast] closeAllRobotToasts failed:', err);
  }
}

/**
 * Close a specific toast by the id returned from show().
 */
export async function closeRobotToastById(id: number): Promise<void> {
  try {
    const api = await ensureRobotToastReady();
    api.closeById(id);
  } catch (err) {
    console.error('[RobotToast] closeRobotToastById failed:', err);
  }
}

/**
 * Get the RobotToast API instance.
 */
export async function getRobotToastInstance(): Promise<RobotToastAPI> {
  return ensureRobotToastReady();
}