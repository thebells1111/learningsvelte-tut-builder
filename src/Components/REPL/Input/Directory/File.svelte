<script>
  import { splitCells } from 'marked/src/helpers';

  export let component;
  import { getContext } from 'svelte';
  import folderToComponents from '../../../../../utils/folderToComponents';
  const { selectComponent, currentPath, currentComponent } = getContext(
    'Directory'
  );
  const { folders } = getContext('Controls');
  export let newName = component.name
    ? `${component.name}.${component.type}`
    : '';

  function handleClick() {
    $currentComponent = component;
    selectComponent(component);
  }

  function focus(node) {
    node.focus();
    node.setSelectionRange(0, node.value.lastIndexOf('.'));
  }

  function addFile() {
    let splitName = newName.split('.');
    component.editing = false;
    let type = splitName.pop();
    let name = splitName.join('.');
    if (name && type) {
      component.name = name;
      component.type = type;
    } else if (!(component.name && component.type)) {
      deleteFile();
    }

    $folders = $folders;
  }

  function deleteFile() {
    let currentFolder = $folders;
    let splitPath = $currentPath && $currentPath.split('/');
    while (splitPath.length > 0) {
      let searchName = splitPath.shift();
      currentFolder = currentFolder.children
        ? currentFolder.children.find(({ name }) => name === searchName)
        : currentFolder.find(({ name }) => name === searchName);
    }

    let fileIndex = currentFolder.children
      ? currentFolder.children.findIndex(({ name }) => name === component.name)
      : currentFolder.findIndex(({ name }) => name === component.name);

    if (currentFolder.children) {
      currentFolder.children.splice(fileIndex, 1);
    } else {
      currentFolder.splice(fileIndex, 1);
    }
    $folders = $folders;
  }

  function edit() {
    let editName = `${component.name}.${component.type}`;
    if (editName !== 'App.svelte') {
      component.editing = true;
    }
  }

  function handleDelete() {
    deleteFile();
  }

  function contextMenu(e) {
    e.preventDefault();
    console.log(e);
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
</script>

<div
  style="background-image: url(icons/{component.type}.svg)"
  on:click={handleClick}
  on:dblclick={edit}
  on:contextmenu={contextMenu}
  class:active-component={$currentComponent === component}
>
  {component.name}.{component.type}
  {#if !(component.name === 'App' && component.type === 'svelte')}
    <button on:click={() => handleDelete(component)}>x</button>
  {/if}
  {#if component.editing}
    <input bind:value={newName} use:focus use:handleEnter on:blur={addFile} />
  {/if}
</div>

<style>
  div {
    padding: 0 0 0 1.5em;
    background: 0 0.1em no-repeat;
    background-size: 1em 1em;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  div:hover {
    background-color: #e4e4e4;
    padding-left: 100px;
    background-position: 76px 2px;
    position: relative;
    right: 76px;
    width: 100%;
  }

  input {
    position: absolute;
    padding: 0.25em;
    top: calc(-0.25em - 1px);
    left: calc(1.25em - 1px);
    width: calc(100% - 1.25em - 1px);
  }

  .active-component {
    background-color: #b0dcf5;
    padding-left: 100px;
    background-position: 76px 2px;
    position: relative;
    right: 76px;
    width: 100%;
  }
</style>
