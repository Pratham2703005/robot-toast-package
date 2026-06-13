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
    {
      input: {
        pattern: /\.robot-toast-message:where\(\.robot-toast-theme-(?:light|dark|colored)\)/,
      },
      output: { present: true },
      description: "theme selectors are wrapped with :where()",
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
    // Dynamic stub: reflects inline style.left / style.top the way a real
    // browser would. onPointerUp reads getBoundingClientRect() to find the
    // drop position, so the stub has to update as pointermove writes styles.
    el.getBoundingClientRect = () => {
      const liveLeft = parseFloat(el.style.left);
      const liveTop  = parseFloat(el.style.top);
      const l = Number.isFinite(liveLeft) ? liveLeft : left;
      const t = Number.isFinite(liveTop)  ? liveTop  : top;
      return {
        x: l, y: t, left: l, top: t,
        right: l + width, bottom: t + height,
        width, height,
        toJSON: () => ({}),
      } as DOMRect;
    };
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

// ── Inline buttons (Undo / Retry / Cancel pattern) ───────────────────────────
describe("buttons", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderCases = [
    {
      input:  { buttons: [{ label: "Undo", onClick: () => {} }] },
      output: { labels: ["Undo"] },
      description: "single button renders one .robot-toast-btn",
    },
    {
      input: {
        buttons: [
          { label: "Dismiss", onClick: () => {} },
          { label: "Undo",    onClick: () => {} },
        ],
      },
      output: { labels: ["Dismiss", "Undo"] },
      description: "two buttons render in array order (left → right)",
    },
    {
      input: {
        buttons: [
          { label: "One",   onClick: () => {} },
          { label: "Two",   onClick: () => {} },
          { label: "Three", onClick: () => {} },
        ],
      },
      output: { labels: ["One", "Two", "Three"] },
      description: "three buttons render in array order",
    },
    {
      input:  { buttons: [] },
      output: { labels: [] },
      description: "empty array → no footer section at all",
    },
    {
      input:  {},
      output: { labels: [] },
      description: "buttons omitted → no footer section at all",
    },
  ];

  it.each(renderCases)("render: $description", async ({ input, output }) => {
    const { toast } = await import("../src/index");
    toast({ message: "x", typeSpeed: 0, autoClose: false, ...input });

    const footer = document.querySelector(".robot-toast-footer");
    const btns   = Array.from(document.querySelectorAll(".robot-toast-btn")) as HTMLButtonElement[];

    if (output.labels.length === 0) {
      expect(footer).toBeNull();
      expect(btns.length).toBe(0);
    } else {
      expect(footer).not.toBeNull();
      expect(btns.map(b => b.textContent)).toEqual(output.labels);
      btns.forEach(b => expect(b.type).toBe("button"));
    }
  });

  it("passes a custom className through to the button element", async () => {
    const { toast } = await import("../src/index");
    toast({
      message: "x",
      typeSpeed: 0,
      autoClose: false,
      buttons: [
        { label: "Send",   onClick: () => {}, className: "my-primary" },
        { label: "Cancel", onClick: () => {} },
      ],
    });
    const btns = Array.from(document.querySelectorAll(".robot-toast-btn")) as HTMLButtonElement[];
    // Both share the base class, only the first gets the custom one.
    expect(btns[0].className).toBe("robot-toast-btn my-primary");
    expect(btns[1].className).toBe("robot-toast-btn");
  });

  it("applies custom className to the toast message container", async () => {
    const utilityStyles = document.createElement("style");
    utilityStyles.textContent = `
      .bg-emerald-600 { background: rgb(5, 150, 105); }
      .text-white { color: rgb(255, 255, 255); }
    `;
    document.head.appendChild(utilityStyles);

    const { toast } = await import("../src/index");
    toast({
      message: "x",
      typeSpeed: 0,
      autoClose: false,
      className: "bg-emerald-600 text-white custom-merge-class",
    });

    const message = document.querySelector(".robot-toast-message")!;
    expect(message.classList.contains("robot-toast-message")).toBe(true);
    expect(message.classList.contains("robot-toast-custom-surface")).toBe(true);
    expect(message.classList.contains("bg-emerald-600")).toBe(true);
    expect(message.classList.contains("text-white")).toBe(true);
    expect(message.classList.contains("custom-merge-class")).toBe(true);
    expect(getComputedStyle(message).backgroundColor).toBe("rgb(5, 150, 105)");
    expect(getComputedStyle(message).color).toBe("rgb(255, 255, 255)");
  });

  it("allows custom className to override type-specific left borders", async () => {
    const utilityStyles = document.createElement("style");
    utilityStyles.textContent = `
      .border-l-8 { border-left-width: 8px; }
      .border-red-500 { border-left-color: rgb(239, 58, 68); border-left-style: solid; }
    `;
    document.head.appendChild(utilityStyles);

    const { toast } = await import("../src/index");
    toast({
      message: "x",
      type: "success",
      theme: "light",
      className: "border-l-8 border-red-500",
      typeSpeed: 0,
      autoClose: false,
    });

    const message = document.querySelector(".robot-toast-message") as HTMLElement;
    expect(getComputedStyle(message).borderLeftWidth).toBe("8px");
    expect(getComputedStyle(message).borderLeftColor).toBe("rgb(239, 58, 68)");
  });

  it("allows custom className to override progress bar color", async () => {
    const utilityStyles = document.createElement("style");
    utilityStyles.textContent = `
      .custom-progress .robot-toast-progress-bar { background: rgb(239, 58, 68); }
    `;
    document.head.appendChild(utilityStyles);

    const { toast } = await import("../src/index");
    toast({
      message: "x",
      type: "success",
      theme: "light",
      className: "custom-progress",
      typeSpeed: 0,
      autoClose: false,
    });

    const progressBar = document.querySelector(".robot-toast-progress-bar") as HTMLElement;
    expect(getComputedStyle(progressBar).backgroundColor).toBe("rgb(239, 58, 68)");
  });

  it("lets inline surface styles bypass theme colors", async () => {
    const { toast } = await import("../src/index");
    toast({
      message: "x",
      typeSpeed: 0,
      autoClose: false,
      style: {
        background: "rgb(17, 24, 39)",
        color: "rgb(243, 244, 246)",
      },
    });

    const message = document.querySelector(".robot-toast-message") as HTMLElement;
    expect(message.classList.contains("robot-toast-custom-surface")).toBe(true);
    expect(getComputedStyle(message).backgroundColor).toBe("rgb(17, 24, 39)");
    expect(getComputedStyle(message).color).toBe("rgb(243, 244, 246)");
  });

  it("applies inline `style` to the button element (camelCase + kebab keys)", async () => {
    const { toast } = await import("../src/index");
    toast({
      message: "x",
      typeSpeed: 0,
      autoClose: false,
      buttons: [
        {
          label: "Black",
          onClick: () => {},
          style: { background: "black", color: "white", "border-radius": "8px" },
        },
        { label: "Plain", onClick: () => {} },
      ],
    });
    const btns = Array.from(document.querySelectorAll(".robot-toast-btn")) as HTMLButtonElement[];
    expect(btns[0].style.background).toBe("black");
    expect(btns[0].style.color).toBe("white");
    expect(btns[0].style.borderRadius).toBe("8px");   // kebab key → camelCase
    // The plain button has no inline overrides
    expect(btns[1].style.background).toBe("");
  });

  it("clicking a button fires its callback and closes the toast", async () => {
    vi.useFakeTimers();
    const { toast } = await import("../src/index");
    const spyA = vi.fn();
    const spyB = vi.fn();
    toast({
      message: "File deleted",
      autoClose: false,
      typeSpeed: 0,
      buttons: [
        { label: "Dismiss", onClick: spyA },
        { label: "Undo",    onClick: spyB },
      ],
    });

    const btns = Array.from(document.querySelectorAll(".robot-toast-btn")) as HTMLButtonElement[];
    btns[1].click(); // Undo

    expect(spyA).not.toHaveBeenCalled();
    expect(spyB).toHaveBeenCalledTimes(1);

    document.querySelectorAll(".robot-toast-message").forEach(el =>
      el.dispatchEvent(new Event("animationend")),
    );
    document.querySelectorAll(".robot-toast-robot").forEach(el =>
      el.dispatchEvent(new Event("animationend")),
    );
    vi.advanceTimersByTime(300);
    expect(document.querySelectorAll(".robot-toast-wrapper").length).toBe(0);
  });

  it("a throwing button callback still closes the toast", async () => {
    vi.useFakeTimers();
    const { toast } = await import("../src/index");
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    toast({
      message: "x",
      autoClose: false,
      typeSpeed: 0,
      buttons: [{ label: "Bad", onClick: () => { throw new Error("boom"); } }],
    });
    (document.querySelector(".robot-toast-btn") as HTMLButtonElement).click();

    document.querySelectorAll(".robot-toast-message").forEach(el =>
      el.dispatchEvent(new Event("animationend")),
    );
    document.querySelectorAll(".robot-toast-robot").forEach(el =>
      el.dispatchEvent(new Event("animationend")),
    );
    vi.advanceTimersByTime(300);

    expect(errSpy).toHaveBeenCalled();
    expect(document.querySelectorAll(".robot-toast-wrapper").length).toBe(0);
    errSpy.mockRestore();
  });

  it("pointerdown on a button does not start a drag", async () => {
    const { toast } = await import("../src/index");
    toast({
      message: "x",
      draggable: true,
      autoClose: false,
      typeSpeed: 0,
      buttons: [{ label: "Undo", onClick: () => {} }],
    });
    const wrapper = document.querySelector(".robot-toast-wrapper") as HTMLElement;
    (wrapper as HTMLElement & { setPointerCapture: (id: number) => void })
      .setPointerCapture = () => {};
    wrapper.getBoundingClientRect = () => ({
      x: 100, y: 100, left: 100, top: 100, right: 300, bottom: 200,
      width: 200, height: 100, toJSON: () => ({}),
    }) as DOMRect;

    const btn = document.querySelector(".robot-toast-btn") as HTMLButtonElement;
    const down = new Event("pointerdown", { bubbles: true, cancelable: true }) as Event & {
      clientX: number; clientY: number; pointerId: number; button: number;
    };
    down.clientX = 250; down.clientY = 150; down.pointerId = 1; down.button = 0;
    btn.dispatchEvent(down);

    // Drag never kicked in → no inline left written on the wrapper
    expect(wrapper.style.left).toBe("");
  });
});

