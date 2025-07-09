// avrahami-store/src/pages/user/my-orders.js
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { IoBagHandle } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { FiZoomIn } from "react-icons/fi";
import { MdRestore } from "react-icons/md";
import { MdPayment } from "react-icons/md";

// Internal import
import Dashboard from "@pages/user/dashboard";
import OrderServices from "@services/OrderServices";
import Loading from "@component/preloader/Loading";
import { UserContext } from "@context/UserContext";
import OrderHistory, { getStatusColor, getStatusText } from "@component/order/OrderHistory";
import { SidebarContext } from "@context/SidebarContext";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useTranslation from "next-translate/useTranslation";
import useCart from "@hooks/useCart";
import ProductServices from "@services/ProductServices";
import { notifyError, notifySuccess } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import SubModal from "@component/modal/SubModal";
import addingToCart from 'public/addingToCart.svg'
import notifyApiResponse from "@utils/notifyApiResponse";
import { OrderContext } from "@context/OrderContext";
import OrderCard from "@component/order/OrderCard";
import getCustomPrice from "@utils/getCustomPrice";
import DocumentHistoryItem from "@component/user/DocumentHistoryItem";
import DocumentCard from "@component/user/DocumentCard";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import 'dayjs/locale/he';

const MyOrders = () => {
  // todo: לבטל את החלק הזה אם רוצים להחזיר
  // useEffect(() => {
  //   Router.replace("/user/dashboard");
  // }, []);
  // return null;
  // // עד כאן

  const router = useRouter();
  const { state: { userInfo } } = useContext(UserContext);
  const { currentPage, handleChangePage, isLoading, setIsLoading } = useContext(SidebarContext);
  const {
    orderData,
    loading,
    error,
    documentData,
    documentsLoading,
    documentsError,
  } = useContext(OrderContext);
  console.log('documentData :>> ', documentData);
  console.log('all orders :>> ', orderData);
  const { emptyCart, items } = useCart();
  const { handleAddItem } = useAddToCart();

  const { storeCustomizationSetting, storeSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  const [loadingRestore, setLoadingRestore] = useState(false);
  const [totalItems, setTotalItems] = useState(0); // המספר הכולל של הפריטים
  const { totalItems: addedItems } = useCart(); // מספר הפריטים שנוספו כבר לעגלה

  /* ------------------------------------------------------------------
   *  Tabs – orders | invoices | creditNotes | deliveries
   * ------------------------------------------------------------------ */
  const [activeTab, setActiveTab] = useState("orders");

  const docTypeTranslation = {
    orders: t("common:orders"),
    invoices: t("common:invoices"),
    creditNotes: t("common:creditNotes"),
    deliveries: t("common:deliveries"),
  };

  const docCounts = {
    orders: orderData?.orders?.length || 0,
    invoices: documentData?.invoices?.length || 0,
    creditNotes: documentData?.creditNotes?.length || 0,
    deliveries: documentData?.deliveries?.length || 0,
  };

  const getActiveDocuments = () => {
    if (activeTab === "orders") {
      return orderData?.orders || [];
    }
    return documentData?.[activeTab] || [];
  };

  const handleTabChange = (tab) => setActiveTab(tab);


  useEffect(() => {
    setIsLoading(false);
    if (!userInfo) {
      router.push("/");
    }
  }, [userInfo]);

  const restoreOrder = async (order) => {
    // return notifyError("הכפתור בפיתוח")
    try {
      setLoadingRestore(true);

      const orderData = await OrderServices.getOrderById(order.DocEntry);
      console.log('orderData :>> ', orderData);

      const itemsNotInCartYet = orderData?.items?.filter(oldItem => !items.some(item => item.ItemCode === oldItem.ItemCode));
      setTotalItems(addedItems + itemsNotInCartYet.reduce((acc, item) => acc + item.Quantity, 0));
      const missingProducts = [];

      // מעבר על כל מוצר בעגלה של ההזמנה הישנה (חוץ מאלו שכבר נמצאים בעגלה הנוכחית)
      for (const item of itemsNotInCartYet) {
        const productCode = item.ItemCode;

        // משיכת פרטי המוצר המעודכנים מהדטאבייס
        const [data] = await Promise.all([
          ProductServices.getShowingStoreProducts({
            itemCode: productCode,
            token: userInfo?.token,
          }),
        ]);

        const product = data?.products?.find((p) => p.ItemCode === productCode);

        if (!product) {
          missingProducts.push(item);
          continue;
        }

        let selectVariant = null;
        let stock = product.stock;

        // שימוש בgetCustomPrice במקום הקוד הישן
        const { price: customPrice } = getCustomPrice(product, userInfo, storeSetting);
        let price = customPrice || product?.Price || product.prices?.price || 0;
        let originalPrice = customPrice || product?.Price || product.prices?.originalPrice || 0;
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

          if (stock >= item.Quantity) {
            handleAddItem(newItem, item.Quantity);
          } else {
            notifyError(`Not enough stock for ${showingTranslateValue(product.title)}.`);
          }
        } else {
          const newItem = {
            ...product,
            title: product.ItemName ?? product.title,
            id: product._id ?? product.ItemCode,
            variant: product.prices ?? 0,
            price: product.price,
            originalPrice: product.originalPrice,
            slug: product.ItemCode,
          }
          handleAddItem(newItem, item.Quantity);
        }
      }

      // שמירת המוצרים החסרים בלוקל סטורג'
      localStorage.setItem("missingProducts", JSON.stringify(missingProducts));

      // ניתוב לעמוד הצ'קאאוט
      router.push("/checkout");
    } catch (error) {
      console.error("Failed to restore order:", error);
      notifyApiResponse(error, false);
    } finally {
      setLoadingRestore(false);
    }
  };

  return (
    <>
      {loadingRestore && (
        <SubModal modalOpen={loadingRestore}>
          <div className="px-9 pb-10 pt-7 flex flex-col gap-4">
            <img src={addingToCart.src} alt="Adding to cart image" className="h-56 mr-[13%] up-down-animation" />
            <h2 className="text-xl font-serif font-semibold text-center">
              {totalItems ?
                t("common:addingItemsToCart", { x: addedItems, y: totalItems }) :
                t("common:addingItems")
              }
            </h2>
          </div>
        </SubModal>
      )}
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Dashboard
          title={showingTranslateValue(storeCustomizationSetting?.dashboard?.my_order)}
          description="This is user order history page"
        >
          <div className="overflow-hidden rounded-md font-serif">

          <h2 className="text-xl font-serif font-semibold mb-2">
                  {t("common:footer-my-account-myOrders")}
                </h2>

            {/* ---------- Tabs ---------- */}
            <div className="flex flex-wrap gap-2 mb-5">
              {Object.entries(docTypeTranslation).map(([key, label]) =>
                docCounts[key] > 0 && (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${activeTab === key
                        ? "bg-customRed text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {label} ({docCounts[key]})
                  </button>
                )
              )}
            </div>

            {loading ? (
              <Loading loading={loading} />
            ) : error ? (
              <h2 className="text-xl text-center my-10 mx-auto w-11/12 text-red-400">
                {error}
              </h2>
            ) : orderData?.orders?.length === 0 ? (
              <div className="text-center">
                <span className="flex justify-center my-30 pt-16 text-customRed font-semibold text-6xl">
                  <IoBagHandle />
                </span>
                <h2 className="font-medium text-md my-4 text-gray-600">
                  {t("common:noOrder")}
                </h2>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* *************   MOBILE / SMALL   ************* */}
                {activeTab === "orders" ? (
                  <div className="md:hidden">
                    {getActiveDocuments().map((order) => (
                      <OrderCard
                        key={order.DocEntry}
                        order={order}
                        restoreOrder={restoreOrder}
                        loadingRestore={loadingRestore}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getActiveDocuments().map((doc) => (
                      <DocumentCard
                        key={`${activeTab}-${doc.DocNum}`}
                        document={doc}
                        docType={activeTab}
                      />
                    ))}
                  </div>
                )}

                {/* *************   DESKTOP   ************* */}
                {activeTab === "orders" ? (
                  /* ---------------- Orders Table ---------------- */
                  <div className="hidden md:block">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="align-middle inline-block border border-gray-100 rounded-md min-w-full pb-2 sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b last:border-b-0 border-gray-100 rounded-md">
                          <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr className="bg-gray-100">
                                <th className="text-center text-xs font-serif font-semibold px-2 py-2 text-gray-700 uppercase tracking-wider">
                                  {t("common:DocNum")}
                                </th>
                                <th className="text-center text-xs font-serif font-semibold px-2 py-2 text-gray-700 uppercase tracking-wider">
                                  {t("common:CreateDate")}
                                </th>
                                <th className="text-center text-xs font-serif font-semibold px-2 py-2 text-gray-700 uppercase tracking-wider">
                                  {t("common:DocStatus")}
                                </th>
                                <th className="text-center text-xs font-serif font-semibold px-2 py-2 text-gray-700 uppercase tracking-wider">
                                  {t("common:action")}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {getActiveDocuments().map((order) => {
                                /* ---------- Date & Status helpers ---------- */
                                const currentLang = Cookies.get("_lang");
                                dayjs.locale(currentLang === "he" ? "he" : "en");
                                const date = dayjs(order.CreateDate || order.DocDate).format("D/MM/YYYY");

                                return (
                                  <tr key={order.DocEntry}>
                                    {/* מספר הזמנה */}
                                    <td className="px-1 md:px-5 py-3 whitespace-nowrap text-center text-sm">
                                      {order.DocNum}
                                    </td>
                                    {/* תאריך */}
                                    <td className="px-1 md:px-5 py-3 whitespace-nowrap text-center text-sm">
                                      {date}
                                    </td>
                                    {/* סטטוס */}
                                    <td className="px-1 md:px-5 py-3 whitespace-nowrap text-center text-sm">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.status?.name || order.DocumentStatus)}`}>
                                        {getStatusText(order?.status?.name || order.DocumentStatus, t)}
                                      </span>
                                    </td>
                                    {/* פעולות */}
                                    <td className="px-1 md:px-5 py-3 whitespace-nowrap text-center text-sm">
                                      {order?.status?.name === "Pending" ? (
                                        <button
                                          disabled={loadingRestore}
                                          className="flex gap-1 items-center mx-auto px-3 py-1 bg-customRed-superLight text-xs text-customRed hover:bg-customRed hover:text-white transition-all font-semibold rounded-full"
                                          onClick={(e) => { e.stopPropagation(); restoreOrder(order); }}
                                        >
                                          <MdPayment size={17} />
                                          {t("common:payNow")}
                                        </button>
                                      ) : (
                                        <div className="flex gap-3 items-center justify-center">
                                          <button
                                            disabled={loadingRestore}
                                            className="flex gap-1 items-center px-3 py-1 bg-gray-100 text-xs text-gray-700 hover:bg-gray-600 hover:text-white transition-all font-semibold rounded-full"
                                            onClick={(e) => { e.stopPropagation(); restoreOrder(order); }}
                                          >
                                            <MdRestore size={17} />
                                            {t("common:Reorder")}
                                          </button>
                                          <Link
                                            href={`/order/${order.DocEntry}`}
                                            className="w-fit flex gap-1 items-center justify-center px-3 py-1 bg-customRed-superLight text-xs text-customRed hover:bg-customRed hover:text-white transition-all font-semibold rounded-full"
                                          >
                                            <FiZoomIn size={17} />
                                            {t("common:view")}
                                          </Link>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --------------- Other Docs Table --------------- */
                  <div className="hidden md:block">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="align-middle inline-block border border-gray-100 rounded-md min-w-full pb-2 sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b last:border-b-0 border-gray-100 rounded-md">
                          <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr className="bg-gray-100">
                                <th className="text-center text-xs font-serif font-semibold px-2 py-2 text-gray-700 uppercase tracking-wider">
                                  {t("common:DocNum")}
                                </th>
                                <th className="text-center text-xs font-serif font-semibold px-2 py-2 text-gray-700 uppercase tracking-wider">
                                  {t("common:DocType")}
                                </th>
                                <th className="text-center text-xs font-serif font-semibold px-2 py-2 text-gray-700 uppercase tracking-wider">
                                  {t("common:DocDate")}
                                </th>
                                <th className="text-center text-xs font-serif font-semibold px-2 py-2 text-gray-700 uppercase tracking-wider">
                                  {t("common:DocTotal")}
                                </th>
                                <th className="text-center text-xs font-serif font-semibold px-2 py-2 text-gray-700 uppercase tracking-wider">
                                  {t("common:DocStatus")}
                                </th>
                                <th className="text-center text-xs font-serif font-semibold px-2 py-2 text-gray-700 uppercase tracking-wider">
                                  {t("common:view")}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {getActiveDocuments().map((doc) => (
                                <tr key={`${activeTab}-${doc.DocEntry}`}>
                                  <DocumentHistoryItem document={doc} docType={activeTab} />
                                  <td className="px-1 md:px-5 py-2 whitespace-nowrap text-center text-sm">
                                    <Link
                                      href={`/order/${doc.DocEntry}`}
                                      className="w-fit flex gap-1 items-center justify-center px-3 py-1 bg-customRed-superLight text-xs text-customRed hover:bg-customRed hover:text-white transition-all font-semibold rounded-full"
                                    >
                                      <FiZoomIn size={17} />
                                      {t("common:view")}
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Dashboard>
      )}
    </>
  );
};

export default MyOrders;