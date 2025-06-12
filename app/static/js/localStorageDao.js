// Save an image file to localStorage for a given viewpoint
function save_image_to_local_storage(image, viewpoint) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const identifier = viewpoint + "_image";
    localStorage[identifier] = event.target.result;
  };
  reader.readAsDataURL(image);
  console.log(`Image saved for viewpoint: ${viewpoint}`);
}

// Retrieve an image from localStorage by its key
function get_image_from_local_storage(image) {
  const imageData = localStorage[image];

  if (imageData) {
    return imageData;
  } else {
    console.warn(`No image found for key: ${image}`);
    return null;
  }
}

// Retrieve the components array for a viewpoint from localStorage
function get_components_from_local_storage(viewpoint) {
  const identifier = viewpoint + "_components";
  const componentData = localStorage[identifier];

  if (componentData) {
    return JSON.parse(componentData);
  } else {
    console.warn(`No component found for viewpoint: ${viewpoint}`);
    return null;
  }
}

function get_component_from_local_storage(viewpoint, index) {
  const components = get_components_from_local_storage(viewpoint);
  if (components && index >= 0 && index < components.length) {
    return components[index];
  } else {
    console.warn(
      `No component found at index ${index} for viewpoint: ${viewpoint}`
    );
    return null;
  }
}

// Save a new component to the components array in localStorage for a viewpoint
function save_component_to_local_storage(viewpoint, component) {
  let current = get_components_from_local_storage(viewpoint);
  if (!current) {
    current = [];
  }
  current.push(component);

  const identifier = viewpoint + "_components";
  localStorage[identifier] = JSON.stringify(current);
  console.log(`Component saved for viewpoint: ${viewpoint}`);
}

// Save multiple components to the components array in localStorage for a viewpoint
function save_multiple_components_to_local_storage(viewpoint, components) {
  let current = get_components_from_local_storage(viewpoint);
  if (!current) {
    current = [];
  }
  current = current.concat(components);

  const identifier = viewpoint + "_components";
  localStorage[identifier] = JSON.stringify(current);
  console.log(`Multiple components saved for viewpoint: ${viewpoint}`);
}

// Save component at a specific index in the components array in localStorage for a viewpoint
function save_component_at_index_to_local_storage(viewpoint, component, index) {
  let current = get_components_from_local_storage(viewpoint);
  if (!current) {
    current = [];
  }
  if (index < 0 || index >= current.length) {
    console.warn(`Index ${index} is out of bounds for viewpoint: ${viewpoint}`);
    return;
  }
  current[index] = component;

  const identifier = viewpoint + "_components";
  localStorage[identifier] = JSON.stringify(current);
  console.log(`Component at index ${index} saved for viewpoint: ${viewpoint}`);
}

// Delete an image from localStorage by its key
function delete_image_from_local_storage(viewpoint) {
  const identifier = viewpoint + "_image";
  if (localStorage[identifier]) {
    delete localStorage[identifier];
    console.log(`Image deleted for viewpoint: ${viewpoint}`);
  } else {
    console.warn(`No image found for viewpoint: ${viewpoint}`);
  }
}

// Delete a component by index from the components array in localStorage for a viewpoint
function delete_component_from_local_storage(viewpoint, index) {
  const current = get_components_from_local_storage(viewpoint);
  if (current && index >= 0 && index < current.length) {
    current.splice(index, 1);
    const identifier = viewpoint + "_components";
    localStorage[identifier] = JSON.stringify(current);
    console.log(
      `Component at index ${index} deleted for viewpoint: ${viewpoint}`
    );
  } else {
    console.warn(
      `No component found at index ${index} for viewpoint: ${viewpoint}`
    );
  }
}

// Clear all components for a viewpoint in localStorage
function restartMethodology() {
  localStorage.clear();
}
