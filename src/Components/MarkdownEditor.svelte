<script>
  import { onMount, getContext } from 'svelte';
  import SimpleMDE from 'simplemde';

  export let markdownContent = '';
  const { mde } = getContext('Controls');

  onMount(() => {
    $mde = new SimpleMDE({
      forceSync: true,
      indentWithTabs: false,
      insertTexts: {
        horizontalRule: ['', '\n\n-----\n\n'],
      },

      status: false,
      renderingConfig: {
        codeSyntaxHighlighting: true,
      },
      toolbar: [
        'horizontal-rule',
        '|',
        'bold',
        'italic',
        'strikethrough',
        '|',
        'heading',
        'heading-smaller',
        'heading-bigger',
        '|',
        'quote',
        'code',
        '|',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        '|',
        'clean-block',
      ],
    });
    $mde.codemirror.on('change', function() {
      markdownContent = $mde.value();
    });
    $mde.value('');
  });
</script>

<textarea />

<style>
  textarea {
    resize: none;
    overflow: auto;
    border: none;
  }

  textarea:focus {
    border: none;
    outline: none;
  }

  :global(.editor-toolbar) {
    padding: 3px 2px;
  }

  :global(.editor-toolbar > a) {
    padding: 2px;
    border: 1px solid black;
    margin: 0 1px;
    border-radius: 3px;
  }

  :global(.separator) {
    padding: 2px;
    opacity: 0;
  }
  :global(#editor > .CodeMirror) {
    flex-grow: 1;
  }
</style>
