function save_image_to_local_storage(image, viewpoint) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const identifier = viewpoint + "_image";
    localStorage[identifier] = event.target.result;
  };
  reader.readAsDataURL(image);
  console.log(`Image saved for viewpoint: ${viewpoint}`);
}

function get_image_from_local_storage(image) {
  const imageData = localStorage[image];

  if (imageData) {
    return imageData;
  } else {
    console.warn(`No image found for key: ${image}`);
    return null;
  }
}
