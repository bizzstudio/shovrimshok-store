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
  
  // מחיר בסיסי
  return product?.Price ?? product?.prices?.price ?? 0;
};

export default getProductPrice; 