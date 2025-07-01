// src/utils/getCustomPrice.js
const getCustomPrice = (product, user, storeSetting) => {
  // If user is logged in, use their PriceListNum
  if (user && user.PriceListNum) {
    const userPriceList = product.ItemPrices?.find(price => price.PriceList === user.PriceListNum);
    if (userPriceList) {
      return {
        price: userPriceList.Price,
        specialPrice: product?.hasSpecialPrice && product?.specialPrice?.price,
        currency: userPriceList.Currency || userPriceList.Price ? "₪" : ""
      };
    }
  }

  // If no user or no matching price list, check store settings
  if (storeSetting?.price_display_status) {
    const priceListNum = storeSetting.price_list_num;
    const storePriceList = product.ItemPrices?.find(price => price.PriceList === priceListNum);
    if (storePriceList) {
      return {
        price: storePriceList.Price,
        specialPrice: product?.hasSpecialPrice && product?.specialPrice?.price,
        currency: storePriceList.Currency || storePriceList.Price ? "₪" : ""
      };
    }
  }

  // If no price should be displayed or no matching price list found
  return {
    price: "",
    specialPrice: "",
    currency: ""
  };
};

export default getCustomPrice;