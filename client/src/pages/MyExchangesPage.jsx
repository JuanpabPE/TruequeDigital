import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useExchanges } from "../context/ExchangesContext";

function MyExchangesPage() {
  const navigate = useNavigate();
  const { myExchanges, getMyExchanges, deleteExchange, updateExchangeStatus, loading } = useExchanges();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadMyExchanges();
  }, []);

  const loadMyExchanges = async () => {
    try {
      await getMyExchanges();
    } catch (error) {
      if (error.response?.data?.requiresMembership) {
        navigate("/plans");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExchange(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting exchange:", error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateExchangeStatus(id, status);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: { bg: "bg-green-100", text: "text-green-800", label: "Disponible" },
      "in-progress": { bg: "bg-yellow-100", text: "text-yellow-800", label: "En progreso" },
      completed: { bg: "bg-blue-100", text: "text-blue-800", label: "Completado" },
      cancelled: { bg: "bg-gray-100", text: "text-gray-800", label: "Cancelado" },
    };
    const badge = badges[status] || badges.available;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Trueques</h1>
            <p className="text-gray-600">
              Administra tus publicaciones activas
            </p>
          </div>
          <Link
            to="/create-exchange"
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition shadow-lg"
          >
            + Nuevo Trueque
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : myExchanges.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No tienes trueques publicados
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza publicando tu primer trueque y conecta con la comunidad
            </p>
            <Link
              to="/create-exchange"
              className="inline-block px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
            >
              Publicar mi primer trueque
            </Link>
          </div>
        ) : (
          /* Exchanges List */
          <div className="space-y-6">
            {myExchanges.map((exchange) => (
              <div
                key={exchange._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-emerald-400 to-teal-400 relative">
                    {exchange.images && exchange.images.length > 0 ? (
                      <img
                        src={exchange.images[0]}
                        alt={exchange.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    {/* Title & Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {exchange.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {exchange.description}
                        </p>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(exchange.status)}
                      </div>
                    </div>

                    {/* Offering & Seeking */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {/* Offering */}
                      <div className="p-4 bg-emerald-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-emerald-700">
                            🎁 Ofreces:
                          </span>
                          <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded">
                            {exchange.offering.category}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          {getConditionLabel(exchange.offering.condition)}
                        </div>
                        <div className="text-sm font-semibold text-emerald-700 mt-1">
                          S/ {exchange.offering.estimatedValue}
                        </div>
                      </div>

                      {/* Seeking */}
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-blue-700">
                            🔍 Buscas:
                          </span>
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                            {exchange.seeking.category}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 line-clamp-2">
                          {exchange.seeking.description}
                        </div>
                      </div>
                    </div>

                    {/* Location & Date */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>
                        {exchange.isVirtual ? "💻 Virtual" : `📍 ${exchange.location}`}
                      </span>
                      <span>•</span>
                      <span>
                        📅 {new Date(exchange.createdAt).toLocaleDateString("es-ES")}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {/* Status Actions */}
                      {exchange.status === "available" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(exchange._id, "in-progress")}
                            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition text-sm font-medium"
                          >
                            Marcar en progreso
                          </button>
                          <button
                            onClick={() => handleStatusChange(exchange._id, "completed")}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                          >
                            Marcar completado
                          </button>
                        </>
                      )}

                      {exchange.status === "in-progress" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(exchange._id, "available")}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium"
                          >
                            Volver a disponible
                          </button>
                          <button
                            onClick={() => handleStatusChange(exchange._id, "completed")}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                          >
                            Marcar completado
                          </button>
                        </>
                      )}

                      {/* View Details */}
                      <Link
                        to={`/exchanges/${exchange._id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                      >
                        Ver detalles
                      </Link>

                      {/* Delete */}
                      {deleteConfirm === exchange._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(exchange._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                          >
                            Confirmar eliminar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(exchange._id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyExchangesPage;
