function PaymentQR({ paymentMethod, phoneNumber, amount }) {
  const getPaymentIcon = () => {
    if (paymentMethod === "yape") {
      return (
        <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-3xl">YAPE</span>
        </div>
      );
    } else {
      return (
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-3xl">PLIN</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center border-2 border-gray-300">
      {getPaymentIcon()}
      
      <h4 className="font-bold text-gray-900 text-xl mb-2">
        Realiza tu pago por {paymentMethod === "yape" ? "Yape" : "Plin"}
      </h4>
      
      <div className="bg-white rounded-lg p-6 my-4 shadow-sm">
        <p className="text-sm text-gray-600 mb-2">Transfiere al número:</p>
        <p className="text-3xl font-bold text-gray-900 mb-4">{phoneNumber}</p>
        
        <div className="border-t-2 border-dashed border-gray-300 pt-4">
          <p className="text-sm text-gray-600 mb-1">Monto a pagar:</p>
          <p className="text-4xl font-bold text-emerald-600">S/ {amount}</p>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Importante:</strong> Abre tu app de {paymentMethod === "yape" ? "Yape" : "Plin"}, 
              usa la opción "Yapear" o "Plin", ingresa el número manualmente y el monto exacto.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center text-xs text-gray-500">
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
        Transacción segura y encriptada
      </div>
    </div>
  );
}

export default PaymentQR;
