<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity'
  import LetterInputs from './lib/LetterInputs.svelte'
  import LettersInput from './lib/LettersInput.svelte'
  import Confetti from './lib/Confetti.svelte'
  import RemovedList from './lib/RemovedList.svelte'
  import WelcomeModal from './lib/WelcomeModal.svelte'
  import WordList from './lib/WordList.svelte'
  import { fiveLetterWords } from './lib/words'

  let letters = $state(['', '', '', '', ''])
  let excluded = $state('')
  let required = $state('')
  let forbiddenPositions = $state(['', '', '', '', ''])
  let noDuplicates = $state(false)
  let cheaty = $state(false)
  let removed = $state(new SvelteSet<string>())

  const filtered = $derived.by(() => {
    const excludedSet = new Set(excluded)
    const requiredArr = [...required]
    const forbiddenSets = forbiddenPositions.map((s) => new Set(s))
    return fiveLetterWords.filter(
      (word) =>
        !removed.has(word) &&
        letters.every((letter, i) => !letter || word[i] === letter) &&
        ![...word].some((c) => excludedSet.has(c)) &&
        requiredArr.every((c) => word.includes(c)) &&
        [...word].every((c, i) => !forbiddenSets[i].has(c)) &&
        (!noDuplicates || new Set(word).size === word.length),
    )
  })

  const allGreen = $derived(letters.every((l) => l !== ''))

  const hasInput = $derived(
    letters.some((l) => l !== '') ||
      excluded !== '' ||
      required !== '' ||
      forbiddenPositions.some((s) => s !== '') ||
      removed.size > 0,
  )

  function clear() {
    letters = ['', '', '', '', '']
    excluded = ''
    required = ''
    forbiddenPositions = ['', '', '', '', '']
    removed.clear()
    const first = document.querySelector<HTMLInputElement>('[data-letter-index="0"]')
    first?.focus()
  }
</script>

<WelcomeModal />
<Confetti active={allGreen} />

<main class="min-h-screen bg-gray-950 text-gray-100 p-6 sm:p-10">
  <div class="max-w-6xl mx-auto">
    <header class="mb-8 text-center">
      <h1 class="text-4xl font-bold text-gray-100">Word Me This</h1>
      <p class="text-gray-400 mt-2">Type letters in the positions you know</p>
    </header>

    <LetterInputs letters={letters} onchange={(next) => (letters = next)} />

    <div class="mt-6 flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onclick={() => (noDuplicates = !noDuplicates)}
        class="text-xs px-3 py-1.5 rounded border hover:bg-gray-800 transition-colors {noDuplicates ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-gray-700'}"
      >
        {noDuplicates ? '🚫 No duplicates ON' : '🚫 Hide duplicates'}
      </button>
      <button
        type="button"
        onclick={() => (cheaty = !cheaty)}
        class="text-xs px-3 py-1.5 rounded border transition-colors {cheaty
          ? 'text-purple-400 border-purple-700 bg-purple-900/20'
          : 'text-gray-400 border-gray-700 hover:bg-gray-800'}"
      >
        {cheaty ? '😈 Cheaty Mode ON' : '😈 Cheaty Mode'}
      </button>
    </div>

    {#if cheaty}
      <div class="mt-6 flex flex-wrap justify-center gap-6">
        <LettersInput
          label="Must contain"
          value={required}
          onchange={(v) => (required = v)}
          placeholder="e.g. AE"
          textColor="text-yellow-400"
          focusBorder="focus:border-yellow-500"
        />
        <LettersInput
          label="Exclude letters"
          value={excluded}
          onchange={(v) => (excluded = v)}
          placeholder="e.g. XYZ"
          textColor="text-red-400"
          focusBorder="focus:border-red-500"
        />
      </div>
    {/if}

    <div class="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
      <span>{filtered.length.toLocaleString()} words</span>
      {#if hasInput}
        <button
          type="button"
          onclick={clear}
          class="px-3 py-1 rounded border border-gray-700 hover:bg-gray-800 transition-colors"
        >
          Clear
        </button>
      {/if}
    </div>

    <section class="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
      <WordList
        words={filtered}
        letters={letters}
        onremove={(word) => removed.add(word)}
      />
    </section>

    <RemovedList
      words={[...removed].sort()}
      onrestore={(word) => removed.delete(word)}
    />
  </div>
</main>
