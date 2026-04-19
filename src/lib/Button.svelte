<script lang="ts">
  import type { Snippet } from 'svelte'

  export type Color = 'green' | 'yellow' | 'gray' | 'blue' | 'cyan' | 'fuchsia' | 'emerald'
  export type Variant = 'solid' | 'soft' | 'outline'
  export type Size = 'md' | 'sm'

  let {
    color = 'green',
    variant = 'solid',
    size = 'md',
    onclick,
    children,
    class: extraClass = '',
  }: {
    color?: Color
    variant?: Variant
    size?: Size
    onclick?: (e: MouseEvent) => void
    children: Snippet
    class?: string
  } = $props()

  const styles: Record<Variant, Record<Color, string>> = {
    solid: {
      green: 'bg-wordle-green hover:bg-wordle-green/80 text-white',
      yellow: 'bg-wordle-yellow hover:bg-wordle-yellow/80 text-black',
      gray: 'bg-wordle-gray hover:bg-wordle-gray/80 text-wordle-text',
      blue: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg',
      cyan: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg',
      fuchsia: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg',
      emerald: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg',
    },
    soft: {
      green: 'bg-wordle-green/20 hover:bg-wordle-green/30 text-wordle-green border border-wordle-green',
      yellow: 'bg-wordle-yellow/20 hover:bg-wordle-yellow/30 text-wordle-yellow border border-wordle-yellow',
      gray: 'bg-wordle-gray/20 hover:bg-wordle-gray/30 text-wordle-text border border-wordle-gray',
      blue: 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500',
      cyan: 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400',
      fuchsia: 'bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-400',
      emerald: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400',
    },
    outline: {
      green: 'border border-wordle-green text-wordle-green hover:bg-wordle-hover',
      yellow: 'border border-wordle-yellow text-wordle-yellow hover:bg-wordle-yellow/10',
      gray: 'border border-wordle-border text-wordle-dim hover:bg-wordle-hover',
      blue: 'border border-blue-500 text-blue-400 hover:bg-blue-600/10',
      cyan: 'border border-cyan-400 text-cyan-300 hover:bg-cyan-500/10',
      fuchsia: 'border border-fuchsia-400 text-fuchsia-300 hover:bg-fuchsia-500/10',
      emerald: 'border border-emerald-400 text-emerald-300 hover:bg-emerald-500/10',
    },
  }

  const sizeClasses: Record<Size, string> = {
    md: 'w-full py-2.5 rounded-lg',
    sm: 'text-xs px-3 py-1.5 rounded',
  }
</script>

<button
  type="button"
  {onclick}
  class="inline-flex items-center justify-center gap-2 font-semibold transition-colors cursor-pointer {sizeClasses[size]} {styles[variant][color]} {extraClass}"
>
  {@render children()}
</button>
