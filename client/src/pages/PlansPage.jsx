import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMembership } from "../context/MembershipContext";
import { useAuth } from "../context/AuthContext";
import PaymentQR from "../components/PaymentQR";

function PlansPage() {
  const {
    plans,
    loading,
    error,
    getPlans,
    createMembership,
    uploadPaymentProof,
  } = useMembership();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("yape");
  const [paymentFile, setPaymentFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [createdMembershipId, setCreatedMembershipId] = useState(null);

  useEffect(() => {
    getPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedPlan(plan);
    setPaymentMethod("yape");
    setPaymentFile(null);
    setPreviewUrl(null);
    setShowPaymentModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMembership = async () => {
    if (!selectedPlan) return;

    try {
      setProcessing(true);

      // Crear la membresía primero
      const membership = await createMembership({
        plan: selectedPlan.id,
        paymentMethod: paymentMethod,
        paymentProof: "",
      });

      setCreatedMembershipId(membership._id);

      // Si hay un archivo de comprobante, subirlo
      if (paymentFile) {
        await uploadPaymentProof(membership._id, paymentFile);
        alert(
          "¡Comprobante subido exitosamente! Tu pago será revisado y aprobado pronto. Te notificaremos cuando tu membresía esté activa."
        );
        setShowPaymentModal(false);
        navigate("/membership");
      } else {
        alert("Membresía creada. Por favor, sube tu comprobante de pago.");
      }
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
        {/* Back Button */}
        {isAuthenticated && (
          <div className="mb-6">
            <button
              onClick={() => navigate("/membership")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver al menú principal
            </button>
          </div>
        )}

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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 my-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Confirmar suscripción
              </h3>
              <p className="text-gray-600 mb-6">
                Has seleccionado el <strong>{selectedPlan.name}</strong> por{" "}
                <strong>S/{selectedPlan.price}</strong> al mes.
              </p>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Método de pago
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod("yape")}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition ${
                      paymentMethod === "yape"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Yape
                  </button>
                  <button
                    onClick={() => setPaymentMethod("plin")}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition ${
                      paymentMethod === "plin"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Plin
                  </button>
                </div>
              </div>

              {/* QR Code Display */}
              <div className="mb-6">
                <PaymentQR
                  paymentMethod={paymentMethod}
                  phoneNumber="+51 923 094 108"
                  amount={selectedPlan.price}
                />
              </div>

              {/* Payment Instructions */}
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-emerald-900 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Pasos para completar el pago
                </h4>
                <ol className="text-sm text-emerald-800 space-y-2 ml-7">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span>Escanea el QR o transfiere al número mostrado</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span>Toma una captura de pantalla del comprobante</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span>Sube la imagen aquí abajo</span>
                  </li>
                </ol>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comprobante de pago
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="payment-proof"
                  />
                  <label
                    htmlFor="payment-proof"
                    className="cursor-pointer block"
                  >
                    {previewUrl ? (
                      <div>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-40 mx-auto rounded-lg mb-2"
                        />
                        <p className="text-sm text-emerald-600 font-semibold">
                          ✓ Imagen cargada - Click para cambiar
                        </p>
                      </div>
                    ) : (
                      <div>
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-sm text-gray-600">
                          Click para subir comprobante
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG o JPEG
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Warning if no file */}
              {!paymentFile && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Debes subir el comprobante de pago para activar tu
                    membresía
                  </p>
                </div>
              )}

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
                  disabled={processing || !paymentFile}
                  className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {processing ? "Procesando..." : "Activar membresía"}
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
