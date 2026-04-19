<script lang="ts">
  import type { Snippet } from 'svelte'
  import Button from './Button.svelte'
  import type { Color, Size } from './Button.svelte'

  let {
    color = 'green',
    enabled = false,
    size = 'sm',
    onclick,
    children,
    class: extraClass = '',
  }: {
    color?: Color
    enabled?: boolean
    size?: Size
    onclick?: (e: MouseEvent) => void
    children: Snippet
    class?: string
  } = $props()
</script>

<Button
  color={enabled ? color : 'gray'}
  variant={enabled ? 'soft' : 'outline'}
  {size}
  {onclick}
  class={extraClass}
>
  {@render children()}
</Button>
