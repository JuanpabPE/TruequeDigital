import { createContext, useContext, useState } from "react";
import {
  getPlansRequest,
  createMembershipRequest,
  getActiveMembershipRequest,
  getMembershipHistoryRequest,
  cancelMembershipRequest,
  renewMembershipRequest,
} from "../api/membership";

const MembershipContext = createContext();

export const useMembership = () => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error("useMembership must be used within a MembershipProvider");
  }
  return context;
};

export const MembershipProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);
  const [activeMembership, setActiveMembership] = useState(null);
  const [membershipHistory, setMembershipHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPlans = async () => {
    try {
      setLoading(true);
      const res = await getPlansRequest();
      setPlans(res.data);
      return res.data;
    } catch (error) {
      setError(error.response?.data?.message || "Error al cargar planes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createMembership = async (membershipData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await createMembershipRequest(membershipData);
      setActiveMembership(res.data);
      return res.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al crear membresía";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getActiveMembership = async () => {
    try {
      setLoading(true);
      const res = await getActiveMembershipRequest();
      setActiveMembership(res.data);
      return res.data;
    } catch (error) {
      if (error.response?.status === 404) {
        setActiveMembership(null);
      } else {
        setError(error.response?.data?.message || "Error al cargar membresía");
      }
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMembershipHistory = async () => {
    try {
      setLoading(true);
      const res = await getMembershipHistoryRequest();
      setMembershipHistory(res.data);
      return res.data;
    } catch (error) {
      setError(error.response?.data?.message || "Error al cargar historial");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelMembership = async () => {
    try {
      setLoading(true);
      const res = await cancelMembershipRequest();
      setActiveMembership(null);
      return res.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al cancelar membresía";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renewMembership = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await renewMembershipRequest(paymentData);
      setActiveMembership(res.data);
      return res.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al renovar membresía";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <MembershipContext.Provider
      value={{
        plans,
        activeMembership,
        membershipHistory,
        loading,
        error,
        getPlans,
        createMembership,
        getActiveMembership,
        getMembershipHistory,
        cancelMembership,
        renewMembership,
        clearError,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};