// ── Button row chunking (footer layout) ──────────────────────────────────────
// Layout spec:
//   1→[1]   2→[2]   3→[3]   4→[2,2]
//   5→[3,2] 6→[3,3] 7→[3,2,2] 8→[3,3,2] 9→[3,3,3]
//   10→[3,3,2,2]  11→[3,3,3,2]  12→[3,3,3,3]
//
// Rule: fill rows of 3 from the top; if the tail would strand a single lone
// button, balance the last two rows as [2, 2] instead.
describe("button row chunking", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    vi.resetModules();
  });

  const cases = [
    { input: { n: 1  }, output: { shape: [1]        }, description: "1 button  → [1]"       },
    { input: { n: 2  }, output: { shape: [2]        }, description: "2 buttons → [2]"       },
    { input: { n: 3  }, output: { shape: [3]        }, description: "3 buttons → [3]"       },
    { input: { n: 4  }, output: { shape: [2, 2]     }, description: "4 buttons → [2,2]"     },
    { input: { n: 5  }, output: { shape: [3, 2]     }, description: "5 buttons → [3,2]"     },
    { input: { n: 6  }, output: { shape: [3, 3]     }, description: "6 buttons → [3,3]"     },
    { input: { n: 7  }, output: { shape: [3, 2, 2]  }, description: "7 buttons → [3,2,2]"   },
    { input: { n: 8  }, output: { shape: [3, 3, 2]  }, description: "8 buttons → [3,3,2]"   },
    { input: { n: 9  }, output: { shape: [3, 3, 3]  }, description: "9 buttons → [3,3,3]"   },
    { input: { n: 10 }, output: { shape: [3, 3, 2, 2] }, description: "10 buttons → [3,3,2,2]" },
    { input: { n: 13 }, output: { shape: [3, 3, 3, 2, 2] }, description: "13 buttons → [3,3,3,2,2]" },
  ];

  it.each(cases)("$description", async ({ input, output }) => {
    const { toast } = await import("../src/index");
    const buttons = Array.from({ length: input.n }, (_, i) => ({
      label: `b${i + 1}`,
      onClick: () => {},
    }));
    toast({ message: "x", typeSpeed: 0, autoClose: false, buttons });

    const rows = Array.from(document.querySelectorAll(".robot-toast-row")) as HTMLElement[];
    // Check row count
    expect(rows.length).toBe(output.shape.length);
    // Each row's data-count must match the expected row size
    rows.forEach((row, i) => {
      expect(row.getAttribute("data-count")).toBe(String(output.shape[i]));
      expect(row.querySelectorAll(".robot-toast-btn").length).toBe(output.shape[i]);
    });
    // Overall button order is preserved (buttons flow left-to-right, top-to-bottom)
    const allBtns = Array.from(document.querySelectorAll(".robot-toast-btn")) as HTMLButtonElement[];
    expect(allBtns.map(b => b.textContent)).toEqual(
      buttons.map(b => b.label),
    );
  });

  it("solo button (n=1) gets data-count=1 AND is :only-child of the footer", async () => {
    const { toast } = await import("../src/index");
    toast({
      message: "File deleted",
      autoClose: false,
      typeSpeed: 0,
      buttons: [{ label: "Undo", onClick: () => {} }],
    });
    const footer = document.querySelector(".robot-toast-footer")!;
    expect(footer.children.length).toBe(1);                       // single row
    const row = footer.children[0] as HTMLElement;
    expect(row.getAttribute("data-count")).toBe("1");
    // The solo-CTA CSS selector targets this exact combo. We can't test
    // computed style in jsdom reliably, but the selector-matching structure
    // is what drives it.
    expect(row.matches('.robot-toast-row[data-count="1"]:only-child')).toBe(true);
  });
});

