// Cart.js
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
// import { useCart } from "react-use-cart";
import { IoBagCheckOutline, IoClose, IoBagHandle } from "react-icons/io5";
import useTranslation from "next-translate/useTranslation";

// Internal import
import CartItem from "@component/cart/CartItem";
import LoginModal from "@component/modal/LoginModal";
import { UserContext } from "@context/UserContext";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useCart from "@hooks/useCart";
import { FiInfo } from "react-icons/fi";
import Calculating from "./Calculating";

const Cart = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { isEmpty, items, customCartTotal } = useCart();
  const { toggleCartDrawer, closeCartDrawer } = useContext(SidebarContext);
  const { currency } = useUtilsFunction();
  const { t } = useTranslation();
  const buttonRef = useRef(null);
  
  const {
    state: { userInfo },
  } = useContext(UserContext);

  const handleOpenLogin = () => {
    router.push(
      { pathname: router.pathname, query: { redirect: '/checkout' } },
      router.asPath,
      { shallow: true }
    );
    toggleCartDrawer();
    setModalOpen(!modalOpen);
  };


  const handleCheckoutClick = (e) => {
    e.stopPropagation(); // Prevent event propagation
    closeCartDrawer(); // Call the closeCartDrawer function
    if (!userInfo) {
      handleOpenLogin(); // Handle login if user is not logged in
    } else {
      if (!userInfo?.address?.city) {
        localStorage.setItem("firstTime", true);
      } else {
        router.push("/checkout"); // Redirect to checkout page
      }
    }
  };

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      buttonRef.current.classList.add('bg-customRed-dark');
    }
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.classList.remove('bg-customRed-dark');
    }
  };

  const checkoutClass = (
    <button
      ref={buttonRef}
      className="w-full py-3 px-3 rounded-lg bg-customRed-dark flex items-center justify-between bg-heading text-sm sm:text-base text-white focus:outline-none transition duration-300 cursor-auto"
    >
      <span className="font-medium font-serif text-xl flex flex-col justify-start items-start">
        <span>
          {typeof customCartTotal === 'number' ?
            <>
              <small>{currency}</small>
              {customCartTotal.toFixed(2)}
            </>
            : <Calculating />}
        </span>
        {/* <FiInfo title={t("common:additonalLikut")} className="cursor-pointer mb-0.5"/> */}
        <small className="text-sm">{t("common:additonalLikut")}</small>
      </span>
      <span
        onClick={handleCheckoutClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="rounded-lg font-bold font-serif py-2 px-3 bg-white text-customRed-dark cursor-pointer"
      >
        {t("common:proceedToCheckoutBtn")}
      </span>
    </button>
  );

  return (
    <>
      {modalOpen && (
        <LoginModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
      <div className="flex flex-col w-full h-full justify-between items-middle bg-white rounded">
        <div className="w-full flex justify-between items-center relative px-5 py-4 border-b bg-customBrown-light border-gray-100">
          <h2 className="font-semibold font-serif text-lg m-0 text-heading flex items-center gap-1 justify-center">
            <span className="text-xl mr-2 mb-1">
              <IoBagCheckOutline />
            </span>
            {t("common:shoppingCartDrawerTitle")}
          </h2>
          <button
            onClick={closeCartDrawer}
            className="flex text-base items-center justify-center text-gray-500 p-2 focus:outline-none transition-opacity hover:text-red-400 group"
          >
            <IoClose />
            <span className="font-sens text-sm text-gray-500 ml-1 group-hover:text-red-400 pb-0.5">
              {t("common:closeBtn")}
            </span>
          </button>
        </div>
        <div className="overflow-y-auto flex-grow scrollbar-hide w-full max-h-full">
          {isEmpty && (
            <div className="flex flex-col h-full justify-center">
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center w-20 h-20 rounded-full bg-customBrown-light">
                  <span className="text-customRed-dark text-4xl block">
                    <IoBagHandle />
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-gray-700 text-lg pt-5">
                  {t("common:cartEmptyTitle")}
                </h3>
                <p className="px-12 text-center text-sm text-gray-500 pt-2">
                  {t("common:cartEmptyText")}
                </p>
              </div>
            </div>
          )}

          {items.map((item, i) => (
            <CartItem key={i + 1} item={item} currency={currency} />
          ))}
        </div>
        <div className="mx-5 my-3">
          {items.length <= 0 ? (
            checkoutClass
          ) : (
            <span>
              {!userInfo ? (
                <div onClick={handleOpenLogin}>{checkoutClass}</div>
              ) : (
                // <Link href="/checkout">{
                checkoutClass
                // }</Link>
              )}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
