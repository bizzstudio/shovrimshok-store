import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import 'dayjs/locale/he'; // ייבוא תאריכים בעברית
import StatusService from "@services/StatusService";

const OrderHistory = ({ order, currency }) => {

  const { t } = useTranslation();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (order.status === "Delivered")
        setStatus(<span className="text-customGreen">{t(`common:${order.status}`)}</span>);
      else if (order.status === "Pending" || order.status === "Cancel" || order.status === "Processing" || order.status === "processing")
        setStatus(<span className="text-red-500">{t(`common:${order.status}`)}</span>);
      else {
        const phone = (await StatusService.getStatusByName(order.status)).phone || {};
        setStatus(<span className="text-red-500">{order.status}{phone ? ' - ' + phone : ''}</span>);
      }
    };

    fetchStatus();
  }, [order.status, t]);
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
        {status}
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
