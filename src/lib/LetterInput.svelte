<script lang="ts">
  interface Props {
    value: string
    index: number
    oninput: (value: string) => void
  }

  let { value, index, oninput }: Props = $props()
  let inputEl: HTMLInputElement

  $effect(() => {
    if (inputEl) inputEl.value = value.toUpperCase()
  })

  function focusSibling(offset: number) {
    const target = document.querySelector<HTMLInputElement>(
      `[data-letter-index="${index + offset}"]`,
    )
    target?.focus()
    target?.select()
  }

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement
    const letter = input.value.slice(-1).toLowerCase()

    if (letter && !/[a-z]/.test(letter)) {
      input.value = value.toUpperCase()
      return
    }

    oninput(letter)
    if (letter) focusSibling(1)
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Backspace' && !value) {
      e.preventDefault()
      focusSibling(-1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusSibling(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusSibling(1)
    }
  }
</script>

<input
  bind:this={inputEl}
  data-letter-index={index}
  type="text"
  maxlength="1"
  autocomplete="off"
  autocapitalize="characters"
  class="w-16 h-16 text-center text-3xl font-bold uppercase bg-wordle-bg text-wordle-text caret-transparent border-2 border-wordle-border rounded-lg focus:border-wordle-dim focus:outline-none transition-colors"
  value={value.toUpperCase()}
  oninput={handleInput}
  onkeydown={handleKeydown}
  onfocus={(e) => (e.target as HTMLInputElement).select()}
/>
