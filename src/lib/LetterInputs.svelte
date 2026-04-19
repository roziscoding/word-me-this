<script lang="ts">
  import LetterInput from './LetterInput.svelte'

  interface Props {
    letters: string[]
    onchange: (letters: string[]) => void
  }

  let { letters, onchange }: Props = $props()

  function update(index: number, value: string) {
    const next = [...letters]
    next[index] = value
    onchange(next)
  }
</script>

<div class="flex gap-2 justify-center">
  {#each letters as letter, i (i)}
    <LetterInput value={letter} index={i} oninput={(v) => update(i, v)} />
  {/each}
</div>
