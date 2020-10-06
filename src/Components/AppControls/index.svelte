<script>
  import ProjectName from './ProjectName.svelte';
  import ChapterName from './ChapterName.svelte';
  import SelectAppButton from './SelectAppButton.svelte';
  import PreviewToggleButton from './PreviewToggleButton.svelte';
  import DownloadButton from './Download.svelte';
  import UploadProjects from './UploadProjects.svelte';

  import { onMount, getContext } from 'svelte';
  const {
    blankApp,
    appA,
    appB,
    directories,
    currentApp,
    mde,
    chapterName,
    projectName,
    chapters,
  } = getContext('Controls');
  import * as doNotZip from 'do-not-zip';

  export let repl;

  onMount(function mount() {
    if (repl && $mde) {
      selectNewApp();
    } else {
      setTimeout(mount, 1);
    }
  });

  function selectNewApp() {
    if ($projectName !== 'Create New Project') {
      $chapters = $directories[$projectName].chapterNames;
      $chapterName = $chapters[0];
      $currentApp = 'A';
      $appA.components = $directories[$projectName][$chapterName]['app-a'];
      if ($directories[$projectName][$chapterName]['app-b']) {
        $appB = {};
        $appB.components = $directories[$projectName][$chapterName]['app-b'];
      } else {
        $appB = { ...$blankApp };
      }
      $mde.value($directories[$projectName][$chapterName].text);
      repl.set($appA);
    }
  }
</script>

<div class="app-controls">
  <UploadProjects />
  <ProjectName {repl} />
  <ChapterName {repl} />
  <PreviewToggleButton />
  <SelectAppButton {repl} />
  <DownloadButton />
</div>

<style>
  .app-controls {
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem var(--side-nav);
    background-color: var(--second);
    color: black;
    white-space: nowrap;
    flex: 0;
  }

  /* button {
    position: relative;
    top: -0.1rem;
    display: inline-block;
    padding: 0.2em;
    opacity: 0.7;
    transition: opacity 0.3s;
    font-family: var(--font);
    font-size: 1rem;
    color: black;   
    line-height: 1;
    margin: 0 0 0 0.2em;
  }

  button:hover {
    opacity: 1;
  }
  button:disabled {
    opacity: 0.3;
  }

  input {
    background: transparent;
    color: currentColor;
    font-family: var(--font);
    font-size: 1rem;
    opacity: 0.7;
    flex: 1;
  }

  input:focus {
    opacity: 1;
  } */
</style>