// ── Responsive CSS (no JS-side drag disable) ─────────────────────────────────
describe("mobile CSS", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
    (window as unknown as { innerWidth: number }).innerWidth = 1024;
  });

  it("injects a small-viewport media query at the 600px breakpoint", async () => {
    const { toast } = await import("../src/index");
    toast("trigger");
    const all = Array.from(document.head.querySelectorAll("style"))
      .map(s => s.textContent ?? "").join("\n");
    expect(all).toMatch(/@media \(max-width: 600px\)/);
  });

  it("responsive CSS does NOT use !important overrides (drag must keep working)", async () => {
    const { toast } = await import("../src/index");
    toast("trigger");
    const all = Array.from(document.head.querySelectorAll("style"))
      .map(s => s.textContent ?? "").join("\n");
    // Guard against re-regressing to the edge-to-edge !important layout that
    // fought the drag handler's inline left/top.
    expect(all).not.toMatch(/left:\s*16px\s*!important/);
    expect(all).not.toMatch(/right:\s*16px\s*!important/);
  });

  it("drag works at a mobile-sized viewport", async () => {
    (window as unknown as { innerWidth: number }).innerWidth = 375;
    const { toast } = await import("../src/index");
    toast({ message: "mobile", draggable: true, autoClose: false, typeSpeed: 0 });
    const wrapper = document.querySelector(".robot-toast-wrapper") as HTMLElement;
    (wrapper as HTMLElement & { setPointerCapture: (id: number) => void })
      .setPointerCapture = () => {};
    wrapper.getBoundingClientRect = () => ({
      x: 50, y: 50, left: 50, top: 50, right: 250, bottom: 150,
      width: 200, height: 100, toJSON: () => ({}),
    }) as DOMRect;

    const down = new Event("pointerdown", { bubbles: true, cancelable: true }) as Event & {
      clientX: number; clientY: number; pointerId: number; button: number;
    };
    down.clientX = 100; down.clientY = 80; down.pointerId = 1; down.button = 0;
    wrapper.dispatchEvent(down);

    // Drag activated → inline left written
    expect(wrapper.style.left).toBe("50px");
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
