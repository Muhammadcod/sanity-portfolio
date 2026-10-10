"use client";

import "./modernist.css";
import { ArticleReader, fmtDate } from "./article-reader";
import { CaseStudyOverlay } from "./case-study";
import { useTheme } from "next-themes";
import {
  type CSSProperties,
  type PointerEvent as RPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ABOUT, type Article, EDGES, EMAIL, EXP, FEATURED_COUNT, type Project, SECTIONS, SOCIAL, STEPS, TOOLS,
} from "./data";

const EASE = "cubic-bezier(.2,.9,.2,1)";
const PAD_X = "clamp(20px,4vw,56px)";
const SEC_LABEL: Record<string, string> = {
  work: "01 — Work", about: "02 — About", experience: "03 — Experience",
  toolbox: "04 — Toolbox", lab: "05 — The Lab", writing: "06 — Writing", contact: "07 — Contact",
};
const KICKER: CSSProperties = { fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" };
const SMALL_CAP: CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" };
const H2: CSSProperties = { flex: "1 1 auto", margin: 0, fontSize: "clamp(64px,12vw,200px)", lineHeight: 0.82, letterSpacing: "-.03em", textTransform: "uppercase" };

function SectionHead({ n, title, blurb, mb, h2 }: { n: string; title: string; blurb: string; mb?: string; h2?: CSSProperties }) {
  return (
    <div data-reveal="1" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "var(--space-4) var(--space-8)", borderTop: "2px solid var(--color-divider)", paddingTop: "var(--space-4)", marginBottom: mb }}>
      <span style={{ flex: "0 0 100px", fontSize: 12, fontWeight: 600, letterSpacing: ".1em", alignSelf: "flex-start" }}>({n})</span>
      <h2 style={{ ...H2, ...h2 }}>{title}</h2>
      <p style={{ flex: "0 1 300px", margin: 0, fontSize: 15, textWrap: "pretty" }}>{blurb}</p>
    </div>
  );
}

type Cmd = { label: string; hint: string; run: () => void };

