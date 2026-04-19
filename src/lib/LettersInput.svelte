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

<label class="flex flex-col items-center gap-2">
  <span class="text-sm text-gray-400">{label}</span>
  <input
    bind:this={inputEl}
    type="text"
    autocomplete="off"
    value={value.toUpperCase()}
    oninput={handle}
    {placeholder}
    class="w-64 h-10 text-center text-lg font-bold uppercase tracking-widest bg-gray-900 border-2 border-gray-700 rounded-lg focus:outline-none transition-colors {textColor} {focusBorder}"
  />
</label>
