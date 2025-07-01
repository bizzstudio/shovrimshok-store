// src/component/common/Stock.js
import useTranslation from "next-translate/useTranslation";
import dayjs from "dayjs";

const Stock = ({ stock, card, top = 2, right = 2, arrivalDate }) => {
  const { t } = useTranslation();

  const arrivalDateFormatted = arrivalDate ? dayjs(arrivalDate).format("DD/MM/YYYY") : null;

  return (
    <>
      {stock <= 0 ? (
        <span className={`${card
          ? `bg-red-100 absolute top-2 right-2 z-10 text-red-700 rounded-full text-xs px-2 py-0.5 font-medium`
          : `bg-red-100 text-red-700 rounded-full inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium font-serif`
          }`}>
          {/* {t("common:stockOut")} */}
          {arrivalDateFormatted ? `${t("common:backInStock")} ${arrivalDateFormatted}` : ""}
        </span>
      ) : (
        <>
          <span
            className={`${card
              ? `bg-gray-100 absolute top-2 right-2 z-10 text-green-500 rounded-full text-xs px-2 py-0.5 font-medium`
              : `bg-green-100 text-green-500 rounded-full inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold font-serif`
              }`}
          >
            {t("common:stock")}
            :
            <span className="text-mainColor-dark pl-1 font-bold">&nbsp;{stock}</span>
          </span>
        </>
      )}
    </>
    // <></>
  );
};

export default Stock;