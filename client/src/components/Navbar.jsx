import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMatches } from "../context/MatchContext";
import { useEffect } from "react";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { notificationsCount, getNotificationsCount } = useMatches();

  useEffect(() => {
    if (isAuthenticated) {
      getNotificationsCount();
      // Actualizar cada 30 segundos
      const interval = setInterval(() => {
        getNotificationsCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
      <Link to={isAuthenticated ? "/dashboard" : "/"}>
        <h1 className="text-2xl font-bold">Cambia y Gana</h1>
      </Link>
      <ul className="flex gap-x-4 items-center">
        {isAuthenticated ? (
          <>
            <li>
              <Link
                to="/dashboard"
                className="hover:text-blue-400 transition font-semibold"
              >
                🏠 Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/exchanges"
                className="hover:text-emerald-400 transition"
              >
                Trueques
              </Link>
            </li>
            <li>
              <Link
                to="/my-exchanges"
                className="hover:text-emerald-400 transition"
              >
                Mis Trueques
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/matches"
                className="hover:text-purple-400 transition flex items-center gap-1"
              >
                Matches
                {notificationsCount.total > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[1.25rem] text-center">
                    {notificationsCount.total > 99
                      ? "99+"
                      : notificationsCount.total}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/membership"
                className="hover:text-emerald-400 transition"
              >
                Membresía
              </Link>
            </li>
            <li className="text-gray-300">Hola, {user.username}</li>
            <li>
              <Link
                to="/create-exchange"
                className="bg-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
              >
                + Publicar
              </Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={() => {
                  logout();
                }}
                className="hover:text-red-400 transition"
              >
                Salir
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="bg-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
              >
                Ingresar
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="bg-teal-500 px-4 py-2 rounded-lg hover:bg-teal-600 transition"
              >
                Registrarse
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
