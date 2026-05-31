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

---

Now the prompt:

---

## Prompt

```
You are helping me scaffold a Next.js 16 portfolio site from scratch. Do not generate any UI design, styles, colors, or visual decisions. Only scaffold the project structure, configuration files, types, and utility functions. Here are the complete requirements:

---

STACK
- Next.js 16 with App Router and Turbopack
- Bun as package manager
- TypeScript (strict mode)
- Tailwind CSS v4 with @tailwindcss/postcss
- MDX for blog posts and project case studies
- Vercel deployment (hobby plan), fully static output
- No backend, no API routes, no database

---

ARCHITECTURE: TWO ROUTE GROUPS IN ONE APP

The app has two distinct route groups with completely independent layouts:

(professional) — recruiter-facing portfolio
(personal) — personal corner, independent UI

Each layout.tsx must be a skeleton with a placeholder nav and a single hyperlink to switch to the other side. No styling decisions — just the structural shell.

---

ROUTES TO SCAFFOLD (empty page.tsx files with a single placeholder h1)

Professional side:
- / → app/(professional)/page.tsx
- /projects → app/(professional)/projects/page.tsx
- /projects/[slug] → app/(professional)/projects/[slug]/page.tsx
- /experience → app/(professional)/experience/page.tsx
- /resume → app/(professional)/resume/page.tsx
- /contact → app/(professional)/contact/page.tsx
- /blog → app/(professional)/blog/page.tsx
- /blog/[slug] → app/(professional)/blog/[slug]/page.tsx

Personal side:
- /corner → app/(personal)/corner/page.tsx
- /corner/hobbies → app/(personal)/corner/hobbies/page.tsx
- /corner/recommendations → app/(personal)/corner/recommendations/page.tsx
- /corner/goals → app/(personal)/corner/goals/page.tsx
- /corner/highlights → app/(personal)/corner/highlights/page.tsx
- /corner/blog → app/(personal)/corner/blog/page.tsx (lists all posts, links to /blog/[slug])

Note: /blog/[slug] lives under (professional) and is the single source of truth for all posts. The personal /corner/blog page links to the same slugs.

---

CONTENT DIRECTORY STRUCTURE

Create the following empty placeholder files:

content/
  blog/
    hello-world.mdx        ← example post with correct frontmatter
  projects/
    pgxcli.mdx             ← example project with correct frontmatter
  data/
    experience.json        ← typed structure, empty array
    recommendations.json   ← typed structure with keys: songs, anime, movies, books (each empty array)
    highlights.json        ← typed structure, empty array
    goals.json             ← typed structure, empty array

public/
  resume.pdf               ← placeholder note only, do not generate actual PDF

---

FRONTMATTER SCHEMAS

Blog post MDX frontmatter:
  title: string
  date: string (ISO 8601)
  summary: string
  tags: string[]
  readingTime is NOT in frontmatter — it must be computed at build time in lib/content.ts

Project MDX frontmatter:
  title: string
  date: string (ISO 8601)
  summary: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean

---

LIB LAYER

Scaffold the following in lib/ with full TypeScript types and real implementation (not stubs):

lib/content.ts
  - Type: BlogPost { slug, title, date, summary, tags, readingTime, content }
  - getAllPosts(): BlogPost[] — reads all MDX from content/blog/, parses frontmatter, computes readingTime using the 'reading-time' package, returns sorted by date desc
  - getPostBySlug(slug: string): BlogPost | null

lib/projects.ts
  - Type: Project { slug, title, date, summary, techStack, githubUrl?, liveUrl?, featured, content }
  - getAllProjects(): Project[] — reads all MDX from content/projects/, parses frontmatter, returns sorted by date desc
  - getProjectBySlug(slug: string): Project | null

lib/data.ts
  - Types for Experience, Recommendation, Highlight, Goal matching the JSON structures
  - getExperience(): Experience[]
  - getRecommendations(): Recommendations
  - getHighlights(): Highlight[]
  - getGoals(): Goal[]

---

STATIC GENERATION

In /blog/[slug]/page.tsx and /projects/[slug]/page.tsx, implement generateStaticParams() correctly so all MDX files are pre-rendered at build time.

---

PACKAGES TO INSTALL

List the exact bun add commands needed for:
- MDX processing (choose between next-mdx-remote or @next/mdx — pick whichever integrates more cleanly with Next.js 16 App Router and explain the choice in a comment)
- gray-matter (frontmatter parsing)
- reading-time (reading time computation)
- Any other packages genuinely required

Do not install anything for UI, icons, animation, or styling beyond Tailwind.

---

NEXT.JS CONFIG

Scaffold next.config.ts with:
- NEXT_TELEMETRY_DISABLED=1 equivalent config or comment to set it in .env
- MDX support configured correctly for the chosen MDX package
- pageExtensions including .mdx if needed
- No other modifications

---

TYPESCRIPT

tsconfig.json should have strict: true. Add path aliases:
  @/components → ./components
  @/lib → ./lib
  @/content → ./content

---

OUTPUT FORMAT

For each file, output the full file path as a heading followed by the complete file content. Do not summarize or skip any file. Do not add UI components, page designs, or any visual decisions. The goal is a working skeleton that compiles and deploys to Vercel with bun run build passing cleanly.
```