<script>
  import Folder from './Folder.svelte';
  import { getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  export let handle_select;
  const { folders, currentComponent } = getContext('Controls');
  const { handle_file_delete, selected, handle_rename } = getContext('REPL');

  const currentPath = writable('');
  const editingFileName = writable(false);
  const showMenu = writable(false);
  const contextMenu = writable();
  const contextMenuComponent = writable();
  const handleComponentRename = handle_rename;

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

  function addFolder() {
    let newFolder = {};
    newFolder.name = '';
    newFolder.type = 'directory';
    newFolder.path = '';
    newFolder.editing = true;
    newFolder.children = [];
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
    $contextMenuComponent = newFile;
    $folders = $folders;
  }

  function handleContextMenu(e) {
    let fileNode = e.target;
    let show = false;
    while (fileNode.nodeName !== 'HTML') {
      if (fileNode.nodeName === 'FILE' || fileNode.nodeName === 'FOLDER') {
        e.preventDefault();
        if (
          !(
            fileNode.innerText === ' App.svelte' || fileNode.innerText === 'src'
          )
        ) {
          let containerNode =
            fileNode.parentElement.parentElement.parentElement;
          let containerBounds = containerNode.getBoundingClientRect();
          var x = e.clientX - containerBounds.left;
          var y = e.clientY - containerBounds.top;
          $contextMenu.style.top = y + 'px';
          $contextMenu.style.left = x + 'px';
          show = true;
        }
        break;
      }
      fileNode = fileNode.parentElement;
    }
    $showMenu = show;
  }

  function handleDelete() {
    if ($contextMenuComponent.type !== 'directory') {
      let result = confirm(
        `Are you sure you want to delete ${$contextMenuComponent.name}.${$contextMenuComponent.type}?`
      );
      if (result) {
        deleteFile();
      }
    } else {
      let result = confirm(
        `Are you sure you want to delete folder "${$contextMenuComponent.name}"?`
      );
      if (result) {
        deleteFolder();
      }
    }
  }

  function deleteFile() {
    let currentFolder = $folders;

    let splitPath = $contextMenuComponent.path.split('/');
    while (splitPath[0] && splitPath.length > 0) {
      //splitPath[0] checks for empty path
      console.log(currentFolder);
      let searchName = splitPath.shift();
      if (currentFolder.children) {
        currentFolder = currentFolder.children.find(
          ({ name, type }) => name === searchName && type === 'directory'
        );
      } else {
        currentFolder = currentFolder.find(
          ({ name, type }) => name === searchName && type === 'directory'
        );
      }
    }

    let fileIndex;
    if (currentFolder.children && currentFolder.children.length > 0) {
      fileIndex = currentFolder.children.findIndex(
        ({ name }) => name === $contextMenuComponent.name
      );
    } else {
      fileIndex = currentFolder.findIndex(
        ({ name }) => name === $contextMenuComponent.name
      );
    }

    if (currentFolder.children) {
      currentFolder.children.splice(fileIndex, 1);
    } else {
      currentFolder.splice(fileIndex, 1);
    }
    $folders = $folders;
    $currentPath = '';

    handle_file_delete(fileIndex, $currentPath);
  }

  function deleteFolder() {
    let currentFolder = $folders;

    let splitPath = $contextMenuComponent.path.split('/');
    while (splitPath.length > 1) {
      let searchName = splitPath.shift();
      if (currentFolder.children) {
        currentFolder = currentFolder.children.find(
          ({ name, type }) => name === searchName && type === 'directory'
        );
      } else {
        currentFolder = currentFolder.find(
          ({ name, type }) => name === searchName && type === 'directory'
        );
      }
    }

    let fileIndex;
    if (currentFolder.children && currentFolder.children.length > 0) {
      fileIndex = currentFolder.children.findIndex(
        ({ name }) => name === $contextMenuComponent.name
      );
    } else {
      fileIndex = currentFolder.findIndex(
        ({ name }) => name === $contextMenuComponent.name
      );
    }

    if (currentFolder.children) {
      currentFolder.children.splice(fileIndex, 1);
    } else {
      currentFolder.splice(fileIndex, 1);
    }
    $folders = $folders;
    $currentPath = '';

    handle_file_delete(fileIndex, $currentPath);
  }

  function handleRenameClick() {
    $contextMenuComponent.editing = true;
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
    folders,
    handle_file_delete,
    contextMenuComponent,
    handleComponentRename,
    deleteFile,
  });
</script>

<svelte:window
  on:click={() => {
    $showMenu = false;
  }}
  on:contextmenu={handleContextMenu}
/>

<div class:editing={editingFileName}>
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
      <li on:click={handleRenameClick}>Rename</li>
      <li on:click={handleDelete}>Delete</li>
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
    top: 0;
    background: white;
    z-index: 99;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  }
  .show-menu {
    display: block;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style-type: none;
    padding: 0 0.5em;
  }

  li:hover {
    background-color: rgb(0, 90, 192);
    color: white;
  }
</style>
