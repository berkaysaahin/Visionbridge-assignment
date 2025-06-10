function handleYamlUpload() {
  const input = document.getElementById('yaml-input');
  const files = input.files; //can get multiple files, stores in a file list

  let allActions = [];
  let filesProceeded = 0;

  if (!files.length) {
    alert('Please select at least one YAML file.');
    return;
  }


  Array.from(files).forEach(file => {

    const reader = new FileReader();

    reader.onload = function (event) {

      try {
        const data = jsyaml.load(event.target.result); //parses the YAML file's content into a javascript object
        if (!data.actions || !Array.isArray(data.actions)) {
          throw new Error("YAML file must have an actions array.");
        }
        allActions.push(...data.actions);
      } catch (error) {
        alert("YAML Error: " + error.message);
        console.log(error);
      } finally {
        filesProceeded++;
        if (filesProceeded === files.length) {
          applyActions(allActions);
          console.log(`Processed ${allActions.length} actions successfully`);
        }
      }
    };

    reader.onerror = function() {
      console.log("File reading failed");
    }

    reader.readAsText(file); //once the file is loaded then onload function is executed
  });

}

function applyActions(actions) {
  actions.forEach(action => {
    //the function is called with an array of action objects and is checked each with the switch-case, based on the type value the action is executed
    switch (action.type) {
      case 'remove':
        const elementsToRemove = document.querySelectorAll(action.selector);
        console.log(`Found ${elementsToRemove.length} of ${action.selector} to remove`);
        elementsToRemove.forEach(el => el.remove());
        break;

      case 'replace':
        const elementsToReplace = document.querySelectorAll(action.selector);
        console.log(`Found ${elementsToReplace.length} of "${action.selector}" to replace with "${action.newElement}"`)
        elementsToReplace.forEach(el => {
          el.outerHTML = action.newElement || '';
        });
        break;

      case 'insert':
        const target = document.querySelector(action.target);
        if (target && action.element) {
          switch (action.position) {

            case 'before':
              target.insertAdjacentHTML('beforebegin', action.element);
              console.log(`New "${action.element}" element is inserted before "${action.target}"`);
              break;

            case 'after':
              target.insertAdjacentHTML('afterend', action.element);
              console.log(`New "${action.element}" element is inserted after "${action.target}"`);
              break;

            case 'prepend':
              target.insertAdjacentHTML('afterbegin', action.element);
              console.log(`New "${action.element}" element is inserted as the first child of "${action.target}"`);
              break;

            case 'append':
            default:
              target.insertAdjacentHTML('beforeend', action.element);
              console.log(`New "${action.element}" element is inserted as the last child of "${action.target}"`);
              break;
          }
        } else { //if missing crutial instructions 
          console.error('Insert failed, missing target or element');
        }
        break;

      case 'alter':
        const scope = document.querySelectorAll(action.selector || '*');
        scope.forEach(el => {
          Array.from(el.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              const oldVal = action.oldValue;
              const newVal = action.newValue;

              if (node.nodeValue.includes(oldVal)) {
                node.nodeValue = node.nodeValue.split(oldVal).join(newVal);
                console.log(`"${oldVal}" in "${action.selector || "the whole file"}" changed to new value: ${newVal}`)
              }
            }
          })
        });
        break;

      default:
        console.warn(`Unsupported action type: ${action.type}`);
    }
  });
}
