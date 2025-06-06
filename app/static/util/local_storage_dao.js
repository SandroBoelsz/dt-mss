function save_image_to_local_storage(image, viewpoint) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const identifier = viewpoint + "_image";
    localStorage[identifier] = event.target.result;
  };
  reader.readAsDataURL(image);
  console.log(`Image saved for viewpoint: ${viewpoint}`);
}

function get_image_from_local_storage(viewpoint) {
  const identifier = viewpoint + "_image";
  const imageData = localStorage[identifier];
  if (imageData) {
    const base64Parts = base64.split(",");
    const fileFormat = base64Parts[0].split(";")[1];
    const fileContent = base64Parts[1];
    const file = new File([fileContent], identifier, {type: fileFormat});
    return file;
  } else {
    console.warn(`No image found for viewpoint: ${viewpoint}`);
    return null;
  }
}
