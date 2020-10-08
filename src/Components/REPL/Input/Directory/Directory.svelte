<script>
  import Folder from './Folder.svelte';
  import { getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import componentsToFolder from '../../../../../utils/componentsToFolder';

  export let handle_select;

  const { components, selected, request_focus, rebundle } = getContext('REPL');
  const { folders } = getContext('Controls');

  const currentPath = writable('');

  function selectComponent(component) {
    if ($selected !== component) {
      editing = null;
      handle_select(component);
    }
  }

  setContext('Directory', {
    currentPath,
    selectComponent,
  });

  let editing = null;

  function editTab(component) {
    if ($selected === component) {
      editing = $selected;
    }
  }

  function closeEdit() {
    const match = /(.+)\.(svelte|js|json|md)$/.exec($selected.name);
    $selected.name = match ? match[1] : $selected.name;
    if (isComponentNameUsed($selected)) {
      let i = 1;
      let name = $selected.name;
      do {
        $selected.name = `${name}_${i++}`;
      } while (isComponentNameUsed($selected));
    }
    if (match && match[2]) $selected.type = match[2];

    editing = null;

    // re-select, in case the type changed
    handle_select($selected);

    components = components; // TODO necessary?

    // focus the editor, but wait a beat (so key events aren't misdirected)
    setTimeout(request_focus);

    rebundle();
  }

  function remove(component) {
    let result = confirm(
      `Are you sure you want to delete ${component.name}.${component.type}?`
    );

    if (result) {
      const index = $components.indexOf(component);

      if (~index) {
        components.set(
          $components.slice(0, index).concat($components.slice(index + 1))
        );
      } else {
        console.error(`Could not find component! That's... odd`);
      }

      handle_select($components[index] || $components[$components.length - 1]);
    }
  }

  function selectInput(event) {
    setTimeout(() => {
      event.target.select();
    }, 0);
  }

  let uid = 1;

  function addNew() {
    const component = {
      name: uid++ ? `Component${uid}` : 'Component1',
      type: 'svelte',
      source: '',
    };

    editing = component;

    setTimeout(() => {
      // TODO we can do this without IDs
      document.getElementById(component.name).scrollIntoView(false);
    });

    components.update(components => components.concat(component));
    handle_select(component);
  }

  function isComponentNameUsed(editing) {
    return $components.find(
      component => component !== editing && component.name === editing.name
    );
  }

  // drag and drop
  let from = null;
  let over = null;

  function dragStart(event) {
    from = event.currentTarget.id;
  }

  function dragLeave() {
    over = null;
  }

  function dragOver(event) {
    event.preventDefault();
    over = event.currentTarget.id;
  }

  function dragEnd(event) {
    event.preventDefault();

    if (from && over) {
      const from_index = $components.findIndex(
        component => component.name === from
      );
      const to_index = $components.findIndex(
        component => component.name === over
      );

      const from_component = $components[from_index];

      $components.splice(from_index, 1);
      components.set(
        $components
          .slice(0, to_index)
          .concat(from_component)
          .concat($components.slice(to_index))
      );
    }
    from = over = null;
  }

  function focus(node) {
    node.select();
  }

  function addFolder() {
    //console.log(children);
    let newFolder = {};
    newFolder.name = 'folder';
    newFolder.type = 'directory';
    newFolder.children = [];
    console.log($folders);
    //children.unshift(newFolder);
  }

  function addFile() {
    let newFile = {};
    newFile.name = '';
    newFile.type = '';
    newFile.source = '';
    newFile.editing = true;
    // console.log(newFile);
    // components.update(components => components.concat(newFile));
    // $folders = componentsToFolder($components);
    let currentFolder = $folders;
    let splitPath = $currentPath && $currentPath.split('/');

    while (splitPath.length > 0) {
      let searchName = splitPath.shift();
      currentFolder = currentFolder.children
        ? currentFolder.children.find(({ name }) => name === searchName)
        : currentFolder.find(({ name }) => name === searchName);
    }
    currentFolder.children
      ? currentFolder.children.push(newFile)
      : $folders.push(newFile);
    $folders = $folders;
  }
</script>

<div>
  <button on:click={addFolder}>f</button>
  <button on:click={addFile}>+</button>
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
