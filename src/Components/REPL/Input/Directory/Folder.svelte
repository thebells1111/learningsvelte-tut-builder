<script>
  import File from './File.svelte';
  import FolderSvelteIcon from './icons/FolderSvelteIcon.svelte';
  import FolderSvelteOpenIcon from './icons/FolderSvelteOpenIcon.svelte';
  import FolderSrcIcon from './icons/FolderSrcIcon.svelte';
  import FolderSrcOpenIcon from './icons/FolderSrcOpenIcon.svelte';
  import { onMount, getContext } from 'svelte';
  const {
    currentPath,
    currentComponent,
    folders,
    contextMenuComponent,
  } = getContext('Directory');

  export let component;
  export let isFirst = false;
  export let selectComponent;
  export let paddingLevel = 1;

  let icons = {
    folderSvelte: FolderSvelteIcon,
    folderSvelteOpen: FolderSvelteOpenIcon,
    folderSrc: FolderSrcIcon,
    folderSrcOpen: FolderSrcOpenIcon,
  };

  $: folderIcon = `folder${component.name.charAt(0).toUpperCase() +
    component.name.slice(1).toLowerCase()}${component.expanded ? 'Open' : ''}`;
  //construct string to match icons object keys based on folder name

  if (isFirst) {
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
    component.editing = false;
    let name = newName;
    if (name) {
      component.name = name;
      component.path = $currentPath
        ? $currentPath + '/' + component.name
        : component.name;
      $currentPath = component.path;
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

  onMount(() => {
    if (isFirst) {
      $currentComponent = component;
    }
  });

  function handleContextMenu(e) {
    if (component.name !== 'src') {
      $contextMenuComponent = component;
    }
  }
</script>

<folder
  style="--padding-level: {0.05 + paddingLevel * 1}em; --move-left: -{0.05 + paddingLevel * 1}em"
  class:active-component={$currentComponent === component}
  on:click={toggle}
  on:contextmenu={handleContextMenu}
>
  <div class:first-folder={isFirst}>
    <svelte:component
      this={icons[folderIcon] || component.expanded ? icons.folderSvelteOpen : icons.folderSvelte}
    />
    <span>{component.name}</span>
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
  <ul style="--padding-level: {0.05 + paddingLevel * 1}em">
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
    padding: 0 0 0 0.5em;
    font-weight: bold;
    width: 100%;
    position: relative;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: hidden;
    user-select: none;
  }

  folder {
    display: block;
    padding-left: var(--padding-level);
    cursor: pointer;
    position: relative;
    left: var(--move-left);
    width: calc(100% + var(--padding-level));
  }

  folder:hover {
    background-color: #e4e4e4;
  }

  .active-component,
  folder.active-component:hover {
    background-color: #b0dcf5;
  }

  .first-folder {
    border: none;
  }

  ul {
    /* background-color: var(--color); */
    margin: 0 0 0 1em;
    border-left: 1px solid #eee;
  }

  li {
    list-style-type: none;
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
