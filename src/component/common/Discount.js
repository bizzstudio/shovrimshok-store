// src/component/common/Discount.js
import useUtilsFunction from "@hooks/useUtilsFunction";
import useTranslation from "next-translate/useTranslation";
import { FaGift } from "react-icons/fa6";

const Discount = ({ discount, product, slug, modal, card, title = '', search, noMargin = false }) => {
  const { getNumber } = useUtilsFunction();
  const { t } = useTranslation();

  // Check if product has special price discount
  const discountPercent = product?.hasSpecialPrice && product?.specialPrice?.discountPercent;

  return (
    <>
      {title ? (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-mainColor-glow to-mainColor rounded-lg shadow-sm">
          <FaGift size={12} />
          {title}
        </span>
      ) : (
        <>
          {typeof discountPercent === 'number' && discountPercent > 1 && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-mainColor to-mainColor-glow rounded-lg shadow-sm ${modal ? 'absolute end-0 -top-2 outline outline-[8px] outline-white' :
              slug ? 'absolute -start-2 -top-1 outline outline-[8px] outline-white' :
                search ? 'mt-1' :
                  card ? 'absolute start-3 top-3 z-10 outline outline-[7px] outline-white'
                    : ''}`}>
              <FaGift size={12} />
              {Number(Number(discountPercent).toFixed(2))}% {t("common:off")}
            </span>
          )}
        </>
      )}
    </>
  );
};

export default Discount;