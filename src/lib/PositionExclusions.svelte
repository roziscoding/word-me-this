<script lang="ts">
  interface Props {
    values: string[]
    onchange: (values: string[]) => void
  }

  let { values, onchange }: Props = $props()

  function update(i: number, raw: string) {
    const clean = [
      ...new Set(
        raw
          .toLowerCase()
          .split('')
          .filter((c) => /[a-z]/.test(c)),
      ),
    ].join('')
    const next = [...values]
    next[i] = clean
    onchange(next)
  }
</script>

<div class="flex flex-col items-center gap-2">
  <span class="text-sm text-wordle-dim">Forbid letters at position</span>
  <div class="flex gap-2">
    {#each values as val, i (i)}
      <input
        type="text"
        autocomplete="off"
        value={val.toUpperCase()}
        oninput={(e) => update(i, (e.target as HTMLInputElement).value)}
        placeholder={`${i + 1}`}
        class="w-16 h-12 text-center text-sm font-bold uppercase tracking-wider bg-wordle-bg text-wordle-absent placeholder:text-wordle-dim border-2 border-wordle-border rounded-lg focus:border-wordle-absent focus:outline-none transition-colors"
      />
    {/each}
  </div>
</div>
