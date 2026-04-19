<script lang="ts">
  import pluralize from 'pluralize'

  interface Props {
    words: string[]
    letters: string[]
    onremove: (word: string) => void
  }

  let { words, letters, onremove }: Props = $props()

  const ROW_HEIGHT = 36
  const MIN_COL_WIDTH = 120
  const OVERSCAN = 5

  let container: HTMLDivElement
  let scrollTop = $state(0)
  let viewportHeight = $state(0)
  let containerWidth = $state(0)

  const columns = $derived(
    Math.max(2, Math.floor(containerWidth / MIN_COL_WIDTH) || 2),
  )

  const rows = $derived.by(() => {
    const out: string[][] = []
    for (let i = 0; i < words.length; i += columns) {
      out.push(words.slice(i, i + columns))
    }
    return out
  })

  const totalHeight = $derived(rows.length * ROW_HEIGHT)

  const visible = $derived.by(() => {
    const first = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN)
    const last = Math.min(
      rows.length,
      Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + OVERSCAN,
    )
    return rows.slice(first, last).map((row, i) => ({ row, index: first + i }))
  })

  $effect(() => {
    words
    if (container) {
      container.scrollTop = 0
      scrollTop = 0
    }
  })
</script>

{#if words.length === 0}
  <p class="text-center text-wordle-dim italic py-8">No matching words</p>
{:else if words.length === 1}
  <div class="flex flex-col items-center justify-center py-16 last-word-reveal">
    <button
      type="button"
      onclick={() => onremove(words[0])}
      title="Remove {words[0]}"
      class="font-mono uppercase tracking-[0.3em] text-5xl sm:text-7xl font-black text-wordle-green last-word-text cursor-pointer hover:text-red-400 transition-colors"
    >
      {words[0]}
    </button>
  </div>
{:else}
  <div
    bind:this={container}
    bind:clientHeight={viewportHeight}
    bind:clientWidth={containerWidth}
    onscroll={(e) => (scrollTop = (e.currentTarget as HTMLDivElement).scrollTop)}
    class="h-[60vh] overflow-y-auto"
  >
    <div style="height: {totalHeight}px; position: relative;">
      {#each visible as { row, index } (index)}
        <div
          class="absolute left-0 right-0 grid"
          style="top: {index * ROW_HEIGHT}px; height: {ROW_HEIGHT}px; grid-template-columns: repeat({columns}, minmax(0, 1fr));"
        >
          {#each row as word (word)}
            {@const plural = pluralize.isPlural(word)}
            <button
              type="button"
              onclick={() => onremove(word)}
              title="Remove {word}"
              class="font-mono uppercase tracking-wider text-lg flex items-center px-2 rounded hover:bg-wordle-gray/40 hover:line-through cursor-pointer transition-colors {plural ? 'text-wordle-yellow' : 'text-wordle-dim'}"
            >
              {#each word as char, i (i)}
                <span class={letters[i] ? 'text-wordle-green font-bold' : ''}>{char}</span>
              {/each}
            </button>
          {/each}
        </div>
      {/each}
    </div>
  </div>
{/if}
