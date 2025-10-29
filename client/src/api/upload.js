import axios from "./axios.js";

// Subir una imagen
export const uploadImageRequest = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return axios.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Subir múltiples imágenes
export const uploadImagesRequest = (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  return axios.post("/upload/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Eliminar una imagen
export const deleteImageRequest = (publicId) =>
  axios.delete("/upload/image", { data: { publicId } });
