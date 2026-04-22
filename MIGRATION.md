# Migrating from v1.x → v2.0

v2.0 is a **breaking** release focused on bundle size. The core bundle dropped
from 61 KB to 39 KB, and users who don't need the built-in robot library don't
pay for it at all.

**If you don't use `robotVariant` with a built-in name, no changes are needed.**

---

## What changed

### 1. Built-in robots moved to their own subpath

Before (v1):

```js
import { toast } from 'robot-toast';
toast({ message: 'Hi!', robotVariant: 'wave' });
```

After (v2):

```js
import { toast } from 'robot-toast';
import { wave } from 'robot-toast/robots';
toast({ message: 'Hi!', robotVariant: wave });
```

You now import each robot as a data URL and pass it directly. Only the
variants you import end up in your bundle. Typical savings: 20–50 KB depending
on which variants you used to reference by string name.

For maximum guaranteed tree-shaking, you can import from the per-variant
subpath:

```js
import { wave } from 'robot-toast/robots/wave';
```

### 2. Two variant names got renamed

Dashed and ambiguous identifiers don't work as named imports. They've been
renamed:

| v1 (string)    | v2 (import)    |
|----------------|----------------|
| `'head-palm'`  | `headPalm`     |
| `'type'`       | `typing`       |

```js
// v1
toast({ message: '…', robotVariant: 'head-palm' });
toast({ message: '…', robotVariant: 'type' });

// v2
import { headPalm, typing } from 'robot-toast/robots';
toast({ message: '…', robotVariant: headPalm });
toast({ message: '…', robotVariant: typing });
```

All 14 other variants (`wave`, `base`, `base2`, `success`, `error`, `angry`,
`angry2`, `shock`, `think`, `search`, `loading`, `sleep`, `validation`,
`validation2`) keep the same name — just import them.

### 3. `ROBOT_IMAGES` export removed

If you were reading from the exported `ROBOT_IMAGES` object directly, import
the individual variants instead.

```js
// v1
import { ROBOT_IMAGES } from 'robot-toast';
const wave = ROBOT_IMAGES.wave;

// v2
import { wave } from 'robot-toast/robots';
```

### 4. `robotVariant` is now opt-in

**The biggest behavior change.** In v1, omitting `robotVariant` rendered the
default robot. In v2, omitting it renders **no robot**.

| Value                  | v1 behavior     | v2 behavior     |
|------------------------|-----------------|-----------------|
| *(omitted)*            | default robot   | **hidden**      |
| `''`                   | default robot   | **hidden**      |
| `'none'`               | hidden          | hidden          |
| `'default'`            | hidden (as name)| **default robot** |
| `'wave'` / `'error'` … | built-in lookup | **hidden**      |
| data URL               | treated as path | `<img>` rendered |
| `'/path.png'`          | `<img>` rendered| `<img>` rendered |
| unrecognized string    | default robot   | **hidden**      |

**Migration:**

```js
// v1 — implicit default
toast({ message: 'Hi' });

// v2 — explicit opt-in
toast({ message: 'Hi', robotVariant: 'default' });

// v1 — named built-in
toast({ message: 'Hi', robotVariant: 'wave' });

// v2 — imported data URL
import { wave } from 'robot-toast/robots';
toast({ message: 'Hi', robotVariant: wave });
```

Why the change: the old default pulled every user into bundling the
built-in SVG even when they never intended a robot. Explicit opt-in plus the
tree-shakeable `robots` subpath gives you full control over what ships.

### 5. Custom image paths still work unchanged

```js
toast({ message: 'Hi', robotVariant: '/my-robot.png' }); // unchanged, still works
```

---

## What's new

### React hook

```jsx
import { useRobotToast, useToastOnMount } from 'robot-toast/react';

function SaveButton() {
  const toast = useRobotToast();
  return <button onClick={() => toast.success('Saved!')}>Save</button>;
}

function LoadingBanner() {
  useToastOnMount({ message: 'Fetching…', autoClose: false });
  return null;
}
```

React is an optional peer dependency — non-React users are unaffected.

We deliberately skipped the `<RobotToastProvider>` pattern. The toast manager
is a module-level singleton, so a provider wouldn't carry any state Context
doesn't already solve in user code.

### `toast.promise()`

```js
toast.promise(fetch('/api/save'), {
  loading: 'Saving…',
  success: 'Saved!',
  error:   'Save failed',
});
```

Shows a persistent loading toast, then swaps it for a typed success or error
toast when the promise settles. Callbacks are supported for both `success` and
`error` to derive the final message from the resolved/rejected value.

### Mobile drag fixes

- `touch-action: none` prevents page-scroll fighting the drag.
- Pointer-move no longer calls `getBoundingClientRect()` every frame —
  wrapper dimensions are cached on pointerdown.
- Drag behavior is unchanged from v1 otherwise: release snaps to the nearest
  horizontal edge.

### ARIA

- `role="alert"` + `aria-live="assertive"` on `error` and `warning` toasts.
- `role="status"` + `aria-live="polite"` on everything else.
- `aria-atomic="true"` on all toasts.
- `aria-label="Dismiss notification"` + `type="button"` on the close button.

---

## Quick upgrade checklist

1. `npm install robot-toast@^2.0.0`
2. **Grep every `toast(…)` call without a `robotVariant`.** If you want the
   default robot to keep appearing, add `robotVariant: 'default'` explicitly.
   Otherwise the toast now shows without a robot.
3. Search your code for `robotVariant: '…'` (string literal). For each hit:
   - If it's a built-in name (`'wave'`, `'error'`, etc.): add an import from
     `robot-toast/robots` and replace the string with the imported identifier.
   - If the string was `'head-palm'`, rename to `headPalm`.
   - If the string was `'type'`, rename to `typing`.
4. If you used `ROBOT_IMAGES` directly, switch to per-variant imports.
5. Custom image paths (`'/foo.png'`) and `'none'` behave identically to v1.
