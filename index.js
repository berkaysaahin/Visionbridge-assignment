function handleYamlUpload() {
  const input = document.getElementById('yamlInput');
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

    } catch (error) {
      alert("YAML Error: " + error.message);
      console.log(error);
    }
  };

   reader.readAsText(file); //once the file is loaded then onload function is executed
  });
 
}
