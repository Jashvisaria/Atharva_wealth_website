# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo actually is

This is the **Atharva Wealth** marketing website: a set of standalone static HTML pages (Tailwind CDN + DaisyUI CDN + vanilla `<script>` blocks), not a compiled React/Vite app. There is a `package.json`/`vite.config.ts`/`public/src/*.tsx` scaffold left over from `npm create vite`, but **no HTML page loads it** (none reference `/src/main.tsx` or any module script) — treat the React/TS scaffold under `public/src/` as unused/vestigial unless a task specifically asks to wire it up. Do not assume changes to `public/src/*.tsx` affect the live site.

The real pages, each fully self-contained (own `<style>` and `<script>` blocks, own copy of the Tailwind config override), live at the repo root:

`index.html`, `about.html`, `services.html`, `contact.html`, `founder.html`, `insights.html`, `pms.html`, `aif.html`, `tools.html`, `dsc.html`, `mutual-funds.html`, `goal-planning.html`, `success.html`.

Every page independently loads:
```html
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/daisyui@4.12.14/dist/full.min.css" rel="stylesheet">
```
and defines the same brand `tailwind.config` inline (obsidian/gold palette, Playfair Display serif + Montserrat sans). **When changing brand colors/fonts/theme, the inline `tailwind.config` script block must be updated in every page**, not in `tailwind.config.js` (that file only affects the unused Vite build).

## Commands

- `npm run dev` — starts Vite dev server (only useful for the unused React scaffold; does not serve the real HTML pages meaningfully since they're not part of that app).
- `npm run build` — `tsc -b && vite build`; builds the multi-page entries listed in `vite.config.ts` (`rollupOptions.input` enumerates every root `.html` file) into `dist/`. This is what Vercel runs (`vercel.json`: `buildCommand: npm run build`, `outputDirectory: dist`).
- `npm run lint` — ESLint over `.ts`/`.tsx` only (flat config in `eslint.config.js`); does not lint the `.html` files, which is where almost all real logic lives.
- `npm run preview` — serve the `dist/` build locally.
- To actually preview a static page as it will appear in production, just open the `.html` file directly in a browser (or serve the repo root with any static file server) — no build step is required for HTML/CSS/JS-only changes.

There is no test suite and no dedicated HTML/lint tooling in this repo.

### Python backend (separate, minimal)

- `app.py` — a small Flask app (`/submit-lead` POST endpoint) that forwards form data to `google_sheets.py`'s `append_lead()`, which writes rows into a Google Sheet via `gspread` + a `credentials.json` service-account file (not checked in; must be supplied to run this locally). Run with `python app.py` (listens on `127.0.0.1:5000`).
- `requirements.txt` is a broad, unpruned `pip freeze`-style dump (includes Jupyter, Streamlit, yfinance, pandas, etc.) — most of it is unrelated to this app. The packages `app.py`/`google_sheets.py` actually need are just `Flask`, `flask-cors`, `gspread`, `oauth2client`, `pytz`.

## Lead-capture: two different mechanisms coexist

Forms on different pages submit leads through **different** channels — don't assume they're unified:

- `index.html` (investor-DNA quiz) and `contact.html` submit directly to a **Google Apps Script Web App** URL (`https://script.google.com/macros/s/.../exec`) via a hidden iframe/form POST or `fetch(..., {mode:'no-cors'})`. This bypasses `app.py` entirely.
- `tools.html` calls `https://atharvawealth.com/api/submit-lead`, i.e. the **Flask** endpoint in `app.py`.

When editing lead-capture forms, check which mechanism the specific page uses before changing field names — the Apps Script endpoint and the Flask/`google_sheets.py` endpoint expect different payloads (Flask/`google_sheets.py` expects `FullName`, `WhatsApp`, `Portfolio`, `InvestorDNA`, `Message`).

## Editing conventions across pages

- Each page repeats the same nav/mobile-menu markup and toggle script (`document.getElementById('mobile-menu').classList.toggle('hidden')`) and the same glass-panel/glass-card CSS utility classes defined inline. There is no shared partial/include system — a nav or footer change must be copy-pasted into every page that needs it.
- Because Tailwind is loaded via the CDN JIT script (not the PostCSS build in `tailwind.config.js`/`postcss.config.js`), arbitrary utility classes work immediately in any page without a build step; the `content` globs in `tailwind.config.js` are irrelevant to these pages.
