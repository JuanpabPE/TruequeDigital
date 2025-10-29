import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useExchanges } from "../context/ExchangesContext";
import { useMembership } from "../context/MembershipContext";
import { uploadImagesRequest } from "../api/upload";
import Navbar from "../components/Navbar";

const CATEGORIES = [
  "Electrónica",
  "Libros",
  "Ropa",
  "Deportes",
  "Música",
  "Arte",
  "Hogar",
  "Videojuegos",
  "Accesorios",
  "Servicios",
  "Otro",
];

const CONDITIONS = [
  { value: "new", label: "Nuevo" },
  { value: "like-new", label: "Como nuevo" },
  { value: "good", label: "Buen estado" },
  { value: "fair", label: "Estado regular" },
  { value: "poor", label: "Necesita reparación" },
];

function CreateExchangePage() {
  const navigate = useNavigate();
  const { createExchange, loading, error, setError } = useExchanges();
  const { activeMembership, getActiveMembership } = useMembership();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const isVirtual = watch("isVirtual");

  useEffect(() => {
    const checkMembership = async () => {
      const membership = await getActiveMembership();
      if (!membership) {
        navigate("/plans");
      }
    };
    checkMembership();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      setSubmitError("Máximo 5 imágenes permitidas");
      return;
    }

    // Crear previsualizaciones
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setSelectedFiles([...selectedFiles, ...files]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setSubmitError(null);
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Liberar memoria del preview eliminado
    URL.revokeObjectURL(imagePreviews[index]);

    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data) => {
    try {
      setError(null);
      setSubmitError(null);

      let imageUrls = [];

      // Subir imágenes si hay archivos seleccionados
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        try {
          const uploadRes = await uploadImagesRequest(selectedFiles);
          imageUrls = uploadRes.data.images.map((img) => img.url);
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          setSubmitError("Error al subir las imágenes. Intenta de nuevo.");
          setUploadingImages(false);
          return;
        }
        setUploadingImages(false);
      }

      const exchangeData = {
        title: data.title,
        description: data.description,
        offeringCategory: data.offeringCategory,
        offeringCondition: data.offeringCondition,
        offeringEstimatedValue: Number(data.offeringEstimatedValue),
        seekingCategory: data.seekingCategory,
        seekingDescription: data.seekingDescription,
        location: data.isVirtual ? "Virtual" : data.location,
        isVirtual: data.isVirtual,
        images: imageUrls,
      };

      await createExchange(exchangeData);

      // Limpiar previews
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

      navigate("/my-exchanges");
    } catch (err) {
      console.error("Error creating exchange:", err);
      if (err.response?.data?.requiresMembership) {
        navigate("/plans");
      } else {
        setSubmitError(
          err.response?.data?.message || "Error al crear el trueque"
        );
      }
    }
  };

  if (!activeMembership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Publicar Trueque
            </h1>
            <p className="text-gray-600">
              Completa la información de lo que ofreces y lo que buscas
            </p>
          </div>

          {/* Error Alert */}
          {(error || submitError) && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error || submitError}</p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
          >
            {/* Información General */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                Información General
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del trueque *
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "El título es obligatorio",
                    minLength: { value: 5, message: "Mínimo 5 caracteres" },
                    maxLength: { value: 100, message: "Máximo 100 caracteres" },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                  placeholder="Ej: Laptop HP por Bicicleta de montaña"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  {...register("description", {
                    required: "La descripción es obligatoria",
                    minLength: { value: 20, message: "Mínimo 20 caracteres" },
                  })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                  placeholder="Describe con detalle tu trueque..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Lo que Ofreces */}
            <div className="space-y-6 bg-emerald-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-emerald-200 pb-2">
                🎁 Lo que Ofreces
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    {...register("offeringCategory", {
                      required: "Selecciona una categoría",
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                  >
                    <option value="">Selecciona...</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.offeringCategory && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.offeringCategory.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condición *
                  </label>
                  <select
                    {...register("offeringCondition", {
                      required: "Selecciona la condición",
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                  >
                    <option value="">Selecciona...</option>
                    {CONDITIONS.map((cond) => (
                      <option key={cond.value} value={cond.value}>
                        {cond.label}
                      </option>
                    ))}
                  </select>
                  {errors.offeringCondition && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.offeringCondition.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor estimado (S/) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("offeringEstimatedValue", {
                    required: "El valor es obligatorio",
                    min: { value: 1, message: "Mínimo S/ 1" },
                    max: { value: 10000, message: "Máximo S/ 10,000" },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                  placeholder="100"
                />
                {errors.offeringEstimatedValue && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.offeringEstimatedValue.message}
                  </p>
                )}
              </div>
            </div>

            {/* Lo que Buscas */}
            <div className="space-y-6 bg-blue-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-blue-200 pb-2">
                🔍 Lo que Buscas
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  {...register("seekingCategory", {
                    required: "Selecciona una categoría",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
                >
                  <option value="">Selecciona...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.seekingCategory && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.seekingCategory.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción de lo que buscas *
                </label>
                <textarea
                  {...register("seekingDescription", {
                    required: "Describe qué buscas",
                    minLength: { value: 10, message: "Mínimo 10 caracteres" },
                  })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
                  placeholder="Ej: Busco una bicicleta de montaña en buen estado..."
                />
                {errors.seekingDescription && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.seekingDescription.message}
                  </p>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                📍 Ubicación
              </h2>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("isVirtual")}
                  className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Este es un trueque virtual (sin ubicación física)
                </label>
              </div>

              {!isVirtual && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    {...register("location", {
                      required: !isVirtual
                        ? "La ubicación es obligatoria"
                        : false,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                    placeholder="Ej: Universidad Privada del Norte - Sede Trujillo"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Imágenes */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                📸 Imágenes (opcional)
              </h2>
              <p className="text-sm text-gray-600">
                Agrega hasta 5 imágenes de tu producto (máximo 5MB cada una)
              </p>

              {/* Preview de imágenes seleccionadas */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input de archivos */}
              {selectedFiles.length < 5 && (
                <div>
                  <label className="block w-full py-8 border-2 border-dashed border-emerald-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition cursor-pointer text-center">
                    <div className="text-emerald-600 text-4xl mb-2">📷</div>
                    <div className="text-emerald-600 font-medium">
                      Click para seleccionar imágenes
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      {selectedFiles.length > 0
                        ? `${selectedFiles.length} de 5 imágenes seleccionadas`
                        : "JPG, PNG, GIF o WEBP (máx. 5MB cada una)"}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImages
                  ? "Subiendo imágenes..."
                  : loading
                  ? "Publicando..."
                  : "Publicar Trueque"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateExchangePage;
