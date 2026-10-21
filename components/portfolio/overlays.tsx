"use client"

import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { type ReactNode, type UIEvent, useEffect, useRef } from "react"
import { urlFor } from "@/sanity/lib/image"
import { type Article, type Project, repoLabel } from "./data"
import s from "./portfolio.module.css"
import { Shot } from "./shot"

const num = (i: number) => String(i + 1).padStart(2, "0")

function CaseSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className={s.split}>
      <span className={`${s.mono} ${s.specLabel}`}>// {label}</span>
      {children}
    </section>
  )
}

interface ProjectOverlayProps {
  projects: Project[]
  index: number
  shown: boolean
  onClose: () => void
  onOpen: (i: number) => void
}

export function ProjectOverlay({ projects, index, shown, onClose, onOpen }: ProjectOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const p = projects[index]
  const nextIndex = (index + 1) % projects.length
  const [hero = p.image, ...details] = p.image ? [p.image, ...p.gallery] : p.gallery

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0
  }, [index])

  return (
    <div
      ref={ref}
      data-lenis-prevent=""
      role="dialog"
      aria-modal="true"
      aria-label={`${p.name} case study`}
      className={`${s.overlay} ${shown ? s.overlayShown : ""}`}
    >
      <div className={`${s.overlayBar} ${s.overlayBarRow}`}>
        <span>
          ~/muhbiy/work/{num(index)}-{p.slug}
        </span>
        <button type="button" onClick={onClose} className={s.closeBtn}>
          esc ✕ close
        </button>
      </div>
      <div className={s.overlayBody}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className={s.chips}>
            <span className={s.accent2}>
              {num(index)} / {p.cat}
            </span>
            <span className={s.chip}>
              <span className={s.liveDot} />
              {p.status}
            </span>
            {p.year && <span className={s.chip}>{p.year}</span>}
          </div>
          <h2 className={s.caseTitle}>{p.name}</h2>
        </div>

        <div className={s.split}>
          <p className={s.lede}>{p.blurb}</p>
          <div className={s.specs}>
            <div className={s.spec}>
              <span>year</span>
              <span>{p.year}</span>
            </div>
            <div className={s.spec}>
              <span>type</span>
              <span>{p.cat}</span>
            </div>
            <div className={s.spec}>
              <span>status</span>
              <span>● {p.status}</span>
            </div>
            {p.stack.length > 0 && (
              <div className={s.specStack}>
                <span className={s.specLabel}>stack</span>
                <div className={s.chips}>
                  {p.stack.map((t) => (
                    <span key={t} className={s.chip}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {p.tags.length > 0 && (
              <div className={s.specStack}>
                <span className={s.specLabel}>tags</span>
                <div className={s.chips}>
                  {p.tags.map((t) => (
                    <span key={t} className={s.chip}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className={s.btnRow} style={{ fontSize: 13, marginTop: 0 }}>
              {p.live && (
                <a href={p.live} target="_blank" rel="noopener noreferrer" className={s.btnSolid}>
                  Visit live site ↗
                </a>
              )}
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className={s.btnGhost}>
                  View on {repoLabel(p.repo)} ↗
                </a>
              )}
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noopener noreferrer" className={s.btnGhost}>
                  Watch demo ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {p.overview && p.overview !== p.blurb && (
          <CaseSection label="overview">
            <p className={s.overview}>{p.overview}</p>
          </CaseSection>
        )}

        <div className={s.frame} style={{ aspectRatio: "16 / 9" }}>
          <Shot src={hero} alt={p.imageAlt ?? `${p.name} screenshot`} label={`${p.name} hero screenshot`} />
        </div>
        {details.length > 0 && (
          <div className={s.shots}>
            {details.map((src, i) => (
              <div key={src} className={s.frame} style={{ aspectRatio: "4 / 3" }}>
                <Shot src={src} alt={`${p.name} screen ${i + 2}`} label="" sizes="50vw" />
              </div>
            ))}
          </div>
        )}

        {p.features.length > 0 && (
          <CaseSection label="features">
            <ol className={s.features}>
              {p.features.map((f, i) => (
                <li key={f}>
                  <span className={s.accent2}>{num(i)}</span>
                  <span>{f}</span>
                </li>
              ))}
            </ol>
          </CaseSection>
        )}

        {p.challenges.length > 0 && (
          <CaseSection label="challenges">
            <div className={`${s.prose} ${s.caseProse}`}>
              <PortableText value={p.challenges} components={proseComponents} />
            </div>
          </CaseSection>
        )}

        {p.solutions.length > 0 && (
          <CaseSection label="solutions">
            <ul className={s.features}>
              {p.solutions.map((sol) => (
                <li key={sol}>
                  <span className={s.accent2}>→</span>
                  <span>{sol}</span>
                </li>
              ))}
            </ul>
          </CaseSection>
        )}

        {p.learnings.length > 0 && (
          <CaseSection label="learnings">
            <div className={`${s.prose} ${s.caseProse}`}>
              <PortableText value={p.learnings} components={proseComponents} />
            </div>
          </CaseSection>
        )}

        {projects.length > 1 && (
          <button type="button" onClick={() => onOpen(nextIndex)} className={s.nextBtn}>
            <span className={`${s.mono} ${s.specLabel}`}>next project →</span>
            <span className={s.nextName}>{projects[nextIndex].name}</span>
          </button>
        )}
      </div>
    </div>
  )
}

// biome-ignore lint/suspicious/noExplicitAny: Portable Text blocks
const blockText = (b: any) => (b.children ?? []).map((c: { text?: string }) => c.text ?? "").join("")
const sectionId = (key: string) => `sec-${key}`

const proseComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => <h2 id={value._key ? sectionId(value._key) : undefined}>{children}</h2>,
  },
  types: {
    image: ({ value }) => {
      const src = urlFor(value)?.width(1400).url()
      if (!src) return null
      // biome-ignore lint/performance/noImgElement: Sanity CDN image, already sized
      return <img src={src} alt={value?.alt || ""} />
    },
    code: ({ value }) => (
      <pre>
        <code className={value?.language ? `language-${value.language}` : undefined}>{value?.code}</code>
      </pre>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href || "#"
      const external = href.startsWith("http")
      return (
        <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      )
    },
  },
}

interface ArticleOverlayProps {
  article: Article
  index: number
  shown: boolean
  onClose: () => void
}

export function ArticleOverlay({ article, index, shown, onClose }: ArticleOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const sections = article.content.filter((b) => b._type === "block" && b.style === "h2")

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const o = e.currentTarget
    if (barRef.current) {
      barRef.current.style.width = `${(o.scrollTop / Math.max(1, o.scrollHeight - o.clientHeight)) * 100}%`
    }
  }

  const jumpTo = (key: string) => {
    const o = ref.current
    const el = document.getElementById(sectionId(key))
    if (o && el) {
      o.scrollTo({ top: o.scrollTop + el.getBoundingClientRect().top - 90, behavior: "smooth" })
    }
  }

  const meta = [article.date, article.readTime].filter(Boolean)

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      data-lenis-prevent=""
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
      className={`${s.overlay} ${shown ? s.overlayShown : ""}`}
    >
      <div className={s.overlayBar}>
        <div className={s.overlayBarRow}>
          <span>~/muhbiy/articles/{article.slug}.md</span>
          <button type="button" onClick={onClose} className={s.closeBtn}>
            esc ✕ close
          </button>
        </div>
        <div ref={barRef} className={s.progress} />
      </div>
      <article className={s.overlayBody} style={{ paddingTop: "clamp(48px,7vw,110px)" }}>
        <header className={s.articleHead}>
          <div className={s.chips}>
            <span className={s.accent2}>
              {num(index)} / {article.topic}
            </span>
            {meta.map((m) => (
              <span key={m} className={s.chip}>
                {m}
              </span>
            ))}
          </div>
          <h1 className={s.articleH1}>{article.title}</h1>
          <div className={s.byline}>
            <span>by {article.author}</span>
            {article.tags.length > 0 && (
              <>
                <span>·</span>
                <span>{article.tags.join(" · ")}</span>
              </>
            )}
          </div>
        </header>
        {article.cover && (
          <div className={s.frame} style={{ aspectRatio: "21 / 9" }}>
            <Shot src={article.cover} alt={article.coverAlt ?? ""} label="" />
          </div>
        )}
        <div className={s.readGrid}>
          <aside className={s.toc}>
            {sections.length > 0 && (
              <>
                <span style={{ color: "var(--paper)" }}>// contents</span>
                {sections.map((b, i) => (
                  <button key={b._key} type="button" onClick={() => jumpTo(b._key)} className={s.tocItem}>
                    {num(i)} {blockText(b).toLowerCase()}
                  </button>
                ))}
              </>
            )}
          </aside>
          <div className={s.prose}>
            <PortableText value={article.content} components={proseComponents} />
          </div>
        </div>
        <div className={s.articleFoot}>
          {article.externalUrl ? (
            <a href={article.externalUrl} target="_blank" rel="noopener noreferrer" className={s.originalLink}>
              original post ↗
            </a>
          ) : (
            <span />
          )}
          <button type="button" onClick={onClose} className={s.backBtn}>
            ← back to portfolio
          </button>
        </div>
      </article>
    </div>
  )
}
