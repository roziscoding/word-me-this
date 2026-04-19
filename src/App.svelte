<script lang="ts">
  import pluralize from 'pluralize'
  import { SvelteSet } from 'svelte/reactivity'
  import LetterInputs from './lib/LetterInputs.svelte'
  import LettersInput from './lib/LettersInput.svelte'
  import Confetti from './lib/Confetti.svelte'
  import RemovedList from './lib/RemovedList.svelte'
  import ToggleableButton from './lib/ToggleableButton.svelte'
  import WelcomeModal from './lib/WelcomeModal.svelte'
  import WordList from './lib/WordList.svelte'
  import { fiveLetterWords } from './lib/words'

  let letters = $state(['', '', '', '', ''])
  let excluded = $state('')
  let required = $state('')
  let forbiddenPositions = $state(['', '', '', '', ''])
  let noDuplicates = $state(false)
  let hidePlurals = $state(false)
  let cheaty = $state(false)
  let removed = $state(new SvelteSet<string>())
  let welcomeOpen = $state(localStorage.getItem('welcome-dismissed') !== '1')
  let shareCopied = $state(false)

  function showWelcome() {
    localStorage.removeItem('welcome-dismissed')
    welcomeOpen = true
  }

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Word Me This', url })
        return
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      shareCopied = true
      setTimeout(() => (shareCopied = false), 2000)
    } catch {
      // ignore
    }
  }

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
        (!noDuplicates || new Set(word).size === word.length) &&
        (!hidePlurals || !pluralize.isPlural(word)),
    )
  })

  const allGreen = $derived(letters.every((l) => l !== ''))

  const hasInput = $derived(
    letters.some((l) => l !== '') ||
      excluded !== '' ||
      required !== '' ||
      forbiddenPositions.some((s) => s !== '') ||
      removed.size > 0 ||
      noDuplicates ||
      hidePlurals ||
      cheaty,
  )

  function clear() {
    letters = ['', '', '', '', '']
    excluded = ''
    required = ''
    forbiddenPositions = ['', '', '', '', '']
    noDuplicates = false
    hidePlurals = false
    cheaty = false
    removed.clear()
  }
</script>

<WelcomeModal bind:open={welcomeOpen} />
<Confetti active={allGreen} />

<main
  class="h-dvh overflow-hidden bg-wordle-bg text-wordle-text flex flex-col"
  style="padding: max(1.5rem, env(safe-area-inset-top)) max(1.5rem, env(safe-area-inset-right)) max(1.5rem, env(safe-area-inset-bottom)) max(1.5rem, env(safe-area-inset-left));"
>
  <div class="max-w-6xl mx-auto w-full flex-1 min-h-0 flex flex-col">
    <div class="absolute top-4 right-4 flex items-center gap-4 text-sm text-wordle-dim">
      <button
        type="button"
        onclick={showWelcome}
        class="hover:text-wordle-text underline cursor-pointer"
      >
        What's this?
      </button>
      <button
        type="button"
        onclick={share}
        aria-label="Share"
        class="flex items-center gap-1 cursor-pointer transition-colors {shareCopied ? 'text-wordle-green' : 'hover:text-wordle-text'}"
      >
        {#if shareCopied}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span class="text-xs">Copied!</span>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        {/if}
      </button>
      <a
        href="https://github.com/roziscoding/word-me-this"
        target="_blank"
        rel="noopener"
        title="GitHub"
        aria-label="GitHub"
        class="hover:text-wordle-text"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22 0 1.6-.02 2.89-.02 3.28 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"></path>
        </svg>
      </a>
    </div>
    <div class="mt-10">
      <LetterInputs letters={letters} onchange={(next) => (letters = next)} />
    </div>

    <div class="mt-6 flex flex-wrap justify-center gap-2">
      <ToggleableButton
        color="cyan"
        enabled={noDuplicates}
        onclick={() => (noDuplicates = !noDuplicates)}
      >
        {noDuplicates ? '🚫 Hide duplicates ON' : '🚫 Hide duplicates'}
      </ToggleableButton>
      <ToggleableButton
        color="emerald"
        enabled={hidePlurals}
        onclick={() => (hidePlurals = !hidePlurals)}
      >
        {hidePlurals ? '📚 Hide plurals ON' : '📚 Hide plurals'}
      </ToggleableButton>
      <ToggleableButton
        color="fuchsia"
        enabled={cheaty}
        onclick={() => (cheaty = !cheaty)}
      >
        {cheaty ? '😈 Cheaty Mode ON' : '😈 Cheaty Mode'}
      </ToggleableButton>
    </div>

    {#if cheaty}
      <div class="mt-6 flex justify-center gap-4">
        <LettersInput
          label="Must contain"
          value={required}
          onchange={(v) => (required = v)}
          placeholder="e.g. AE"
          textColor="text-wordle-yellow"
          focusBorder="focus:border-wordle-yellow"
        />
        <LettersInput
          label="Exclude letters"
          value={excluded}
          onchange={(v) => (excluded = v)}
          placeholder="e.g. XYZ"
          textColor="text-wordle-gray"
          focusBorder="focus:border-wordle-gray"
        />
      </div>
    {/if}

    {#if hasInput}
      <div class="mt-4 flex items-center justify-center text-sm text-wordle-dim">
        <button
          type="button"
          onclick={clear}
          class="px-3 py-1 rounded border border-wordle-border hover:bg-wordle-hover transition-colors"
        >
          Clear
        </button>
      </div>
    {/if}

    <section class="mt-8 bg-wordle-surface border border-wordle-border rounded-lg p-6 flex-1 min-h-0 flex flex-col">
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
