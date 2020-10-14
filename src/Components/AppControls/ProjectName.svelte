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
    folders,
    folderToComponents,
    filesToTreeNodes,
    currentComponent,
  } = getContext('Controls');
  let newProjectName;

  function createNewProject(e) {
    $directories[newProjectName] = {};
    $directories[newProjectName].meta = '';
    $directories[newProjectName]['01-intro'] = {};
    let newApp = [
      {
        webkitRelativePath: 'App.svelte',
        source: '',
        path: 'projects',
      },
    ];
    $directories[newProjectName]['01-intro']['app-a'] = [...newApp];
    $directories[newProjectName]['01-intro']['app-b'] = [...newApp];

    $directories[newProjectName]['01-intro'].text = '';
    $directories[newProjectName].chapterNames = ['01-intro'];
    console.log($directories[newProjectName]);

    $projectName = newProjectName;
    $chapterName = '01-intro';
    $projects = $projects.concat($projectName);
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
      $chapters = $directories[$projectName].chapterNames;
      $chapterName = $chapters[0];
      $currentApp = 'A';
      if ($directories[$projectName][$chapterName]['app-b']) {
        $appB = {};
        $appB.components = $directories[$projectName][$chapterName]['app-b'];
      } else {
        $appB = undefined;
      }

      $mde.value($directories[$projectName][$chapterName].text);

      $folders = filesToTreeNodes(
        $directories[$projectName][$chapterName]['app-a']
      );

      $appA.components = folderToComponents($folders);
      repl.set($appA);
      $currentComponent = $folders[0];
      repl.handle_select($currentComponent);
      repl.focus();
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
    use:handleEnter
    use:focus
  />
{/if}

<style>

</style>
