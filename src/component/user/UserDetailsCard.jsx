// src/components/user/UserDetailsCard.jsx
import React, { useContext } from "react";
import { UserContext } from "@context/UserContext";
import useTranslation from "next-translate/useTranslation";

const UserDetailsCard = () => {
    const { t } = useTranslation();
    const {
        state: { userInfo },
    } = useContext(UserContext);

    if (!userInfo) return null;

    return (
        <div className="border rounded-md p-6 mb-8 bg-gray-50">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">
                {t("common:user_details")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-right">
                <div>
                    <span className="font-semibold">{t("common:customer_name")}:</span>{" "}
                    {userInfo?.CardName?.replace(/"/g, "")}
                </div>
                {/* <div>
                    <span className="font-semibold">{t("common:customer_code")}:</span>{" "}
                    {userInfo?.CardCode}
                </div> */}
                <div>
                    <span className="font-semibold">{t("common:email")}:</span>{" "}
                    {userInfo?.EmailAddress}
                </div>
                <div>
                    <span className="font-semibold">{t("common:phone")}:</span>{" "}
                    {userInfo?.Phone1 || userInfo?.Cellular}
                </div>
                {/* <div>
                    <span className="font-semibold">{t("common:bill_to_address")}:</span>{" "}
                    {userInfo?.BillToAddress?.Address}
                </div>
                <div>
                    <span className="font-semibold">{t("common:bill_to_city")}:</span>{" "}
                    {userInfo?.BillToAddress?.City}
                </div>
                <div>
                    <span className="font-semibold">{t("common:bill_to_zip")}:</span>{" "}
                    {userInfo?.BillToAddress?.ZipCode}
                </div> */}
                <div>
                    <span className="font-semibold">{t("common:ship_to_address")}:</span>{" "}
                    {userInfo?.ShipToAddress?.Address}
                </div>
                <div>
                    <span className="font-semibold">{t("common:ship_to_city")}:</span>{" "}
                    {userInfo?.ShipToAddress?.City}
                </div>
                <div>
                    <span className="font-semibold">{t("common:ship_to_zip")}:</span>{" "}
                    {userInfo?.ShipToAddress?.ZipCode}
                </div>
                <div>
                    <span className="font-semibold">{t("common:federal_tax_id")}:</span>{" "}
                    {userInfo?.FederalTaxID}
                </div>
                <div>
                    <span className="font-semibold">{t("common:balance")}:</span>{" "}
                    <span dir='ltr'>{userInfo?.Currency} {userInfo?.Balance}</span>
                </div>
                {/* <div>
                    <span className="font-semibold">{t("common:group_code")}:</span>{" "}
                    {userInfo?.GroupCode}
                </div>
                <div>
                    <span className="font-semibold">{t("common:price_list")}:</span>{" "}
                    {userInfo?.PriceListNum}
                </div> */}
            </div>
        </div>
    );
};

export default UserDetailsCard;