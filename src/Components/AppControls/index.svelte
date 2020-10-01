<script>
  import ProjectName from './ProjectName.svelte';
  import ChapterName from './ChapterName.svelte';
  import SelectAppButton from './SelectAppButton.svelte';
  import PreviewToggleButton from './PreviewToggleButton.svelte';
  import DownloadButton from './Download.svelte';

  import { onMount, getContext } from 'svelte';
  const { blankApp, appA, appB, directories, currentApp, mde } = getContext(
    'Controls'
  );
  import * as doNotZip from 'do-not-zip';

  export let repl;

  let projectName = '01-random_quote_machine';

  onMount(function mount() {
    if (repl && $mde) {
      selectNewApp();
    } else {
      setTimeout(mount, 1);
    }
  });

  function selectNewApp() {
    if (projectName !== 'Create New Project') {
      let chapterName = Object.keys($directories[projectName]).sort()[0];
      $currentApp = 'A';
      $appA.components = $directories[projectName][chapterName].appA;
      if ($directories[projectName][chapterName].appB) {
        $appB = {};
        $appB.components = $directories[projectName][chapterName].appB;
      } else {
        $appB = { ...$blankApp };
      }
      $mde.value($directories[projectName][chapterName].text.source);
      repl.set($appA);
    }
  }

  // async function handleFileUpload(e) {
  //   let newAppA = [];
  //   let newAppB = [];
  //   for (let file of e.target.files) {
  //     let relativePath = file.webkitRelativePath;
  //     let $directories = relativePath.split('/');
  //     let directoryLevelOne = $directories[$directories.length - 2];

  //     if (file.name === 'text.md') {
  //       chapterName = directoryLevelOne;
  //       $mde.value(await readFileAsync(file));
  //     } else {
  //       let appFile = file.name.split('.');
  //       let source = await readFileAsync(file);
  //       if (directoryLevelOne == 'app-a') {
  //         newAppA.push({
  //           name: appFile[0],
  //           type: appFile[1],
  //           source: source,
  //         });
  //       } else if (directoryLevelOne == 'app-b') {
  //         newAppB.push({
  //           name: appFile[0],
  //           type: appFile[1],
  //           source: source,
  //         });
  //       }
  //     }
  //   }
  //   appA = { components: newAppA };
  //   appB = { components: newAppB };
  //   repl.set($currentApp === 'A' ? appA : appB);
  // }

  // function readFileAsync(file) {
  //   return new Promise((resolve, reject) => {
  //     let reader = new FileReader();

  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };

  //     reader.onerror = reject;

  //     reader.readAsText(file);
  //   });
  // }
</script>

<div class="app-controls">
  <!-- <input
    type="file"
    webkitdirectory
    mozdirectory
    on:change={handleFileUpload}
  /> -->
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

  button {
    position: relative;
    top: -0.1rem;
    display: inline-block;
    padding: 0.2em;
    opacity: 0.7;
    transition: opacity 0.3s;
    font-family: var(--font);
    font-size: 1rem;
    color: black;
    /* width: 1.6em;
		height: 1.6em; */
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
  }
</style>
