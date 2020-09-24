<script>
  import AppControls from './Components/AppControls';
  import Repl from './components/Repl/Repl.svelte';
  import { onMount } from 'svelte';
  import Split from 'split.js';
  import marked from 'marked';
  let repl;
  let splitInstance;
  let markdownContent = '# Markdown';
  $: htmlContent = marked(markdownContent);
  let showMarkdownPreview;

  marked.setOptions({
    breaks: true,
  });

  let appA = {
    components: [
      {
        name: 'App',
        type: 'svelte',
        source: 'Very Nice',
      },
    ],
    selectedComponent: 'App.svelte',
    foldLine: [],
  };

  let appB = {
    components: [
      {
        name: 'App',
        type: 'svelte',
        source: 'World',
      },
    ],
    selectedComponent: 'App.svelte',
    foldLine: [],
  };

  onMount(() => {
    repl.set(appA);
  });

  function splitPane() {
    function split() {
      splitInstance = Split(['#editor', '#repl'], {
        sizes: [100 / 3, 200 / 3],
        direction: 'horizontal',
        elementStyle: (dimension, size, gutterSize) => ({
          'flex-basis': `calc(${size}% - ${gutterSize}px)`,
        }),
        gutterStyle: (dimension, gutterSize) => ({
          'flex-basis': `${gutterSize}px`,
          background: 'gray',
          border: 'solid white',
          'border-width': '0 5px',
        }),
        gutterSize: 1,
      });
    }
    split();

    return {
      update() {
        splitInstance.destroy();
        split();
      },
    };
  }
</script>

<AppControls
  {repl}
  {appA}
  {appB}
  bind:markdownContent
  bind:showMarkdownPreview
/>

<panel-container use:splitPane>
  <textarea id="editor" bind:value={markdownContent} />
  <div id="repl">
    <Repl
      bind:this={repl}
      workersUrl="workers"
      {htmlContent}
      {showMarkdownPreview}
    />
  </div>
</panel-container>

<style>
  panel-container {
    display: flex;
    width: 100%;
    height: calc(100% - 45px);
    border: 1px solid gray;
  }

  textarea {
    resize: none;
    overflow: auto;
    border: none;
  }

  textarea:focus {
    border: none;
    outline: none;
  }
  :global(.gutter-horizontal) {
    cursor: ew-resize;
  }
</style>
