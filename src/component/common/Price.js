// src/component/common/Price.js
import useUtilsFunction from "@hooks/useUtilsFunction";
import getCustomPrice from "@utils/getCustomPrice";
import { useContext } from "react";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import useTranslation from "next-translate/useTranslation";

const Price = ({ product, price, card, currency, originalPrice }) => {
  // console.log("price", price, "originalPrice", originalPrice, "card", card);
  const { getNumberTwo } = useUtilsFunction();
  const { state: { userInfo } } = useContext(UserContext);
  const { storeSetting } = useGetSetting();
  const { t } = useTranslation();

  const { price: customPrice, currency: customCurrency } = getCustomPrice(product, userInfo, storeSetting);

  // Use special price if available, otherwise use custom price or regular price
  const displayPrice = product?.hasSpecialPrice && product?.specialPrice
    ? product.specialPrice.price
    : customPrice || price;

  const displayOriginalPrice = product?.hasSpecialPrice && product?.specialPrice
    ? customPrice || product?.Price
    : originalPrice;

  const showOriginalPrice = displayOriginalPrice && displayOriginalPrice > displayPrice;

  return (
    <div className="flex gap-2 items-center font-serif product-price font-bold">
      {product?.isCombination ? (
        <>
          <span
            className={
              card
                ? "inline-block text-lg font-semibold text-gray-800"
                : "inline-block text-2xl"
            }
          >
            {customCurrency}
            {displayPrice ? getNumberTwo(displayPrice) : ""}
          </span>
          {showOriginalPrice && (
            <del
              className={
                card
                  ? "sm:text-sm font-normal text-base text-gray-400"
                  : "text-lg font-normal text-gray-400"
              }
            >
              {customCurrency || currency}
              {getNumberTwo(displayOriginalPrice)}
            </del>
          )}
        </>
      ) : (
        <>
          <span
            className={
              card
                ? "inline-block text-lg font-semibold text-gray-800"
                : "inline-block text-2xl"
            }
          >
            {customCurrency}
            {displayPrice ? getNumberTwo(displayPrice) : ""}
          </span>
          {showOriginalPrice && (
            <del
              className={
                card
                  ? "sm:text-sm font-normal text-base text-gray-400 ml-1"
                  : "text-lg font-normal text-gray-400 ml-1"
              }
            >
              {customCurrency}
              {getNumberTwo(displayOriginalPrice)}
            </del>
          )}
        </>
      )}
    </div>
  );
};

export default Price;
