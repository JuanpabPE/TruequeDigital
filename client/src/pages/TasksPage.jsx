import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";

function TaskPage() {
  const { getTasks, tasks } = useTasks();
  const { user } = useAuth();

  useEffect(() => {
    getTasks();
  }, []);

  // Página de bienvenida mejorada
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header de bienvenida */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full mb-4">
            ¡Bienvenido/a! 🎉
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Hola, {user?.username || "Usuario"}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            ¡Estás listo para empezar a intercambiar! Explora las opciones
            disponibles
          </p>
        </div>

        {/* Cards de acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Explorar Trueques */}
          <Link
            to="/exchanges"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-emerald-400"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Explorar Trueques
              </h3>
              <p className="text-gray-600">
                Descubre intercambios publicados por la comunidad
              </p>
            </div>
          </Link>

          {/* Publicar Trueque */}
          <Link
            to="/create-exchange"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-purple-400"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Publicar Trueque
              </h3>
              <p className="text-gray-600">
                Ofrece algo que ya no uses y recibe algo que necesites
              </p>
            </div>
          </Link>

          {/* Mis Matches */}
          <Link
            to="/matches"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-blue-400"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Mis Matches
              </h3>
              <p className="text-gray-600">
                Gestiona tus solicitudes de intercambio
              </p>
            </div>
          </Link>
        </div>

        {/* Sección informativa */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            ¿Cómo funciona Trueque Digital?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="font-bold mb-2">Publica</h3>
              <p className="text-sm text-purple-100">
                Crea tu trueque con fotos y descripción
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="font-bold mb-2">Explora</h3>
              <p className="text-sm text-purple-100">
                Encuentra trueques que te interesen
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="font-bold mb-2">Conecta</h3>
              <p className="text-sm text-purple-100">
                Solicita intercambio y chatea
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">4️⃣</span>
              </div>
              <h3 className="font-bold mb-2">Intercambia</h3>
              <p className="text-sm text-purple-100">
                Coordina y realiza el trueque
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas o accesos rápidos adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/my-exchanges"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-3xl">📋</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Mis Publicaciones
              </h3>
              <p className="text-gray-600">Administra tus trueques activos</p>
            </div>
          </Link>

          <Link
            to="/membership"
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
              <span className="text-3xl">👑</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Mi Membresía</h3>
              <p className="text-gray-600">Revisa tu plan y beneficios</p>
            </div>
          </Link>
        </div>

        {/* Sección de Tasks (si existen) - Opcional */}
        {tasks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tus Tareas
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard task={task} key={task._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskPage;
