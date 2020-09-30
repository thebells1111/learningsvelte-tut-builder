<script>
  import { getContext } from 'svelte';
  export let projectName;
  export let repl;

  const { blankApp, appA, appB, mde, directories, currentApp } = getContext(
    'Controls'
  );
  let projects = Object.keys($directories).sort();
  let newProjectName;

  function createNewProject(e) {
    $directories[newProjectName] = {};
    $directories[newProjectName].meta = '';
    $directories[newProjectName]['01-intro'] = {};
    $directories[newProjectName]['01-intro'].appA = [...$blankApp.components];
    $directories[newProjectName]['01-intro'].appB = [...$blankApp.components];

    $directories[newProjectName]['01-intro'].text = {
      name: 'text',
      type: 'md',
      source: '',
    };

    projectName = newProjectName;
    let chapterName = '01-intro';
    projects = Object.keys($directories).sort();
    selectNewApp();
  }

  function enterNewProject(e) {
    let projectNumbers = projects.map(v => {
      return parseInt(v);
    });
    let nextProjectNumber = projectNumbers[projectNumbers.length - 1] + 1;
    nextProjectNumber =
      nextProjectNumber < 10 ? '0' + nextProjectNumber : nextProjectNumber;

    newProjectName = `${nextProjectNumber} - `;
  }

  function focus(node) {
    node.focus();
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

  function selectNewApp() {
    if (projectName !== 'Create New Project') {
      let chapterName = Object.keys($directories[projectName]).sort()[0];
      $currentApp = 'A';
      $appA.components = $directories[projectName][chapterName].appA;
      if ($directories[projectName][chapterName].appB) {
        $appB = {};
        $appB.components = $directories[projectName][chapterName].appB;
      } else {
        $appB = { ...$blankApp };
      }
      $mde.value($directories[projectName][chapterName].text.source);
      repl.set($appA);
    }
  }
</script>

{#if projectName !== 'Create New Project'}
  <select bind:value={projectName} on:change={selectNewApp}>
    {#each projects as project}
      <option value={project}>{project}</option>
    {/each}
    <option value="Create New Project">Create New Project</option>
  </select>
{:else}
  <input
    bind:value={newProjectName}
    on:focus={enterNewProject}
    on:blur={createNewProject}
    use:enter={e => e.target.blur()}
    use:focus
  />
{/if}

<style>

</style>
