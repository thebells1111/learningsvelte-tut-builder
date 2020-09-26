<script>
  import { onMount } from 'svelte';
  import AppControls from './Components/AppControls.svelte';
  import MarkdownEditor from './Components/MarkdownEditor.svelte';
  import Repl from './components/Repl/Repl.svelte';
  import marked from 'marked';

  marked.setOptions({
    breaks: true,
  });

  import Split from 'split.js';
  let repl;
  let splitInstance;

  let showMarkdownPreview;
  let markdownContent = '';
  $: htmlContent = marked(markdownContent);
  let mde;
  let selectedComponent;

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
  {mde}
  {selectedComponent}
  bind:showMarkdownPreview
  bind:htmlContent
/>

<panel-container use:splitPane>
  <div id="editor">
    <MarkdownEditor bind:markdownContent bind:mde />
  </div>

  <div id="repl">
    <Repl
      bind:this={repl}
      workersUrl="workers"
      bind:selectedComponent
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

  :global(.gutter-horizontal) {
    cursor: ew-resize;
  }

  #editor {
    display: flex;
    flex-direction: column;
    border-right: 1px solid gray;
  }
</style>
