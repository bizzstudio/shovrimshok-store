// shapira-store/src/services/ProductServices.js
import requests from "./httpServices";

const ProductServices = {

  getShowingProducts: async () => {
    return requests.get("/products/show");
  },

  // getShowingStoreProducts: async ({ category = "", title = "", slug = "", sku = "" }) => {
  //   // resolve the issue with URLs that include non-English letters.
  //   let newSlug = slug.toLowerCase().replace(/[()]+/g, "").replace(/\s+/g, "-");
  //   const encodedSlug = encodeURIComponent(newSlug);
  //   // Replace '[' and '\' with '' - משום מה זה גורם לקריסה, צריך לבדוק מה הלוז
  //   const cleanTitle = title.replace(/[\[\\]/g, "");
  //   const encodedTitle = encodeURIComponent(cleanTitle);
  //   const encodedCategory = encodeURIComponent(category);

  //   // console.log({ encodedSlug })

  //   return requests.get(
  //     `/products/store?category=${encodedCategory}&title=${encodedTitle}&slug=${encodedSlug}&sku=${sku}`
  //   );
  // },

  // פונקציה חדשה/מעודכנת שמכינה query string
  getShowingStoreProducts: async ({
    category = "",
    subcategories = "",
    page = 1,
    limit = 36, // ברירת מחדל
    title = "",
    itemCode = "",
  }) => {
    let queryString = `?page=${page}&limit=${limit}`;

    if (category) queryString += `&category=${encodeURIComponent(category)}`;

    if (subcategories) {
      // אם זה array או string בודד
      const subArr = Array.isArray(subcategories)
        ? subcategories
        : [subcategories];
      // מחברים בפורמט sub1,sub2,sub3
      queryString += `&subcategories=${subArr.join(",")}`;
    }

    if (title) queryString += `&title=${encodeURIComponent(title)}`;

    if (itemCode) queryString += `&itemCode=${encodeURIComponent(itemCode)}`;

    // עכשיו קוראים ל-API
    return requests.get(`/products/store${queryString}`);
  },

  getProductsByTitle: async ({ title, page = 1, limit = 36 }) => {
    let queryString = `?page=${page}&limit=${limit}`;
    if (title) queryString += `&title=${encodeURIComponent(title)}`;
    return requests.get(`/products/search${queryString}`);
  },

  getDiscountedProducts: async () => {
    return requests.get("/products/discount");
  },

  getProductBySlug: async (slug) => {
    const encodedSlug = encodeURIComponent(slug);
    return requests.get(`/products/product/${encodedSlug}`);
  },

  // משיכת מוצרים פופולריים
  getPopularProducts: async () => {
    return requests.get("/products/popular-products");
  },

  // משיכת מוצרים שנרכשו
  getPurchasedProducts: async ({ page = 1, limit = 36 }) => {
    let queryString = `?page=${page}&limit=${limit}`;
    return requests.get(`/products/purchased-products${queryString}`);
  },
};

export default ProductServices;
