<script lang="ts">
  interface Props {
    words: string[]
    onrestore: (word: string) => void
  }

  let { words, onrestore }: Props = $props()
</script>

{#if words.length > 0}
  <section class="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
    <h2 class="text-sm text-gray-400 mb-3">
      Excluded ({words.length}) — click to restore
    </h2>
    <div class="flex flex-wrap gap-2">
      {#each words as word (word)}
        <button
          type="button"
          onclick={() => onrestore(word)}
          class="font-mono uppercase text-sm px-2 py-1 rounded border border-gray-700 text-gray-400 line-through hover:border-green-500 hover:text-green-400 hover:no-underline transition-colors cursor-pointer"
        >
          {word}
        </button>
      {/each}
    </div>
  </section>
{/if}
