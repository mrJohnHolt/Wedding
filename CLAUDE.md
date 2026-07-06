# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, multi-page wedding website for Bex & Daniel (August 22, 2026). No build step, no framework, no package manager — plain HTML/CSS/JS served as-is. Open any `.html` file directly in a browser (or use a static file server) to preview.

## Structure

Each top-level page is a standalone HTML file that duplicates the same header, countdown, and nav markup (there is no templating/includes system):

- `index.html` — homepage: couple's story, "how we met", wedding details grid, hidden RSVP section
- `ceremony.html`, `directions.html`, `reception.html`, `evening.html`, `accommodation.html`, `dresscode.html`, `gifts.html` — one page per wedding-details card, linked from the desktop/mobile nav and from the "Wedding Details" card grid
- `css/style.css` — the real stylesheet, linked by every page
- `css/gallery.css` — small additional stylesheet (gallery-specific)
- `js/main.js` — shared behaviour for all pages (see below)
- `img/` — photos and venue images

Because markup is duplicated per page, a change to shared structure (header, nav, wedding-details cards, footer) must be repeated across every HTML file by hand — grep for the section before editing to find all copies.

Files ignored/excluded from the real site (per `.gitignore`): `/style.css` (legacy root stylesheet, unused — real styles live in `css/style.css`), `*Bak.html` / `*.bakhtml` (backups, e.g. `eveningBak.html`, `photos.bakhtml`), `upload.html`.

## `js/main.js` behaviour (applies to every page that includes it)

- **Countdown**: computes days/hours/mins to the wedding datetime (`2026-08-22T12:30:00`) and renders it into `.time-card[data-unit="..."]` elements with a "tear-off calendar leaf" animation. Switches to a "Today's The Big Day" sign once the date passes.
- **Confetti/petal field**: spawns decorative particles (petal/square/bell/heart) into `#petal-field`, with density and size scaling up as the wedding date approaches.
- **Gifts easter egg**: the "Gifts" wedding-details card's button dodges the cursor on hover (couple don't want gifts).
- **Smooth scroll**: intercepts in-page `nav a` anchors (`href="#..."`) for smooth scrolling; external links behave normally.
- **RSVP form**: currently hidden (`hidden` attribute on the `#rsvp` section, nav link commented out) but the JS still wires up its submit handler, which builds a `mailto:` link (to `shuttbrownsayido@gmail.com`) with form values rather than submitting anywhere server-side.
- **Scroll-in fade**: `.section` elements fade/slide in via `IntersectionObserver`.

Since `#rsvp` is `hidden` on every page but the submit-handler wiring is unconditional, re-enabling RSVP only requires removing the `hidden` attribute and un-commenting the nav link — no JS changes needed.

## Editing conventions specific to this content

- The reception/evening venue is **"Hidden Oaks"** (not "Hidden Oakes" — a previously-fixed typo across `reception.html` and `evening.html`).
- Content edits (wording, notices, addresses) are typically requested per-page and often need mirroring across `reception.html`/`evening.html` (same venue) or across the nav-duplicated "Wedding Details" card grid on every page.
- Copy is UK English.
