import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
      <Link to={isAuthenticated ? "/dashboard" : "/"}>
        <h1 className="text-2xl font-bold">Cambia y Gana</h1>
      </Link>
      <ul className="flex gap-x-4 items-center">
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/exchanges" className="hover:text-emerald-400 transition">
                Trueques
              </Link>
            </li>
            <li>
              <Link to="/my-exchanges" className="hover:text-emerald-400 transition">
                Mis Trueques
              </Link>
            </li>
            <li>
              <Link to="/membership" className="hover:text-emerald-400 transition">
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
              <Link to="/login" className="bg-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-600 transition">
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
