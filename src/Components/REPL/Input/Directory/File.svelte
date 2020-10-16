<script>
  export let component;
  import { getContext } from 'svelte';
  import SvelteIcon from './icons/SvelteIcon.svelte';
  import JsonIcon from './icons/JsonIcon.svelte';
  import JavaScriptIcon from './icons/JavaScriptIcon.svelte';
  import FileIcon from './icons/FileIcon.svelte';
  const {
    currentComponent,
    contextMenuComponent,
    selectFile,
    folders,
    handleComponentRename,
    deleteFile,
  } = getContext('Directory');

  export let paddingLevel = 1;

  let newName = component.name ? `${component.name}.${component.type}` : '';

  let icons = {
    svelte: SvelteIcon,
    json: JsonIcon,
    js: JavaScriptIcon,
    file: FileIcon,
  };

  function handleClick(e) {
    if (e.target.nodeName !== 'INPUT') {
      selectFile(component);
    }
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
      handleComponentRename();
    } else if (!(component.name && component.type)) {
      deleteFile();
    }
  }

  function edit() {
    let editName = `${component.name}.${component.type}`;
    if (editName !== 'App.svelte') {
      component.editing = true;
    }
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

  function handleContextMenu(e) {
    e.preventDefault();
    if (!(component.name === 'App' && component.type === 'svelte')) {
      $contextMenuComponent = component;
    }
  }
</script>

<file
  style="--padding-level: {0.05 + paddingLevel * 1}em"
  class:active-component={$currentComponent === component}
  on:click={handleClick}
  on:dblclick={edit}
  on:contextmenu={handleContextMenu}
>
  <div>
    <svelte:component this={icons[component.type] || icons.file} />
    <span>{component.name}.{component.type}</span>
    {#if component.editing}
      <input
        bind:value={newName}
        use:focus
        use:handleEnter
        on:blur={addFile}
        spellcheck="false"
      />
    {/if}
  </div>
</file>

<style>
  file {
    display: block;
    padding-left: var(--padding-level);
    cursor: pointer;
    align-items: center;
  }

  file:hover {
    background-color: #e4e4e4;
  }

  div {
    padding: 0 0 0 0.5em;
    position: relative;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: hidden;
    border-left: 1px solid #eee;
  }

  span {
    position: relative;
    padding-left: 0.125em;
  }

  .active-component,
  file.active-component:hover {
    background-color: #b0dcf5;
  }
  button {
    background-color: transparent;
    border: none;
    padding: 0 1em;
    z-index: 99;
  }

  input {
    position: absolute;
    padding: 0 0.125em;
    left: 1.875em;
    width: calc(100% - 32px);
    max-width: 175px;
    border: 1px solid#555;
    border-radius: 2px;
    outline: none;
    font: 300 var(--h4) / var(--lh) var(--font);
    color: var(--text);
    letter-spacing: -0.013em;
    box-sizing: content-box;
    height: calc(100% - 2px);
    /* opacity: 25%;
    color: red;
    background-color: transparent; */
  }
</style>
