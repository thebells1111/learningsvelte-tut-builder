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
    folders,
    folderToComponents,
    filesToTreeNodes,
  } = getContext('Controls');
  let newchapterName = '';

  $: chapters =
    $projectName !== 'Create New Project'
      ? Object.keys($directories[$projectName]).sort()
      : '';

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

  function selectNewApp() {
    if ($projectName !== 'Create New Project') {
      $currentApp = 'A';
      $folders = filesToTreeNodes(
        $directories[$projectName][$chapterName]['app-a'].folders
      );
      $appA.components = folderToComponents($folders);
      repl.set($appA);
      if ($directories[$projectName][$chapterName]['app-b']) {
        let appBFolders = filesToTreeNodes(
          $directories[$projectName][$chapterName]['app-b'].folders
        );
        $appB.components = folderToComponents(appBFolders);
      } else {
        $appB = { ...$blankApp };
      }
      $mde.value($directories[$projectName][$chapterName].text);
      //repl.set($appA);
    }
  }
</script>

{#if $chapterName}
  <select bind:value={$chapterName} on:change={selectNewApp}>
    {#each chapters as chapter}
      <option value={chapter}>{chapter}</option>
    {/each}
    <option value="" />
  </select>
{:else}
  <input
    bind:value={$chapterName}
    on:focus={e => e.target.select()}
    use:enter={e => e.target.blur()}
  />
{/if}
