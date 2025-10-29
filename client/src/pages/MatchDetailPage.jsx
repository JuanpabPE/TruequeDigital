import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMatches } from "../context/MatchContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import MatchChat from "../components/MatchChat";

function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentMatch,
    getMatchById,
    sendMessage,
    updateMeetingDetails,
    completeMatch,
    loading,
  } = useMatches();
  const { user } = useAuth();

  const [meetingForm, setMeetingForm] = useState({
    date: "",
    location: "",
    notes: "",
  });
  const [savingMeeting, setSavingMeeting] = useState(false);
  const [isEditingMeeting, setIsEditingMeeting] = useState(false);

  useEffect(() => {
    if (id) {
      loadMatch();
    }
  }, [id]);

  useEffect(() => {
    // Solo actualizar el formulario si NO está editando
    if (currentMatch?.meetingDetails && !isEditingMeeting) {
      const newForm = {
        date: currentMatch.meetingDetails.date
          ? new Date(currentMatch.meetingDetails.date)
              .toISOString()
              .slice(0, 16)
          : "",
        location: currentMatch.meetingDetails.location || "",
        notes: currentMatch.meetingDetails.notes || "",
      };
      
      // Solo actualizar si realmente cambió (comparación profunda)
      if (JSON.stringify(newForm) !== JSON.stringify(meetingForm)) {
        setMeetingForm(newForm);
      }
    }
  }, [currentMatch?.meetingDetails, isEditingMeeting]);

  const loadMatch = async () => {
    try {
      await getMatchById(id);
    } catch (error) {
      console.error("Error al cargar match:", error);
      navigate("/matches");
    }
  };

  const handleSendMessage = async (content) => {
    await sendMessage(id, content);
  };

  const handleSaveMeetingDetails = async (e) => {
    e.preventDefault();

    try {
      setSavingMeeting(true);
      setIsEditingMeeting(false); // Ya no está editando
      await updateMeetingDetails(id, meetingForm);
      alert("Detalles del encuentro actualizados");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar detalles");
    } finally {
      setSavingMeeting(false);
    }
  };

  const handleMeetingFormChange = (field, value) => {
    setIsEditingMeeting(true); // Marcar que está editando
    setMeetingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompleteMatch = async () => {
    // Verificar si ya confirmó
    const isRequester = currentMatch.requester._id === user.id;
    const alreadyConfirmed = isRequester
      ? currentMatch.completionConfirmation?.requesterConfirmed
      : currentMatch.completionConfirmation?.requestedUserConfirmed;

    if (alreadyConfirmed) {
      alert("Ya has confirmado que el intercambio se completó. Esperando confirmación del otro usuario.");
      return;
    }

    if (
      !confirm(
        "¿Confirmar que el intercambio se ha completado? Se requiere confirmación de ambos usuarios para finalizar."
      )
    ) {
      return;
    }

    try {
      const response = await completeMatch(id);
      alert(response.message);
      await loadMatch();
    } catch (error) {
      console.error("Error al completar:", error);
      alert("Error al confirmar el intercambio");
    }
  };

  if (loading || !currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-purple-600 text-xl">Cargando...</div>
        </div>
      </div>
    );
  }

  const isRequester = currentMatch.requester._id === user.id;
  const otherUser = isRequester
    ? currentMatch.requestedUser
    : currentMatch.requester;
  const myExchange = isRequester
    ? currentMatch.exchangeOffered
    : currentMatch.exchangeRequested;
  const theirExchange = isRequester
    ? currentMatch.exchangeRequested
    : currentMatch.exchangeOffered;

  const statusInfo = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: "⏳",
      label: "Pendiente",
    },
    accepted: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: "✅",
      label: "Aceptado",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: "❌",
      label: "Rechazado",
    },
    completed: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: "🎉",
      label: "Completado",
    },
    cancelled: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: "🚫",
      label: "Cancelado",
    },
  };

  const status = statusInfo[currentMatch.status] || statusInfo.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/matches"
            className="text-purple-600 hover:text-purple-700 inline-flex items-center mb-4"
          >
            ← Volver a Matches
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Match de Intercambio
                </h1>
                <p className="text-gray-600">Entre tú y {otherUser.username}</p>
              </div>
              <div
                className={`${status.bg} ${status.text} px-6 py-3 rounded-full font-semibold text-lg`}
              >
                {status.icon} {status.label}
              </div>
            </div>
          </div>
        </div>

        {/* Exchanges involucrados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tu exchange */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4">
              <h2 className="text-xl font-bold">Tu Exchange</h2>
            </div>
            <div className="p-6">
              {myExchange.images?.[0] && (
                <img
                  src={myExchange.images[0]}
                  alt={myExchange.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {myExchange.title}
              </h3>
              <p className="text-gray-600 mb-4">{myExchange.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-emerald-600 font-semibold">
                    Categoría
                  </p>
                  <p className="text-sm font-medium text-emerald-900">
                    {myExchange.offering?.category}
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-emerald-600 font-semibold">
                    Condición
                  </p>
                  <p className="text-sm font-medium text-emerald-900">
                    {myExchange.offering?.condition}
                  </p>
                </div>
                <div className="col-span-2 bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-emerald-600 font-semibold">
                    Valor estimado
                  </p>
                  <p className="text-sm font-medium text-emerald-900">
                    S/ {myExchange.offering?.estimatedValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Su exchange */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4">
              <h2 className="text-xl font-bold">
                Exchange de {otherUser.username}
              </h2>
            </div>
            <div className="p-6">
              {theirExchange.images?.[0] && (
                <img
                  src={theirExchange.images[0]}
                  alt={theirExchange.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {theirExchange.title}
              </h3>
              <p className="text-gray-600 mb-4">{theirExchange.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-600 font-semibold">
                    Categoría
                  </p>
                  <p className="text-sm font-medium text-purple-900">
                    {theirExchange.offering?.category}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-600 font-semibold">
                    Condición
                  </p>
                  <p className="text-sm font-medium text-purple-900">
                    {theirExchange.offering?.condition}
                  </p>
                </div>
                <div className="col-span-2 bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-600 font-semibold">
                    Valor estimado
                  </p>
                  <p className="text-sm font-medium text-purple-900">
                    S/ {theirExchange.offering?.estimatedValue}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal - Solo si está aceptado */}
        {currentMatch.status === "accepted" ||
        currentMatch.status === "completed" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Chat */}
            <div className="lg:col-span-2">
              <MatchChat
                match={currentMatch}
                onSendMessage={handleSendMessage}
              />
            </div>

            {/* Columna derecha - Info de contacto y coordinación */}
            <div className="space-y-6">
              {/* Información de contacto */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📞 Contacto de {otherUser.username}
                </h3>
                <div className="space-y-3">
                  {otherUser.email && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 font-semibold mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${otherUser.email}`}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {otherUser.email}
                      </a>
                    </div>
                  )}
                  {otherUser.whatsapp && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 font-semibold mb-1">
                        WhatsApp
                      </p>
                      <a
                        href={`https://wa.me/${otherUser.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        {otherUser.whatsapp}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Coordinación del encuentro */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📅 Coordinar Encuentro
                </h3>

                <form onSubmit={handleSaveMeetingDetails} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha y Hora
                    </label>
                    <input
                      type="datetime-local"
                      value={meetingForm.date}
                      onChange={(e) => handleMeetingFormChange("date", e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lugar
                    </label>
                    <input
                      type="text"
                      value={meetingForm.location}
                      onChange={(e) => handleMeetingFormChange("location", e.target.value)}
                      placeholder="Ej: Plaza de Armas, Starbucks Av. Larco..."
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas adicionales
                    </label>
                    <textarea
                      value={meetingForm.notes}
                      onChange={(e) => handleMeetingFormChange("notes", e.target.value)}
                      placeholder="Detalles adicionales sobre el encuentro..."
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                      rows="3"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={savingMeeting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {savingMeeting ? "Guardando..." : "Guardar Detalles"}
                  </button>
                </form>
              </div>

              {/* Botón de completar intercambio */}
              {currentMatch.status === "accepted" && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    ¿Intercambio realizado?
                  </h3>
                  
                  {(() => {
                    const isRequester = currentMatch.requester._id === user.id;
                    const myConfirmed = isRequester
                      ? currentMatch.completionConfirmation?.requesterConfirmed
                      : currentMatch.completionConfirmation?.requestedUserConfirmed;
                    const otherConfirmed = isRequester
                      ? currentMatch.completionConfirmation?.requestedUserConfirmed
                      : currentMatch.completionConfirmation?.requesterConfirmed;

                    if (myConfirmed && otherConfirmed) {
                      return (
                        <div className="text-center">
                          <div className="text-4xl mb-3">🎉</div>
                          <p className="text-green-600 font-semibold mb-2">
                            ¡Intercambio completado por ambos!
                          </p>
                          <p className="text-gray-500 text-sm">
                            El intercambio ha sido confirmado exitosamente
                          </p>
                        </div>
                      );
                    } else if (myConfirmed) {
                      return (
                        <div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                            <p className="text-blue-700 font-semibold mb-1">
                              ✓ Ya confirmaste
                            </p>
                            <p className="text-blue-600 text-sm">
                              Esperando confirmación de {otherUser.username}
                            </p>
                          </div>
                          <button
                            disabled
                            className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold cursor-not-allowed"
                          >
                            ✓ Ya confirmaste
                          </button>
                        </div>
                      );
                    } else if (otherConfirmed) {
                      return (
                        <div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                            <p className="text-yellow-700 font-semibold mb-1">
                              ⏳ {otherUser.username} ya confirmó
                            </p>
                            <p className="text-yellow-600 text-sm">
                              Falta tu confirmación para completar el intercambio
                            </p>
                          </div>
                          <button
                            onClick={handleCompleteMatch}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                          >
                            ✓ Confirmar que se realizó
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <p className="text-gray-600 text-sm mb-4">
                            Una vez realizado el intercambio presencial, confirma aquí.
                            Se requiere confirmación de ambos usuarios.
                          </p>
                          <button
                            onClick={handleCompleteMatch}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                          >
                            ✓ Confirmar Intercambio Realizado
                          </button>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Estados no aceptados */
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">{status.icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status.label}
            </h2>
            {currentMatch.status === "pending" && (
              <p className="text-gray-600">
                {isRequester
                  ? "Esperando que el otro usuario acepte tu solicitud"
                  : "Ve a Matches para aceptar o rechazar esta solicitud"}
              </p>
            )}
            {currentMatch.status === "rejected" && (
              <div>
                <p className="text-gray-600 mb-4">
                  Esta solicitud fue rechazada
                </p>
                {currentMatch.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-red-600 font-semibold mb-1">
                      Razón:
                    </p>
                    <p className="text-red-800">
                      {currentMatch.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            )}
            {currentMatch.status === "cancelled" && (
              <p className="text-gray-600">Esta solicitud fue cancelada</p>
            )}
            {currentMatch.status === "completed" && (
              <p className="text-gray-600">
                ¡Este intercambio se completó exitosamente! 🎉
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchDetailPage;
