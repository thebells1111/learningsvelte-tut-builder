<script>
  export let component;
  import { getContext } from 'svelte';
  import folderToComponents from '../../../../../utils/folderToComponents';
  const { selectComponent } = getContext('Directory');
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
    component.type = splitName.pop();
    component.name = splitName.join('.');
    $folders = $folders;
    console.log($folders);
    console.log(folderToComponents($folders));
  }

  function edit() {
    let editName = `${component.name}.${component.type}`;
    if (editName !== 'App.svelte') {
      component.editing = true;
    }
  }
</script>

<div
  style="background-image: url(icons/{component.type}.svg)"
  on:click={handleClick}
  on:dblclick={edit}
>
  {component.name}.{component.type}
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
