<script>
  import * as doNotZip from 'do-not-zip';
  export let repl;
  export let appA;
  export let appB;
  export let projectName = '02-markdown_previewer';
  export let tutorialName = '08-import-markdown';
  let currentApp = 'A';
  export let showMarkdownPreview = false;
  export let mde;

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
      data: markdownContent,
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
    repl.set(currentApp === 'A' ? appA : appB);
  }

  function handleFiles(e) {
    let files = [...e.target.files];
    let newAppA = [];
    let newAppB = [];
    let fileObjs = [];

    files.forEach((v, i) => {
      fileObjs[i] = {};
      let o = fileObjs[i];
      o.path = v.webkitRelativePath;
      let directories = o.path.split('/');
      let directoryLevelOne = directories[directories.length - 2];

      if (v.name === 'text.md') {
        tutorialName = directoryLevelOne;
        const reader = new FileReader();
        reader.readAsText(e.target.files[i]);
        reader.onload = event => {
          mde.value(event.target.result);
        };
      }

      if (directoryLevelOne == 'app-a') {
        let appFile = v.name.split('.');
        newAppA.push({
          name: appFile[0],
          type: appFile[1],
        });
      }
    });
    console.log(newAppA);
  }
  // const reader = new FileReader();
  // reader.readAsText(file);
  // reader.onload = (event) => {
  //   content = event.target.result;
  // };
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="app-controls">
  <input type="file" webkitdirectory mozdirectory on:change={handleFiles} />
  <input
    bind:value={projectName}
    on:focus={e => e.target.select()}
    use:enter={e => e.target.blur()}
  />
  <input
    bind:value={tutorialName}
    on:focus={e => e.target.select()}
    use:enter={e => e.target.blur()}
  />
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
