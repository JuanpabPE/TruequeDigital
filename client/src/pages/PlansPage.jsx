import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMembership } from "../context/MembershipContext";
import { useAuth } from "../context/AuthContext";

function PlansPage() {
  const { plans, loading, error, getPlans, createMembership } = useMembership();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleCreateMembership = async () => {
    if (!selectedPlan) return;

    try {
      setProcessing(true);
      await createMembership({
        plan: selectedPlan.id,
        paymentMethod: "whatsapp",
        paymentProof: "",
      });

      setShowPaymentModal(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando planes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Elige tu plan perfecto
          </h1>
          <p className="text-xl text-gray-600">
            Todos los planes incluyen intercambios ilimitados y acceso completo
            a la plataforma
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                index === 0 ? "border-2 border-emerald-500" : ""
              }`}
            >
              {index === 0 && (
                <div className="bg-emerald-500 text-white text-center py-2 font-semibold">
                  MÁS POPULAR
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    S/{plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/mes</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-6 h-6 text-emerald-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                    index === 0
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  Seleccionar plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Confirmar suscripción
              </h3>
              <p className="text-gray-600 mb-6">
                Has seleccionado el <strong>{selectedPlan.name}</strong> por{" "}
                <strong>S/{selectedPlan.price}</strong> al mes.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Próximo paso:</strong> Realiza el pago por WhatsApp al{" "}
                  <strong>+51 999 321 654</strong> y envía tu comprobante.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                  disabled={processing}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateMembership}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition disabled:bg-gray-300"
                >
                  {processing ? "Procesando..." : "Continuar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlansPage;
