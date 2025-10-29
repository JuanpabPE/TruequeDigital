import { Router } from "express";
import { uploadImage, uploadImages, deleteImage } from "../controllers/upload.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// Subir una imagen
router.post("/upload/image", authRequired, upload.single("image"), uploadImage);

// Subir múltiples imágenes (máximo 5)
router.post("/upload/images", authRequired, upload.array("images", 5), uploadImages);

// Eliminar una imagen
router.delete("/upload/image", authRequired, deleteImage);

export default router;
