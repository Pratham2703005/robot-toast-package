# 🤖 robot-toast

Lightweight toast notifications with an animated robot companion. 16 tree-shakeable robots, fully draggable, multiple themes, and optional React hook.

<p align="left">
  <a href="https://robot-toast-client.vercel.app/" style="color:#e53935; font-weight:600; text-decoration:none;">Demo & Playground →</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/robot-toast">
    <img src="https://img.shields.io/npm/v/robot-toast?style=flat-square" />
  </a>
  <img src="https://img.shields.io/npm/dt/robot-toast?style=flat-square" />
  <img src="https://img.shields.io/bundlephobia/minzip/robot-toast?style=flat-square" />
</p>

> **[GIF/video of robot in action]** ← [Add robot demo GIF here]

## Install

```bash
npm install robot-toast
```

## Quick Start

```ts
import { toast } from 'robot-toast';
import { wave } from 'robot-toast/robots';

toast({ message: 'Hello! 🤖', robotVariant: wave });
toast.success('Operation successful!');
toast.error('Something went wrong');
```

**Explore all features & interactive demos →** [Full Playground](https://robot-toast-client.vercel.app/features)

## Features at a Glance

| Robots | Layout | Styling | Behavior |
|--------|--------|---------|----------|
| 16 built-in variants | 6 position options | 3 themes | Fully draggable |
| Tree-shakeable imports | Auto-queuing | Custom inline styles | Typewriter effect |
| Custom images (SVG/PNG) | Progress bar | Transitions (4 types) | Promise helpers |
| | | | React hook included |

---

## Full API Reference

### Basic Usage

```ts
import { toast } from 'robot-toast';
import { wave, success, error } from 'robot-toast/robots';

toast('Simple notification');
toast({ message: 'With options', type: 'success', robotVariant: wave });
toast.success('Shorthand');
```

### All Options

```ts
toast({
  // Content
  message: 'Notification text',
  
  // Appearance
  type: 'default' | 'info' | 'success' | 'warning' | 'error',
  theme: 'light' | 'dark' | 'colored',
  transition: 'bounce' | 'flip' | 'zoom' | 'slide',
  position: 'top-left' | 'top-center' | 'top-right' | 
            'bottom-left' | 'bottom-center' | 'bottom-right',
  
  // Robot & Styling
  robotVariant: wave | base | success | error | '...' | 'default' | '/path.svg',
  nearScreen: true,
  style: { background: '...', color: '...' },
  
  // Timing & Behavior
  autoClose: 5000 | false,
  typeSpeed: 30,
  hideProgressBar: false,
  draggable: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  rtl: false,
  
  // Multi-toast
  limit: 0,
  newestOnTop: false,
  
  // Buttons & Callbacks
  buttons: [{ label: 'Undo', onClick: () => {...} }],
  onOpen: () => {...},
  onClose: () => {...},
});
```

### Built-in Robots

Import any of the 16 built-in robots from `robot-toast/robots`:

```ts
import {
  wave, base, base2, success, error,
  angry, angry2, shock, think, search,
  loading, sleep, headPalm, typing,
  validation, validation2,
} from 'robot-toast/robots';

// Or import directly for guaranteed tree-shaking:
import { wave } from 'robot-toast/robots/wave';
```

Custom images are supported: pass any SVG/PNG/JPG/GIF/WebP path to `robotVariant`.

### Inline Buttons

Add undo/confirm/cancel style buttons to toasts:

```ts
toast({
  message: 'File deleted',
  buttons: [
    { label: 'Undo', onClick: () => restoreFile() },
    { label: 'Keep', onClick: () => {}, style: { color: 'gray' } },
  ],
});
```

### Promise Lifecycle

Attach loading/success/error messages to any promise:

```ts
toast.promise(fetch('/api/save').then(r => r.json()), {
  loading: 'Saving…',
  success: (data) => `Saved as ${data.name}`,
  error: (err) => `Failed: ${err.message}`,
});
```

### React Bindings

```tsx
import { useRobotToast, useToastOnMount } from 'robot-toast/react';

function App() {
  const toast = useRobotToast();
  return <button onClick={() => toast.success('Saved!')}>Save</button>;
}

function InitBanner() {
  useToastOnMount({ message: 'Welcome!', autoClose: false });
  return null;
}
```

### Programmatic Control

```ts
const id = toast('Working…');
toast.closeById(id);
toast.closeAll();
```

### Themes & Custom Styles

```ts
toast({ message: 'Light', theme: 'light' });
toast({ message: 'Dark', theme: 'dark' });
toast({ 
  message: 'Custom gradient',
  style: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    borderRadius: '16px',
  },
});
```

### Accessibility

- `error` / `warning` toasts: `role="alert"` + `aria-live="assertive"`
- Other types: `role="status"` + `aria-live="polite"`
- `aria-atomic="true"` ensures full message re-announcement
- Labeled close button for screen readers

### Framework Examples

**React / Next.js**
```tsx
'use client';
import { useRobotToast } from 'robot-toast/react';
import { wave } from 'robot-toast/robots';

export default function App() {
  const toast = useRobotToast();
  
  return (
    <button onClick={() => toast.success({ 
      message: 'Deployed!', 
      robotVariant: wave 
    })}>
      Deploy
    </button>
  );
}
```
