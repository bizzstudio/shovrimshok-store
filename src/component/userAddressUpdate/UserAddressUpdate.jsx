// src/component/userAddressUpdate/UserAddressUpdate.jsx
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import React, { useContext, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { RxUpdate } from "react-icons/rx";

// Internal import
import Label from "@component/form/Label";
import Error from "@component/form/Error";
import Dashboard from "@pages/user/dashboard";
import InputArea from "@component/form/InputArea";
import CustomerServices from "@services/CustomerServices";
import { UserContext } from "@context/UserContext";
import Uploader from "@component/image-uploader/Uploader";
import { notifySuccess, notifyError } from "@utils/toast";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import City from "@component/select/City";
import updateProfileTitle from "public/titles/updateProfileTitle.svg"
import notifyApiResponse from "@utils/notifyApiResponse";
import MainBT from "@component/button/MainBT";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";

const UserAddressUpdate = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [billToCityValue, setBillToCityValue] = useState("");
  const [shipToCityValue, setShipToCityValue] = useState("");
  const {
    state: { userInfo },
  } = useContext(UserContext);
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm();

  const validateInput = (data) => {
    if (!data.CardName?.trim()) {
      setError('CardName', { type: 'manual', message: t('common:invalidName') });
      return false;
    }
    if (!data.BillToAddress?.trim()) {
      setError('BillToAddress', { type: 'manual', message: t('common:invalidStreet') });
      return false;
    }
    if (!data.BillToCity?.trim()) {
      setError('BillToCity', { type: 'manual', message: t('common:invalidCity') });
      return false;
    }
    if (!data.EmailAddress?.trim()) {
      setError('EmailAddress', { type: 'manual', message: t('common:invalidEmail') });
      return false;
    }
    if (!data.Phone1?.trim()) {
      setError('Phone1', { type: 'manual', message: t('common:invalidPhone') });
      return false;
    }
    return true;
  };

  const onSubmit = (data) => {
    setLoading(true);

    if (!validateInput(data)) {
      setLoading(false);
      return;
    }

    const userData = {
      CardName: data.CardName,
      EmailAddress: data.EmailAddress,
      Phone1: data.Phone1,
      Cellular: data.Cellular,
      // BillToAddress: {
      //   Address: data.BillToAddress,
      //   City: data.BillToCity,
      //   ZipCode: data.BillToZipCode,
      //   Country: "IL"
      // },
      ShipToAddress: {
        Address: data.ShipToAddress,
        City: data.ShipToCity,
        ZipCode: data.ShipToZipCode,
        Country: "IL"
      },
      FederalTaxID: data.FederalTaxID,
      Picture: imageUrl,
    };

    CustomerServices.updateCustomer(userInfo.CardCode, userData)
      .then((res) => {
        if (res) {
          setLoading(false);
          notifyApiResponse(res, true);
          Cookies.set("userInfo", JSON.stringify(res));
          window.location.reload();
        }
      })
      .catch((err) => {
        setLoading(false);
        notifyApiResponse(err, false);
      });
  };

  useEffect(() => {
    if (userInfo) {
      setValue("CardName", userInfo.CardName || "");
      setValue("EmailAddress", userInfo.EmailAddress || "");
      setValue("Phone1", userInfo.Phone1 || "");
      setValue("Cellular", userInfo.Cellular || "");
      setValue("FederalTaxID", userInfo.FederalTaxID || "");

      // Bill To Address
      setValue("BillToAddress", userInfo.BillToAddress?.Address || "");
      setValue("BillToCity", userInfo.BillToAddress?.City || "");
      setValue("BillToZipCode", userInfo.BillToAddress?.ZipCode || "");
      setBillToCityValue(userInfo.BillToAddress?.City || "");

      // Ship To Address
      setValue("ShipToAddress", userInfo.ShipToAddress?.Address || "");
      setValue("ShipToCity", userInfo.ShipToAddress?.City || "");
      setValue("ShipToZipCode", userInfo.ShipToAddress?.ZipCode || "");
      setShipToCityValue(userInfo.ShipToAddress?.City || "");

      setImageUrl(userInfo.Picture || "");
    }
  }, [setValue, userInfo]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 sm:gap-6">
      <ShapiraTitle text={t("common:updateAddressTitle")} height={70} key="updateAddressTitle" />

      {/* תמונה */}
      <div className="w-full">
        <Label label={t("common:image")} />
        <div className="mt-1 flex items-center">
          <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
        </div>
      </div>

      <div className="w-full grid grid-cols-6 gap-4">
        {/* שם כרטיס לקוח */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:cardName")}
            name="CardName"
            type="text"
            placeholder={t("common:cardName")}
          />
          <Error errorName={errors.CardName} />
        </div>

        {/* מספר ת.ז או מספר עוסק */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:idNumberOrLicense")}
            name="FederalTaxID"
            type="text"
            placeholder={t("common:idNumberOrLicense")}
          />
          <Error errorName={errors.FederalTaxID} />
        </div>

        {/* כתובת אימייל */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:email")}
            name="EmailAddress"
            type="email"
            placeholder={t("common:email")}
          />
          <Error errorName={errors.EmailAddress} />
        </div>

        {/* טלפון 1 */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:phone1")}
            name="Phone1"
            type="text"
            placeholder={t("common:phone1")}
          />
          <Error errorName={errors.Phone1} />
        </div>

        {/* טלפון נייד */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:cellular")}
            name="Cellular"
            type="text"
            placeholder={t("common:cellular")}
            isRequired={false}
          />
          <Error errorName={errors.Cellular} />
        </div>

        {/* כתובת חיוב */}
        {/* <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:address")}
            name="BillToAddress"
            type="text"
            placeholder={t("common:address")}
          />
          <Error errorName={errors.BillToAddress} />
        </div> */}

        {/* עיר חיוב */}
        {/* <div className="col-span-6 sm:col-span-3">
          <Label label={t("common:city")} isRequired className="mb-0" />
          <City
            setValue={(cityName) => {
              setValue("BillToCity", cityName);
              setBillToCityValue(cityName);
            }}
            value={billToCityValue}
            placeholder={JSON.stringify({ city_name_he: t("common:city") })}
          />
          <Error errorName={errors.BillToCity} />
        </div> */}

        {/* מיקוד חיוב */}
        {/* <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:zipCode")}
            name="BillToZipCode"
            type="text"
            placeholder={t("common:zipCode")}
            isRequired={false}
          />
          <Error errorName={errors.BillToZipCode} />
        </div> */}

        {/* עיר משלוח */}
        <div className="col-span-6 sm:col-span-3">
          <Label label={t("common:mailCity")} isRequired={false} className="mb-0" />
          <City
            setValue={(cityName) => {
              setValue("ShipToCity", cityName);
              setShipToCityValue(cityName);
            }}
            value={shipToCityValue}
            placeholder={JSON.stringify({ city_name_he: t("common:mailCity") })}
          />
          <Error errorName={errors.ShipToCity} />
        </div>

        {/* כתובת משלוח */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:mailAddress")}
            name="ShipToAddress"
            type="text"
            placeholder={t("common:mailAddress")}
            isRequired={false}
          />
          <Error errorName={errors.ShipToAddress} />
        </div>

        {/* מיקוד משלוח */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:mailZipCode")}
            name="ShipToZipCode"
            type="text"
            placeholder={t("common:mailZipCode")}
            isRequired={false}
          />
          <Error errorName={errors.ShipToZipCode} />
        </div>
      </div>

      <div className="w-full">
        {loading ? (
          <MainBT
            disabled={true}
            type="submit"
            className="w-full"
          >
            <img
              src="/loader/spinner.gif"
              alt="Loading"
              width={20}
              height={10}
              className="saturate-0"
            />
            <span className="ms-0.5">
              {t("common:processing")}
            </span>
          </MainBT>
        ) : (
          <MainBT
            disabled={loading}
            type="submit"
            className="w-full"
          >
            <RxUpdate className="me-1 mt-[1px]" size={17} />
            {showingTranslateValue(
              storeCustomizationSetting?.dashboard?.update_button
            )}
          </MainBT>
        )}
      </div>
    </form>
  );
};

export default UserAddressUpdate;
