<script lang="ts">
  import type { Snippet } from 'svelte'

  type Color = 'green' | 'yellow' | 'gray' | 'blue'

  let {
    color = 'green',
    onclick,
    children,
    class: extraClass = '',
  }: {
    color?: Color
    onclick?: (e: MouseEvent) => void
    children: Snippet
    class?: string
  } = $props()

  const colorClasses: Record<Color, string> = {
    green: 'bg-wordle-green hover:bg-wordle-green/80 text-white',
    yellow: 'bg-wordle-yellow hover:bg-wordle-yellow/80 text-black',
    gray: 'bg-wordle-gray hover:bg-wordle-gray/80 text-wordle-text',
    blue: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg',
  }
</script>

<button
  type="button"
  {onclick}
  class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer {colorClasses[color]} {extraClass}"
>
  {@render children()}
</button>
