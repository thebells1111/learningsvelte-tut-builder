<script>
  import Folder from './Folder.svelte';
  import { getContext } from 'svelte';
  const { folders, currentPath } = getContext('Controls');

  export let handle_select;

  const { components, selected, request_focus, rebundle } = getContext('REPL');

  let editing = null;

  function selectComponent(component) {
    console.log($selected);
    if ($selected !== component) {
      editing = null;
      handle_select(component);
    }
  }

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
    console.log($folders);
    let newFolder = {};
    newFolder.name = 'folder';
    newFolder.type = 'directory';
    newFolder.path = $currentPath
      ? $currentPath + '/' + newFolder.name
      : newFolder.name;
    newFolder.children = [];
    $folders.unshift(newFolder);
    const result = $folders.find(({ name }) => name === newFolder.name);
    console.log(result);
    $folders = $folders;
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

<div>
  <button class="add-folder" on:click={addFolder} />
  <button class="add-file" on:click={addFile} />
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

  button {
    background: 0 0.1em no-repeat;
    width: 24px;
    height: 24px;
  }

  .add-folder {
    background-image: url(/icons/new-folder.svg);
  }

  .add-file {
    background-image: url(/icons/new-file.svg);
  }
</style>
