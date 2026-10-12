# VoltMart — mobile app UI study

A from-scratch, front-end-only rebuild of a mobile wallet/plans app layout.
Written as a UI and architecture exercise: no framework, no build step, no backend.

> **This is a non-functional demo.** Every figure on screen is fictional sample data.
> Nothing authenticates, nothing is purchased, and no payment is processed.

## Run it

Open `index.html` directly in a browser — no server or install needed.

Any value works on the login form; it just routes you to the dashboard.

## What's in here

```
index.html        entry point, demo strip, overlay + toast hosts
css/styles.css    the whole design system (tokens at the top)
js/data.js        fictional sample data + demo session state
js/i18n.js        English/Hindi strings + money formatter
js/app.js         hash router, views, sheets, toasts
```

## Routes

| Hash | Screen |
|---|---|
| `#/login` | sign in |
| `#/register` | demo registration |
| `#/home` | balance hero, quick actions, featured card, activity feed |
| `#/shop` | plan cards with Fixed / Welfare / Activity tabs |
| `#/team` | referral code, share sheet, network levels |
| `#/my` | wallets, menu, logout sheet |
| `#/recharge` · `#/withdraw` | amount entry + confirmation sheet |
| `#/transactions` | transaction list |
| `#/about` | static info |

## Architecture notes

**Hash router.** `app.js` maps hash segments to view functions. A route guard
sends unauthenticated visitors on tab routes back to `#/login`.

**Views are template functions.** Each returns an HTML string that replaces
`#app`'s contents, then wires its own event handlers. Simple and easy to follow;
a real app would reach for a virtual DOM instead.

**Design tokens.** Colours, radii, shadows, and fonts are CSS custom properties
at the top of `styles.css`. The visual language is "clay": a soft blue page,
white cards, large radii, and inset highlight/shadow pairs for depth.

**i18n.** `t(key)` looks up the active language and falls back to English.
`applyStaticI18n()` also pushes translations into any `[data-i18n]` nodes that
live in `index.html` outside the router.

**`money(n)`** formats with `toLocaleString("en-IN", …)` so figures group as
₹1,25,000 rather than ₹125,000.

## Deliberate omissions

This build intentionally has no server, no database, no real authentication, no
payment or withdrawal processing, and no third-party branding. Those were left
out on purpose — if you're using this to learn, wiring up a real backend is the
interesting next step, and it's better done against your own data model.
