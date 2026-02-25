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
  min-width: 280px;
  max-width: 400px;
  padding: 14px 12px 0 12px;
  border-radius: 8px;
  margin: 0;
  opacity: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  user-select: none;
  cursor: default;
}

.robot-toast-message.robot-toast-theme-light {
  background: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;
}

.robot-toast-message.robot-toast-theme-dark {
  background: #2d2d2d;
  color: #f0f0f0;
  border: 1px solid #444444;
}

.robot-toast-message.robot-toast-theme-colored {
  color: #ffffff;
}

/* Type-specific colors for colored theme */
.robot-toast-message.robot-toast-theme-colored.robot-toast-type-default {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.robot-toast-message.robot-toast-theme-colored.robot-toast-type-info {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
}

.robot-toast-message.robot-toast-theme-colored.robot-toast-type-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.robot-toast-message.robot-toast-theme-colored.robot-toast-type-warning {
  background: linear-gradient(135deg, #fb6e3b 0%, #f5a623 100%);
}

.robot-toast-message.robot-toast-theme-colored.robot-toast-type-error {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

/* Light theme type-specific colors */
.robot-toast-message.robot-toast-theme-light.robot-toast-type-info {
  border-left: 4px solid #2193b0;
}

.robot-toast-message.robot-toast-theme-light.robot-toast-type-success {
  border-left: 4px solid #11998e;
}

.robot-toast-message.robot-toast-theme-light.robot-toast-type-warning {
  border-left: 4px solid #fb6e3b;
}

.robot-toast-message.robot-toast-theme-light.robot-toast-type-error {
  border-left: 4px solid #eb3349;
}

/* Dark theme type-specific colors */
.robot-toast-message.robot-toast-theme-dark.robot-toast-type-info {
  border-left: 4px solid #6dd5ed;
}

.robot-toast-message.robot-toast-theme-dark.robot-toast-type-success {
  border-left: 4px solid #38ef7d;
}

.robot-toast-message.robot-toast-theme-dark.robot-toast-type-warning {
  border-left: 4px solid #f5a623;
}

.robot-toast-message.robot-toast-theme-dark.robot-toast-type-error {
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

.robot-toast-close {
  position: absolute;
  top: 4px;
  right: 4px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
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
/* MESSAGE TEXT */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.robot-toast-text {
  padding-right: 24px;
  padding-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
  font-weight: 500;
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

.robot-toast-message.robot-toast-theme-dark .robot-toast-progress-container {
  background: rgba(255, 255, 255, 0.15);
}

.robot-toast-progress-bar {
  height: 100%;
  background: currentColor;
  transform-origin: left;
  transform: scaleX(1);  /* ← starts full */
}

.robot-toast-theme-light.robot-toast-type-success .robot-toast-progress-bar { background: #11998e; }
.robot-toast-theme-light.robot-toast-type-error   .robot-toast-progress-bar { background: #eb3349; }
.robot-toast-theme-light.robot-toast-type-warning .robot-toast-progress-bar { background: #fb6e3b; }
.robot-toast-theme-light.robot-toast-type-info    .robot-toast-progress-bar { background: #2193b0; }

/* Dark theme progress bar colors */
.robot-toast-theme-dark.robot-toast-type-success .robot-toast-progress-bar { background: #38ef7d; }
.robot-toast-theme-dark.robot-toast-type-error   .robot-toast-progress-bar { background: #f45c43; }
.robot-toast-theme-dark.robot-toast-type-warning .robot-toast-progress-bar { background: #f5a623; }
.robot-toast-theme-dark.robot-toast-type-info    .robot-toast-progress-bar { background: #6dd5ed; }


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
    `;

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
}

export default InjectStyles;
