import React, { useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CardElement } from "@stripe/react-stripe-js";
import Link from "next/link";
import {
  IoReturnUpBackOutline,
  IoArrowForward,
  IoBagHandle,
  IoWalletSharp,
} from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import deliveryIcon from 'public/shippedGreen.svg'
import { ImCreditCard } from "react-icons/im";
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { LiaTruckPickupSolid } from "react-icons/lia";


//internal import
import Layout from "@layout/Layout";
import useAsync from "@hooks/useAsync";
import Label from "@component/form/Label";
import Error from "@component/form/Error";
import CartItem from "@component/cart/CartItem";
import InputArea from "@component/form/InputArea";
import useGetSetting from "@hooks/useGetSetting";
import InputShipping from "@component/form/InputShipping";
import InputPayment from "@component/form/InputPayment";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import useUtilsFunction from "@hooks/useUtilsFunction";
import SettingServices from "@services/SettingServices";
import { UserContext } from "@context/UserContext";
import Loading from "@component/preloader/Loading";
import DeliveryServices from "@services/DeliveryServices";
import MainModal from "@component/modal/MainModal";
import UserAddressUpdate from "@component/userAddressUpdate/UserAddressUpdate";
import { notifyError } from "@utils/toast";
import paymentTitle from 'public/titles/paymentTitle.svg'
import scrollUp from "src/functions/scrollUp";
import DeliveryMsgModal from "@component/modal/DeliveryMsgModal";
import PickupMsgModal from "@component/modal/PickupMsgModal";
import MissingProductsModal from "@component/modal/MissingProductsModal";
import websiteClose from 'public/websiteClose2.svg'
import Image from "next/image";
import Calculating from "@component/cart/Calculating";

