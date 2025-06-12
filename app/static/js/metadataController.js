// Handle populating the metadata form for a selected component candidate
function handleMetadataCondidate(event, index) {
  event.preventDefault();
  const viewpoint = window.APP_CONFIG.viewpoint;
  const component = get_component_from_local_storage(viewpoint, index);
  const publication_date = new Date().toISOString().split("T")[0];
  const componentType = component.isNonCodeComponent
    ? "Non-code Component"
    : "Code Component";

  document.getElementById("componentIndex").value = index;
  document.getElementById("componentId").value = crypto.randomUUID();
  document.getElementById("componentName").value = component.name || "";
  document.getElementById("componentDescription").value = component.role || "";
  document.getElementById("componentType").value = componentType || "";
  document.getElementById("componentModularity").value =
    component.modularity || "";
  document.getElementById("componentPubDate").value = publication_date || "";

  if (component.isNonCodeComponent || component.modularity === "monolithic") {
    document.getElementById("codeComponentFields").classList.add("d-none");
  } else {
    document.getElementById("codeComponentFields").classList.remove("d-none");
  }

  document.getElementById("metadataForm").classList.remove("d-none");
}

// Dynamically add an input specification row to the form
function addInputSpec() {
  const list = document.getElementById("inputSpecsList");
  const idx = list.children.length;
  const div = document.createElement("div");
  div.className = "input-group mb-2";
  div.innerHTML = `
            <input type="text" class="form-control" name="input_name_${idx}" placeholder="Name" required>
            <input type="text" class="form-control" name="input_format_${idx}" placeholder="Format" required>
            <input type="text" class="form-control" name="input_desc_${idx}" placeholder="Description" required>
            <button type="button" class="btn btn-outline-danger" onclick="this.parentElement.remove()">&times;</button>
        `;
  list.appendChild(div);
}

// Dynamically add an output specification row to the form
function addOutputSpec() {
  const list = document.getElementById("outputSpecsList");
  const idx = list.children.length;
  const div = document.createElement("div");
  div.className = "input-group mb-2";
  div.innerHTML = `
            <input type="text" class="form-control" name="output_name_${idx}" placeholder="Name" required>
            <input type="text" class="form-control" name="output_format_${idx}" placeholder="Format" required>
            <input type="text" class="form-control" name="output_desc_${idx}" placeholder="Description" required>
            <button type="button" class="btn btn-outline-danger" onclick="this.parentElement.remove()">&times;</button>
        `;
  list.appendChild(div);
}

// Handle form submission for saving metadata, moving the component to the final representation
function handleMetadataSubmit(event) {
  if (!confirm("Are you sure you want to submit the metadata?")) {
    return;
  }

  event.preventDefault();
  const viewpoint = "Final Representation";
  const componentId = document.getElementById("componentId").value;
  const componentName = document.getElementById("componentName").value;
  const componentDescription = document.getElementById(
    "componentDescription"
  ).value;
  const componentType = document.getElementById("componentType").value;
  const componentModularity = document.getElementById(
    "componentModularity"
  ).value;
  const componentPublisher =
    document.getElementById("componentPublisher").value;
  const componentLicense = document.getElementById("componentLicense").value;
  const componentVersion = document.getElementById("componentVersion").value;
  const componentPubDate = document.getElementById("componentPubDate").value;
  const inputSpecs = Array.from(
    document.querySelectorAll("#inputSpecsList > div")
  ).map((div) => ({
    name: div.querySelector('input[name^="input_name_"]').value,
    format: div.querySelector('input[name^="input_format_"]').value,
    description: div.querySelector('input[name^="input_desc_"]').value,
  }));
  const outputSpecs = Array.from(
    document.querySelectorAll("#outputSpecsList > div")
  ).map((div) => ({
    name: div.querySelector('input[name^="output_name_"]').value,
    format: div.querySelector('input[name^="output_format_"]').value,
    description: div.querySelector('input[name^="output_desc_"]').value,
  }));
  const component = {
    id: componentId,
    name: componentName,
    description: componentDescription,
    type: componentType,
    modularity: componentModularity,
    publisher: componentPublisher,
    license: componentLicense,
    version: componentVersion,
    publication_date: componentPubDate,
    inputSpecification: inputSpecs,
    outputSpecification: outputSpecs,
  };

  save_component_to_local_storage(viewpoint, component);

  const index = document.getElementById("componentIndex").value;
  delete_component_from_local_storage(window.APP_CONFIG.viewpoint, index);

  document.getElementById("codeComponentFields").classList.remove("d-none");
  document.getElementById("metadataForm").classList.add("d-none");
  document.getElementById("inputSpecsList").innerHTML = "";
  document.getElementById("outputSpecsList").innerHTML = "";
  document.getElementById("componentPublisher").value = "";
  document.getElementById("componentLicense").value = "";
  document.getElementById("componentVersion").value = "";
  document.getElementById("componentPubDate").value = "";

  loadComponentsFromLocalStorage(viewpoint);
}
