// src/hooks/useFilter.js
import { UserContext } from "@context/UserContext";
import getCustomPrice from "@utils/getCustomPrice";
import { useRouter } from "next/router";
import { useContext, useMemo, useState } from "react";
import useGetSetting from "./useGetSetting";

const useFilter = (data) => {
  const [pending, setPending] = useState([]);
  const [Processing, setProcessing] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [sortedField, setSortedField] = useState("Popular");
  const router = useRouter();

  const { state: { userInfo } } = useContext(UserContext);
  const { storeSetting } = useGetSetting();

  // console.log("sortedfield", sortedField, data);

  const productData = useMemo(() => {
    let services = data;
    //filter user order
    if (router.pathname === "/user/dashboard") {
      const orderPending = services?.filter(
        (statusP) => statusP.status === "Pending"
      );
      setPending(orderPending);

      const orderProcessing = services?.filter(
        (statusO) => statusO.status === "Processing"
      );
      setProcessing(orderProcessing);

      const orderDelivered = services?.filter(
        (statusD) => statusD.status === "Delivered"
      );
      setDelivered(orderDelivered);
    }

    //service sorting with low and high price
    if (sortedField === "Low") {
      services = services?.sort((a, b) => {
        const customPriceA = getCustomPrice(a, userInfo, storeSetting);
        const customPriceB = getCustomPrice(b, userInfo, storeSetting);

        // קבלת המחיר הנכון - אם יש מחיר מיוחד, אחרת המחיר הרגיל
        const priceA = customPriceA.specialPrice || customPriceA.price || 0;
        const priceB = customPriceB.specialPrice || customPriceB.price || 0;

        return priceA - priceB;
      });
    }
    if (sortedField === "High") {
      services = services?.sort((a, b) => {
        const customPriceA = getCustomPrice(a, userInfo, storeSetting);
        const customPriceB = getCustomPrice(b, userInfo, storeSetting);

        // קבלת המחיר הנכון - אם יש מחיר מיוחד, אחרת המחיר הרגיל
        const priceA = customPriceA.specialPrice || customPriceA.price || 0;
        const priceB = customPriceB.specialPrice || customPriceB.price || 0;

        return priceB - priceA;
      });
    }

    // מיון לפי פופולריות (itemLocation)
    if (sortedField === "Popular") {
      services = services?.sort((a, b) => {
        // אם אין מספר מיקום לשניהם, מיין לפי א-ב
        if (!a.itemLocation && !b.itemLocation) {
          const nameA = String(a.ItemName || a.title || '').toLowerCase();
          const nameB = String(b.ItemName || b.title || '').toLowerCase();
          return nameA.localeCompare(nameB, 'he');
        }
        // אם אין מספר מיקום לאחד מהם, הוא יהיה אחרון
        if (!a.itemLocation) return 1;
        if (!b.itemLocation) return -1;
        // אם יש מספר מיקום לשניהם, מיין לפי המספר
        return a.itemLocation - b.itemLocation;
      });
    }

    // מיון לפי א-ב (אלפביתי)
    if (sortedField === "Alphabetical") {
      services = services?.sort((a, b) => {
        const nameA = String(a.ItemName || a.title || '').toLowerCase();
        const nameB = String(b.ItemName || b.title || '').toLowerCase();
        return nameA.localeCompare(nameB, 'he');
      });
    }

    return services;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedField, data, userInfo, storeSetting]);

  return {
    productData,
    pending,
    Processing,
    delivered,
    sortedField,
    setSortedField,
  };
};

export default useFilter;
