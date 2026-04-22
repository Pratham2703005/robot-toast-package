import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// The library drives its entrance/exit via animationend events, which jsdom
// does NOT fire automatically. Tests that need to observe post-exit state
// dispatch these manually.
function fireAnimationEnd(el: Element | null) {
  if (!el) return;
  el.dispatchEvent(new Event("animationend", { bubbles: true }));
}

describe("robot-toast", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Mount / public API ─────────────────────────────────────────────────────
  const mountCases = [
    {
      input: { kind: "string" as const, value: "hello" },
      output: { wrapperCount: 1, idPositive: true },
      description: "toast(string) mounts one wrapper and returns a positive id",
    },
    {
      input: { kind: "options" as const, value: { message: "hi" } },
      output: { wrapperCount: 1, idPositive: true },
      description:
        "toast(options) mounts one wrapper and returns a positive id",
    },
  ];

  it.each(mountCases)("mount: $description", async ({ input, output }) => {
    const { toast } = await import("../src/index");
    const id =
      input.kind === "string" ? toast(input.value) : toast(input.value);
    expect(document.querySelectorAll(".robot-toast-wrapper").length).toBe(
      output.wrapperCount,
    );
    expect(typeof id).toBe("number");
    if (output.idPositive) expect(id).toBeGreaterThan(0);
  });

  // ── ARIA roles by toast type ───────────────────────────────────────────────
  type Helper = "default" | "success" | "info" | "error" | "warning";
  const ariaCases: Array<{
    input: { helper: Helper };
    output: { role: "status" | "alert"; ariaLive: "polite" | "assertive" };
    description: string;
  }> = [
    {
      input: { helper: "default" },
      output: { role: "status", ariaLive: "polite" },
      description: "default → role=status + aria-live=polite",
    },
    {
      input: { helper: "success" },
      output: { role: "status", ariaLive: "polite" },
      description: "success → role=status + aria-live=polite",
    },
    {
      input: { helper: "info" },
      output: { role: "status", ariaLive: "polite" },
      description: "info    → role=status + aria-live=polite",
    },
    {
      input: { helper: "error" },
      output: { role: "alert", ariaLive: "assertive" },
      description: "error   → role=alert + aria-live=assertive",
    },
    {
      input: { helper: "warning" },
      output: { role: "alert", ariaLive: "assertive" },
      description: "warning → role=alert + aria-live=assertive",
    },
  ];

  it.each(ariaCases)("ARIA: $description", async ({ input, output }) => {
    const { toast } = await import("../src/index");
    if (input.helper === "default") toast("x");
    else toast[input.helper]("x");

    const w = document.querySelector(".robot-toast-wrapper")!;
    expect(w.getAttribute("role")).toBe(output.role);
    expect(w.getAttribute("aria-live")).toBe(output.ariaLive);
    expect(w.getAttribute("aria-atomic")).toBe("true");
  });

  // ── Attribute presence on built elements ───────────────────────────────────
  const attrCases = [
    {
      input: { selector: ".robot-toast-close", attr: "aria-label" },
      output: { value: "Dismiss notification" },
      description: "close button has aria-label",
    },
    {
      input: { selector: ".robot-toast-close", attr: "type" },
      output: { value: "button" },
      description:
        "close button has type=button (prevents accidental form submit)",
    },
    {
      input: { selector: ".robot-toast-wrapper", attr: "aria-atomic" },
      output: { value: "true" },
      description: "wrapper has aria-atomic=true",
    },
  ];

  it.each(attrCases)("attr: $description", async ({ input, output }) => {
    const { toast } = await import("../src/index");
    toast("x");
    const el = document.querySelector(input.selector);
    expect(el).toBeTruthy();
    expect(el!.getAttribute(input.attr)).toBe(output.value);
  });

  // ── CSS injection ──────────────────────────────────────────────────────────
  const cssCases = [
    {
      input: { pattern: /\.robot-toast-wrapper[^}]*touch-action:\s*none/ },
      output: { present: true },
      description: "wrapper has touch-action:none (mobile drag fix)",
    },
    {
      input: { pattern: /\.robot-toast-wrapper[^}]*user-select:\s*none/ },
      output: { present: true },
      description: "wrapper has user-select:none",
    },
    {
      input: { pattern: /\.robot-toast-message/ },
      output: { present: true },
      description: "message box rules are injected",
    },
  ];

  it.each(cssCases)("css: $description", async ({ input, output }) => {
    const { toast } = await import("../src/index");
    // Styles are injected lazily on first getInstance() — trigger it.
    toast("trigger");
    const all = Array.from(document.head.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .join("\n");
    expect(input.pattern.test(all)).toBe(output.present);
  });

  // ── Queue / limit ──────────────────────────────────────────────────────────
  const limitCases = [
    {
      input: { limit: 2, count: 3 },
      output: { visible: 2 },
      description: "limit=2, 3 shown → 2 visible (third queued)",
    },
    {
      input: { limit: 0, count: 3 },
      output: { visible: 3 },
      description: "limit=0 (unlimited) → all 3 visible",
    },
    {
      input: { limit: 1, count: 5 },
      output: { visible: 1 },
      description: "limit=1 → only newest-spawned visible",
    },
  ];

  it.each(limitCases)("queue: $description", async ({ input, output }) => {
    vi.useFakeTimers();
    const { toast } = await import("../src/index");
    for (let i = 0; i < input.count; i++) {
      toast({
        message: `m${i}`,
        limit: input.limit,
        autoClose: false,
        typeSpeed: 0,
      });
    }
    expect(document.querySelectorAll(".robot-toast-wrapper").length).toBe(
      output.visible,
    );
  });

  // ── toast.promise: resolve vs reject ───────────────────────────────────────
  type PromiseCase = {
    input: { resolves: boolean; payload: unknown };
    output: { typeClass: string; throws: boolean };
    description: string;
  };
  const promiseCases: PromiseCase[] = [
    {
      input: { resolves: true, payload: "ok" },
      output: { typeClass: "robot-toast-type-success", throws: false },
      description: "resolve → success toast, value passes through",
    },
    {
      input: { resolves: false, payload: new Error("nope") },
      output: { typeClass: "robot-toast-type-error", throws: true },
      description: "reject → error toast, original rejection rethrown",
    },
  ];

  it.each(promiseCases)("promise: $description", async ({ input, output }) => {
    const { toast } = await import("../src/index");
    const p: Promise<unknown> = input.resolves
      ? Promise.resolve(input.payload)
      : Promise.reject(input.payload);

    const tracked = toast.promise(p as Promise<unknown>, {
      loading: "Loading…",
      success: "Saved!",
      error: "Failed",
    });

    // Loading toast is mounted synchronously (before the promise settles).
    expect(document.querySelectorAll(".robot-toast-wrapper").length).toBe(1);

    if (output.throws) {
      await expect(tracked).rejects.toBe(input.payload);
    } else {
      await expect(tracked).resolves.toBe(input.payload);
    }

    const hasTypeClass = Array.from(
      document.querySelectorAll(".robot-toast-message"),
    ).some((el) => el.classList.contains(output.typeClass));
    expect(hasTypeClass).toBe(true);
  });

  // ── autoClose behavior ─────────────────────────────────────────────────────
  const autoCloseCases = [
    {
      input: { autoClose: false as const, wait: 60_000 },
      output: { stillMounted: true },
      description: "autoClose=false keeps toast through long timeouts",
    },
    {
      input: { autoClose: 0, wait: 60_000 },
      output: { stillMounted: true },
      description: "autoClose=0 is treated as no auto-close",
    },
  ];

  it.each(autoCloseCases)(
    "autoClose: $description",
    async ({ input, output }) => {
      vi.useFakeTimers();
      const { toast } = await import("../src/index");
      toast({ message: "sticky", autoClose: input.autoClose, typeSpeed: 0 });
      vi.advanceTimersByTime(input.wait);
      const stillThere =
        document.querySelectorAll(".robot-toast-wrapper").length === 1;
      expect(stillThere).toBe(output.stillMounted);
    },
  );

  // ── Imperative close flows (don't fit the input/output table cleanly) ──────

  it("closeAll removes every mounted toast", async () => {
    vi.useFakeTimers();
    const { toast } = await import("../src/index");
    toast("a");
    toast("b");
    toast("c");
    expect(document.querySelectorAll(".robot-toast-wrapper").length).toBe(3);

    toast.closeAll();
    // Drive the exit animation: message collapse → robot exit → 260ms tail
    document.querySelectorAll(".robot-toast-message").forEach(fireAnimationEnd);
    document.querySelectorAll(".robot-toast-robot").forEach(fireAnimationEnd);
    vi.advanceTimersByTime(300);

    expect(document.querySelectorAll(".robot-toast-wrapper").length).toBe(0);
  });

  it("closeById removes only the specified toast", async () => {
    vi.useFakeTimers();
    const { toast } = await import("../src/index");
    const idA = toast({ message: "a", autoClose: false, typeSpeed: 0 });
    toast({ message: "b", autoClose: false, typeSpeed: 0 });

    toast.closeById(idA);
    document.querySelectorAll(".robot-toast-message").forEach(fireAnimationEnd);
    document.querySelectorAll(".robot-toast-robot").forEach(fireAnimationEnd);
    vi.advanceTimersByTime(300);

    expect(document.querySelectorAll(".robot-toast-wrapper").length).toBe(1);
  });

  it("promise: error callback receives the rejection value", async () => {
    const { toast } = await import("../src/index");
    let received: unknown = null;
    const tracked = toast.promise<never, string>(
      Promise.reject("bad-thing") as Promise<never>,
      {
        loading: "x",
        success: "y",
        error: (e) => {
          received = e;
          return `got: ${e}`;
        },
      },
    );

    await expect(tracked).rejects.toBe("bad-thing");
    expect(received).toBe("bad-thing");
  });

  // ── robot-toast/robots subpath — data URLs ─────────────────────────────────
  const robotCases = [
    { input: { name: "wave"        }, output: { prefix: "data:image/svg+xml;utf8," }, description: "wave exports a data URL"        },
    { input: { name: "error"       }, output: { prefix: "data:image/svg+xml;utf8," }, description: "error exports a data URL"       },
    { input: { name: "success"     }, output: { prefix: "data:image/svg+xml;utf8," }, description: "success exports a data URL"     },
    { input: { name: "headPalm"    }, output: { prefix: "data:image/svg+xml;utf8," }, description: "headPalm (renamed from head-palm) exports a data URL" },
    { input: { name: "typing"      }, output: { prefix: "data:image/svg+xml;utf8," }, description: "typing (renamed from type) exports a data URL"          },
    { input: { name: "validation2" }, output: { prefix: "data:image/svg+xml;utf8," }, description: "validation2 exports a data URL" },
  ];

  it.each(robotCases)("robots: $description", async ({ input, output }) => {
    const robots = await import("../src/robots/index");
    const value = (robots as Record<string, unknown>)[input.name];
    expect(typeof value).toBe("string");
    expect((value as string).startsWith(output.prefix)).toBe(true);
    // Sanity-check the URL-encoded payload contains an <svg> tag
    expect(decodeURIComponent(value as string)).toMatch(/<svg/);
  });

  it("robots barrel exports all 16 variants", async () => {
    const robots = await import("../src/robots/index");
    const expected = [
      "wave", "base", "base2", "success", "error",
      "angry", "angry2", "shock", "think", "search",
      "loading", "sleep", "headPalm", "typing",
      "validation", "validation2",
    ];
    for (const name of expected) {
      expect(typeof (robots as Record<string, unknown>)[name]).toBe("string");
    }
  });

  // ── robotVariant handling in toast.ts ──────────────────────────────────────
  // Opt-in semantics: nothing renders unless the caller explicitly asks.
  //  - undefined / '' / 'none' / unrecognized → hidden (display:none)
  //  - 'default'                              → built-in inline SVG
  //  - data URL / recognized image path       → <img>
  const variantRenderCases = [
    {
      input: { variant: "data:image/svg+xml;utf8,%3Csvg%2F%3E" },
      output: { kind: "img" as const },
      description: "data URL → <img> rendered",
    },
    {
      input: { variant: "/my-robot.png" },
      output: { kind: "img" as const },
      description: "path with recognized extension → <img> rendered",
    },
    {
      input: { variant: "default" },
      output: { kind: "builtin" as const },
      description: "'default' → built-in inline SVG",
    },
    {
      input: { variant: undefined },
      output: { kind: "hidden" as const },
      description: "omitted → hidden (no robot)",
    },
    {
      input: { variant: "" },
      output: { kind: "hidden" as const },
      description: "empty string → hidden",
    },
    {
      input: { variant: "none" },
      output: { kind: "hidden" as const },
      description: "'none' → hidden (back-compat alias)",
    },
    {
      input: { variant: "not-a-path-or-dataurl" },
      output: { kind: "hidden" as const },
      description: "unrecognized string → hidden (don't show unless explicitly asked)",
    },
    {
      input: { variant: "wave" },
      output: { kind: "hidden" as const },
      description: "legacy string name (e.g. 'wave') is not a sentinel — hidden",
    },
  ];

  it.each(variantRenderCases)("variant: $description", async ({ input, output }) => {
    const { toast } = await import("../src/index");
    toast({ message: "x", robotVariant: input.variant, typeSpeed: 0 });
    const robotContainer = document.querySelector(".robot-toast-robot") as HTMLElement;
    const hasImg     = robotContainer.querySelector("img") !== null;
    const hasBuiltin = robotContainer.querySelector("svg") !== null;
    const isHidden   = robotContainer.style.display === "none";

    if (output.kind === "img") {
      expect(hasImg).toBe(true);
      expect(isHidden).toBe(false);
    } else if (output.kind === "builtin") {
      expect(hasBuiltin).toBe(true);
      expect(hasImg).toBe(false);
      expect(isHidden).toBe(false);
    } else {
      expect(isHidden).toBe(true);
    }
  });

  it("variant='none' hides the robot container", async () => {
    const { toast } = await import("../src/index");
    toast({ message: "x", robotVariant: "none", typeSpeed: 0 });
    const robotContainer = document.querySelector(".robot-toast-robot") as HTMLElement;
    expect(robotContainer.style.display).toBe("none");
  });
});

