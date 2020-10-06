<script>
  import AppControls from './Components/AppControls/';
  import MarkdownEditor from './Components/MarkdownEditor.svelte';
  import Repl from './components/Repl/Repl.svelte';
  import directoriesJSON from './directories.json';
  import marked from 'marked';

  marked.setOptions({
    breaks: true,
  });

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

  import { readable, writable } from 'svelte/store';
  import { setContext } from 'svelte';
  let repl;
  let markdownContent = '';
  $: htmlContent = marked(markdownContent);
  const blankApp = readable({
    components: [
      {
        name: 'App',
        type: 'svelte',
        source: '',
      },
    ],
    selectedComponent: 'App.svelte',
    foldLine: [],
  });
  const appA = writable({ ...$blankApp });
  const appB = writable({ ...$blankApp });
  const mde = writable(null);
  const directories = writable(directoriesJSON);
  const currentApp = writable('A');
  const showMarkdownPreview = writable(false);
  const projectName = writable('01-random_quote_machine');
  const chapterName = writable('01-intro');
  const projects = writable(directoriesJSON.projectNames);
  const chapters = writable(directoriesJSON[$projectName].chapterNames);

  setContext('Controls', {
    appA,
    appB,
    mde,
    blankApp,
    directories,
    currentApp,
    showMarkdownPreview,
    projectName,
    chapterName,
    projects,
    chapters,
  });
</script>

<AppControls {repl} bind:htmlContent />

<panel-container use:splitPane>
  <div id="editor">
    <MarkdownEditor bind:markdownContent />
  </div>

  <div id="repl">
    <Repl bind:this={repl} workersUrl="workers" {htmlContent} />
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
