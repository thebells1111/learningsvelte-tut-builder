<script>
  import Folder from './Folder.svelte';
  import { getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  export let handle_select;
  const { selected } = getContext('REPL');
  const { folders } = getContext('Controls');

  const currentPath = writable('');
  const currentComponent = writable('');
  const editingFileName = writable(false);

  function selectComponent(component) {
    if ($selected !== component) {
      //editing = null;
      handle_select(component);
    }
  }

  function selectFile(component) {
    $currentComponent = component;
    selectComponent(component);
  }

  setContext('Directory', {
    currentPath,
    currentComponent,
    selectComponent,
    editingFileName,
    selectFile,
  });

  //let editing = null;
  // function editTab(component) {
  //   if ($selected === component) {
  //     editing = $selected;
  //   }
  // }
  // function closeEdit() {
  //   const match = /(.+)\.(svelte|js|json|md)$/.exec($selected.name);
  //   $selected.name = match ? match[1] : $selected.name;
  //   if (isComponentNameUsed($selected)) {
  //     let i = 1;
  //     let name = $selected.name;
  //     do {
  //       $selected.name = `${name}_${i++}`;
  //     } while (isComponentNameUsed($selected));
  //   }
  //   if (match && match[2]) $selected.type = match[2];
  //   editing = null;
  //   // re-select, in case the type changed
  //   handle_select($selected);
  //   components = components; // TODO necessary?
  //   // focus the editor, but wait a beat (so key events aren't misdirected)
  //   setTimeout(request_focus);
  //   rebundle();
  // }
  // function remove(component) {
  //   let result = confirm(
  //     `Are you sure you want to delete ${component.name}.${component.type}?`
  //   );
  //   if (result) {
  //     const index = $components.indexOf(component);
  //     if (~index) {
  //       components.set(
  //         $components.slice(0, index).concat($components.slice(index + 1))
  //       );
  //     } else {
  //       console.error(`Could not find component! That's... odd`);
  //     }
  //     handle_select($components[index] || $components[$components.length - 1]);
  //   }
  // }
  // function selectInput(event) {
  //   setTimeout(() => {
  //     event.target.select();
  //   }, 0);
  // }
  // let uid = 1;
  // function addNew() {
  //   const component = {
  //     name: uid++ ? `Component${uid}` : 'Component1',
  //     type: 'svelte',
  //     source: '',
  //   };
  //   editing = component;
  //   setTimeout(() => {
  //     // TODO we can do this without IDs
  //     document.getElementById(component.name).scrollIntoView(false);
  //   });
  //   components.update(components => components.concat(component));
  //   handle_select(component);
  // }
  // function isComponentNameUsed(editing) {
  //   return $components.find(
  //     component => component !== editing && component.name === editing.name
  //   );
  // }
  // // drag and drop
  // let from = null;
  // let over = null;
  // function dragStart(event) {
  //   from = event.currentTarget.id;
  // }
  // function dragLeave() {
  //   over = null;
  // }
  // function dragOver(event) {
  //   event.preventDefault();
  //   over = event.currentTarget.id;
  // }
  // function dragEnd(event) {
  //   event.preventDefault();
  //   if (from && over) {
  //     const from_index = $components.findIndex(
  //       component => component.name === from
  //     );
  //     const to_index = $components.findIndex(
  //       component => component.name === over
  //     );
  //     const from_component = $components[from_index];
  //     $components.splice(from_index, 1);
  //     components.set(
  //       $components
  //         .slice(0, to_index)
  //         .concat(from_component)
  //         .concat($components.slice(to_index))
  //     );
  //   }
  //   from = over = null;
  // }
  // function focus(node) {
  //   node.select();
  // }
  function addFolder() {
    //console.log(children);
    let newFolder = {};
    newFolder.name = '';
    newFolder.type = 'directory';
    newFolder.path = $currentPath
      ? $currentPath + '/' + newFolder.name
      : newFolder.name;
    newFolder.editing = true;
    newFolder.children = [];
    //children.unshift(newFolder);
    let currentFolder = $folders;
    let splitPath = $currentPath && $currentPath.split('/');
    while (splitPath.length > 0) {
      let searchName = splitPath.shift();
      currentFolder = currentFolder.children
        ? currentFolder.children.find(({ name }) => name === searchName)
        : currentFolder.find(({ name }) => name === searchName);
    }
    currentFolder.children
      ? currentFolder.children.push(newFolder)
      : $folders.push(newFolder);
    $currentComponent.expanded = true;
    $folders = $folders;
  }
  function addFile() {
    let newFile = {};
    newFile.name = '';
    newFile.type = '';
    newFile.source = '';
    newFile.path = $currentPath;
    newFile.editing = true;
    let currentFolder = $folders;
    let splitPath = $currentPath && $currentPath.split('/');
    while (splitPath.length > 0) {
      let searchName = splitPath.shift();
      currentFolder = currentFolder.children
        ? currentFolder.children.find(({ name }) => name === searchName)
        : currentFolder.find(({ name }) => name === searchName);
    }
    if (currentFolder.children) {
      currentFolder.children.push(newFile);
    } else {
      $folders.push(newFile);
    }
    $currentComponent.expanded = true;
    $folders = $folders;
  }
</script>

<div class:editing={editingFileName}>
  <button class="add-folder" on:click={addFolder} />
  <button class="add-file" on:click={addFile} />
  <Folder
    component={{ name: 'src', path: '', children: $folders, expanded: true }}
    isFirst={true}
    {selectComponent}
  />
</div>

<style>
  div {
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    padding-top: 0.5em;
  }

  button {
    background: 0 0.1em no-repeat;
    width: 24px;
    height: 24px;
    border: none;
  }

  .add-folder {
    background-image: url(/icons/new-folder.svg);
  }

  .add-file {
    background-image: url(/icons/new-file.svg);
  }
</style>
