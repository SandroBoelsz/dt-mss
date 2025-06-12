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

  const viewpoint = getViewpointFromConfig();

  let isNonCodeComponent = false;
  if (form.isNonCodeComponent) {
    isNonCodeComponent = form.isNonCodeComponent.value === "true";
  }

  let modularity = null;
  if (form.modularity) {
    modularity = form.modularity.value;
  }

  if (viewpoint === "Information" || viewpoint === "Non-code")
    isNonCodeComponent = true;
  if (viewpoint === "Monolithic Container") modularity = "monolithic";
  if (viewpoint === "Fine-grained Components") modularity = "fine";
  if (viewpoint === "Coarse-grained Components") modularity = "coarse";

  const component = {
    name: name,
    role: role,
    interfaces: interfaces,
    dependencies: dependencies,
    isNonCodeComponent: isNonCodeComponent,
    modularity: modularity,
  };
  save_component_to_local_storage(viewpoint, component);
  form.reset();
  loadComponentsFromLocalStorage();
}

// Merge components from all earlier viewpoints and save them under the current viewpoint
function mergeAndSaveComponents(viewpoint) {
  let components = [];
  function appendViewpointToName(component, vp) {
    if (!component.name.endsWith(` (${vp})`)) {
      component.name = `${component.name} (${vp})`;
    }
    return component;
  }

  // Merge and tag each component with its viewpoint
  (get_components_from_local_storage("Science") || []).forEach((c) =>
    components.push(appendViewpointToName({ ...c }, "Science"))
  );
  (get_components_from_local_storage("Information") || []).forEach((c) =>
    components.push(appendViewpointToName({ ...c }, "Information"))
  );
  (get_components_from_local_storage("Computational") || []).forEach((c) =>
    components.push(appendViewpointToName({ ...c }, "Computational"))
  );
  (get_components_from_local_storage("Engineering") || []).forEach((c) =>
    components.push(appendViewpointToName({ ...c }, "Engineering"))
  );

  save_multiple_components_to_local_storage(viewpoint, components);
  return components;
}

