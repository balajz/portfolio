## Requirements Document

**Project:** Balaji's Portfolio — `balajz.vercel.app`
**Stack:** Next.js 16 (App Router, Turbopack), Bun, TypeScript, Tailwind CSS v4, MDX, Vercel (hobby plan)
**Constraint:** No backend, no database, fully static, no OG images, no RSS for now

---

### Architecture

Single Next.js app with two route groups sharing the same codebase:

- `(professional)` — recruiter-facing, clean and professional UI
- `(personal)` — personal corner, Balaji's own style, no recruiter consideration

Each group has its own `layout.tsx` with independent nav, theme, and fonts. A single hyperlink in each layout allows switching between the two sides. No authentication, no gating — both are publicly accessible.

---

### Route Map

```
/                          → professional landing
/projects                  → projects list
/projects/[slug]           → individual project case study (MDX)
/experience                → timeline of work & open source
/resume                    → rendered HTML resume + PDF download
/contact                   → contact section
/blog                      → all blog posts (both sides link here)
/blog/[slug]               → individual post (MDX)

/corner                    → personal landing / bio
/corner/hobbies            → hobbies
/corner/recommendations    → songs, anime, movies, books
/corner/goals              → goals & dreams
/corner/highlights         → life highlights
```

---

### Content Structure

```
content/
  blog/
    *.mdx                  ← all posts, shown on both sides
  projects/
    *.mdx                  ← one MDX per project
  data/
    experience.json        ← work history, open source contributions
    recommendations.json   ← songs, anime, movies, books
    highlights.json        ← life highlights
    goals.json             ← goals & dreams

public/
  resume.pdf               ← manually maintained, linked from /resume
```

---

### MDX Frontmatter Schemas

**Blog post:**
```ts
{
  title: string
  date: string           // ISO 8601
  summary: string
  tags: string[]
  readingTime: number    // auto-computed at build time, shown on post
}
```

**Project:**
```ts
{
  title: string
  date: string
  summary: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean      // controls if shown prominently on landing
}
```

---

### Shared Infrastructure

- `lib/content.ts` — MDX parsing, frontmatter extraction, reading time computation (`reading-time` package), returns typed objects
- `lib/projects.ts` — project MDX parsing, same pattern
- `components/shared/` — blog card, project card, MDX renderer, anything used by both sides
- `components/professional/` — nav, layout components exclusive to pro side
- `components/personal/` — nav, layout components exclusive to personal corner
- MDX rendering via `next-mdx-remote` or `@next/mdx` — decision to be made during implementation based on which integrates cleaner with App Router
- All pages statically generated at build time using `generateStaticParams` for dynamic routes

---

### Resume Page (`/resume`)

- Rendered HTML page with sections: summary, experience, education, skills, open source contributions
- "Download PDF" button linking to `/public/resume.pdf`
- Data sourced from a `resume.json` or directly from `experience.json` — no separate backend call

---

### Key Constraints

- No backend, no API routes needed (except potentially a static `sitemap.xml` via Next.js metadata API)
- No OG image generation for now
- No RSS feed for now
- Reading time computed at build time from MDX content, stored in frontmatter or derived in `lib/content.ts`
- Vercel hobby plan — no serverless function abuse, everything static