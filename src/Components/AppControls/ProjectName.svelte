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
    projects,
    chapterName,
    chapters,
  } = getContext('Controls');
  let newProjectName;

  function createNewProject(e) {
    $directories[newProjectName] = {};
    $directories[newProjectName].meta = '';
    $directories[newProjectName]['01-intro'] = {};
    $directories[newProjectName]['01-intro']['app-a'] = [
      ...$blankApp.components,
    ];
    $directories[newProjectName]['01-intro']['app-b'] = [
      ...$blankApp.components,
    ];

    $directories[newProjectName]['01-intro'].text = {
      name: 'text',
      type: 'md',
      source: '',
    };

    $projectName = newProjectName;
    $chapterName = '01-intro';
    $projects = $projects.push($projectName);
    selectNewApp();
  }

  function enterNewProject(e) {
    let projectNumbers = $projects.map(v => {
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
    if ($projectName !== 'Create New Project') {
      $chapters = $directories[$projectName].chapterNames;
      $chapterName = $chapters[0];
      $currentApp = 'A';
      $appA.components = $directories[$projectName][$chapterName]['app-a'];
      console.log(
        JSON.stringify($directories[$projectName][$chapterName]['app-a'])
      );
      if ($directories[$projectName][$chapterName]['app-b']) {
        $appB = {};
        $appB.components = $directories[$projectName][$chapterName]['app-b'];
      } else {
        $appB = { ...$blankApp };
      }
      $mde.value($directories[$projectName][$chapterName].text);
      //repl.set($appA);
    }
  }
</script>

{#if $projectName !== 'Create New Project'}
  <select bind:value={$projectName} on:change={selectNewApp}>
    {#each $projects as project}
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