// ── Drag behavior ────────────────────────────────────────────────────────────
describe("drag", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** PointerEvent polyfill that jsdom reliably accepts. */
  function firePointer(
    target: Element,
    type: "pointerdown" | "pointermove" | "pointerup" | "pointercancel",
    props: { clientX: number; clientY?: number; pointerId?: number; button?: number } = { clientX: 0 },
  ) {
    const evt = new Event(type, { bubbles: true, cancelable: true }) as Event & {
      clientX: number; clientY: number; pointerId: number; button: number;
    };
    evt.clientX   = props.clientX;
    evt.clientY   = props.clientY ?? 50;
    evt.pointerId = props.pointerId ?? 1;
    evt.button    = props.button ?? 0;
    target.dispatchEvent(evt);
  }

  function stubWrapper(el: HTMLElement, width = 200, height = 100, left = 100, top = 100) {
    (el as HTMLElement & { setPointerCapture: (id: number) => void }).setPointerCapture = () => {};
    el.getBoundingClientRect = () => ({
      x: left, y: top, left, top,
      right: left + width, bottom: top + height,
      width, height,
      toJSON: () => ({}),
    }) as DOMRect;
  }

  async function setupDraggable() {
    const { toast } = await import("../src/index");
    toast({ message: "drag me", draggable: true, autoClose: false, typeSpeed: 0 });
    const wrapper = document.querySelector(".robot-toast-wrapper") as HTMLElement;
    stubWrapper(wrapper);
    return wrapper;
  }

  // Release-point determines snap side: midpoint < viewport/2 → left edge,
  // otherwise → right edge. window.innerWidth defaults to 1024 in jsdom.
  // Wrapper width stubbed to 200 → snap targets are 20 (left) or 804 (right).
  const cases = [
    {
      description: "release on left half → snaps to left edge (20px margin)",
      input:  { downX: 150, upX: 100 },  // wrapper left ≈ 50, midX ≈ 150 < 512
      output: { finalLeft: "20px" },
    },
    {
      description: "release on right half → snaps to right edge",
      input:  { downX: 150, upX: 900 },  // wrapper left ≈ 850, midX ≈ 950 > 512
      output: { finalLeft: "804px" },    // 1024 - 200 - 20
    },
    {
      description: "no movement (click) still triggers snap to a side",
      input:  { downX: 150, upX: 150 },  // wrapper left stays at stubbed 100, midX 200 < 512
      output: { finalLeft: "20px" },
    },
  ];

  it.each(cases)("snap: $description", async ({ input, output }) => {
    const wrapper = await setupDraggable();
    firePointer(wrapper, "pointerdown", { clientX: input.downX });
    firePointer(wrapper, "pointermove", { clientX: input.upX });
    firePointer(wrapper, "pointerup",   { clientX: input.upX });

    expect(wrapper.style.left).toBe(output.finalLeft);
    // The toast stays mounted — no dismiss path exists on release.
    expect(document.querySelectorAll(".robot-toast-wrapper").length).toBe(1);
  });

  it("drag never dismisses, only snaps", async () => {
    vi.useFakeTimers();
    const wrapper = await setupDraggable();

    // A very fast, long horizontal drag — what used to trigger dismiss.
    firePointer(wrapper, "pointerdown", { clientX: 150 });
    vi.advanceTimersByTime(50);
    firePointer(wrapper, "pointermove", { clientX: 500 });
    firePointer(wrapper, "pointerup",   { clientX: 500 });

    // No opacity-to-0, no close() — the toast is still on screen.
    expect(wrapper.style.opacity).not.toBe("0");
    vi.advanceTimersByTime(600);
    expect(document.querySelectorAll(".robot-toast-wrapper").length).toBe(1);
  });

  it("pointerdown on close button does not start a drag", async () => {
    const wrapper = await setupDraggable();
    const closeBtn = wrapper.querySelector(".robot-toast-close") as HTMLButtonElement;

    firePointer(closeBtn, "pointerdown", { clientX: 250 });
    firePointer(wrapper,  "pointerup",   { clientX: 250 });

    // No inline left/top written (drag never activated)
    expect(wrapper.style.left).toBe("");
  });
});

// ── React wrapper ────────────────────────────────────────────────────────────
describe("robot-toast/react", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    vi.resetModules();
  });

  it("useRobotToast returns the core toast function", async () => {
    const { useRobotToast } = await import("../src/react/index");
    const { toast: coreToast } = await import("../src/index");
    // The hook is trivial — outside a React render it still returns the ref.
    // We're verifying the binding, not React semantics.
    expect(useRobotToast()).toBe(coreToast);
  });

  it("exposes the same toast helpers via the react subpath", async () => {
    const { toast } = await import("../src/react/index");
    expect(typeof toast).toBe("function");
    expect(typeof toast.success).toBe("function");
    expect(typeof toast.error).toBe("function");
    expect(typeof toast.promise).toBe("function");
    expect(typeof toast.closeAll).toBe("function");
    expect(typeof toast.closeById).toBe("function");
  });
});
