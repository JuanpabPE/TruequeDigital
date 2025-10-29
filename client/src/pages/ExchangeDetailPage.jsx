import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useExchanges } from "../context/ExchangesContext";
import { useMatches } from "../context/MatchContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function ExchangeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getExchangeById, currentExchange, loading } = useExchanges();
  const { requestMatch } = useMatches();
  const { user } = useAuth();

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [myExchanges, setMyExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [requesting, setRequesting] = useState(false);

  const getConditionLabel = (condition) => {
    const labels = {
      new: "Nuevo",
      "like-new": "Como nuevo",
      good: "Buen estado",
      fair: "Estado regular",
      poor: "Necesita reparación",
    };
    return labels[condition] || condition;
  };

  const getStatusLabel = (status) => {
    const labels = {
      disponible: "Disponible",
      "en-progreso": "En progreso",
      intercambiado: "Intercambiado",
      pausado: "Pausado",
      cancelado: "Cancelado",
      // Compatibilidad con estados antiguos en inglés
      available: "Disponible",
      "in-progress": "En progreso",
      completed: "Intercambiado",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  const isAvailable = (status) => {
    return status === "disponible" || status === "available";
  };

  useEffect(() => {
    if (id) {
      getExchangeById(id);
    }
  }, [id]);

  // Cargar exchanges del usuario para ofrecer
  useEffect(() => {
    const fetchMyExchanges = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/exchanges/my-exchanges`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        // Solo mostrar exchanges disponibles (español e inglés por compatibilidad)
        setMyExchanges(
          data.filter(
            (ex) =>
              (ex.status === "disponible" || ex.status === "available") &&
              ex._id !== id
          )
        );
      } catch (error) {
        console.error("Error al cargar mis exchanges:", error);
      }
    };

    if (showMatchModal) {
      fetchMyExchanges();
    }
  }, [showMatchModal, id]);

  const handleRequestMatch = async (e) => {
    e.preventDefault();

    if (!selectedExchange) {
      alert("Por favor selecciona qué exchange quieres ofrecer");
      return;
    }

    try {
      setRequesting(true);
      await requestMatch({
        exchangeOfferedId: selectedExchange,
        exchangeRequestedId: id,
        initialMessage,
      });

      alert(
        "¡Solicitud de intercambio enviada! Espera la respuesta del propietario."
      );
      setShowMatchModal(false);
      setSelectedExchange("");
      setInitialMessage("");
    } catch (error) {
      console.error("Error al solicitar match:", error);
      alert(
        error.response?.data?.message ||
          "Error al solicitar intercambio. Verifica que no tengas una solicitud pendiente."
      );
    } finally {
      setRequesting(false);
    }
  };

  const nextImage = () => {
    if (currentExchange?.images?.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % currentExchange.images.length
      );
    }
  };

  const prevImage = () => {
    if (currentExchange?.images?.length > 0) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + currentExchange.images.length) %
          currentExchange.images.length
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-purple-600 text-xl">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!currentExchange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Exchange no encontrado
          </h2>
          <Link
            to="/exchanges"
            className="text-purple-600 hover:text-purple-700"
          >
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentExchange.user?._id === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/exchanges"
            className="text-purple-600 hover:text-purple-700 inline-flex items-center mb-4"
          >
            ← Volver a trueques
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {currentExchange.images && currentExchange.images.length > 0 ? (
              <div className="relative bg-gray-100">
                <img
                  src={currentExchange.images[currentImageIndex]}
                  alt={currentExchange.title}
                  className="w-full h-96 object-contain"
                />

                {currentExchange.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    >
                      →
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {currentExchange.images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-96 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <p className="text-gray-500">Sin imágenes</p>
              </div>
            )}

            {/* Miniaturas */}
            {currentExchange.images && currentExchange.images.length > 1 && (
              <div className="p-4 grid grid-cols-5 gap-2">
                {currentExchange.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === idx
                        ? "border-purple-600"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${currentExchange.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del exchange */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {currentExchange.title}
                </h1>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isAvailable(currentExchange.status)
                      ? "bg-green-100 text-green-700"
                      : currentExchange.status === "intercambiado" ||
                        currentExchange.status === "completed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {getStatusLabel(currentExchange.status)}
                </span>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{currentExchange.description}</p>
              </div>

              {/* Propietario */}
              <div className="border-t pt-4 mb-6">
                <p className="text-sm text-gray-500 mb-2">Publicado por</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {currentExchange.user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {currentExchange.user?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {currentExchange.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Oferta */}
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-purple-900 mb-3">
                  ¿Qué ofrece?
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-purple-600">Categoría</p>
                    <p className="font-medium text-purple-900">
                      {currentExchange.offering?.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600">Condición</p>
                    <p className="font-medium text-purple-900">
                      {getConditionLabel(currentExchange.offering?.condition)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-purple-600">Valor estimado</p>
                    <p className="font-medium text-purple-900">
                      S/ {currentExchange.offering?.estimatedValue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Búsqueda */}
              <div className="bg-pink-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-pink-900 mb-3">
                  ¿Qué busca?
                </h3>
                <div className="mb-2">
                  <p className="text-sm text-pink-600">Categoría</p>
                  <p className="font-medium text-pink-900">
                    {currentExchange.seeking?.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-pink-600">Descripción</p>
                  <p className="text-pink-900">
                    {currentExchange.seeking?.description}
                  </p>
                </div>
              </div>

              {/* Ubicación */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                <p className="font-medium text-gray-800">
                  {currentExchange.location}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentExchange.isVirtual
                    ? "✓ Intercambio virtual disponible"
                    : "Solo presencial"}
                </p>
              </div>
            </div>

            {/* Botón de acción */}
            {!isOwner && isAvailable(currentExchange.status) && (
              <button
                onClick={() => setShowMatchModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                🤝 Solicitar Intercambio
              </button>
            )}

            {!isOwner && !isAvailable(currentExchange.status) && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-gray-800 font-medium">
                  Este trueque no está disponible
                </p>
                <p className="text-sm text-gray-600">
                  Estado actual: {getStatusLabel(currentExchange.status)}
                </p>
              </div>
            )}

            {isOwner && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-emerald-800 font-medium mb-2 text-center">
                  📝 Esta es tu publicación
                </p>
                <div className="flex gap-2">
                  <Link
                    to="/my-exchanges"
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition text-center"
                  >
                    Ver todos mis trueques
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de solicitud de match */}
        {showMatchModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Solicitar Intercambio
              </h2>

              <form onSubmit={handleRequestMatch}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué exchange quieres ofrecer?
                  </label>

                  {myExchanges.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 mb-2">
                        No tienes exchanges disponibles para ofrecer
                      </p>
                      <Link
                        to="/create-exchange"
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Crear un exchange →
                      </Link>
                    </div>
                  ) : (
                    <select
                      value={selectedExchange}
                      onChange={(e) => setSelectedExchange(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecciona un exchange...</option>
                      {myExchanges.map((exchange) => (
                        <option key={exchange._id} value={exchange._id}>
                          {exchange.title} - {exchange.offering?.category}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje inicial (opcional)
                  </label>
                  <textarea
                    value={initialMessage}
                    onChange={(e) => setInitialMessage(e.target.value)}
                    placeholder="Cuéntale por qué te interesa este intercambio..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows="4"
                    maxLength="500"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {initialMessage.length}/500 caracteres
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMatchModal(false);
                      setSelectedExchange("");
                      setInitialMessage("");
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    disabled={requesting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium disabled:opacity-50"
                    disabled={requesting || myExchanges.length === 0}
                  >
                    {requesting ? "Enviando..." : "Enviar Solicitud"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExchangeDetailPage;
