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
    currentComponent,
    folderToComponents,
    filesToTreeNodes,
    markdownContent,
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
        $mde.value($directories[$projectName][$chapterName].text);
        $markdownContent = $directories[$projectName][$chapterName].text;
        repl.set($appA);
        $currentComponent = $folders[0];
        repl.handle_select($currentComponent);
        repl.focus();
        localStorage.setItem('currentChapter', $chapterName);
      }
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
    $directories[$projectName][newChapterName] = {};
    let previousChapter = [...$chapters].pop();
    $chapterName = newChapterName;
    $chapters = $chapters.concat($chapterName);
    $directories[$projectName].chapterNames = $chapters;

    $directories[$projectName][$chapterName].text = '';

    if ($directories[$projectName][previousChapter]['app-b']) {
      $directories[$projectName][$chapterName]['app-a'] =
        $directories[$projectName][previousChapter]['app-b'];
    } else {
      $directories[$projectName][$chapterName]['app-a'] =
        $directories[$projectName][previousChapter]['app-a'];
    }

    $directories[$projectName][$chapterName]['app-b'] =
      $directories[$projectName][$chapterName]['app-a'];

    $currentApp = 'B';
    $folders = filesToTreeNodes(
      $directories[$projectName][$chapterName]['app-b']
    );
    $appA.components = folderToComponents($folders);
    $appB = { ...$appA };

    $mde.value($directories[$projectName][$chapterName].text);
    $markdownContent = $directories[$projectName][$chapterName].text;
    repl.set($appB);
    $currentComponent = $folders[0];
    repl.handle_select($currentComponent);
    repl.focus();
    localStorage.setItem('currentChapter', $chapterName);
    localStorage.setItem('directories', JSON.stringify($directories));
  }
</script>

<div>
  <div>Chapters</div>
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
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    margin: 0;
    font-size: 0.8em;
    font-weight: 700;
  }
</style>
