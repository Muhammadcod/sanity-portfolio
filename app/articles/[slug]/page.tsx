import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { getArticleBySlug } from '@/lib/sanity'
import { urlFor } from '@/sanity/lib/image'
import type { CSSProperties } from 'react'

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = urlFor(value)?.width(1200).url()
      const alt = value?.alt || ''
      if (!src) return null
      return <img src={src} alt={alt} className="rounded-lg border border-border my-6" />
    },
    code: ({ value }) => {
      const { language, code } = value || {}
      return (
        <pre className="my-6 rounded-lg bg-foreground/5 border border-foreground/10 overflow-x-auto p-4">
          <code className={language ? `language-${language}` : undefined}>{code}</code>
        </pre>
      )
    }
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-8 mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-semibold leading-snug mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-semibold leading-snug mt-6 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl md:text-2xl font-semibold leading-snug mt-6 mb-3">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg md:text-xl font-semibold leading-snug mt-5 mb-2">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base md:text-lg font-semibold leading-snug mt-4 mb-2">
        {children}
      </h6>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-7 text-foreground/80 my-4">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-foreground/20 pl-4 italic text-foreground/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 list-disc list-outside pl-6 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 list-decimal list-outside pl-6 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="marker:text-foreground/50">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="marker:text-foreground/50">
        {children}
      </li>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || '#'
      const isExternal = href?.startsWith('http')
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-foreground hover:underline"
        >
          {children}
        </a>
      )
    }
  }
}

export default async function ArticleDetail({ params }: { params: { slug: string } }) {
  const { slug } = params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  const proseStyle: CSSProperties = {
    '--tw-prose-body': 'rgb(var(--foreground) / 0.8)',
    '--tw-prose-headings': 'rgb(var(--foreground))',
    '--tw-prose-links': 'rgb(var(--foreground))',
    '--tw-prose-bold': 'rgb(var(--foreground))',
    '--tw-prose-code': 'rgb(var(--foreground) / 0.9)',
    '--tw-prose-pre-code': 'rgb(var(--foreground) / 0.9)',
    '--tw-prose-pre-bg': 'rgb(var(--foreground) / 0.05)',
    '--tw-prose-quotes': 'rgb(var(--foreground) / 0.7)',
    '--tw-prose-quote-borders': 'rgb(var(--foreground) / 0.2)',
    '--tw-prose-hr': 'rgb(var(--foreground) / 0.2)',
    '--tw-prose-li-markers': 'rgb(var(--foreground) / 0.6)'
  } as CSSProperties

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Back to portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          {article.externalUrl && (
            <a
              href={article.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="View original article"
            >
              <ExternalLink className="w-4 h-4" />
              Original Article
            </a>
          )}
        </div>
      </nav>

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-foreground/60">
              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
              {article.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {article.readTime}
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {article.tags?.length ? (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex items-center gap-3 pb-8 border-b border-border">
              <div>
                <div className="font-medium">{article.author}</div>
                <div className="text-sm text-foreground/60">Author</div>
              </div>
            </div>
          </header>

          <article className="prose prose-lg max-w-none" style={proseStyle}>
            <PortableText value={article.content} components={portableTextComponents} />
          </article>
        </div>
      </main>
    </div>
  )
}