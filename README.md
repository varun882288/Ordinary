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

