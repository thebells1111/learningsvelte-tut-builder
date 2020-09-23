<script>
  import AppControls from './Components/AppControls';
  import Repl from './components/Repl/Repl.svelte';
  import { onMount } from 'svelte';
  let repl;
  let currentApp = 'A';

  let appA = {
    components: [
      {
        name: 'Text',
        type: 'md',
        source: '',
      },
      {
        name: 'App',
        type: 'svelte',
        source: 'Hello',
      },
    ],
    selectedComponent: 'App.svelte',
    foldLine: [],
  };

  let appB = {
    components: [
      {
        name: 'Text',
        type: 'md',
        source: '',
      },
      {
        name: 'App',
        type: 'svelte',
        source: 'World',
      },
    ],
    selectedComponent: 'App.svelte',
    foldLine: [],
  };

  onMount(() => {
    repl.set(appA);
  });

  function setApp() {
    currentApp = currentApp === 'A' ? 'B' : 'A';
    repl.set(currentApp === 'A' ? appA : appB);
  }
</script>

<style>

</style>

<AppControls {repl} {appA} {appB} />
<button on:click={setApp}>App-{currentApp}</button>
<Repl bind:this={repl} workersUrl="workers" />
