# Word Me This

An interactive word list helper for Wordle — like [bestwordlist.com](https://bestwordlist.com), but a bit more cheaty. Filter 5-letter words by known positions, required letters, exclusions, and more to help you think through your next guess.

## Features

- **Position-based filtering** — enter known letters in their exact positions
- **Global exclusions** — remove words containing specific letters
- **Required letters** — ensure certain letters appear somewhere in the word
- **No duplicates toggle** — filter out words with repeated letters
- **Manual word exclusion** — click any word to remove it, click again to restore
- **Virtual-scroll grid** — handles large word lists efficiently
- **Confetti** — celebration animation when all 5 positions are filled

## Tech Stack

- Svelte 5
- Vite 6
- Tailwind CSS 4
- TypeScript

## Getting Started

```sh
bun install
bun run dev
```

Open [localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run build` | Production build to `/dist` |
| `bun run preview` | Preview production build |
| `bunx svelte-check` | Type-check Svelte and TypeScript files |

## Docker

```sh
docker build -t word-me-this .
docker run -p 80:80 word-me-this
```
