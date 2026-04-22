# 🤖 robot-toast

A lightweight, zero-dependency, framework-agnostic toast notification library featuring an animated robot companion. Fully draggable with edge-snapping, typewriter-style messages, multiple themes, rich transitions, a tree-shakeable cast of **16 built-in robots** — and now an optional React hook.

<p align="left">
  <a href="https://stackblitz.com/your-demo-link"
     style="color:#e53935; font-weight:600; text-decoration:none;">
    Demo
  </a>
</p>
<p align="center">
  <a href="https://pratham-potfolio.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-000?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/pratham-kumar-a6b672275/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://github.com/Pratham2703005" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/robot-toast">
    <img src="https://img.shields.io/npm/v/robot-toast?style=flat-square" />
  </a>
  <img src="https://img.shields.io/npm/dt/robot-toast?style=flat-square" />
  <img src="https://img.shields.io/bundlephobia/minzip/robot-toast?style=flat-square" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Pratham2703005/robot-toast/refs/heads/main/public/offiicial-page/lightmode.png" alt="Light mode" width="320" />
  <img src="https://raw.githubusercontent.com/Pratham2703005/robot-toast/refs/heads/main/public/offiicial-page/darkmode.png" alt="Dark mode" width="320" />
  <img src="https://raw.githubusercontent.com/Pratham2703005/robot-toast/refs/heads/main/public/offiicial-page/custom.png" alt="Custom styled" width="320" />
</p>

---

## What's new in v2

- **36% smaller core bundle** (61 KB → 39 KB). Robots moved to a tree-shakeable subpath — only the ones you import end up in your bundle.
- **Opt-in robots.** Omitting `robotVariant` renders *no robot* now. Pass `'default'` or import from `robot-toast/robots` to bring one back.
- **Mobile drag actually works.** `touch-action: none` stops the page fighting the gesture, and cached rects kill the layout-thrash jank on slower devices.
- **`toast.promise()`** — attach loading/success/error toasts to any promise.
- **React subpath.** `useRobotToast()` + `useToastOnMount()` as optional ergonomic bindings.
- **ARIA roles.** `role="alert"` for `error`/`warning`, `role="status"` elsewhere, plus `aria-atomic` and a labeled close button.

Upgrading from v1? See [MIGRATION.md](./MIGRATION.md) for the five-minute changeover.

---

## Features

| Category | Details |
|---|---|
| **Themes** | `light` · `dark` · `colored` |
| **Types** | `default` · `info` · `success` · `warning` · `error` |
| **Transitions** | `bounce` · `flip` · `zoom` · `slide` |
| **Positions** | `top-left` · `top-center` · `top-right` · `bottom-left` · `bottom-center` · `bottom-right` |
| **Robots** | 16 tree-shakeable built-ins — import what you use, pass any image path (svg, png, jpg, gif, webp), or skip the robot entirely |
| **Custom styles** | Pass a `style` object to customize the message bubble however you like |
| **Drag & drop** | Full XY drag with viewport clamping; snaps to the nearest screen edge on release |
| **Typewriter effect** | Characters appear one by one — configurable speed or instant |
| **Multi-toast** | Configurable `limit` for simultaneous toasts; excess is auto-queued |
| **Progress bar** | Countdown bar — show or hide it |
| **Pause on hover** | Timer pauses when you hover over the toast |
| **Pause on focus loss** | Timer pauses when the browser tab loses focus |
| **Promise helper** | `toast.promise(p, { loading, success, error })` |
| **React hook** | `useRobotToast()` + `useToastOnMount()` from `robot-toast/react` |
| **RTL** | Right-to-left layout support |
| **Newest on top** | Stack new toasts above existing ones |
| **Auto-close** | Configurable duration, or disable entirely |
| **Accessibility** | `role="alert"` / `role="status"`, `aria-live`, `aria-atomic`, labeled dismiss button |
| **SSR-safe** | All DOM access is guarded — safe for Next.js, Nuxt, etc. |
| **Zero dependencies** | Pure TypeScript — ESM + CJS builds, tree-shakeable |

---

## Installation

```bash
npm install robot-toast
```

## Quick Start

```ts
import { toast } from 'robot-toast';

// Simple string — no robot by default in v2
toast('Hello 🤖');

// With options
toast({
  message: 'Operation successful!',
  type: 'success',
  theme: 'dark',
  position: 'top-right',
});
```

### Add a robot

Robots are opt-in. Import the one you want from the `robot-toast/robots` subpath — bundlers only include what you import:

