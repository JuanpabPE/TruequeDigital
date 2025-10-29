import cloudinary from "../libs/cloudinary.js";
import { Readable } from "stream";

// Función helper para convertir buffer a stream
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

// Subir una imagen a Cloudinary
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ninguna imagen" });
    }

    // Subir a Cloudinary usando stream
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "trueque-digital",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      bufferToStream(req.file.buffer).pipe(uploadStream);
    });

    const result = await uploadPromise;

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error al subir la imagen", error: error.message });
  }
};

// Subir múltiples imágenes
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No se recibieron imágenes" });
    }

    // Límite de 5 imágenes
    if (req.files.length > 5) {
      return res.status(400).json({ message: "Máximo 5 imágenes permitidas" });
    }

    // Subir todas las imágenes en paralelo
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "trueque-digital",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        bufferToStream(file.buffer).pipe(uploadStream);
      });
    });

    const results = await Promise.all(uploadPromises);

    const images = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    res.json({ images });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Error al subir las imágenes", error: error.message });
  }
};

// Eliminar una imagen de Cloudinary
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: "publicId es requerido" });
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({ message: "Imagen eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Error al eliminar la imagen", error: error.message });
  }
};
