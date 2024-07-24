import useUtilsFunction from "@hooks/useUtilsFunction";
import useTranslation from "next-translate/useTranslation";

const Discount = ({ discount, product, slug, modal, title = '', search }) => {
  const { getNumber } = useUtilsFunction();
  const { t } = useTranslation();

  const price = product?.isCombination
    ? getNumber(product?.variants[0]?.price)
    : getNumber(product?.prices?.price);
  const originalPrice = product?.isCombination
    ? getNumber(product?.variants[0]?.originalPrice)
    : getNumber(product?.prices?.originalPrice);

  // const discountPercentage = price > 0 ? getNumber(
  //   ((originalPrice - price) / originalPrice) * 100
  // ) : null;
  const discountPercentage = getNumber(
    ((originalPrice - price) / originalPrice) * 100
  );

  return (
    <>
      {title ? <span className={
        modal
          ? "absolute text-dark text-sm bg-customGreen text-white text-center py-1 px-2 rounded font-medium z-10 left-4 top-4"
          : slug
            ? "text-dark text-sm bg-customGreen text-white text-center py-1 px-2 rounded font-medium z-10 flex w-fit"
            : search 
            ? "text-customGreen-darker text-sm text-center font-medium"
            : "w-full flex items-center justify-center text-center text-customGreen-dark text-xs bg-customGreen-light text-customGreen-darker py-2 px-2 m-2 rounded font-medium"
      }  >
        {title}
      </span> :
        <>
          {discount > 1 && (
            <span
              className={
                modal
                  ? "absolute text-dark text-sm bg-customGreen text-white text-center py-1 px-2 rounded font-medium z-10 left-4 top-4"
                  : slug
                    ? "text-dark text-sm bg-customGreen text-white text-center py-1 px-2 rounded font-medium z-10 flex w-fit"
                    : "w-full flex items-center justify-center text-center text-customGreen-dark text-xs bg-customGreen-light text-customGreen-darker py-2 px-2 m-2 rounded font-medium"
              }
            >

              {discount}% {t("common:off")}
            </span>
          )}
          {discount === undefined && discountPercentage > 1 && (
            <span
              className={
                modal
                  ? "absolute text-dark text-sm bg-customGreen text-white text-center py-1 px-2 rounded font-medium z-10 left-4 top-4"
                  : slug
                    ? "text-dark text-sm bg-customGreen text-white text-center py-1 px-2 rounded font-medium z-10 flex w-fit"
                    : "w-full flex items-center justify-center text-center text-customGreen-dark text-xs bg-customGreen-light text-customGreen-darker py-2 px-2 m-2 rounded font-medium"
              }
            >
              {/* {Number(product.prices.discount).toFixed(0)}% Off */}
              {discountPercentage} % {t("common:off")}
            </span>
          )}
        </>}
    </>
  );
};

export default Discount;
