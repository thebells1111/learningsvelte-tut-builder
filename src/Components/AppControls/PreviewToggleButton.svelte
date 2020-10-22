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
  {$showMarkdownPreview ? 'Show Rendered Site' : 'Show Rendered MD'}
</button>

<style>
  button {
    position: relative;
    display: inline-block;
    font-family: var(--font);
    border: 1px solid black;
    padding: 0.5em 0.25em;
    border-radius: var(--border-r);
    position: relative;
    font-size: 0.8em;
    font-weight: 700;
    width: 141px;
    text-align: left;
  }

  button:disabled {
    opacity: 0.3;
  }

  button:hover {
    background-color: #efefef;
  }
  button:active {
    background-color: #d8d8d8;
  }
</style>
