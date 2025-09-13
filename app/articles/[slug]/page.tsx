'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Sample article data - in a real app, this would come from a CMS or API
const articlesData = {
  'future-of-web-development': {
    title: 'The Future of Web Development',
    excerpt: 'Exploring emerging technologies and trends that will shape the next decade of web development.',
    content: `
# The Future of Web Development

Web development has evolved dramatically over the past few years, and the pace of change shows no signs of slowing down. As we look toward the future, several key trends are emerging that will shape how we build and interact with web applications.

## The Rise of Edge Computing

Edge computing is revolutionizing how we think about web performance. By moving computation closer to users, we can achieve:

- **Reduced Latency**: Applications respond faster when processing happens near the user
- **Better User Experience**: Smoother interactions and faster load times
- **Improved Reliability**: Distributed systems are more resilient to failures

## Component-Driven Development

The shift toward component-based architectures has fundamentally changed how we approach web development:

### Benefits of Component Architecture

1. **Reusability**: Write once, use everywhere
2. **Maintainability**: Easier to update and debug isolated components
3. **Testability**: Components can be tested in isolation
4. **Collaboration**: Teams can work on different components simultaneously

## The JavaScript Ecosystem Evolution

The JavaScript ecosystem continues to mature with new frameworks and tools:

- **Next.js**: Full-stack React framework with excellent developer experience
- **Svelte**: Compile-time optimizations for better performance
- **Deno**: Modern runtime with built-in TypeScript support
- **Vite**: Lightning-fast build tool for modern web projects

## Web Assembly (WASM)

Web Assembly is opening new possibilities for web applications:

- **Performance**: Near-native performance for compute-intensive tasks
- **Language Diversity**: Use languages like Rust, C++, and Go in the browser
- **New Use Cases**: Games, image processing, and scientific computing on the web

## Conclusion

The future of web development is bright, with new technologies enabling us to build faster, more reliable, and more engaging web applications. As developers, staying current with these trends will be crucial for building the next generation of web experiences.

The key is to embrace these changes while maintaining focus on user experience and accessibility. Technology should serve users, not the other way around.
    `,
    publishedAt: '2024-12-01',
    readTime: '5 min read',
    tags: ['Web Development', 'JavaScript', 'Performance', 'Future Tech'],
    author: {
      name: 'Mohammed Adebayo',
      avatar: '/api/placeholder/40/40'
    },
    externalUrl: 'https://dev.to/example/article'
  },
  'design-systems-at-scale': {
    title: 'Building Design Systems at Scale',
    excerpt: 'How to create and maintain design systems that work across large organizations and multiple products.',
    content: `
# Building Design Systems at Scale

Design systems have become essential for maintaining consistency and efficiency in large-scale product development. This guide explores best practices for building and scaling design systems across organizations.

## What is a Design System?

A design system is more than just a component library. It's a comprehensive set of:

- **Design Tokens**: Colors, typography, spacing, and other design decisions
- **Components**: Reusable UI elements with consistent behavior
- **Patterns**: Common interaction patterns and layouts
- **Guidelines**: Documentation and best practices

## Key Principles

### 1. Start Small, Think Big

Begin with the most commonly used components:
- Buttons
- Form inputs
- Typography
- Color palette

### 2. Documentation is Key

Every component should have:
- Usage guidelines
- Code examples
- Do's and don'ts
- Accessibility considerations

### 3. Governance and Maintenance

Establish clear processes for:
- Component updates
- New component requests
- Breaking changes
- Version management

## Implementation Strategies

### Monorepo Approach

\`\`\`bash
design-system/
├── packages/
│   ├── tokens/
│   ├── components/
│   ├── icons/
│   └── documentation/
└── apps/
    ├── storybook/
    └── playground/
\`\`\`

### Component API Design

\`\`\`jsx
// Good: Flexible and composable
<Button variant="primary" size="large" disabled>
  Click me
</Button>

// Better: With compound components
<Button variant="primary">
  <Button.Icon name="plus" />
  <Button.Text>Add Item</Button.Text>
</Button>
\`\`\`

## Tools and Technologies

### Design Tools
- **Figma**: For design collaboration and component libraries
- **Sketch**: Alternative design tool with symbol libraries
- **Adobe XD**: Component states and auto-animate

### Development Tools
- **Storybook**: Component documentation and testing
- **Chromatic**: Visual regression testing
- **Lerna**: Monorepo management
- **Rollup/Webpack**: Bundle optimization

## Measuring Success

Track these metrics to measure your design system's impact:

1. **Adoption Rate**: Percentage of products using the system
2. **Component Coverage**: How much of the UI uses system components
3. **Development Velocity**: Time to build new features
4. **Design Consistency**: Visual consistency across products
5. **Developer Satisfaction**: Survey feedback from teams

## Common Challenges

### Legacy System Integration
- Gradual migration strategies
- Coexistence patterns
- Progressive enhancement

### Cross-Platform Consistency
- Shared design tokens
- Platform-specific implementations
- Consistent behavior patterns

### Team Adoption
- Training and onboarding
- Clear migration paths
- Incentive alignment

## Conclusion

Building a successful design system requires careful planning, strong governance, and continuous iteration. Focus on solving real problems for your teams and users, and remember that a design system is never "done" – it evolves with your products and organization.

The investment in a well-designed system pays dividends in consistency, efficiency, and developer experience across your entire product ecosystem.
    `,
    publishedAt: '2024-11-01',
    readTime: '8 min read',
    tags: ['Design Systems', 'UI/UX', 'Frontend', 'Scalability'],
    author: {
      name: 'Mohammed Adebayo',
      avatar: '/api/placeholder/40/40'
    },
    externalUrl: 'https://medium.com/@example/design-systems'
  },
  'performance-first-development': {
    title: 'Performance-First Development',
    excerpt: 'Why performance should be a priority from day one and how to build fast web applications.',
    content: `
# Performance-First Development

In today's fast-paced digital world, performance isn't just a nice-to-have—it's essential for user experience, SEO, and business success. This article explores how to make performance a priority from the start of your development process.

## Why Performance Matters

### User Experience Impact
- **53% of users** abandon sites that take longer than 3 seconds to load
- **100ms delay** can reduce conversion rates by 7%
- **Fast sites** have 2.5x higher engagement rates

### Business Impact
- Better search engine rankings
- Higher conversion rates
- Reduced server costs
- Improved user retention

## Core Web Vitals

Google's Core Web Vitals are essential metrics for web performance:

### Largest Contentful Paint (LCP)
- **Good**: ≤ 2.5 seconds
- **Needs Improvement**: 2.5-4 seconds
- **Poor**: > 4 seconds

### First Input Delay (FID)
- **Good**: ≤ 100 milliseconds
- **Needs Improvement**: 100-300ms
- **Poor**: > 300ms

### Cumulative Layout Shift (CLS)
- **Good**: ≤ 0.1
- **Needs Improvement**: 0.1-0.25
- **Poor**: > 0.25

## Performance Optimization Strategies

### 1. Optimize Images

\`\`\`jsx
// Use next/image for automatic optimization
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={800}
  height={400}
  priority // For above-the-fold images
  placeholder="blur"
/>
\`\`\`

### 2. Code Splitting

\`\`\`jsx
// Dynamic imports for route-based splitting
const Dashboard = lazy(() => import('./Dashboard'));

// Component-based splitting
const HeavyComponent = lazy(() => 
  import('./HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
);
\`\`\`

### 3. Resource Hints

\`\`\`html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>

<!-- Prefetch likely next pages -->
<link rel="prefetch" href="/dashboard">

<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
\`\`\`

### 4. Caching Strategies

\`\`\`javascript
// Service Worker caching
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('images').then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
\`\`\`

## Performance Monitoring

### Tools for Measurement
- **Lighthouse**: Comprehensive performance audits
- **WebPageTest**: Detailed waterfall analysis
- **Chrome DevTools**: Real-time performance profiling
- **Real User Monitoring (RUM)**: Production performance data

### Key Metrics to Track
1. **Time to First Byte (TTFB)**
2. **First Contentful Paint (FCP)**
3. **Speed Index**
4. **Time to Interactive (TTI)**
5. **Total Blocking Time (TBT)**

## Performance Budget

Set and enforce performance budgets:

\`\`\`json
{
  "budget": [
    {
      "path": "/**",
      "timings": [
        {
          "metric": "interactive",
          "budget": 3000
        },
        {
          "metric": "first-meaningful-paint",
          "budget": 1000
        }
      ],
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 125
        },
        {
          "resourceType": "total",
          "budget": 300
        }
      ]
    }
  ]
}
\`\`\`

## Best Practices

### Development Workflow
1. **Performance testing** in CI/CD pipeline
2. **Regular audits** with automated tools
3. **Performance reviews** as part of code review
4. **Monitoring alerts** for performance regressions

### Architecture Decisions
- Choose frameworks based on performance characteristics
- Implement proper caching layers
- Use CDNs for static assets
- Optimize database queries
- Consider server-side rendering (SSR) vs client-side rendering (CSR)

## Conclusion

Performance-first development isn't about premature optimization—it's about making informed decisions that prioritize user experience from the beginning. By establishing performance budgets, monitoring key metrics, and following best practices, you can build applications that are both feature-rich and fast.

Remember: performance is a feature, not an afterthought. Your users will thank you for it.
    `,
    publishedAt: '2024-10-01',
    readTime: '6 min read',
    tags: ['Performance', 'Web Development', 'Optimization', 'User Experience'],
    author: {
      name: 'Mohammed Adebayo',
      avatar: '/api/placeholder/40/40'
    },
    externalUrl: 'https://web.dev/performance-first'
  },
  'art-of-code-review': {
    title: 'The Art of Code Review',
    excerpt: 'Best practices for conducting effective code reviews that improve code quality and team collaboration.',
    content: `
# The Art of Code Review

Code reviews are one of the most valuable practices in software development, yet they're often done poorly or skipped entirely. This guide explores how to conduct effective code reviews that improve code quality, share knowledge, and strengthen team collaboration.

## Why Code Reviews Matter

### Quality Benefits
- **Bug Detection**: Catch issues before they reach production
- **Code Quality**: Ensure adherence to coding standards
- **Security**: Identify potential security vulnerabilities
- **Performance**: Spot performance bottlenecks early

### Team Benefits
- **Knowledge Sharing**: Spread domain knowledge across the team
- **Mentoring**: Help junior developers learn and grow
- **Consistency**: Maintain consistent coding practices
- **Collaboration**: Foster team communication and trust

## The Review Process

### Before Submitting

1. **Self-Review First**
   - Read through your own code
   - Check for obvious issues
   - Ensure tests pass
   - Verify the PR description is clear

2. **Keep PRs Small**
   - Aim for 200-400 lines of code
   - Focus on a single feature or fix
   - Break large changes into smaller PRs

3. **Provide Context**
   \`\`\`markdown
   ## What
   Add user authentication to the dashboard
   
   ## Why
   Users need to log in to access personalized data
   
   ## How
   - Implemented JWT-based authentication
   - Added login/logout components
   - Protected routes with auth middleware
   
   ## Testing
   - Added unit tests for auth functions
   - Tested login flow manually
   \`\`\`

### During Review

#### What to Look For

1. **Correctness**
   - Does the code do what it's supposed to do?
   - Are there any logical errors?
   - Are edge cases handled?

2. **Design and Architecture**
   - Is the code well-structured?
   - Does it follow SOLID principles?
   - Are there any code smells?

3. **Readability**
   - Is the code easy to understand?
   - Are variable names descriptive?
   - Is the code properly commented?

4. **Performance**
   - Are there any obvious performance issues?
   - Could algorithms be more efficient?
   - Are resources properly managed?

5. **Security**
   - Are inputs properly validated?
   - Are there any injection vulnerabilities?
   - Is sensitive data handled correctly?

#### How to Give Feedback

**Good Feedback:**
\`\`\`
✅ Consider using a Map instead of an array for O(1) lookups:

const userMap = new Map(users.map(user => [user.id, user]));
const foundUser = userMap.get(userId);

This would improve performance when dealing with large user lists.
\`\`\`

**Poor Feedback:**
\`\`\`
❌ This is slow.
❌ Bad code.
❌ Why did you do it this way?
\`\`\`

### Review Guidelines

#### For Reviewers

1. **Be Constructive**
   - Focus on the code, not the person
   - Explain the "why" behind suggestions
   - Offer alternatives when pointing out problems

2. **Be Thorough but Timely**
   - Review within 24 hours when possible
   - Don't rush, but don't let PRs sit
   - Use tools to make reviews more efficient

3. **Ask Questions**
   - "Could you explain why you chose this approach?"
   - "Have you considered using X instead?"
   - "What happens if Y is null here?"

4. **Acknowledge Good Code**
   - Praise clever solutions
   - Recognize improvements
   - Build team morale

#### For Authors

1. **Don't Take It Personally**
   - Feedback is about the code, not you
   - Use reviews as learning opportunities
   - Ask for clarification if needed

2. **Respond Thoughtfully**
   - Address all feedback
   - Explain your reasoning when disagreeing
   - Thank reviewers for their time

3. **Make Changes Promptly**
   - Fix issues quickly
   - Re-request review after changes
   - Keep the conversation moving

## Tools and Automation

### Automated Checks
\`\`\`yaml
# GitHub Actions example
name: Code Quality
on: [pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run linter
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Check coverage
        run: npm run coverage
      - name: Security scan
        run: npm audit
\`\`\`

### Review Tools
- **GitHub/GitLab**: Built-in review features
- **Reviewboard**: Dedicated review platform
- **Crucible**: Atlassian's code review tool
- **Phabricator**: Facebook's review system

## Common Pitfalls

### Avoid These Mistakes

1. **Nitpicking Style Issues**
   - Use automated formatters instead
   - Focus on substantial issues
   - Don't waste time on personal preferences

2. **Reviewing Too Much at Once**
   - Large PRs are hard to review thoroughly
   - Quality decreases with PR size
   - Break changes into smaller pieces

3. **Not Reviewing Tests**
   - Tests are code too
   - Ensure good test coverage
   - Check test quality and clarity

4. **Ignoring Documentation**
   - Update docs with code changes
   - Ensure README accuracy
   - Check API documentation

## Measuring Success

Track these metrics to improve your review process:

- **Review turnaround time**
- **Defect detection rate**
- **Post-release bug count**
- **Team satisfaction scores**
- **Knowledge sharing effectiveness**

## Conclusion

Effective code reviews are an art that requires practice, empathy, and continuous improvement. They're not just about finding bugs—they're about building better software and stronger teams.

Remember: the goal isn't perfect code, it's better code. Focus on meaningful improvements, foster learning, and create a culture where everyone feels comfortable both giving and receiving feedback.

Great code reviews make great teams, and great teams build great software.
    `,
    publishedAt: '2024-09-01',
    readTime: '4 min read',
    tags: ['Code Review', 'Best Practices', 'Team Collaboration', 'Software Quality'],
    author: {
      name: 'Mohammed Adebayo',
      avatar: '/api/placeholder/40/40'
    },
    externalUrl: 'https://github.com/features/code-review'
   }
 };

