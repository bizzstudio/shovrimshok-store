// src/component/user/DocumentCard.jsx
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import { FaRegFilePdf } from "react-icons/fa6";
import { getStatusColor } from "@component/order/OrderHistory";
import 'dayjs/locale/he';
// import PDFDownloadButton from "@component/PDFDownloadButton/PDFDownloadButton";

const DocumentCard = ({ document, docType, PDFDownloadComponent }) => {
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

    // Get document type translation
    const getDocTypeName = () => {
        switch (docType) {
            case "quotations": return t("common:quotation");
            case "orders": return t("common:order");
            case "deliveries": return t("common:delivery");
            case "returns": return t("common:return");
            case "invoices": return t("common:invoice");
            case "creditNotes": return t("common:creditNote");
            case "payments": return t("common:payment");
            case "marketingDoc": {
                // For combined docs, try to determine the type
                if (document.PaidToDate !== undefined) {
                    return t("common:invoice");
                } else if (document.DocTotal < 0) {
                    return t("common:creditNote");
                } else if (document.DocDueDate && document.PaidToDate === undefined) {
                    return t("common:quotation");
                } else if (document.DocDueDate) {
                    return t("common:order");
                } else if (document.Comments !== undefined && !document.DocDueDate) {
                    return t("common:delivery");
                } else if (document.DocTotal < 0 || (document.Comments !== undefined && document.DocTotal <= 0)) {
                    return t("common:return");
                }
                return t("common:document");
            }
            default: return t("common:document");
        }
    };

    // Get document amount based on type
    const getAmount = () => {
        if (docType === "payments") {
            // For payments, sum the cash and transfer amounts
            const total = (document.CashSum || 0) + (document.TransferSum || 0);
            return total.toFixed(2);
        } else {
            // For other document types, use DocTotal
            return document.DocTotal?.toFixed(2) || "";
        }
    };

    const amount = getAmount();

    // Get document status text
    const getStatusText = () => {
        if (docType === "payments") {
            return document.Remarks || "-";
        } else if (docType === "orders" && document.U_PICKUP) {
            // For orders, show U_PICKUP status
            return displayValue(document.U_PICKUP);
        } else if ((docType === "invoices" || docType === "creditNotes") && document.PaidToDate !== undefined) {
            // For invoices and credit notes, check if fully paid
            const docTotal = Math.abs(document.DocTotal || 0);
            const paidToDate = Math.abs(document.PaidToDate || 0);

            if (Math.abs(docTotal - paidToDate) < 0.01) {
                return t("common:paid");
            } else if (paidToDate > 0) {
                return t("common:partiallyPaid");
            } else {
                return t("common:unpaid");
            }
        } else {
            return document.DocumentStatus === "bost_Open" ? t("common:open") : t("common:close");
        }
    };

    // Get CSS class for status text
    const getStatusClass = () => {
        if (docType === "payments") {
            return "text-gray-600";
        } else if (docType === "orders" && document.U_PICKUP) {
            // For orders, use the status color function
            return `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.U_PICKUP)}`;
        } else if ((docType === "invoices" || docType === "creditNotes") && document.PaidToDate !== undefined) {
            const docTotal = Math.abs(document.DocTotal || 0);
            const paidToDate = Math.abs(document.PaidToDate || 0);

            if (Math.abs(docTotal - paidToDate) < 0.01) {
                return "px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800";
            } else if (paidToDate > 0) {
                return "px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800";
            } else {
                return "px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800";
            }
        } else {
            return document.DocumentStatus === "bost_Open"
                ? "px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                : "px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800";
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
            {/* כותרת עם מספר מסמך וסוג */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {t("common:DocNum")}: {displayValue(document.DocNum)}
                    </h3>
                    <p className="text-sm text-gray-600 font-semibold">
                        {t("common:DocType")}: {getDocTypeName()}
                    </p>
                </div>
                <span className={getStatusClass()}>
                    {getStatusText()}
                </span>
            </div>

            {/* פרטי המסמך */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <span className="text-xs text-gray-500 font-medium">{t("common:DocDate")}</span>
                    <p className="text-sm font-medium text-gray-800">{formatDate(document.DocDate)}</p>
                </div>

                {/* סה״כ */}
                {amount && (
                    <div>
                        <span className="text-xs text-gray-500 font-medium">
                            {docType === "payments" ? t("common:Amount") : t("common:DocTotal")}
                        </span>
                        <p className="text-sm text-customRed font-semibold">
                            {amount} {document.DocCurrency || "₪"}
                        </p>
                    </div>
                )}

                {docType === "payments" && (
                    <div className="col-span-2">
                        <span className="text-xs text-gray-500 font-medium">{t("common:Remarks")}</span>
                        <p className="text-sm font-medium text-gray-800">{document.Remarks || "-"}</p>
                    </div>
                )}
            </div>

            {/* כפתור PDF */}
            {/* <div className="flex justify-end pt-3 border-t border-gray-100">
                <PDFDownloadButton
                    type={document._docType}
                    DocNum={document.DocNum}
                    name={`${docType}_${document.DocNum}`}
                />
            </div> */}
        </div>
    );
};

export default DocumentCard;