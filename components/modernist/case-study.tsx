"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { CSSProperties, ReactNode } from "react";
import type { Project } from "./data";

const LABEL: CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" };

const rich: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p style={{ margin: "0 0 var(--space-3)", fontSize: 17, maxWidth: "60ch", textWrap: "pretty" }}>{children}</p>,
    h3: ({ children }) => <h4 style={{ margin: "var(--space-4) 0 var(--space-2)", fontSize: 20, textTransform: "uppercase" }}>{children}</h4>,
    blockquote: ({ children }) => <blockquote style={{ margin: "0 0 var(--space-3)", paddingLeft: 16, borderLeft: "2px solid var(--color-accent)", fontSize: 17 }}>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul style={{ margin: "0 0 var(--space-3)", paddingLeft: 20, fontSize: 17 }}>{children}</ul>,
    number: ({ children }) => <ol style={{ margin: "0 0 var(--space-3)", paddingLeft: 20, fontSize: 17 }}>{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => <a href={value?.href} target="_blank" rel="noopener noreferrer">{children}</a>,
    code: ({ children }) => <code style={{ fontSize: "0.9em", padding: "1px 5px", background: "var(--color-surface)" }}>{children}</code>,
  },
};

const hasBlocks = (v?: PortableTextBlock[]) => Array.isArray(v) && v.length > 0;

function Row({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4) var(--space-8)", borderTop: "2px solid var(--color-divider)", padding: "var(--space-6) 0 clamp(40px,5vw,72px)" }}>
      <h3 style={{ flex: "1 1 280px", margin: 0, fontSize: "clamp(28px,3vw,44px)", textTransform: "uppercase", lineHeight: 0.95 }}>
        <span style={{ color: "var(--color-accent)" }}>{n}</span> — {title}
      </h3>
      <div style={{ flex: "2 1 420px", minWidth: 0 }}>{children}</div>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ padding: "var(--space-3) var(--space-4) var(--space-3) 0", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ ...LABEL, opacity: 0.6 }}>{label}</span>
      <span style={{ fontWeight: 800 }}>{children}</span>
    </div>
  );
}

