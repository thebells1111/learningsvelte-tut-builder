<script>
  import * as doNotZip from 'do-not-zip';
  export let repl;
  export let appA;
  export let appB;
  export let projectName = '02-markdown_previewer';
  export let tutorialName = '08-import-markdown';
  let currentApp = 'A';

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

    for (let i = 0; i < appA.components.length; i++) {
      let a = [...appA.components];
      let c = { ...a[i] };
      if (c.name === 'Text' && c.type === 'md') {
        files.push({
          path: `${tutorialName}/${c.name}.${c.type}`,
          data: c.source,
        });
        a.splice(i, 1);
        files.push(
          ...a.map(component => ({
            path: `${tutorialName}/app-a/${component.name}.${component.type}`,
            data: component.source,
          }))
        );
      }

      i = appA.components.length;
    }

    for (let i = 0; i < appB.components.length; i++) {
      let b = [...appB.components];
      let c = { ...b[i] };
      if (c.name === 'Text' && c.type === 'md') {
        b.splice(i, 1);
        files.push(
          ...b.map(component => ({
            path: `${tutorialName}/app-b/${component.name}.${component.type}`,
            data: component.source,
          }))
        );
      }

      i = appB.components.length;
    }

    console.log(files);

    downloadBlob(doNotZip.toBlob(files), `${tutorialName}.zip`);

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
</script>

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
    border-bottom: 1px solid gray;
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

<svelte:window on:keydown={handleKeydown} />

<div class="app-controls">
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
  <button on:click={setApp}>App-{currentApp}</button>

  <button disabled={downloading} on:click={download} title="download zip file">
    Download
  </button>
</div>
