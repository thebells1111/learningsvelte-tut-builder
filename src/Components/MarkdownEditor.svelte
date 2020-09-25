<script>
  import { onMount } from 'svelte';
  import SimpleMDE from 'simplemde';

  export let markdownContent = '';
  export let mde;

  onMount(() => {
    mde = new SimpleMDE({
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
    mde.codemirror.on('change', function() {
      markdownContent = mde.value();
    });
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
</style>
