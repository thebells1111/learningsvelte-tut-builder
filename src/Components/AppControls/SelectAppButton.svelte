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
    display: inline-block;
    font-family: var(--font);
    border: 1px solid black;
    padding: 0.5em 0.25em;
    border-radius: var(--border-r);
    position: relative;
    font-size: 0.8em;
    font-weight: 700;
    text-align: left;
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
