# WiseXpense

A smart money manager that reads your spending like a story — what happened,
why it matters, and the one thing worth doing about it.

This repository currently holds the **frontend**, rebuilt from the Claude
Design source `WiseXpense.dc.html`.

## Running it

```bash
cd client
npm install
npm run dev
```

Then open http://localhost:3000.

## Screens

| Route        | What it is                                                             |
| ------------ | ---------------------------------------------------------------------- |
| `/`          | Landing page — hero card stack, narrated-feed preview, how it works    |
| `/signin`    | Split sign-in; any submit walks into the dashboard (no auth backend)   |
| `/dashboard` | Overview, Budgets, Goals and Accounts tabs                             |

## Layout

```
client/
├── app/                  # App Router entries — one per screen
│   ├── globals.css       # Design tokens, keyframes, elevation utilities
│   ├── layout.tsx        # Newsreader + Public Sans wiring
│   ├── page.tsx          # Landing
│   ├── signin/
│   └── dashboard/
├── components/
│   ├── Logo.tsx          # Two-tone piggy-bank mark
│   ├── landing/
│   ├── signin/
│   └── dashboard/
├── hooks/useReveal.ts    # IntersectionObserver scroll reveal
└── lib/
    ├── data.ts           # Demo transactions, budgets, goals, accounts
    ├── tone.ts           # Palette + severity → colour mappings
    └── types.ts
```

## Design system

Tokens live in `client/app/globals.css` under `@theme`, so Tailwind utilities
like `bg-navy` and `text-gold` come straight from the design source:

| Token           | Value     | Role                          |
| --------------- | --------- | ----------------------------- |
| `cream`         | `#FDF6E3` | Page ground                   |
| `panel`         | `#FFFDF5` | Raised cards                  |
| `band`          | `#F6EDCF` | Tinted section bands          |
| `navy`          | `#0C2340` | Ink, dark surfaces            |
| `gold`          | `#B58900` | Primary accent                |
| `sand`          | `#E9C46A` | Accent on navy                |
| `danger`        | `#DC322F` | Overspend                     |
| `success`       | `#5B7C00` | Income, headroom              |

Type is **Newsreader** (serif — headings and every figure) over **Public Sans**
(UI text), loaded via `next/font`.

All data is static demo content in `client/lib/data.ts`; there is no API layer
yet. The previous Python/SimpleFIN backend remains in git history.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4

## License

MIT
