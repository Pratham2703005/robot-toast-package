/**
 * RobotToast v2
 * ─────────────────────────────────────────────────────────────────────────────
 * • Multi-toast support with configurable limit + queue
 * • Each toast is a self-contained ToastItem instance – no shared mutable state
 * • Sequenced robot enter → message pop-in, message pop-out → robot exit
 * • Full XY drag with viewport clamping; on drop the robot snaps to the
 *   nearest screen edge (left / right) with a personality animation
 * • Progress bar auto-animates for the countdown; pauses correctly on hover
 *   and drag; resumes with exact remaining time
 * • All event listeners are tracked and fully removed on close
 * • SVG-only enforcement for custom robot images; always renders at fixed size
 * • SSR-safe (all DOM access is guarded by typeof window / document checks)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { RobotToastOptions, ToastQueueItem } from './types';
import InjectStyles from './styles-injector';
import { ROBOT_IMAGES } from './robot-data';

// ─── Unique ID counter ────────────────────────────────────────────────────────
let _nextId = 1;
function nextId(): number { return _nextId++; }

// ─── Vertical offset step between stacked toasts (px) ────────────────────────
const STACK_GAP = 16;

/* ═══════════════════════════════════════════════════════════════════════════
   ToastItem  –  one live toast on screen
   ═══════════════════════════════════════════════════════════════════════════ */
class ToastItem {
  readonly id: number;
  private options: {
    message: string;
    autoClose: boolean | number;
    position: NonNullable<RobotToastOptions['position']>;
    type: NonNullable<RobotToastOptions['type']>;
    theme: NonNullable<RobotToastOptions['theme']>;
    style?: Record<string, string | number>;
    typeSpeed: number;
    robotVariant: string;
    hideProgressBar: boolean;
    pauseOnFocusLoss: boolean;
    draggable: boolean;
    nearScreen: boolean;
    pauseOnHover: boolean;
    rtl: boolean;
    transition: NonNullable<RobotToastOptions['transition']>;
    onOpen?: () => void;
    onClose?: () => void;
  };

  // DOM refs
  private wrapper: HTMLDivElement;
  private robotEl: HTMLDivElement;
  private messageBox: HTMLDivElement;
  private progressBar: HTMLDivElement | null = null;
  private messageText: HTMLDivElement;

  // Timer state
  private autoCloseDuration: number;        // ms; 0 = no auto-close
  private remainingTime: number;            // ms left on the countdown
  private timerStart: number | null = null; // when the current timer was set
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  // Interaction state
  private isDragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private currentRobotSide: 'left' | 'right';
  private isHovered = false;
  private isFocusLost = false;
  private isClosed = false;

  // Cleanup
  private cleanupFns: Array<() => void> = [];

  // Callback to notify the manager when this toast dies
  private onRemove: (id: number) => void;

