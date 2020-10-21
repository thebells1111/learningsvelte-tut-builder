<script>
  import { getContext } from 'svelte';
  const { showMarkdownPreview, Prism } = getContext('Controls');
</script>

<button
  on:click={() => {
    $showMarkdownPreview = !$showMarkdownPreview;
    Prism.highlightAll();
  }}
>
  {$showMarkdownPreview ? 'Code' : 'chapter'}
</button>

<style>
  button {
    position: relative;
    top: -0.1rem;
    display: inline-block;
    padding: 0.2em;
    opacity: 0.7;
    transition: opacity 0.3s;
    font-family: var(--font);
    font-size: 1rem;
    color: black;
    /* width: 1.6em;
		height: 1.6em; */
    line-height: 1;
    margin: 0 0 0 0.2em;
  }

  button:hover {
    opacity: 1;
  }
  button:disabled {
    opacity: 0.3;
  }
</style>
