<script lang="ts">
  interface Props {
    words: string[]
    onrestore: (word: string) => void
  }

  let { words, onrestore }: Props = $props()
</script>

{#if words.length > 0}
  <section class="mt-6 bg-wordle-surface border border-wordle-border rounded-lg p-4">
    <h2 class="text-sm text-wordle-dim mb-3">
      Excluded ({words.length}) — click to restore
    </h2>
    <div class="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
      {#each words as word (word)}
        <button
          type="button"
          onclick={() => onrestore(word)}
          class="font-mono uppercase text-sm px-2 py-1 rounded border border-wordle-border text-wordle-dim line-through hover:border-wordle-green hover:text-wordle-green hover:no-underline transition-colors cursor-pointer"
        >
          {word}
        </button>
      {/each}
    </div>
  </section>
{/if}
