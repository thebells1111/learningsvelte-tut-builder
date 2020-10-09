<script>
  import { splitCells } from 'marked/src/helpers';

  export let component;
  import { getContext } from 'svelte';
  import folderToComponents from '../../../../../utils/folderToComponents';
  const { selectComponent, currentPath } = getContext('Directory');
  const { folders } = getContext('Controls');
  export let newName = component.name
    ? `${component.name}.${component.type}`
    : '';

  function handleClick() {
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

  function handleDelete(component) {
    deleteFile();
  }
</script>

<div
  style="background-image: url(icons/{component.type}.svg)"
  on:click={handleClick}
  on:dblclick={edit}
>
  {component.name}.{component.type}
  {#if !(component.name === 'App' && component.type === 'svelte')}
    <button on:click={() => handleDelete(component)}>x</button>
  {/if}
  {#if component.editing}
    <input bind:value={newName} use:focus on:blur={addFile} />
  {/if}
</div>

<style>
  div {
    padding: 0 0 0 1.5em;
    background: 0 0.1em no-repeat;
    background-size: 1em 1em;
    cursor: pointer;
    position: relative;
  }
  div:hover {
    background-color: #b0dcf5;
  }

  input {
    position: absolute;
    padding: 0.25em;
    top: calc(-0.25em - 1px);
    left: calc(1.25em - 1px);
  }
</style>
