// src/component/order/OrderCard.jsx
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import Link from "next/link";
import { MdRestore, MdPayment } from "react-icons/md";
import { FiZoomIn } from "react-icons/fi";
import { getStatusColor, getStatusText, shouldShowPrice } from "./OrderHistory";
import 'dayjs/locale/he';

const OrderCard = ({ order, restoreOrder, loadingRestore }) => {
    const { t } = useTranslation();
    const [dateFormat, setDateFormat] = useState("D/MM/YY");

    let currentLang = Cookies.get('_lang');

    switch (currentLang) {
        case 'he':
            dayjs.locale('he');
            break;
        case 'en':
            dayjs.locale('en');
            break;
        default:
            dayjs.locale('en');
            break;
    }

    useEffect(() => {
        const updateDateFormat = () => {
            setDateFormat("D/MM/YY"); // פורמט קצר למסכים קטנים
        };

        updateDateFormat();
        window.addEventListener("resize", updateDateFormat);

        return () => {
            window.removeEventListener("resize", updateDateFormat);
        };
    }, []);

    const displayValue = (value) => {
        if (value === null || value === undefined || value === "null") {
            return "-";
        }
        return value;
    };

    const formatDate = (value) => {
        return value ? dayjs(value).format(dateFormat) : "-";
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
            {/* כותרת עם מספר הזמנה */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                    {t("common:DocNum")}: {displayValue(order.DocNum)}
                </h3>
                <span title={getStatusText(order.DocumentStatus, t)} className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.DocumentStatus)}`}>
                    {getStatusText(order.DocumentStatus, t)}
                </span>
            </div>

            {/* פרטי ההזמנה */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <span className="text-xs text-gray-500 font-medium">{t("common:CreateDate")}</span>
                    <p className="text-sm font-medium text-gray-800">{formatDate(order.CreateDate)}</p>
                </div>

                <div>
                    <span className="text-xs text-gray-500 font-medium">{t("common:VatSum")}</span>
                    <p className="text-sm font-medium text-gray-800">
                        {shouldShowPrice(order.DocumentStatus) 
                            ? `${order.VatSum?.toFixed(2)} ${order.DocCurrency || "₪"}`
                            : "-"
                        }
                    </p>
                </div>

                <div>
                    <span className="text-xs text-gray-500 font-medium">{t("common:DocTotalBeforeVAT")}</span>
                    <p className="text-sm font-medium text-gray-800">
                        {shouldShowPrice(order.DocumentStatus) 
                            ? `${(order.DocTotal - order.VatSum || 0)?.toFixed(2)} ${order.DocCurrency || "₪"}`
                            : "-"
                        }
                    </p>
                </div>

                <div>
                    <span className="text-xs text-gray-500 font-medium">{t("common:DocTotal")}</span>
                    <p className="text-sm text-customRed font-semibold">
                        {shouldShowPrice(order.DocumentStatus) 
                            ? `${order.DocTotal?.toFixed(2)} ${order.DocCurrency || "₪"}`
                            : "-"
                        }
                    </p>
                </div>
            </div>

            {/* כפתורי פעולה */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
                {order?.status?.name === "Pending" ? (
                    <button
                        disabled={loadingRestore}
                        className="flex-1 flex gap-1 items-center justify-center px-3 py-2 bg-customRed-superLight text-sm text-customRed hover:bg-customRed hover:text-white transition-all font-semibold rounded-lg"
                        onClick={(e) => { e.stopPropagation(); restoreOrder(order); }}
                    >
                        <MdPayment size={18} />
                        {t("common:payNow")}
                    </button>
                ) : (
                    <>
                        <button
                            disabled={loadingRestore}
                            className="flex-1 flex gap-1 items-center justify-center px-3 py-2 bg-customRed-superLight text-sm text-customRed hover:bg-customRed hover:text-white transition-all font-semibold rounded-lg"
                            onClick={(e) => { e.stopPropagation(); restoreOrder(order); }}
                        >
                            <MdRestore size={18} />
                            {t("common:Reorder")}
                        </button>
                        <Link
                            href={`/order/${order.DocEntry}`}
                            className="flex-1 flex gap-1 items-center justify-center px-3 py-2 bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition-all font-semibold rounded-lg"
                        >
                            <FiZoomIn size={18} />
                            {t("common:view")}
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderCard;