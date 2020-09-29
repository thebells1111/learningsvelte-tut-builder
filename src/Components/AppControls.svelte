<script>
  import * as doNotZip from 'do-not-zip';
  import directories from './directories.json';
  export let repl;
  export let appA;
  export let appB;
  export let projectName = '01-random_quote_machine';
  export let tutorialName = '01-intro';
  let currentApp = 'A';
  export let showMarkdownPreview = false;
  export let mde;
  export let selectedComponent;

  let projects = Object.keys(directories).sort();
  $: tutorials = projectName
    ? Object.keys(directories[projectName]).sort()
    : '';

  let downloading = false;

  function handleKeydown(event) {
    if (
      event.key === 's' &&
      (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel'
        ? event.metaKey
        : event.ctrlKey)
    ) {
      event.preventDefault();
      download();
    }
  }

  async function download() {
    downloading = true;

    let files = [];

    let a = [...appA.components];
    let b = [...appB.components];
    files.push({
      path: `${tutorialName}/text.md`,
      data: mde.value(),
    });
    files.push(
      ...a.map(component => ({
        path: `${tutorialName}/app-a/${component.name}.${component.type}`,
        data: component.source,
      }))
    );

    files.push(
      ...b.map(component => ({
        path: `${tutorialName}/app-b/${component.name}.${component.type}`,
        data: component.source,
      }))
    );

    console.log(files);

    //downloadBlob(doNotZip.toBlob(files), `${tutorialName}.zip`);

    downloading = false;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
  }

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
    currentApp = currentApp === 'A' ? 'B' : 'A';
    let newApp = currentApp === 'A' ? { ...appA } : { ...appB };
    newApp.selectedComponent = selectedComponent;
    repl.set(newApp);
  }

  async function handleFileUpload(e) {
    let newAppA = [];
    let newAppB = [];
    for (let file of e.target.files) {
      let relativePath = file.webkitRelativePath;
      let directories = relativePath.split('/');
      let directoryLevelOne = directories[directories.length - 2];

      if (file.name === 'text.md') {
        tutorialName = directoryLevelOne;
        mde.value(await readFileAsync(file));
      } else {
        let appFile = file.name.split('.');
        let source = await readFileAsync(file);
        if (directoryLevelOne == 'app-a') {
          newAppA.push({
            name: appFile[0],
            type: appFile[1],
            source: source,
          });
        } else if (directoryLevelOne == 'app-b') {
          newAppB.push({
            name: appFile[0],
            type: appFile[1],
            source: source,
          });
        }
      }
    }
    appA = { components: newAppA };
    appB = { components: newAppB };
    repl.set(currentApp === 'A' ? appA : appB);
  }

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsText(file);
    });
  }

  function selectNewApp() {
    currentApp = 'A';
    appA.components = directories[projectName][tutorialName].appA;
    appB.components = directories[projectName][tutorialName].appB;
    mde.value(directories[projectName][tutorialName].text.source);
    repl.set(appA);
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="app-controls">
  <!-- <input
    type="file"
    webkitdirectory
    mozdirectory
    on:change={handleFileUpload}
  /> -->

  {#if projectName}
    <select bind:value={projectName} on:change={selectNewApp}>
      {#each projects as project}
        <option value={project}>{project}</option>
      {/each}
      <option value="" />
    </select>
  {:else}
    <input
      bind:value={projectName}
      on:focus={e => e.target.select()}
      use:enter={e => e.target.blur()}
    />
  {/if}
  {#if tutorialName}
    <select bind:value={tutorialName} on:change={selectNewApp}>
      {#each tutorials as tutorial}
        <option value={tutorial}>{tutorial}</option>
      {/each}
      <option value="" />
    </select>
  {:else}
    <input
      bind:value={tutorialName}
      on:focus={e => e.target.select()}
      use:enter={e => e.target.blur()}
    />
  {/if}

  <button on:click={() => (showMarkdownPreview = !showMarkdownPreview)}>
    {showMarkdownPreview ? 'Code' : 'Tutorial'}
  </button>
  <button on:click={setApp}>App-{currentApp}</button>

  <button disabled={downloading} on:click={download} title="download zip file">
    Download
  </button>
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