// Load all components for the current viewpoint and render them in the table
function loadComponentsFromLocalStorage() {
  const viewpoint = getViewpointFromConfig();

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
  } else if (
    viewpoint == "Code" &&
    get_components_from_local_storage(viewpoint) === null
  ) {
    components = get_components_from_local_storage("Correspondence") || [];
    components = components.filter((c) => c.isNonCodeComponent === false);
    save_multiple_components_to_local_storage(viewpoint, components);
  } else if (
    viewpoint == "Non-code" &&
    get_components_from_local_storage(viewpoint) === null
  ) {
    components = get_components_from_local_storage("Correspondence") || [];
    components = components.filter((c) => c.isNonCodeComponent === true);
    save_multiple_components_to_local_storage(viewpoint, components);
  } else if (
    viewpoint == "Monolithic Container" &&
    get_components_from_local_storage(viewpoint) === null
  ) {
    components = get_components_from_local_storage("Code") || [];
    components = components.filter((c) => c.modularity === "monolithic");
    save_multiple_components_to_local_storage(viewpoint, components);
  } else if (
    viewpoint == "Fine-grained Components" &&
    get_components_from_local_storage(viewpoint) === null
  ) {
    components = get_components_from_local_storage("Code") || [];
    components = components.filter((c) => c.modularity === "fine");
    save_multiple_components_to_local_storage(viewpoint, components);
  } else if (
    viewpoint == "Coarse-grained Components" &&
    get_components_from_local_storage(viewpoint) === null
  ) {
    components = get_components_from_local_storage("Code") || [];
    components = components.filter((c) => c.modularity === "coarse");
    fineGrainedComponents =
      get_components_from_local_storage("Fine-grained Components") || [];
    components = components.concat(fineGrainedComponents);
    components = components.map((c) => {
      c.modularity = "coarse";
      return c;
    });
    save_multiple_components_to_local_storage(viewpoint, components);
  } else if (
    viewpoint == "Enrichment" &&
    get_components_from_local_storage(viewpoint) === null
  ) {
    monolithicComponents =
      get_components_from_local_storage("Monolithic Container") || [];
    coarseGrained =
      get_components_from_local_storage("Coarse-grained Components") || [];
    nonCodeComponents =
      get_components_from_local_storage("Non-code") || [];
    components = monolithicComponents.concat(coarseGrained);
    components = components.concat(nonCodeComponents);
    save_multiple_components_to_local_storage(viewpoint, components);
  } else {
    components = getComponentsForViewpoint(viewpoint);
  }

  const tableBody = document.getElementById("componentTable");
  if (!tableBody) return;
  tableBody.innerHTML = "";
  components.forEach((component, index) => {
    const row = document.createElement("tr");
    row.innerHTML = renderComponentRow(component, index, viewpoint);
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

function setEditComponentType(isNonCode) {
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

function setEditModularity(modularity) {
  document.getElementById("monolithicBtn").className =
    modularity === "monolithic" || modularity === "base"
      ? "btn btn-primary"
      : "btn btn-outline-primary";
  document.getElementById("coarseBtn").className =
    modularity === "coarse" || modularity === "external"
      ? "btn btn-primary"
      : "btn btn-outline-primary";
  document.getElementById("fineBtn").className =
    modularity === "fine" || modularity === "auxiliary"
      ? "btn btn-primary"
      : "btn btn-outline-primary";
  document.getElementById("modularityInput").value = modularity;
}

// Get the current viewpoint from the global configuration
function getViewpointFromConfig() {
  return window.APP_CONFIG.viewpoint;
}

// Get components from localStorage for a specific viewpoint
function getComponentsForViewpoint(viewpoint) {
  return get_components_from_local_storage(viewpoint) || [];
}

// Set the type of a component (code or non-code)
function setComponentType(component, isNonCode) {
  component.isNonCodeComponent = isNonCode;
  return component;
}

// Set the modularity of a component
function setComponentModularity(component, modularity) {
  component.modularity = modularity;
  return component;
}

// Update a component in localStorage at a specific index
function updateComponentInStorage(viewpoint, component, index) {
  save_component_at_index_to_local_storage(viewpoint, component, index);
}

// Map modularity values to readable names for display
function map_modularity_to_readable_name(modularity) {
  const modularityMap = {
    monolithic: "Monolithic Container",
    coarse: "Coarse-grained Component",
    fine: "Fine-grained Component",
    base: "Include in container or base image",
    external: "External data sources accessable by VRE components",
    auxiliary: "VRE resource or auxiliary asset",
  };
  return modularityMap[modularity] || modularity;
}

// Render a single component row in the table based on the viewpoint
function renderComponentRow(component, index, viewpoint) {
  let rowHtml = `
                <td>${component.name}</td>
                <td>${component.role}</td>
                <td>${component.interfaces}</td>
                <td>${component.dependencies}</td>
    `;
  if (viewpoint === "Correspondence") {
    rowHtml += `
      <td class="text-center">
        <button type="button" class="btn ${
          component.isNonCodeComponent ? "btn-outline-primary" : "btn-primary"
        }" title="codeComponent" onclick="selectTableCodeComponentType(event, ${index}, false)">
          <i class="bi bi-code"></i>
        </button>
        <button type="button" class="btn ${
          component.isNonCodeComponent ? "btn-primary" : "btn-outline-primary"
        }" title="nonCodeComponent" onclick="selectTableCodeComponentType(event, ${index}, true)">
          <i class="bi bi-file-earmark-bar-graph"></i>
        </button>
      </td>`;
  }
  if (viewpoint === "Code") {
    rowHtml += `
      <td class="text-center">
        <button type="button" class="btn ${
          component.modularity === "monolithic"
            ? "btn-primary"
            : "btn-outline-primary"
        }" title="monolithic" onclick="selectComponentModularity(event, ${index}, 'monolithic')">
          <i class="bi bi-boxes"></i>
        </button>
        <button type="button" class="btn ${
          component.modularity === "coarse"
            ? "btn-primary"
            : "btn-outline-primary"
        }" title="coarse" onclick="selectComponentModularity(event, ${index}, 'coarse')">
          <i class="bi bi-diagram-2-fill"></i>
        </button>
        <button type="button" class="btn ${
          component.modularity === "fine"
            ? "btn-primary"
            : "btn-outline-primary"
        }" title="fine" onclick="selectComponentModularity(event, ${index}, 'fine')">
          <i class="bi bi-diagram-3-fill"></i>
        </button>
      </td>`;
  }
  if (viewpoint === "Non-code") {
    rowHtml += `
      <td class="text-center">
        <button type="button" class="btn ${
          component.modularity === "base"
            ? "btn-primary"
            : "btn-outline-primary"
        }" title="base" onclick="selectComponentModularity(event, ${index}, 'base')">
          <i class="bi bi-archive-fill"></i>
        </button>
        <button type="button" class="btn ${
          component.modularity === "external"
            ? "btn-primary"
            : "btn-outline-primary"
        }" title="external" onclick="selectComponentModularity(event, ${index}, 'external')">
          <i class="bi bi-cloudy-fill"></i>
        </button>
        <button type="button" class="btn ${
          component.modularity === "auxiliary"
            ? "btn-primary"
            : "btn-outline-primary"
        }" title="auxiliary" onclick="selectComponentModularity(event, ${index}, 'auxiliary')">
          <i class="bi bi-folder-fill"></i>
        </button>
      </td>`;
  }
  if (viewpoint === "Enrichment") {
    rowHtml += `<td>${map_modularity_to_readable_name(
      component.modularity
    )}</td>
    <td>${component.isNonCodeComponent ? "Non-code" : "Code"}</td>`;
  }

  if (viewpoint !== "Enrichment") {
    rowHtml += `
      <td class="text-center">
          <button type="button" class="btn btn-success" title="Edit" onclick="handleComponentEditing(event, ${index})">
              <i class="bi bi-pen"></i>
          </button>
          <button type="button" class="btn btn-danger" title="Delete" onclick="handleComponentDeletion(event, ${index})">
              <i class="bi bi-trash"></i>
          </button>
      </td>`;
  } else {
    rowHtml += `
      <td class="text-center">
          <button type="button" class="btn btn-primary" title="Metadata" onclick="handleMetadataCondidate(event, ${index})">
              <i class="bi bi-card-text"></i>
          </button>
      </td>`;
  }
  return rowHtml;
}

// selectTableCodeComponentType and selectComponentModularity functions remain unchanged

function selectTableCodeComponentType(event, index, isNonCode) {
  event.preventDefault();
  const viewpoint = getViewpointFromConfig();
  let component = get_component_from_local_storage(viewpoint, index);
  component = setComponentType(component, isNonCode);
  updateComponentInStorage(viewpoint, component, index);
  loadComponentsFromLocalStorage();
}

function selectComponentModularity(event, index, modularity) {
  event.preventDefault();
  const viewpoint = getViewpointFromConfig();
  let component = get_component_from_local_storage(viewpoint, index);
  component = setComponentModularity(component, modularity);
  updateComponentInStorage(viewpoint, component, index);
  loadComponentsFromLocalStorage();
}

// Handle editing of a component: populate form with values and remove the old entry
function handleComponentEditing(event, index) {
  event.preventDefault();
  const viewpoint = window.APP_CONFIG.viewpoint;
  const components = get_components_from_local_storage(viewpoint) || [];
  if (index < 0 || index >= components.length) {
    return;
  }

  const component = components[index];
  const form = document.querySelector("form");

  form.name.value = component.name;
  form.role.value = component.role;
  form.interfaces.value = component.interfaces;
  form.dependencies.value = component.dependencies;

  if (viewpoint === "Correspondence") {
    setEditComponentType(component.isNonCodeComponent);
  }
  if (viewpoint === "Code" || viewpoint === "Non-code") {
    setEditModularity(component.modularity);
  }

  delete_component_from_local_storage(viewpoint, index);
  loadComponentsFromLocalStorage();
}

// Check if all components in the current viewpoint have modularity defined
function all_components_have_modularity() {
  const viewpoint = window.APP_CONFIG.viewpoint;
  const components = get_components_from_local_storage(viewpoint) || [];
  return components.every((c) => c.modularity);
}

// Check if all components have been enriched with metadata
function all_components_have_metadata() {
  const viewpoint = window.APP_CONFIG.viewpoint;
  const components = get_components_from_local_storage(viewpoint) || [];
  return components.length <= 0
}