```ts
import { toast } from 'robot-toast';
import { wave, success, error } from 'robot-toast/robots';

toast({ message: 'Hi!',       robotVariant: wave });
toast({ message: 'Saved!',    robotVariant: success, type: 'success' });
toast({ message: 'Failed',    robotVariant: error,   type: 'error'   });
```

Prefer the built-in inline SVG with no extra import?

```ts
toast({ message: 'Hello', robotVariant: 'default' });
```

## Promise lifecycle

```ts
toast.promise(fetch('/api/save').then(r => r.json()), {
  loading: 'Saving…',
  success: (data) => `Saved as ${data.name}`,
  error:   (err)  => `Failed: ${err.message}`,
});
```

The `success` and `error` fields accept a string, a function of the resolved/rejected value, or a partial options object. The original promise's resolution value passes through unchanged — `await toast.promise(...)` still gives you the data.

## React bindings

```tsx
import { useRobotToast, useToastOnMount } from 'robot-toast/react';

function SaveButton() {
  const toast = useRobotToast();
  return <button onClick={() => toast.success('Saved!')}>Save</button>;
}

function LoadingBanner() {
  // Fires on mount, auto-closes on unmount
  useToastOnMount({ message: 'Fetching…', autoClose: false });
  return null;
}
```

React is an **optional** peer dependency — non-React users aren't affected.

## Close Programmatically

```ts
// Close a specific toast by id
const id = toast('Working…');
toast.closeById(id);

// Close all toasts at once
toast.closeAll();
```

---
## All Options at a Glance

A single `toast()` call using **every available option** so you can see the full API in one place:

```ts
import { toast } from 'robot-toast';
import { wave } from 'robot-toast/robots';

toast({
  // ─── Content ───────────────────────────────────────────
  message: 'This is the full kitchen-sink example!',

  // ─── Appearance ────────────────────────────────────────
  type: 'success',                // 'default' | 'info' | 'success' | 'warning' | 'error'
  theme: 'dark',                  // 'light' | 'dark' | 'colored'
  transition: 'bounce',           // 'bounce' | 'flip' | 'zoom' | 'slide'
  position: 'bottom-right',       // 'top-left' | 'top-center' | 'top-right'
                                  // 'bottom-left' | 'bottom-center' | 'bottom-right'

  // ─── Robot ─────────────────────────────────────────────
  // Omit (or '' / 'none') to hide. Use 'default' for the inline built-in SVG.
  // For a built-in variant, import from 'robot-toast/robots' and pass the value.
  // Custom image: pass any path with svg/png/jpg/jpeg/gif/webp extension.
  robotVariant: wave,
  nearScreen:   true,             // true = robot near screen edge, false = inner side

  // ─── Timing ────────────────────────────────────────────
  autoClose: 5000,                // milliseconds, or false to disable auto-close
  typeSpeed: 30,                  // ms per character (0 = instant, no typing effect)

  // ─── Behaviour ─────────────────────────────────────────
  hideProgressBar:  false,        // true to hide the countdown bar
  draggable:        true,         // allow drag & drop; snaps to nearest edge on release
  pauseOnHover:     true,         // pause countdown on mouse hover
  pauseOnFocusLoss: true,         // pause countdown when tab loses focus
  rtl:              false,        // right-to-left layout

  // ─── Multi-toast ───────────────────────────────────────
  limit:       0,                 // max visible toasts (0 = unlimited, excess is queued)
  newestOnTop: false,             // stack new toasts above older ones

  // ─── Custom Inline Styles ─────────────────────────────
  style: {
    background:   'linear-gradient(135deg, #667eea, #764ba2)',
    color:        '#fff',
    borderRadius: '16px',
    fontFamily:   'monospace',
  },

  // ─── Callbacks ─────────────────────────────────────────
  onOpen:  () => console.log('Toast appeared!'),
  onClose: () => console.log('Toast dismissed!'),
});
```

### Type Shorthands

```ts
// These set the `type` automatically — you can also pass a full options object
toast.success('Saved!');
toast.error('Something went wrong');
toast.info('Did you know…');
toast.warning('Check your input');

// With additional options
import { success } from 'robot-toast/robots';
toast.success({ message: 'Deployed!', theme: 'colored', position: 'top-center', robotVariant: success });
```

