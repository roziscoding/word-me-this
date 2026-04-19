<script lang="ts">
  interface Props {
    label: string
    value: string
    onchange: (value: string) => void
    placeholder?: string
    textColor: string
    focusBorder: string
  }

  let { label, value, onchange, placeholder, textColor, focusBorder }: Props = $props()
  let inputEl: HTMLInputElement

  $effect(() => {
    if (inputEl) inputEl.value = value.toUpperCase()
  })

  function handle(e: Event) {
    const input = e.target as HTMLInputElement
    const clean = [
      ...new Set(
        input.value
          .toLowerCase()
          .split('')
          .filter((c) => /[a-z]/.test(c)),
      ),
    ].join('')
    onchange(clean)
  }
</script>

<label class="flex flex-col items-center gap-2 flex-1 min-w-0 max-w-64">
  <span class="text-sm text-wordle-dim">{label}</span>
  <input
    bind:this={inputEl}
    type="text"
    autocomplete="off"
    value={value.toUpperCase()}
    oninput={handle}
    {placeholder}
    class="w-full h-10 text-center text-lg font-bold uppercase tracking-widest bg-wordle-bg border-2 border-wordle-border rounded-lg focus:outline-none transition-colors {textColor} {focusBorder}"
  />
</label>
