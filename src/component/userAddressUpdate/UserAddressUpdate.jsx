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
  const [cityValue, setCityValue] = useState("");
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
    if (!data.Address?.trim()) {
      setError('Address', { type: 'manual', message: t('common:invalidStreet') });
      return false;
    }
    if (!data.City?.trim()) {
      setError('City', { type: 'manual', message: t('common:invalidCity') });
      return false;
    }
    if (!data.E_Mail?.trim()) {
      setError('E_Mail', { type: 'manual', message: t('common:invalidEmail') });
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
      Address: data.Address,
      City: data.City,
      ZipCode: data.ZipCode,
      E_Mail: data.E_Mail,
      Phone1: data.Phone1,
      Phone2: data.Phone2,
      LicTradNum: data.LicTradNum,
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
      setValue("Address", userInfo.Address || "");
      setValue("City", userInfo.City || "");
      setValue("ZipCode", userInfo.ZipCode || "");
      setValue("E_Mail", userInfo.E_Mail || "");
      setValue("Phone1", userInfo.Phone1 || "");
      setValue("Phone2", userInfo.Phone2 || "");
      setValue("LicTradNum", userInfo.LicTradNum || "");
      setCityValue(userInfo.City || "");
    }
  }, [setValue, userInfo]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 sm:gap-6">
      <ShapiraTitle text={t("common:updateAddressTitle")} height={70} key="updateAddressTitle" />
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
            name="LicTradNum"
            type="text"
            placeholder={t("common:idNumberOrLicense")}
          />
          <Error errorName={errors.LicTradNum} />
        </div>

        {/* כתובת */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:address")}
            name="Address"
            type="text"
            placeholder={t("common:address")}
          />
          <Error errorName={errors.Address} />
        </div>

        {/* עיר */}
        <div className="col-span-6 sm:col-span-3">
          <Label label={t("common:city")} isRequired className="mb-0" />
          <City
            setValue={(cityName) => {
              setValue("City", cityName);
              setCityValue(cityName);
            }}
            value={cityValue}
            placeholder={JSON.stringify({ city_name_he: t("common:city") })}
          />
          <Error errorName={errors.City} />
        </div>

        {/* מיקוד */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:zipCode")}
            name="ZipCode"
            type="text"
            placeholder={t("common:zipCode")}
            isRequired={false}
          />
          <Error errorName={errors.ZipCode} />
        </div>

        {/* כתובת אימייל */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:email")}
            name="E_Mail"
            type="email"
            placeholder={t("common:email")}
          />
          <Error errorName={errors.E_Mail} />
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

        {/* טלפון 2 */}
        <div className="col-span-6 sm:col-span-3">
          <InputArea
            register={register}
            label={t("common:phone2")}
            name="Phone2"
            type="text"
            placeholder={t("common:phone2")}
            isRequired={false}
          />
          <Error errorName={errors.Phone2} />
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
