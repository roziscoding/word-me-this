# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `bun run dev` — Start Vite dev server (localhost:5173)
- `bun run build` — Production build to `/dist`
- `bun run preview` — Preview production build
- `bunx svelte-check` — Type-check Svelte and TypeScript files

No test or lint commands are configured.

## Architecture

Svelte 5 single-page app that helps solve Wordle-style puzzles by filtering 5-letter English words based on user constraints (known positions, required/excluded letters, per-position exclusions).

**Stack:** Svelte 5, Vite 6, Tailwind CSS 4, TypeScript

### Data flow

User inputs flow into reactive state in `App.svelte`, which derives a filtered word list from `src/lib/words.ts` (pre-filtered 5-letter words from `an-array-of-english-words`). The filtering logic lives entirely in a `$derived.by()` block in `App.svelte`.

### Key components (`src/lib/`)

- **LetterInput.svelte** — Single character input for a known position (0-4), with arrow-key/backspace navigation
- **LettersInput.svelte** — Multi-character input used for both "must contain" and "exclude letters" fields
- **WordList.svelte** — Virtual-scrolling responsive grid; highlights matching letters green, plurals yellow (via `pluralize`)
- **Confetti.svelte** — Canvas particle animation triggered when all 5 positions are filled
- **RemovedList.svelte** — Shows manually excluded words with click-to-restore
- **PositionExclusions.svelte** — Exists but is not currently used

### State shape (App.svelte)

- `letters: string[]` — 5-element array of known letters per position
- `excluded: string` — letters to exclude globally
- `required: string` — letters that must appear (visible in "cheaty" mode)
- `forbiddenPositions: string[]` — letters excluded per position
- `noDuplicates: boolean` — filter out words with repeated letters
- `cheaty: boolean` — toggles advanced filter UI
- `removed: SvelteSet<string>` — manually excluded words
