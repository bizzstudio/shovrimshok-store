import dayjs from "dayjs";
import React from "react";
import Link from "next/link";
import Image from "next/image";
// Internal import
import OrderTable from "@component/order/OrderTable";
import useUtilsFunction from "@hooks/useUtilsFunction";
import newLogo from "public/newlogo.svg"
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import 'dayjs/locale/he'; // ייבוא תאריכים בעברית
import useGetSetting from "@hooks/useGetSetting";

const Invoice = ({ data, printRef, globalSetting, currency }) => {
  // console.log('invoice data',data)
  const { storeCustomizationSetting } = useGetSetting();

  const { getNumberTwo } = useUtilsFunction();
  const { t } = useTranslation();

  let currentLang = Cookies.get('_lang');

  switch (currentLang) {
    case 'he':
      dayjs.locale('he'); // הגדרת השפה לעברית
      break;
    case 'en':
      dayjs.locale('en'); // הגדרת השפה לאנגלית
      break;
    default:
      dayjs.locale('en'); // הגדרת ברירת מחדל לאנגלית
      break;
  };

  return (
    <div ref={printRef} className="print:bg-white print:p-0 print:shadow-none">
      <div className="bg-white p-4 rounded-t-md print:rounded-none print:p-2 print:border-none">
        <div className="flex flex-row justify-between items-start pb-2 border-b border-gray-200 print:pb-1 print:mb-2 print:border-b print:border-gray-300">
          <div>
            <h1 className="font-bold font-serif text-base uppercase print:text-sm">{t("common:order")}</h1>
            <h6 className="text-gray-700 text-xs print:text-xs">
              <b>{t("common:DocStatus")}: </b>
              <span className={data?.DocStatus === "O" ? "text-green-600" : "text-red-500"}>
                {data?.DocStatus === "O" ? t("common:open") : t("common:close")}
              </span>
            </h6>
            {/* הערות הלקוח להזמנה */}
            {data?.Comments && (
              <div>
                <h6 className="text-gray-700 text-xs print:text-xs"><b>{t("common:notes")}: </b>{data?.Comments}</h6>
              </div>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-base font-serif font-semibold mt-0 print:text-xs">
              <Image
                width={120}
                height={20}
                src={storeCustomizationSetting?.footer?.block4_logo}
                alt="logo"
                className="print:mx-0"
              />
            </h2>
            <span className="text-xs text-gray-500 print:text-xs">
              {globalSetting?.address} <br />
              {globalSetting?.contact} <br />
              <span>{globalSetting?.email}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-between pt-2 print:pt-1">
          <div className="flex flex-col">
            <span className="font-bold font-serif text-xs uppercase text-gray-600 block">
              {t("common:CreateDate")}
            </span>
            <span className="text-xs text-gray-500 block">
              {data?.CreateDate && dayjs(data?.CreateDate).format("DD/MM/YYYY")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold font-serif text-xs uppercase text-gray-600 block">
              {t("common:DocNum")}
            </span>
            <span className="text-xs text-gray-500 block">
              #{data?.DocNum}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-bold font-serif text-xs uppercase text-gray-600 block">
              {t("common:orderTo")}
            </span>
            <span className="text-xs text-gray-500 block min-w-[120px]">
              {data?.CardName}<br />
              {data?.Address}
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 mb-7 print:my-2 print:px-0">
        <div className="-my-1 overflow-x-auto">
          <table className="table-auto min-w-full border border-gray-200 divide-y divide-gray-200 print:text-xs">
            <thead className="bg-gray-50 print:bg-white">
              <tr className="text-xs bg-gray-100 print:bg-white">
                <th className="font-serif font-semibold px-2 py-1 text-gray-700 uppercase tracking-wider text-center print:px-1 print:py-0.5">
                  {t("common:sr")}
                </th>
                <th className="font-serif font-semibold px-2 py-1 text-gray-700 uppercase tracking-wider text-start print:px-1 print:py-0.5">
                  {t("common:productName")}
                </th>
                <th className="font-serif font-semibold px-2 py-1 text-gray-700 uppercase tracking-wider text-center print:px-1 print:py-0.5">
                  {t("common:quantity")}
                </th>
                <th className="font-serif font-semibold px-2 py-1 text-gray-700 uppercase tracking-wider text-center print:px-1 print:py-0.5">
                  {t("common:itemPrice")}
                </th>
                <th className="font-serif font-semibold px-2 py-1 text-gray-700 uppercase tracking-wider text-right print:px-1 print:py-0.5">
                  {t("common:amount")}
                </th>
              </tr>
            </thead>
            <OrderTable data={data} currency={currency} compact />
          </table>
        </div>
      </div>
      {/* סיכום תשלום */}
      <div className="bg-red-100 border-t border-b border-gray-200 p-4 print:p-2 print:border-t print:border-b print:border-gray-300">
        <div className="flex flex-row justify-between pt-2 print:pt-1 gap-2">
          <div className="flex flex-col">
            <span className="mb-0.5 font-bold font-serif text-xs uppercase text-gray-600 block">
              {t("common:VatSum")}
            </span>
            <span className="text-xs text-gray-500 font-semibold font-serif block">
              {getNumberTwo(data?.VatSum)}
              {" "}
              {currency}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="mb-0.5 font-bold font-serif text-xs uppercase text-gray-600 block">
              {t("common:DocTotal")}
            </span>
            <span className="text-base font-serif font-bold text-red-500 block print:text-xs">
              {getNumberTwo(data?.DocTotal)}
              {" "}
              {currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;