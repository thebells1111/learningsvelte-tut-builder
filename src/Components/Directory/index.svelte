<script>
  import Folder from './Folder.svelte';
  import { getContext } from 'svelte';
  const { folders } = getContext('Controls');
</script>

<div>
  <Folder name="src" isFirst={true} children={$folders} expanded />
</div>
