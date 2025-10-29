import axios from './axios';

export const getPlansRequest = () => axios.get('/plans');

export const createMembershipRequest = (membershipData) => 
    axios.post('/memberships', membershipData);

export const getActiveMembershipRequest = () => 
    axios.get('/memberships/active');

export const getMembershipHistoryRequest = () => 
    axios.get('/memberships/history');

export const cancelMembershipRequest = () => 
    axios.post('/memberships/cancel');

export const renewMembershipRequest = (paymentData) => 
    axios.post('/memberships/renew', paymentData);
