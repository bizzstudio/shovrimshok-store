import React from "react";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import 'dayjs/locale/he'; // ייבוא תאריכים בעברית

const OrderHistory = ({ order, currency }) => {

  const { t } = useTranslation();

  const getStatus = (status) => {
    if (order.status === "Delivered")
      return <span className="text-customGreen">{t(`common:${order.status}`)}</span>

    else if (order.status === "Pending")
      return <span className="text-customRed">{t(`common:${order.status}`)}</span>

    else if (order.status === "Cancel")
      return <span className="text-red-500">{t(`common:${order.status}`)}</span>
    else if (order.status === "Processing")
      return <span className="text-customBrown-light0">{t(`common:${order.status}`)}</span>
    else
      return <span className=" text-customGreen">{t(`common:${order.status}`)}</span>
  }
  // console.log("order: ", order);

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

  return (
    <>
      <td className="px-5 py-3 leading-6 whitespace-nowrap flex justify-center">
        <span className="uppercase text-sm font-medium">
          {order?._id?.substring(20, 24)}
        </span>
      </td>
      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm">
          {dayjs(order.createdAt).format("MMMM D, YYYY")}
        </span>
      </td>

      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm">{t(`common:${order.paymentMethod}`)}</span>
      </td>
      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap font-medium text-sm">
        {getStatus(order.status)}
      </td>
      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm font-bold">
          {currency}
          {parseFloat(order?.total).toFixed(2)} ₪
        </span>
      </td>
    </>
  );
};

export default OrderHistory;
