// Handle the creation of a new component from the form
function handleComponentCreation(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const role = form.role.value;
  const interfaces = form.interfaces.value;
  const dependencies = form.dependencies.value;

  // Validate all fields
  if (!name || !role || !interfaces || !dependencies) {
    alert("Please fill in all fields before adding a component.");
    return false;
  }

  const viewpoint = window.APP_CONFIG.viewpoint;

  let isNonCodeComponent = false;
  if (form.isNonCodeComponent) {
    isNonCodeComponent = form.isNonCodeComponent.value === "true";
  }
  if (viewpoint === "Information") isNonCodeComponent = true;

  const component = {
    name: name,
    role: role,
    interfaces: interfaces,
    dependencies: dependencies,
    isNonCodeComponent: isNonCodeComponent,
  };
  save_component_to_local_storage(viewpoint, component);
  form.reset();
  loadComponentsFromLocalStorage();
}

// Merge components from all earlier viewpoints and save them under the current viewpoint
function mergeAndSaveComponents(viewpoint) {
  let components = [];
  components = components.concat(
    get_components_from_local_storage("Science") || []
  );
  components = components.concat(
    get_components_from_local_storage("Information") || []
  );
  components = components.concat(
    get_components_from_local_storage("Computational") || []
  );
  components = components.concat(
    get_components_from_local_storage("Engineering") || []
  );

  save_multiple_components_to_local_storage(viewpoint, components);
  return components;
}

// Load all components for the current viewpoint and render them in the table
function loadComponentsFromLocalStorage() {
  const viewpoint = window.APP_CONFIG.viewpoint;

  let components = [];

  if (
    viewpoint === "Technology" &&
    get_components_from_local_storage(viewpoint) === null
  ) {
    components = mergeAndSaveComponents(viewpoint);
  } else if (
    viewpoint == "Correspondence" &&
    get_components_from_local_storage(viewpoint) === null
  ) {
    components = get_components_from_local_storage("Technology") || [];
    save_multiple_components_to_local_storage(viewpoint, components);
  } else {
    components = get_components_from_local_storage(viewpoint) || [];
  }

  const tableBody = document.getElementById("componentTable");
  if (!tableBody) return;
  tableBody.innerHTML = "";
  components.forEach((component, index) => {
    const row = document.createElement("tr");
    let rowHtml = `
                <td>${component.name}</td>
                <td>${component.role}</td>
                <td>${component.interfaces}</td>
                <td>${component.dependencies}</td>
    `;
    if (window.APP_CONFIG.viewpoint === "Correspondence") {
      console.log("Creation:", component.isNonCodeComponent);

      rowHtml += `
        <td class="text-center">
          <button type="button" class="btn ${
            component.isNonCodeComponent ? "btn-outline-primary" : "btn-primary"
          }" title="codeComponent" onclick="selectCodeComponent(event, ${index})">
            <i class="bi bi-code"></i>
          </button>
          <button type="button" class="btn ${
            component.isNonCodeComponent ? "btn-primary" : "btn-outline-primary"
          }" title="nonCodeComponent" onclick="selectNonCodeComponent(event, ${index})">
            <i class="bi bi-file-earmark-bar-graph"></i>
          </button>
        </td>`;
    }
    rowHtml += `
                <td class="text-center">
                    <button type="button" class="btn btn-success" title="Edit" onclick="handleComponentEditing(event, ${index})">
                        <i class="bi bi-pen"></i>
                    </button>
                    <button type="button" class="btn btn-danger" title="Delete" onclick="handleComponentDeletion(event, ${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>`;
    row.innerHTML = rowHtml;
    tableBody.appendChild(row);
  });
}

// Handle deletion of a component by index
function handleComponentDeletion(event, index) {
  event.preventDefault();
  const viewpoint = window.APP_CONFIG.viewpoint;
  delete_component_from_local_storage(viewpoint, index);
  loadComponentsFromLocalStorage();
}

function setComponentType(isNonCode) {
  document.getElementById("isNonCodeComponent").value = isNonCode
    ? "true"
    : "false";
  document.getElementById("codeComponentBtn").className = isNonCode
    ? "btn btn-outline-primary"
    : "btn btn-primary";
  document.getElementById("nonCodeComponentBtn").className = isNonCode
    ? "btn btn-primary"
    : "btn btn-outline-primary";
}

// Handle editing of a component: populate form with values and remove the old entry
function handleComponentEditing(event, index) {
  event.preventDefault();
  const viewpoint = window.APP_CONFIG.viewpoint;
  const components = get_components_from_local_storage(viewpoint) || [];
  if (index < 0 || index >= components.length) {
    alert("Invalid component index for editing.");
    return;
  }

  const component = components[index];
  const form = document.querySelector("form");

  form.name.value = component.name;
  form.role.value = component.role;
  form.interfaces.value = component.interfaces;
  form.dependencies.value = component.dependencies;

  if (viewpoint === "Correspondence") {
    setComponentType(component.isNonCodeComponent);
  }

  delete_component_from_local_storage(viewpoint, index);
  loadComponentsFromLocalStorage();
}
