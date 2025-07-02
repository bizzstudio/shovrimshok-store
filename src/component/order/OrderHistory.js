// avrahami-store/src/component/order/OrderHistory.js
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import 'dayjs/locale/he'; // ייבוא תאריכים בעברית

// פונקציה לקבלת צבע הסטטוס
export const getStatusColor = (status) => {
  if (!status || status === "null" || status === null || status === undefined) {
    return "text-gray-500"; // צבע ברירת מחדל למקף
  }

  const normalizedStatus = status.trim();

  switch (normalizedStatus) {
    case "bost_Open":
    case "O":
      return "text-orange-600 bg-orange-100"; // כתום - פתוחה
    case "bost_Close":
    case "C":
      return "text-green-600 bg-green-100"; // ירוק - סגורה
    case "bost_Paid":
    case "P":
      return "text-yellow-600 bg-yellow-100"; // צהוב - שולמה
    case "bost_Delivered":
    case "D":
      return "text-blue-600 bg-blue-100"; // כחול - נמסרה
    default:
      return "text-gray-600 bg-gray-100"; // אפור לסטטוסים לא מוכרים
  }
};

// פונקציה לקבלת טקסט הסטטוס המתורגם
export const getStatusText = (status, t) => {
  if (!status || status === "null" || status === null || status === undefined) {
    return "-";
  }

  const normalizedStatus = status.trim();

  switch (normalizedStatus) {
    case "bost_Open":
    case "O":
      return t("common:open");
    case "bost_Close":
    case "C":
      return t("common:close");
    case "bost_Paid":
    case "P":
      return t("common:paid");
    case "bost_Delivered":
    case "D":
      return t("common:delivered");
    default:
      return normalizedStatus;
  }
};

// פונקציה לבדיקה אם להציג מחיר
export const shouldShowPrice = (status) => {
  if (!status || status === "null" || status === null || status === undefined) {
    return false;
  }
  
  const normalizedStatus = status.trim();
  return normalizedStatus === "bost_Close" || normalizedStatus === "C" ||
         normalizedStatus === "bost_Paid" || normalizedStatus === "P" ||
         normalizedStatus === "bost_Delivered" || normalizedStatus === "D";
};

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
        <span className="text-sm">
          {shouldShowPrice(order.DocumentStatus) 
            ? `${(order.DocTotal - order.VatSum || 0)?.toFixed(2)} ${order.DocCurrency || "₪"}`
            : "-"
          }
        </span>
      </td>
      <td className="px-1 md:px-5 py-3 leading-6 text-center md:whitespace-nowrap font-medium text-sm max-md:w-min">
        {shouldShowPrice(order.DocumentStatus) 
          ? `${order.VatSum?.toFixed(2)} ${order.DocCurrency || "₪"}`
          : "-"
        }
      </td>
      <td className="px-1 md:px-5 py-3 leading-6 text-center whitespace-nowrap md:block hidden">
        <span className="text-sm">
          {shouldShowPrice(order.DocumentStatus) 
            ? `${order.DocTotal?.toFixed(2)} ${order.DocCurrency || "₪"}`
            : "-"
          }
        </span>
      </td>
      <td title={getStatusText(order.DocumentStatus, t)} className={`text-sm max-w-[10vw] overflow-hidden truncate px-1 md:px-5 py-3 leading-6 text-center whitespace-nowrap`}>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.DocumentStatus)}`}>
          {getStatusText(order.DocumentStatus, t)}
        </span>
      </td>
    </>
  );
};

export default OrderHistory;