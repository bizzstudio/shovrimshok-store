// src/pages/success/index.jsx
import React, { useContext, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { IoHome } from "react-icons/io5";
import { PiListMagnifyingGlassBold } from "react-icons/pi";
import { useRouter } from "next/router";

// Internal import
import cartSuccess from "public/cart success2.svg"
import leaf from "public/leaf.svg"
import Link from "next/link";
import Layout from "@layout/Layout";
import Loading from "@component/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";
import Cookies from "js-cookie";
import useCart from "@hooks/useCart";
import scrollUp from "src/functions/scrollUp";
import MainBT from "@component/button/MainBT";

const Success = () => {
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { t } = useTranslation();
  const router = useRouter();
  const { orderNumber } = router.query;

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
            <h3 className="text-xl font-bold text-center">
              {orderNumber
                ? t("common:orsderInProcess").replace("{orderNumber}", orderNumber)
                : t("common:orsderInProcess")
              }
            </h3>
            <div className="flex items-center justify-center flex-wrap gap-3 mt-3 h-11">
              <Link href="/"
              //  target="_top"
              >
                <MainBT>
                  <span className="flex items-center gap-2">
                    <IoHome /> {t("common:backToHome")}
                  </span>
                </MainBT>
              </Link>
              <Link href="/user/my-orders"
              //  target="_top"
              >
                <MainBT>
                  <span className="flex items-center gap-2">
                    <PiListMagnifyingGlassBold size={20} /> {t("common:viewOrder")}
                  </span>
                </MainBT>
              </Link>
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