const Checkout = () => {
  const {
    handleSubmit,
    submitHandler,
    handleShippingCost,
    register,
    errors,
    showCard,
    setShowCard,
    error,
    // stripe,
    couponInfo,
    couponRef,
    handleCouponCode,
    discountAmount,
    shippingCost,
    total,
    isEmpty,
    items,
    customCartTotal,
    currency,
    isCheckoutSubmit,
    isDeliveryMetod,
    paymentSrc,
    shippingPercentageIncrease,
  } = useCheckoutSubmit();
  const router = useRouter();

  const { t } = useTranslation();
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { data: storeSetting } = useAsync(SettingServices.getStoreSetting);

  const { state: { userInfo } } = useContext(UserContext);
  const city = userInfo?.address?.city?.city_name_he;
  const [isDeliverable, setIsDeliverable] = useState(null);
  const [nextTime, setNextTime] = useState(null);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deliveryMsg, setDeliveryMsg] = useState(false);
  const [pickupMsg, setPickupMsg] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(true);
  const [isNoteOpen, setIsNoteOpen] = useState(true);
  const [missingProductsModal, setMissingProductsModal] = useState(false);
  const [missingProductsState, setMissingProductsState] = useState([]);

  // בעת שחזור הזמנה הודעה על מוצרים לא זמינים
  useEffect(() => {
    const missingProducts = localStorage.getItem("missingProducts");
    if (missingProducts) {
      try {
        const missingProductsArray = JSON.parse(missingProducts);

        if (missingProductsArray.length > 0) {
          setMissingProductsModal(true);
          setMissingProductsState(missingProductsArray);
        }

        // מחיקת הנתונים מה-localStorage לאחר הצגת ההודעה
        localStorage.removeItem("missingProducts");
      } catch (error) {
        console.error("Failed to parse missing products:", error);
      }
    }
  }, []);

  // משיכת ההגדרות של המשלוחים וההזמנות ובדיקה אם זה מאופשר או לא
  useEffect(() => {
    if (storeSetting.delivery_status !== undefined) {
      setIsDeliveryOpen(storeSetting.delivery_status);
    }
    if (storeSetting.optionToOrder_status !== undefined) {
      setIsCheckoutOpen(storeSetting.optionToOrder_status);
    }
  }, [storeSetting]);

  // ללא פרטי משתמש ניווט ללוגאין
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    } else {
      if (!userInfo.address.city) {
        localStorage.setItem("firstTime", true);
        router.push("/");
      } else {
        setLoading(false);
      }
    }
  }, [userInfo]);

  // פונקציה לבדיקת כתובת
  const isAddressDeliverable = async (address) => {
    const response = await DeliveryServices.getByCityName(address);
    return response ? response : null; // יחזיר את עלות המשלוח או null אם אין משלוח לכתובת זו
  };

  // עדכון פונקציית submitHandler
  const handleSubmitWithAddressCheck = async () => {
    if (items <= 0) return notifyError(t("common:noProductsInCart"));
    if (city) {
      handleShippingCost(deliveryPrice); // עדכון עלות המשלוח
      setDeliveryMsg(true);
    } else {
      notifyError("יש להזין כתובת");
    }
  };

  const handleSubmitWithPickup = () => {
    if (items <= 0) return notifyError(t("common:noProductsInCart"));
    setPickupMsg(true)
    handleShippingCost(0);
  };

  // פונקציית בדיקה האם יש משלוח היום או מחר ואם לא מתי המשלוח הבא
  const canOrderToday = (daysArray) => {
    const now = new Date();
    const currentHour = now.getHours();
    const todayIndex = now.getDay() + 1; // תרגום ל-1 עד 7 במקום 0 עד 6
    const nextDayIndex = (todayIndex % 7) + 1; // היום הבא עם תרגום ל-1 עד 7

    let isTodayDeliverable;
    if (currentHour < 14) {
      // אם השעה היא לפני 14:00
      isTodayDeliverable = daysArray.some(day => parseInt(day.value) === todayIndex);
    } else {
      // אם השעה היא אחרי 14:00
      isTodayDeliverable = daysArray.some(day => parseInt(day.value) === nextDayIndex);
    }

    let nextDeliverableDate = null;
    if (!isTodayDeliverable) {
      // חיפוש היום הבא שבו ניתן לבצע משלוח
      for (let i = 1; i < 8; i++) {
        const futureDayIndex = ((todayIndex + i - 1) % 7) + 1; // תרגום ל-1 עד 7
        if (daysArray.some(day => Number(day.value) === futureDayIndex)) {
          nextDeliverableDate = new Date();
          nextDeliverableDate.setDate(now.getDate() + i - 1);
          nextDeliverableDate.setHours(14, 0, 0, 0); // הגדרת השעה ל-14:00
          break;
        }
      }
    }

    return { isTodayDeliverable, nextDeliverableDate };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const check = await isAddressDeliverable(city);
        const { isTodayDeliverable, nextDeliverableDate } = canOrderToday(check.days);

        if (isTodayDeliverable) {
          setIsDeliverable(true);
        } else {
          setIsDeliverable(false);
          setNextTime(nextDeliverableDate);
        }
        setDeliveryPrice(check.price);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setIsDeliverable(false);
        } else {
          alert("משהו השתבש, נסה שוב");
          console.error(error);
        }
      }
    };

    if (city) {
      fetchData();
    }
  }, [city]);

  const navToPaymentPage = () => {
    router.push(paymentSrc)
  }

  if (loading) {
    return <Loading loading={loading} />;
  }

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

  return (
    <>
      {/* modals */}
      {missingProductsModal && (
        <MainModal modalOpen={missingProductsModal} setModalOpen={setMissingProductsModal}>
          <div className="px-11 py-8">
            <MissingProductsModal missingProducts={missingProductsState} />
          </div>
        </MainModal>
      )}
      {deliveryMsg && (
        <MainModal modalOpen={deliveryMsg} setModalOpen={setDeliveryMsg}>
          <div className="px-11 py-8">
            <DeliveryMsgModal closeModal={() => setDeliveryMsg(false)} />
          </div>
        </MainModal>
      )}
      {pickupMsg && (
        <MainModal modalOpen={pickupMsg} setModalOpen={setPickupMsg}>
          <div className="px-11 py-8">
            <PickupMsgModal closeModal={() => setPickupMsg(false)} />
          </div>
        </MainModal>
      )}
      {modalOpen && (
        <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <div className="px-11 py-8 max-w-xl">
            <UserAddressUpdate />
          </div>
        </MainModal>
      )}
      <Layout title="Checkout" description="this is checkout page">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
          <div className="py-0 md:py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col items-center gap-8">
            <div className="w-full lg:w-3/4 flex h-full flex-col order-2 sm:order-1 lg:order-1">
              {isCheckoutOpen ?
                (paymentSrc ?

                  // redirect option
                  navToPaymentPage()

                  // iframe option
                  // <div className="flex flex-col gap-3 items-center justify-center">
                  //   {scrollUp()}
                  //   <iframe
                  //     src={paymentSrc}
                  //     id='cardcomiframe'
                  //     className="max-w-[800px] w-3/4 h-[550px] flex items-center justify-center"
                  //   />
                  // </div>
                  : <div className="mt-5 md:mt-0 md:col-span-2">
                    <h1 className="text-3xl font-bold text-customGreen w-full my-3 text-center bg-white border border-gray-200 p-3 rounded-md">{t("common:likutMessage")}</h1>
                    <form onSubmit={handleSubmit(submitHandler)}>
                      <div className="w-full flex flex-col 2xl:flex-row items-center pb-3 gap-3.5">
                        {/* פרטים אישיים */}
                        <div className="w-full 2xl:w-1/2 h-auto sm:h-20 bg-white px-4 py-2 flex items-center gap-1.5 border border-gray-200 rounded-md placeholder-white focus-visible:outline-none focus:outline-none">
                          <CiUser className="text-[41px] text-customGreen group-hover:text-white transition ease-in-out duration-300" />
                          <div className="flex flex-col items-start">
                            <h2 className="text-xl">{userInfo?.name}</h2>
                            {city &&
                              <p className="text-base text-gray-400 -mt-1">{city}, {userInfo?.address?.street}, {userInfo?.address?.houseNumber}{
                                userInfo?.address?.apartmentNumber ? "/" + userInfo?.address?.apartmentNumber : ''
                              }</p>
                            }
                          </div>
                          <button type="button" className="underline mr-auto" onClick={() => setModalOpen(true)}>
                            {t("common:changeAddress")}
                          </button>
                        </div>
                        {/* שיטת משלוח */}
                        <div className="w-full h-auto flex flex-col items-center gap-1.5 md:h-20 md:flex-row">
                          <div className="w-full h-full relative">
                            {isDeliverable && <span className="absolute bottom-0 md:bottom-2.5 right-14">
                              <Error errorName={errors.shippingOption} />
                            </span>}
                            <InputShipping
                              currency={currency}
                              handleShippingCost={handleSubmitWithAddressCheck}
                              register={register}
                              value="משלוח עד הבית (בתוספת תשלום)"
                              isDeliverable={isDeliverable}
                              nextTime={nextTime}
                              isDeliveryOpen={isDeliveryOpen}
                            // note="משלוחים מא’-ה’ שיתקבלו עד השעה 14:00 בלבד נשתדל לספק עד שעה 22:00 באותו היום, או ביום למחרת לכל המאוחר"
                            />
                          </div>

                          <div className="w-full h-full relative">
                            <span className="absolute bottom-0 md:bottom-2.5 right-14">
                              <Error errorName={errors.shippingOption} />
                            </span>
                            <InputShipping
                              currency={currency}
                              handleShippingCost={handleSubmitWithPickup}
                              register={register}
                              value="איסוף עצמי"
                              isDeliverable={true}
                              icon={<LiaTruckPickupSolid />}
                            />
                          </div>
                        </div>
                      </div>


                      {/* סיכום הזמנה */}
                      <div className="w-full flex flex-col h-full md:order-2 lg:order-2">
                        <div className="border p-5 lg:px-8 lg:py-8 rounded-lg bg-white order-1 sm:order-2">
                          <h2 className="font-semibold font-serif text-lg pb-4">
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout?.order_summary
                            )}
                          </h2>

                          {/* רשימת מוצרים */}
                          <div className="overflow-y-auto flex-grow scrollbar-hide w-full max-h-64 bg-gray-50 block">
                            {items.map((item) => (
                              <CartItem key={item.id} item={item} currency={currency} />
                            ))}

                            {isEmpty && (
                              <div className="text-center py-10">
                                <span className="flex justify-center my-auto text-gray-500 font-semibold text-4xl">
                                  <IoBagHandle />
                                </span>
                                <h2 className="font-medium font-serif text-sm pt-2 text-gray-600">
                                  {t("common:noItemAdded")}
                                </h2>
                              </div>
                            )}
                          </div>

                          {/* קוד קופון */}
                          <div className="flex items-center mt-4 py-4 lg:py-4 text-sm w-full font-semibold text-heading last:border-b-0 last:text-base last:pb-0">
                            {/* <form className="w-full"> */}
                            {couponInfo.couponCode ? (
                              <span className="bg-customGreen-superLight px-4 py-3 leading-tight w-full rounded-md flex justify-between">
                                {" "}
                                <p className="text-customGreen-dark">{t("common:couponApplied")} </p>{" "}
                                <span className="text-red-500 text-right">
                                  {couponInfo.couponCode}
                                </span>
                              </span>
                            ) : (
                              <div className="w-full flex flex-col sm:flex-row items-start justify-end gap-2">
                                <input
                                  ref={couponRef}
                                  type="text"
                                  placeholder={t("common:couponCode")}
                                  className="form-input py-2 px-3 md:px-4 w-full appearance-none transition ease-in-out border text-input text-sm rounded-md h-12 duration-200 bg-white border-gray-200 focus:ring-0 focus:outline-none focus:border-customGreen placeholder-gray-500 placeholder-opacity-75"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault(); // מונע את שליחת הטופס הכללי
                                      handleCouponCode(e); // מפעיל את פונקציית החלת הקופון
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={handleCouponCode}
                                  className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-gray-200 rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-customGreen h-12 text-sm lg:text-base w-full sm:w-auto"
                                >
                                  {showingTranslateValue(
                                    storeCustomizationSetting?.checkout?.apply_button
                                  )}
                                </button>
                              </div>
                            )}
                            {/* </form> */}
                          </div>

                          {/* עלות ההזמנה */}
                          <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0 gap-1.5">
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout?.sub_total
                            )}
                            <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
                              {typeof customCartTotal === 'number' ?
                                <>
                                  <small>{currency}</small>
                                  {customCartTotal.toFixed(2)}
                                </>
                                : <Calculating />}
                            </span>
                          </div>

                          {/* מחיר משלוח */}
                          <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0 gap-1.5">
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout?.shipping_cost
                            )}
                            <span className="flex-shrink-0 text-gray-800 font-bold">
                              {currency}
                              {shippingCost?.toFixed(2)}
                            </span>
                            <span className="ml-auto flex-shrink-0 text-customGreen font-bold">
                              {typeof customCartTotal === 'number' && <>({shippingPercentageIncrease?.toFixed(2)}%)</>}
                            </span>
                          </div>

                          {/* הנחה */}
                          <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0 gap-1.5">
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout?.discount
                            )}
                            <span className="ml-auto flex-shrink-0 font-bold text-orange-400">
                              {currency}
                              {discountAmount?.toFixed(2)}
                            </span>
                          </div>

                          {/* סה"כ */}
                          <div className="border-t mt-4">
                            <div className="flex items-center font-bold font-serif justify-between pt-5 text-sm uppercase">
                              {showingTranslateValue(
                                storeCustomizationSetting?.checkout?.total_cost
                              )}
                              <span className="font-serif font-extrabold text-lg">
                                {typeof customCartTotal === 'number' ?
                                  <>
                                    {currency}
                                    {parseFloat(total).toFixed(2)}
                                  </>
                                  : <Calculating />}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* הערות לקוח להזמנה */}
                      <div className="w-full flex flex-col h-full md:order-2 lg:order-2 my-3">
                        <div className="border px-5 lg:px-8 py-3 rounded-lg bg-white order-1 sm:order-2">
                          <div className={`flex justify-between items-center`}
                            onClick={() => setIsNoteOpen(!isNoteOpen)}>
                            <h2 className="font-semibold font-serif text-lg">
                              {t("common:customerNote")}
                            </h2>
                            <button type="button" className="text-customGreen">
                              <MdKeyboardArrowDown size={30} className={`transform ${isNoteOpen ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          <div className={`overflow-hidden duration-500 ease-in-out ${isNoteOpen ? 'max-h-96 p-1 pt-3' : 'max-h-0'}`}>
                            <textarea
                              rows={4}
                              maxLength={800}
                              className="textareaCheckout w-full border border-gray-200 rounded-md px-4 py-3 text-sm font-sans focus-visible:outline-none focus:outline-none "
                              placeholder={t("common:typeHere")}
                              {...register("customer_note")}
                            />
                          </div>
                        </div>
                      </div>

                      {/* כפתורי אישור וחזרה */}
                      <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
                        <div className="col-span-6 sm:col-span-3">
                          <Link
                            href="/"
                            className={currentLang ? "bg-customBrown-light border border-indigo-100 rounded py-3 text-center text-sm font-medium text-gray-700 hover:text-gray-800 hover:border-gray-300 transition-all flex justify-center gap-2 font-serif w-full" : "bg-customBrown-light border border-indigo-100 rounded py-3 text-center text-sm font-medium text-gray-700 hover:text-gray-800 hover:border-gray-300 transition-all flex flex-row-reverse justify-center gap-2 font-serif w-full"}
                          >
                            <span className="text-xl">
                              <IoReturnUpBackOutline
                                className={currentLang ? "transform scale-x-[-1]" : ""}
                              />
                            </span>
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout?.continue_button
                            )}
                          </Link>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <button
                            onClick={() => isDeliveryMetod ? {} : (notifyError(t("common:selectDeliveryMethod")), scrollUp())}
                            type="submit"
                            disabled={isEmpty || isCheckoutSubmit || typeof customCartTotal !== 'number'}
                            className="bg-customGreen hover:bg-customGreen-dark border border-customGreen transition-all rounded py-3 text-center text-sm font-serif font-medium text-white flex justify-center w-full"
                          >
                            {typeof customCartTotal !== 'number' ? (
                              <Calculating />
                            ) : isCheckoutSubmit ? (
                              <span className="flex flex-row-reverse justify-center text-center">
                                {" "}
                                <img
                                  src="/loader/spinner.gif"
                                  alt="Loading"
                                  width={20}
                                  height={10}
                                />{" "}
                                <span className="ml-2">
                                  {t("common:processing")}
                                </span>
                              </span>
                            ) : (
                              <span className={currentLang ? "flex justify-center gap-2 text-center" : "flex flex-row-reverse justify-center gap-2 text-center"}>
                                {showingTranslateValue(
                                  storeCustomizationSetting?.checkout
                                    ?.confirm_button
                                )}
                                <span className="text-xl">
                                  {" "}
                                  <IoArrowForward
                                    className={currentLang ? "transform scale-x-[-1]" : ""}
                                  />
                                </span>
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="mx-auto my-11 flex flex-col items-center justify-center gap-2 p-5">
                    <Image
                      src={websiteClose.src}
                      width={440}
                      height={440}
                      alt="websiteClose"
                    />
                    <h2 className="text-4xl font-bold mt-5 text-center">{t("common:storeClose")}</h2>
                    <p className="text-gray-400 text-center">{t("common:storeCloseMessage")}</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default dynamic(() => Promise.resolve(Checkout), { ssr: false });