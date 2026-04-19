<script lang="ts">
  import Button from './Button.svelte'

  let { open = $bindable(true) }: { open?: boolean } = $props()

  let dontShowAgain = $state(localStorage.getItem('welcome-dismissed') === '1')
  let level = $state<0 | 1 | 2>(0)
  let shared = $state(false)

  function dismiss() {
    if (dontShowAgain) {
      localStorage.setItem('welcome-dismissed', '1')
    } else {
      localStorage.removeItem('welcome-dismissed')
    }
    level = 0
    open = false
  }

  function share() {
    const url = window.location.href
    const shareData: ShareData = { title: 'Word Me This', url }

    if (typeof navigator.share === 'function') {
      navigator.share(shareData).catch((err: DOMException) => {
        if (err?.name === 'AbortError') return
        console.warn('navigator.share failed', err)
        copyToClipboard(url)
      })
      return
    }

    copyToClipboard(url)
  }

  function copyToClipboard(url: string) {
    const done = () => {
      shared = true
      setTimeout(() => (shared = false), 2000)
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => {
        legacyCopy(url) && done()
      })
      return
    }

    legacyCopy(url) && done()
  }

  function legacyCopy(text: string): boolean {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
  >
    <div class="bg-wordle-surface border border-wordle-border rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
      {#if level === 2}
        <h2 class="text-2xl font-bold text-wordle-text mb-4">Well...</h2>

        <p class="text-wordle-text text-sm leading-relaxed mb-6">
          There's no good way to tell you this but... You might be dumb...
          Share this page with a smarter friend and ask them to explain.
        </p>

        <Button color={shared ? 'green' : 'blue'} onclick={share}>
          {#if shared}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Link copied!
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Share this page
          {/if}
        </Button>
      {:else if level === 1}
        <h2 class="text-2xl font-bold text-wordle-text mb-4">Okay, for real this time 👇</h2>

        <p class="text-wordle-text text-sm leading-relaxed mb-4">
          You know Wordle? The game where you guess a 5-letter word? Yeah, that one. Sometimes you
          get stuck and your brain just blanks. This page shows you a big list of real 5-letter
          words so you can eyeball options instead of staring at the ceiling.
        </p>

        <div class="mb-4">
          <h3 class="text-sm font-semibold text-wordle-text mb-2">The boxes at the top</h3>
          <p class="text-sm text-wordle-dim leading-relaxed">
            Got a green letter in Wordle? Type it in the box that matches its position. The list
            below shrinks to only words that have that letter in that exact spot. Simple.
          </p>
        </div>

        <div class="mb-4">
          <h3 class="text-sm font-semibold text-wordle-text mb-2">The colors in the list</h3>
          <ul class="text-sm text-wordle-dim space-y-1.5">
            <li>
              <span class="text-wordle-green font-bold font-mono">Green letters</span> = the
              letters you already typed up top. Just a visual reminder.
            </li>
            <li>
              <span class="text-wordle-yellow font-mono">Yellow words</span> = plurals (like
              CARS, DOGS). Wordle answers are almost never plurals, so you can skip these.
            </li>
          </ul>
        </div>

        <div class="mb-4">
          <h3 class="text-sm font-semibold text-wordle-text mb-2">🚫 Hide duplicates button</h3>
          <p class="text-sm text-wordle-dim leading-relaxed">
            Click it to hide words with the same letter twice (like LLAMA). Wordle answers
            usually don't repeat letters, so this narrows things down a lot.
          </p>
        </div>

        <div class="mb-6">
          <h3 class="text-sm font-semibold text-wordle-text mb-2">😈 Cheaty Mode button</h3>
          <p class="text-sm text-wordle-dim leading-relaxed">
            Click it and two new boxes show up. In "Must contain" type the yellow letters Wordle
            gave you (the ones in the answer but in the wrong spot). In "Exclude letters" type
            the gray letters (the ones not in the answer at all). The list filters itself.
            That's it.
          </p>
        </div>
      {:else}
        <h2 class="text-2xl font-bold text-wordle-text mb-4">Welcome to Word Me This!</h2>

        <p class="text-wordle-text text-sm leading-relaxed mb-4">
          This is an interactive word list to help you think through your Wordle guesses — similar to
          what <a href="https://www.nytimes.com/2022/02/10/crosswords/best-wordle-tips.html" target="_blank" rel="noopener" class="text-wordle-green underline hover:text-wordle-green/80">NYT's Best Wordle Tips</a>
          recommends with sites like bestwordlist.com. It's not cheating — it's a thinking aid.
          You still have to pick the right word yourself!
        </p>

        <div class="mb-4">
          <h3 class="text-sm font-semibold text-wordle-text mb-2">How the colors work</h3>
          <ul class="text-sm text-wordle-dim space-y-1.5">
            <li>
              <span class="text-wordle-green font-bold font-mono">Green letters</span> — positions you've already filled in
            </li>
            <li>
              <span class="text-wordle-yellow font-mono">Yellow words</span> — plural forms, so you can spot them quickly
            </li>
          </ul>
        </div>

        <div class="mb-4">
          <h3 class="text-sm font-semibold text-wordle-text mb-2">Hide Duplicates 🚫</h3>
          <p class="text-sm text-wordle-dim leading-relaxed">
            Wordle answers rarely have repeated letters. Toggle this to hide words like
            <span class="font-mono">LLAMA</span> or <span class="font-mono">TEETH</span> and
            narrow things down.
          </p>
        </div>

        <div class="mb-6">
          <h3 class="text-sm font-semibold text-wordle-text mb-2">Cheaty Mode 😈</h3>
          <p class="text-sm text-wordle-dim leading-relaxed">
            There's also a <span class="text-wordle-yellow">Cheaty Mode</span> that lets you filter by
            required and excluded letters — basically entering your Wordle feedback directly. Use it
            at your own risk. We won't judge. Much.
          </p>
        </div>
      {/if}

      <label class="flex items-center gap-2 mb-4 mt-6 text-sm text-wordle-dim cursor-pointer select-none">
        <input
          type="checkbox"
          bind:checked={dontShowAgain}
          class="w-4 h-4 accent-wordle-green cursor-pointer"
        />
        Don't show me again
      </label>

      <Button color="green" onclick={dismiss}>
        {level === 2 ? 'Okay, nooow I get it' : 'Got it, let me play!'}
      </Button>

      {#if level === 0}
        <Button color="yellow" onclick={() => (level = 1)} class="mt-2">
          I don't get it...
        </Button>
      {:else if level === 1}
        <Button color="yellow" onclick={() => (level = 2)} class="mt-2">
          I still don't get it...
        </Button>
      {:else}
        <Button color="yellow" onclick={dismiss} class="mt-2">
          I give up, just let me play with it
        </Button>
      {/if}
    </div>
  </div>
{/if}
