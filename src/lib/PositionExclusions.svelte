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
  <span class="text-sm text-gray-400">Forbid letters at position</span>
  <div class="flex gap-2">
    {#each values as val, i (i)}
      <input
        type="text"
        autocomplete="off"
        value={val.toUpperCase()}
        oninput={(e) => update(i, (e.target as HTMLInputElement).value)}
        placeholder={`${i + 1}`}
        class="w-16 h-12 text-center text-sm font-bold uppercase tracking-wider bg-gray-900 text-red-400 placeholder:text-gray-600 border-2 border-gray-700 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
      />
    {/each}
  </div>
</div>
