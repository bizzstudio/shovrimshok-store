import React, { useContext, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { IoHome } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";

//internal import
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
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout>
          <div className='w-full lg:w-3/5 mx-auto flex flex-col justify-center items-center gap-5 py-20 px-10 lg:px-0'>
            <img className="sm:w-1/4 w-2/3" src={failedImg.src} alt="הרכישה נכשלה" />
            <h1 className="text-4xl text-center font-bold">{t("common:purchaseFailed")}</h1>
            <p className="text-gray-400 text-lg">{t("common:orderFaildText")}</p>
            <div className="flex items-center gap-3 mt-3 h-10">
              <Link className="flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap" href="/"><IoHome /> {t("common:backToHome")}</Link>
              <Link className="flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap" href="/checkout"><LuShoppingCart size={19} /> {t("common:tryAgain")}</Link>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export default Failed;