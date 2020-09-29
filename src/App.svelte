<script>
  import AppControls from './Components/AppControls.svelte';
  import MarkdownEditor from './Components/MarkdownEditor.svelte';
  import Repl from './components/Repl/Repl.svelte';
  import marked from 'marked';

  marked.setOptions({
    breaks: true,
  });

  let repl;

  let showMarkdownPreview;
  let markdownContent = '';
  $: htmlContent = marked(markdownContent);
  let mde;

  import Split from 'split.js';
  let splitInstance;
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

<AppControls {repl} {mde} bind:showMarkdownPreview bind:htmlContent />

<panel-container use:splitPane>
  <div id="editor">
    <MarkdownEditor bind:markdownContent bind:mde />
  </div>

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

  :global(.gutter-horizontal) {
    cursor: ew-resize;
  }

  #editor {
    display: flex;
    flex-direction: column;
    border-right: 1px solid gray;
  }
</style>
