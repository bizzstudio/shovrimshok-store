// src/utils/priceUtils.js
// מירור של הלוגיקה שב-shovrimshok-backend/utils/priceUtils.js.
// קריטי לשמור על אותה לוגיקה כדי שלא יווצרו priceConflicts בין הסטור לבקאנד.

const VAT_PERCENTAGE = Number(process.env.NEXT_PUBLIC_VAT_PERCENTAGE) > 0
  ? Number(process.env.NEXT_PUBLIC_VAT_PERCENTAGE)
  : 18;

const getCatalogVatMultiplier = (product) => {
  // כש-isVatFree === false המחיר בקטלוג נחשב לפני מע"מ ומוכפל בחישוב ללקוח.
  // אחרת (true / undefined) - המחיר נשאר כפי שהוא.
  if (!product || product.isVatFree !== false) return 1;
  return 1 + VAT_PERCENTAGE / 100;
};

const roundMoney = (n) => Math.round(Number(n) * 100) / 100;

const buildPricingFromRow = (product, row) => {
  if (!row) {
    return {
      price: 0,
      salePrice: null,
      originalPrice: 0,
      warehousePrice: null,
      purchaseLimit: null,
      priceList: null,
    };
  }
  const mult = getCatalogVatMultiplier(product);
  const list = roundMoney((Number(row.price) || 0) * mult);
  const rawSale = row.salePrice;
  const saleNum =
    rawSale != null && rawSale !== "" && Number.isFinite(Number(rawSale))
      ? Number(rawSale)
      : null;
  const hasSale =
    saleNum != null && saleNum > 0 && saleNum < (Number(row.price) || 0);
  const sale = hasSale ? roundMoney(saleNum * mult) : null;
  return {
    price: list,
    salePrice: sale,
    originalPrice: list,
    warehousePrice:
      row.warehousePrice != null && row.warehousePrice !== ""
        ? roundMoney(Number(row.warehousePrice) * mult)
        : null,
    purchaseLimit: row.purchaseLimit ?? null,
    priceList: row.priceList,
  };
};

/**
 * מחזיר את אובייקט המחירים של המוצר בהתאמה ללקוח (מחירון + מע"מ).
 * @param {Object} product - אובייקט המוצר עם prices: Array
 * @param {Object|null} customer - userInfo של הלקוח
 */
export const getUserPrice = (product, customer = null) => {
  if (!product || !Array.isArray(product.prices) || product.prices.length === 0) {
    return {
      price: 0,
      salePrice: null,
      originalPrice: 0,
      warehousePrice: null,
      purchaseLimit: null,
      priceList: null,
    };
  }

  // המחירון של הלקוח (customer.priceList) - נטען לאחר login
  let customerPriceList = null;
  if (customer) {
    customerPriceList = customer.priceList || customer?.mainCustomer?.priceList;
  }

  if (customerPriceList) {
    const customerPriceListId = String(
      typeof customerPriceList === "object" ? customerPriceList._id || customerPriceList : customerPriceList
    );
    const customerPrice = product.prices.find((p) => {
      if (!p.priceList) return false;
      if (typeof p.priceList === "object" && p.priceList._id) {
        return String(p.priceList._id) === customerPriceListId;
      }
      return String(p.priceList) === customerPriceListId;
    });
    if (customerPrice) {
      return buildPricingFromRow(product, customerPrice);
    }
  }

  // fallback: מחירון default
  const defaultPrice = product.prices.find((p) => {
    if (!p.priceList) return false;
    if (typeof p.priceList === "object" && p.priceList.isDefault !== undefined) {
      return p.priceList.isDefault === true;
    }
    return false;
  });
  if (defaultPrice) {
    return buildPricingFromRow(product, defaultPrice);
  }

  // fallback אחרון: מחיר ראשון
  return buildPricingFromRow(product, product.prices[0]);
};

/**
 * מחיר סופי להצגה / להזמנה - אם יש salePrice בתוקף, מחזיר אותו, אחרת price.
 */
export const getFinalPrice = (product, customer = null) => {
  const { price, salePrice } = getUserPrice(product, customer);
  return salePrice && salePrice > 0 ? salePrice : price;
};

export default { getUserPrice, getFinalPrice };
