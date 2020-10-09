<script>
  import File from './File.svelte';
  import { getContext } from 'svelte';
  import { slide } from 'svelte/transition';
  const { folders } = getContext('Controls');
  const { components } = getContext('REPL');
  const { currentPath, currentComponent } = getContext('Directory');
  export let component;
  export let expanded = true;
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
    $currentPath = component.path;
    $currentComponent = component;
  }
</script>

<div
  class:expanded
  on:click={toggle}
  style="--folder: {folder}"
  class:active-component={$currentComponent === component}
>
  {component.name}
</div>

{#if expanded}
  <ul transition:slide={{ duration: 100 }}>
    {#each component.children as childComponent}
      <li>
        {#if childComponent.type === 'directory'}
          <svelte:self component={childComponent} expanded={false} />
        {:else}
          <File component={childComponent} {selectComponent} />
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
    background-color: #e4e4e4;
    padding-left: 100px;
    background-position: 76px 2px;
    position: relative;
    right: 76px;
    width: 100%;
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

  .active-component {
    background-color: #b0dcf5;
    padding-left: 100px;
    background-position: 76px 2px;
    position: relative;
    right: 76px;
    width: 100%;
  }
</style>
