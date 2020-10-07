<script>
  import Folder from './Folder.svelte';
  import { getContext } from 'svelte';
  const { folders } = getContext('Controls');
  export let selectComponent;
</script>

<div>
  <Folder
    name="src"
    isFirst={true}
    children={$folders}
    expanded
    {selectComponent}
  />
</div>

<style>
  div {
    position: relative !important;
    height: auto !important;
  }
</style>
