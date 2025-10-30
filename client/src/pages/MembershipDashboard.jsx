import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMembership } from "../context/MembershipContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function MembershipDashboard() {
  const {
    activeMembership,
    membershipHistory,
    loading,
    getActiveMembership,
    getMembershipHistory,
    cancelMembership,
  } = useMembership();
  const { user } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getActiveMembership();
    getMembershipHistory();
  }, []);

  const handleCancelMembership = async () => {
    try {
      setCancelling(true);
      await cancelMembership();
      setShowCancelModal(false);
      alert("Membresía cancelada exitosamente");
    } catch (error) {
      alert(error.message);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getPlanName = (planId) => {
    const names = {
      basic: "Plan Básico",
      standard: "Plan Standard",
      premium: "Plan Premium",
    };
    return names[planId] || planId;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    const labels = {
      active: "Activa",
      pending: "Pendiente",
      expired: "Expirada",
      cancelled: "Cancelada",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mi Membresía</h1>
            <p className="text-gray-600 mt-2">
              Gestiona tu suscripción y beneficios
            </p>
          </div>

          {/* Active Membership Card */}
          {activeMembership ? (
            activeMembership.status === "pending" ? (
              // Membresía Pendiente
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-8 text-white mb-8">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center">
                  Pago en Revisión
                </h2>
                <p className="text-yellow-100 text-center mb-6">
                  {getPlanName(activeMembership.plan)} - S/
                  {activeMembership.price}
                </p>

                <div className="bg-white bg-opacity-20 rounded-lg p-6">
                  <p className="text-center mb-4">
                    Tu comprobante de pago está siendo revisado por nuestro
                    equipo.
                  </p>
                  <p className="text-center text-sm text-yellow-100">
                    Te notificaremos cuando tu membresía sea aprobada.
                    Generalmente toma menos de 24 horas.
                  </p>
                </div>

                {activeMembership.paymentProof && (
                  <div className="mt-6 text-center">
                    <a
                      href={activeMembership.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-yellow-600 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition"
                    >
                      Ver comprobante enviado
                    </a>
                  </div>
                )}
              </div>
            ) : (
              // Membresía Activa
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {getPlanName(activeMembership.plan)}
                    </h2>
                    <p className="text-emerald-100">
                      S/{activeMembership.price} /mes
                    </p>
                  </div>
                  <div className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-bold">
                    {getDaysRemaining(activeMembership.endDate)} días restantes
                  </div>
                </div>

                {/* Exchanges Progress Bar */}
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">
                      Intercambios disponibles
                    </span>
                    <span className="text-lg font-bold">
                      {activeMembership.exchangesAllowed -
                        activeMembership.exchangesUsed}{" "}
                      / {activeMembership.exchangesAllowed}
                    </span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                    <div
                      className="bg-white rounded-full h-3 transition-all duration-300"
                      style={{
                        width: `${
                          ((activeMembership.exchangesAllowed -
                            activeMembership.exchangesUsed) /
                            activeMembership.exchangesAllowed) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-emerald-100 text-sm">Inicio</p>
                    <p className="font-semibold">
                      {formatDate(activeMembership.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-sm">Renovación</p>
                    <p className="font-semibold">
                      {formatDate(activeMembership.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    to="/plans"
                    className="flex-1 bg-white text-emerald-600 py-3 rounded-lg font-semibold text-center hover:bg-emerald-50 transition"
                  >
                    Cambiar plan
                  </Link>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition"
                  >
                    Cancelar membresía
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No tienes una membresía activa
              </h3>
              <p className="text-gray-600 mb-6">
                Suscríbete a un plan para comenzar a intercambiar
              </p>
              <Link
                to="/plans"
                className="inline-block bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition"
              >
                Ver planes
              </Link>
            </div>
          )}

          {/* Membership History */}
          {membershipHistory.filter(m => m.status !== 'expired').length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Historial de membresías
              </h3>
              <div className="space-y-4">
                {membershipHistory
                  .filter(m => m.status !== 'expired')
                  .map((membership) => (
                  <div
                    key={membership._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getPlanName(membership.plan)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(membership.startDate)} -{" "}
                        {formatDate(membership.endDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-gray-900 font-semibold">
                        S/{membership.price}
                      </p>
                      {getStatusBadge(membership.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancel Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¿Cancelar membresía?
                </h3>
                <p className="text-gray-600 mb-6">
                  Tu membresía se mantendrá activa hasta{" "}
                  <strong>{formatDate(activeMembership.endDate)}</strong>.
                  Después perderás acceso a todos los beneficios.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                    disabled={cancelling}
                  >
                    No, mantener
                  </button>
                  <button
                    onClick={handleCancelMembership}
                    disabled={cancelling}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:bg-gray-300"
                  >
                    {cancelling ? "Cancelando..." : "Sí, cancelar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MembershipDashboard;
