# 🤖 robot-toast

A lightweight, zero-dependency, framework-agnostic toast notification library featuring an animated robot companion. Fully draggable, typewriter-style messages, multiple themes, rich transitions, and a cast of **16 built-in robots** — or bring your own.

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

## Features

| Category | Details |
|---|---|
| **Themes** | `light` · `dark` · `colored` |
| **Types** | `default` · `info` · `success` · `warning` · `error` |
| **Transitions** | `bounce` · `flip` · `zoom` · `slide` |
| **Positions** | `top-left` · `top-center` · `top-right` · `bottom-left` · `bottom-center` · `bottom-right` |
| **Robots** | 16 built-in variants — or supply any image path (svg, png, jpg, gif, webp) |
| **Custom styles** | Pass a `style` object to customize the message bubble however you like |
| **Drag & drop** | Full XY drag with viewport clamping; snaps to nearest screen edge on release |
| **Typewriter effect** | Characters appear one by one — configurable speed or instant |
| **Multi-toast** | Configurable `limit` for simultaneous toasts; excess is auto-queued |
| **Progress bar** | Countdown bar — show or hide it |
| **Pause on hover** | Timer pauses when you hover over the toast |
| **Pause on focus loss** | Timer pauses when the browser tab loses focus |
| **Robot side** | `nearScreen` flips the robot to the screen-edge side or the inner side |
| **RTL** | Right-to-left layout support |
| **Newest on top** | Stack new toasts above existing ones |
| **Auto-close** | Configurable duration, or disable entirely |
| **SSR-safe** | All DOM access is guarded — safe for Next.js, Nuxt, etc. |
| **Zero dependencies** | Pure TypeScript — ESM + CJS builds, tree-shakable |

---

## Installation

```bash
npm install robot-toast
```

## Quick Start

```ts
import { toast } from 'robot-toast';

// Simple string
toast('Hello 🤖');

// With options
toast({
  message: 'Operation successful!',
  type: 'success',
  theme: 'dark',
  position: 'top-right',
});
```

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
  robotVariant: 'wave',           // built-in: 'wave' | 'base' | 'base2' | 'success' | 'error'
                                  //   'angry' | 'angry2' | 'shock' | 'think' | 'search'
                                  //   'loading' | 'sleep' | 'head-palm' | 'type'
                                  //   'validation' | 'validation2'
                                  // custom: '/path/to/image.png' (svg, png, jpg, jpeg, gif, webp)
                                  // hide: 'none'
  nearScreen: true,               // true = robot near screen edge, false = robot on inner side

  // ─── Timing ────────────────────────────────────────────
  autoClose: 5000,                // milliseconds, or false to disable auto-close
  typeSpeed: 30,                  // ms per character (0 = instant, no typing effect)

  // ─── Behaviour ─────────────────────────────────────────
  hideProgressBar: false,         // true to hide the countdown bar
  draggable: true,                // allow drag & drop with edge-snapping
  pauseOnHover: true,             // pause countdown on mouse hover
  pauseOnFocusLoss: true,         // pause countdown when tab loses focus
  rtl: false,                     // right-to-left layout

  // ─── Multi-toast ───────────────────────────────────────
  limit: 0,                       // max visible toasts (0 = unlimited, excess is queued)
  newestOnTop: false,             // stack new toasts above older ones

  // ─── Custom Inline Styles ─────────────────────────────
  style: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    borderRadius: '16px',
    fontFamily: 'monospace',
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
toast.success({ message: 'Deployed!', theme: 'colored', position: 'top-center', robotVariant: 'success' });
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
| `style` | `Record<string, string \| number>` | — | Inline styles applied directly to the message bubble for full customization |
| `typeSpeed` | `number` | `30` | Typing speed in ms per character. `0` = instant |
| `robotVariant` | `string` | `''` | Built-in name (e.g. `'wave'`) or a custom image path (e.g. `'/my-robot.png'`). `'none'` hides the robot |
| `hideProgressBar` | `boolean` | `false` | Hide the countdown progress bar |
| `draggable` | `boolean` | `true` | Allow the user to drag the toast around the screen |
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

Use any of the following names as `robotVariant` — no external files needed:

`wave` · `base` · `base2` · `success` · `error` · `angry` · `angry2` · `shock` · `think` · `search` · `loading` · `sleep` · `head-palm` · `type` · `validation` · `validation2`

```ts
toast({ message: 'Thinking…', robotVariant: 'think' });
toast({ message: 'All good!', robotVariant: 'success', type: 'success' });
```

### Custom Robot Image

Point to any image accessible in your app:

```ts
toast({
  message: 'Custom bot!',
  robotVariant: '/images/my-robot.png',
});
```

Supported formats: **svg, png, jpg, jpeg, gif, webp**.
Set `robotVariant: 'none'` to hide the robot entirely.

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
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    borderRadius: '16px',
    fontFamily: 'monospace',
  },
});
```

---

## Transitions

```ts
toast({ message: 'Bounce!', transition: 'bounce' });
toast({ message: 'Flip!',   transition: 'flip' });
toast({ message: 'Zoom!',   transition: 'zoom' });
toast({ message: 'Slide!',  transition: 'slide' });
```

---

## Framework Examples

### React / Next.js

```tsx
'use client';
import { toast } from 'robot-toast';
import { useEffect, useRef } from 'react';

export default function App() {
  const shown = useRef(false);

  useEffect(() => {
    toast({
      message: 'Welcome!',
      type: 'success',
      theme: 'dark',
      position: 'top-right',
      robotVariant: 'wave',
      transition: 'bounce',
    });
  }, []);

  return <div>My App</div>;
}
```