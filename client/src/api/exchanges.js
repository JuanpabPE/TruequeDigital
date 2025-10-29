import axios from "./axios.js";

// Crear nuevo trueque
export const createExchangeRequest = (exchangeData) =>
  axios.post("/exchanges", exchangeData);

// Obtener todos los trueques con filtros opcionales
export const getExchangesRequest = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append("category", filters.category);
  if (filters.condition) params.append("condition", filters.condition);
  if (filters.isVirtual !== undefined) params.append("isVirtual", filters.isVirtual);
  if (filters.search) params.append("search", filters.search);
  if (filters.minValue) params.append("minValue", filters.minValue);
  if (filters.maxValue) params.append("maxValue", filters.maxValue);
  if (filters.location) params.append("location", filters.location);
  
  const queryString = params.toString();
  return axios.get(`/exchanges${queryString ? `?${queryString}` : ""}`);
};

// Obtener un trueque por ID
export const getExchangeByIdRequest = (id) =>
  axios.get(`/exchanges/${id}`);

// Obtener mis trueques
export const getMyExchangesRequest = () =>
  axios.get("/my-exchanges");

// Actualizar trueque
export const updateExchangeRequest = (id, exchangeData) =>
  axios.put(`/exchanges/${id}`, exchangeData);

// Eliminar trueque
export const deleteExchangeRequest = (id) =>
  axios.delete(`/exchanges/${id}`);

// Cambiar estado de trueque
export const updateExchangeStatusRequest = (id, status) =>
  axios.patch(`/exchanges/${id}/status`, { status });
