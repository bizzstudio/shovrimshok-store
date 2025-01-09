// ScrollOfferCard.jsx
import dynamic from "next/dynamic";
import Image from "next/image";
import { useContext, useState } from "react";
import { IoAdd, IoBagAddSharp, IoRemove } from "react-icons/io5";

//internal import
import Price from "@component/common/Price";
import Stock from "@component/common/Stock";
import { notifyError } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import useGetSetting from "@hooks/useGetSetting";
import Discount from "@component/common/Discount";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@component/modal/ProductModal";
import ImageWithFallback from "@component/common/ImageWithFallBack";
import { handleLogEvent } from "@utils/analytics";
import { SidebarContext } from "@context/SidebarContext";
import useTranslation from "next-translate/useTranslation";
import getOfferNames from "@component/offer/getOfferNames";
import useCart from "@hooks/useCart";

const ScrollOfferCard = ({ product, attributes, offers = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { toggleCartDrawer, closeCartDrawer } = useContext(SidebarContext)
  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  const currency = globalSetting?.default_currency || "₪";

  // console.log('attributes in product cart',attributes)

  const handleAddItem = (p) => {
    if (p.stock < 1) return notifyError(t("common:productStockOut"));

    if (p?.variants?.length > 0) {
      setModalOpen(!modalOpen);
      return;
    }
    const { slug, variants, categories, description, ...updatedProduct } =
      product;
    const newItem = {
      ...updatedProduct,
      title: p.title,
      id: p._id,
      variant: p.prices,
      price: p.prices.price,
      originalPrice: product.prices?.originalPrice,
      slug: p.slug,
    };
    addItem(newItem);
    // פתיחת העגלה לשתי שניות באופן אוטומטי
    // toggleCartDrawer()
    // setTimeout(()=>{
    //   closeCartDrawer()
    // },2000)
  };

  const handleModalOpen = (event, id) => {
    setModalOpen(event);
  };

  // יצירת מחרוזת עם כל שמות המבצעים עבור המוצר
  const offerName = getOfferNames(offers, product);

  // פונקציות מבצעים ישנים
  // const getOfferName = (product) => {
  //   if (product.isCombination) {
  //     return getFirstOfferName(product?.variants);
  //   } else {
  //     return product?.prices?.offers[0]?.name;
  //   }
  // }

  // const getFirstOfferName = (variants) => {
  //   for (let variant of variants) {
  //     let offer = variant.offers?.find(offer => offer.name);
  //     if (offer) {
  //       return offer.name;
  //     }
  //   }
  //   return null; // במקרה שאין אף offer עם שם
  // };

  return (
    <>
      {modalOpen && (
        <ProductModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          product={product}
          currency={currency}
          attributes={attributes}
          title={offerName}
        />
      )}

      <div className="w-full group overflow-hidden flex justify-between rounded-md items-center bg-white relative">
        {/* image */}
        <div
          onClick={() => {
            handleModalOpen(!modalOpen, product._id);
            handleLogEvent(
              "product",
              `opened ${showingTranslateValue(product?.title)} product modal`
            );
          }}
          className="relative flex justify-center cursor-pointer h-full"
        >
          <div className="relative w-28 h-full">
            {product.stock <= 0 &&
              <div className="absolute z-10 w-full h-full flex items-center justify-center">
                <div className="bg-white bg-opacity-70 -rotate-6 text-customRed border-4 border-customRed rounded inline-flex items-center justify-center px-2 py-1 text-2xl font-bold font-serif">{t("common:stockOut")}
                </div>
              </div>
            }
            {product.image[0] ? (
              <ImageWithFallback src={product.image[0]} outOfStock={product.stock <= 0} alt="product" noPadding={true} />
            ) : (
              <Image
                src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                fill
                style={{
                  objectFit: "contain",
                }}
                sizes="100%"
                alt="product"
                className="object-contain transition duration-150 ease-linear transform group-hover:scale-105"
              />
            )}
          </div>
        </div>

        {/* content */}
        <div className="w-full px-3 overflow-hidden cursor-auto">
          <div className="flex justify-between items-center text-heading text-sm sm:text-base space-s-2 md:text-base lg:text-xl">
            <div>
              <div className="relative">
                <span className="text-gray-400 font-medium text-xs d-block">
                  {product.unit}
                </span>
                <h2 className="text-heading truncate mb-0 block text-base font-medium text-gray-600">
                  {/* <span className="line-clamp-2"> */}
                  {showingTranslateValue(product?.title)}
                  {/* </span> */}
                </h2>
              </div>
              <Price
                card
                product={product}
                currency={currency}
                price={
                  product?.isCombination
                    ? product?.variants[0]?.price
                    : product?.prices?.price
                }
                originalPrice={
                  product?.isCombination
                    ? product?.variants[0]?.originalPrice
                    : product?.prices?.originalPrice
                }
              />

              <div className="w-full mb-2">
                {/* אם אין מלאי למוצר מופיע אזל מהמלאי */}
                {/* {product.stock <= 0 && <Stock product={product} stock={product.stock} card right={"2"} top={"2"} />} */}
                <Discount product={product} title={offerName} noMargin={true} search />
              </div>
            </div>


            {inCart(product._id) ? (
              <div>
                {items.map(
                  (item) =>
                    item.id === product._id && (
                      <div
                        key={item.id}
                        className="h-9 w-auto flex flex-wrap items-center justify-evenly py-1 px-2 bg-customGreen text-white rounded"
                      >
                        <button
                          className="pl-1"
                          onClick={() =>
                            updateItemQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <span className="text-dark text-base">
                            <IoRemove />
                          </span>
                        </button>
                        <p className="text-sm text-dark px-1 font-serif font-semibold">
                          {item.quantity}
                        </p>
                        <button
                          className="pr-1"
                          onClick={() =>
                            item?.variants?.length > 0
                              ? handleAddItem(item)
                              : handleIncreaseQuantity(item)
                          }
                        >
                          <span className="text-dark text-base">
                            <IoAdd />
                          </span>
                        </button>
                      </div>
                    )
                )}{" "}
              </div>
            ) : (
              <button
                // disabled={product?.stock <= 0}
                onClick={() => handleAddItem(product)}
                aria-label="cart"
                className={product?.stock <= 0 ? "h-9 px-2 flex items-center justify-center border border-gray-200 rounded text-gray-400" : "h-9 px-2 flex items-center justify-center border border-gray-200 rounded text-customGreen hover:border-customGreen hover:bg-customGreen hover:text-white transition-all"}
              >
                {" "}
                {product?.variants?.length > 0 ?
                  <span className="text-[10px]">
                    {t("common:options")}
                  </span>
                  :
                  <span className="text-xl">
                    <IoBagAddSharp />
                  </span>}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ScrollOfferCard), { ssr: false });
