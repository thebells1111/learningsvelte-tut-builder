<script>
  import { getContext } from 'svelte';
  import marked from 'marked';
  import Viewer from './Viewer.svelte';

  const { register_output } = getContext('REPL');

  export let status;
  export let runtimeError = null;
  export let relaxed = false;
  export let injectedJS;
  export let injectedCSS;

  let selected_type = '';
  let markdown = '';

  register_output({
    set: async selected => {
      selected_type = selected.type;

      if (selected.type === 'md') {
        markdown = marked(selected.source);
        return;
      }
    },

    update: async selected => {
      if (selected.type === 'md') {
        markdown = marked(selected.source);
        return;
      }
    },
  });
</script>

<!-- component viewer -->
<div class="tab-content" class:visible={selected_type !== 'md'}>
  <Viewer
    bind:error={runtimeError}
    {status}
    {relaxed}
    {injectedJS}
    {injectedCSS}
  />
</div>

<!-- markdown output -->
<div class="tab-content" class:visible={selected_type === 'md'}>
  <iframe title="Markdown" srcdoc={markdown} />
</div>

<style>
  .tab-content {
    position: absolute;
    width: 100%;
    height: calc(100% - 42px) !important;
    opacity: 0;
    pointer-events: none;
  }

  .tab-content.visible {
    /* can't use visibility due to a weird painting bug in Chrome */
    opacity: 1;
    pointer-events: all;
  }
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
</style>
