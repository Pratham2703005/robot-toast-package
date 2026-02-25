/**
 * RobotToast Types & Constants
 * Type definitions and constant arrays for the robot toast notification library
 */

/** Array of all valid toast positions */
export const TOAST_POSITIONS = [
  'top-right',
  'top-left',
  'top-center',
  'bottom-right',
  'bottom-left',
  'bottom-center',
] as const;

/** Array of all valid toast types */
export const TOAST_TYPES = ['default', 'info', 'success', 'warning', 'error'] as const;

/** Array of all valid toast themes */
export const TOAST_THEMES = ['light', 'dark', 'colored'] as const;

/** Array of all valid transition animations */
export const TOAST_TRANSITIONS = ['bounce', 'slide', 'zoom', 'flip'] as const;

/** Type derived from TOAST_POSITIONS constant */
export type ToastPosition = typeof TOAST_POSITIONS[number];

/** Type derived from TOAST_TYPES constant */
export type ToastType = typeof TOAST_TYPES[number];

/** Type derived from TOAST_THEMES constant */
export type ToastTheme = typeof TOAST_THEMES[number];

/** Type derived from TOAST_TRANSITIONS constant */
export type TransitionType = typeof TOAST_TRANSITIONS[number];

export interface RobotToastOptions {
  /** The message text to display in the toast */
  message: string;

  /** Auto-close duration in ms, or false to disable. Default: 5000 */
  autoClose?: boolean | number;

  /** Position of the toast on screen. Default: 'bottom-right' */
  position?: ToastPosition;

  /** Toast type/style. Default: 'default' */
  type?: ToastType;

  /** Visual theme. Default: 'light' */
  theme?: ToastTheme;

  /**
   * Inline style object to apply directly to the message box element.
   * This allows runtime customization of colors, fonts, backgrounds, etc.
   * Example: { color: 'red', backgroundColor: 'blue' }
   * This takes precedence over className for conflicting properties.
   */
  style?: Record<string, string | number>;

  /** Typing speed in ms per character. 0 = instant. Default: 30 */
  typeSpeed?: number;

  /**
   * Robot image to display.
   * - Built-in: 'wave', 'error', 'success', 'base', 'base2', 'angry', 'angry2', 'shock',
   *   'think', 'search', 'loading', 'sleep', 'head-palm', 'type', 'validation', 'validation2'
   *   (these use embedded data URLs, no external files needed)
   * - Custom: any path accessible in your app (e.g., 'dxd/bird.jpg', 'public/my-robot.svg')
   * - None: 'none' to hide the robot entirely
   * Accepted formats for custom images: svg, png, jpg, jpeg, gif, webp.
   * Anything unrecognized falls back to the built-in robot.
   */
  robotVariant?: string;

  /** Hide the countdown progress bar. Default: false */
  hideProgressBar?: boolean;

  /** Pause the auto-close countdown when the window loses focus. Default: true */
  pauseOnFocusLoss?: boolean;

  /** Allow the user to drag the toast around the screen. Default: true */
  draggable?: boolean;

  /**
   * Position the robot near the screen edge (true) or away from it (false).
   * - true: robot appears between screen edge and message bubble
   * - false: message bubble appears between screen edge and robot
   * The position is automatically determined by the toast position and this setting.
   * Default: true
   */
  nearScreen?: boolean;

  /** Pause the auto-close countdown while the cursor is over the toast. Default: true */
  pauseOnHover?: boolean;

  /**
   * Maximum number of toasts visible simultaneously.
   * Excess toasts are queued and shown as soon as a slot opens.
   * 0 = unlimited (queue still works, all show in parallel). Default: 0
   */
  limit?: number;

  /** Stack newest toasts on top of older ones. Default: false */
  newestOnTop?: boolean;

  /** Right-to-left layout (message on the right, robot on the left). Default: false */
  rtl?: boolean;

  /** Entry / exit transition style. Default: 'bounce' */
  transition?: TransitionType;

  /** Called when the toast finishes its enter animation and is fully visible. */
  onOpen?: () => void;

  /** Called after the toast has fully exited the screen. */
  onClose?: () => void;
}

/** Internal representation of a queued toast item */
export interface ToastQueueItem {
  options: RobotToastOptions;
  id: number;
}

export interface RobotToastAPI {
  /** Show a toast notification – queued automatically when limit is reached */
  show: (options: RobotToastOptions) => number;
  /** Immediately close all visible toasts and clear the queue */
  closeAll: () => void;
  /** Close a specific toast by the id returned from show() */
  closeById: (id: number) => void;
  /** Get the RobotToastManager instance */
  getInstance: () => RobotToastInstance;
}

export interface RobotToastInstance {
  show: (options: RobotToastOptions) => number;
  closeAll: () => void;
  closeById: (id: number) => void;
}

declare global {
  interface Window {
    __robotToastLoaded?: boolean;
    __robotToastUtilsLoaded?: boolean;
    RobotToast?: RobotToastAPI;
    RobotToastUtils?: {
      showRobotToast: (options: RobotToastOptions) => Promise<number>;
      closeAllRobotToasts: () => Promise<void>;
      closeRobotToastById: (id: number) => Promise<void>;
      getRobotToastInstance: () => Promise<RobotToastAPI>;
      ensureRobotToastReady: (timeout?: number) => Promise<RobotToastAPI>;
    };
  }
}