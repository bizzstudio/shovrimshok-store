import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoBagHandle } from "react-icons/io5";
import ReactPaginate from "react-paginate";

//internal import
import Dashboard from "@pages/user/dashboard";
import OrderServices from "@services/OrderServices";
import Loading from "@component/preloader/Loading";
import { UserContext } from "@context/UserContext";
import OrderHistory from "@component/order/OrderHistory";
import { SidebarContext } from "@context/SidebarContext";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useTranslation from "next-translate/useTranslation";
import useCart from "@hooks/useCart";
import ProductServices from "@services/ProductServices";
import { notifyError, notifySuccess } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";

const MyOrders = () => {
  const router = useRouter();
  const {
    state: { userInfo },
  } = useContext(UserContext);
  const { currentPage, handleChangePage, isLoading, setIsLoading } =
    useContext(SidebarContext);
  const { emptyCart, items } = useCart();
  const { handleAddItem } = useAddToCart();


  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRestore, setLoadingRestore] = useState(false);

  useEffect(() => {
    OrderServices.getOrderCustomer({
      page: currentPage,
      limit: 8,
    })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  }, [currentPage]);

  const pageCount = Math.ceil(data?.totalDoc / 8);

  useEffect(() => {
    setIsLoading(false);
    if (!userInfo) {
      router.push("/");
    }
  }, [userInfo]);

  const restoreOrder = async (order) => {
    try {
      setLoadingRestore(true);
      const missingProducts = [];

      // מעבר על כל מוצר בעגלה של ההזמנה הישנה
      for (const item of order.cart) {
        const productSlug = item.slug;

        // משיכת פרטי המוצר המעודכנים מהדטאבייס
        const [data] = await Promise.all([
          ProductServices.getShowingStoreProducts({
            category: "",
            slug: productSlug,
          }),
        ]);

        const product = data?.products?.find((p) => p.slug === productSlug);

        if (!product) {
          missingProducts.push(item);
          continue;
        }

        let selectVariant = null;
        let stock = product.stock;
        let price = product.prices.price;
        let originalPrice = product.prices.originalPrice;
        let img = product.image[0];

        if (
          product?.variants.map(
            (variant) =>
              Object.entries(variant).sort().toString() ===
              Object.entries(selectVariant).sort().toString()
          )
        ) {
          const { variants, categories, description, ...updatedProduct } = product;
          const newItem = {
            ...updatedProduct,
            id: `${product.variants.length <= 1
              ? product._id
              : product._id +
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

          // בדיקה אם המוצר כבר קיים בעגלה
          const existingItem = items.find(i => i.id === newItem.id);
          if (existingItem) {
            console.log(`Product ${newItem.title.he || newItem.title.en} is already in the cart, skipping...`);
            continue;
          }

          if (stock >= item.quantity) {
            handleAddItem(newItem, item.quantity);
          } else {
            notifyError(`Not enough stock for ${showingTranslateValue(product.title)}.`);
          }
        }
      }

      // שמירת המוצרים החסרים בלוקל סטורג'
      localStorage.setItem("missingProducts", JSON.stringify(missingProducts));

      // ניתוב לעמוד הצ'קאאוט
      router.push("/checkout");
    } catch (error) {
      console.error("Failed to restore order:", error);
      notifyError("Failed to restore order. Please try again later.");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Dashboard
          title={showingTranslateValue(
            storeCustomizationSetting?.dashboard?.my_order
          )}
          description="This is user order history page"
        >
          <div className="overflow-hidden rounded-md font-serif">
            {loading ? (
              <Loading loading={loading} />
            ) : error ? (
              <h2 className="text-xl text-center my-10 mx-auto w-11/12 text-red-400">
                {error}
              </h2>
            ) : data?.orders?.length === 0 ? (
              <div className="text-center">
                <span className="flex justify-center my-30 pt-16 text-customGreen font-semibold text-6xl">
                  <IoBagHandle />
                </span>
                <h2 className="font-medium text-md my-4 text-gray-600">
                  {t("common:noOrder")}
                </h2>
              </div>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-xl font-serif font-semibold mb-5">
                  {t("common:footer-my-account-myOrders")}
                </h2>
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="align-middle inline-block border border-gray-100 rounded-md min-w-full pb-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b last:border-b-0 border-gray-100 rounded-md">
                      <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr className="bg-gray-100">
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:orderId")}
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:orderTime")}
                            </th>

                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:method")}
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {/* {t("common:status")} */}
                              סטטוס/שם מלקט
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:total")}
                            </th>
                            <th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              {t("common:action")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data?.orders?.map((order) => (
                            <tr key={order._id}>
                              <OrderHistory order={order} />
                              <td className="px-5 py-3 whitespace-nowrap text-center text-sm">
                                {order?.status?.name === "Pending" ? (
                                  loadingRestore ?
                                    <button
                                      disabled
                                      className="h-6 w-[168px] mx-auto flex gap-1 items-center justify-center opacity-60 px-3 py-1 bg-customGreen text-xs text-white hover:bg-customGreen-dark transition-all font-semibold rounded-full"
                                    >
                                      <img
                                        src="/loader/spinner.gif"
                                        alt="Loading"
                                        width={20}
                                        height={10}
                                      />
                                      <span className="font-serif ml-2 font-light">
                                        {t("common:restoreOrder")}
                                      </span>
                                    </button>
                                    :
                                    <button
                                      className="h-6 w-[168px] px-3 py-1 bg-customGreen text-xs text-white hover:bg-customGreen-dark transition-all font-semibold rounded-full"
                                      onClick={() => restoreOrder(order)}
                                    >
                                      {t("common:payNow")}
                                    </button>)
                                  :
                                  <Link
                                    className="px-3 py-1 bg-customBrown-light text-xs text-customGreen-dark hover:bg-customGreen hover:text-white transition-all font-semibold rounded-full"
                                    href={`/order/${order._id}`}
                                  >
                                    {t("common:details")}
                                  </Link>
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {data?.totalDoc > 10 && (
                        <div className="paginationOrder">
                          <ReactPaginate
                            breakLabel="..."
                            nextLabel={t("common:next")}
                            onPageChange={(e) =>
                              handleChangePage(e.selected + 1)
                            }
                            pageRangeDisplayed={3}
                            pageCount={pageCount}
                            previousLabel={t("common:previous")}
                            renderOnZeroPageCount={null}
                            pageClassName="page--item"
                            pageLinkClassName="page--link"
                            previousClassName="page-item"
                            previousLinkClassName="page-previous-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-next-link"
                            breakClassName="page--item"
                            breakLinkClassName="page--link"
                            containerClassName="pagination"
                            activeClassName="activePagination"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Dashboard>
      )}
    </>
  );
};

export default MyOrders;
