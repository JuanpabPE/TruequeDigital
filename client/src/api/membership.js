import axios from "./axios";

export const getPlansRequest = () => axios.get("/plans");

export const createMembershipRequest = (membershipData) =>
  axios.post("/memberships", membershipData);

export const getActiveMembershipRequest = () =>
  axios.get("/memberships/active");

export const getMembershipHistoryRequest = () =>
  axios.get("/memberships/history");

export const cancelMembershipRequest = () => axios.post("/memberships/cancel");

export const renewMembershipRequest = (paymentData) =>
  axios.post("/memberships/renew", paymentData);

export const uploadPaymentProofRequest = (membershipId, file) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("membershipId", membershipId);
  return axios.post("/memberships/upload-proof", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
