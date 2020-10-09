export default function folderToComponent(file) {
  let initialPath = '';
  let components = [];

  function c(x, path) {
    x.forEach(f => {
      if (f.type === 'folder') {
        initialPath += `${f.name}/`;
        c(f.files, initialPath);
        initialPath = path ? `${path}` : '';
      } else {
        if (f.name === 'index') {
          initialPath = initialPath.slice(0, -1);
          f.name = '';
        }
        components.push({
          name: `${initialPath}${f.name}`,
          type: f.type,
          source: f.source,
        });
      }
    });
  }
  c(file);
  return components;
}
