<script>
  import AppControls from './Components/AppControls';
  import Repl from './components/Repl/Repl.svelte';
  import { onMount } from 'svelte';
  import Split from 'split.js';
  import marked from 'marked';
  let repl;
  let splitInstance;
  let markdownContent = 'Markdown';
  let htmlContent = '';

  marked.setOptions({
    breaks: true,
  });

  let appA = {
    components: [
      {
        name: 'Text',
        type: 'md',
        source: '',
      },
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
        name: 'Text',
        type: 'md',
        source: '',
      },
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
    handleMarkdownInput();
    repl.set(appA);
  });

  function handleMarkdownInput() {
    htmlContent = marked(markdownContent);
  }

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

<style>
  panel-container {
    display: flex;
    width: 100%;
    height: calc(100% - 45px);
    border: 1px solid black;
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

<AppControls {repl} {appA} {appB} />

<panel-container use:splitPane>
  <textarea
    id="editor"
    on:keyup={handleMarkdownInput}
    bind:value={markdownContent}
  />
  <div id="repl">
    <Repl bind:this={repl} workersUrl="workers" {htmlContent} />
  </div>
</panel-container>
