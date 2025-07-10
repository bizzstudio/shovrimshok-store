// src/component/user/DocumentHistoryItem.jsx
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import 'dayjs/locale/he'; // Import Hebrew date localization
import { getStatusColor } from "@component/order/OrderHistory";

const DocumentHistoryItem = ({ document, docType }) => {
    const { t } = useTranslation();
    const [dateFormat, setDateFormat] = useState("D/MM/YYYY"); // Default format

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

    // Change time format based on screen size
    useEffect(() => {
        const updateDateFormat = () => {
            if (window.innerWidth <= 768) {
                setDateFormat("D/MM/YY"); // Two-digit year format for small screens
            } else {
                setDateFormat("D/MM/YYYY"); // Regular format for large screens
            }
        };

        updateDateFormat(); // Initial call on load
        window.addEventListener("resize", updateDateFormat); // Listen for screen size changes

        return () => {
            window.removeEventListener("resize", updateDateFormat);
        };
    }, []);

    // Function to display a dash for missing values
    const displayValue = (value) => {
        if (value === null || value === undefined || value === "null") {
            return "-";
        }
        return value;
    };

    // Format date
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
            return document.DocTotal?.toFixed(2) || "-";
        }
    };

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
                return "text-green-500";
            } else if (paidToDate > 0) {
                return "text-amber-500";
            } else {
                return "text-red-500";
            }
        } else {
            return document.DocumentStatus === "bost_Open" ? "text-green-500" : "text-red-500";
        }
    };

    return (
        <>
            <td className="px-1 md:px-5 py-3 leading-6 whitespace-nowrap justify-center md:flex hidden">
                <span className="uppercase text-sm font-medium">
                    {displayValue(document.DocNum)}
                </span>
            </td>
            {/* <td className="px-1 md:px-5 py-3 leading-6 text-center whitespace-nowrap">
                <span className="text-sm">
                    {getDocTypeName()}
                </span>
            </td> */}
            <td className="px-1 md:px-5 py-3 leading-6 text-center whitespace-nowrap">
                <span className="text-sm">
                    {formatDate(document.DocDate)}
                </span>
            </td>
            <td className="px-1 md:px-5 py-3 leading-6 text-center whitespace-nowrap md:block hidden">
                <span className="text-sm">{getAmount()} {document.DocCurrency || ""}</span>
            </td>
            <td className={`text-sm max-w-[10vw] overflow-hidden truncate px-1 md:px-5 py-3 leading-6 text-center whitespace-nowrap`}>
                {docType === "orders" && document.U_PICKUP ? (
                    <span className={getStatusClass()}>
                        {getStatusText()}
                    </span>
                ) : (
                    <span className={getStatusClass()}>
                        {getStatusText()}
                    </span>
                )}
            </td>
        </>
    );
};

export default DocumentHistoryItem;