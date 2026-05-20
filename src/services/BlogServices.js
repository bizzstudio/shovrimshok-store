// shovrimshok-store/src/services/BlogServices.js
import requests from "./httpServices";

const BlogServices = {
  // רשימת מאמרים פורסמים, עם פג'ינציה וסינון לפי קטגוריה/תגית
  getPublishedBlogs: async ({ page = 1, limit = 10, category, tag } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (category) params.append("category", category);
    if (tag) params.append("tag", tag);
    return requests.get(`/blog/published?${params.toString()}`);
  },

  // מאמר בודד לפי slug
  getPublishedBlogBySlug: async (slug) => {
    return requests.get(`/blog/published/${slug}`);
  },

  // רשימת קטגוריות מאמרים פורסמים
  getBlogCategories: async () => {
    return requests.get(`/blog/categories`);
  },

  // רשימת תגיות מאמרים פורסמים
  getBlogTags: async () => {
    return requests.get(`/blog/tags`);
  },
};

export default BlogServices;
