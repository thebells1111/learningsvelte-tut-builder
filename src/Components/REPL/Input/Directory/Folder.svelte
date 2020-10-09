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
  export let paddingLevel = 1;
  $: folder = expanded
    ? `url(/icons/folder-${folderBase}-open.svg)`
    : `url(/icons/folder-${folderBase}.svg)`;

  if (isFirst) {
    folderBase = 'src';
    paddingLevel = 0;
  }

  function toggle() {
    expanded = !expanded;
    $currentPath = component.path;
    $currentComponent = component;
  }
</script>

<folder style="--padding-level: {paddingLevel * 1.5}em">
  <div
    class:expanded
    on:click={toggle}
    style="--folder: {folder}"
    class:active-component={$currentComponent === component}
  >
    {component.name}
  </div>
</folder>

{#if expanded}
  <ul transition:slide={{ duration: 100 }}>
    {#each component.children as childComponent}
      <li>
        {#if childComponent.type === 'directory'}
          <svelte:self
            component={childComponent}
            expanded={false}
            paddingLevel={paddingLevel + 1}
          />
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

  folder {
    display: block;
    padding-left: var(--padding-level);
  }

  folder:hover {
    background-color: #e4e4e4;
  }

  /*  .expanded {
     background-image: url(/icons/folder-src-open.svg);
   } */

  ul {
    padding: 0.2em 0 0 0.5em;
    padding: 0;
    margin: 0 0 0 0.5em;
    margin: 0;
    list-style: none;
    border-left: 1px solid #eee;
  }

  li {
    /* padding: 0.2em 0; */
  }

  .active-component,
  .active-component:hover {
    background-color: #b0dcf5;
  }
</style>
