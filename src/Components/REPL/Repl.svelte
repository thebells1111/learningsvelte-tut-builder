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

  const { showMarkdownPreview, folders } = getContext('Controls');

  const historyMap = new Map();

  export function toJSON() {
    return {
      imports: $bundle.imports,
      components: $components,
    };
  }

  export async function set(data) {
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
    await module_editor.set($selected.source, $selected.type);
    output.set($selected, $compile_options);

    historyMap.clear();
    module_editor.clearHistory();

    $foldLines = Array.isArray(data.foldLine) ? data.foldLine : [data.foldLine];

    $foldLines.forEach(line => {
      if (Number(line)) {
        module_editor.foldCode(line);
      }
      if (typeof line === 'string') {
        module_editor.foldString(line);
      }
    });
  }

  export function get_selected_component() {
    return get_component_name($selected);
  }

  export function update(data) {
    const { name, type } = $selected || {};

    components.set(data.components);

    const matched_component = data.components.find(
      file => file.name === name && file.type === type
    );
    selected.set(matched_component || data.components[0]);

    injectedCSS = data.css || '';

    if (matched_component) {
      module_editor.update(matched_component.source);
      output.update(matched_component, $compile_options);
    } else {
      module_editor.set(matched_component.source, matched_component.type);
      output.set(matched_component, $compile_options);

      module_editor.clearHistory();
    }
  }

  if (!workersUrl) {
    throw new Error(`You must supply workersUrl prop to <Repl>`);
  }

  const dispatch = createEventDispatcher();

  const components = writable([]);
  const selected = writable(null);
  const bundle = writable(null);
  const foldLines = writable(null);
  $: $folders = $components && componentsToFolder($components);

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
    foldLines,
    htmlContent,

    rebundle,

    navigate: item => {
      const match = /^(.+)\.(\w+)$/.exec(item.filename);
      if (!match) return; // ???

      const [, name, type] = match;
      const component = $components.find(
        c => c.name === name && c.type === type
      );
      handle_select(component);

      setTimeout(() => {
        module_editor.focus();
        module_editor.setCursor({
          line: item.start.line - 1,
          ch: item.start.column,
        });
      }, 0);

      // TODO select the line/column in question
    },

    handle_change: event => {
      selected.update(component => {
        // TODO this is a bit hacky — we're relying on mutability
        // so that updating components works... might be better
        // if a) components had unique IDs, b) we tracked selected
        // *index* rather than component, and c) `selected` was
        // derived from `components` and `index`
        component.source = event.detail.value;
        return component;
      });

      components.update(c => c);

      // recompile selected component
      output.update($selected, $compile_options);

      rebundle();

      dispatch('change', {
        components: $components,
      });
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
  });

  export function handle_select(component) {
    console.log(component);
    historyMap.set(get_component_name($selected), module_editor.getHistory());
    selected.set(component);
    module_editor.set(component.source, component.type);
    if (historyMap.has(get_component_name($selected))) {
      module_editor.setHistory(historyMap.get(get_component_name($selected)));
    } else {
      module_editor.clearHistory();
    }
    output.set($selected, $compile_options);
  }

  function get_component_name(component) {
    return `${component.name}.${component.type}`;
  }

  let input;
  let sourceErrorLoc;
  let runtimeErrorLoc; // TODO refactor this stuff — runtimeErrorLoc is unused
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
</script>

<div class="container" class:orientation>
  <SplitPane
    type={orientation === 'rows' ? 'vertical' : 'horizontal'}
    pos={fixed ? fixedPos : 50}
    {fixed}
  >
    <section slot="a">
      <SplitPane type={'horizontal'} pos={30}>
        <section slot="a">
          <Directory {handle_select} />
        </section>
        <section slot="b">
          <ComponentSelector {handle_select} />
          <ModuleEditor
            bind:this={input}
            errorLoc={sourceErrorLoc || runtimeErrorLoc}
          />
        </section>
        <ModuleEditor
          bind:this={input}
          errorLoc={sourceErrorLoc || runtimeErrorLoc}
        />
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
    position: relative;
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
    position: relative;
    padding: 42px 0 0 0;
    height: 100%;
    box-sizing: border-box;
  }

  .container :global(section) > :global(*):first-child {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 42px;
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
  }

  .show-markdown-preview {
    display: block;
  }
</style>
