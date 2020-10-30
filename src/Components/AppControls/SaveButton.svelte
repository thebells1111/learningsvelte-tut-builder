<script>
  import { getContext } from 'svelte';
  import folderToComponent from '../../../utils/folderToComponents';
  const {
    directories,
    unsavedState,
    projectName,
    chapterName,
    appA,
    appB,
    mde,
  } = getContext('Controls');

  function saveApp() {
    let dir = {};
    dir.text = $mde.value();
    dir['app-a'] = $appA.components.map(v => {
      let comp = {};
      comp.webkitRelativePath = `${v.name}.${v.type}`;
      comp.source = v.source;
      comp.path = `projects/${$projectName}/${$chapterName}/app-a/${comp.webkitRelativePath}`;
      return comp;
    });

    if ($appB && $appB.components.length === 1 && $appB.components[0].source) {
      dir['app-b'] = $appB.components.map(v => {
        let comp = {};
        comp.webkitRelativePath = `${v.name}.${v.type}`;
        comp.source = v.source;
        comp.path = `projects/${$projectName}/${$chapterName}/app-b/${comp.webkitRelativePath}`;
        return comp;
      });
    }

    $unsavedState = false;
    $directories[$projectName][$chapterName] = dir;
    localStorage.setItem('directories', JSON.stringify($directories));
  }

  function handleKeydown(event) {
    if (
      event.key === 's' &&
      (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel'
        ? event.metaKey
        : event.ctrlKey)
    ) {
      event.preventDefault();
      saveApp();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<button on:click={saveApp}>Save</button>

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
