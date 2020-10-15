<script>
  import Folder from './Folder.svelte';
  import { getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  export let handle_select;
  const { selected } = getContext('REPL');
  const { folders, currentComponent } = getContext('Controls');

  const currentPath = writable('');
  const editingFileName = writable(false);
  const showMenu = writable(false);
  const contextMenu = writable();

  $: if ($showMenu) {
    $contextMenu.focus();
  }

  function selectComponent(component) {
    if ($selected !== component) {
      //editing = null;
      handle_select(component);
    }
  }

  function selectFile(component) {
    $currentComponent = component;
    selectComponent(component);
  }

  setContext('Directory', {
    currentPath,
    currentComponent,
    selectComponent,
    editingFileName,
    selectFile,
    handle_select,
    showMenu,
    contextMenu,
  });

  function addFolder() {
    //console.log(children);
    let newFolder = {};
    newFolder.name = '';
    newFolder.type = 'directory';
    newFolder.path = '';
    newFolder.editing = true;
    newFolder.children = [];
    //children.unshift(newFolder);
    let currentFolder = $folders;
    let splitPath = $currentPath && $currentPath.split('/');
    while (splitPath.length > 0) {
      let searchName = splitPath.shift();
      currentFolder = currentFolder.children
        ? currentFolder.children.find(({ name }) => name === searchName)
        : currentFolder.find(({ name }) => name === searchName);
    }
    currentFolder.children
      ? currentFolder.children.push(newFolder)
      : $folders.push(newFolder);
    $currentComponent = newFolder;
    $currentComponent.expanded = true;
    $folders = $folders;
  }
  function addFile() {
    let newFile = {};
    newFile.name = '';
    newFile.type = '';
    newFile.source = '';
    newFile.path = $currentPath;
    newFile.editing = true;
    let currentFolder = $folders;
    let splitPath = $currentPath && $currentPath.split('/');
    console.log($currentPath);
    while (splitPath.length > 0) {
      let searchName = splitPath.shift();
      currentFolder = currentFolder.children
        ? currentFolder.children.find(({ name }) => name === searchName)
        : currentFolder.find(({ name }) => name === searchName);
    }
    if (currentFolder.children) {
      currentFolder.children.push(newFile);
    } else {
      $folders.push(newFile);
    }
    $currentComponent.expanded = true;
    $folders = $folders;
  }

  function handleClick(e) {
    $showMenu = false;
  }
</script>

<div class:editing={editingFileName} on:click={handleClick}>
  <button class="add-folder" on:click={addFolder} />
  <button class="add-file" on:click={addFile} />
  <Folder
    component={{ name: 'src', path: '', children: $folders, expanded: true }}
    isFirst={true}
    {selectComponent}
  />

  <nav
    class:show-menu={$showMenu}
    bind:this={$contextMenu}
    on:blur={() => ($showMenu = false)}
  >
    <ul>
      <li>Rename</li>
      <li>Delete</li>
    </ul>
  </nav>
</div>

<style>
  div {
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    padding-top: 0.5em;
  }

  button {
    background: 0 0.1em no-repeat;
    width: 24px;
    height: 24px;
    border: none;
  }

  .add-folder {
    background-image: url(/icons/new-folder.svg);
  }

  .add-file {
    background-image: url(/icons/new-file.svg);
  }

  nav {
    position: absolute;
    display: none;
    width: 300px;
    top: 0;
    background: white;
    z-index: 99;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  }
  .show-menu {
    display: block;
  }

  li {
    list-style-type: none;
  }

  li:hover {
    background-color: teal;
  }
</style>
