<script>
  import File from './File.svelte';
  import { onMount, getContext } from 'svelte';
  const { folders } = getContext('Controls');
  const { currentPath, currentComponent } = getContext('Directory');
  export let component;
  export let isFirst = false;
  export let selectComponent;
  let folderBase = 'svelte';
  export let paddingLevel = 1;
  $: folder = component.expanded
    ? `url(/icons/folder-${folderBase}-open.svg)`
    : `url(/icons/folder-${folderBase}.svg)`;

  if (isFirst) {
    folderBase = 'src';
    paddingLevel = 0;
  }

  let newName = component.name ? `${component.name}` : '';

  function focus(node) {
    node.focus();
    node.setSelectionRange(0, node.value.lastIndexOf('.'));
  }

  function toggle() {
    component.expanded = !component.expanded;
    $currentPath = component.path;
    $currentComponent = component;
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

  function addFolder() {
    let splitName = newName.split('.');
    component.editing = false;
    let name = newName;
    if (name) {
      component.name = name;
    } else if (!component.name) {
      deleteFolder();
    }

    $folders = $folders;
  }

  function deleteFolder() {
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
    let editName = `${component.name}`;
    if (editName !== 'src') {
      component.editing = true;
    }
  }

  onMount(() => {
    if (isFirst) {
      $currentComponent = component;
    }
  });
</script>

<folder
  style="--padding-level: {0.05 + paddingLevel * 1}em"
  class:active-component={$currentComponent === component}
  on:click={toggle}
  on:dblclick={edit}
>
  <div style="--folder: {folder}" class:first-folder={isFirst}>
    {component.name}
    {#if component.editing}
      <input
        bind:value={newName}
        use:focus
        use:handleEnter
        on:blur={addFolder}
      />
    {/if}
  </div>
</folder>

{#if component.expanded}
  <ul>
    {#each component.children as childComponent}
      <li>
        {#if childComponent.type === 'directory'}
          <svelte:self
            component={childComponent}
            paddingLevel={paddingLevel + 1}
          />
        {:else}
          <File
            component={childComponent}
            {selectComponent}
            paddingLevel={paddingLevel + 1}
          />
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  div {
    padding: 0 0 0 1.75em;
    background: 0 0.1em no-repeat;
    background-image: var(--folder);
    background-size: 1em 1em;
    background-position: 0.5em;
    font-weight: bold;
    width: 100%;
    border-left: 1px solid #eee;
    position: relative;
  }

  folder {
    display: block;
    padding-left: var(--padding-level);
    cursor: pointer;
  }

  folder:hover {
    background-color: #e4e4e4;
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  li {
    height: 32px;
  }

  .active-component,
  folder.active-component:hover {
    background-color: #b0dcf5;
  }

  .first-folder {
    border: none;
  }

  input {
    position: absolute;
    padding: 0 0.25em;
    left: 1.5em;
    width: 100%;
    max-width: 175px;
    border: 1px solid#555;
    border-radius: 2px;
    outline: none;
    font: 300 var(--h4) / var(--lh) var(--font);
    color: var(--text);
    letter-spacing: -0.013em;
    font-weight: bold;
    box-sizing: content-box;
    height: 32px;
  }
</style>
