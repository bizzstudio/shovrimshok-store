import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CardElement, useElements } from "@stripe/react-stripe-js";

//internal import
import useAsync from "@hooks/useAsync";
import { UserContext } from "@context/UserContext";
import OrderServices from "@services/OrderServices";
import CouponServices from "@services/CouponServices";
import { notifyError, notifySuccess } from "@utils/toast";
import SettingServices from "@services/SettingServices";
import NotificationServices from "@services/NotificaitonServices";
import useTranslation from "next-translate/useTranslation";
import useCart from "./useCart";

const useCheckoutSubmit = () => {
  const {
    state: { userInfo, shippingAddress },
    dispatch,
  } = useContext(UserContext);
  const { t } = useTranslation();

  const [error, setError] = useState("");
  const [total, setTotal] = useState("");
  const [couponInfo, setCouponInfo] = useState({});
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [isDeliveryMetod, setIsDeliveryMetod] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState({});
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [paymentSrc, setPaymentSrc] = useState(null);
  const [isPaymentPageOpen, setIsPaymentPageOpen] = useState(false);
  const [shippingPercentageIncrease, setShippingPercentageIncrease] = useState(0);

  const router = useRouter();
  // const stripe = useStripe();
  // const elements = useElements();
  const couponRef = useRef("");
  const { isEmpty, emptyCart, items, customCartTotal } = useCart();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
  const currency = globalSetting?.default_currency || "₪";

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
  }

  useEffect(() => {
    if (Cookies.get("couponInfo")) {
      const coupon = JSON.parse(Cookies.get("couponInfo"));
      // console.log('coupon information',coupon)
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountType);
      setMinimumAmount(coupon.minimumAmount);
    }
  }, [isCouponApplied]);

  //remove coupon if total value less then minimum amount of coupon
  useEffect(() => {
    if (minimumAmount - discountAmount > total || isEmpty) {
      setDiscountPercentage(0);
      setDiscountAmount(0);
      setCouponInfo({});
      Cookies.remove("couponInfo");
    }
  }, [minimumAmount, total]);

  // remove coupon if discount amount is greater than total value
  useEffect(() => {
    if (discountAmount >= customCartTotal && discountPercentage?.type === "fixed") {
      setDiscountPercentage(0); // מאפסים את ההנחה
      setDiscountAmount(0); // מאפסים את סכום ההנחה
      setCouponInfo({});
      Cookies.remove("couponInfo"); // מסירים את המידע על הקופון מ-Cookies
      dispatch({ type: "SAVE_COUPON", payload: {} }); // מסירים את המידע על הקופון מ-Context

      notifyError(t("common:couponRemovedDueToHighDiscount"));
    }
  }, [customCartTotal, discountAmount]);

  // calculate total and discount value
  useEffect(() => {
    let totalValue = "";
    let subTotal = parseFloat(customCartTotal + Number(shippingCost)).toFixed(2);
    const discountAmount = discountPercentage?.type === "fixed" ?
      discountPercentage?.value : customCartTotal * (discountPercentage?.value / 100);

    const discountAmountTotal = discountAmount ? discountAmount : 0;

    totalValue = Number(subTotal) - discountAmountTotal;

    setDiscountAmount(discountAmountTotal);

    setTotal(totalValue);
  }, [customCartTotal, shippingCost, discountPercentage]);

  // if not login then push user to home page
  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }

    setValue("firstName", shippingAddress.firstName);
    setValue("lastName", shippingAddress.lastName);
    setValue("address", shippingAddress.address);
    setValue("contact", shippingAddress.contact);
    setValue("email", shippingAddress.email);
    setValue("city", shippingAddress.city);
    setValue("country", shippingAddress.country);
    setValue("zipCode", shippingAddress.zipCode);
  }, []);

  const submitHandler = async (data) => {
    try {
      dispatch({ type: "SAVE_SHIPPING_ADDRESS", payload: data });
      Cookies.set("shippingAddress", JSON.stringify(data));
      setIsCheckoutSubmit(true);
      setError("");

      const userDetails = {
        name: userInfo.name,
        lastName: userInfo.lastName || '',
        contact: userInfo.phone,
        email: userInfo.email,
        address: userInfo.address,
        country: 'Isral',
        zipCode: userInfo?.address?.postalCode,
      };

      const orderInfo = {
        user_info: userDetails,
        shippingOption: data.shippingOption,
        customer_note: data.customer_note,
        paymentMethod: "creditCard", // data.paymentMethod,
        status: "Pending",
        cart: items.sort((a, b) => a.barcode - b.barcode) || items,
        subTotal: Number(customCartTotal.toFixed(2)),
        shippingCost: shippingCost,
        discount: discountAmount,
        total: total,
        coupon: couponInfo._id || null,
      };

      // יצירת ההזמנה בדטאבייס עם סטטוס Pending
      const dbOrder = await OrderServices.addOrder(orderInfo);
      // console.log("dbOrder: ", dbOrder)

      const cardcomObj = {
        TerminalNumber: process.env.NEXT_PUBLIC_TERMINAL_NUMBER,
        ApiName: process.env.NEXT_PUBLIC_API_NAME,
        ReturnValue: dbOrder._id,
        Amount: orderInfo.total,
        SuccessRedirectUrl: process.env.NEXT_PUBLIC_STORE_DOMAIN + "/success",
        FailedRedirectUrl: process.env.NEXT_PUBLIC_STORE_DOMAIN + "/failed",
        // WebHookUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/orders/" + dbOrder._id,
        WebHookUrl: "https://backend.meshek-kirshner.co.il/api" + "/orders/" + dbOrder._id + `?key=${process.env.NEXT_PUBLIC_CARDCOM_KEY}&secret=${process.env.NEXT_PUBLIC_CARDCOM_SECRET}`,
        Document: {
          To: userInfo.name,
          Email: userInfo.email,
          Products: [...orderInfo.cart.map(p => {
            return {
              // ProductID: p._id,
              Description: p.title.he,
              Quantity: p.quantity,
              UnitCost: p.discountedPrice ? p.discountedPrice / p.quantity : p.itemTotal / p.quantity,
              TotalLineCost: p.discountedPrice ? p.discountedPrice : p.itemTotal,
              IsVatFree: p.isVatFree !== undefined ? p.isVatFree : true,
            }
          }), { Description: "10% התייקרות על הליקוט", UnitCost: Number((orderInfo.subTotal / 11).toFixed(2)), IsVatFree: true },
          shippingCost > 0 ? {
            Description: "התייקרות בגין משלוח ל" + userInfo?.address?.city?.city_name_he + ", " + userInfo?.address?.street + " " + userInfo?.address?.houseNumber + (userInfo?.address?.apartmentNumber ? "/" + userInfo?.address?.apartmentNumber : ''),
            UnitCost: shippingCost,
            IsVatFree: true,
          } : null,
          discountAmount > 0 ? {
            Description: "הנחה",
            UnitCost: -discountAmount,
            IsVatFree: true,
          } : null,
          ].filter(Boolean)
        }
      }
      // console.log('cardcomObj: ', cardcomObj)
      const response = await fetch('https://secure.cardcom.solutions/api/v11/LowProfile/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardcomObj)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setPaymentSrc(result.Url);
      setIsPaymentPageOpen(true);

      // if (data.paymentMethod === "Card") {
      //   // if (!elements) {
      //   //   return;
      //   // }

      //   // const { error, paymentMethod } = await stripe.createPaymentMethod({
      //   //   type: "card",
      //   //   card: elements.getElement(CardElement),
      //   // });

      //   // console.log('error', error);

      //   if (error && !paymentMethod) {
      //     setError(error.message);
      //     setIsCheckoutSubmit(false);
      //   } else {
      //     setError("");
      //     const orderData = {
      //       ...orderInfo,
      //       cardInfo: paymentMethod,
      //     };

      //     // handlePaymentWithStripe(orderData);

      //     // console.log('cardInfo', orderData);
      //     return;
      //   }
      // }
      // if (data.paymentMethod === "Cash") {
      //   const res = await OrderServices.addOrder(orderInfo);

      //   // notification info
      //   const notificationInfo = {
      //     orderId: res._id,
      //     message: `${res.user_info.name}, Placed ${currency}${parseFloat(
      //       res.total
      //     ).toFixed(2)} order!`,
      //     image:
      //       "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
      //   };
      //   // notification api call
      //   await NotificationServices.addNotification(notificationInfo);

      //   router.push(`/order/${res._id}`);
      //   notifySuccess("Your Order Confirmed!");
      //   Cookies.remove("couponInfo");
      //   sessionStorage.removeItem("products");
      //   emptyCart();
      //   setIsCheckoutSubmit(false);
      // }
    } catch (err) {
      notifyError(err.message);
      setIsCheckoutSubmit(false);
    }
  };

  // const handlePaymentWithStripe = async (order) => {
  //   try {
  //     // console.log('try goes here!', order);
  //     // const updatedOrder = {
  //     //   ...order,
  //     //   currency: 'usd',
  //     // };
  //     const res = await OrderServices.createPaymentIntent(order);
  //     // console.log("res", res);
  //     stripe.confirmCardPayment(res.client_secret, {
  //       payment_method: {
  //         card: elements.getElement(CardElement),
  //       },
  //     });

  //     const orderData = {
  //       ...order,
  //       cardInfo: res,
  //     };
  //     const resOrder = await OrderServices.addOrder(orderData);
  //     // notification info
  //     const notificationInfo = {
  //       orderId: resOrder._id,
  //       message: `${resOrder.user_info.name}, Placed ${currency}${parseFloat(
  //         resOrder.total
  //       ).toFixed(2)} order!`,
  //       image:
  //         "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
  //     };
  //     // notification api call
  //     await NotificationServices.addNotification(notificationInfo);

  //     router.push(`/order/${resOrder._id}`);
  //     notifySuccess("Your Order Confirmed!");
  //     Cookies.remove("couponInfo");
  //     emptyCart();
  //     sessionStorage.removeItem("products");
  //     setIsCheckoutSubmit(false);
  //   } catch (err) {
  //     // console.log("err", err?.message);
  //     notifyError(err?.response?.data?.message || err?.message);
  //     setIsCheckoutSubmit(false);
  //   }
  // };

  const handleShippingCost = (value) => {
    setShippingCost(value);
    setIsDeliveryMetod(true);
  };

  // ווידוא שהאחוזים מתעדכנים כל פעם שהמחיר משתנה
  useEffect(() => {
    if (shippingCost != 0) {
      const originalValue = ((customCartTotal / 11) * 10);
      if (originalValue) {
        if (originalValue > 0) {
          setShippingPercentageIncrease(shippingCost / originalValue * 100);
        } else {
          setShippingPercentageIncrease(0);
          setShippingCost(0);
          setIsDeliveryMetod(false);
        }
      }
    } else {
      setShippingPercentageIncrease(0);
    }
  }, [customCartTotal, shippingCost, isDeliveryMetod]);

  const handleCouponCode = async (e) => {
    e.preventDefault();

    const value = couponRef.current.value ? couponRef.current.value.trim() : '';

    if (!value) {
      notifyError(t("common:enterCouponCode"));
      return;
    }

    try {
      const { data } = await CouponServices.useCoupon({ couponCode: value });

      // בדיקה אם ההנחה היא סכום קבוע וגבוהה מהסכום הכולל של העגלה
      if (data.discountType.type === "fixed" && data.discountType.value >= customCartTotal) {
        notifyError(t("common:couponTooHighForTotal"));
        return; // מסיימים את הפונקציה מבלי להחיל את הקופון
      }

      notifySuccess(
        currentLang
          ? `הקופון ${data.couponCode} הוחל בהצלחה`
          : `Your Coupon ${data.couponCode} is applied successfully!`
      );

      setIsCouponApplied(!isCouponApplied);
      setMinimumAmount(0); // עדכון ערך מינימום אם יש צורך
      setDiscountPercentage(data.discountType.value);

      // שמירת המידע על הקופון ב-Context וב-Cookies
      dispatch({ type: "SAVE_COUPON", payload: data });
      Cookies.set("couponInfo", JSON.stringify(data));

    } catch (error) {
      console.log('error: ', error);
      notifyError(error?.response?.data?.message || t("common:errorOccurred"));
    }
  };

  return {
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
    discountPercentage,
    discountAmount,
    shippingCost,
    total,
    isEmpty,
    items,
    customCartTotal,
    currency,
    isCheckoutSubmit,
    isCouponApplied,
    isDeliveryMetod,
    paymentSrc,
    setPaymentSrc,
    isPaymentPageOpen,
    shippingPercentageIncrease,
  };
};

export default useCheckoutSubmit;
