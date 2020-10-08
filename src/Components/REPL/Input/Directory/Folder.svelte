<script>
  import File from './File.svelte';
  import { getContext } from 'svelte';
  const { folders } = getContext('Controls');
  const { components } = getContext('REPL');
  export let expanded = true;
  export let name;
  export let children;
  export let isFirst = false;
  export let selectComponent;
  let folderBase = 'svelte';
  $: folder = expanded
    ? `url(/icons/folder-${folderBase}-open.svg)`
    : `url(/icons/folder-${folderBase}.svg)`;

  if (isFirst) {
    folderBase = 'src';
  }

  function toggle() {
    expanded = !expanded;
  }

  function addFolder() {
    console.log(children);
    let newFolder = {};
    newFolder.name = 'folder';
    newFolder.type = 'directory';
    newFolder.children = [];
    children.unshift(newFolder);
  }

  function addFile() {
    let newFile = {};
    newFile.name = 'file';
    newFile.type = 'svelte';
    newFile.source = '';
    newFile.children = [];
    children.unshift(newFile);
    console.log($folders);
    $components = convertToComponent($folders);
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
</script>

<div class:expanded on:click={toggle} style="--folder: {folder}">
  {name}
  <button on:click={addFolder}>f</button>
  <button on:click={addFile}>+</button>
</div>

{#if expanded}
  <ul>
    {#each children as component}
      <li>
        {#if component.type === 'directory'}
          <svelte:self
            name={component.name}
            children={component.children}
            expanded={false}
          />
        {:else}
          <File {component} {selectComponent} />
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  div {
    padding: 0 0 0 1.5em;
    background: 0 0.1em no-repeat;
    background-image: var(--folder);
    background-size: 1em 1em;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
  }

  div:hover {
    background-color: #b0dcf5;
  }

  /*  .expanded {
     background-image: url(/icons/folder-src-open.svg);
   } */

  ul {
    padding: 0.2em 0 0 0.5em;
    margin: 0 0 0 0.5em;
    list-style: none;
    border-left: 1px solid #eee;
  }

  li {
    padding: 0.2em 0;
  }
</style>
