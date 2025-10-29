import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useMembership } from "../context/MembershipContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const { getActiveMembership } = useMembership();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    await signin(data);
  });

  useEffect(() => {
    const checkMembershipAndRedirect = async () => {
      if (isAuthenticated) {
        // Verificar si tiene membresía activa
        const membership = await getActiveMembership();
        if (membership) {
          navigate("/dashboard");
        } else {
          navigate("/plans");
        }
      }
    };
    checkMembershipAndRedirect();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-gray-900">Cambia y Gana</h1>
          </Link>
          <p className="mt-2 text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Messages */}
          {signinErrors.map((error, i) => (
            <div
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4"
              key={i}
            >
              {error}
            </div>
          ))}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  El email es requerido
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register("password", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  La contraseña es requerida
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Regístrate gratis →
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
