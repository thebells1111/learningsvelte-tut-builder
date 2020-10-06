<script>
  async function handleFileUpload(e) {
    let fileList = [];
    for (let file of e.target.files) {
      let relativePath = file.webkitRelativePath;
      let f = {};
      f.directory = relativePath.split('/');
      f.webkitRelativePath = file.webkitRelativePath;
      f.name = file.name;
      f.source = await readFileAsync(file);
      fileList.push(f);
    }
    let x = fileListToFolder(fileList);
    console.log(x);
  }

  function fileListToFolder(fileList) {
    let folder = {};

    folder.projectNames = new Set();
    for (let file of fileList) {
      let relativePath = file.webkitRelativePath;
      let directories = relativePath.split('/');
      directories.shift();
      let project = directories.shift();
      let chapter = directories.shift();
      let app = directories.shift();
      folder.projectNames.add(project);
      folder[project] = folder[project] || {};
      folder[project].chapterNames = folder[project].chapterNames || new Set();
      if (chapter !== `meta.json`) {
        folder[project].chapterNames.add(chapter);
        folder[project][chapter] = folder[project][chapter] || {};
      } else {
        folder[project].meta = file.source; //change this to actual meta data
      }
      if (app) {
        if (app !== `text.md`) {
          folder[project][chapter][app] = folder[project][chapter][app] || {
            folders: [],
          };

          folder[project][chapter][app].folders.push({
            webkitRelativePath: directories.join('/'),
            source: file.source,
          });
        } else {
          folder[project][chapter].text = file.source; //change this to actual text.md
        }
      }
    }

    folder.projectNames = [...folder.projectNames].sort();
    folder.projectNames.forEach(project => {
      folder[project].chapterNames = [...folder[project].chapterNames].sort();
    });
    return folder;
  }

  function filesToTreeNodes(arr) {
    var tree = {};
    function addnode(obj) {
      var splitpath = obj.webkitRelativePath.replace(/^\/|\/$/g, '').split('/');
      var ptr = tree;
      for (let i = 0; i < splitpath.length; i++) {
        let node = {
          name: splitpath[i],
          type: 'directory',
          path: obj.webkitRelativePath
            .split('.')
            .slice(0, -1)
            .join('.'),
        };
        if (i == splitpath.length - 1) {
          let splitName = splitpath[i].split('.');
          node.type = splitName.pop();
          node.name = splitName.join('.');
          node.source = obj.source;
        }
        ptr[splitpath[i]] = ptr[splitpath[i]] || node;
        ptr[splitpath[i]].children = ptr[splitpath[i]].children || {};
        ptr = ptr[splitpath[i]].children;
      }
    }
    function objectToArr(node) {
      Object.keys(node || {})
        .map(k => {
          if (node[k].children) {
            objectToArr(node[k]);
          }
        })
        .sort((a, b) => {
          let aa = a.name.toLowerCase(),
            bb = b.name.toLowerCase();

          if (aa < bb) {
            return -1;
          }
          if (aa > bb) {
            return 1;
          }
          return 0;
        });
      if (node.children) {
        node.children = Object.values(node.children).sort((a, b) => {
          let aa = a.name.toLowerCase(),
            bb = b.name.toLowerCase();

          if (aa < bb) {
            return -1;
          }
          if (aa > bb) {
            return 1;
          }
          return 0;
        });
        node.children.forEach(objectToArr);
      }
    }
    arr.map(addnode);
    objectToArr(tree);
    return Object.values(tree);
  }

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsText(file);
    });
  }
</script>

<input type="file" webkitdirectory mozdirectory on:change={handleFileUpload} />