  constructor(id: number, options: RobotToastOptions, onRemove: (id: number) => void) {
    this.id = id;
    this.onRemove = onRemove;

    // ── Resolve all options with defaults ──────────────────────────────────
    const resolved = {
      message:          options.message,
      autoClose:        options.autoClose        ?? 5000,
      position:         options.position         ?? 'bottom-right',
      type:             options.type             ?? 'default',
      theme:            options.theme            ?? 'light',
      style:            options.style,
      typeSpeed:        options.typeSpeed        ?? 30,
      robotVariant:     options.robotVariant     ?? '',
      hideProgressBar:  options.hideProgressBar  ?? false,
      pauseOnFocusLoss: options.pauseOnFocusLoss ?? true,
      draggable:        options.draggable        ?? true,
      nearScreen:       options.nearScreen       ?? true,
      pauseOnHover:     options.pauseOnHover     ?? true,
      rtl:              options.rtl              ?? false,
      transition:       options.transition       ?? 'bounce',
      onOpen:           options.onOpen,
      onClose:          options.onClose,
    };

    this.options = resolved;
    
    // Determine initial robot side based on nearScreen
    // nearScreen: true → robot near screen edge (position's side)
    // nearScreen: false → robot away from screen edge (opposite side)
    const positionIsLeft = resolved.position.includes('left');
    
    let initialSide: 'left' | 'right';
    if (resolved.nearScreen) {
      // Robot near edge: follow position
      initialSide = positionIsLeft ? 'left' : 'right';
    } else {
      // Robot away from edge: opposite of position
      initialSide = positionIsLeft ? 'right' : 'left';
    }
    this.currentRobotSide = initialSide;
    this.autoCloseDuration = typeof resolved.autoClose === 'number'
      ? resolved.autoClose
      : (resolved.autoClose ? 5000 : 0);
    this.remainingTime = this.autoCloseDuration;

    // ── Build DOM ──────────────────────────────────────────────────────────
    this.wrapper     = this.buildWrapper();
    this.robotEl     = this.buildRobot();
    this.messageBox  = this.buildMessageBox();
    this.messageText = this.messageBox.querySelector('.robot-toast-text')!;
    this.progressBar = this.messageBox.querySelector('.robot-toast-progress-bar');

    this.assembleLayout();
    document.body.appendChild(this.wrapper);

    // ── Wire interactions ──────────────────────────────────────────────────
    if (resolved.draggable)        this.initDrag();
    if (resolved.pauseOnFocusLoss) this.initFocusWatcher();
    if (resolved.pauseOnHover)     this.initHoverWatcher();

    // ── Kick off the entrance sequence ─────────────────────────────────────
    requestAnimationFrame(() => this.playEntrance());
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  close(): void {
    if (this.isClosed) return;
    this.isClosed = true;

    this.cancelTimer();
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];

    this.playExit(() => {
      if (this.wrapper.parentNode) {
        this.wrapper.parentNode.removeChild(this.wrapper);
      }
      this.options.onClose?.();
      this.onRemove(this.id);
    });
  }

  /** Shift this toast vertically by `delta` px (used by manager for stacking) */
  shiftVertical(bottomPx: number): void {
    const pos = this.options.position;
    if (pos.startsWith('bottom')) {
      this.wrapper.style.bottom = `${bottomPx}px`;
    } else {
      this.wrapper.style.top = `${bottomPx}px`;
    }
  }

  getWrapperHeight(): number {
    return this.wrapper.getBoundingClientRect().height || 90;
  }

  // ── DOM builders ───────────────────────────────────────────────────────────

  private buildWrapper(): HTMLDivElement {
    const w = document.createElement('div');
    const classes = ['robot-toast-wrapper', `robot-toast-${this.options.position}`];
    if (this.options.rtl) classes.push('robot-toast-rtl');
    w.className = classes.join(' ');
    return w;
  }

  private buildRobot(): HTMLDivElement {
    const r = document.createElement('div');
    r.className = 'robot-toast-robot';

    const variant = this.options.robotVariant;

    if (variant === 'none') {
      // 'none' = no robot image at all, hide the container
      r.style.display = 'none';
    } else if (variant) {
      // Check if it's a built-in robot (data URL)
      if (variant in ROBOT_IMAGES) {
        // Use embedded data URL
        const img = document.createElement('img');
        img.src    = ROBOT_IMAGES[variant as keyof typeof ROBOT_IMAGES];
        img.alt    = 'Robot';
        img.setAttribute('width',  '65');
        img.setAttribute('height', '70');
        img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
        img.onerror = () => { r.innerHTML = this.getBuiltinSVG(); };
        r.appendChild(img);
      } else {
        // Custom image – user provides full path, fall back to built-in SVG on error
        const ALLOWED_FORMATS = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
        const isAllowed = ALLOWED_FORMATS.some(ext => variant.toLowerCase().endsWith(ext));

        if (!isAllowed) {
          r.innerHTML = this.getBuiltinSVG();
        } else {
          const img = document.createElement('img');
          img.src    = variant;  // User provides full path directly
          img.alt    = 'Robot';
          img.setAttribute('width',  '65');
          img.setAttribute('height', '70');
          img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
          img.onerror = () => { r.innerHTML = this.getBuiltinSVG(); };
          r.appendChild(img);
        }
      }
    } else {
      // Empty string / undefined = built-in robot
      r.innerHTML = this.getBuiltinSVG();
    }

    return r;
  }

