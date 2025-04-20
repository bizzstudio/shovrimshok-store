import React, { useContext, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { IoHome } from "react-icons/io5";
import { PiListMagnifyingGlassBold } from "react-icons/pi";

//internal import
import cartSuccess from "public/cart success2.svg"
import leaf from "public/leaf.svg"
import Link from "next/link";
import Layout from "@layout/Layout";
import Loading from "@component/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";
import Cookies from "js-cookie";
import useCart from "@hooks/useCart";
import scrollUp from "src/functions/scrollUp";

const Success = () => {
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { t } = useTranslation();

  const { emptyCart } = useCart();


  // ריקון העגלה
  useEffect(() => {
    scrollUp();
    Cookies.remove("couponInfo");
    sessionStorage.removeItem("products");
    emptyCart();

    return () => {
      Cookies.remove("couponInfo");
      sessionStorage.removeItem("products");
      emptyCart();
    }
  }, [])

  return (
    <>
      <Layout title="הרכישה הושלמה" description="הרכישה הושלמה בהצלחה">
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <div className='w-full mx-auto flex flex-col justify-center items-center gap-5 py-20 px-10 lg:px-0'>
            <img className="md:w-1/5 w-2/3 mr-8" src={cartSuccess.src} alt="הרכישה הושלמה בהצלחה" />
            <h1 className="text-4xl text-center font-bold">{t("common:thankYouForPurchase")}</h1>
            {/* <h3 className="text-xl font-bold text-center">{t("common:orsderInProcess")}</h3> */}
            <div className="flex items-center justify-center flex-wrap gap-3 mt-3 h-11">
              <Link className="flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap" href="/" target="_top"><IoHome /> {t("common:backToHome")}</Link>
              <Link className="flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap" href="/user/my-orders" target="_top"><PiListMagnifyingGlassBold size={20} /> {t("common:viewOrder")}</Link>
            </div>
          </div>
        )}
        <style>
          {`
          #enable-toolbar-trigger {
            display: none;
            }
            `}
        </style>
      </Layout>
    </>
  );
};

export default Success;