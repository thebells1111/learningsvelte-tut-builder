<script>
  import { getContext } from 'svelte';
  import * as doNotZip from 'do-not-zip';

  const { appA, appB, mde, chapterName } = getContext('Controls');

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

  let downloading = false;
  async function download() {
    downloading = true;

    let files = [];

    let a = [...$appA.components];
    let b = $appB ? [...$appB.components] : [];
    files.push({
      path: `${$chapterName}/text.md`,
      data: $mde.value(),
    });
    files.push(
      ...a.map(component => ({
        path: `${$chapterName}/app-a/${component.name}.${component.type}`,
        data: component.source,
      }))
    );

    files.push(
      ...b.map(component => ({
        path: `${$chapterName}/app-b/${component.name}.${component.type}`,
        data: component.source,
      }))
    );

    console.log(files);

    //downloadBlob(doNotZip.toBlob(files), `${$chapterName}.zip`);

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
</script>

<svelte:window on:keydown={handleKeydown} />

<button disabled={downloading} on:click={download} title="download zip file">
  Download
</button>

<style>
  button {
    position: relative;
    display: inline-block;
    font-family: var(--font);
    border: 1px solid black;
    padding: 0.5em 0.25em;
    border-radius: var(--border-r);
    position: relative;
    font-size: 0.8em;
    font-weight: 700;
  }

  button:disabled {
    opacity: 0.3;
  }

  button:hover {
    background-color: #efefef;
  }
  button:active {
    background-color: #d8d8d8;
  }
</style>
