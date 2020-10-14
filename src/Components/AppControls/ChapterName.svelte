<script>
  import { getContext } from 'svelte';
  export let repl;

  const {
    blankApp,
    appA,
    appB,
    mde,
    directories,
    currentApp,
    projectName,
    chapterName,
    chapters,
  } = getContext('Controls');
  let newchapterName = '';

  function handleEnter(node) {
    function enter(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        e.target.blur();
      }
    }

    node.addEventListener('keydown', enter);
    return {
      destroy() {
        node.removeEventListener('keydown', enter);
      },
    };
  }

  function selectNewApp() {
    if ($projectName !== 'Create New Project') {
      $currentApp = 'A';
      $appA.components = $directories[$projectName][$chapterName]['app-a'];
      if ($directories[$projectName][$chapterName]['app-b']) {
        $appB = {};
        $appB.components = $directories[$projectName][$chapterName]['app-b'];
      } else {
        $appB = { ...$blankApp };
      }
      $mde.value($directories[$projectName][$chapterName].text);
      repl.set($appA);
    }
  }
</script>

{#if $chapterName}
  <select bind:value={$chapterName} on:change={selectNewApp}>
    {#each $chapters as chapter}
      <option value={chapter}>{chapter}</option>
    {/each}
    <option value="" />
  </select>
{:else}
  <input
    bind:value={$chapterName}
    on:focus={e => e.target.select()}
    use:handleEnter
  />
{/if}
