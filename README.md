# 🤖 robot-toast

![robot-toast demo](https://raw.githubusercontent.com/Pratham2703005/robot-toast/refs/heads/main/public/offiicial-page/toasts.gif)

Lightweight toast notifications with complete control.

robot-toast gives you a canvas, not a prescription — bring your own robot, colors, buttons, and timing. 16 tree-shakeable robots, fully draggable, zero dependencies.

<p align="left">
  <a href="https://robot-toast.vercel.app/" style="color:#e53935; font-weight:600; text-decoration:none;">Demo & Playground →</a>
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

## 🤖 Built-in Robots

![Built-in Robots](https://raw.githubusercontent.com/Pratham2703005/robot-toast/refs/heads/main/public/offiicial-page/robots.png)

## 🎨 Features in Action

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/Pratham2703005/robot-toast/refs/heads/main/public/offiicial-page/ad.png" alt="Light Mode" width="100%">
    </td>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/Pratham2703005/robot-toast/refs/heads/main/public/offiicial-page/darkmode.png" alt="Dark Mode" width="100%">
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/Pratham2703005/robot-toast/refs/heads/main/public/offiicial-page/lightmode.png" alt="Light Mode" width="100%">
    </td>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/Pratham2703005/robot-toast/refs/heads/main/public/offiicial-page/custom.png" alt="Custom Styling" width="100%">
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <img src="https://raw.githubusercontent.com/Pratham2703005/robot-toast/refs/heads/main/public/offiicial-page/questions_and_new_styles.png" alt="Styles & Questions" width="100%">
    </td>
  </tr>
</table>

## Install

```bash
npm install robot-toast
```

## Quick Start

```ts
import { toast } from "robot-toast";
import { wave } from "robot-toast/robots";

toast({ message: "Hello! 🤖", robotVariant: wave });
toast.success("Operation successful!");
toast.error("Something went wrong");
```

## Features at a Glance

| Robots                  | Layout             | Styling               | Behavior              |
| ----------------------- | ------------------ | --------------------- | --------------------- |
| 16 built-in variants    | 6 position options | 3 themes              | Fully draggable       |
| Tree-shakeable imports  | Auto-queuing       | Custom inline styles  | Typewriter effect     |
| Custom images (SVG/PNG) | Progress bar       | Transitions (4 types) | Promise helpers       |
| Custom image paths      | Multi-toast queue  | CSS overrides         | React hook included   |

---

## Usage

### Basic Usage

```ts
import { toast } from "robot-toast";
import { wave, success, error } from "robot-toast/robots";

toast("Simple notification");
toast({ message: "With options", type: "success", robotVariant: wave });
toast.success("Shorthand");
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

### Inline Buttons

Add undo/confirm/cancel style buttons to toasts:

```ts
toast({
  message: "File deleted",
  buttons: [
    { label: "Undo", onClick: () => restoreFile() },
    { label: "Keep", onClick: () => {}, style: { color: "gray" } },
  ],
});
```

### Promise Lifecycle

Attach loading/success/error messages to any promise:

```ts
toast.promise(
  fetch("/api/save").then((r) => r.json()),
  {
    loading: "Saving…",
    success: (data) => `Saved as ${data.name}`,
    error: (err) => `Failed: ${err.message}`,
  },
);
```

### React Bindings

```tsx
import { useRobotToast, useToastOnMount } from "robot-toast/react";

function App() {
  const toast = useRobotToast();
  return <button onClick={() => toast.success("Saved!")}>Save</button>;
}

function InitBanner() {
  useToastOnMount({ message: "Welcome!", autoClose: false });
  return null;
}
```

### Complete Example

Combine robots, buttons, theming, and promises in one powerful toast:

```tsx
import { useRobotToast } from "robot-toast/react";
import { success, error, loading } from "robot-toast/robots";

function CompleteExample() {
  const toast = useRobotToast();

  const handleUpload = () => {
    toast.promise(
      fetch("/api/upload").then((r) => r.json()),
      {
        loading: {
          message: "Uploading your file...",
          robotVariant: loading,
          theme: "dark",
        },
        success: {
          message: "File uploaded! Ready to go? 🎉",
          robotVariant: success,
          theme: "colored",
          style: { background: "#10b981", color: "white" },
          buttons: [
            { label: "View", onClick: () => window.open("/files") },
            { label: "Done", onClick: () => {} },
          ],
        },
        error: {
          message: "Upload failed. Try again?",
          robotVariant: error,
          theme: "dark",
          style: { background: "#ef4444" },
          buttons: [{ label: "Retry", onClick: handleUpload }],
        },
      },
    );
  };

  return <button onClick={handleUpload}>Upload File</button>;
}
```

### Programmatic Control

```ts
const id = toast("Working…");
toast.closeById(id);
toast.closeAll();
```

### Themes & Custom Styles

```ts
toast({ message: "Light", theme: "light" });
toast({ message: "Dark", theme: "dark" });
toast({
  message: "Custom gradient",
  style: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    borderRadius: "16px",
  },
});
```

### Accessibility

- `error` / `warning` toasts: `role="alert"` + `aria-live="assertive"`
- Other types: `role="status"` + `aria-live="polite"`
- `aria-atomic="true"` ensures full message re-announcement
- Labeled close button for screen readers
