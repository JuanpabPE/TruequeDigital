import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMatches } from "../context/MatchContext";
import Navbar from "../components/Navbar";

function MatchesPage() {
  const {
    sentMatches,
    receivedMatches,
    getSentMatches,
    getReceivedMatches,
    acceptMatch,
    rejectMatch,
    cancelMatch,
    deleteMatch,
    loading,
  } = useMatches();

  const [activeTab, setActiveTab] = useState("received"); // "sent" | "received"
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  // Polling silencioso: Recargar matches cada 15 segundos sin loading state
  useEffect(() => {
    const interval = setInterval(() => {
      // Solo recargar si la pestaña está visible
      if (!document.hidden) {
        // Llamar directamente a las funciones sin mostrar loading
        getSentMatches();
        getReceivedMatches();
      }
    }, 15000); // 15 segundos (menos frecuente)

    return () => clearInterval(interval);
  }, []);

  const loadMatches = async () => {
    await Promise.all([getSentMatches(), getReceivedMatches()]);
  };

  const handleAccept = async (matchId) => {
    if (
      !confirm(
        "¿Aceptar este intercambio? Se compartirá tu información de contacto."
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await acceptMatch(matchId);
      alert(
        "¡Intercambio aceptado! Ya puedes chatear y coordinar el encuentro."
      );
    } catch (error) {
      console.error("Error al aceptar:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (matchId) => {
    setSelectedMatchId(matchId);
    setShowRejectModal(true);
  };

  const handleReject = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);
      await rejectMatch(selectedMatchId, rejectionReason);
      setShowRejectModal(false);
      setSelectedMatchId(null);
      setRejectionReason("");
      alert("Solicitud rechazada");
    } catch (error) {
      console.error("Error al rechazar:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (matchId) => {
    if (!confirm("¿Cancelar esta solicitud de intercambio?")) {
      return;
    }

    try {
      setActionLoading(true);
      await cancelMatch(matchId);
      alert("Solicitud cancelada");
    } catch (error) {
      console.error("Error al cancelar:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (matchId, e) => {
    // Prevenir navegación al match
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(
        "¿Eliminar este match? Esta acción no se puede deshacer. Solo se pueden eliminar matches completados, rechazados o cancelados."
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await deleteMatch(matchId);
      alert("Match eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert(
        error.response?.data?.message ||
          "No se pudo eliminar el match. Solo se pueden eliminar matches completados, rechazados o cancelados."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pendiente",
      },
      accepted: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Aceptado",
      },
      rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rechazado" },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Completado",
      },
      cancelled: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Cancelado",
      },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span
        className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}
      >
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const pendingReceivedCount = receivedMatches.filter(
    (m) => m.status === "pending"
  ).length;

  const activeMatches = activeTab === "sent" ? sentMatches : receivedMatches;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Matches</h1>
          <p className="text-gray-600">
            Gestiona tus solicitudes de intercambio
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("received")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${
                activeTab === "received"
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Recibidas
              {pendingReceivedCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {pendingReceivedCount}
                </span>
              )}
              {activeTab === "received" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${
                activeTab === "sent"
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Enviadas
              {activeTab === "sent" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-purple-600 text-lg">Cargando...</div>
              </div>
            ) : activeMatches.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No hay matches{" "}
                  {activeTab === "sent" ? "enviados" : "recibidos"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === "sent"
                    ? "Explora trueques y envía tu primera solicitud"
                    : "Cuando recibas solicitudes aparecerán aquí"}
                </p>
                <Link
                  to="/exchanges"
                  className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Explorar Trueques
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeMatches.map((match) => (
                  <Link
                    key={match._id}
                    to={`/matches/${match._id}`}
                    className="block bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {activeTab === "sent"
                            ? match.requestedUser?.username?.[0]?.toUpperCase()
                            : match.requester?.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {activeTab === "sent"
                              ? match.requestedUser?.username
                              : match.requester?.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(match.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(match.status)}
                        {/* Botón de eliminar para matches inactivos */}
                        {(match.status === "rejected" ||
                          match.status === "cancelled" ||
                          match.status === "completed") && (
                          <button
                            onClick={(e) => handleDelete(match._id, e)}
                            disabled={actionLoading}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Eliminar match"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Exchange ofrecido */}
                      <div className="bg-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <p className="text-xs text-emerald-600 font-semibold mb-2">
                          {activeTab === "sent" ? "TU OFERTA" : "OFRECE"}
                        </p>
                        <div className="flex gap-3">
                          {match.exchangeOffered?.images?.[0] && (
                            <img
                              src={match.exchangeOffered.images[0]}
                              alt={match.exchangeOffered.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                              {match.exchangeOffered?.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {match.exchangeOffered?.offering?.category}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Exchange solicitado */}
                      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                        <p className="text-xs text-blue-600 font-semibold mb-2">
                          {activeTab === "sent" ? "SOLICITAS" : "TU EXCHANGE"}
                        </p>
                        <div className="flex gap-3">
                          {match.exchangeRequested?.images?.[0] && (
                            <img
                              src={match.exchangeRequested.images[0]}
                              alt={match.exchangeRequested.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                              {match.exchangeRequested?.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {match.exchangeRequested?.offering?.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mensaje inicial */}
                    {match.initialMessage && (
                      <div className="bg-gray-100 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 italic">
                          "{match.initialMessage}"
                        </p>
                      </div>
                    )}

                    {/* Acciones para matches recibidos pendientes */}
                    {activeTab === "received" && match.status === "pending" && (
                      <div
                        className="flex gap-3"
                        onClick={(e) => e.preventDefault()}
                      >
                        <button
                          onClick={() => handleAccept(match._id)}
                          disabled={actionLoading}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                          ✓ Aceptar
                        </button>
                        <button
                          onClick={() => openRejectModal(match._id)}
                          disabled={actionLoading}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                          ✗ Rechazar
                        </button>
                      </div>
                    )}

                    {/* Acción para matches enviados pendientes */}
                    {activeTab === "sent" && match.status === "pending" && (
                      <div
                        className="flex gap-3"
                        onClick={(e) => e.preventDefault()}
                      >
                        <button
                          onClick={() => handleCancel(match._id)}
                          disabled={actionLoading}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                          Cancelar solicitud
                        </button>
                      </div>
                    )}

                    {/* Razón de rechazo */}
                    {match.status === "rejected" && match.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                        <p className="text-xs text-red-600 font-semibold mb-1">
                          Razón del rechazo:
                        </p>
                        <p className="text-sm text-red-800">
                          {match.rejectionReason}
                        </p>
                      </div>
                    )}

                    {/* CTA para matches aceptados */}
                    {match.status === "accepted" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3 text-center">
                        <p className="text-green-700 font-semibold text-sm">
                          ¡Match aceptado! Haz click para chatear y coordinar →
                        </p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de rechazo */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Rechazar Solicitud
              </h2>

              <form onSubmit={handleReject}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón del rechazo (opcional)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explica brevemente por qué no puedes aceptar este intercambio..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows="4"
                    maxLength="300"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {rejectionReason.length}/300 caracteres
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false);
                      setSelectedMatchId(null);
                      setRejectionReason("");
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    disabled={actionLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Rechazando..." : "Rechazar"}
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

export default MatchesPage;