---
## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | *required* | The text to display |
| `autoClose` | `number \| false` | `5000` | Auto-close after ms. `false` = stays until dismissed |
| `position` | `string` | `'bottom-right'` | One of the 6 position presets (see above) |
| `type` | `string` | `'default'` | `default` · `info` · `success` · `warning` · `error` |
| `theme` | `string` | `'light'` | `light` · `dark` · `colored` |
| `transition` | `string` | `'bounce'` | `bounce` · `flip` · `zoom` · `slide` |
| `style` | `Record<string, string \| number>` | — | Inline styles applied directly to the message bubble |
| `typeSpeed` | `number` | `30` | Typing speed in ms per character. `0` = instant |
| `robotVariant` | `string` | *hidden* | Data URL from `robot-toast/robots`, `'default'` for built-in SVG, image path, or omit for no robot |
| `hideProgressBar` | `boolean` | `false` | Hide the countdown progress bar |
| `draggable` | `boolean` | `true` | Allow the user to drag the toast; snaps to the nearest edge on release |
| `nearScreen` | `boolean` | `true` | `true` = robot near screen edge; `false` = robot on the inner side |
| `pauseOnHover` | `boolean` | `true` | Pause countdown while the cursor is over the toast |
| `pauseOnFocusLoss` | `boolean` | `true` | Pause countdown when the browser tab loses focus |
| `rtl` | `boolean` | `false` | Right-to-left layout |
| `limit` | `number` | `0` | Max toasts visible at once. `0` = unlimited. Excess is queued |
| `newestOnTop` | `boolean` | `false` | Stack newest toasts above older ones |
| `onOpen` | `() => void` | — | Callback fired when the toast finishes its entrance |
| `onClose` | `() => void` | — | Callback fired after the toast fully exits |

---

## Built-in Robots

All 16 robots are importable from `robot-toast/robots`. Each is a pre-encoded data URL — no network fetch, no external files, and bundlers drop the ones you don't use:

```ts
import {
  wave, base, base2, success, error,
  angry, angry2, shock, think, search,
  loading, sleep, headPalm, typing,
  validation, validation2,
} from 'robot-toast/robots';
```

> v1 → v2 renames: `head-palm` → `headPalm`, `type` → `typing` (the dash isn't a valid identifier; `type` clashes with TypeScript's type-only import syntax).

For guaranteed per-variant tree-shaking, you can also import from the direct subpath:

```ts
import { wave } from 'robot-toast/robots/wave';
```

### Custom Robot Image

Point to any image accessible in your app:

```ts
toast({
  message: 'Custom bot!',
  robotVariant: '/images/my-robot.png',
});
```

Supported formats: **svg, png, jpg, jpeg, gif, webp**. Failed loads fall back to the built-in default SVG. Omit `robotVariant` (or pass `''` / `'none'`) to hide the robot entirely.

---

## Themes & Custom Styles

### Built-in Themes

```ts
toast({ message: 'Light mode',  theme: 'light' });
toast({ message: 'Dark mode',   theme: 'dark' });
toast({ message: 'Colored',     theme: 'colored', type: 'success' });
```

### Custom Inline Styles

Use the `style` option to fully customize the message bubble:

```ts
toast({
  message: 'Fully custom look',
  style: {
    background:   'linear-gradient(135deg, #667eea, #764ba2)',
    color:        '#fff',
    borderRadius: '16px',
    fontFamily:   'monospace',
  },
});
```

---

## Transitions

```ts
toast({ message: 'Bounce!', transition: 'bounce' });
toast({ message: 'Flip!',   transition: 'flip'   });
toast({ message: 'Zoom!',   transition: 'zoom'   });
toast({ message: 'Slide!',  transition: 'slide'  });
```

---

## Drag

When `draggable` is on (default):

- **Drag anywhere** on the toast to move it. On release it snaps to the nearest horizontal edge — including when you drag all the way across the screen.
- Mobile-friendly: `touch-action: none` prevents the browser from fighting the drag, and rect dimensions are cached on pointerdown to eliminate layout-thrash jank on low-end devices.
- Use the **close button** or `toast.closeById()` / `toast.closeAll()` to dismiss programmatically.

---

## Accessibility

Every toast ships with the right ARIA hooks out of the box:

- `error` and `warning` toasts get `role="alert"` + `aria-live="assertive"` — screen readers announce them immediately.
- All other types get `role="status"` + `aria-live="polite"` — announced when the user is idle.
- `aria-atomic="true"` ensures the full message is re-announced on updates.
- The close button has `type="button"` + `aria-label="Dismiss notification"`.

---

## Framework Examples

### React / Next.js

```tsx
'use client';
import { useRobotToast } from 'robot-toast/react';
import { wave } from 'robot-toast/robots';
import { useEffect } from 'react';

export default function App() {
  const toast = useRobotToast();

  useEffect(() => {
    toast({
      message: 'Welcome!',
      type: 'success',
      theme: 'dark',
      position: 'top-right',
      robotVariant: wave,
      transition: 'bounce',
    });
  }, [toast]);

  return <div>My App</div>;
}
```
