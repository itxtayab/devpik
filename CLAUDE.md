# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevPik (devpik.com) is a Next.js 16 site offering free browser-based developer tools, a tech blog, and backend-powered features (code sharing, URL shortener). Tools run client-side; Supabase powers analytics, admin, pastes, URL shortening, and blog management.

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build (also validates types/pages)
- `npm run lint` — ESLint
- No test framework is configured.

## Architecture

**Routing:** Next.js App Router with `@/*` path alias mapping to `./src/*`.

**Tool system:** Each tool follows a 3-file pattern:
1. **Data** — `src/lib/tools-data.ts` defines all tools (slug, category, metadata, FAQs). Categories: `text-tools`, `developer-tools`, `network-tools`, `json-tools`.
2. **Component** — `src/components/tools/<ToolName>.tsx` contains the UI/logic (client components).
3. **Routing** — `src/app/[category]/[tool]/page.tsx` is the catch-all page; `tool-renderer.tsx` maps slugs to dynamically-imported components via a switch statement.

**Adding a new tool** requires: adding an entry to `toolsData` in `tools-data.ts`, creating the component in `src/components/tools/`, adding the dynamic import and switch case in `tool-renderer.tsx`.

**Blog system:** Blog content is defined in `src/lib/blog-data.ts` as structured data (sections, FAQs). Rendered at `/blog/[slug]`.

**Supabase integration:**
- `src/lib/supabase/client.ts` — browser client (singleton)
- `src/lib/supabase/server.ts` — server client
- `src/lib/supabase/middleware.ts` — auth middleware
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**API routes** under `src/app/api/` handle: admin, analytics, contact, DNS lookup, feedback, IP check, pastes, URL shortening, speed test, newsletter subscriptions, page views.

**Backend-powered tools:** Code Share (`/p/[code]`) and URL Shortener (`/u/[code]`) use Supabase and have corresponding API routes.

**Styling:** Tailwind CSS v4 with PostCSS. Fonts: Inter (body) and Outfit (headings) via `next/font`.

**SEO:** `src/components/seo/StructuredData.tsx` emits JSON-LD. Each tool page generates structured data (SoftwareApplication, Breadcrumb, FAQ schemas). Sitemap at `src/app/sitemap.ts`, robots at `src/app/robots.ts`.

**Static generation:** Tool pages use `generateStaticParams` with `dynamicParams = false` — all valid tool routes are pre-rendered at build time.
