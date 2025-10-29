import { createContext, useContext, useState } from "react";
import {
  createExchangeRequest,
  getExchangesRequest,
  getExchangeByIdRequest,
  getMyExchangesRequest,
  updateExchangeRequest,
  deleteExchangeRequest,
  updateExchangeStatusRequest,
} from "../api/exchanges.js";

const ExchangesContext = createContext();

export const useExchanges = () => {
  const context = useContext(ExchangesContext);
  if (!context) {
    throw new Error("useExchanges must be used within an ExchangesProvider");
  }
  return context;
};

export const ExchangesProvider = ({ children }) => {
  const [exchanges, setExchanges] = useState([]);
  const [myExchanges, setMyExchanges] = useState([]);
  const [currentExchange, setCurrentExchange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Crear nuevo trueque
  const createExchange = async (exchangeData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await createExchangeRequest(exchangeData);
      setMyExchanges([res.data, ...myExchanges]);
      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error al crear el trueque";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener todos los trueques
  const getExchanges = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getExchangesRequest(filters);
      // Asegurarse de que la respuesta es un array
      const data = Array.isArray(res.data) ? res.data : [];
      setExchanges(data);
      return data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error al obtener trueques";
      setError(errorMsg);
      setExchanges([]); // Establecer array vacío en caso de error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener un trueque por ID
  const getExchangeById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getExchangeByIdRequest(id);
      setCurrentExchange(res.data);
      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error al obtener el trueque";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener mis trueques
  const getMyExchanges = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyExchangesRequest();
      // Asegurarse de que la respuesta es un array
      const data = Array.isArray(res.data) ? res.data : [];
      setMyExchanges(data);
      return data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error al obtener mis trueques";
      setError(errorMsg);
      console.error("Error al cargar mis exchanges:", err);
      setMyExchanges([]); // Establecer array vacío en caso de error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar trueque
  const updateExchange = async (id, exchangeData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await updateExchangeRequest(id, exchangeData);

      // Actualizar en la lista de mis trueques
      setMyExchanges(myExchanges.map((ex) => (ex._id === id ? res.data : ex)));

      // Actualizar en la lista general si existe
      setExchanges(exchanges.map((ex) => (ex._id === id ? res.data : ex)));

      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error al actualizar el trueque";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar trueque
  const deleteExchange = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteExchangeRequest(id);

      // Eliminar de la lista de mis trueques
      setMyExchanges(myExchanges.filter((ex) => ex._id !== id));

      // Eliminar de la lista general
      setExchanges(exchanges.filter((ex) => ex._id !== id));

      return true;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error al eliminar el trueque";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de trueque
  const updateExchangeStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      const res = await updateExchangeStatusRequest(id, status);

      // Actualizar en la lista de mis trueques
      setMyExchanges(myExchanges.map((ex) => (ex._id === id ? res.data : ex)));

      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error al actualizar el estado";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    exchanges,
    myExchanges,
    currentExchange,
    loading,
    error,
    createExchange,
    getExchanges,
    getExchangeById,
    getMyExchanges,
    updateExchange,
    deleteExchange,
    updateExchangeStatus,
    setError,
  };

  return (
    <ExchangesContext.Provider value={value}>
      {children}
    </ExchangesContext.Provider>
  );
};
