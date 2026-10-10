"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { type RefObject, useRef, useState } from "react";
import type { Article } from "./data";

export const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

const body: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      let src: string | undefined;
      try { src = urlFor(value)?.width(1400).url(); } catch {}
      if (!src) return null;
      return (
        <figure style={{ margin: 0 }}>
          {/* biome-ignore lint/performance/noImgElement: remote Sanity CDN image */}
          <img className="grayscale" src={src} alt={value?.alt ?? ""} style={{ width: "100%", border: "2px solid var(--color-divider)" }} />
          {value?.alt && <figcaption style={{ fontSize: 11, marginTop: 4, opacity: 0.6 }}>{value.alt}</figcaption>}
        </figure>
      );
    },
    code: ({ value }) => (
      <pre style={{ margin: 0, padding: "var(--space-4)", background: "var(--color-neutral-900)", color: "var(--color-neutral-100)", fontSize: 13, lineHeight: 1.6, overflowX: "auto" }}>
        <code>{value?.code}</code>
      </pre>
    ),
  },
  block: {
    normal: ({ children }) => <p style={{ margin: 0, fontSize: 18, lineHeight: 1.65 }}>{children}</p>,
    h1: ({ children }) => <h2 style={{ margin: "var(--space-4) 0 0", fontSize: "clamp(26px,2.6vw,36px)", textTransform: "uppercase" }}>{children}</h2>,
    h2: ({ children }) => <h2 style={{ margin: "var(--space-4) 0 0", fontSize: "clamp(26px,2.6vw,36px)", textTransform: "uppercase" }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ margin: "var(--space-3) 0 0", fontSize: "clamp(20px,2vw,28px)", textTransform: "uppercase" }}>{children}</h3>,
    h4: ({ children }) => <h4 style={{ margin: "var(--space-3) 0 0", fontSize: 20, textTransform: "uppercase" }}>{children}</h4>,
    blockquote: ({ children }) => <blockquote style={{ margin: 0, paddingLeft: "var(--space-4)", borderLeft: "2px solid var(--color-accent)", fontSize: "clamp(22px,2.2vw,30px)", lineHeight: 1.2, fontWeight: 800 }}>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul style={{ margin: 0, paddingLeft: 22, fontSize: 18, lineHeight: 1.65 }}>{children}</ul>,
    number: ({ children }) => <ol style={{ margin: 0, paddingLeft: 22, fontSize: 18, lineHeight: 1.65 }}>{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => <a href={value?.href} target="_blank" rel="noopener noreferrer">{children}</a>,
    code: ({ children }) => <code style={{ fontSize: "0.9em", padding: "1px 5px", background: "var(--color-surface)" }}>{children}</code>,
  },
};

export function ArticleReader({
  articles, open, shown, onClose, onOpen, scrollRef,
}: {
  articles: Article[];
  open: number | null;
  shown: number | null;
  onClose: () => void;
  onOpen: (i: number) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const progRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const n = articles.length;
  const a = shown == null ? null : articles[shown];
  const next = shown == null || n === 0 ? null : articles[(shown + 1) % n];

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget, m = el.scrollHeight - el.clientHeight;
    if (progRef.current) progRef.current.style.transform = `scaleX(${m > 0 ? el.scrollTop / m : 0})`;
  };
  const copy = () => {
    try { navigator.clipboard?.writeText(`${location.href.split("#")[0]}#writing`).catch(() => {}); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Article" aria-hidden={open == null} ref={scrollRef} onScroll={onScroll}
      style={{ position: "fixed", inset: 0, zIndex: 1500, background: "var(--color-bg)", color: "var(--color-text)", overflowY: "auto", transform: `translateY(${open == null ? "100%" : "0%"})`, visibility: open == null ? "hidden" : "visible", transition: "transform .85s cubic-bezier(.76,0,.24,1),visibility .85s" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--color-bg)", padding: "0 clamp(20px,4vw,56px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, height: 64 }}>
          <button type="button" className="btn btn-secondary" onClick={() => { onClose(); }} style={{ justifyContent: "flex-start" }}>← Back to writing <span style={{ opacity: 0.55, fontSize: 11 }}>ESC</span></button>
          {a && shown != null && <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" }}>{String(shown + 1).padStart(2, "0")} — {a.meta}</span>}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: "var(--color-divider)" }}>
          <div ref={progRef} style={{ height: "100%", background: "var(--color-accent)", transformOrigin: "left", transform: "scaleX(0)" }} />
        </div>
      </div>
      {a && next && shown != null && (
        <article style={{ padding: "clamp(48px,7vw,112px) clamp(20px,4vw,56px) clamp(64px,8vw,120px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-accent-700)" }}>
            <span>Writing / {a.meta}</span>
            {a.date && <span>{fmtDate(a.date)}</span>}
            {a.readTime && <span>{a.readTime}</span>}
          </div>
          <h1 style={{ margin: "var(--space-4) 0 clamp(40px,6vw,80px)", fontSize: "clamp(40px,7vw,112px)", lineHeight: 0.92, letterSpacing: "-.03em", maxWidth: "16ch", textWrap: "balance" }}>{a.title}</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-8)", borderTop: "2px solid var(--color-divider)", paddingTop: "var(--space-6)" }}>
            <aside style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "var(--space-3)", fontSize: 13 }}>
              <span style={{ fontWeight: 800, letterSpacing: ".04em" }}>{(a.author ?? "Mohammed Adebayo").toUpperCase()}</span>
              <span style={{ opacity: 0.7 }}>Frontend Developer Lead</span>
              <button type="button" className="btn btn-ghost" onClick={copy} style={{ justifyContent: "flex-start", alignSelf: "flex-start", paddingLeft: 0 }}>{copied ? "Link copied ✓" : "Copy link"}</button>
            </aside>
            <div style={{ flex: "3 1 520px", maxWidth: "68ch", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              {Array.isArray(a.content) && a.content.length > 0
                ? <PortableText value={a.content} components={body} />
                : <p style={{ margin: 0, fontSize: 18, lineHeight: 1.65, opacity: 0.7 }}>This article has no body yet.</p>}
            </div>
          </div>
          {n > 1 && (
            <button type="button" data-cursor="NEXT" className="m-flink" onClick={() => onOpen((shown + 1) % n)}
              style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, marginTop: "clamp(64px,8vw,120px)", padding: "var(--space-6) 0", border: 0, borderTop: "2px solid var(--color-divider)", background: "transparent", color: "var(--color-text)", fontFamily: "inherit", textAlign: "left", cursor: "pointer" }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" }}>Next article</span>
              <span style={{ fontSize: "clamp(28px,4vw,64px)", fontWeight: 800, lineHeight: 1, letterSpacing: "-.02em", maxWidth: "24ch" }}>{next.title} →</span>
            </button>
          )}
        </article>
      )}
    </div>
  );
}
