<script>
  import ProjectName from './ProjectName.svelte';
  import DownloadButton from './Download.svelte';

  import { onMount, getContext } from 'svelte';
  const { blankApp, appA, appB, directories, currentApp, mde } = getContext(
    'Controls'
  );
  import * as doNotZip from 'do-not-zip';

  export let repl;

  let projectName = '01-random_quote_machine';
  let chapterName = '01-intro';
  let newchapterName = '';
  export let showMarkdownPreview = false;

  $: chapters =
    projectName !== 'Create New Project'
      ? Object.keys($directories[projectName]).sort()
      : '';

  onMount(function mount() {
    if (repl && $mde) {
      selectNewApp();
    } else {
      setTimeout(mount, 1);
    }
  });

  function enter() {
    return function(node, callback) {
      node.addEventListener('keydown', handleKeydown);

      function handleKeydown(event) {
        if (event.keyCode === 13) {
          callback.call(this, event);
        }
      }

      return {
        destroy() {
          node.removeEventListener('keydown', handleKeydown);
        },
      };
    };
  }

  function setApp() {
    if (appB) {
      $currentApp = $currentApp === 'A' ? 'B' : 'A';
      let newApp = $currentApp === 'A' ? { ...appA } : { ...appB };
      newApp.selectedComponent = repl.get_selected_component();
      repl.set(newApp);
    }
  }

  // async function handleFileUpload(e) {
  //   let newAppA = [];
  //   let newAppB = [];
  //   for (let file of e.target.files) {
  //     let relativePath = file.webkitRelativePath;
  //     let $directories = relativePath.split('/');
  //     let directoryLevelOne = $directories[$directories.length - 2];

  //     if (file.name === 'text.md') {
  //       chapterName = directoryLevelOne;
  //       $mde.value(await readFileAsync(file));
  //     } else {
  //       let appFile = file.name.split('.');
  //       let source = await readFileAsync(file);
  //       if (directoryLevelOne == 'app-a') {
  //         newAppA.push({
  //           name: appFile[0],
  //           type: appFile[1],
  //           source: source,
  //         });
  //       } else if (directoryLevelOne == 'app-b') {
  //         newAppB.push({
  //           name: appFile[0],
  //           type: appFile[1],
  //           source: source,
  //         });
  //       }
  //     }
  //   }
  //   appA = { components: newAppA };
  //   appB = { components: newAppB };
  //   repl.set($currentApp === 'A' ? appA : appB);
  // }

  // function readFileAsync(file) {
  //   return new Promise((resolve, reject) => {
  //     let reader = new FileReader();

  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };

  //     reader.onerror = reject;

  //     reader.readAsText(file);
  //   });
  // }

  function selectNewApp() {
    if (projectName !== 'Create New Project') {
      $currentApp = 'A';
      $appA.components = $directories[projectName][chapterName].appA;
      if ($directories[projectName][chapterName].appB) {
        $appB = {};
        $appB.components = $directories[projectName][chapterName].appB;
      } else {
        $appB = { ...$blankApp };
      }
      $mde.value($directories[projectName][chapterName].text.source);
      repl.set($appA);
    }
  }
</script>

<div class="app-controls">
  <!-- <input
    type="file"
    webkitdirectory
    mozdirectory
    on:change={handleFileUpload}
  /> -->
  <ProjectName {repl} />
  {#if chapterName}
    <select bind:value={chapterName} on:change={selectNewApp}>
      {#each chapters as chapter}
        <option value={chapter}>{chapter}</option>
      {/each}
      <option value="" />
    </select>
  {:else}
    <input
      bind:value={chapterName}
      on:focus={e => e.target.select()}
      use:enter={e => e.target.blur()}
    />
  {/if}

  <button on:click={() => (showMarkdownPreview = !showMarkdownPreview)}>
    {showMarkdownPreview ? 'Code' : 'chapter'}
  </button>
  <button on:click={setApp}>App-{$currentApp}</button>
  <DownloadButton {appA} {appB} {chapterName} />
</div>

<style>
  .app-controls {
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem var(--side-nav);
    background-color: var(--second);
    color: black;
    white-space: nowrap;
    flex: 0;
  }

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

  input {
    background: transparent;
    color: currentColor;
    font-family: var(--font);
    font-size: 1rem;
    opacity: 0.7;
    flex: 1;
  }

  input:focus {
    opacity: 1;
  }
</style>
