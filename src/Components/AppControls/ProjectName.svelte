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
      if ($directories[$projectName][$chapterName]['app-b']) {
        $appB = {};
        $appB.components = $directories[$projectName][$chapterName]['app-b'];
      } else {
        $appB = { ...$blankApp };
      }
      $mde.value($directories[$projectName][$chapterName].text);
    }

    $folders = filesToTreeNodes(
      $directories[$projectName][$chapterName]['app-a'].folders
    );

    $appA.components = convertToComponent($folders);
    repl.set($appA);
  }

  function convertToComponent(file) {
    let initialPath = '';
    let components = [];

    function c(x, path) {
      x.forEach(f => {
        if (f.type === 'folder') {
          initialPath += `${f.name}/`;
          c(f.files, initialPath);
          initialPath = path ? `${path}` : '';
        } else {
          if (f.name === 'index') {
            initialPath = initialPath.slice(0, -1);
            f.name = '';
          }
          components.push({
            name: `${initialPath}${f.name}`,
            type: f.type,
            source: f.source,
          });
        }
      });
    }
    c(file);
    return components;
  }

  function filesToTreeNodes(arr) {
    var tree = {};
    function addnode(obj) {
      var splitpath = obj.webkitRelativePath.replace(/^\/|\/$/g, '').split('/');
      var ptr = tree;
      for (let i = 0; i < splitpath.length; i++) {
        let node = {
          name: splitpath[i],
          type: 'directory',
          path: obj.webkitRelativePath
            .split('.')
            .slice(0, -1)
            .join('.'),
        };
        if (i == splitpath.length - 1) {
          let splitName = splitpath[i].split('.');
          node.type = splitName.pop();
          node.name = splitName.join('.');
          node.source = obj.source;
        }
        ptr[splitpath[i]] = ptr[splitpath[i]] || node;
        ptr[splitpath[i]].children = ptr[splitpath[i]].children || {};
        ptr = ptr[splitpath[i]].children;
      }
    }
    function objectToArr(node) {
      Object.keys(node || {})
        .map(k => {
          if (node[k].children) {
            objectToArr(node[k]);
          }
        })
        .sort((a, b) => {
          let aa = a.name.toLowerCase(),
            bb = b.name.toLowerCase();

          if (aa < bb) {
            return -1;
          }
          if (aa > bb) {
            return 1;
          }
          return 0;
        });
      if (node.children) {
        node.children = Object.values(node.children).sort((a, b) => {
          let aa = a.name.toLowerCase(),
            bb = b.name.toLowerCase();

          if (aa < bb) {
            return -1;
          }
          if (aa > bb) {
            return 1;
          }
          return 0;
        });
        node.children.forEach(objectToArr);
      }
    }
    arr.map(addnode);
    objectToArr(tree);
    return Object.values(tree);
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
