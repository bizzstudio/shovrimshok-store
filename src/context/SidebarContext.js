// SidebarContext.js
import CategoryServices from "@services/CategoryServices";
import OfferServices from "@services/OfferServices";
import React, { useState, useMemo, createContext, useEffect } from "react";
// import useNotification from "@hooks/useNotification";

// create context
export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [offers, setOffers] = useState([]); // משתנה לשמירת המבצעים
  const [categories, setCategories] = useState([]); // משתנה לשמירת הקטגוריות

  // שליפת המבצעים פעם אחת כשאתר נטען
  const fetchOffers = async () => {
    try {
      const res = await OfferServices.getAllOffers();
      setOffers(res || []);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await CategoryServices.getShowingCategory();
      setCategories(res || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchCategories();
  }, []);

  // פונקציה לריענון
  const refreshOffers = async () => {
    await fetchOffers();
  };

  // const { socket } = useNotification();

  const toggleCartDrawer = () => setCartDrawerOpen(!cartDrawerOpen);
  const closeCartDrawer = () => setCartDrawerOpen(false);

  const toggleCategoryDrawer = () => setCategoryDrawerOpen(!categoryDrawerOpen);
  const closeCategoryDrawer = () => setCategoryDrawerOpen(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(false);

  const handleChangePage = (p) => {
    setCurrentPage(p);
  };

  const value = useMemo(
    () => ({
      cartDrawerOpen,
      toggleCartDrawer,
      closeCartDrawer,
      setCartDrawerOpen,
      categoryDrawerOpen,
      toggleCategoryDrawer,
      closeCategoryDrawer,
      isModalOpen,
      toggleModal,
      closeModal,
      currentPage,
      setCurrentPage,
      handleChangePage,
      isLoading,
      setIsLoading,
      offers,
      refreshOffers,
      categories,
    }),

    [cartDrawerOpen, categoryDrawerOpen, isModalOpen, currentPage, isLoading, offers, categories]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
