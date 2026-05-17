// shapira-store/src/services/CategoryServices.js
import requests from "./httpServices";

const CategoryServices = {
  getShowingCategory: async () => {
    return requests.get("/category");
  },

  getCategoryById: async (id) => {
    return requests.get(`/category/${id}`);
  },
};

export default CategoryServices;