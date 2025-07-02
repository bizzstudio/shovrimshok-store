// useCheckoutSubmit.js
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CardElement, useElements } from "@stripe/react-stripe-js";

// Internal import
import useAsync from "@hooks/useAsync";
import { UserContext } from "@context/UserContext";
import OrderServices from "@services/OrderServices";
import CouponServices from "@services/CouponServices";
import { notifyError, notifySuccess } from "@utils/toast";
import SettingServices from "@services/SettingServices";
import NotificationServices from "@services/NotificaitonServices";
import useTranslation from "next-translate/useTranslation";
import useCart from "./useCart";
import useAddToCart from "./useAddToCart";
import { SidebarContext } from "@context/SidebarContext";
import notifyApiResponse from "@utils/notifyApiResponse";
import { OrderContext } from "@context/OrderContext";

const useCheckoutSubmit = () => {
  const {
    state: { userInfo, shippingAddress },
    dispatch,
  } = useContext(UserContext);
  const { refreshOffers } = useContext(SidebarContext);
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
  const [shippingPercentageIncrease, setShippingPercentageIncrease] = useState(0);
  const [readyToSubmit, setReadyToSubmit] = useState(null);

  // סטייטים לקונפליקטים
  const [missingProductsModal, setMissingProductsModal] = useState(false);
  const [missingProducts, setMissingProducts] = useState([]);
  const [priceConflictsModal, setPriceConflictsModal] = useState(false);
  const [priceConflicts, setPriceConflicts] = useState([]);
  const [offerConflictsModal, setOfferConflictsModal] = useState(false);
  const [offerConflicts, setOfferConflicts] = useState([]);
  const [addUpdatedProducts, setAddUpdatedProducts] = useState(false);

  const router = useRouter();
  // const stripe = useStripe();
  // const elements = useElements();
  const couponRef = useRef("");
  const { isEmpty, emptyCart, items, customCartTotal, removeItem, addItem, inCart } = useCart();
  const { fetchOrderData, fetchDocumentData } = useContext(OrderContext);

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
  };

  useEffect(() => {
    if (Cookies.get("couponInfo")) {
      const coupon = JSON.parse(Cookies.get("couponInfo"));
      // console.log('coupon information',coupon)
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountType);
      setMinimumAmount(coupon.minimumAmount);
    }
  }, [isCouponApplied]);

  // remove coupon if total value less then minimum amount of coupon
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

    // התאמה למבנה החדש של userInfo
    setValue("cardName", userInfo?.CardName || '');
    setValue("address", userInfo?.ShipToAddress?.Address || userInfo?.BillToAddress?.Address || '');
    setValue("contact", userInfo?.Phone1 || userInfo?.Cellular || '');
    setValue("email", userInfo?.EmailAddress || '');
    setValue("city", userInfo?.ShipToAddress?.City || userInfo?.BillToAddress?.City || '');
    setValue("country", userInfo?.ShipToAddress?.Country || userInfo?.BillToAddress?.Country || 'IL');
    setValue("zipCode", userInfo?.ShipToAddress?.ZipCode || userInfo?.BillToAddress?.ZipCode || '');
  }, [userInfo, setValue]);

  // פונקציה חדשה: ריענון מבצעים + שליחה לשרת
  const submitWithRefreshOffers = async (data) => {
    try {
      // 1) רענון המבצעים
      await refreshOffers();
      // עכשיו הסטייט של offers ב-SidebarContext יתעדכן

      // 2) לחכות טיפה שהעגלת useCart תעשה applyOffers (אסינכרוני):
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 3) רק עכשיו שולחים את ההזמנה
      setReadyToSubmit(data)
    } catch (err) {
      console.error("submitWithRefreshOffers error:", err);
    }
  };

  // שליחת ההזמנה לשרת
  const submitHandler = async (data) => {
    try {
      // console.log('items :>> ', items);

      dispatch({ type: "SAVE_SHIPPING_ADDRESS", payload: data });
      Cookies.set("shippingAddress", JSON.stringify(data));
      setIsCheckoutSubmit(true);
      setError("");

      // התאמה למבנה החדש של userInfo
      const userDetails = {
        CardName: userInfo?.CardName || '',
        contact: userInfo?.Phone1 || userInfo?.Cellular || '',
        email: userInfo?.EmailAddress || '',
        address: userInfo?.ShipToAddress?.Address || userInfo?.BillToAddress?.Address || '',
        city: userInfo?.ShipToAddress?.City || userInfo?.BillToAddress?.City || '',
        country: userInfo?.ShipToAddress?.Country || userInfo?.BillToAddress?.Country || 'IL',
        zipCode: userInfo?.ShipToAddress?.ZipCode || userInfo?.BillToAddress?.ZipCode || '',
        cardCode: userInfo?.CardCode || '',
        federalTaxID: userInfo?.FederalTaxID || '',
        groupCode: userInfo?.GroupCode || '',
        priceListNum: userInfo?.PriceListNum || '',
        currency: userInfo?.Currency || currency,
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
      const dbOrder = await OrderServices.addOrder(orderInfo)
      console.log('success :>> ', dbOrder);
      router.push({
        pathname: '/success',
        query: { orderNumber: dbOrder.DocNum }
      });
      notifyApiResponse(dbOrder, true);
      await fetchOrderData(true);
      // await fetchDocumentData(true);
      // setPaymentSrc(res.paymentUrl);
    } catch (error) {
      console.error('error :>> ', error);
      if (error?.response?.status === 409) {
        const errorData = error?.response?.data;
        handleConflicts(errorData);
        return;
      } else {
        notifyApiResponse(error, false);
        // notifyError(error?.response?.data?.message || "שגיאה ביצירת ההזמנה. מומלץ לרוקן את העגלה ולנסות שוב.");
      }
    } finally {
      setIsCheckoutSubmit(false);
    }
  };

  // עדכון המוצרים ששונה להם המחיר
  useEffect(() => {
    if (addUpdatedProducts) {
      priceConflicts.forEach((conflict) => {
        const { product, serverPrice, clientPrice } = conflict;

        const oldQuantity = product.oldQuantity;

        let selectVariant = null;
        let stock = product.stock;
        let price = product?.Price ?? product.prices.price;
        let originalPrice = product?.Price ?? product.prices.originalPrice;
        let img = product.image?.[0];

        if (
          product?.variants?.map(
            (variant) =>
              Object.entries(variant).sort().toString() ===
              Object.entries(selectVariant).sort().toString()
          )
        ) {
          const { variants, categories, description, ...updatedProduct } = product;
          const newItem = {
            ...updatedProduct,
            id: `${product.variants.length <= 1
              ? (product._id ?? product.ItemCode)
              : (product._id ?? product.ItemCode) +
              variantTitle
                ?.map(
                  // (att) => selectVariant[att.title.replace(/[^a-zA-Z0-9]/g, '')]
                  (att) => selectVariant[att._id]
                )
                .join("-")
              }`,

            title: product.variants.length <= 1
              ? product.title
              : {
                he: product.title.he +
                  "-" +
                  variantTitle
                    ?.map(
                      // (att) => selectVariant[att.title.replace(/[^a-zA-Z0-9]/g, '')]
                      (att) =>
                        att.variants?.find((v) => v._id === selectVariant[att._id])
                    )
                    .map((el) => el?.name),
                en: product.title.en +
                  "-" +
                  variantTitle
                    ?.map(
                      // (att) => selectVariant[att.title.replace(/[^a-zA-Z0-9]/g, '')]
                      (att) =>
                        att.variants?.find((v) => v._id === selectVariant[att._id])
                    )
                    .map((el) => el?.name)
              },
            image: img,
            variant: selectVariant,
            price: price,
            originalPrice: originalPrice,
          };

          addItem(newItem, oldQuantity);
        }
      });

      localStorage.removeItem("priceConflicts");
      setAddUpdatedProducts(false);
    }
  }, [addUpdatedProducts]);

  // פונקציית התמודדות עם קונפליקטים מהשרת
  const handleConflicts = async (errorData) => {
    if (!errorData || !errorData.keyWord) return;

    switch (errorData.keyWord) {
      case "missingProducts": {
        // מוצרים חסרים
        const missingProducts = errorData.missingProducts || [];

        // שמירה ב-localStorage אם רוצים לשחזר אחרי רענון
        localStorage.setItem("missingProducts", JSON.stringify(missingProducts));

        // אפשר, אם רוצים, להסיר אותם מייד מהעגלה:
        missingProducts.forEach((p) => removeItem((p._id ?? p.ItemCode)));

        // הצגת המודאל עם המוצרים החסרים
        setMissingProducts(missingProducts);
        setMissingProductsModal(true);
        break;
      }

      case "priceConflicts": {
        // קונפליקט מחירים
        const priceConflicts = errorData.priceConflicts || [];

        // שמירה ב-localStorage
        localStorage.setItem("priceConflicts", JSON.stringify(priceConflicts));

        // **עדכון מיידי של מחיר המוצרים בעגלה**:
        // הרעיון: להסיר את המוצר הישן ולהוסיף אותו מחדש עם המחיר החדש מהשרת
        let productsWithQ = priceConflicts;
        priceConflicts.forEach((conflict) => {
          const { product } = conflict;

          // 1) מוצאים את הפריט כפי שהוא בעגלה
          const cartItem = items.find((cartI) => cartI._id === (product._id ?? product.ItemCode));

          if (cartItem) {
            const oldQuantity = cartItem.quantity;

            productsWithQ = productsWithQ.map(p => {
              if (p.product._id === cartItem.id || p.product.ItemCode === cartItem.id) {
                return { ...p, product: { ...product, oldQuantity } }
              }
              return p;
            });

            // 2) הסרת הפריט הישן
            removeItem(cartItem.id);

            setAddUpdatedProducts(true);
          };
        });

        // פתיחת מודאל ייעודי
        setPriceConflicts(productsWithQ);
        setPriceConflictsModal(true);
        break;
      }

      case "offerConflicts": {
        // קונפליקט מבצעים
        const offerConflicts = errorData.offerConflicts || [];

        // שמירה ב-localStorage
        localStorage.setItem("offerConflicts", JSON.stringify(offerConflicts));
        // window.location.reload();
        await refreshOffers();
        break;
      }

      default:
        // במקרה שאין keyWord מוכר, או שאין צורך בטיפול מיוחד
        console.warn("No specific conflict handling for keyWord:", errorData.keyWord);
        notifyError("שגיאה ביצירת ההזמנה. מומלץ לרוקן את העגלה ולנסות שוב.");
        break;
    }
  };

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
    submitWithRefreshOffers,
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
    shippingPercentageIncrease,

    missingProductsModal,
    setMissingProductsModal,
    missingProducts,
    setMissingProducts,
    priceConflictsModal,
    setPriceConflictsModal,
    priceConflicts,
    setPriceConflicts,
    offerConflictsModal,
    setOfferConflictsModal,
    offerConflicts,
    setOfferConflicts,
  };
};

export default useCheckoutSubmit;
