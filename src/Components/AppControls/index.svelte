<script>
  import ProjectName from './ProjectName.svelte';
  import ChapterName from './ChapterName.svelte';
  import SelectAppButton from './SelectAppButton.svelte';
  import PreviewToggleButton from './PreviewToggleButton.svelte';
  import DownloadButton from './Download.svelte';
  import UploadProjects from './UploadProjects.svelte';

  import { onMount, getContext } from 'svelte';
  const {
    blankApp,
    appA,
    appB,
    directories,
    currentApp,
    mde,
    chapterName,
    projectName,
    chapters,
    folders,
  } = getContext('Controls');
  import * as doNotZip from 'do-not-zip';

  export let repl;

  onMount(function mount() {
    if (repl && $mde) {
      selectNewApp();
    } else {
      setTimeout(mount, 1);
    }
  });

  let x;

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

<div class="app-controls">
  <UploadProjects />
  <ProjectName {repl} />
  <ChapterName {repl} />
  <PreviewToggleButton />
  <SelectAppButton {repl} />
  <DownloadButton />
</div>

<style>
  .app-controls {
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem var(--side-nav);
    background-color: var(--second);
    color: black;
    white-space: nowrap;
    flex: 0;
  }

  /* button {
    position: relative;
    top: -0.1rem;
    display: inline-block;
    padding: 0.2em;
    opacity: 0.7;
    transition: opacity 0.3s;
    font-family: var(--font);
    font-size: 1rem;
    color: black;   
    line-height: 1;
    margin: 0 0 0 0.2em;
  }

  button:hover {
    opacity: 1;
  }
  button:disabled {
    opacity: 0.3;
  }

  input {
    background: transparent;
    color: currentColor;
    font-family: var(--font);
    font-size: 1rem;
    opacity: 0.7;
    flex: 1;
  }

  input:focus {
    opacity: 1;
  } */
</style>
