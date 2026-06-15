// src/component/checkout/CheckoutActions.jsx
import React from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { IoReturnUpBackOutline, IoCardOutline, IoReceiptOutline } from "react-icons/io5";
import useTranslation from "next-translate/useTranslation";

import MainBT from "@component/button/MainBT";
import Calculating from "@component/cart/Calculating";

// תשלום באשראי (כרטיס) מופעל. להגדיר ל-false כדי לכבות ולהותיר רק הזמנה בהקפה.
const CARD_PAYMENT_ENABLED = true;

const CheckoutActions = ({
  isEmpty,
  isCheckoutSubmit,
  customCartTotal,
  storeCustomizationSetting,
  showingTranslateValue,
  userInfo,
  submitCreditOrder,
  handleSubmit,
  total,
  isDeliveryMetod,
  notifyError,
  scrollUp,
}) => {
  const { t } = useTranslation();

  let currentLang = Cookies.get("_lang");
  switch (currentLang) {
    case "he":
      currentLang = true;
      break;
    case "en":
      currentLang = false;
      break;
    default:
      currentLang = false;
      break;
  }

  // הצגת כפתור "הזמנה בהקפה": רק ללקוחות שאינם casual ושיש להם מסגרת זמינה מעל סכום ההזמנה
  const showCreditOrderButton =
    CARD_PAYMENT_ENABLED &&
    userInfo &&
    userInfo.customerType !== "casual" &&
    typeof userInfo.availableCredit === "number" &&
    userInfo.availableCredit > total;

  const isDisabled = isEmpty || isCheckoutSubmit || typeof customCartTotal !== "number";
  const isLoading = isCheckoutSubmit;
  const onlyCreditOrder = !CARD_PAYMENT_ENABLED;

  const handleCardClick = () => {
    if (!isDeliveryMetod) {
      if (typeof notifyError === "function") {
        notifyError(t("common:selectDeliveryMethod"));
      }
      if (typeof scrollUp === "function") scrollUp();
    }
  };

  return (
    <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
      {/* כפתור חזרה לחנות */}
      <div className="col-span-6 sm:col-span-3">
        <Link
          href="/"
          className={
            currentLang
              ? "bg-customBrown-light border border-indigo-100 rounded-lg py-3 text-center text-sm font-medium text-gray-700 hover:text-gray-800 hover:border-gray-300 transition-all flex justify-center gap-2 font-serif w-full"
              : "bg-customBrown-light border border-indigo-100 rounded-lg py-3 text-center text-sm font-medium text-gray-700 hover:text-gray-800 hover:border-gray-300 transition-all flex flex-row-reverse justify-center gap-2 font-serif w-full"
          }
        >
          <span className="text-xl">
            <IoReturnUpBackOutline className={currentLang ? "transform scale-x-[-1]" : ""} />
          </span>
          {showingTranslateValue(storeCustomizationSetting?.checkout?.continue_button)}
        </Link>
      </div>

      {/* כפתורי תשלום */}
      <div className={`col-span-6 sm:col-span-3 flex flex-col gap-3 ${showCreditOrderButton ? "" : ""}`}>
        {/* תשלום בכרטיס אשראי (סליקה) */}
        {CARD_PAYMENT_ENABLED && (
          <MainBT
            onClick={handleCardClick}
            type="submit"
            disabled={isDisabled}
            className={`w-full h-full ${isLoading ? "!bg-customRed !text-white" : ""}`}
          >
            {typeof customCartTotal !== "number" ? (
              <Calculating />
            ) : isLoading ? (
              <>
                <img
                  src="/loader/spinner.gif"
                  alt="Loading"
                  width={20}
                  height={10}
                  className="saturate-0"
                />
                <span className="ms-0.5">{t("common:processing")}</span>
              </>
            ) : (
              <span
                className={
                  currentLang
                    ? "flex justify-center items-center gap-2 text-center"
                    : "flex flex-row-reverse justify-center items-center gap-2 text-center"
                }
              >
                <IoCardOutline className="text-xl" />
                {t("common:payNow")}
              </span>
            )}
          </MainBT>
        )}

        {/* הזמנה בהקפה (ללקוחות עסקיים/מוסדיים עם מסגרת אשראי) */}
        {(onlyCreditOrder || showCreditOrderButton) && (
          <MainBT
            type="button"
            onClick={handleSubmit(submitCreditOrder)}
            disabled={isDisabled}
            className="w-full h-full"
          >
            {typeof customCartTotal !== "number" ? (
              <Calculating />
            ) : isLoading ? (
              <>
                <img
                  src="/loader/spinner.gif"
                  alt="Loading"
                  width={20}
                  height={10}
                  className="saturate-0"
                />
                <span className="ms-0.5">{t("common:processing")}</span>
              </>
            ) : (
              <span
                className={
                  currentLang
                    ? "flex justify-center items-center gap-2 text-center"
                    : "flex flex-row-reverse justify-center items-center gap-2 text-center"
                }
              >
                <IoReceiptOutline className="text-xl" />
                {t("common:createCreditOrder")}
              </span>
            )}
          </MainBT>
        )}
      </div>
    </div>
  );
};

export default CheckoutActions;
