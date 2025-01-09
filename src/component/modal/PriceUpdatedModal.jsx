// PriceUpdatedModal.jsx
import React from "react";
import useTranslation from "next-translate/useTranslation";
// אפשר להחליף בתמונה אחרת לבחירתך
import newPriceImage from "public/update product.svg";
import CartItemPreview from "@component/cart/CartItemPreview";

const PriceUpdatedModal = ({ priceUpdatedItems = [], closeModal = () => { } }) => {
    const { t } = useTranslation();
    const count = priceUpdatedItems.length;

    return (
        <div className="flex flex-col w-fit justify-center items-center">
            <img src={newPriceImage.src} alt="Price Updated image" className="w-[85px]" />
            <h1 className="text-[22px] font-bold text-customGreen mt-4 mb-2 text-center">
                {/* "למוצרים הבאים עודכן המחיר" עם משתנה count */}
                {t("common:priceUpdatedForProducts", { count })}
            </h1>
            <ul className="text-right">
                {priceUpdatedItems.map((conflictItem, index) => (
                    /* שים לב שהוספנו כאן .product כי במערך הקונפליקטים 
                       אנחנו שומרים: { product, clientPrice, serverPrice } */
                    <CartItemPreview key={index} item={conflictItem.product} />
                ))}
            </ul>
            <button onClick={closeModal}
                className="w-full mt-3 flex items-center justify-center font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap">
                {t("common:ok")}
            </button>
        </div>
    );
};

export default PriceUpdatedModal;
