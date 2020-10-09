export default function componentsToFolder(arr) {
  var tree = {};
  function addnode(obj) {
    obj.webkitRelativePath = obj.name + '.' + obj.type;
    var splitpath = obj.webkitRelativePath.replace(/^\/|\/$/g, '').split('/');
    var ptr = tree;
    for (let i = 0; i < splitpath.length; i++) {
      let node = {
        name: splitpath[i],
        type: 'directory',
        path: splitpath.slice(0, i + 1).join('/'),
      };
      if (i == splitpath.length - 1) {
        let splitTemp = [...splitpath];
        let splitName = splitTemp.pop().split('.');
        node.type = splitName.pop();
        node.name = splitName.join('.');
        node.source = obj.source;
        node.webkitRelativePath = obj.webkitRelativePath;
        node.path = splitTemp.join('/');
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
