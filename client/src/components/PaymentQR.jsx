import { useState, useEffect } from "react";

function PaymentQR({ paymentMethod, phoneNumber, amount }) {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Generar URL del QR usando un servicio como QR Server
    // Para Yape y Plin, el formato puede variar
    const generateQR = () => {
      // Formato para mostrar: número de teléfono + monto
      const qrData = `${paymentMethod.toUpperCase()}: ${phoneNumber} - Monto: S/${amount}`;
      const encodedData = encodeURIComponent(qrData);
      // Usando qr-server.com para generar el QR
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;
    };

    setQrUrl(generateQR());
  }, [paymentMethod, phoneNumber, amount]);

  return (
    <div className="bg-white rounded-lg p-6 text-center border-2 border-gray-200">
      <div className="mb-4">
        <h4 className="font-bold text-gray-900 text-lg mb-2">
          Escanea el código QR
        </h4>
        <p className="text-sm text-gray-600">
          Abre tu app de {paymentMethod === "yape" ? "Yape" : "Plin"} y escanea
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg mb-4">
        <img
          src={qrUrl}
          alt="QR Code"
          className="mx-auto rounded-lg shadow-md"
          style={{ width: "250px", height: "250px" }}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-1">O transfiere al número:</p>
        <p className="text-2xl font-bold text-gray-900">{phoneNumber}</p>
        <p className="text-sm text-gray-600 mt-2">
          Monto: <span className="font-bold text-emerald-600">S/{amount}</span>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        Transacción segura
      </div>
    </div>
  );
}

export default PaymentQR;
