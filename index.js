function handleYamlUpload() {
  const input = document.getElementById('yaml-input');
  const files = input.files; //can get multiple files, stores in a file list


  if (!files.length) {
    alert('Please select at least one YAML file.');
    return;
  }

  Array.from(files).forEach(file => {

    console.log(file.name);
    console.log(file.type);
    console.log(file.size);

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const yamlText = event.target.result; //holds the YAML file's content as string
        console.log(yamlText);

        const data = jsyaml.load(yamlText); //parses the string into a javascript object
        console.log(data);

        if (!data.actions || !Array.isArray(data.actions)) {
          throw new Error("YAML file must have a top level actions array.")
        }
        applyActions(data.actions)

      } catch (error) {
        alert("YAML Error: " + error.message);
        console.log(error);
      }
    };

    reader.readAsText(file); //once the file is loaded then onload function is executed
  });

}

function applyActions(actions) {
  actions.forEach(action => {
    switch (action.type) {
      case 'remove':
        document.querySelectorAll(action.selector).forEach(el => el.remove());
        break;

      case 'replace':
        document.querySelectorAll(action.selector).forEach(el => {
          el.outerHTML = action.newElement || '';
        });
        break;

      case 'insert':
        const target = document.querySelector(action.target);
        if (target && action.element) {
          if (action.position === 'before') {
            target.insertAdjacentHTML('beforebegin', action.element);
          } else if (action.position === 'after') {
            target.insertAdjacentHTML('afterend', action.element);
          } else {
            target.insertAdjacentHTML('beforeend', action.element);
          }
        }
        break;

      case 'alter':
        document.querySelectorAll('*').forEach(el => {
          if (el.childNodes.length) {
            el.childNodes.forEach(node => {
              if (node.nodeType === 3 && node.nodeValue.includes(action.oldValue)) {
                node.nodeValue = node.nodeValue.replaceAll(action.oldValue, action.newValue);
              }
            });
          }
        });
        break;

      default:
        console.warn(`Unsupported action type: ${action.type}`);
    }
  });
}
