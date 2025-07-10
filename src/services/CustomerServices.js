// shapira-store/src/services/CustomerServices.js
import requests from "./httpServices";

const CustomerServices = {
  customerLogin: async (body) => {
    return requests.post("/customer/login", body);
  },

  verifyEmailAddress: async (body) => {
    return requests.post("/customer/verify-email", body);
  },

  registerCustomer: async (token, body) => {
    return requests.post(`/customer/register/${token}`, body);
  },

  signUpWithProvider(token, body) {
    return requests.post(`/customer/signup/${token}`, body);
  },

  forgetPassword: async (body) => {
    return requests.put("/customer/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/customer/reset-password", body);
  },

  changePassword: async (body) => {
    return requests.post("/customer/change-password", body);
  },

  updateCustomer: async (id, body) => {
    return requests.put(`/customer/${id}`, body);
  },

  getCustomerDocuments: async () => {
    return requests.get("/customer/documents");
  },

  getDocumentById: async (id, type) => {
    return requests.get(`/customer/document/${id}?type=${type}`);
  },

  sendContactUsMessage: async (body) => {
    return requests.post("/customer/contact-us", body);
  },
};

export default CustomerServices;
