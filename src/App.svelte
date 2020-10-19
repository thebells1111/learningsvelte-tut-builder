<script>
  import AppControls from './Components/AppControls/';
  import MarkdownEditor from './Components/MarkdownEditor.svelte';
  import Repl from './components/Repl/Repl.svelte';
  import directoriesJSON from './directories.json';
  import folderToComponents from '../utils/folderToComponents';
  import filesToTreeNodes from '../utils/filesToTreeNodes';
  import componentsToFolder from '../utils/componentsToFolder';

  import marked from 'marked';

  marked.setOptions({
    breaks: true,
  });

  import Split from 'split.js';
  let splitInstance;
  function splitPane() {
    function split() {
      splitInstance = Split(['#editor', '#repl'], {
        sizes: [100 / 4, 300 / 4],
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
  import { setContext, onMount } from 'svelte';
  let repl;
  let markdownContent = '';
  $: htmlContent = marked(markdownContent);
  const blankApp = readable({
    components: [
      {
        name: 'App',
        type: 'svelte',
        source: ``,
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
  const folders = writable([]);
  const currentComponent = writable('');

  function updateApps(components) {
    if ($currentApp === 'A') {
      $appA.components = components;
    } else {
      $appB.components = components;
    }
  }

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
    folders,
    folderToComponents,
    filesToTreeNodes,
    currentComponent,
    componentsToFolder,
    updateApps,
  });

  onMount(function mount() {
    if (repl && $mde) {
      initializeApp();
      //$folders = componentsToFolder($appA.components);
      //repl.set($appA);
    } else {
      setTimeout(mount, 1);
    }
  });

  function initializeApp() {
    $mde.value($directories[$projectName][$chapterName].text);

    $folders = filesToTreeNodes(
      $directories[$projectName][$chapterName]['app-a']
    );
    $appA.components = folderToComponents($folders);
    repl.set($appA);
    $currentComponent = $folders[0];

    let loadAttempts = 0;
    function load() {
      try {
        repl.handle_select($currentComponent);
        repl.focus();
      } catch (err) {
        if (loadAttempts < 100) {
          loadAttempts++;
          setTimeout(load, 100);
        } else {
          console.error('REPL Editor loading exceeded 10 second timeout');
          console.error(err);
        }
      }
    }
    load();
  }
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
