# Florén — AI Enterprise Brand Compliance Platform

Enterprise AI brand-compliance and governance platform by Aurevia Global.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Dashboard** — Real-time compliance metrics and governance overview
- **Brand Rulebook** — Manage brand rules, terminology, and guidelines
- **Content Checker** — AI-powered content analysis for brand compliance
- **Magic Fix** — Automated AI corrections for brand violations
- **Review Queue** — Collaborative content review workflow
- **Reports & History** — Compliance analytics and audit trails
- **Settings & Tutorial** — Configuration, API keys, and guided tutorials

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React Icons
- Recharts

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard
│   ├── rulebook/          # Brand rule management
│   ├── content-checker/   # Content compliance checking
│   ├── magic-fix/         # AI auto-correction
│   ├── review-queue/      # Content review workflow
│   ├── reports/           # Analytics and reporting
│   └── settings/          # Configuration and tutorials
├── components/
│   ├── layout/            # AppShell, Sidebar, Header
│   └── ui/                # Reusable UI components
├── lib/
│   ├── design-tokens.ts   # Design system tokens
│   └── utils.ts           # Utility functions
└── globals.css            # Global styles
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## License

Proprietary — Aurevia Global