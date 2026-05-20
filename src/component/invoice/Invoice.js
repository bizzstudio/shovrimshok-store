import dayjs from "dayjs";
import React from "react";
import Link from "next/link";
import Image from "next/image";

// Internal import
import OrderTable from "@component/order/OrderTable";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import 'dayjs/locale/he'; // ייבוא תאריכים בעברית
import useGetSetting from "@hooks/useGetSetting";
import { getStatusColor, getStatusText, shouldShowPrice } from "@component/order/OrderHistory";

// פונקציה לעיבוד הערות הלקוח וחילוץ שיטת איסוף
const processComments = (comments) => {
  if (!comments) {
    return { cleanedComments: null, deliveryMethod: null };
  }

  // חיפוש המשפט האחרון שמתחיל ב"שיטת איסוף:"
  const lines = comments.trim().split('\n');
  const lastLine = lines[lines.length - 1].trim();

  let deliveryMethod = null;
  let cleanedComments = comments;

  if (lastLine.includes('שיטת איסוף:')) {
    // מחיקת השורה האחרונה
    cleanedComments = lines.slice(0, -1).join('\n').trim();

    // קביעת שיטת האיסוף
    if (lastLine.includes('איסוף עצמי')) {
      deliveryMethod = 'pickup';
    } else if (lastLine.includes('משלוח')) {
      deliveryMethod = 'shipping';
    }
  }

  return {
    cleanedComments: cleanedComments || null,
    deliveryMethod
  };
};

const Invoice = ({ data, printRef, globalSetting, currency, docType = "order" }) => {
  // console.log('invoice data',data)
  const { storeCustomizationSetting } = useGetSetting();

  const { getNumberTwo, showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  const invoiceMessageFirst = showingTranslateValue(
    storeCustomizationSetting?.dashboard?.invoice_message_first
  );
  const invoiceMessageLast = showingTranslateValue(
    storeCustomizationSetting?.dashboard?.invoice_message_last
  );

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

  // עיבוד הערות הלקוח
  const { cleanedComments, deliveryMethod } = processComments(data?.Comments);

  // קביעת טיטול המסמך
  const getDocumentTitle = () => {
    switch (docType) {
      case "invoice":
        return t("common:invoice");
      case "creditNote":
        return t("common:creditNote");
      case "delivery":
        return t("common:delivery");
      default:
        return t("common:order");
    }
  };

  // פונקציה לקבלת טקסט סטטוס מתאים לסוג המסמך
  const getDocumentStatusText = () => {
    if (docType === "order") {
      return getStatusText(data?.DocumentStatus, t);
    }
    
    // עבור מסמכים אחרים - תרגום של bost_Open/bost_Close
    switch (data?.DocumentStatus) {
      case "bost_Open":
        return t("common:unpaid");
      case "bost_Close":
        return t("common:paid");
      default:
        return getStatusText(data?.DocumentStatus, t);
    }
  };

  // האם להציג מחירים - פשוט: לא בהזמנות, כן בכל השאר
  const showPrices = docType !== "order";

  return (
    <div ref={printRef} className="print:bg-white print:p-0 print:shadow-none">
      <div className="bg-white p-4 rounded-t-md print:rounded-none print:p-2 print:border-none">
        <div className="flex flex-row justify-between items-start pb-2 border-b border-gray-200 print:pb-1 print:mb-2 print:border-b print:border-gray-300">
          <div>
            <h1 className="font-bold font-serif text-base uppercase print:text-sm">{getDocumentTitle()}</h1>
            <h6 className="text-gray-700 text-xs print:text-xs mb-1">
              <b>{t("common:DocStatus")}: </b>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data?.DocumentStatus)}`}>
                {getDocumentStatusText()}
              </span>
            </h6>
            {/* הערות הלקוח להזמנה - מנוקות משיטת איסוף */}
            {cleanedComments && (
              <div>
                <h6 className="text-gray-700 text-xs print:text-xs">
                  <b>{t("common:notes")}: </b>{cleanedComments}
                </h6>
              </div>
            )}

            {/* אפשרויות הזמנה - מבוסס על הערות הלקוח */}
            {deliveryMethod && (
              <h6 className="text-gray-700 text-xs print:text-xs">
                <b>{t("common:orderOptions")}: </b>
                {
                  deliveryMethod === 'shipping' ? t("common:shipping") :
                    deliveryMethod === 'pickup' ? t("common:pickup") :
                      "-"
                }
              </h6>
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
        {invoiceMessageFirst && (
          <div className="text-xs text-gray-600 mt-3 px-1 print:mt-2 print:text-xs whitespace-pre-line">
            {invoiceMessageFirst}
          </div>
        )}
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
                {showPrices && (
                  <>
                    <th className="font-serif font-semibold px-2 py-1 text-gray-700 uppercase tracking-wider text-center print:px-1 print:py-0.5">
                      {t("common:itemPrice")}
                    </th>
                    <th className="font-serif font-semibold px-2 py-1 text-gray-700 uppercase tracking-wider text-center print:px-1 print:py-0.5">
                      {t("common:amount")}
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <OrderTable data={data} currency={currency} showPrices={showPrices} />
          </table>
        </div>
      </div>
      {/* סיכום תשלום - רק אם יש מחירים */}
      {showPrices && (
        <div className="bg-mainColor-light border-t border-b border-gray-200 p-4 print:p-2 print:border-t print:border-b print:border-gray-300">
          <div className="flex flex-col space-y-3 pt-2 print:pt-1">
            <div className="flex flex-row justify-between items-center">
              <span className="font-bold font-serif text-xs uppercase text-gray-600">
                {t("common:costsBeforeVAT")}
              </span>
              <span className="text-xs text-gray-500 font-semibold font-serif">
                {getNumberTwo(data?.DocTotal - data?.VatSum)} {currency}
              </span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span className="font-bold font-serif text-xs uppercase text-gray-600">
                {t("common:VatSum")}
              </span>
              <span className="text-xs text-gray-500 font-semibold font-serif">
                {getNumberTwo(data?.VatSum)} {currency}
              </span>
            </div>
            <div className="flex flex-row justify-between items-center border-t border-gray-300 pt-2">
              <span className="font-bold font-serif text-sm uppercase text-gray-700">
                {t("common:DocTotal")}
              </span>
              <span className="text-base font-serif font-bold text-mainColor print:text-xs">
                {getNumberTwo(data?.DocTotal)} {currency}
              </span>
            </div>
          </div>
        </div>
      )}
      {invoiceMessageLast && (
        <div className="bg-white px-4 py-3 text-xs text-gray-600 text-center print:px-2 print:py-2 whitespace-pre-line">
          {invoiceMessageLast}
        </div>
      )}
    </div>
  );
};

export default Invoice;