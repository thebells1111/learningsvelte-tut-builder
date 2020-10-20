<script>
  import { getContext } from 'svelte';
  export let repl;

  const {
    blankApp,
    appA,
    appB,
    mde,
    directories,
    currentApp,
    projectName,
    chapterName,
    chapters,
    folders,
    folderToComponents,
    filesToTreeNodes,
  } = getContext('Controls');
  let newChapterName = '';

  function handleEnter(node) {
    function enter(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        e.target.blur();
      }
    }

    node.addEventListener('keydown', enter);
    return {
      destroy() {
        node.removeEventListener('keydown', enter);
      },
    };
  }

  function selectNewApp() {
    if ($chapterName !== 'Create New Chapter') {
      $currentApp = 'A';
      $folders = filesToTreeNodes(
        $directories[$projectName][$chapterName]['app-a']
      );
      $appA.components = folderToComponents($folders);
      if ($directories[$projectName][$chapterName]['app-b']) {
        let appBFolders = filesToTreeNodes(
          $directories[$projectName][$chapterName]['app-b']
        );
        $appB = {};
        $appB.components = folderToComponents(appBFolders);
      } else {
        $appB = { ...$blankApp };
      }
      $mde.value($directories[$projectName][$chapterName].text);
      repl.set($appA);
    }
  }

  function focus(node) {
    node.focus();
  }

  function enterNewChapter() {
    let chapterNumbers = $chapters.map(v => {
      return parseInt(v);
    });
    let nextChapterNumber = chapterNumbers[chapterNumbers.length - 1] + 1;
    nextChapterNumber =
      nextChapterNumber < 10 ? '0' + nextChapterNumber : nextChapterNumber;

    newChapterName = `${nextChapterNumber}-`;
  }

  function createNewChapter() {
    $chapterName = newChapterName;
    $chapters = $chapters.concat($chapterName);
  }
</script>

{#if $chapterName !== 'Create New Chapter'}
  <!-- svelte-ignore a11y-no-onchange -->
  <select bind:value={$chapterName} on:change={selectNewApp}>
    {#each $chapters as chapter}
      <option value={chapter}>{chapter}</option>
    {/each}
    <option value="Create New Chapter">Create New Chapter</option>
  </select>
{:else}
  <input
    bind:value={newChapterName}
    on:focus={enterNewChapter}
    on:blur={createNewChapter}
    use:handleEnter
    use:focus
  />
{/if}
