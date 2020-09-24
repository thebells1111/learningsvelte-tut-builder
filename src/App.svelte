<script>
  import AppControls from './Components/AppControls';
  import Repl from './components/Repl/Repl.svelte';
  import { onMount } from 'svelte';
  import Split from 'split.js';
  import marked from 'marked';
  import SimpleMDE from 'simplemde';
  let repl;
  let splitInstance;
  let markdownContent = '';
  $: htmlContent = marked(markdownContent);
  let showMarkdownPreview;
  let mde;

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
    mde = new SimpleMDE({
      forceSync: true,
      indentWithTabs: false,
      insertTexts: {
        horizontalRule: ['', '\n\n-----\n\n'],
      },

      status: false,
      renderingConfig: {
        codeSyntaxHighlighting: true,
      },
      toolbar: [
        'horizontal-rule',
        '|',
        'bold',
        'italic',
        'strikethrough',
        '|',
        'heading',
        'heading-smaller',
        'heading-bigger',
        '|',
        'quote',
        'code',
        '|',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        '|',
        'clean-block',
      ],
    });
    mde.codemirror.on('change', function() {
      markdownContent = mde.value();
    });
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

<AppControls {repl} {appA} {appB} {mde} bind:showMarkdownPreview />

<panel-container use:splitPane>
  <div id="editor">
    <textarea />
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
