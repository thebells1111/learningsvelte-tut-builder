<script>
  import { getContext } from 'svelte';
  export let repl;
  const { appA, appB, currentApp, folders, componentsToFolder } = getContext(
    'Controls'
  );

  function setApp() {
    if ($appB) {
      $currentApp = $currentApp === 'A' ? 'B' : 'A';
      let newApp = $currentApp === 'A' ? { ...$appA } : { ...$appB };
      $folders = componentsToFolder(newApp.components);
      //newApp.selectedComponent = repl.get_selected_component();
      repl.set(newApp);
    }
  }
</script>

<button on:click={setApp}>App-{$currentApp}</button>

<style>
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
</style>