export function Portfolio({ projects, articles }: { projects: Project[]; articles: Article[] }) {
  const { resolvedTheme, setTheme } = useTheme();
  const ink = resolvedTheme === "dark";

  const [narrow, setNarrow] = useState(false);
  const [fine, setFine] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState("top");
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState<number | null>(null);
  const csRef = useRef<HTMLDivElement>(null);
  const [art, setArt] = useState<number | null>(null);
  const [artShown, setArtShown] = useState<number | null>(null);
  const arRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [about, setAbout] = useState(0);
  const [exp, setExp] = useState(0);
  const [tool, setTool] = useState<string | null>(null);
  const [nodes, setNodes] = useState<Record<string, { x: number; y: number }>>(() =>
    Object.fromEntries(TOOLS.map((t) => [t.k, { x: t.x, y: t.y }])),
  );
  const [pal, setPal] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [src, setSrc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sudoOpen, setSudoOpen] = useState(false);
  const [sudoLines, setSudoLines] = useState<string[]>([]);
  const [sudoDone, setSudoDone] = useState(false);
  const [labW, setLabW] = useState(100);
  const [labWg, setLabWg] = useState(800);
  const [order, setOrder] = useState([0, 1, 2, 3, 4]);
  const [dragging, setDragging] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderNumRef = useRef<HTMLDivElement>(null);
  const loaderBarRef = useRef<HTMLDivElement>(null);
  const loaderNameRef = useRef<HTMLSpanElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLCanvasElement>(null);
  const palInputRef = useRef<HTMLInputElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const curInnerRef = useRef<HTMLDivElement>(null);
  const curLabelRef = useRef<HTMLSpanElement>(null);

  const m = useRef({
    mx: -999, my: -999, cx: -999, cy: -999, px: 0, py: 0, moved: false,
    reduced: false, fine: false, heroReady: false, heroBottom: 0, sudoBusy: false, keyBuf: "",
    drag: null as null | { k: string; rect: DOMRect },
    tdrag: null as null | { x: number; sl: number },
    letters: [] as { el: HTMLElement; x: number; y: number; s: number; w: number; ls: number; lw: number }[],
  });
  const live = useRef({ pal, q, sel, cmds: [] as Cmd[] });

  /* ---------- helpers ---------- */
  const go = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: id === "top" ? 0 : el.getBoundingClientRect().top + scrollY - 40, behavior: m.current.reduced ? "auto" : "smooth" });
  }, []);

  const copyEmail = useCallback(() => {
    try { navigator.clipboard?.writeText(EMAIL).catch(() => {}); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, []);

  const openArticle = useCallback((i: number) => {
    setArt(i); setArtShown(i);
    if (arRef.current) arRef.current.scrollTop = 0;
  }, []);

  const openCase = useCallback((i: number) => {
    setOpen(i); setShown(i); setHover(null);
    if (csRef.current) csRef.current.scrollTop = 0;
  }, []);

  const runSudo = useCallback(() => {
    if (m.current.sudoBusy) return;
    m.current.sudoBusy = true;
    const lines = ["$ sudo hire mohammed", "[sudo] password for visitor: ••••••••", "Verifying… react ✓  typescript ✓  taste ✓", "Permission granted. Opening a channel to Mohammed."];
    setSudoOpen(true); setSudoLines([]); setSudoDone(false);
    lines.forEach((l, i) => setTimeout(() => setSudoLines((s) => [...s, l]), 120 + i * 420));
    setTimeout(() => { m.current.sudoBusy = false; setSudoDone(true); }, 200 + lines.length * 420);
  }, []);

  const commands = (): Cmd[] => {
    const all: Cmd[] = [
      ...SECTIONS.concat([["toolbox", "Toolbox", "04"]]).map(([id, l]) => ({ label: `Go to ${l}`, hint: "Section", run: () => go(id) })),
      ...projects.map((p, i) => ({ label: `Open ${p.name}`, hint: "Case study", run: () => openCase(i) })),
      ...articles.map((a, i) => ({ label: `Read: ${a.title}`, hint: "Article", run: () => (a.href ? window.open(a.href, "_blank", "noopener") : openArticle(i)) })),
      { label: "Copy email address", hint: "Action", run: copyEmail },
      { label: ink ? "Switch to paper ground" : "Switch to ink ground", hint: "Theme", run: () => setTheme(ink ? "light" : "dark") },
      { label: "View source — how the hero type works", hint: "Source", run: () => setSrc(true) },
      ...SOCIAL.map((s) => ({ label: `${s.label} — ${s.handle}`, hint: "↗ External", run: () => window.open(s.href, "_blank", "noopener") })),
    ];
    const needle = q.trim().toLowerCase();
    return needle ? all.filter((c) => c.label.toLowerCase().includes(needle) || c.hint.toLowerCase().includes(needle)) : all;
  };
  const cmds = pal ? commands() : [];
  live.current = { pal, q, sel, cmds };

  const runCmd = (c: Cmd) => { setPal(false); setQ(""); setSel(0); setTimeout(c.run, 60); };

  /* ---------- mount: loader, listeners, rAF loop ---------- */
  useEffect(() => {
    const st = m.current;
    const rootEl = rootRef.current;
    if (!rootEl) return;
    const root: HTMLDivElement = rootEl;
    st.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    st.fine = matchMedia("(pointer: fine)").matches;
    setFine(st.fine);
    setNarrow(innerWidth < 820);

    const offs: (() => void)[] = [];
    const on = <T extends EventTarget>(t: T, ev: string, fn: EventListener, o?: AddEventListenerOptions) => {
      t.addEventListener(ev, fn, o);
      offs.push(() => t.removeEventListener(ev, fn, o));
    };

    /* hero letters */
    const cacheLetters = () => {
      const els = [...root.querySelectorAll<HTMLElement>("[data-hl]")];
      els.forEach((el) => { el.style.fontStretch = "100%"; el.style.fontWeight = "800"; });
      st.letters = els.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x: r.left + r.width / 2, y: r.top + r.height / 2 + scrollY, s: 100, w: 800, ls: 100, lw: 800 };
      });
      const h = heroRef.current;
      if (h) st.heroBottom = h.offsetTop + h.offsetHeight;
    };

    /* scroll reveals */
    const setupReveals = () => {
      if (st.reduced || !("IntersectionObserver" in window)) return;
      const io = new IntersectionObserver((ents) => ents.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        io.unobserve(el);
        if (el.dataset.line) (el.firstElementChild as HTMLElement).style.transform = "translateY(0)";
        else { el.style.opacity = "1"; el.style.transform = "none"; }
      }), { threshold: 0.12 });
      root.querySelectorAll<HTMLElement>("main [data-reveal]").forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight) return;
        el.style.opacity = "0"; el.style.transform = "translateY(40px)";
        el.style.transition = `opacity .9s ${EASE}, transform .9s ${EASE}`;
        io.observe(el);
      });
      root.querySelectorAll<HTMLElement>("[data-line]").forEach((el, i) => {
        if (el.getBoundingClientRect().top < innerHeight) return;
        const inner = el.firstElementChild as HTMLElement;
        inner.style.transform = "translateY(105%)";
        inner.style.transition = `transform 1s ${EASE} ${i * 0.08}s`;
        io.observe(el);
      });
      offs.push(() => io.disconnect());
    };

    let introDone = false;
    const finishIntro = (instant?: boolean) => {
      if (introDone) return;
      introDone = true;
      root.querySelectorAll<HTMLElement>("[data-hl]").forEach((el, i) => {
        el.style.transitionDelay = instant ? "0s" : `${0.18 + i * 0.035}s`;
        el.style.transform = "translateY(0)";
      });
      setTimeout(() => { cacheLetters(); st.heroReady = true; }, instant ? 50 : 1500);
      setupReveals();
    };

    /* loader — once per session */
    const L = loaderRef.current;
    let seen = false;
    try { seen = sessionStorage.getItem("mod-intro") === "1"; sessionStorage.setItem("mod-intro", "1"); } catch {}
    let fallback: ReturnType<typeof setTimeout> | undefined;
    if (!L || seen || st.reduced) {
      if (L) L.style.display = "none";
      finishIntro(true);
    } else {
      const name = "MOHAMMED.ADEBAYO", dur = 1250, t0 = performance.now();
      let done = false;
      const end = () => {
        if (done) return;
        done = true;
        L.style.transform = "translateY(-100%)";
        finishIntro();
        setTimeout(() => { L.style.display = "none"; }, 950);
      };
      fallback = setTimeout(() => { if (!done) { done = true; L.style.display = "none"; finishIntro(true); } }, 2600);
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - (1 - p) ** 3;
        if (loaderNumRef.current) loaderNumRef.current.textContent = String(Math.round(e * 100)).padStart(2, "0");
        if (loaderBarRef.current) loaderBarRef.current.style.transform = `scaleX(${e})`;
        if (loaderNameRef.current) loaderNameRef.current.textContent = name.slice(0, Math.ceil(e * name.length));
        if (done) return;
        if (p < 1) requestAnimationFrame(step);
        else { clearTimeout(fallback); setTimeout(end, 120); }
      };
      requestAnimationFrame(step);
    }

    /* scroll */
    let sq = 0;
    const onScroll = () => {
      if (sq) return;
      sq = requestAnimationFrame(() => {
        sq = 0;
        const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
        if (progRef.current) progRef.current.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
        let sec = "top";
        for (const id of ["work", "about", "experience", "toolbox", "lab", "writing", "contact"]) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top < innerHeight * 0.45) sec = id;
        }
        setScrolled(y > 40);
        setSection(sec);
      });
    };
    let rz: ReturnType<typeof setTimeout>;
    const onResize = () => {
      setNarrow(innerWidth < 820);
      clearTimeout(rz);
      rz = setTimeout(() => { if (st.heroReady) cacheLetters(); initDots(); }, 200);
    };
    const onMove = (e: Event) => {
      const ev = e as MouseEvent;
      st.mx = ev.clientX; st.my = ev.clientY; st.moved = true;
      root.style.setProperty("--mx", `${ev.clientX}px`);
      root.style.setProperty("--my", `${ev.clientY}px`);
      if (curRef.current) curRef.current.style.opacity = "1";
    };
    const onOver = (e: Event) => {
      const inner = curInnerRef.current, lab = curLabelRef.current;
      if (!inner || !lab) return;
      const target = e.target as Element;
      const t = target.closest?.("[data-cursor]");
      const label = t ? t.getAttribute("data-cursor") ?? "" : "";
      const hov = !label && target.closest?.("a,button,input,[role=button]");
      if (label) {
        inner.style.width = `${label.length > 1 ? Math.max(64, label.length * 11 + 28) : 44}px`;
        inner.style.height = "30px"; inner.style.background = "var(--color-accent)"; inner.style.borderColor = "transparent";
        lab.textContent = label; lab.style.opacity = "1";
      } else if (hov) {
        inner.style.width = "36px"; inner.style.height = "36px"; inner.style.background = "transparent";
        inner.style.borderColor = "var(--color-accent)"; lab.style.opacity = "0";
      } else {
        inner.style.width = "10px"; inner.style.height = "10px"; inner.style.background = "var(--color-accent)";
        inner.style.borderColor = "transparent"; lab.style.opacity = "0";
      }
    };
    const onKey = (e: Event) => {
      const ev = e as KeyboardEvent, k = ev.key, lv = live.current;
      if ((ev.metaKey || ev.ctrlKey) && k.toLowerCase() === "k") {
        ev.preventDefault();
        setPal((p) => !p); setQ(""); setSel(0);
        return;
      }
      if (lv.pal) {
        if (k === "ArrowDown") { ev.preventDefault(); setSel((s) => Math.min(lv.cmds.length - 1, s + 1)); }
        else if (k === "ArrowUp") { ev.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
        else if (k === "Enter" && lv.cmds[lv.sel]) { ev.preventDefault(); runCmdRef.current(lv.cmds[lv.sel]); }
        else if (k === "Escape") setPal(false);
        return;
      }
      if (k === "Escape") { setSrc(false); setSudoOpen(false); setOpen(null); setArt(null); return; }
      const tag = ((ev.target as HTMLElement)?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (k.length === 1) {
        st.keyBuf = (st.keyBuf + k.toLowerCase()).slice(-4);
        if (st.keyBuf === "sudo") { st.keyBuf = ""; runSudo(); }
      }
    };
    const onPMove = (e: Event) => {
      const ev = e as PointerEvent;
      if (st.drag) {
        const r = st.drag.rect, k = st.drag.k;
        const x = Math.max(6, Math.min(94, ((ev.clientX - r.left) / r.width) * 100));
        const y = Math.max(6, Math.min(94, ((ev.clientY - r.top) / r.height) * 100));
        setNodes((s) => ({ ...s, [k]: { x, y } }));
      } else if (st.tdrag && trackRef.current) {
        trackRef.current.scrollLeft = st.tdrag.sl - (ev.clientX - st.tdrag.x);
      }
    };
    const onPUp = () => {
      st.drag = null;
      if (st.tdrag) { st.tdrag = null; setDragging(false); }
    };
    on(window, "resize", onResize);
    on(window, "scroll", onScroll, { passive: true });
    on(window, "mousemove", onMove, { passive: true });
    on(document, "mouseover", onOver);
    on(document, "mouseleave", () => { st.mx = -999; if (curRef.current) curRef.current.style.opacity = "0"; });
    on(window, "keydown", onKey);
    on(window, "pointermove", onPMove);
    on(window, "pointerup", onPUp);

    /* clock */
    let blink = false;
    const tickClock = () => {
      let s = "";
      try { s = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()); }
      catch { s = new Date().toTimeString().slice(0, 8); }
      root.querySelectorAll("[data-clock]").forEach((el) => { el.textContent = s; });
      blink = !blink;
      root.querySelectorAll<HTMLElement>("[data-blink]").forEach((el) => { el.style.opacity = blink || st.reduced ? "1" : "0.25"; });
    };
    tickClock();
    const clock = setInterval(tickClock, 1000);

    /* main rAF loop: cursor, preview, hero letters, magnetic buttons, fps */
    let frames = 0, lastFps = 0, raf = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      frames++;
      if (t - lastFps >= 1000) {
        const f = Math.min(120, Math.round((frames * 1000) / (t - lastFps)));
        frames = 0; lastFps = t;
        root.querySelectorAll("[data-fps]").forEach((el) => { el.textContent = String(f); });
      }
      const cur = curRef.current;
      if (cur && st.mx > -900) {
        const k = st.reduced ? 1 : 0.25;
        st.cx += (st.mx - st.cx) * k; st.cy += (st.my - st.cy) * k;
        cur.style.transform = `translate3d(${st.cx}px,${st.cy}px,0)`;
      }
      const pv = previewRef.current;
      if (pv) {
        const ox = st.px;
        st.px += (st.mx - st.px) * 0.12; st.py += (st.my - st.py) * 0.12;
        const rot = Math.max(-8, Math.min(8, (st.px - ox) * 0.4));
        pv.style.transform = `translate3d(${st.px + 28}px,${st.py - 40}px,0) translateY(-50%) rotate(${rot}deg)`;
      }
      if (st.heroReady && st.letters.length && st.fine && !st.reduced) {
        const yd = st.my + scrollY, vw = innerWidth, vh = innerHeight;
        const inHero = st.mx > -900 && yd < (st.heroBottom || vh);
        let best: (typeof st.letters)[number] | null = null, bd = 1e9;
        for (const Lt of st.letters) {
          let ts = 100, tw = 800;
          if (inHero) {
            const d = Math.hypot((Lt.x - st.mx) / vw, ((Lt.y - yd) / vh) * 0.7);
            let k = Math.max(0, 1 - d / 0.26);
            k = k * k * (3 - 2 * k);
            ts = 88 + 37 * k; tw = 600 + 300 * k;
            if (d < bd) { bd = d; best = Lt; }
          }
          Lt.s += (ts - Lt.s) * 0.14; Lt.w += (tw - Lt.w) * 0.14;
          if (Math.abs(Lt.s - Lt.ls) > 0.15 || Math.abs(Lt.w - Lt.lw) > 1) {
            Lt.el.style.fontStretch = `${Lt.s.toFixed(1)}%`; Lt.el.style.fontWeight = String(Math.round(Lt.w));
            Lt.ls = Lt.s; Lt.lw = Lt.w;
          }
        }
        if (best && frames % 4 === 0) {
          root.querySelectorAll("[data-axis-s]").forEach((el) => { el.textContent = String(Math.round(best!.s)); });
          root.querySelectorAll("[data-axis-w]").forEach((el) => { el.textContent = String(Math.round(best!.w)); });
        }
      }
      if (st.moved && st.fine && !st.reduced) {
        st.moved = false;
        root.querySelectorAll<HTMLElement & { _tx?: number; _ty?: number }>("[data-magnetic]").forEach((el) => {
          const r = el.getBoundingClientRect(), tx = el._tx || 0, ty = el._ty || 0;
          const ccx = r.left - tx + r.width / 2, ccy = r.top - ty + r.height / 2;
          const dx = st.mx - ccx, dy = st.my - ccy;
          const near = Math.abs(dx) < r.width / 2 + 30 && Math.abs(dy) < r.height / 2 + 30;
          const nx = near ? dx * 0.18 : 0, ny = near ? dy * 0.3 : 0;
          if (nx !== tx || ny !== ty) { el._tx = nx; el._ty = ny; el.style.transform = `translate(${nx}px,${ny}px)`; }
        });
      }
    };
    raf = requestAnimationFrame(tick);

    /* repel-field canvas */
    let dotRaf = 0;
    function initDots() {
      const cv = dotRef.current;
      if (!cv) return;
      const dpr = Math.min(2, devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
      const ctx = cv.getContext("2d");
      if (!w || !h || !ctx) return;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = 20, pts: { ox: number; oy: number; x: number; y: number; vx: number; vy: number }[] = [];
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) pts.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
      const P = { x: -999, y: -999 };
      const draw = () => {
        const css = getComputedStyle(root);
        const inkC = css.getPropertyValue("--color-text").trim() || "#201e1d";
        const acc = css.getPropertyValue("--color-accent").trim() || "#ec3013";
        ctx.clearRect(0, 0, w, h);
        let energy = 0;
        for (const p of pts) {
          let ax = (p.ox - p.x) * 0.07, ay = (p.oy - p.y) * 0.07;
          const dx = p.x - P.x, dy = p.y - P.y, d = Math.hypot(dx, dy);
          if (d < 80 && d > 0.1) { const f = ((80 - d) / 80) * 2.4; ax += (dx / d) * f; ay += (dy / d) * f; }
          p.vx = (p.vx + ax) * 0.8; p.vy = (p.vy + ay) * 0.8; p.x += p.vx; p.y += p.vy;
          const off = Math.abs(p.x - p.ox) + Math.abs(p.y - p.oy);
          energy += off + Math.abs(p.vx);
          ctx.fillStyle = off > 3 ? acc : inkC;
          const s = off > 3 ? 4 : 2;
          ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        }
        dotRaf = energy > 2 || P.x > -900 ? requestAnimationFrame(draw) : 0;
      };
      const wake = () => { if (!dotRaf) dotRaf = requestAnimationFrame(draw); };
      cv.onpointermove = (e) => { const r = cv.getBoundingClientRect(); P.x = e.clientX - r.left; P.y = e.clientY - r.top; wake(); };
      cv.onpointerleave = () => { P.x = -999; P.y = -999; wake(); };
      cancelAnimationFrame(dotRaf); dotRaf = 0; draw();
    }
    initDots();
    onScroll();
    console.log("%cMOHAMMED ADEBAYO", "font:800 28px Archivo,sans-serif;color:#ec3013", '\nCurious? Good. Try typing "sudo" anywhere on the page — or press ⌘K.');

    return () => {
      offs.forEach((f) => f());
      clearTimeout(fallback); clearTimeout(rz); clearInterval(clock);
      cancelAnimationFrame(raf); cancelAnimationFrame(dotRaf); cancelAnimationFrame(sq);
      document.body.style.overflow = "";
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only; live values go through refs
  }, []);

  const runCmdRef = useRef(runCmd);
  runCmdRef.current = runCmd;

  useEffect(() => { if (pal) setTimeout(() => palInputRef.current?.focus(), 30); }, [pal]);
  useEffect(() => {
    document.body.style.overflow = pal || open !== null || art !== null ? "hidden" : "";
  }, [pal, open, art]);

  /* ---------- derived ---------- */
  const wide = !narrow;
  const curOn = fine && !narrow;
  const gridCols = narrow ? 4 : 12;
  const cols = Array.from({ length: gridCols }, (_, i) => i);
  const rowCols = wide ? "56px minmax(0,1fr) minmax(140px,220px) 56px 28px" : "36px minmax(0,1fr)";
  const pv = projects[hover ?? 0] ?? projects[0];
  const listed = showAll ? projects : projects.slice(0, FEATURED_COUNT);
  const years = projects.map((p) => +p.year).filter(Boolean);
  const nProj = projects.length;
  const workIntro = `${nProj > FEATURED_COUNT && !showAll ? `${FEATURED_COUNT} selected of ${nProj}` : `${nProj}${nProj > FEATURED_COUNT ? " builds" : " selected builds"}`}${years.length ? `, ${Math.min(...years)} — ${Math.max(...years)}` : ""}. Hover to preview, open one for the full case study.`;
  const artCols = wide ? "56px minmax(0,1fr) 120px 160px" : "36px minmax(0,1fr)";
  const sorted = order.every((v, i) => v === i);
  const conn = new Set<string>();
  if (tool) for (const [a, b] of EDGES) { if (a === tool) conn.add(b); if (b === tool) conn.add(a); }
  const toolCur = TOOLS.find((t) => t.k === tool);

  const startToolDrag = (k: string) => (e: RPointerEvent) => {
    const f = fieldRef.current;
    if (!f) return;
    e.preventDefault();
    m.current.drag = { k, rect: f.getBoundingClientRect() };
    setTool(k);
  };
  const trackDown = (e: RPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if ((e.target as Element).closest("input,button,canvas,a,label")) return;
    const tr = trackRef.current;
    if (!tr) return;
    m.current.tdrag = { x: e.clientX, sl: tr.scrollLeft };
    setDragging(true);
  };

  const hl = (word: string) =>
    word.split("").map((c, i) => (
      <span key={`${word}-${i}`} data-hl="1" style={{ display: "inline-block", transform: "translateY(110%)", transition: `transform 1s ${EASE}` }}>{c}</span>
    ));

  return (
    <div ref={rootRef} className="mod" data-cur={curOn ? "on" : "off"} id="top-root">
      {/* column grid */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, padding: `0 ${PAD_X}` }}>
        <div style={{ height: "100%", display: "grid", gridTemplateColumns: `repeat(${gridCols},minmax(0,1fr))`, borderRight: "1px solid color-mix(in srgb,var(--color-text) 7%,transparent)" }}>
          {cols.map((c) => <div key={c} style={{ borderLeft: "1px solid color-mix(in srgb,var(--color-text) 7%,transparent)" }} />)}
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: PAD_X, right: PAD_X, display: "grid", gridTemplateColumns: `repeat(${gridCols},minmax(0,1fr))`, WebkitMaskImage: "radial-gradient(circle 260px at var(--mx,-999px) var(--my,-999px),#000,transparent)", maskImage: "radial-gradient(circle 260px at var(--mx,-999px) var(--my,-999px),#000,transparent)" }}>
          {cols.map((c) => <div key={c} style={{ borderLeft: "1px solid color-mix(in srgb,var(--color-accent) 60%,transparent)" }} />)}
        </div>
      </div>

      {/* loader */}
      <div ref={loaderRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 2000, background: "var(--color-text)", color: "var(--color-bg)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: PAD_X, transition: "transform .9s cubic-bezier(.76,0,.24,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" }}>
          <span ref={loaderNameRef}>MOHAMMED.ADEBAYO</span><span>Portfolio — 2026</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div ref={loaderNumRef} style={{ fontWeight: 800, fontSize: "clamp(120px,24vw,380px)", lineHeight: 0.78, fontStretch: "72%", fontVariantNumeric: "tabular-nums", letterSpacing: "-.03em" }}>00</div>
          <div style={{ width: "clamp(140px,26vw,380px)", height: 2, background: "color-mix(in srgb,var(--color-bg) 25%,transparent)" }}>
            <div ref={loaderBarRef} style={{ height: "100%", background: "var(--color-accent)", transformOrigin: "left", transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>

      {/* header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 900, padding: `0 ${PAD_X}`, background: scrolled ? "var(--color-bg)" : "transparent", borderBottom: `2px solid ${scrolled ? "var(--color-divider)" : "transparent"}`, transition: "background .4s,border-color .4s" }}>
        <nav aria-label="Primary" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", height: scrolled ? 56 : 76, transition: `height .4s ${EASE}` }}>
          <a href="#top" onClick={(e) => { e.preventDefault(); go("top"); }} style={{ marginRight: "auto", display: "flex", alignItems: "baseline", gap: 12, textDecoration: "none", color: "var(--color-text)", fontWeight: 800, fontSize: 16, letterSpacing: ".04em" }}>
            MOHAMMED
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-accent)", opacity: scrolled && SEC_LABEL[section] ? 1 : 0, transform: `translateY(${scrolled && SEC_LABEL[section] ? 0 : 6}px)`, transition: "opacity .4s,transform .4s", whiteSpace: "nowrap" }}>{SEC_LABEL[section] ?? ""}</span>
          </a>
          {wide && (
            <div style={{ display: "flex", gap: "var(--space-6)" }}>
              {SECTIONS.map(([id, label, num]) => (
                <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }} style={{ display: "flex", gap: 6, alignItems: "baseline", textDecoration: "none", fontSize: 12, fontWeight: 800, letterSpacing: ".1em", color: section === id ? "var(--color-accent)" : "var(--color-text)", transition: "color .3s" }}>
                  <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.55 }}>{num}</span>{label}
                </a>
              ))}
            </div>
          )}
          <button type="button" className="btn btn-secondary" data-magnetic="1" onClick={() => { setPal(true); setQ(""); setSel(0); }} style={{ fontSize: 12, letterSpacing: ".08em", transition: `transform .35s ${EASE},background .2s` }}>{narrow ? "MENU" : "⌘K"}</button>
        </nav>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -2, height: 2 }}>
          <div ref={progRef} style={{ height: "100%", background: "var(--color-accent)", transformOrigin: "left", transform: "scaleX(0)" }} />
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* hero */}
        <section id="top" ref={heroRef} style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "clamp(24px,4vw,44px)", padding: `120px ${PAD_X} 32px` }}>
          <div style={{ ...KICKER, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "8px 24px" }}>
            <span>(00) Index</span><span>Portfolio / 2026</span><span>Frontend · UI · Product · Performance</span>
            <span style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span style={{ color: "var(--color-accent-700)" }}>wdth <span data-axis-s="1">100</span>% · wght <span data-axis-w="1">800</span></span>
              <span><span data-fps="1">60</span> FPS — live</span>
            </span>
          </div>
          <h1 aria-label="Mohammed Adebayo" style={{ margin: 0, fontSize: "clamp(52px,13.6vw,280px)", lineHeight: 0.84, letterSpacing: "-.02em", fontWeight: 800, textTransform: "uppercase" }}>
            <span aria-hidden="true" style={{ display: "block", clipPath: "inset(0 -1em 0 -0.2em)", padding: ".02em 0 .04em", whiteSpace: "nowrap" }}>{hl("MOHAMMED")}</span>
            <span aria-hidden="true" style={{ display: "block", clipPath: "inset(0 -1em 0 -0.2em)", padding: ".02em 0 .04em", whiteSpace: "nowrap" }}>{hl("ADEBAYO")}</span>
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6) var(--space-8)", borderTop: "2px solid var(--color-divider)", paddingTop: "var(--space-4)" }}>
            <div style={{ flex: "2 1 380px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              <p style={{ margin: 0, fontSize: "clamp(22px,2.4vw,36px)", lineHeight: 1.12, fontWeight: 600, letterSpacing: "-.015em", maxWidth: "22ch", textWrap: "pretty" }}>Frontend engineer building digital products where engineering meets experience.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
                <a className="btn btn-primary" href="#work" onClick={(e) => { e.preventDefault(); go("work"); }} data-magnetic="1" style={{ fontSize: 15, padding: "14px 18px", minWidth: 220, justifyContent: "flex-start", gap: 12, transition: `transform .35s ${EASE},background .2s` }}>
                  View selected work
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" style={{ marginLeft: "auto" }} aria-hidden="true"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
                </a>
                <button type="button" className="btn btn-secondary" onClick={() => { setPal(true); setQ(""); setSel(0); }} data-magnetic="1" style={{ fontSize: 15, padding: "14px 18px", justifyContent: "flex-start", gap: 12, transition: `transform .35s ${EASE},background .2s` }}>
                  Command palette <span style={{ fontSize: 12, opacity: 0.6 }}>⌘K</span>
                </button>
              </div>
            </div>
            <div style={{ flex: "3 1 480px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", alignSelf: "end" }}>
              {[
                <><span style={{ ...SMALL_CAP, opacity: 0.6 }}>Status</span><span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 15 }}><span data-blink="1" style={{ width: 10, height: 10, background: "var(--color-accent)", transition: "opacity .4s" }} />Available for work</span></>,
                <><span style={{ ...SMALL_CAP, opacity: 0.6 }}>Base</span><span style={{ fontWeight: 800, fontSize: 15 }}>Nigeria — Remote</span><span style={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}><span data-clock="1">--:--:--</span> WAT</span></>,
                <><span style={{ ...SMALL_CAP, opacity: 0.6 }}>Currently</span><span style={{ fontWeight: 800, fontSize: 15 }}>Frontend Lead @ Summitech</span><span style={{ fontSize: 13 }}>2021 — Present</span></>,
              ].map((c, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static
                <div key={i} style={{ borderLeft: "2px solid var(--color-divider)", padding: "0 var(--space-4)", display: "flex", flexDirection: "column", gap: 6 }}>{c}</div>
              ))}
            </div>
          </div>
        </section>

        {/* work */}
        <section id="work" style={{ padding: `clamp(80px,10vw,140px) ${PAD_X} 0` }}>
          <SectionHead n="01" title="Work" blurb={workIntro} mb="clamp(24px,4vw,48px)" />
          <div onMouseLeave={() => setHover(null)} style={{ borderBottom: "2px solid var(--color-divider)" }}>
            {listed.map((p, i) => {
              const on = hover === i;
              const stackStr = p.stack.join(", ");
              return (
                <article key={p.key} role="button" tabIndex={0} aria-label={`Open case study: ${p.name}`} data-cursor="VIEW"
                  onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onClick={() => openCase(i)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCase(i); } }}
                  style={{ display: "grid", gridTemplateColumns: rowCols, alignItems: "baseline", columnGap: "var(--space-4)", padding: "clamp(18px,2.2vw,30px) var(--space-3)", borderTop: "2px solid var(--color-divider)", background: on ? "var(--color-accent)" : "transparent", color: on ? "var(--color-neutral-100)" : "var(--color-text)", transition: "background .35s,color .35s", cursor: "pointer" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".08em", fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: "clamp(40px,7.2vw,116px)", lineHeight: 0.88, letterSpacing: "-.02em", textTransform: "uppercase", fontStretch: on && wide ? "122%" : "100%", transition: `font-stretch .6s ${EASE}`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "clip" }}>{p.name}</h3>
                    <div style={{ display: "grid", gridTemplateRows: on && wide ? "1fr" : "0fr", transition: `grid-template-rows .5s ${EASE}` }}>
                      <div style={{ overflow: "hidden" }}><p style={{ margin: 0, paddingTop: 12, fontSize: 15, maxWidth: "58ch", textWrap: "pretty" }}>{p.built}</p></div>
                    </div>
                    {narrow && <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>{p.year} · {stackStr}</div>}
                  </div>
                  {wide && (
                    <>
                      <span style={{ fontSize: 13, fontWeight: 600, textWrap: "pretty" }}>{stackStr}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{p.year}</span>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" style={{ justifySelf: "end", transform: `rotate(${on ? 45 : 0}deg)`, transition: `transform .4s ${EASE}` }} aria-hidden="true"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
                    </>
                  )}
                </article>
              );
            })}
          </div>
          {projects.length > FEATURED_COUNT && (
            <button type="button" className="btn btn-secondary" onClick={() => { setShowAll((v) => !v); setHover(null); }} style={{ marginTop: "var(--space-4)", minWidth: 260, justifyContent: "flex-start", padding: "14px 18px", fontSize: 15 }}>
              {showAll ? "Show selected only" : `Show all ${projects.length} projects`}
            </button>
          )}
        </section>

        {/* hover preview */}
        {fine && wide && pv && (
          <div ref={previewRef} aria-hidden="true" style={{ position: "fixed", left: 0, top: 0, zIndex: 800, width: "clamp(260px,24vw,400px)", aspectRatio: "4/3", pointerEvents: "none", opacity: hover != null ? 1 : 0, transition: "opacity .3s", willChange: "transform" }}>
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 16, backgroundColor: "var(--color-text)", color: "var(--color-bg)", backgroundImage: "repeating-linear-gradient(135deg,transparent 0 14px,color-mix(in srgb,var(--color-bg) 9%,transparent) 14px 15px)", boxShadow: "var(--shadow-lg)" }}>
              <div style={{ ...SMALL_CAP, display: "flex", justifyContent: "space-between" }}><span>{String(projects.indexOf(pv) + 1).padStart(2, "0")} — {pv.year}</span><span style={{ color: "var(--color-accent-400)" }}>Preview</span></div>
              <div style={{ fontSize: "clamp(32px,3.4vw,52px)", fontWeight: 800, lineHeight: 0.9, textTransform: "uppercase", fontStretch: "115%" }}>{pv.name}</div>
              <div style={{ fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", opacity: 0.7 }}>{pv.stack.join(" · ")}</div>
            </div>
          </div>
        )}

        {/* about */}
        <section id="about" style={{ padding: `clamp(100px,12vw,180px) ${PAD_X} 0` }}>
          <SectionHead n="02" title="About" blurb="How I build — four lenses I bring to every product." />
          <p data-reveal="1" style={{ margin: "clamp(48px,7vw,96px) 0", fontSize: "clamp(40px,7vw,120px)", lineHeight: 0.92, fontWeight: 800, letterSpacing: "-.03em", maxWidth: "13ch", textWrap: "balance" }}>
            5+ years turning ideas into <span style={{ color: "var(--color-accent)" }}>interfaces.</span>
          </p>
          <div data-reveal="1" style={{ display: "flex", flexDirection: wide ? "row" : "column", borderTop: "2px solid var(--color-divider)", borderBottom: "2px solid var(--color-divider)", borderRight: "2px solid var(--color-divider)" }}>
            {ABOUT.map((a, i) => {
              const on = about === i;
              return (
                <div key={a.t} role="button" tabIndex={0} aria-expanded={on} onMouseEnter={() => setAbout(i)} onClick={() => setAbout(i)} onFocus={() => setAbout(i)}
                  style={{ flex: on ? "3.2 1 0%" : "1 1 0%", minWidth: 0, borderLeft: "2px solid var(--color-divider)", borderTop: wide || i === 0 ? 0 : "2px solid var(--color-divider)", padding: "var(--space-6) var(--space-4)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "var(--space-6)", minHeight: wide ? 480 : 0, background: on ? "var(--color-surface)" : "transparent", overflow: "hidden", cursor: "pointer", transition: `flex .7s ${EASE},background .4s` }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".1em", color: on ? "var(--color-accent)" : "var(--color-text)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 style={{ margin: 0, fontSize: "clamp(26px,3vw,48px)", lineHeight: 0.9, textTransform: "uppercase", fontStretch: on ? "112%" : wide ? "64%" : "90%", whiteSpace: "nowrap", transition: `font-stretch .7s ${EASE}` }}>{a.t}</h3>
                  </div>
                  <div style={{ display: "grid", gridTemplateRows: on || wide ? "1fr" : "0fr", opacity: on ? 1 : 0, transition: "opacity .5s,grid-template-rows .5s" }}>
                    <div style={{ overflow: "hidden", width: wide ? "clamp(300px,34vw,520px)" : "auto" }}>
                      <p style={{ margin: "0 0 var(--space-3)", fontSize: "clamp(20px,1.8vw,26px)", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-.01em" }}>{a.lead}</p>
                      <p style={{ margin: "0 0 var(--space-4)", fontSize: 15, maxWidth: "46ch", textWrap: "pretty" }}>{a.body}</p>
                      <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid var(--color-divider)" }}>
                        {a.pts.map((pt) => <span key={pt} style={{ padding: "8px 0", borderBottom: "1px solid var(--color-divider)", fontSize: 13, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>{pt}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* experience */}
        <section id="experience" style={{ padding: `clamp(100px,12vw,180px) ${PAD_X} 0` }}>
          <SectionHead n="03" title="Experience" blurb="2020 — now. Move through the timeline; the year follows you." mb="clamp(32px,5vw,64px)" h2={{ fontSize: "clamp(56px,10.4vw,200px)" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-8)", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 340px", position: wide ? "sticky" : "relative", top: 110, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div aria-live="polite" style={{ fontSize: "clamp(72px,10vw,176px)", height: "1em", lineHeight: 1, overflow: "hidden", fontWeight: 800, fontStretch: "68%", letterSpacing: "-.03em", color: "var(--color-accent)", fontVariantNumeric: "tabular-nums" }}>
                <div style={{ transform: `translateY(${-exp}em)`, transition: `transform .8s ${EASE}` }}>
                  {EXP.map((e) => <div key={e.co} style={{ height: "1em" }}>{e.year}</div>)}
                </div>
              </div>
              <div style={{ borderTop: "2px solid var(--color-divider)", paddingTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <span style={{ fontSize: 20, fontWeight: 800 }}>{EXP[exp].role} <span style={{ color: "var(--color-accent-700)" }}>@ {EXP[exp].co}</span></span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {EXP[exp].tech.map((t) => <span key={t} className="tag tag-accent" style={{ fontWeight: 600 }}>{t}</span>)}
                </div>
              </div>
            </div>
            <div style={{ flex: "1.5 1 480px", minWidth: 0 }}>
              {EXP.map((e, i) => {
                const on = exp === i;
                return (
                  <div key={e.co} role="button" tabIndex={0} aria-expanded={on} onMouseEnter={() => setExp(i)} onClick={() => setExp(i)} onFocus={() => setExp(i)} style={{ display: "grid", gridTemplateColumns: "20px minmax(0,1fr)", columnGap: "var(--space-4)", cursor: "pointer" }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 2, background: "var(--color-divider)" }} />
                      <div style={{ position: "absolute", left: 2, top: 36, width: 14, height: 14, background: on ? "var(--color-accent)" : "var(--color-bg)", border: `2px solid ${on ? "var(--color-accent)" : "var(--color-text)"}`, transition: "background .3s,border-color .3s" }} />
                    </div>
                    <div style={{ borderTop: "2px solid var(--color-divider)", padding: "var(--space-6) 0" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "8px 16px" }}>
                        <h3 style={{ margin: 0, fontSize: "clamp(32px,4.6vw,72px)", lineHeight: 0.9, textTransform: "uppercase", fontStretch: on ? "118%" : "92%", color: on ? "var(--color-text)" : "color-mix(in srgb, var(--color-text) 55%, transparent)", transition: `font-stretch .6s ${EASE},color .3s` }}>{e.co}</h3>
                        <span style={{ fontSize: 14, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{e.period}</span>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 13, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.7 }}>{e.role}</div>
                      <div style={{ display: "grid", gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0, transition: `grid-template-rows .55s ${EASE},opacity .4s` }}>
                        <div style={{ overflow: "hidden" }}><p style={{ margin: "var(--space-4) 0", fontSize: 16, maxWidth: "56ch", textWrap: "pretty" }}>{e.text}</p></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* toolbox */}
        <section id="toolbox" style={{ padding: `clamp(100px,12vw,180px) ${PAD_X} 0` }}>
          <SectionHead n="04" title="Toolbox" blurb="Not a list — a system. Hover a tool to see what it connects to. Drag to rearrange." mb="clamp(32px,5vw,56px)" />
          <div data-reveal="1" ref={fieldRef} style={{ position: "relative", height: "clamp(480px,52vw,640px)", border: "2px solid var(--color-divider)", background: "color-mix(in srgb,var(--color-surface) 60%,transparent)", overflow: "hidden" }}>
            <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              {EDGES.map(([a, b]) => {
                const A = nodes[a], B = nodes[b], hot = tool && (a === tool || b === tool);
                return <line key={`${a}-${b}`} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={hot ? "var(--color-accent)" : "color-mix(in srgb, var(--color-text) 28%, transparent)"} strokeWidth={hot ? 2 : 1} vectorEffect="non-scaling-stroke" />;
              })}
            </svg>
            {TOOLS.map((t) => {
              const pos = nodes[t.k], act = tool === t.k, rel = conn.has(t.k);
              return (
                <button type="button" key={t.k} data-cursor="DRAG" onPointerDown={startToolDrag(t.k)} onMouseEnter={() => setTool(t.k)} onFocus={() => setTool(t.k)} onMouseLeave={() => { if (!m.current.drag) setTool(null); }}
                  style={{ position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)", touchAction: "none", userSelect: "none", padding: t.big ? (narrow ? "8px 12px" : "12px 18px") : (narrow ? "6px 8px" : "8px 12px"), border: `2px solid ${act ? "var(--color-accent)" : "var(--color-text)"}`, background: act ? "var(--color-accent)" : rel ? "var(--color-text)" : "var(--color-bg)", color: act || rel ? "var(--color-bg)" : "var(--color-text)", fontFamily: "inherit", fontWeight: 800, fontSize: t.big ? (narrow ? 14 : 18) : (narrow ? 11 : 13), letterSpacing: ".04em", textTransform: "uppercase", whiteSpace: "nowrap", opacity: !tool || act || rel ? 1 : 0.35, transition: "background .25s,color .25s,opacity .25s,border-color .25s" }}>{t.label}</button>
              );
            })}
            <div style={{ position: "absolute", left: 16, bottom: 16, width: "min(340px,calc(100% - 32px))", background: "var(--color-bg)", border: "2px solid var(--color-text)", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: 6, pointerEvents: "none" }}>
              <span style={{ ...SMALL_CAP, color: "var(--color-accent-700)" }}>{toolCur ? "Selected" : `Toolbox — ${TOOLS.length} tools`}</span>
              <span style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, textTransform: "uppercase", fontStretch: "110%" }}>{toolCur ? toolCur.label : "Hover a node"}</span>
              <span style={{ fontSize: 14, textWrap: "pretty" }}>{toolCur ? toolCur.desc : "Lines show how the tools work together in practice. Everything is draggable."}</span>
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>{toolCur?.used ? `Used at — ${toolCur.used}` : ""}</span>
            </div>
          </div>
        </section>

        {/* lab */}
        <section id="lab" style={{ padding: "clamp(100px,12vw,180px) 0 0" }}>
          <div style={{ padding: `0 ${PAD_X}` }}>
            <SectionHead n="05" title="The Lab" blurb="Small, live experiments. Drag the strip sideways →" />
            <p data-reveal="1" style={{ margin: "clamp(40px,6vw,80px) 0", fontSize: "clamp(28px,3.6vw,56px)", lineHeight: 1.02, fontWeight: 800, letterSpacing: "-.02em", maxWidth: "22ch", textWrap: "balance" }}>I don't just build assigned features. I like finding out what the browser can do.</p>
          </div>
          <div ref={trackRef} data-cursor="DRAG" onPointerDown={trackDown} style={{ display: "flex", overflowX: "auto", scrollSnapType: dragging ? "none" : "x mandatory", borderTop: "2px solid var(--color-divider)", borderBottom: "2px solid var(--color-divider)", paddingLeft: PAD_X, scrollbarWidth: "none", touchAction: "pan-x pan-y" }}>
            {(() => {
              const card: CSSProperties = { flex: "0 0 clamp(300px,34vw,480px)", scrollSnapAlign: "start", borderLeft: "2px solid var(--color-divider)", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)", minHeight: 480 };
              const head = (l: string, r: React.ReactNode) => <div style={{ ...SMALL_CAP, display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-accent-700)" }}>{l}</span>{r}</div>;
              const range: CSSProperties = { ...{ display: "flex", flexDirection: "column", gap: 4 }, fontSize: 12, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" };
              return (
                <>
                  <article style={card}>
                    {head("L — 01", <span>Variable fonts</span>)}
                    <h3 style={{ margin: 0, fontSize: 28, textTransform: "uppercase" }}>Elastic type</h3>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden", minHeight: 140 }}>
                      <span style={{ fontSize: "clamp(52px,6vw,92px)", lineHeight: 1, textTransform: "uppercase", fontStretch: `${labW}%`, fontWeight: labWg }}>Elastic</span>
                    </div>
                    <label style={range}>font-stretch — {labW}%<input type="range" min={62} max={125} value={labW} onChange={(e) => setLabW(+e.target.value)} style={{ width: "100%", accentColor: "var(--color-accent)" }} /></label>
                    <label style={range}>font-weight — {labWg}<input type="range" min={100} max={900} step={10} value={labWg} onChange={(e) => setLabWg(+e.target.value)} style={{ width: "100%", accentColor: "var(--color-accent)" }} /></label>
                    <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>The axis behind the hero: one font file, every width and weight in between.</p>
                  </article>
                  <article style={card}>
                    {head("L — 02", <span>Canvas · Springs</span>)}
                    <h3 style={{ margin: 0, fontSize: 28, textTransform: "uppercase" }}>Repel field</h3>
                    <div data-cursor="MOVE" style={{ flex: 1, minHeight: 260, position: "relative", border: "2px solid var(--color-divider)" }}>
                      <canvas ref={dotRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "none" }} />
                    </div>
                    <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>Spring physics on a 2D canvas. The loop sleeps when the field is at rest — zero idle cost.</p>
                  </article>
                  <article style={card}>
                    {head("L — 03", <span>Layout animation</span>)}
                    <h3 style={{ margin: 0, fontSize: 28, textTransform: "uppercase" }}>Process, reordered</h3>
                    <div style={{ flex: 1, position: "relative", minHeight: 276 }}>
                      {STEPS.map((label, i) => {
                        const pos = order.indexOf(i), ok = pos === i;
                        return (
                          <div key={label} style={{ position: "absolute", left: 0, right: 0, top: 0, height: 48, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", border: `2px solid ${ok ? "var(--color-text)" : "var(--color-accent)"}`, background: ok ? "var(--color-surface)" : "var(--color-accent-100)", transform: `translateY(${pos * 56}px)`, transition: "transform .65s cubic-bezier(.2,.9,.2,1),background .3s", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".04em" }}>
                            <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.6 }}>{String(i + 1).padStart(2, "0")}</span>{label}
                          </div>
                        );
                      })}
                    </div>
                    <button type="button" className="btn btn-primary" style={{ justifyContent: "flex-start", padding: "12px 14px" }} onClick={() => {
                      if (!sorted) return setOrder([0, 1, 2, 3, 4]);
                      let o: number[];
                      do { o = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5); } while (o.every((v, i) => v === i));
                      setOrder(o);
                    }}>{sorted ? "Shuffle the process" : "Put it back in order"}</button>
                    <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>Transform-only reordering: no layout recalculation, compositor all the way.</p>
                  </article>
                  <article style={{ ...card, borderRight: "2px solid var(--color-divider)", marginRight: PAD_X }}>
                    {head("L — 04", <span className="tag tag-outline">Placeholder</span>)}
                    <h3 style={{ margin: 0, fontSize: 28, textTransform: "uppercase" }}>Next experiment</h3>
                    <div style={{ flex: 1, border: "2px dashed var(--color-accent)", display: "flex", alignItems: "flex-end", padding: "var(--space-4)", fontSize: 14 }}>Reserved for the next experiment — WebGL, an AI tool, a CSS study.</div>
                  </article>
                </>
              );
            })()}
          </div>
        </section>

        {/* writing */}
        <section id="writing" style={{ padding: `clamp(100px,12vw,180px) ${PAD_X} 0` }}>
          <SectionHead n="06" title="Writing" blurb="Notes on frontend engineering, interface details and building products." mb="clamp(32px,5vw,56px)" />
          <div data-reveal="1" style={{ borderBottom: "2px solid var(--color-divider)" }}>
            {articles.length === 0 && (
              <div style={{ borderTop: "2px solid var(--color-divider)", padding: "clamp(18px,2vw,26px) 0", fontSize: 15, opacity: 0.7 }}>No articles published yet.</div>
            )}
            {articles.map((a, i) => (
              <a key={a.key} className="m-art" href={a.href ?? "#writing"} {...(a.href ? { target: "_blank", rel: "noopener noreferrer" } : {})} data-cursor={a.href ? "↗" : "READ"}
                onClick={(e) => { if (a.href) return; e.preventDefault(); openArticle(i); }}
                style={{ display: "grid", gridTemplateColumns: artCols, alignItems: "baseline", columnGap: "var(--space-4)", rowGap: 6, padding: "clamp(18px,2vw,26px) 0", borderTop: "2px solid var(--color-divider)", color: "var(--color-text)", textDecoration: "none" }}>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".08em", fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: "clamp(22px,2.6vw,40px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.015em", textWrap: "pretty" }}>{a.title}</span>
                {a.date ? <span className="tag tag-outline" style={{ justifySelf: "start" }}>{fmtDate(a.date)}</span> : <span />}
                <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{[a.meta, a.readTime].filter(Boolean).join(" · ")}</span>
              </a>
            ))}
          </div>
        </section>

        {/* contact */}
        <section id="contact" style={{ marginTop: "clamp(100px,12vw,180px)", background: "var(--color-accent)", color: "var(--color-neutral-100)", padding: `clamp(80px,10vw,140px) ${PAD_X} clamp(32px,4vw,56px)` }}>
          <div style={{ ...KICKER, display: "flex", justifyContent: "space-between", gap: 16, borderTop: "2px solid var(--color-neutral-900)", paddingTop: "var(--space-4)", color: "var(--color-neutral-900)" }}><span>(07) Contact</span><span>Response within a few days</span></div>
          <h2 style={{ margin: "clamp(32px,5vw,64px) 0", fontSize: "clamp(52px,12.4vw,236px)", lineHeight: 0.84, letterSpacing: "-.035em", textTransform: "uppercase" }}>
            {["Let's build", "something", "worth using."].map((l, i) => (
              <span key={l} data-line="1" style={{ display: "block", overflow: "hidden" }}><span style={{ display: "block", color: i === 2 ? "var(--color-neutral-900)" : undefined }}>{l}</span></span>
            ))}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6) var(--space-8)", alignItems: "flex-end", marginBottom: "clamp(40px,6vw,72px)" }}>
            <p style={{ flex: "1 1 320px", margin: 0, fontSize: "clamp(20px,2vw,28px)", lineHeight: 1.2, fontWeight: 600, color: "var(--color-neutral-900)", maxWidth: "28ch" }}>Available for interesting products, frontend engineering roles and collaborations.</p>
            <button type="button" className="m-copy" data-cursor="COPY" data-magnetic="1" onClick={copyEmail} style={{ flex: "1.4 1 420px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "clamp(18px,2vw,28px)", border: 0, background: "var(--color-neutral-900)", color: "var(--color-neutral-100)", fontFamily: "inherit", textAlign: "left", cursor: "pointer", transition: `transform .35s ${EASE},background .2s` }}>
              <span style={{ fontSize: "clamp(18px,2.2vw,32px)", fontWeight: 800, letterSpacing: "-.01em", overflowWrap: "anywhere" }}>{EMAIL}</span>
              <span style={{ flex: "none", ...SMALL_CAP, fontSize: 12, fontWeight: 800, color: copied ? "var(--color-accent-400)" : "var(--color-neutral-400)" }}>{copied ? "Copied ✓" : "Copy"}</span>
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", borderTop: "2px solid var(--color-neutral-900)" }}>
            {SOCIAL.map((s) => (
              <a key={s.label} className="m-soc" href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="↗" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "var(--space-4) var(--space-4) var(--space-6) 0", borderBottom: "2px solid var(--color-neutral-900)", color: "var(--color-neutral-100)", textDecoration: "none" }}>
                <span style={{ ...KICKER, color: "var(--color-neutral-900)" }}>{s.label} ↗</span>
                <span style={{ fontSize: "clamp(20px,2vw,28px)", fontWeight: 800 }}>{s.handle}</span>
              </a>
            ))}
          </div>
        </section>

        <footer style={{ padding: `clamp(32px,4vw,56px) ${PAD_X}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "var(--space-6)", borderTop: "2px solid var(--color-divider)", paddingTop: "var(--space-4)", fontSize: 13 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}><span style={{ fontWeight: 800, fontSize: 15, letterSpacing: ".04em" }}>MOHAMMED ADEBAYO</span><span>Frontend Developer</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}><span style={{ ...SMALL_CAP, opacity: 0.6 }}>Built with</span><span>Next.js + React + TypeScript</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}><span style={{ ...SMALL_CAP, opacity: 0.6 }}>Local time — Nigeria</span><span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 800 }}><span data-clock="1">--:--:--</span> WAT</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", alignContent: "flex-start" }}>
              {SOCIAL.map((s) => <a key={s.label} className="m-flink" href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="↗" style={{ color: "var(--color-text)", fontWeight: 600, textDecoration: "none" }}>{s.label}</a>)}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginTop: "var(--space-8)", fontSize: 12, opacity: 0.65 }}><span>© 2026 Mohammed Adebayo</span><span>Psst — press ⌘K, or type “sudo” anywhere.</span></div>
        </footer>
      </main>

      <CaseStudyOverlay projects={projects} open={open} shown={shown} onClose={() => setOpen(null)} onOpen={openCase} scrollRef={csRef} />

      <ArticleReader articles={articles} open={art} shown={artShown} onClose={() => setArt(null)} onOpen={openArticle} scrollRef={arRef} />

      {/* command palette */}
      {pal && (
        <div className="dialog-backdrop" onClick={() => setPal(false)} style={{ zIndex: 1800, placeItems: "start center", paddingTop: "14vh" }}>
          <div className="dialog" role="dialog" aria-label="Command palette" onClick={(e) => e.stopPropagation()} style={{ width: "min(580px,100%)", padding: 0, gap: 0, background: "var(--color-bg)", border: "2px solid var(--color-text)" }}>
            <input ref={palInputRef} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} placeholder="Jump to a section, open a project, run a command…" aria-label="Command" style={{ border: 0, borderBottom: "2px solid var(--color-divider)", background: "transparent", color: "inherit", font: "inherit", fontSize: 18, padding: "18px 16px", width: "100%" }} />
            <div role="listbox" style={{ maxHeight: "52vh", overflowY: "auto", padding: "6px 0" }}>
              {cmds.map((c, i) => (
                <button type="button" key={c.label} role="option" aria-selected={i === sel} onClick={() => runCmd(c)} onMouseEnter={() => { if (sel !== i) setSel(i); }} style={{ display: "flex", justifyContent: "space-between", gap: 16, width: "100%", textAlign: "left", padding: "11px 16px", border: 0, background: i === sel ? "var(--color-accent)" : "transparent", color: i === sel ? "var(--color-neutral-100)" : "var(--color-text)", fontFamily: "inherit", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                  <span>{c.label}</span><span style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.7 }}>{c.hint}</span>
                </button>
              ))}
              {cmds.length === 0 && <div style={{ padding: 16, fontSize: 14, opacity: 0.7 }}>Nothing matches. Try “work”, “email” or “ink”.</div>}
            </div>
            <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderTop: "2px solid var(--color-divider)", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.65 }}><span>↑↓ Navigate</span><span>↵ Select</span><span>Esc Close</span></div>
          </div>
        </div>
      )}

      {/* view source */}
      {src && (
        <div className="dialog-backdrop" onClick={() => setSrc(false)} style={{ zIndex: 1800 }}>
          <div className="dialog" onClick={(e) => e.stopPropagation()} style={{ width: "min(640px,100%)", background: "var(--color-bg)", border: "2px solid var(--color-text)" }}>
            <div className="dialog-title" style={{ textTransform: "uppercase" }}>View source — the hero</div>
            <p className="dialog-body" style={{ margin: 0 }}>Every letter of the name is its own span. One requestAnimationFrame loop eases each toward a width and weight set by its distance from the cursor — written straight to the DOM, so React never re-renders.</p>
            <pre style={{ margin: 0, padding: 16, background: "var(--color-neutral-900)", color: "var(--color-neutral-100)", fontSize: 12, lineHeight: 1.6, overflowX: "auto" }}>{`for (const L of letters) {
  const d = Math.hypot((L.x - mx) / vw, (L.y - my) / vh * 0.7)
  const k = smoothstep(1 - d / 0.26)      // 0 far → 1 under cursor
  L.s += (88 + 37 * k  - L.s) * 0.14      // font-stretch %
  L.w += (600 + 300 * k - L.w) * 0.14     // font-weight
  if (changed(L)) L.el.style.fontStretch = L.s + '%'
}`}</pre>
            <div className="dialog-actions" style={{ justifyContent: "flex-start" }}><button type="button" className="btn btn-primary" onClick={() => setSrc(false)}>Close</button></div>
          </div>
        </div>
      )}

      {/* sudo terminal */}
      {sudoOpen && (
        <div role="status" style={{ position: "fixed", left: "clamp(16px,3vw,32px)", bottom: "clamp(16px,3vw,32px)", zIndex: 1700, width: "min(460px,calc(100vw - 32px))", background: "var(--color-neutral-900)", color: "var(--color-neutral-100)", border: "2px solid var(--color-accent)", boxShadow: "var(--shadow-lg)", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
          <div style={{ ...SMALL_CAP, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px 8px 16px", borderBottom: "2px solid var(--color-neutral-700)" }}>
            <span>visitor@muhbiy — zsh</span>
            <button type="button" onClick={() => setSudoOpen(false)} aria-label="Close terminal" style={{ border: 0, background: "transparent", color: "inherit", font: "inherit", fontSize: 16, cursor: "pointer", padding: "2px 6px" }}>×</button>
          </div>
          <div style={{ padding: "12px 0" }}>{sudoLines.map((l) => <div key={l} style={{ padding: "2px 16px" }}>{l}</div>)}</div>
          {sudoDone && (
            <div style={{ display: "flex", gap: 8, padding: "0 16px 16px" }}>
              <a className="btn btn-primary" href={`mailto:${EMAIL}`} style={{ justifyContent: "flex-start" }}>Write to Mohammed</a>
              <button type="button" className="btn" onClick={() => setSudoOpen(false)} style={{ color: "var(--color-neutral-100)", borderColor: "var(--color-neutral-700)" }}>exit</button>
            </div>
          )}
        </div>
      )}

      {/* custom cursor */}
      {curOn && (
        <div ref={curRef} aria-hidden="true" style={{ position: "fixed", left: 0, top: 0, zIndex: 3000, pointerEvents: "none", willChange: "transform", opacity: 0, transition: "opacity .2s" }}>
          <div ref={curInnerRef} style={{ transform: "translate(-50%,-50%)", width: 10, height: 10, background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", transition: `width .25s ${EASE},height .25s ${EASE},background .2s,border-color .2s`, border: "2px solid transparent", boxSizing: "border-box" }}>
            <span ref={curLabelRef} style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: "var(--color-neutral-100)", whiteSpace: "nowrap", opacity: 0, transition: "opacity .2s" }} />
          </div>
        </div>
      )}
    </div>
  );
}
