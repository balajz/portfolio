# Portfolio — balajz.vercel.app

## Project Overview
Personal portfolio with two completely independent UIs in a single Next.js app.
- **Professional side** — recruiter-facing: projects, blog, experience, resume, contact
- **Personal corner** — non-professional: hobbies, recommendations, goals, highlights, bio

## Stack
- Next.js 16 (App Router, Turbopack)
- Bun (package manager)
- TypeScript (strict mode)
- Tailwind CSS v4 with @tailwindcss/postcss
- MDX for blog posts and project case studies
- Vercel hobby plan — fully static, no backend, no API routes

## Architecture
Two Next.js route groups in `app/`:
- `(professional)/` — has its own layout.tsx, nav, and theme
- `(personal)/` — has its own layout.tsx, nav, and theme

Both sides link to each other via a single hyperlink in their respective layouts.
Blog posts live under `(professional)/blog/[slug]` and are the single source of truth.
The personal corner's blog page links to the same slugs.

## Directory Structure
```
app/
  (professional)/
    layout.tsx
    page.tsx
    blog/[slug]/page.tsx
    projects/[slug]/page.tsx
    experience/page.tsx
    resume/page.tsx
    contact/page.tsx
  (personal)/
    layout.tsx
    corner/
      page.tsx
      blog/page.tsx
      hobbies/page.tsx
      recommendations/page.tsx
      goals/page.tsx
      highlights/page.tsx

content/
  blog/*.mdx
  projects/*.mdx
  data/
    experience.json
    recommendations.json
    highlights.json
    goals.json

lib/
  content.ts       — blog MDX parsing, reading time, typed
  projects.ts      — project MDX parsing, typed
  data.ts          — JSON data helpers, typed

components/
  professional/    — exclusive to pro side
  personal/        — exclusive to personal corner
  shared/          — used by both sides

public/
  resume.pdf
```

## Content Schemas

### Blog post frontmatter
```yaml
title: string
date: string        # ISO 8601
summary: string
tags: string[]
# readingTime is NOT in frontmatter — computed at build time in lib/content.ts
```

### Project frontmatter
```yaml
title: string
date: string        # ISO 8601
summary: string
techStack: string[]
githubUrl: string   # optional
liveUrl: string     # optional
featured: boolean
```

## Key Constraints
- No backend, no database, no API routes
- Everything statically generated at build time via generateStaticParams()
- No OG image generation (planned later)
- No RSS feed (planned later)
- Reading time computed in lib/content.ts using the `reading-time` package
- Vercel telemetry disabled: NEXT_TELEMETRY_DISABLED=1 in .env.local
- bun is the package manager — never suggest npm or yarn commands

## TypeScript
- strict: true in tsconfig.json
- Path aliases: @/components, @/lib, @/content

## Commands
```bash
bun run dev      # local development
bun run build    # production build
bun run lint     # eslint
```

## What NOT to do
- Do not add a backend or database
- Do not mix (professional) and (personal) layout components
- Do not put readingTime in MDX frontmatter
- Do not install UI libraries (no shadcn, no radix, no framer-motion) unless explicitly asked
- Do not generate or modify public/resume.pdf
```