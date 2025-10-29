import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useExchanges } from "../context/ExchangesContext";

const CATEGORIES = [
  "Todos",
  "Electrónica",
  "Libros",
  "Ropa",
  "Deportes",
  "Música",
  "Arte",
  "Hogar",
  "Videojuegos",
  "Accesorios",
  "Servicios",
  "Otro",
];

function ExchangesListPage() {
  const { exchanges, getExchanges, loading } = useExchanges();
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    isVirtual: "",
  });

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async (customFilters = {}) => {
    const filterData = { ...filters, ...customFilters };
    const cleanFilters = {};
    
    if (filterData.category && filterData.category !== "Todos") {
      cleanFilters.category = filterData.category;
    }
    if (filterData.search) {
      cleanFilters.search = filterData.search;
    }
    if (filterData.isVirtual !== "") {
      cleanFilters.isVirtual = filterData.isVirtual;
    }
    
    await getExchanges(cleanFilters);
  };

  const handleCategoryChange = (category) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    loadExchanges(newFilters);
  };

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setFilters({ ...filters, search });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadExchanges();
  };

  const handleVirtualFilter = (value) => {
    const newFilters = { ...filters, isVirtual: value };
    setFilters(newFilters);
    loadExchanges(newFilters);
  };

  const getConditionLabel = (condition) => {
    const labels = {
      new: "Nuevo",
      "like-new": "Como nuevo",
      good: "Buen estado",
      fair: "Estado regular",
      poor: "Necesita reparación",
    };
    return labels[condition] || condition;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Trueques Disponibles
          </h1>
          <p className="text-gray-600">
            Explora los trueques publicados por la comunidad
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Buscar por título, descripción o categoría..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
              >
                🔍 Buscar
              </button>
            </div>
          </form>

          {/* Category Pills */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Categorías</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat === "Todos" ? "" : cat)}
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    (filters.category === cat || (cat === "Todos" && !filters.category))
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Virtual Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tipo de trueque</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleVirtualFilter("")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filters.isVirtual === ""
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => handleVirtualFilter("false")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filters.isVirtual === "false"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📍 Presencial
              </button>
              <button
                onClick={() => handleVirtualFilter("true")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filters.isVirtual === "true"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                💻 Virtual
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : exchanges.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No se encontraron trueques
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta cambiar los filtros o ser el primero en publicar
            </p>
            <Link
              to="/create-exchange"
              className="inline-block px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
            >
              Publicar Trueque
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exchanges.map((exchange) => (
              <Link
                key={exchange._id}
                to={`/exchanges/${exchange._id}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-emerald-400 to-teal-400 relative overflow-hidden">
                  {exchange.images && exchange.images.length > 0 ? (
                    <img
                      src={exchange.images[0]}
                      alt={exchange.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                      📦
                    </div>
                  )}
                  
                  {/* Virtual Badge */}
                  {exchange.isVirtual && (
                    <div className="absolute top-3 right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      💻 Virtual
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition">
                    {exchange.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {exchange.description}
                  </p>

                  {/* Offering */}
                  <div className="mb-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-emerald-700">
                        🎁 Ofrece:
                      </span>
                      <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded">
                        {exchange.offering.category}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {getConditionLabel(exchange.offering.condition)} • S/ {exchange.offering.estimatedValue}
                    </div>
                  </div>

                  {/* Seeking */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-blue-700">
                        🔍 Busca:
                      </span>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        {exchange.seeking.category}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {exchange.user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {exchange.user.username}
                        </div>
                        {exchange.user.averageRating > 0 && (
                          <div className="text-xs text-yellow-600">
                            ⭐ {exchange.user.averageRating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!exchange.isVirtual && (
                      <div className="text-xs text-gray-500">
                        📍 {exchange.location}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExchangesListPage;