  private buildMessageBox(): HTMLDivElement {
    const box = document.createElement('div');
    const classes = [
      'robot-toast-message',
      `robot-toast-type-${this.options.type}`,
      `robot-toast-theme-${this.options.theme}`,
    ].filter(Boolean);
    box.className = classes.join(' ');
    box.style.cursor = this.options.draggable ? 'grab' : 'default';

    // Apply inline styles if provided (takes precedence over theme colors)
    if (this.options.style) {
      Object.entries(this.options.style).forEach(([key, value]) => {
        const camelCaseKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        (box.style as any)[camelCaseKey] = value;
      });
    }

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className   = 'robot-toast-close';
    closeBtn.innerHTML   = '&times;';
    closeBtn.title       = 'Dismiss';
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.close(); });
    box.appendChild(closeBtn);

    // Message text
    const text = document.createElement('div');
    text.className = 'robot-toast-text';
    box.appendChild(text);

    // Progress bar
    const pContainer = document.createElement('div');
    pContainer.className = 'robot-toast-progress-container';
    if (this.options.hideProgressBar) pContainer.style.display = 'none';

    const pBar = document.createElement('div');
    pBar.className = 'robot-toast-progress-bar';

    pContainer.appendChild(pBar);
    box.appendChild(pContainer);

    return box;
  }

  private assembleLayout(): void {
    const { rtl } = this.options;
    this.wrapper.innerHTML = '';

    // Decide order: rtl flips everything, robot side controls natural order
    const robotOnLeft = rtl ? this.currentRobotSide === 'right' : this.currentRobotSide === 'left';

    if (robotOnLeft) {
      this.wrapper.appendChild(this.robotEl);
      this.wrapper.appendChild(this.messageBox);
    } else {
      this.wrapper.appendChild(this.messageBox);
      this.wrapper.appendChild(this.robotEl);
    }
  }

  // ── Sequenced animations ───────────────────────────────────────────────────

  private playEntrance(): void {
    // Step 1 – wrapper becomes visible
    this.wrapper.classList.add('robot-toast-visible');

    const robotHidden = this.options.robotVariant === 'none';

    const showMessage = () => {
      // Message pops in
      const msgEnterClass = this.options.transition === 'bounce'
        ? 'message-enter'
        : `message-enter-${this.options.transition}`;
      this.messageBox.classList.add(msgEnterClass);

      const onMsgEntered = () => {
        this.messageBox.removeEventListener('animationend', onMsgEntered);
        this.messageBox.classList.remove(msgEnterClass);
        this.messageBox.style.opacity  = '1';
        this.messageBox.style.transform = 'none';

        this.options.onOpen?.();
        this.startTyping();
      };
      this.messageBox.addEventListener('animationend', onMsgEntered, { once: true });
    };

    if (robotHidden) {
      // No robot – skip robot entrance, go straight to message
      showMessage();
    } else {
      // Step 2 – robot runs in with selected transition style
      const side = this.currentRobotSide === 'left' ? 'left' : 'right';
      const transitionSuffix = this.options.transition !== 'bounce' ? `-${this.options.transition}` : '';
      const enterClass = `robot-enter-${side}${transitionSuffix}`;
      this.robotEl.classList.add(enterClass);

      const onRobotEntered = () => {
        this.robotEl.removeEventListener('animationend', onRobotEntered);
        this.robotEl.style.opacity = '1';
        this.robotEl.classList.remove(enterClass);
        this.robotEl.classList.add('robot-idle');
        showMessage();
      };
      this.robotEl.addEventListener('animationend', onRobotEntered, { once: true });
    }
  }

  private playExit(done: () => void): void {
    const robotHidden = this.options.robotVariant === 'none';

    // Step 1 – message collapses
    this.messageBox.classList.add('message-exit');

    const afterMsg = () => {
      this.messageBox.removeEventListener('animationend', afterMsg);

      if (robotHidden) {
        // No robot – skip robot exit, just fade wrapper
        this.wrapper.classList.remove('robot-toast-visible');
        setTimeout(done, 260);
      } else {
        this.robotEl.classList.remove('robot-idle', 'robot-snap-left', 'robot-snap-right');

        // Step 2 – robot runs out with selected transition style
        const side = this.currentRobotSide === 'left' ? 'left' : 'right';
        const transitionSuffix = this.options.transition !== 'bounce' ? `-${this.options.transition}` : '';
        const exitClass = `robot-exit-${side}${transitionSuffix}`;
        this.robotEl.classList.add(exitClass);

        const afterRobot = () => {
          this.robotEl.removeEventListener('animationend', afterRobot);
          this.wrapper.classList.remove('robot-toast-visible');
          setTimeout(done, 260);
        };
        this.robotEl.addEventListener('animationend', afterRobot, { once: true });
      }
    };
    this.messageBox.addEventListener('animationend', afterMsg, { once: true });
  }

  // ── Typing effect ──────────────────────────────────────────────────────────

  private startTyping(): void {
    const { message, typeSpeed } = this.options;
    const el = this.messageText;

    if (typeSpeed === 0) {
      // Instant – no animation
      el.textContent = message;
      this.afterTypingComplete();
      return;
    }

    let index  = 0;
    let active = true;

    // Register cleanup so that if toast is closed mid-type the loop stops
    this.cleanupFns.push(() => { active = false; });

    const tick = () => {
      if (!active) return;
      if (index < message.length) {
        el.textContent += message.charAt(index++);
        setTimeout(tick, typeSpeed);
      } else {
        this.afterTypingComplete();
      }
    };
    tick();
  }

  private afterTypingComplete(): void {
    // Always start auto-progress-bar animation (unless hidden)
    if (this.autoCloseDuration > 0 && !this.options.hideProgressBar && this.progressBar) {
      this.progressBar.style.animationDuration = `${this.autoCloseDuration}ms`; // set duration FIRST
      void this.progressBar.offsetWidth;                                         // flush
      this.progressBar.classList.add('robot-toast-progress-auto');               // THEN start
      if (this.isHovered || this.isFocusLost) {
        this.progressBar.classList.add('robot-toast-progress-paused');
      }
    }

    // Start the close timer unless something is currently pausing it
    if (!this.isHovered && !this.isFocusLost) {
      this.startTimer();
    }
  }

  // ── Timer management ───────────────────────────────────────────────────────

  private startTimer(): void {
    if (this.autoCloseDuration <= 0 || this.remainingTime <= 0) return;
    this.timerStart = Date.now();
    this.closeTimeout = setTimeout(() => this.close(), this.remainingTime);
  }

  private pauseTimer(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
      if (this.timerStart !== null) {
        const elapsed = Date.now() - this.timerStart;
        this.remainingTime = Math.max(0, this.remainingTime - elapsed);
        this.timerStart    = null;
      }
    }
    this.progressBar?.classList.add('robot-toast-progress-paused');
  }

  private resumeTimer(): void {
    if (this.isHovered || this.isFocusLost || this.isDragging) return;
    this.progressBar?.classList.remove('robot-toast-progress-paused');
    this.startTimer();
  }

  private cancelTimer(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  // ── Hover watcher ──────────────────────────────────────────────────────────

  private initHoverWatcher(): void {
    const onEnter = () => {
      this.isHovered = true;
      this.pauseTimer();
    };
    const onLeave = () => {
      this.isHovered = false;
      this.resumeTimer();
    };
    this.wrapper.addEventListener('mouseenter', onEnter);
    this.wrapper.addEventListener('mouseleave', onLeave);
    this.cleanupFns.push(() => {
      this.wrapper.removeEventListener('mouseenter', onEnter);
      this.wrapper.removeEventListener('mouseleave', onLeave);
    });
  }

  // ── Focus watcher ──────────────────────────────────────────────────────────

  private initFocusWatcher(): void {
    const onBlur = () => {
      this.isFocusLost = true;
      this.pauseTimer();
    };
    const onFocus = () => {
      this.isFocusLost = false;
      this.resumeTimer();
    };
    window.addEventListener('blur',  onBlur);
    window.addEventListener('focus', onFocus);
    this.cleanupFns.push(() => {
      window.removeEventListener('blur',  onBlur);
      window.removeEventListener('focus', onFocus);
    });
  }

  // ── Drag ──────────────────────────────────────────────────────────────────

  private initDrag(): void {
    this.messageBox.style.cursor = 'grab';

    // ── Pointer events (covers both mouse & touch via pointer API) ──────────
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.robot-toast-close')) return;
      // Only primary button / first touch
      if (e.button !== undefined && e.button !== 0) return;

      e.preventDefault();
      this.isDragging = true;
      this.pauseTimer();

      // "Detach" the wrapper from its CSS-positioned slot by converting its
      // current visual position into explicit inline top/left values.
      const rect = this.wrapper.getBoundingClientRect();
      this.wrapper.classList.add('robot-toast-dragging');

      // Inline position so the wrapper sits exactly where it was
      this.wrapper.style.top    = `${rect.top}px`;
      this.wrapper.style.left   = `${rect.left}px`;
      this.wrapper.style.right  = 'auto';
      this.wrapper.style.bottom = 'auto';
      this.wrapper.style.transform = 'none';

      // Offset = where inside the wrapper the pointer grabbed
      this.dragOffsetX = e.clientX - rect.left;
      this.dragOffsetY = e.clientY - rect.top;

      this.messageBox.style.cursor = 'grabbing';
      this.wrapper.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDragging) return;
      e.preventDefault();

      const wRect = this.wrapper.getBoundingClientRect();
      const maxX  = window.innerWidth  - wRect.width;
      const maxY  = window.innerHeight - wRect.height;

      const newLeft = Math.max(0, Math.min(e.clientX - this.dragOffsetX, maxX));
      const newTop  = Math.max(0, Math.min(e.clientY - this.dragOffsetY, maxY));

      this.wrapper.style.left = `${newLeft}px`;
      this.wrapper.style.top  = `${newTop}px`;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.wrapper.classList.remove('robot-toast-dragging');
      this.messageBox.style.cursor = 'grab';

      // ── Snap to nearest horizontal screen edge ────────────────────────────
      const wRect  = this.wrapper.getBoundingClientRect();
      const midX   = wRect.left + wRect.width / 2;
      const centerX = window.innerWidth / 2;
      
      // Determine which edge to snap to based on which half the center is in
      const snapToLeft = midX < centerX;
      
      // Determine robot side based on nearScreen setting
      const newRobotSide: 'left' | 'right' = this.options.nearScreen 
        ? (snapToLeft ? 'left' : 'right')
        : (snapToLeft ? 'right' : 'left');
      
      // Determine final resting left position (20px margin from edge)
      const finalLeft = snapToLeft ? 20 : window.innerWidth - wRect.width - 20;
      const finalTop  = Math.max(20, Math.min(wRect.top, window.innerHeight - wRect.height - 20));

      // Re-enable transitions for the snap glide
      this.wrapper.style.transition =
        'left 0.45s cubic-bezier(0.34,1.56,0.64,1), top 0.4s cubic-bezier(0.34,1.56,0.64,1)';
      this.wrapper.style.left = `${finalLeft}px`;
      this.wrapper.style.top  = `${finalTop}px`;

      // Update robot side if it changed
      if (newRobotSide !== this.currentRobotSide) {
        this.currentRobotSide = newRobotSide;

        // Use CSS order to visually reorder (no DOM detach = no animation restart)
        const robotOnLeft = newRobotSide === 'left';
        this.robotEl.style.order    = robotOnLeft ? '0' : '1';
        this.messageBox.style.order = robotOnLeft ? '1' : '0';

        // Snap animation
        const snapClass = newRobotSide === 'left' ? 'robot-snap-left' : 'robot-snap-right';
        this.robotEl.classList.remove('robot-idle', 'robot-snap-left', 'robot-snap-right');
        this.robotEl.classList.add(snapClass);
        this.robotEl.addEventListener('animationend', () => {
          this.robotEl.style.opacity = '1';
          this.robotEl.classList.remove(snapClass);
          this.robotEl.classList.add('robot-idle');
        }, { once: true });
      }
      const clearTransition = () => {
        this.wrapper.style.transition = '';
      };
      setTimeout(clearTransition, 500);

      // Resume the auto-close timer
      this.resumeTimer();
    };

    this.wrapper.addEventListener('pointerdown', onPointerDown);
    this.wrapper.addEventListener('pointermove', onPointerMove);
    this.wrapper.addEventListener('pointerup',   onPointerUp);
    this.wrapper.addEventListener('pointercancel', onPointerUp);

    this.cleanupFns.push(() => {
      this.wrapper.removeEventListener('pointerdown',   onPointerDown);
      this.wrapper.removeEventListener('pointermove',   onPointerMove);
      this.wrapper.removeEventListener('pointerup',     onPointerUp);
      this.wrapper.removeEventListener('pointercancel', onPointerUp);
    });
  }

  // ── Built-in robot SVG ─────────────────────────────────────────────────────

  private getBuiltinSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"
              width="100%" height="100%" role="img" aria-label="Robot">
      <defs>
        <linearGradient id="rtGrad${this.id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="#E2F0FF"/>
          <stop offset="100%" stop-color="#B8D8FF"/>
        </linearGradient>
        <linearGradient id="rtAccent${this.id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#7CB9FF"/>
          <stop offset="100%" stop-color="#4A90D9"/>
        </linearGradient>
      </defs>
      <!-- Antenna -->
      <line x1="50" y1="4" x2="50" y2="18" stroke="#2B3A55" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="50" cy="4" r="4" fill="#FF6B6B"/>
      <!-- Head -->
      <rect x="24" y="18" width="52" height="40" rx="10" ry="10"
            fill="url(#rtGrad${this.id})" stroke="#2B3A55" stroke-width="2"/>
      <!-- Eyes -->
      <circle cx="38" cy="36" r="6" fill="#2B3A55"/>
      <circle cx="62" cy="36" r="6" fill="#2B3A55"/>
      <circle cx="40" cy="34" r="2" fill="#ffffff"/>
      <circle cx="64" cy="34" r="2" fill="#ffffff"/>
      <!-- Mouth -->
      <path d="M 38 50 Q 50 58 62 50" stroke="#2B3A55" stroke-width="2"
            fill="none" stroke-linecap="round"/>
      <!-- Neck -->
      <rect x="44" y="58" width="12" height="8" rx="3"
            fill="url(#rtAccent${this.id})" stroke="#2B3A55" stroke-width="1.5"/>
      <!-- Body -->
      <rect x="22" y="66" width="56" height="44" rx="10" ry="10"
            fill="url(#rtGrad${this.id})" stroke="#2B3A55" stroke-width="2"/>
      <!-- Chest panel -->
      <rect x="34" y="76" width="32" height="20" rx="5"
            fill="url(#rtAccent${this.id})" stroke="#2B3A55" stroke-width="1.5"/>
      <circle cx="42" cy="86" r="3" fill="#FF6B6B"/>
      <circle cx="50" cy="86" r="3" fill="#FFD700"/>
      <circle cx="58" cy="86" r="3" fill="#6BFF8A"/>
      <!-- Arms -->
      <rect x="4"  y="68" width="18" height="30" rx="9"
            fill="url(#rtGrad${this.id})" stroke="#2B3A55" stroke-width="2"/>
      <rect x="78" y="68" width="18" height="30" rx="9"
            fill="url(#rtGrad${this.id})" stroke="#2B3A55" stroke-width="2"/>
      <!-- Legs -->
      <rect x="30" y="110" width="16" height="10" rx="5"
            fill="url(#rtAccent${this.id})" stroke="#2B3A55" stroke-width="1.5"/>
      <rect x="54" y="110" width="16" height="10" rx="5"
            fill="url(#rtAccent${this.id})" stroke="#2B3A55" stroke-width="1.5"/>
    </svg>`;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   RobotToastManager  –  global singleton that owns all ToastItems
   ═══════════════════════════════════════════════════════════════════════════ */
class RobotToastManager {
  private static _instance: RobotToastManager | null = null;

  private activeToasts: ToastItem[]      = [];
  private queue:        ToastQueueItem[] = [];
  private globalLimit   = 0;   // 0 = unlimited; overridden per-show call

  private constructor() {
    new InjectStyles();
  }

  static getInstance(): RobotToastManager {
    if (!RobotToastManager._instance) {
      RobotToastManager._instance = new RobotToastManager();
    }
    return RobotToastManager._instance;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  show(options: RobotToastOptions): number {
    if (typeof document === 'undefined') return -1;

    const id    = nextId();
    const limit = options.limit ?? this.globalLimit;

    if (limit > 0 && this.activeToasts.length >= limit) {
      // Queue it for later
      this.queue.push({ options, id });
      return id;
    }

    this.spawnToast(options, id);
    return id;
  }

  closeAll(): void {
    this.queue = [];
    [...this.activeToasts].forEach(t => t.close());
  }

  closeById(id: number): void {
    const toast = this.activeToasts.find(t => t.id === id);
    if (toast) toast.close();

    // Also remove from queue if it hasn't spawned yet
    this.queue = this.queue.filter(q => q.id !== id);
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  private spawnToast(options: RobotToastOptions, id: number): void {
    const toast = new ToastItem(id, options, (doneId) => this.handleRemoved(doneId));
    const newestOnTop = options.newestOnTop ?? false;

    if (newestOnTop) {
      this.activeToasts.unshift(toast);
    } else {
      this.activeToasts.push(toast);
    }

    this.restack();
  }

  private handleRemoved(id: number): void {
    this.activeToasts = this.activeToasts.filter(t => t.id !== id);
    this.restack();

    // Dequeue next if any
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      // Small delay so the stack reflows are visible
      setTimeout(() => this.spawnToast(next.options, next.id), 120);
    }
  }

  /**
   * Recalculate the vertical position of every active toast so they stack
   * neatly without overlap. Works for both top-* and bottom-* positions.
   */
  private restack(): void {
    // Group by position string
    const groups: Record<string, ToastItem[]> = {};
    this.activeToasts.forEach(t => {
      const pos = (t as any).options.position as string;
      if (!groups[pos]) groups[pos] = [];
      groups[pos].push(t);
    });

    Object.keys(groups).forEach(pos => {
      const list = groups[pos];
      let offset = 20; // initial edge margin px

      list.forEach((toast) => {
        toast.shiftVertical(offset);
        offset += toast.getWrapperHeight() + STACK_GAP;
      });
    });
  }
}

export { RobotToastManager as default, RobotToastManager };