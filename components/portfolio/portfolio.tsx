"use client"

import Lenis from "lenis"
import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react"
import { type Article, aboutText, email, facts, jobs, type Project, repoLabel, rotWords, socials } from "./data"
import { ArticleOverlay, ProjectOverlay } from "./overlays"
import s from "./portfolio.module.css"
import { Shot } from "./shot"

const NAME = "Mohammed Adebayo"
const BIG = "Open an issue"
const GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEFxz$%&"
const OVERLAY_MS = 600

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

/** Replaces every unresolved, non-space character with a random glyph. */
function scramble(text: string, resolved: (i: number) => boolean) {
  let out = ""
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    out += c === " " || resolved(i) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]
  }
  return out
}

/** Mirror the open overlay in the URL so it can be shared and reopened. */
function syncQuery(key?: "project" | "article", slug?: string) {
  const url = key && slug ? `${location.pathname}?${key}=${encodeURIComponent(slug)}` : location.pathname
  history.replaceState(history.state, "", url)
}

function lagosTime() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" })
}

interface PortfolioProps {
  projects: Project[]
  articles: Article[]
}

export function Portfolio({ projects, articles }: PortfolioProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const nameWrapRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const scrambleRef = useRef<HTMLSpanElement>(null)
  const rotRef = useRef<HTMLSpanElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLParagraphElement>(null)
  const contactRef = useRef<HTMLElement>(null)
  const contactInnerRef = useRef<HTMLDivElement>(null)
  const contactBigRef = useRef<HTMLAnchorElement>(null)
  const emailRef = useRef<HTMLSpanElement>(null)
  const footRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)

  const [time, setTime] = useState("")
  const [open, setOpen] = useState<number | null>(null)
  const [shown, setShown] = useState(false)
  const [art, setArt] = useState<number | null>(null)
  const [artShown, setArtShown] = useState(false)

  const lockScroll = useCallback((lock: boolean) => {
    document.documentElement.style.overflow = lock ? "hidden" : ""
    if (lock) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [])

  const openProject = useCallback(
    (i: number) => {
      if (open == null) setTimeout(() => setShown(true), 30)
      setOpen(i)
      lockScroll(true)
      syncQuery("project", projects[i]?.slug)
    },
    [open, lockScroll, projects],
  )

  const closeProject = useCallback(() => {
    setShown(false)
    syncQuery()
    setTimeout(() => {
      setOpen(null)
      lockScroll(false)
    }, OVERLAY_MS)
  }, [lockScroll])

  const openArticle = useCallback(
    (i: number, e?: MouseEvent) => {
      e?.preventDefault()
      setArt(i)
      lockScroll(true)
      syncQuery("article", articles[i]?.slug)
      setTimeout(() => setArtShown(true), 30)
    },
    [lockScroll, articles],
  )

  const closeArticle = useCallback(() => {
    setArtShown(false)
    syncQuery()
    setTimeout(() => {
      setArt(null)
      lockScroll(false)
    }, OVERLAY_MS)
  }, [lockScroll])

  // Escape closes whichever overlay is up.
  const escRef = useRef<() => void>(() => {})
  escRef.current = () => {
    if (open != null) closeProject()
    else if (art != null) closeArticle()
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const k = reduced ? 0 : 1
    const t0 = performance.now()
    const seed = [...NAME].map((_, i) => ((i * 7919) % 97) / 97)
    let frame = 0

    // ---- hero name fills the row ----
    const fit = () => {
      const h = nameRef.current
      const w = nameWrapRef.current
      if (!h || !w) return
      const cur = Number.parseFloat(getComputedStyle(h).fontSize)
      const next = cur * (w.clientWidth / h.scrollWidth)
      if (Number.isFinite(next) && next > 0) h.style.fontSize = `${Math.floor(next * 0.995)}px`
    }
    fit()
    const fitTimer = setTimeout(fit, 600)
    document.fonts?.ready.then(fit)

    const mouse = { x: innerWidth / 2, y: innerHeight * 0.4 }
    const sm = { ...mouse }
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") escRef.current()
    }
    addEventListener("pointermove", onMove, { passive: true })
    addEventListener("keydown", onKey)
    addEventListener("resize", fit)

    // ---- reveal on scroll ----
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue
          const el = en.target as HTMLElement
          if (el === wordsRef.current) {
            el.querySelectorAll<HTMLElement>("[data-word]").forEach((w, i) => {
              w.style.transition = `transform 1s cubic-bezier(.16,1,.3,1) ${i * 0.022}s`
              w.style.transform = "translateY(0)"
            })
          } else {
            el.style.opacity = ""
            el.style.transform = ""
          }
          io.unobserve(el)
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    if (k) {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.style.opacity = "0"
        el.style.transform = "translateY(36px)"
        el.style.transition = "opacity .9s ease, transform 1.1s cubic-bezier(.16,1,.3,1)"
        io.observe(el)
      })
      if (wordsRef.current) {
        wordsRef.current.querySelectorAll<HTMLElement>("[data-word]").forEach((w) => {
          w.style.transform = "translateY(110%)"
        })
        io.observe(wordsRef.current)
      }
    }

    // ---- terminal typing ----
    let typeTimer: ReturnType<typeof setTimeout> | undefined
    let caretEl: HTMLElement | null = null
    let caretText = ""
    if (k) {
      const els = [...root.querySelectorAll<HTMLElement>("[data-type]")]
      const texts = els.map((el) => el.textContent ?? "")
      for (const el of els) el.textContent = ""
      let li = 0
      let ci = 0
      const step = () => {
        if (li >= els.length) {
          caretEl = els[els.length - 1]
          caretText = texts[els.length - 1]
          return
        }
        const el = els[li]
        const txt = texts[li]
        ci++
        el.textContent = txt.slice(0, ci) + (ci < txt.length ? "▍" : "")
        if (ci >= txt.length) {
          li++
          ci = 0
          typeTimer = setTimeout(step, li % 2 ? 180 : 420)
        } else typeTimer = setTimeout(step, li % 2 ? 14 : 55)
      }
      typeTimer = setTimeout(step, 900)
    }

    // ---- clock ----
    setTime(lagosTime())
    const clock = setInterval(() => setTime(lagosTime()), 15000)

    // ---- smooth scroll ----
    if (k) lenisRef.current = new Lenis({ lerp: 0.085, anchors: true })

    let rotI = 0
    let rotAt = performance.now() + 2600
    let rotStart = 0

    const tick = (now: number) => {
      const y = scrollY
      const vh = innerHeight
      frame++

      // hero name: decode on load, re-scramble as you scroll away
      const sEl = scrambleRef.current
      if (sEl) {
        const intro = clamp01((now - t0 - 200) / 1400)
        const away = clamp01(y / (vh * 0.7))
        if (k && frame % 3 === 0) {
          sEl.textContent = scramble(NAME, (i) => i / NAME.length < intro && seed[i] >= away)
        }
        if (nameRef.current) nameRef.current.style.transform = `translate3d(0,${away * vh * 0.18 * k}px,0)`
      }

      // hero: spotlight grid, portrait tilt, rotating word
      sm.x += (mouse.x - sm.x) * 0.12
      sm.y += (mouse.y - sm.y) * 0.12
      const g = gridRef.current
      if (g) {
        const mk = `radial-gradient(circle ${k ? 260 : 0}px at ${sm.x}px ${sm.y + y}px,#000,transparent)`
        g.style.webkitMaskImage = mk
        g.style.maskImage = mk
      }
      const pr = portraitRef.current
      if (pr) {
        const nx = sm.x / innerWidth - 0.5
        const ny = sm.y / vh - 0.5
        pr.style.transform = `translate3d(${nx * 18 * k}px,${(ny * 14 - y * 0.12) * k}px,0) rotate(${-3 + nx * 6 * k}deg)`
      }
      const rw = rotRef.current
      if (rw && k) {
        if (now > rotAt) {
          rotI = (rotI + 1) % rotWords.length
          rotAt = now + 2600
          rotStart = now
        }
        const word = rotWords[rotI]
        if (rotStart && now - rotStart < 700) {
          if (frame % 2 === 0) {
            const p = (now - rotStart) / 700
            rw.textContent = scramble(word, (i) => i / word.length < p)
          }
        } else if (rw.textContent !== word) rw.textContent = word
      }

      // caret blink
      if (caretEl) caretEl.textContent = caretText + (((now / 530) | 0) % 2 ? "▍" : "")

      // zoom-out images
      root.querySelectorAll<HTMLElement>("[data-zoom]").forEach((el) => {
        const r = (el.parentElement as HTMLElement).getBoundingClientRect()
        const p = clamp01((vh - r.top) / (vh + r.height * 0.4))
        el.style.transform = `scale(${1 + (0.28 - 0.28 * p) * k})`
      })

      // stacked cards: shrink + shade as the next card covers
      const cards = [...root.querySelectorAll<HTMLElement>("[data-card]")]
      cards.forEach((c, i) => {
        const inner = c.querySelector<HTMLElement>("[data-card-inner]")
        const shade = c.querySelector<HTMLElement>("[data-shade]")
        const next = cards[i + 1]
        let cover = 0
        if (next) {
          const nr = next.getBoundingClientRect()
          const stickTop = Number.parseFloat(getComputedStyle(next).top) || 0
          cover = clamp01((vh - nr.top) / (vh - stickTop))
        }
        if (inner) inner.style.transform = `scale(${1 - 0.07 * cover * k})`
        if (shade) shade.style.opacity = String(cover * 0.12 * k)
      })

      // pinned contact: paper → ink, title scales up, email decodes
      const cs = contactRef.current
      const ci = contactInnerRef.current
      if (cs && ci) {
        const r = cs.getBoundingClientRect()
        const dist = r.height - vh
        const p = dist > 0 ? clamp01(-r.top / dist) : 0
        const pin = clamp01((vh - r.top) / vh)
        const d = clamp01((p - 0.05) / 0.3)
        const e = d * d * (3 - 2 * d)
        const mix = (a: number, b: number) => Math.round(a + (b - a) * e)
        ci.style.background = `rgb(${mix(242, 18)},${mix(241, 18)},${mix(236, 16)})`
        ci.style.color = `rgb(${mix(18, 242)},${mix(18, 241)},${mix(16, 236)})`
        if (footRef.current) footRef.current.style.borderColor = e > 0.5 ? "#3a3934" : "#c9c8c1"
        if (contactBigRef.current) {
          contactBigRef.current.style.transform = `scale(${0.82 + 0.18 * (k ? clamp01(pin * 0.6 + p) : 1)})`
        }
        const em = emailRef.current
        if (em && frame % 3 === 0) {
          const dec = k ? clamp01((p - 0.15) / 0.55) : 1
          em.textContent = dec >= 1 ? email : scramble(email, (i) => i / email.length < dec)
        }
      }
    }

    let raf = 0
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      lenisRef.current?.raf(t)
      tick(t)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(clock)
      clearTimeout(typeTimer)
      clearTimeout(fitTimer)
      removeEventListener("pointermove", onMove)
      removeEventListener("keydown", onKey)
      removeEventListener("resize", fit)
      io.disconnect()
      lenisRef.current?.destroy()
      lenisRef.current = null
      document.documentElement.style.overflow = ""
    }
  }, [])

  // Deep links: /?project=<slug> or /?article=<slug> opens that overlay on load.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    const q = new URLSearchParams(location.search)
    const pi = projects.findIndex((p) => p.slug === q.get("project"))
    const ai = articles.findIndex((a) => a.slug === q.get("article"))
    if (pi >= 0) openProject(pi)
    else if (ai >= 0) openArticle(ai)
  }, [])

  const toTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0)
    else scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div ref={rootRef} className={s.root}>
      <header className={s.topbar}>
        <a href="#top" style={{ fontWeight: 700 }}>
          ~/muhbiy
        </a>
        <nav>
          <a href="#work">./work</a>
          <a href="#about">./about</a>
          <a href="#log">./log</a>
          <a href="#writing">./writing</a>
          <a href="#contact">./contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className={s.hero}>
        <div ref={gridRef} className={s.grid} />
        <div className={s.metaRow}>
          <span>src/index.tsx</span>
          <span>Nigeria · Remote · UTC+1</span>
          <span className={s.status}>
            <span className={s.dot} />
            open to work
          </span>
        </div>

        <div ref={nameWrapRef} className={s.nameWrap}>
          <span data-reveal="" className={s.greeting}>
            Ẹ kú àbọ̀ — welcome in. I&apos;m
          </span>
          <h1 ref={nameRef} className={s.name} aria-label={NAME}>
            <span className={s.accent}>&lt;</span>
            <span ref={scrambleRef} aria-hidden="true">
              {NAME}
            </span>
            <span className={s.accent}> /&gt;</span>
          </h1>
        </div>

        <div className={s.heroGrid}>
          <div className={s.heroCopy}>
            <p className={s.tagline}>
              I build{" "}
              <span ref={rotRef} className={s.accent}>
                interfaces
              </span>
              <br />
              people enjoy using.
            </p>
            <a href="#work" className={s.shipping}>
              <span className={s.shippingNum}>01</span>
              <span className={s.shippingText}>
                <span className={`${s.mono} ${s.dim}`} style={{ fontSize: 11 }}>
                  currently shipping
                </span>
                <span className={s.shippingTitle}>Breeg — cohort learning platform</span>
              </span>
              <span style={{ marginLeft: "auto", fontFamily: "var(--mono)" }}>↓</span>
            </a>
          </div>
          <div ref={portraitRef} className={s.portrait}>
            <Shot src="/images/portrait.jpg" alt="Mohammed Adebayo" label="portrait" light sizes="300px" />
            <span className={s.portraitTag}>hi 👋 that&apos;s me</span>
          </div>
          <div className={s.terminal}>
            <div className={s.lights}>
              <span />
              <span />
              <span />
            </div>
            <div>
              <span className={s.prompt}>$ </span>
              <span data-type="">whoami</span>
            </div>
            <div data-type="" className={s.output}>
              Frontend lead building interfaces where design, technology and people meet.
            </div>
            <div>
              <span className={s.prompt}>$ </span>
              <span data-type="">status --now</span>
            </div>
            <div data-type="" className={s.output}>
              Frontend Developer Lead @ Summitech — 5 yrs shipping
            </div>
          </div>
        </div>

        <div className={s.metaRow}>
          <span suppressHydrationWarning>Lagos time {time} — probably writing TypeScript</span>
          <span>// scroll to compile ↓</span>
        </div>
      </section>

      {/* Stack import line */}
      <div className={s.stackLine}>
        <p data-reveal="">
          <span className={s.accent}>import</span> {"{ React, TypeScript, Next.js, Tailwind, Convex, Vue }"}{" "}
          <span className={s.accent}>from</span> <span className={s.dim}>&quot;@muhbiy/stack&quot;</span>;
        </p>
      </div>

      {/* Work: stacked cards */}
      <section id="work" className={s.work}>
        <div className={s.sectionHead}>
          <h2 data-reveal="" className={s.bigTitle}>
            Selected work
          </h2>
          <div className={`${s.workLinks} ${s.mono} ${s.dim}`}>
            <span>
              $ ls ./work → {projects.length} {projects.length === 1 ? "item" : "items"}
            </span>
            <a href="/projects" style={{ color: "var(--ink)" }}>
              all projects ↗
            </a>
          </div>
        </div>
        <div className={s.cards}>
          {projects.map((p, i) => {
            const num = String(i + 1).padStart(2, "0")
            return (
              <div key={p.slug} data-card="" className={s.card} style={{ top: 72 + i * 16 }}>
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: the card title button below is the keyboard target */}
                <article data-card-inner="" className={s.cardInner} onClick={() => openProject(i)}>
                  <div className={s.cardTop}>
                    <span>
                      work/{num}-{p.slug}.tsx
                    </span>
                    <span>
                      <span>{p.year}</span>
                      <button
                        type="button"
                        className={`${s.plainBtn} ${s.cardOpen}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          openProject(i)
                        }}
                      >
                        open case →
                      </button>
                    </span>
                  </div>
                  <div className={s.cardShot}>
                    <div data-zoom="" className={s.zoom}>
                      <Shot src={p.image} alt={p.imageAlt ?? `${p.name} screenshot`} label={`${p.name} screenshot`} />
                    </div>
                  </div>
                  <div className={s.cardFoot}>
                    <h3 className={s.cardTitle}>{p.name}</h3>
                    <div className={s.cardMeta}>
                      <span className={s.cardBlurb}>{p.blurb}</span>
                      <span className={s.stackTag}>{p.stack.join(" · ")}</span>
                      <div className={s.btnRow}>
                        {p.live && (
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={s.btnSolid}
                          >
                            Live site ↗
                          </a>
                        )}
                        {p.repo && (
                          <a
                            href={p.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={s.btnGhost}
                          >
                            {repoLabel(p.repo)} ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div data-shade="" className={s.shade} />
                </article>
              </div>
            )
          })}
        </div>
      </section>

      {/* About */}
      <section id="about" className={s.about}>
        <div className={s.aboutGrid}>
          <div className={s.aboutSide}>
            <span className={`${s.mono} ${s.dim}`}>README.md</span>
            <div className={s.aboutPhoto}>
              <div data-zoom="" className={s.zoom}>
                <Shot alt="Portrait of Mohammed Adebayo" label="portrait" light sizes="440px" />
              </div>
            </div>
          </div>
          <div className={s.aboutMain}>
            <p ref={wordsRef} className={s.words}>
              {aboutText.split(" ").map((w, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static text, words can repeat
                <span key={i} className={s.wordMask}>
                  <span data-word="" className={s.word}>
                    {w}
                  </span>
                </span>
              ))}
            </p>
            <div data-reveal="" className={s.profile}>
              <span className={s.dim}>// profile.json</span>
              {facts.map((f) => (
                <span key={f.k}>
                  <span className={s.accent}>&quot;{f.k}&quot;</span>: <span>&quot;{f.v}&quot;</span>,
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience as git log */}
      <section id="log" className={s.ruled}>
        <div className={s.sectionHead}>
          <h2 data-reveal="" className={s.bigTitle}>
            Experience
          </h2>
          <span className={`${s.mono} ${s.dim}`}>$ git log --since=2020</span>
        </div>
        <div>
          {jobs.map((j) => (
            <div key={j.hash} data-reveal="" className={s.job}>
              <div className={s.rail}>
                <div className={s.node} />
              </div>
              <div className={s.jobBody}>
                <div className={`${s.stackCol} ${s.mono}`}>
                  <span className={s.accent}>{j.hash}</span>
                  <span className={s.dim}>{j.years}</span>
                  <span>{j.msg}</span>
                </div>
                <div className={s.stackCol}>
                  <span className={s.jobCompany}>{j.company}</span>
                  <span className={s.jobRole}>{j.role}</span>
                </div>
                <div className={s.stackCol} style={{ gap: 12 }}>
                  <p className={s.body}>{j.desc}</p>
                  <span className={`${s.mono} ${s.dim}`}>{j.stack}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section id="writing" className={s.ruled}>
        <div className={s.sectionHead}>
          <h2 data-reveal="" className={s.bigTitle}>
            Writing
          </h2>
          <span className={`${s.mono} ${s.dim}`}>
            $ ls ./articles → {articles.length} {articles.length === 1 ? "item" : "items"}
          </span>
        </div>
        {articles.length === 0 && <p className={`${s.mono} ${s.dim}`}>// nothing published yet</p>}
        {articles.map((a, i) => (
          <a
            key={a.slug}
            data-reveal=""
            href={`/?article=${a.slug}`}
            onClick={(e) => openArticle(i, e)}
            className={s.articleRow}
          >
            <div className={`${s.stackCol} ${s.mono} ${s.dim}`}>
              <span className={s.accent}>
                {String(i + 1).padStart(2, "0")} / {a.topic}
              </span>
              <span>{[a.date, a.readTime].filter(Boolean).join(" · ")}</span>
            </div>
            <span className={s.articleTitle}>{a.title}</span>
            <div className={s.stackCol} style={{ gap: 14 }}>
              {a.excerpt && <p className={`${s.body} ${s.excerpt}`}>{a.excerpt}</p>}
              <span className={s.mono}>read article →</span>
            </div>
          </a>
        ))}
      </section>

      {art != null && articles[art] && (
        <ArticleOverlay article={articles[art]} index={art} shown={artShown} onClose={closeArticle} />
      )}
      {open != null && projects[open] && (
        <ProjectOverlay
          projects={projects}
          index={open}
          shown={shown}
          onClose={closeProject}
          onOpen={openProject}
        />
      )}

      {/* Contact: pinned */}
      <section id="contact" ref={contactRef} className={s.contact}>
        <div ref={contactInnerRef} className={s.contactInner}>
          <span className={s.mono}>// contact.ts</span>
          <div className={s.contactMain}>
            <a href={`mailto:${email}`} ref={contactBigRef} className={s.contactBig}>
              {BIG}
              <span style={{ color: "oklch(0.62 0.2 262)" }}>.</span>
            </a>
            <div className={s.contactRow}>
              <div className={s.stackCol} style={{ gap: 10 }}>
                <span className={s.contactPitch}>
                  Open to roles, collaborations and good conversations about building for the web.
                </span>
                <a href={`mailto:${email}`} className={s.contactEmail} aria-label={email}>
                  → <span ref={emailRef}>{email}</span>
                </a>
              </div>
              <div className={s.socials}>
                {socials.map((so) => (
                  <a key={so.href} href={so.href} target="_blank" rel="noopener noreferrer">
                    {so.short} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div ref={footRef} className={s.foot}>
            <span>© {new Date().getFullYear()} Mohammed Adebayo — compiled with 0 warnings</span>
            <span suppressHydrationWarning>{time} WAT</span>
            <button type="button" onClick={toTop} className={s.plainBtn}>
              $ cd ~ ↑
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
