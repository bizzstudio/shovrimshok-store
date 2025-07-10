// src/pages/invoice/[id].js
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { IoPrintOutline } from "react-icons/io5";
import useTranslation from "next-translate/useTranslation";
import ReactToPrint from "react-to-print";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { FaPrint } from "react-icons/fa6";
import Link from "next/link";

// Internal import
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import Invoice from "@component/invoice/Invoice";
import { UserContext } from "@context/UserContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useAsync from "@hooks/useAsync";
import notFoundImg from 'public/notFoundDocImg.svg'
import MainBT from "@component/button/MainBT";
import CustomerServices from "@services/CustomerServices";
import { TbArrowBackUp } from "react-icons/tb";

const InvoicePage = ({ params }) => {
  const { t } = useTranslation();
  const printRef = useRef();
  const invoiceId = params.id;
  const router = useRouter();

  const {
    state: { userInfo },
  } = useContext(UserContext);
  const { showingTranslateValue, getNumberTwo, currency } = useUtilsFunction();
  const { storeCustomizationSetting, globalSetting } = useGetSetting();

  const { data, loading, error } = useAsync(() => CustomerServices.getDocumentById(invoiceId, "Invoices"));
  console.log('invoice data :>> ', data);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
  }, []);

  let currentLang = Cookies.get('_lang');

  switch (currentLang) {
    case 'he':
      currentLang = true;
      break;
    case 'en':
      currentLang = false;
      break;
    default:
      currentLang = false;
      break;
  };

  // קומפוננטת סקלטון לחשבונית
  const InvoiceSkeleton = () => (
    <div className="bg-white rounded-md shadow-sm">
      {/* כותרת ומידע עליון */}
      <div className="bg-white p-4 rounded-t-md">
        <div className="flex flex-row justify-between items-start pb-2 border-b border-gray-200">
          <div>
            <Skeleton height={18} width={80} className="mb-2" />
            <div className="flex items-center gap-1 mb-1">
              <Skeleton height={12} width={40} />
              <Skeleton height={12} width={30} />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton height={12} width={35} />
              <Skeleton height={12} width={80} />
            </div>
          </div>
          <div className="text-right">
            <Skeleton height={20} width={120} className="mb-2" />
            <Skeleton height={12} width={100} className="mb-1" />
            <Skeleton height={12} width={120} className="mb-1" />
            <Skeleton height={12} width={140} />
          </div>
        </div>

        {/* פרטי חשבונית */}
        <div className="flex flex-row justify-between pt-2">
          <div className="flex flex-col">
            <Skeleton height={12} width={70} className="mb-1" />
            <Skeleton height={12} width={80} />
          </div>
          <div className="flex flex-col">
            <Skeleton height={12} width={50} className="mb-1" />
            <Skeleton height={12} width={60} />
          </div>
          <div className="flex flex-col text-right">
            <Skeleton height={12} width={60} />
            <Skeleton height={12} width={100} />
          </div>
        </div>
      </div>

      {/* טבלת מוצרים עם מחירים */}
      <div className="px-6 mb-7">
        <div className="-my-1 overflow-x-auto">
          <table className="table-auto min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-xs bg-gray-100">
                <th className="font-serif font-semibold px-2 py-1 text-center">
                  <Skeleton height={12} width={25} />
                </th>
                <th className="font-serif font-semibold px-2 py-1 text-start">
                  <Skeleton height={12} width={80} />
                </th>
                <th className="font-serif font-semibold px-2 py-1 text-center">
                  <Skeleton height={12} width={40} />
                </th>
                <th className="font-serif font-semibold px-2 py-1 text-center">
                  <Skeleton height={12} width={60} />
                </th>
                <th className="font-serif font-semibold px-2 py-1 text-center">
                  <Skeleton height={12} width={50} />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {[...Array(3)].map((_, index) => (
                <tr key={index}>
                  <th className="px-6 py-1 text-center">
                    <Skeleton height={14} width={15} />
                  </th>
                  <td className="px-2 py-1 text-start">
                    <Skeleton height={14} width={200} />
                  </td>
                  <td className="px-6 py-1 text-center">
                    <Skeleton height={14} width={20} />
                  </td>
                  <td className="px-6 py-1 text-center">
                    <Skeleton height={14} width={60} />
                  </td>
                  <td className="px-6 py-1 text-center">
                    <Skeleton height={14} width={70} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* סיכום תשלום */}
      <div className="bg-mainColor-light border-t border-b border-gray-200 p-4">
        <div className="flex flex-col space-y-3 pt-2">
          <div className="flex flex-row justify-between items-center">
            <Skeleton height={12} width={80} />
            <Skeleton height={12} width={70} />
          </div>
          <div className="flex flex-row justify-between items-center">
            <Skeleton height={12} width={60} />
            <Skeleton height={12} width={60} />
          </div>
          <div className="flex flex-row justify-between items-center border-t border-gray-300 pt-2">
            <Skeleton height={14} width={70} />
            <Skeleton height={16} width={90} />
          </div>
        </div>
      </div>

      {/* כפתור הדפסה */}
      <div className="bg-white p-8 rounded-b-xl">
        <div className="flex lg:flex-row-reverse md:flex-row-reverse sm:flex-row-reverse flex-col justify-between invoice-btn">
          <Skeleton height={40} width={100} />
        </div>
      </div>
    </div>
  );

  console.log('error :>> ', error);

  // קומפוננטת שגיאה
  const ErrorDisplay = () => (
    <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
      <div className="bg-white rounded-md shadow-sm p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={notFoundImg}
            alt={t("common:invoiceNotFound")}
            width={270}
            height={270}
            className="mb-6 select-none"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("common:invoiceNotFound")}
          </h2>
          <p className="text-gray-600 mb-6">
            {error?.response?.data?.message?.[currentLang] || "אירעה שגיאה בטעינת החשבונית"}
          </p>
          <Link href="/user/my-orders">
            <MainBT>
              {t("common:backToHome")}
            </MainBT>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title={t("common:invoiceDetails")} description={t("common:invoiceDetailsDescription")}>
      <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
        {loading ? (
          <InvoiceSkeleton />
        ) : error ? (
          <ErrorDisplay />
        ) : (
          <div className="bg-white rounded-md shadow-sm">
            <Invoice
              printRef={printRef}
              data={data}
              globalSetting={globalSetting}
              currency={currency}
              docType="invoice"
            />
            <div className="bg-white p-8 rounded-b-xl">
              <div className="flex lg:flex-row-reverse md:flex-row-reverse sm:flex-row-reverse flex-col justify-between invoice-btn">
                <ReactToPrint
                  trigger={() => (
                    <MainBT>
                      <span className={`${currentLang ? "flex-row-reverse" : ""} flex items-center justify-center gap-2`}>
                        {showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.print_button
                        )}
                        <FaPrint size={16} />
                      </span>
                    </MainBT>
                  )}
                  content={() => printRef.current}
                  documentTitle={`Invoice-${data?.DocNum}`}
                  pageStyle="@media print { body { direction: rtl; } }"
                />
                <Link
                  href="/user/my-orders"
                >
                  <MainBT>
                    <span className={`${currentLang ? "flex-row-reverse" : ""} flex items-center justify-center gap-2`}>
                      {t("common:backToOrders")}
                      <TbArrowBackUp className={`${currentLang ? "scale-x-[-1]" : ""}`} size={20} />
                    </span>
                  </MainBT>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = ({ params }) => {
  return { props: { params } };
};

export default dynamic(() => Promise.resolve(InvoicePage), { ssr: false });
