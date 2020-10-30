<script>
  import { setContext, getContext, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import SplitPane from './SplitPane.svelte';
  import ComponentSelector from './Input/ComponentSelector.svelte';
  import Directory from './Input/Directory/Directory.svelte';
  import ModuleEditor from './Input/ModuleEditor.svelte';
  import Output from './Output/index.svelte';
  import Bundler from './Bundler.js';
  import { is_browser } from './env.js';
  import componentsToFolder from '../../../utils/componentsToFolder';
  import folderToComponents from '../../../utils/folderToComponents';

  export let workersUrl;
  export let packagesUrl = 'https://unpkg.com';
  export let svelteUrl = `${packagesUrl}/svelte`;
  export let embedded = false;
  export let orientation = 'columns';
  export let relaxed = true;
  export let fixed = false;
  export let fixedPos = 50;
  export let injectedJS = '';
  export let injectedCSS = '';
  export let htmlContent = '';
  let directoryElement;
  let directoryExpanded = true;
  let storedDirectoryWidth = '33%';
  let storedEditorWidth = '67%';

  const {
    showMarkdownPreview,
    folders,
    updateApps,
    currentComponent,
    unsavedState,
  } = getContext('Controls');

  export function toJSON() {
    return {
      imports: $bundle.imports,
      components: $components,
    };
  }

  // this gets called by the parent component on initialization, typically using onMount
  export async function set(data) {
    //this creates a model and adds it to the component object for the initial components
    data.components.forEach(component => {
      component.model = module_editor.createNewModel(
        component.source,
        component.type === 'svelte' ? 'html' : component.type
      );
    });

    components.set(data.components);
    let selectedIndex = 0;
    if (data.selectedComponent) {
      const name = data.selectedComponent.split('.')[0];
      const type = data.selectedComponent.split('.')[1];
      data.components.forEach((v, i) => {
        if (v.name === name && v.type === type) {
          selectedIndex = i;
        }
      });
    }
    selected.set(data.components[selectedIndex]);

    rebundle();

    await module_editor_ready;
    await output_ready;

    injectedCSS = data.css || '';
    output.set($selected, $compile_options);
    module_editor.setNewModel(data.components[0].model);
  }

  export function update(data) {
    const { name, type } = $selected || {};

    components.set(data.components);
    data.components.forEach(component => {
      if (!component.model) {
        component.model = module_editor.createNewModel(
          component.source,
          component.type === 'svelte' ? 'html' : component.type
        );
      }
    });

    const matched_component = data.components.find(
      file => file.name === name && file.type === type
    );
    selected.set(matched_component || data.components[0]);

    injectedCSS = data.css || '';

    if (matched_component) {
      output.update(matched_component, $compile_options);
      module_editor.setNewModel(matched_component.model);
    } else {
      output.set(data.components[0], $compile_options);
      module_editor.setNewModel(data.components[0]);
    }
  }

  export function get_selected_component() {
    return get_component_name($selected);
  }

  if (!workersUrl) {
    throw new Error(`You must supply workersUrl prop to <Repl>`);
  }

  const dispatch = createEventDispatcher();

  const components = writable([]);
  const selected = writable(null);
  const bundle = writable(null);

  const compile_options = writable({
    generate: 'dom',
    dev: false,
    css: false,
    hydratable: false,
    customElement: false,
    immutable: false,
    legacy: false,
  });

  let module_editor;
  let output;

  let current_token;
  async function rebundle() {
    const token = (current_token = {});
    const result = await bundler.bundle($components);
    if (result && token === current_token) bundle.set(result);
  }

  // TODO this is a horrible kludge, written in a panic. fix it
  let fulfil_module_editor_ready;
  let module_editor_ready = new Promise(f => (fulfil_module_editor_ready = f));

  let fulfil_output_ready;
  let output_ready = new Promise(f => (fulfil_output_ready = f));

  setContext('REPL', {
    components,
    selected,
    bundle,
    compile_options,
    rebundle,
    htmlContent,

    navigate: item => {
      const match = /^(.+)\.(\w+)$/.exec(item.filename);
      if (!match) return; // ???

      const [, name, type] = match;
      const component = $components.find(
        c => c.name === name && c.type === type
      );
      handle_select(component);

      // setTimeout(() => {
      //   module_editor.focus();
      //   module_editor.setCursor({
      //     line: item.start.line - 1,
      //     ch: item.start.column,
      //   });
      // }, 0);

      // TODO select the line/column in question
    },

    handle_delete: component => {
      console.log(component);
      module_editor.deleteModel(component);
    },

    handle_change: event => {
      $unsavedState = true;
      selected.update(component => {
        // TODO this is a bit hacky — we're relying on mutability
        // so that updating components works... might be better
        // if a) components had unique IDs, b) we tracked selected
        // *index* rather than component, and c) `selected` was
        // derived from `components` and `index`
        component.source = event.detail.value;
        return component;
      });
      $components = folderToComponents($folders);
      updateApps($components);

      // recompile selected component
      output.update($selected, $compile_options);

      rebundle();

      dispatch('change', {
        components: $components,
      });
    },

    handle_file_delete(fileIndex) {
      $unsavedState = true;
      $components = folderToComponents($folders);

      // recompile selected component
      output.update($components[0], $compile_options);

      rebundle();

      if (fileIndex >= $components.length) {
        $currentComponent = $folders[$components.length - 1];
        handle_select($currentComponent);
      }
    },

    handle_rename() {
      $unsavedState = true;
      $components = folderToComponents($folders); // recompile selected component
      output.update($components[0], $compile_options);

      rebundle();
    },

    register_module_editor(editor) {
      module_editor = editor;
      fulfil_module_editor_ready();
    },

    register_output(handlers) {
      output = handlers;
      fulfil_output_ready();
    },

    request_focus() {
      module_editor.focus();
    },

    layout() {
      module_editor.layout();
    },
  });

  export function focus() {
    module_editor.focus();
  }

  export function layout() {
    module_editor.layout();
  }

  export function handle_select(component) {
    //creates a model and adds it to the component object for new components
    if (!component.model) {
      component.model = module_editor.createNewModel(
        component.source,
        component.type === 'svelte' ? 'html' : component.type
      );
    }
    module_editor.setNewModel(component.model);
    selected.set(component);
    output.set($selected, $compile_options);
  }

  function get_component_name(component) {
    return `${component.name}.${component.type}`;
  }

  let input;
  let status = null;

  const bundler =
    is_browser &&
    new Bundler({
      workersUrl,
      packagesUrl,
      svelteUrl,
      onstatus: message => {
        status = message;
      },
    });

  $: if (output && $selected) {
    output.update($selected, $compile_options);
  }

  function handleKeydown(event) {
    if (
      event.key === 'b' &&
      (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel'
        ? event.metaKey
        : event.ctrlKey)
    ) {
      event.preventDefault();
      toggleDirectory();
    }
  }

  function toggleDirectory() {
    let container = directoryElement.parentElement.parentElement;
    let panes = container.querySelectorAll('.pane');
    let directory = panes[0];
    let editor = panes[1];
    let divider = container.querySelector('.divider');
    if (directoryExpanded) {
      storedDirectoryWidth = directory.style.width;
      storedEditorWidth = editor.style.width;
      directory.style.width = '0%';
      editor.style.width = '100%';
    } else {
      directory.style.width = storedDirectoryWidth;
      editor.style.width = storedEditorWidth;
    }

    divider.style.left = `calc(${directory.style.width}`;
    directoryExpanded = !directoryExpanded;
    layout();
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="container" class:orientation>
  <SplitPane
    type={orientation === 'rows' ? 'vertical' : 'horizontal'}
    pos={fixed ? fixedPos : orientation === 'rows' ? 50 : 60}
    {fixed}
  >
    <section slot="a">
      <SplitPane type={'horizontal'} pos={33}>
        <section class="directory" slot="a" bind:this={directoryElement}>
          <Directory {handle_select} />
        </section>
        <section class="module-editor" slot="b">
          <ModuleEditor bind:this={input} />
        </section>
      </SplitPane>
    </section>

    <section slot="b" style="height: 100%;">
      <Output
        {svelteUrl}
        {workersUrl}
        {status}
        {embedded}
        {relaxed}
        {injectedJS}
        {injectedCSS}
      />
      <div
        class="markdown-preview"
        class:show-markdown-preview={$showMarkdownPreview}
      >
        {@html htmlContent}
      </div>

    </section>
  </SplitPane>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    background-color: #fff;
    --font: 'Inter', 'Open Sans', 'Helvetica', 'Verdana', sans-serif;
    --font-mono: 'Inconsolata', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono',
      'Courier New', monospace;
    --prime: #005cc5;
    --back-light: #fff;
  }

  .container :global(section) {
    height: 100%;
    box-sizing: border-box;
  }

  .container :global(section) > :global(*):first-child {
    width: 100%;
    box-sizing: border-box;
  }

  .container :global(section) > :global(*):last-child {
    width: 100%;
    height: 100%;
  }

  .markdown-preview {
    position: absolute;
    background-color: white;
    z-index: 99;
    top: 0;
    left: 1px;
    width: calc(100% - 1px) !important;
    display: none;
    padding: 1em;
    height: 100%;
    overflow: auto;
    word-wrap: break-word;
  }

  .show-markdown-preview {
    display: block;
  }
</style>