export function CaseStudyOverlay({
  projects, open, shown, onClose, onOpen, scrollRef,
}: {
  projects: Project[];
  open: number | null;
  shown: number | null;
  onClose: () => void;
  onOpen: (i: number) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const n = projects.length;
  const p = shown == null ? null : projects[shown];
  const next = shown == null ? null : projects[(shown + 1) % n];

  return (
    <div role="dialog" aria-modal="true" aria-hidden={open == null} ref={scrollRef}
      style={{ position: "fixed", inset: 0, zIndex: 1500, background: "var(--color-bg)", color: "var(--color-text)", overflowY: "auto", transform: `translateY(${open == null ? "100%" : "0%"})`, visibility: open == null ? "hidden" : "visible", transition: "transform .85s cubic-bezier(.76,0,.24,1),visibility .85s" }}>
      {p && next && shown != null && (
        <article data-screen-label={`Case study — ${p.name}`} style={{ padding: "0 clamp(20px,4vw,56px) clamp(48px,6vw,96px)" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, height: 64, borderBottom: "2px solid var(--color-divider)" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ justifyContent: "flex-start" }}>← Back to work <span style={{ opacity: 0.55, fontSize: 11 }}>ESC</span></button>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".1em", fontVariantNumeric: "tabular-nums" }}>{String(shown + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
            <button type="button" className="btn btn-ghost" onClick={() => onOpen((shown + 1) % n)}>Next: {next.name} →</button>
          </div>

          {p.kind && <div style={{ ...LABEL, paddingTop: "clamp(40px,6vw,80px)", color: "var(--color-accent-700)" }}>Case study — {p.kind}</div>}
          <h2 style={{ margin: "8px 0 clamp(32px,4vw,56px)", fontSize: "clamp(64px,15vw,280px)", lineHeight: 0.82, letterSpacing: "-.035em", textTransform: "uppercase", fontStretch: "112%", overflowWrap: "anywhere" }}>{p.name}</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", borderTop: "2px solid var(--color-divider)", marginBottom: "var(--space-8)" }}>
            <Meta label="Year">{p.year}</Meta>
            {p.role && <Meta label="Role">{p.role}</Meta>}
            <Meta label="Stack">{p.stack.join(", ")}</Meta>
            {(p.status || p.liveUrl) && (
              <Meta label="Status">
                <span style={{ display: "flex", alignItems: "center", gap: 8, textTransform: "capitalize" }}>
                  <span style={{ width: 8, height: 8, background: "var(--color-accent)" }} />
                  {(p.status ?? "live").replace("-", " ")}
                  {p.liveUrl && <> — <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ textTransform: "none" }}>Visit ↗</a></>}
                </span>
              </Meta>
            )}
          </div>

          {p.image && (
            // biome-ignore lint/performance/noImgElement: remote Sanity CDN image
            <img className="grayscale" src={p.image} alt={p.imageAlt ?? `${p.name} screenshot`} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", border: "2px solid var(--color-divider)" }} />
          )}

          <div style={{ display: "flex", flexDirection: "column", marginTop: "clamp(48px,6vw,96px)" }}>
            {(() => {
              let i = 0;
              const num = () => String(++i).padStart(2, "0");
              return (
                <>
                  {hasBlocks(p.problem) && <Row n={num()} title="The problem"><PortableText value={p.problem!} components={rich} /></Row>}
                  {hasBlocks(p.approach) && <Row n={num()} title="The approach"><PortableText value={p.approach!} components={rich} /></Row>}
                  <Row n={num()} title="The build">
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                      <p style={{ margin: 0, fontSize: "clamp(20px,1.8vw,26px)", lineHeight: 1.25, fontWeight: 600, maxWidth: "40ch", textWrap: "pretty" }}>{p.built}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{p.stack.map((t) => <span key={t} className="tag tag-accent" style={{ fontWeight: 600 }}>{t}</span>)}</div>
                      {p.buildImage && (
                        // biome-ignore lint/performance/noImgElement: remote Sanity CDN image
                        <img className="grayscale" src={p.buildImage} alt={p.buildImageAlt ?? `${p.name} UI`} style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", border: "2px solid var(--color-divider)" }} />
                      )}
                    </div>
                  </Row>
                  <Row n={num()} title="The details">
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                      <span style={{ ...LABEL, opacity: 0.7 }}>Stack map</span>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch" }}>
                        {p.stack.map((t, j) => (
                          <div key={t} style={{ display: "flex", alignItems: "center" }}>
                            {j > 0 && <span style={{ padding: "0 10px", fontWeight: 800, color: "var(--color-accent)" }}>→</span>}
                            <div style={{ border: "2px solid var(--color-text)", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 2, minWidth: 120 }}>
                              {p.layers?.[j] && <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", opacity: 0.6 }}>{p.layers[j]}</span>}
                              <span style={{ fontWeight: 800, textTransform: "uppercase" }}>{t}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {hasBlocks(p.details) && <PortableText value={p.details!} components={rich} />}
                    </div>
                  </Row>
                  {hasBlocks(p.result) && <Row n={num()} title="The result"><PortableText value={p.result!} components={rich} /></Row>}
                </>
              );
            })()}
          </div>

          <button type="button" data-cursor="NEXT" onClick={() => onOpen((shown + 1) % n)} className="m-flink"
            style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, padding: "var(--space-6) 0", border: 0, borderTop: "2px solid var(--color-divider)", background: "transparent", color: "var(--color-text)", fontFamily: "inherit", textAlign: "left", cursor: "pointer" }}>
            <span style={{ ...LABEL, fontSize: 12 }}>Next project</span>
            <span style={{ fontSize: "clamp(48px,9vw,160px)", fontWeight: 800, lineHeight: 0.85, textTransform: "uppercase", letterSpacing: "-.03em" }}>{next.name} →</span>
          </button>
        </article>
      )}
    </div>
  );
}
