<script>
  import File from './File.svelte';

  export let expanded = false;
  export let name;
  export let children;
  export let selectComponent;

  function toggle() {
    expanded = !expanded;
  }
</script>

<div class:expanded on:click={toggle}>{name}</div>

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
    /* background: url(tutorial/icons/folder.svg) 0 0.1em no-repeat; */
    background-size: 1em 1em;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
  }

  div:hover {
    background-color: #b0dcf5;
  }

  .expanded {
    /* background-image: url(tutorial/icons/folder-open.svg); */
  }

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
