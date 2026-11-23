# NobatYar — Design System (implemented)

## Visual foundations

- **Primary:** `--deep`, `--aqua`. Text: `--ink`, `--ink-2`; surfaces: `--bg`, `--surface`, `--border`.
- **Pastel categories:** six shared pairs `--tone-{mint,blue,peach,violet,pink,sand}-{bg,ink}` for specialty and condition cards. Category colors intentionally differ while sharing a palette.
- **Typography:** Vazirmatn; `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`; dedicated responsive `--text-hero` and mobile hero exception for legibility. Weights and line heights come from shared tokens.
- **Spacing:** 4/8/12/16/20px increments (`--space-1…5`), section rhythm `--space-section` / `--space-section-mobile`, section heading spacing `--space-heading`. Small approved per-section spacing adjustments remain in local CSS.
- **Shape:** shared 12/16/20/24px radii and pill; card shadows and motion timings are tokenized.
- **Layout:** 1200px maximum container with 24px desktop or 16px mobile side padding.

## Buttons

All existing call-to-action links use `src/components/Button.jsx` + `src/styles/buttons.css`; variants are `primary`, `secondary`, `ghost`, `text`, with `inverse`/`block`/size options. Icon-only controls use `ui-icon-button`. Shared hover, focus, reduced-motion and disabled behavior live in the common stylesheet. Component CSS handles placement only.

Examples:

- **Primary** — `دریافت نوبت` on doctor cards.
- **Secondary** — `مشاهده همه تخصص‌ها` and `مشاهده پزشکان بیشتر`.
- **Ghost** — hero `پیدا کردن پزشک`.
- **Inverse ghost** — footer `پیدا کردن پزشک`.
- **Text** — `مشاهده موارد بیشتر` beneath common conditions.
- **Icon controls** — search, profile and calendar arrows.

## Content and responsive layout

Desktop: two-column hero with the appointment card and anchored floating details at left, right-aligned heading and calendar at right; four doctor cards. Mobile ≤768px: stacked hero, one-column benefits, two-column specialties, horizontal doctor-card scroller; conditions use three columns (two on very narrow screens). Tablet uses its own navigation and grid rules.

Four sample doctor photos are in `public/images/doctors`; these are illustrative, fictional portraits—not photos of real practitioners.

## Scope

This is a landing-page frontend prototype. Backend search, booking, login and disease-specific doctor-list pages are not implemented. Empty/placeholder navigation is intentionally not presented as a functioning service.
