import { Link } from "react-router-dom";
import { useState } from "react";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Cambia y Gana
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#beneficios"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Beneficios
              </a>
              <a
                href="#como-funciona"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Cómo funciona
              </a>
              <a
                href="#suscripcion"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Suscripción
              </a>
              <a
                href="#preguntas"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Preguntas
              </a>
              <a
                href="#contacto"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Contacto
              </a>
              <Link
                to="/login"
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Únete por S/5
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#beneficios"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Beneficios
              </a>
              <a
                href="#como-funciona"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Cómo funciona
              </a>
              <a
                href="#suscripcion"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Suscripción
              </a>
              <a
                href="#preguntas"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Preguntas
              </a>
              <a
                href="#contacto"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Contacto
              </a>
              <Link
                to="/login"
                className="block px-3 py-2 bg-black text-white text-center rounded-md hover:bg-gray-800"
              >
                Únete por S/5
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-4 py-2 rounded-full">
              • Trueque digital para jóvenes universitarios
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Intercambia lo que ya no usas y<br />
            gana nuevas oportunidades
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Cambia y Gana conecta a estudiantes que desean renovar su vida
            académica sin gastar de más. Intercambia libros, tecnología o
            servicios y accede a una comunidad segura por solo S/5 al mes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition flex items-center gap-2"
            >
              Comenzar por S/5
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <a
              href="#como-funciona"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition"
            >
              Ver cómo funciona
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-gray-900">+3,200</div>
              <div className="text-gray-600 mt-2">JÓVENES CONECTADOS</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-gray-900">48h</div>
              <div className="text-gray-600 mt-2">
                PROMEDIO PARA CONCRETAR UN TRUEQUE
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-gray-900">90%</div>
              <div className="text-gray-600 mt-2">
                SATISFACCIÓN DE LA COMUNIDAD
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section id="beneficios" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Un ecosistema pensado para tu vida universitaria
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Accede a una comunidad confiable, curada y diseñada para que
              intercambies recursos académicos sin gastar de más.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Beneficio 1 */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Comunidad verificada
              </h3>
              <p className="text-gray-600">
                Perfiles confirmados con credencial universitaria y reputación
                visible antes de cada intercambio.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Trueques seguros
              </h3>
              <p className="text-gray-600">
                Chats privados, acuerdos documentados y seguimiento del estado
                para evitar sorpresas.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Catálogo inteligente
              </h3>
              <p className="text-gray-600">
                Algoritmo que sugiere coincidencias según tus intereses, carrera
                y urgencias académicas.
              </p>
            </div>

            {/* Beneficio 4 */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Suscripción accesible
              </h3>
              <p className="text-gray-600">
                Solo S/5 al mes para disfrutar intercambios ilimitados, soporte
                y experiencias exclusivas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section
        id="como-funciona"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <span className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full">
              3 PASOS SENCILLOS
            </span>
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trueques organizados y acompañados de inicio a fin
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestro equipo te guía con plantillas de acuerdos, recordatorios
              automáticos y un canal dedicado para resolver dudas durante cada
              etapa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Paso 1 */}
            <div className="bg-white p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Publica</h3>
              <p className="text-gray-600">
                Sube lo que ofreces y lo que necesitas. Adjunta fotos, describe
                el estado y define tu ubicación o disponibilidad virtual.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-white p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Conecta</h3>
              <p className="text-gray-600">
                Recibe matches inteligentes, conversa en un chat seguro y define
                los términos del intercambio con soporte de nuestra comunidad.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-white p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Intercambia y evalúa
              </h3>
              <p className="text-gray-600">
                Agenda un punto de entrega o sesión virtual, confirma el trueque
                y suma reputación al valorar la experiencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios Section - Carrusel Automático */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Historias que inspiran a más trueques
            </h2>
            <p className="text-lg text-gray-600">
              Voceros reales que encontraron aliados académicos sin gastar más
              de lo necesario.
            </p>
          </div>

          {/* Carrusel animado con duplicación para loop infinito */}
          <div className="relative">
            <div className="flex gap-8 animate-scroll">
              {/* Primera ronda de testimonios */}
              <div className="flex-shrink-0 w-full md:w-96 bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    CR
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-gray-900">Camila Rojas</div>
                    <div className="text-sm text-gray-600">
                      Estudiante de Arquitectura - PUCP
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Intercambié mis maquetas del semestre pasado por materiales nuevos y un monitor. La comunidad es súper respetuosa y rápida para coordinar."
                </p>
              </div>

              <div className="flex-shrink-0 w-full md:w-96 bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    LA
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-gray-900">Luis Aguilar</div>
                    <div className="text-sm text-gray-600">
                      Estudiante de Ingeniería de Sistemas - UNI
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Cambia y Gana me permitió conseguir una laptop de respaldo
                  cambiando cursos online que ya había terminado. El proceso fue
                  transparente y seguro."
                </p>
              </div>

              <div className="flex-shrink-0 w-full md:w-96 bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    VT
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-gray-900">Valeria Torres</div>
                    <div className="text-sm text-gray-600">
                      Estudiante de Psicología - UPCH
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "En una semana logré intercambiar mis libros impresos por
                  sesiones de tutoría. La suscripción es mínima comparada con todo
                  lo que recibes."
                </p>
              </div>

              <div className="flex-shrink-0 w-full md:w-96 bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    DM
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-gray-900">Diego Montalvo</div>
                    <div className="text-sm text-gray-600">
                      Estudiante de Comunicación - ULIMA
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Me encanta la curaduria del match. Recibí alertas con matches
                  que realmente necesito. Es como un marketplace inteligente pero
                  sin gastar dinero."
                </p>
              </div>

              {/* Segunda ronda (duplicado para loop infinito) */}
              <div className="flex-shrink-0 w-full md:w-96 bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    CR
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-gray-900">Camila Rojas</div>
                    <div className="text-sm text-gray-600">
                      Estudiante de Arquitectura - PUCP
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Intercambié mis maquetas del semestre pasado por materiales nuevos y un monitor. La comunidad es súper respetuosa y rápida para coordinar."
                </p>
              </div>

              <div className="flex-shrink-0 w-full md:w-96 bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    LA
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-gray-900">Luis Aguilar</div>
                    <div className="text-sm text-gray-600">
                      Estudiante de Ingeniería de Sistemas - UNI
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Cambia y Gana me permitió conseguir una laptop de respaldo
                  cambiando cursos online que ya había terminado. El proceso fue
                  transparente y seguro."
                </p>
              </div>

              <div className="flex-shrink-0 w-full md:w-96 bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    VT
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-gray-900">Valeria Torres</div>
                    <div className="text-sm text-gray-600">
                      Estudiante de Psicología - UPCH
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "En una semana logré intercambiar mis libros impresos por
                  sesiones de tutoría. La suscripción es mínima comparada con todo
                  lo que recibes."
                </p>
              </div>

              <div className="flex-shrink-0 w-full md:w-96 bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    DM
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-gray-900">Diego Montalvo</div>
                    <div className="text-sm text-gray-600">
                      Estudiante de Comunicación - ULIMA
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Me encanta la curaduria del match. Recibí alertas con matches
                  que realmente necesito. Es como un marketplace inteligente pero
                  sin gastar dinero."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="suscripcion"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-2 rounded-full">
              Membresía única para toda la experiencia Cambia y Gana
            </span>
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Suscríbete por solo S/5 al mes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sin comisiones ocultas ni costos por intercambio. Cancela cuando
              quieras y mantén tus trueques activos hasta el fin del ciclo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plan Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Todo lo que incluye
              </h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
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
                  <span className="text-gray-700">
                    Intercambios ilimitados y matches inteligentes cada semana
                  </span>
                </li>
                <li className="flex items-start">
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
                  <span className="text-gray-700">
                    Verificación de identidad y reputación visible antes de
                    aceptar un trueque
                  </span>
                </li>
                <li className="flex items-start">
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
                  <span className="text-gray-700">
                    Soporte humano 24/7 por WhatsApp y correo
                  </span>
                </li>
                <li className="flex items-start">
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
                  <span className="text-gray-700">
                    Eventos presenciales y talleres virtuales para la comunidad
                  </span>
                </li>
                <li className="flex items-start">
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
                  <span className="text-gray-700">
                    Plantillas de acuerdos y recordatorios automáticos
                  </span>
                </li>
              </ul>
              <div className="bg-black text-white p-6 rounded-xl">
                <div className="text-sm text-gray-300 mb-1">PRECIO MENSUAL</div>
                <div className="text-4xl font-bold">S/5</div>
                <Link
                  to="/register"
                  className="mt-4 block w-full bg-white text-black text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Unirme hoy
                </Link>
              </div>
            </div>

            {/* Garantía Card */}
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Garantía Cambia y Gana
              </h3>
              <p className="text-gray-600 mb-6">
                Si no concretas al menos un intercambio en tu primer mes,
                extendemos tu suscripción gratis por 30 días adicionales.
              </p>
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-start mb-4">
                  <svg
                    className="w-6 h-6 text-gray-900 mr-3 flex-shrink-0"
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
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      Beneficio extra
                    </div>
                    <div className="text-gray-600 text-sm">
                      Acceso prioritario a intercambios destacados de marcas
                      aliadas.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="preguntas" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-lg text-gray-600">
              Resolvemos tus dudas antes de dar el primer intercambio.
            </p>
          </div>

          <div className="space-y-4">
            <details className="bg-gray-50 p-6 rounded-xl">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ¿Qué puedo intercambiar en Cambia y Gana?
              </summary>
              <p className="text-gray-600 mt-3">
                Libros, dispositivos tecnológicos, licencias de software,
                mentorías, clases particulares y hasta servicios creativos.
                Mientras aporte a tu vida universitaria, es bienvenido.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-xl">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ¿Cómo se garantiza la seguridad de los trueques?
              </summary>
              <p className="text-gray-600 mt-3">
                Verificamos la identidad de cada integrante, habilitamos un chat
                protegido y registramos los acuerdos para que tengas soporte si
                surge algún inconveniente.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-xl">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ¿La suscripción de S/5 es mensual?
              </summary>
              <p className="text-gray-600 mt-3">
                Sí. Pagas S/5 al mes y accedes a intercambios ilimitados,
                soporte prioritario y eventos presenciales exclusivos para la
                comunidad.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-xl">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ¿Puedo cancelar cuando quiera?
              </summary>
              <p className="text-gray-600 mt-3">
                Claro. Puedes cancelar desde tu panel en cualquier momento.
                Mantendrás los beneficios hasta que termine el ciclo que ya
                abonaste.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-xl">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ¿Qué métodos de pago aceptan?
              </summary>
              <p className="text-gray-600 mt-3">
                Aceptamos Yape, Plin y tarjetas de crédito o débito. Puedes
                actualizar el método desde la sección de facturación cuando lo
                necesites.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Listo para canjear tu próximo recurso?
            </h2>
            <p className="text-lg text-gray-600">
              Únete a Cambia y Gana y conéctate con jóvenes que transforman su
              experiencia universitaria a través del trueque digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Formulario */}
            <div className="bg-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Cuéntanos qué quieres intercambiar
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombres
                    </label>
                    <input
                      type="text"
                      placeholder="Andrea"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      placeholder="Fernández"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo institucional
                  </label>
                  <input
                    type="email"
                    placeholder="andrea@universidad.pe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué deseas intercambiar?
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Ej. Busco cambiar mi iPad por una cámara fotográfica o tutorías de diseño gráfico."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Información de contacto */}
            <div>
              <div className="bg-white p-8 rounded-2xl mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Conecta con nuestra comunidad
                </h3>
                <p className="text-gray-600 mb-6">
                  Organiza tu primer trueque en minutos. Escríbenos o únete a
                  nuestros canales para enterarte de intercambios destacados y
                  eventos presenciales.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-gray-900">Escríbenos</div>
                      <div className="text-gray-600">hola@cambiaygana.pe</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-gray-900">
                        WhatsApp comunidad
                      </div>
                      <div className="text-gray-600">+51 999 321 654</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-gray-900">Instagram</div>
                      <div className="text-gray-600">@cambiaygana</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-gray-900">LinkedIn</div>
                      <div className="text-gray-600">Cambia y Gana</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Cambia y Gana</h3>
              <p className="text-gray-400 text-sm">
                © 2025 Cambia y Gana. Hecho en Lima para estudiantes
                latinoamericanos.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#beneficios" className="hover:text-white transition">
                    Beneficios
                  </a>
                </li>
                <li>
                  <a
                    href="#como-funciona"
                    className="hover:text-white transition"
                  >
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a
                    href="#suscripcion"
                    className="hover:text-white transition"
                  >
                    Suscripción
                  </a>
                </li>
                <li>
                  <a href="#preguntas" className="hover:text-white transition">
                    Preguntas
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="hover:text-white transition">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            Comunidad segura de trueque digital con soporte 24/7
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
