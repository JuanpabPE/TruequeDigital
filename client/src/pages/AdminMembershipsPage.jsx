import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

function AdminMembershipsPage() {
  const [pendingMemberships, setPendingMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPendingMemberships();
  }, []);

  const loadPendingMemberships = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/memberships/pending");
      setPendingMemberships(response.data);
    } catch (error) {
      console.error("Error cargando membresías:", error);
      alert("Error al cargar membresías pendientes");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (membershipId) => {
    if (!confirm("¿Aprobar esta membresía?")) return;

    try {
      setProcessing(membershipId);
      await axios.post(`/admin/memberships/${membershipId}/approve`);
      alert("Membresía aprobada exitosamente");
      loadPendingMemberships();
    } catch (error) {
      console.error("Error aprobando membresía:", error);
      alert("Error al aprobar membresía");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (membershipId) => {
    const reason = prompt("Motivo del rechazo:");
    if (!reason) return;

    try {
      setProcessing(membershipId);
      await axios.post(`/admin/memberships/${membershipId}/reject`, {
        reason,
      });
      alert("Membresía rechazada");
      loadPendingMemberships();
    } catch (error) {
      console.error("Error rechazando membresía:", error);
      alert("Error al rechazar membresía");
    } finally {
      setProcessing(null);
    }
  };

  const getPlanName = (planId) => {
    const names = {
      basic: "Plan Básico",
      standard: "Plan Standard",
      premium: "Plan Premium",
    };
    return names[planId] || planId;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona pagos y membresías pendientes
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
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
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">
                    Pendientes
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {pendingMemberships.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Memberships List */}
          {pendingMemberships.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No hay pagos pendientes
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Todos los pagos han sido procesados
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {pendingMemberships.map((membership) => (
                  <li key={membership._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {membership.user?.username ||
                                membership.user?.email}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {membership.user?.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {getPlanName(membership.plan)}
                            </p>
                            <p className="text-2xl font-bold text-emerald-600">
                              S/{membership.price}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Método de pago:</p>
                            <p className="font-semibold text-gray-900 uppercase">
                              {membership.paymentMethod}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Fecha de solicitud:</p>
                            <p className="font-semibold text-gray-900">
                              {formatDate(membership.createdAt)}
                            </p>
                          </div>
                        </div>

                        {membership.paymentProof && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">
                              Comprobante de pago:
                            </p>
                            <a
                              href={membership.paymentProof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <img
                                src={membership.paymentProof}
                                alt="Comprobante"
                                className="max-w-xs rounded-lg border-2 border-gray-300 hover:border-emerald-500 transition"
                              />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={() => handleApprove(membership._id)}
                        disabled={processing === membership._id}
                        className="flex-1 bg-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {processing === membership._id
                          ? "Procesando..."
                          : "✓ Aprobar"}
                      </button>
                      <button
                        onClick={() => handleReject(membership._id)}
                        disabled={processing === membership._id}
                        className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {processing === membership._id
                          ? "Procesando..."
                          : "✗ Rechazar"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminMembershipsPage;
