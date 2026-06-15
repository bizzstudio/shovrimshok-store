// פונקציה לחילוץ מחיר המוצר עם תמיכה במחירים מותאמים
const getProductPrice = (product, userInfo = null, storeSetting = null) => {
  // אם יש מחיר מיוחד
  if (product?.hasSpecialPrice && product?.specialPrice) {
    return product.specialPrice.price || 0;
  }
  
  // אם יש מחירים מותאמים למשתמש
  if (userInfo && userInfo.PriceListNum) {
    const userPriceList = product.ItemPrices?.find(price => price.PriceList === userInfo.PriceListNum);
    if (userPriceList) {
      return userPriceList.Price || 0;
    }
  }
  
  // מחיר בסיסי - prices הוא מערך (priceList rows)
  const firstPriceEntry = Array.isArray(product?.prices) ? product.prices[0] : null;
  return product?.Price ?? firstPriceEntry?.salePrice ?? firstPriceEntry?.price ?? 0;
};

export default getProductPrice; 