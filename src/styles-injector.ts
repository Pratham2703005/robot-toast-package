/**
 * Style injection for RobotToast
 * Injects all required CSS into the document when instantiated
 */

class InjectStyles {
  private static injected = false;

  constructor() {
    if (typeof document === 'undefined' || InjectStyles.injected) {
      return;
    }

    InjectStyles.injected = true;
    this.injectCSS();
  }

  private injectCSS(): void {
    const styleId = 'robot-toast-styles';

    // Check if styles already exist
    if (document.getElementById(styleId)) {
      return;
    }

    const styles = `
/* RobotToast v2 - CSS Styles */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* WRAPPER - Fixed positioning container for each toast */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.robot-toast-wrapper {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  z-index: 99999;
  pointer-events: auto;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.robot-toast-wrapper.robot-toast-visible {
  opacity: 1;
}

/* Position presets */
.robot-toast-wrapper.robot-toast-top-right {
  top: 20px;
  right: 20px;
  flex-direction: row;
}

.robot-toast-wrapper.robot-toast-top-left {
  top: 20px;
  left: 20px;
  flex-direction: row;
}

.robot-toast-wrapper.robot-toast-top-center {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: row;
}

.robot-toast-wrapper.robot-toast-bottom-right {
  bottom: 20px;
  right: 20px;
  flex-direction: row;
}

.robot-toast-wrapper.robot-toast-bottom-left {
  bottom: 20px;
  left: 20px;
  flex-direction: row;
}

.robot-toast-wrapper.robot-toast-bottom-center {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: row;
}

.robot-toast-wrapper.robot-toast-rtl {
  direction: rtl;
}

.robot-toast-wrapper.robot-toast-dragging .robot-toast-message {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ROBOT - The animated character */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.robot-toast-robot {
  width: 65px;
  height: 70px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.robot-toast-robot img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.robot-toast-robot.robot-enter-left {
  animation: robot-enter-left 0.7s ease-out forwards;
}

.robot-toast-robot.robot-enter-right {
  animation: robot-enter-right 0.7s ease-out forwards;
}

.robot-toast-robot.robot-exit-left {
  animation: robot-exit-left 0.5s ease-in forwards;
}

.robot-toast-robot.robot-exit-right {
  animation: robot-exit-right 0.5s ease-in forwards;
}

.robot-toast-robot.robot-idle {
  opacity: 1;
  animation: robot-idle 2s ease-in-out infinite;
}

.robot-toast-robot.robot-snap-left {
  animation: robot-snap-left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.robot-toast-robot.robot-snap-right {
  animation: robot-snap-right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* MESSAGE BOX - Toast content container */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.robot-toast-message {
  position: relative;
  width: fit-content;
  min-width: 120px;
  max-width: min(400px, calc(100vw - 120px));
  /*
   * IMPORTANT: no padding on the outer box. Each section (.robot-toast-body,
   * .robot-toast-footer, .robot-toast-progress-container) owns its own
   * spacing, so optional sections can disappear without us having to tweak
   * margins / paddings anywhere else.
   */
  padding: 0;
  border-radius: 8px;
  margin: 0;
  opacity: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  user-select: none;
  cursor: default;
  box-sizing: border-box;
  /*
   * Clip children to the rounded border so the progress bar's straight edges
   * follow whatever border-radius the user sets via the style option.
   * Without this, a high border-radius leaves the progress bar's bottom
   * corners poking out past the rounded message box.
   */
  overflow: hidden;
}

.robot-toast-message.robot-toast-empty {
  display: none;
}

.robot-toast-message:where(.robot-toast-theme-light):not(.robot-toast-custom-surface) {
  background: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;
}

.robot-toast-message:where(.robot-toast-theme-dark):not(.robot-toast-custom-surface) {
  background: #2d2d2d;
  color: #f0f0f0;
  border: 1px solid #444444;
}

.robot-toast-message:where(.robot-toast-theme-colored):not(.robot-toast-custom-surface) {
  color: #ffffff;
}

/* Type-specific colors for colored theme */
.robot-toast-message:where(.robot-toast-theme-colored):not(.robot-toast-custom-surface).robot-toast-type-default {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.robot-toast-message:where(.robot-toast-theme-colored):not(.robot-toast-custom-surface).robot-toast-type-info {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
}

.robot-toast-message:where(.robot-toast-theme-colored):not(.robot-toast-custom-surface).robot-toast-type-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.robot-toast-message:where(.robot-toast-theme-colored):not(.robot-toast-custom-surface).robot-toast-type-warning {
  background: linear-gradient(135deg, #fb6e3b 0%, #f5a623 100%);
}

.robot-toast-message:where(.robot-toast-theme-colored):not(.robot-toast-custom-surface).robot-toast-type-error {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

/* Light theme type-specific colors */
.robot-toast-message:where(.robot-toast-theme-light).robot-toast-type-info {
  border-left: 4px solid #2193b0;
}

.robot-toast-message:where(.robot-toast-theme-light).robot-toast-type-success {
  border-left: 4px solid #11998e;
}

.robot-toast-message:where(.robot-toast-theme-light).robot-toast-type-warning {
  border-left: 4px solid #fb6e3b;
}

.robot-toast-message:where(.robot-toast-theme-light).robot-toast-type-error {
  border-left: 4px solid #eb3349;
}

/* Dark theme type-specific colors */
.robot-toast-message:where(.robot-toast-theme-dark).robot-toast-type-info {
  border-left: 4px solid #6dd5ed;
}

.robot-toast-message:where(.robot-toast-theme-dark).robot-toast-type-success {
  border-left: 4px solid #38ef7d;
}

.robot-toast-message:where(.robot-toast-theme-dark).robot-toast-type-warning {
  border-left: 4px solid #f5a623;
}

.robot-toast-message:where(.robot-toast-theme-dark).robot-toast-type-error {
  border-left: 4px solid #f45c43;
}

.robot-toast-message.message-enter {
  animation: message-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.robot-toast-message.message-exit {
  animation: message-exit 0.3s ease-in forwards;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* CLOSE BUTTON */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/*
 * Close button is absolutely positioned against the BODY section (not the
 * whole message box), and vertically centered with top: 50% / translateY.
 * This makes it pair with the text automatically:
 *   - single-line toast  -> centered with the text line
 *   - multi-line toast   -> centered with the text block
 *   - toast with buttons -> stays in body region, never drifts into footer
 *   - any font size / theme -> body grows, button follows
 * The icon itself is an inline SVG so it renders identically across browsers
 * (the &amp;times; glyph has unstable baselines on mobile font stacks).
 */
.robot-toast-close {
  position: absolute;
  top: 35%;
  right: 2px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
  color: currentColor;
  line-height: 0;
}

.robot-toast-close svg {
  display: block;
  width: 9px;
  height: 9px;
}

.robot-toast-close:hover {
  opacity: 1;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* DRAG HINT */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.robot-toast-drag-hint {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 3px;
  opacity: 0.4;
}

.robot-toast-drag-hint span {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* BODY — the message zone. Always present, always owns its own padding.     */
/* Right padding leaves clear room for the absolute close button.            */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.robot-toast-body {
  position: relative;
  padding: 10px 40px 10px 14px;
}

.robot-toast-text {
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
  font-weight: 500;
  min-width: 0;
  min-height: 1.5em;
  /* No padding-bottom here — body's padding-bottom handles spacing toward
     whichever section follows (footer, progress bar, or nothing). */
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* FOOTER — the button zone. Rendered only when buttons.length > 0.         */
/* Owns its own bottom padding so there are no conditional margins anywhere. */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.robot-toast-footer {
  /*
   * Symmetric vertical padding (10px top + 10px bottom) — matches body so
   * the two sections feel like equally-weighted "cards" stacked inside the
   * toast. This is intentional even though it doubles the gap between text
   * and buttons (10 body-bottom + 10 footer-top = 20px); the visual balance
   * matters more than the gap-tightness.
   */
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* A row inside the footer. data-count drives width distribution — pure CSS,
 * no JS-side layout code. */
.robot-toast-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

/* 1 button in its row → content-sized, left-aligned (flex default) */
.robot-toast-row[data-count="1"] .robot-toast-btn {
  /* nothing — intrinsic width, flex-start alignment */
}

/* 2 or 3 buttons in a row → equal shares, filling the row's width */
.robot-toast-row[data-count="2"] .robot-toast-btn,
.robot-toast-row[data-count="3"] .robot-toast-btn {
  flex: 1;
  min-width: 0;   /* let long labels shrink without breaking the 50/50 split */
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* INLINE BUTTONS                                                            */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.robot-toast-btn {
  appearance: none;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, transform 0.05s ease;
  white-space: nowrap;
  background: transparent;
  color: #52525b;
  border: 1px solid #e4e4e7;
}
.robot-toast-btn:hover  { background: #f4f4f5; color: #18181b; }
.robot-toast-btn:active { transform: scale(0.97); }

/*
 * Solo CTA: when the toast has exactly one button, it's implicitly the
 * primary action. Render it filled/dark so it feels decisive (Undo / Retry
 * UX). A multi-button toast drops back to all-neutral — the caller picks a
 * primary via its own className.
 *
 * "Exactly one button total" = the single row has data-count="1" AND is the
 * only row in the footer (covers the n=1 case; n=4 also has data-count rows
 * but they're paired, not only-child).
 */
.robot-toast-row[data-count="1"]:only-child .robot-toast-btn {
  background: #18181b;
  color: #fafafa;
  border-color: #18181b;
  font-weight: 600;
}
.robot-toast-row[data-count="1"]:only-child .robot-toast-btn:hover {
  background: #000;
  border-color: #000;
  color: #fafafa;
}

/* Dark theme — inverted neutral */
.robot-toast-message:where(.robot-toast-theme-dark) .robot-toast-btn {
  color: #a1a1aa;
  border-color: #3f3f46;
}
.robot-toast-message:where(.robot-toast-theme-dark) .robot-toast-btn:hover {
  background: #27272a;
  color: #fafafa;
}
.robot-toast-message:where(.robot-toast-theme-dark) .robot-toast-row[data-count="1"]:only-child .robot-toast-btn {
  background: #fafafa;
  color: #18181b;
  border-color: #fafafa;
}
.robot-toast-message:where(.robot-toast-theme-dark) .robot-toast-row[data-count="1"]:only-child .robot-toast-btn:hover {
  background: #e4e4e7;
  border-color: #e4e4e7;
  color: #18181b;
}

/* Colored theme — translucent whites keep contrast on any gradient */
.robot-toast-message:where(.robot-toast-theme-colored) .robot-toast-btn {
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.35);
}
.robot-toast-message:where(.robot-toast-theme-colored) .robot-toast-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.robot-toast-message:where(.robot-toast-theme-colored) .robot-toast-row[data-count="1"]:only-child .robot-toast-btn {
  background: rgba(255, 255, 255, 0.95);
  color: #18181b;
  border-color: transparent;
}
.robot-toast-message:where(.robot-toast-theme-colored) .robot-toast-row[data-count="1"]:only-child .robot-toast-btn:hover {
  background: #fff;
  color: #18181b;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* PROGRESS BAR */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.robot-toast-progress-container {
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.robot-toast-message:where(.robot-toast-theme-dark) .robot-toast-progress-container {
  background: rgba(255, 255, 255, 0.15);
}

.robot-toast-progress-bar {
  height: 100%;
  background: currentColor;
  transform-origin: left;
  transform: scaleX(1);  /* ← starts full */
}

.robot-toast-message:where(.robot-toast-theme-light).robot-toast-type-success .robot-toast-progress-bar { background: #11998e; }
.robot-toast-message:where(.robot-toast-theme-light).robot-toast-type-error .robot-toast-progress-bar   { background: #eb3349; }
.robot-toast-message:where(.robot-toast-theme-light).robot-toast-type-warning .robot-toast-progress-bar { background: #fb6e3b; }
.robot-toast-message:where(.robot-toast-theme-light).robot-toast-type-info .robot-toast-progress-bar    { background: #2193b0; }

/* Dark theme progress bar colors */
.robot-toast-message:where(.robot-toast-theme-dark).robot-toast-type-success .robot-toast-progress-bar { background: #38ef7d; }
.robot-toast-message:where(.robot-toast-theme-dark).robot-toast-type-error .robot-toast-progress-bar   { background: #f45c43; }
.robot-toast-message:where(.robot-toast-theme-dark).robot-toast-type-warning .robot-toast-progress-bar { background: #f5a623; }
.robot-toast-message:where(.robot-toast-theme-dark).robot-toast-type-info .robot-toast-progress-bar    { background: #6dd5ed; }
.robot-toast-progress-bar:where(.robot-toast-message):where(.robot-toast-theme-dark).robot-toast-type-info,
.robot-toast-progress-bar:where(.robot-toast-theme-dark).robot-toast-type-info    { background: #6dd5ed; }


.robot-toast-progress-bar.robot-toast-progress-auto {
  animation: robot-progress-countdown linear forwards;
  opacity: 0.8;
}

.robot-toast-progress-bar.robot-toast-progress-paused {
  animation-play-state: paused !important;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ANIMATIONS */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

@keyframes robot-enter-left {
  0%   { opacity: 0; transform: translateY(-80px) translateX(-30px) scaleY(1.1) scaleX(0.9); }
  40%  { opacity: 1; transform: translateY(10px) scaleY(0.85) scaleX(1.1); }
  65%  { transform: translateY(-6px) scaleY(1.05) scaleX(0.97); }
  85%  { transform: translateY(2px) scaleY(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes robot-enter-right {
  0%   { opacity: 0; transform: translateY(-80px) translateX(30px) scaleY(1.1) scaleX(0.9); }
  40%  { opacity: 1; transform: translateY(10px) scaleY(0.85) scaleX(1.1); }
  65%  { transform: translateY(-6px) scaleY(1.05) scaleX(0.97); }
  85%  { transform: translateY(2px) scaleY(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes robot-exit-left {
  0%   { opacity: 1; transform: scale(1); }
  20%  { transform: scaleY(0.85) scaleX(1.1) translateY(5px); }
  100% { opacity: 0; transform: translateY(-80px) translateX(-30px) scaleY(1.1) scaleX(0.9); }
}

@keyframes robot-exit-right {
  0%   { opacity: 1; transform: scale(1); }
  20%  { transform: scaleY(0.85) scaleX(1.1) translateY(5px); }
  100% { opacity: 0; transform: translateY(-80px) translateX(30px) scaleY(1.1) scaleX(0.9); }
}


@keyframes robot-idle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes robot-snap-left {
  from {
    transform: scaleX(0.8);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes robot-snap-right {
  from {
    transform: scaleX(0.8);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes message-enter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes message-exit {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}

@keyframes robot-progress-countdown {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

/* Slide transition animations */
.robot-toast-robot.robot-enter-left-slide {
  animation: robot-enter-left-slide 0.5s ease-out forwards;
}

.robot-toast-robot.robot-enter-right-slide {
  animation: robot-enter-right-slide 0.5s ease-out forwards;
}

.robot-toast-robot.robot-exit-left-slide {
  animation: robot-exit-left-slide 0.4s ease-in forwards;
}

.robot-toast-robot.robot-exit-right-slide {
  animation: robot-exit-right-slide 0.4s ease-in forwards;
}

/* Zoom transition animations */
.robot-toast-robot.robot-enter-left-zoom,
.robot-toast-robot.robot-enter-right-zoom {
  animation: robot-enter-zoom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.robot-toast-robot.robot-exit-left-zoom,
.robot-toast-robot.robot-exit-right-zoom {
  animation: robot-exit-zoom 0.4s ease-in forwards;
}

/* Flip transition animations */
.robot-toast-robot.robot-enter-left-flip {
  animation: robot-enter-left-flip 0.6s ease-out forwards;
}

.robot-toast-robot.robot-enter-right-flip {
  animation: robot-enter-right-flip 0.6s ease-out forwards;
}

.robot-toast-robot.robot-exit-left-flip {
  animation: robot-exit-left-flip 0.4s ease-in forwards;
}

.robot-toast-robot.robot-exit-right-flip {
  animation: robot-exit-right-flip 0.4s ease-in forwards;
}

@keyframes robot-enter-left-slide {
  from { opacity: 0; transform: translateX(-60px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes robot-enter-right-slide {
  from { opacity: 0; transform: translateX(60px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes robot-exit-left-slide {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(-60px); }
}

@keyframes robot-exit-right-slide {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(60px); }
}

@keyframes robot-enter-zoom {
  from { opacity: 0; transform: scale(0.2); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes robot-exit-zoom {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.2); }
}

@keyframes robot-enter-left-flip {
  from { opacity: 0; transform: perspective(600px) rotateY(90deg); }
  to   { opacity: 1; transform: perspective(600px) rotateY(0deg); }
}

@keyframes robot-enter-right-flip {
  from { opacity: 0; transform: perspective(600px) rotateY(-90deg); }
  to   { opacity: 1; transform: perspective(600px) rotateY(0deg); }
}

@keyframes robot-exit-left-flip {
  from { opacity: 1; transform: perspective(600px) rotateY(0deg); }
  to   { opacity: 0; transform: perspective(600px) rotateY(90deg); }
}

@keyframes robot-exit-right-flip {
  from { opacity: 1; transform: perspective(600px) rotateY(0deg); }
  to   { opacity: 0; transform: perspective(600px) rotateY(-90deg); }
}

/* message-enter variants */
.robot-toast-message.message-enter-slide {
  animation: message-enter-slide 0.35s ease-out forwards;
}
.robot-toast-message.message-enter-zoom {
  animation: message-enter-zoom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.robot-toast-message.message-enter-flip {
  animation: message-enter-flip 0.4s ease-out forwards;
}

@keyframes message-enter-slide {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes message-enter-zoom {
  from { opacity: 0; transform: scale(0.5); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes message-enter-flip {
  from { opacity: 0; transform: perspective(400px) rotateX(-20deg); }
  to   { opacity: 1; transform: perspective(400px) rotateX(0deg); }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* RESPONSIVE - Mobile / small-screen tweaks                                */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/*
 * Small-viewport tweaks. No !important / edge-to-edge override here — the
 * wrapper keeps its configured position preset and the message box stays
 * content-sized (just capped by max-width so it doesn't overflow). Drag
 * still works everywhere because no stylesheet rule competes with the
 * inline position the drag handler writes.
 */
@media (max-width: 600px) {
  .robot-toast-wrapper {
    gap: 8px;
    max-width: calc(100vw - 24px);
  }

  .robot-toast-wrapper.robot-toast-top-right,
  .robot-toast-wrapper.robot-toast-bottom-right { right: 12px; }
  .robot-toast-wrapper.robot-toast-top-left,
  .robot-toast-wrapper.robot-toast-bottom-left  { left:  12px; }
  .robot-toast-wrapper.robot-toast-top-right,
  .robot-toast-wrapper.robot-toast-top-left,
  .robot-toast-wrapper.robot-toast-top-center    { top:    12px; }
  .robot-toast-wrapper.robot-toast-bottom-right,
  .robot-toast-wrapper.robot-toast-bottom-left,
  .robot-toast-wrapper.robot-toast-bottom-center { bottom: 12px; }

  .robot-toast-wrapper.robot-toast-top-center,
  .robot-toast-wrapper.robot-toast-bottom-center {
    width: calc(100vw - 24px);
    justify-content: center;
  }

  .robot-toast-robot {
    width: 48px;
    height: 52px;
  }

  .robot-toast-message {
    min-width: 100px;
    max-width: calc(100vw - 48px - 24px - 8px);
    font-size: 13px;
    /* padding stays 0 on the outer box; sections own their spacing */
  }

  .robot-toast-body {
    padding: 10px 36px 10px 12px;
  }

  .robot-toast-footer {
    /* Same symmetric vertical padding as body — equal section weight on mobile too */
    padding: 10px;
  }

  .robot-toast-text {
    font-size: 13px;
  }

  .robot-toast-close {
    width: 24px;
    height: 24px;
    right: -6px;
  }
  .robot-toast-close svg {
    width: 11px;
    height: 11px;
  }
}

@media (max-width: 360px) {
  .robot-toast-robot {
    width: 40px;
    height: 44px;
  }
  .robot-toast-message {
    max-width: calc(100vw - 40px - 20px - 8px);
  }
}
    `;

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
}

export default InjectStyles;
