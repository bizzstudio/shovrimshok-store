// src/component/userAddressInitialize/UserAddressInitialize.jsx
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import React, { useContext, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";

// Internal import
import Label from "@component/form/Label";
import Error from "@component/form/Error";
import Dashboard from "@pages/user/dashboard";
import InputArea from "@component/form/InputArea";
import CustomerServices from "@services/CustomerServices";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import City from "@component/select/City";
import initializeAddressTitle from "public/titles/finishRgisterTitle.svg";
import notifyApiResponse from "@utils/notifyApiResponse";

const UserAddressInitialize = () => {
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
    setError,
    formState: { errors },
  } = useForm();

  const validateInput = (data) => {
    if (!data.CardName?.trim()) {
      setError('CardName', { type: 'manual', message: t('common:invalidName') });
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

    // if (!data.BillToAddress?.trim()) {
    //   setError('BillToAddress', { type: 'manual', message: t('common:invalidStreet') });
    //   return false;
    // }

    // if (!billToCityValue) {
    //   setError('BillToCity', { type: 'manual', message: t('common:invalidCity') });
    //   return false;
    // }

    // בדיקת מספר טלפון - מתחיל ב־05 וכולל 10 ספרות בדיוק
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(data.Phone1)) {
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
      //   City: billToCityValue,
      //   ZipCode: data.BillToZipCode,
      //   Country: "IL"
      // },
      ShipToAddress: {
        Address: data.ShipToAddress || data.BillToAddress,
        City: shipToCityValue || billToCityValue,
        ZipCode: data.ShipToZipCode || data.BillToZipCode,
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
      if (userInfo.BillToAddress) {
        setValue("BillToAddress", userInfo.BillToAddress.Address || "");
        setValue("BillToZipCode", userInfo.BillToAddress.ZipCode || "");
        setBillToCityValue(userInfo.BillToAddress.City || "");
      }

      // Ship To Address  
      if (userInfo.ShipToAddress) {
        setValue("ShipToAddress", userInfo.ShipToAddress.Address || "");
        setValue("ShipToZipCode", userInfo.ShipToAddress.ZipCode || "");
        setShipToCityValue(userInfo.ShipToAddress.City || "");
      }

      setImageUrl(userInfo.Picture || "");
    }
  }, [setValue, userInfo]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("firstTime");
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <img src={initializeAddressTitle.src} alt="login" className="h-28 mx-auto -mt-4 -mb-6" />
      <p className="text-center text-lg font-semibold">
        {t("common:hey")} {userInfo?.CardName}! {t("common:initializeAddressDes")}
      </p>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid-cols-6 md:gap-6">
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="lg:mt-6 mt-4 bg-white">
                <div className="grid grid-cols-6 gap-6">

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
                      isRequired={false}
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

                  {/* טלפון */}
                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={t("common:phone")}
                      name="Phone1"
                      type="tel"
                      placeholder={t("common:phone")}
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
                    <Label label={t("common:city")} />
                    <City
                      setValue={setBillToCityValue}
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
                    <Label label={t("common:mailCity")} isRequired={false} />
                    <City
                      setValue={setShipToCityValue}
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
                <div className="w-full mt-7">
                  {loading ? (
                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
                    >
                      <img
                        src="/loader/spinner.gif"
                        alt="Loading"
                        width={20}
                        height={10}
                      />
                      <span className="font-serif ml-2 font-light">
                        {t("common:processing")}
                      </span>
                    </button>
                  ) : (
                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
                      onClick={() => localStorage.removeItem("firstTime")}
                    >
                      {showingTranslateValue(
                        storeCustomizationSetting?.dashboard?.update_button
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserAddressInitialize;
