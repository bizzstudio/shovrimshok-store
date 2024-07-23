import { useState } from "react";
import { useCart } from "react-use-cart";
import Cookies from "js-cookie";

import { notifyError, notifySuccess } from "@utils/toast";
import useTranslation from "next-translate/useTranslation";

const useAddToCart = () => {
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
  const { t } = useTranslation();

  const [item, setItem] = useState(1);
  const { addItem, items, updateItemQuantity } = useCart();
  // console.log('products',products)
  // console.log("items", items);

  const handleAddItem = (product) => {

    const result = items.find((i) => i.id === product.id);
    // console.log(
    //   "result in add to",
    //   result,
    //   items,
    //   product.id
    //   // product?.quantity < result?.stock,
    //   // result?.quantity,
    //   // "item",
    //   // item
    // );
    const { variants, categories, description, ...updatedProduct } = product;

    if (result !== undefined) {
      if (
        result?.quantity + item <=
        (product?.variants?.length > 0
          ? product?.variant?.quantity
          : product?.stock)
      ) {
        addItem(updatedProduct, item);
        notifySuccess(`${item} ${currentLang ? product.title?.he : product.title?.en} ${t("common:addedToCart!")}`);
      } else {
        notifyError(t("common:productStockOut"));
      }
    } else {
      if (
        item <=
        (product?.variants?.length > 0
          ? product?.variant?.quantity
          : product?.stock)
      ) {
        addItem(updatedProduct, item);
        notifySuccess(`${item} ${currentLang ? product.title?.he : product.title?.en} ${t("common:addedToCart!")}`);
      } else {
        notifyError(t("common:productStockOut"));
      }
    }
  };

  const handleIncreaseQuantity = (product) => {
    const result = items?.find((p) => p.id === product.id);
    // console.log(
    //   "handleIncreaseQuantity",
    //   product,
    //   result?.quantity + item,
    //   product?.variants?.length > 0
    //     ? product?.variant?.quantity
    //     : product?.stock
    // );
    if (result) {
      if (
        result?.quantity + item <=
        (product?.variants?.length > 0
          ? product?.variant?.quantity
          : product?.stock)
      ) {
        updateItemQuantity(product.id, product.quantity + 1);
      } else {
        notifyError(t("common:productStockOut"));
      }
    }
  };

  return {
    setItem,
    item,
    handleAddItem,
    handleIncreaseQuantity,
  };
};

export default useAddToCart;
