// shapira-store/src/component/order/OrderHistory.js
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import 'dayjs/locale/he'; // ייבוא תאריכים בעברית

const OrderHistory = ({ order, currency }) => {
  const { t } = useTranslation();
  const [dateFormat, setDateFormat] = useState("D/MM/YYYY"); // פורמט ברירת מחדל

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
  }

  // שינוי פורמט הזמן בהתאם לגודל המסך
  useEffect(() => {
    const updateDateFormat = () => {
      if (window.innerWidth <= 768) {
        setDateFormat("D/MM/YY"); // פורמט לשנה בשתי ספרות למסכים קטנים
      } else {
        setDateFormat("D/MM/YYYY"); // פורמט רגיל למסכים גדולים
      }
    };

    updateDateFormat(); // קריאה ראשונית בעת הטעינה
    window.addEventListener("resize", updateDateFormat); // האזנה לשינוי גודל מסך

    return () => {
      window.removeEventListener("resize", updateDateFormat);
    };
  }, []);

  // פונקציה להציג מקף במקום ערכים חסרים
  const displayValue = (value) => {
    if (value === null || value === undefined || value === "null") {
      return "-";
    }
    return value;
  };

  // עיצוב תאריך
  const formatDate = (value) => {
    return value ? dayjs(value).format(dateFormat) : "-";
  };

  return (
    <>
      <td className="px-1 md:px-5 py-3 leading-6 whitespace-nowrap justify-center md:flex hidden">
        <span className="uppercase text-sm font-medium">
          {displayValue(order.DocNum)}
        </span>
      </td>
      <td className="px-1 md:px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm">
          {formatDate(order.CreateDate)}
        </span>
      </td>
      <td className="px-1 md:px-5 py-3 leading-6 text-center whitespace-nowrap md:block hidden">
        <span className="text-sm">{order.DocTotal?.toFixed(2)} {order.DocCur || ""}</span>
      </td>
      <td className="px-1 md:px-5 py-3 leading-6 text-center md:whitespace-nowrap font-medium text-sm max-md:w-min">
        {order.VatSum?.toFixed(2)} {order.DocCur || ""}
      </td>
      <td className={`${order.DocStatus === "O" ? "text-green-500" : "text-red-500"} text-sm max-w-[10vw] overflow-hidden truncate px-1 md:px-5 py-3 leading-6 text-center whitespace-nowrap`}>
        {order.DocStatus === "O" ? t("common:open") : t("common:close")}
      </td>
    </>
  );
};

export default OrderHistory;