export default function ArticleDetail() {
  const params = useParams();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  const slug = params.slug as string;
  const article = articlesData[slug as keyof typeof articlesData];

  useEffect(() => {
    if (contentRef.current) {
      // Extract headings from content for table of contents
      const headingElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingData = Array.from(headingElements).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1))
        };
      });
      setHeadings(headingData);

      // Set up intersection observer for active section tracking
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const index = headingData.findIndex(h => h.id === entry.target.id);
              if (index !== -1) {
                setActiveSection(index);
              }
            }
          }
        },
        { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }
      );

      for (const heading of headingElements) {
        observer.observe(heading);
      }

      return () => observer.disconnect();
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  // Convert markdown-like content to HTML (simplified)
  const formatContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gim, '<p>$1</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><li>/g, '<ul><li>')
      .replace(/<\/li><\/p>/g, '</li></ul>')
      .replace(/<p><pre>/g, '<pre>')
      .replace(/<\/pre><\/p>/g, '</pre>');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Back to portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
          
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

      {/* Table of Contents - Desktop */}
      {headings.length > 0 && (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
          <div className="max-w-64">
            <h3 className="text-sm font-medium text-foreground/60 mb-4">Contents</h3>
            <div className="space-y-2">
              {headings.map((heading, index) => {
                const isActive = activeSection === index;
                return (
                  <button
                    key={heading.id}
                    type="button"
                    onClick={() => {
                      const element = document.getElementById(heading.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`block text-left text-sm transition-colors ${
                      isActive
                        ? 'text-foreground font-medium'
                        : 'text-foreground/60 hover:text-foreground/80'
                    }`}
                    style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                  >
                    {heading.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
            
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

            <div className="flex items-center gap-3 pb-8 border-b border-border">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium">{article.author.name}</div>
                <div className="text-sm text-foreground/60">Author</div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <article
            ref={contentRef}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
            style={{
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
            } as React.CSSProperties}
          />
        </div>
      </main>
    </div>
  );
}