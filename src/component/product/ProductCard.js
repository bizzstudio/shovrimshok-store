// src/component/product/ProductCard.js
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

const ProductCard = ({ product, attributes, offers = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { toggleCartDrawer, closeCartDrawer } = useContext(SidebarContext)
  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  const currency = globalSetting?.default_currency || "₪";
  const inStock = product?.stock > 0 || product?.OnHand > 0;

  // console.log('attributes in product cart',attributes)

  const handleAddItem = (p) => {
    if (!inStock) return notifyError(t("common:productStockOut"));

    if (p?.variants?.length > 0) {
      setModalOpen(!modalOpen);
      return;
    }
    const { slug, variants, categories, description, ...updatedProduct } = product;
    const newItem = {
      ...updatedProduct,
      title: p.title,
      id: p._id ?? p.ItemCode,
      variant: p.prices || 0,
      price: p.prices?.price || 0,
      originalPrice: product.prices?.originalPrice || 0,
      slug: p.ItemCode,
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

  const offerName = getOfferNames(offers, product, <br />);
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

      <div className="group box-border overflow-hidden flex justify-between rounded-md shadow-sm pe-0 flex-col items-center bg-white relative">
        <div className="w-full flex justify-between">
          {!inStock && <Stock product={product} stock={product.stock ?? product.OnHand} card right={2} top={2} />}
          {/* אם אין מלאי למוצר מופיע אזל מהמלאי */}
          <Discount product={product} title={offerName} />
        </div>
        <div
          onClick={() => {
            handleModalOpen(!modalOpen, (product._id ?? product.ItemCode));
            handleLogEvent(
              "product",
              `opened ${showingTranslateValue(product?.title)} product modal`
            );
          }}
          className="relative flex justify-center cursor-pointer pt-2 w-full h-44"
        >
          <div className="relative w-full h-full p-2">
            {!inStock && <div className="absolute z-10 w-full h-full flex items-center justify-center"><div className="bg-white bg-opacity-70 -rotate-6 text-customRed border-4 border-customRed rounded inline-flex items-center justify-center px-2 py-1 text-2xl font-bold font-serif">{t("common:stockOut")}</div></div>}
            {product.image?.[0] ? (
              <ImageWithFallback src={product.image?.[0]} outOfStock={!inStock} alt="product" />
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
        <div className="w-full px-3 lg:px-4 pb-4 overflow-hidden">
          <div className="relative mb-1">
            <span className="text-gray-400 font-medium text-xs d-block mb-1">
              {product.unit}
            </span>
            <h2 className="text-heading line-clamp-2 mb-0 block text-base font-medium text-gray-600">
              {product?.ItemName}
            </h2>
          </div>

          <div className="flex justify-between items-center text-heading text-sm sm:text-base space-s-2 md:text-base lg:text-xl">
            {/* <Price
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
            /> */}
            <span className="text-sm">{t("common:itemCode")}: {product?.ItemCode}</span>

            {inCart((product._id ?? product.ItemCode)) ? (
              <div>
                {items.map(
                  (item) =>
                    item.id === (product._id ?? product.ItemCode) && (
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
                // disabled={!inStock}
                onClick={() => handleAddItem(product)}
                aria-label="cart"
                className={!inStock ? "h-9 px-2 flex items-center justify-center border border-gray-200 rounded text-gray-400" : "h-9 px-2 flex items-center justify-center border border-gray-200 rounded text-customGreen hover:border-customGreen hover:bg-customGreen hover:text-white transition-all"}
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

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
