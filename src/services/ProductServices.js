// shapira-store/src/services/ProductServices.js
import requests from "./httpServices";

const ProductServices = {
  // מוצרי החנות לדף הבית / קטגוריה / חיפוש / לפי slug
  getShowingStoreProducts: async ({
    category = "",
    title = "",
    slug = "",
    sku = "",
    token = "",
  } = {}) => {
    const cleanSlug = slug
      ? slug.toLowerCase().replace(/[()]+/g, "").replace(/\s+/g, "-")
      : "";
    const encodedSlug = encodeURIComponent(cleanSlug);
    const cleanTitle = (title || "").replace(/[\[\\]/g, "");
    const encodedTitle = encodeURIComponent(cleanTitle);
    const encodedCategory = encodeURIComponent(category || "");

    const config = token
      ? { headers: { authorization: `Bearer ${token}` } }
      : undefined;

    return requests.get(
      `/products/store?category=${encodedCategory}&title=${encodedTitle}&slug=${encodedSlug}&sku=${sku}`,
      config
    );
  },

  // חיפוש לפי כותרת — כעת ב-/products/store?title=...
  getProductsByTitle: async ({ title, page = 1, limit = 36 } = {}) => {
    const encodedTitle = encodeURIComponent(title || "");
    return requests.get(
      `/products/store?title=${encodedTitle}&page=${page}&limit=${limit}`
    );
  },

  // מוצר בודד לפי slug — דף מוצר
  getProductBySlug: async (slug) => {
    const encodedSlug = encodeURIComponent(slug);
    return requests.get(`/products/product/${encodedSlug}`);
  },

  // מוצרים פופולריים — נשלף מתוך תגובת /store (שדה popularProducts)
  getPopularProducts: async ({ token = "" } = {}) => {
    const config = token
      ? { headers: { authorization: `Bearer ${token}` } }
      : undefined;
    const data = await requests.get(`/products/store`, config);
    return {
      products: data?.popularProducts || [],
      totalDoc: (data?.popularProducts || []).length,
    };
  },

  // היסטוריית רכישות לקוח — היה תלוי SAP. כרגע ריק (יתממש כשנמגרר הזמנות)
  getPurchasedProducts: async () => {
    return { products: [], totalDoc: 0, limits: 0, pages: 1 };
  },
};

export default ProductServices;
