<script>
  import { onMount } from 'svelte';
  import * as monaco from 'monaco-editor';
  import { createEventDispatcher } from 'svelte';

  import sveltePlugin from '../../../utils/newPlugin.js';

  let editorDOM;
  let editor;

  export let readonly = false;
  export let mode;

  export function createNewModel(text, type) {
    let model = monaco.editor.createModel(text, type);
    model.onDidChangeContent(e => {
      dispatch('didContentChange', {
        value: model.getValue(),
      });
    });
    return model.uri;
  }

  export function setNewModel(model_uri) {
    let modelInstance = monaco.editor.getModel(model_uri);
    editor.setModel(modelInstance);
  }

  export function deleteModel(model_uri) {
    monaco.editor.getModel(model_uri).dispose();
  }

  export function focus() {
    editor.focus();
  }

  export function setValue(code) {
    editor.setValue(code);
  }

  export function layout() {
    editor.layout();
  }

  const dispatch = createEventDispatcher();

  onMount(() => {
    editor = monaco.editor.create(editorDOM, {
      model: null,
      tabSize: 2,
      wordWrapColumn: mode ? 40 : 80,
      wordWrapMinified: true,
      wrappingIndent: 'indent',
      scrollBeyondLastLine: mode ? false : true,
      readOnly: readonly,
      wordWrap: 'on',
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
    });
  });

  function handleKeydown(event) {
    if (
      event.key === 'r' &&
      (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel'
        ? event.metaKey
        : event.ctrlKey)
    ) {
      event.preventDefault();
      //editor.layout();
      format();
    }
  }

  function format() {
    console.log(editor.getValue());
    let code = sveltePlugin.format(editor.getValue(), {
      parser: 'svelte',
      plugins: [sveltePlugin],
    });
    editor.setValue(code);
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div id="container" bind:this={editorDOM} />

<style>
  div {
    height: 100%;
  }
</style>
