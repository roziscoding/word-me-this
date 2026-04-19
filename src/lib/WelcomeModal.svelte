<script lang="ts">
  let open = $state(!localStorage.getItem('welcome-dismissed'))

  function dismiss() {
    localStorage.setItem('welcome-dismissed', '1')
    open = false
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    onkeydown={(e) => e.key === 'Escape' && dismiss()}
    onclick={(e) => e.target === e.currentTarget && dismiss()}
  >
    <div class="bg-wordle-surface border border-wordle-border rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
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

      <button
        type="button"
        onclick={dismiss}
        class="w-full py-2.5 rounded-lg bg-wordle-green hover:bg-wordle-green/80 text-white font-semibold transition-colors cursor-pointer"
      >
        Got it, let me play!
      </button>
    </div>
  </div>
{/if}
