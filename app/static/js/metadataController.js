function handleMetadataCondidate(event, index) {
  event.preventDefault();
  const viewpoint = window.APP_CONFIG.viewpoint;
  const component = get_component_from_local_storage(viewpoint, index);
  const publication_date = new Date().toISOString().split("T")[0];
  const componentType = component.isNonCodeComponent
    ? "Non-code Component"
    : "Code Component";

  document.getElementById("componentId").value = crypto.randomUUID();
  document.getElementById("componentName").value = component.name || "";
  document.getElementById("componentDescription").value = component.role || "";
  document.getElementById("componentType").value = componentType || "";
  document.getElementById("componentModularity").value =
    component.modularity || "";
  document.getElementById("componentPubDate").value = publication_date || "";

  if (component.isNonCodeComponent || component.modularity === "monolithic") {
    document.getElementById("codeComponentFields").classList.add("d-none");
  }

  document.getElementById("metadataForm").classList.remove("d-none");
}

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

function handleMetadataSubmit(event) {
  document.getElementById("codeComponentFields").classList.remove("d-none");
  document.getElementById("metadataForm").classList.add("d-none");
}
