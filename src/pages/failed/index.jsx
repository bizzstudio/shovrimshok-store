// src/pages/failed/index.jsx
import React, { useContext, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { IoHome } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import MainBT from "@component/button/MainBT";

// Internal import
import failedImg from "public/failedImg2.svg"
import Link from "next/link";
import Layout from "@layout/Layout";
import Loading from "@component/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";

const Failed = () => {
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { t } = useTranslation();

  return (
    <>
      <Layout title="הרכישה נכשלה" description="הרכישה נכשלה, יש לנסות שוב">
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <div className='w-full mx-auto flex flex-col justify-center items-center gap-5 py-20 px-10 lg:px-0'>
            <img className="md:w-1/5 w-2/3" src={failedImg.src} alt="הרכישה נכשלה" />
            <h1 className="text-4xl text-center font-bold">{t("common:purchaseFailed")}</h1>
            <p className="text-gray-400 text-lg text-center">{t("common:orderFaildText")}</p>
            <div className="flex items-center justify-center flex-wrap gap-3 mt-3 h-11">
              <Link href="/" target="_top">
                <MainBT>
                  <span className="flex items-center gap-2">
                    <IoHome /> {t("common:backToHome")}
                  </span>
                </MainBT>
              </Link>
              <Link href="/checkout" target="_top">
                <MainBT>
                  <span className="flex items-center gap-2">
                    <LuShoppingCart size={19} /> {t("common:tryAgain")}
                  </span>
                </MainBT>
              </Link>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Failed;