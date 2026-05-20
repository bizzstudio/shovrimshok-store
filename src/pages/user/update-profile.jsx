// shapira-store/src/pages/user/update-profile.jsx
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
import Uploader from "@component/image-uploader/Uploader";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import City from "@component/select/City";
import notifyApiResponse from "@utils/notifyApiResponse";

const UpdateProfile = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [billToCityValue, setBillToCityValue] = useState("");
  const [shipToCityValue, setShipToCityValue] = useState("");
  const {
    state: { userInfo },
  } = useContext(UserContext);
  // console.log('userInfo :>> ', userInfo);

  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  // Helper: use admin-provided label when present, fall back to common translation
  const dashLabel = (key, fallbackKey) =>
    showingTranslateValue(storeCustomizationSetting?.dashboard?.[key]) || t(fallbackKey);

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
    // if (!data.BillToAddress?.trim()) {
    //   setError('BillToAddress', { type: 'manual', message: t('common:invalidStreet') });
    //   return false;
    // }
    // if (!data.BillToCity?.trim()) {
    //   setError('BillToCity', { type: 'manual', message: t('common:invalidCity') });
    //   return false;
    // }
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

    // בניית אובייקט יוזר חדש לפי המבנה החדש
    const userData = {
      CardName: data.CardName,
      EmailAddress: data.EmailAddress,
      Phone1: data.Phone1,
      Cellular: data.Cellular,
      BillToAddress: {
        Address: data.BillToAddress,
        City: data.BillToCity,
        ZipCode: data.BillToZipCode,
        // Country: data.BillToCountry || "IL"
      },
      ShipToAddress: {
        Address: data.ShipToAddress,
        City: data.ShipToCity,
        ZipCode: data.ShipToZipCode,
        // Country: data.ShipToCountry || "IL"
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
      setValue("CardCode", userInfo.CardCode || "");
      
      // Bill To Address
      setValue("BillToAddress", userInfo.BillToAddress?.Address || "");
      setValue("BillToCity", userInfo.BillToAddress?.City || "");
      setValue("BillToZipCode", userInfo.BillToAddress?.ZipCode || "");
      setValue("BillToCountry", userInfo.BillToAddress?.Country || "IL");
      setBillToCityValue(userInfo.BillToAddress?.City || "");
      
      // Ship To Address
      setValue("ShipToAddress", userInfo.ShipToAddress?.Address || "");
      setValue("ShipToCity", userInfo.ShipToAddress?.City || "");
      setValue("ShipToZipCode", userInfo.ShipToAddress?.ZipCode || "");
      setValue("ShipToCountry", userInfo.ShipToAddress?.Country || "IL");
      setShipToCityValue(userInfo.ShipToAddress?.City || "");
      
      setImageUrl(userInfo.Picture || "");
    }
  }, [setValue, userInfo]);

  return (
    <Dashboard
      title={showingTranslateValue(
        storeCustomizationSetting?.dashboard?.update_profile
      )}
      description="This is edit profile page"
    >
      <div className="max-w-screen-2xl">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h2 className="text-xl font-serif font-semibold mb-5">
                {showingTranslateValue(
                  storeCustomizationSetting?.dashboard?.update_profile
                )}
              </h2>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-5 md:mt-0 md:col-span-2">
            {/* תמונה */}
            <div className="bg-white space-y-6">
              <div>
                <Label label={t("common:image")} />
                <div className="mt-1 flex items-center">
                  <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
                </div>
              </div>
            </div>

            <div className="mt-10 sm:mt-0">
              <div className="md:grid-cols-6 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="lg:mt-6 mt-4 bg-white">
                    <div className="grid grid-cols-6 gap-6">

                      {/* קוד כרטיס לקוח */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:cardCode")}
                          name="CardCode"
                          type="text"
                          placeholder={t("common:cardCode")}
                          disabled
                          isRequired={false}
                        />
                        <Error errorName={errors.CardCode} />
                      </div>

                      {/* שם כרטיס לקוח */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={dashLabel("full_name", "common:cardName")}
                          name="CardName"
                          type="text"
                          placeholder={dashLabel("full_name", "common:cardName")}
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
                          label={dashLabel("user_email", "common:email")}
                          name="EmailAddress"
                          type="email"
                          placeholder={dashLabel("user_email", "common:email")}
                        />
                        <Error errorName={errors.EmailAddress} />
                      </div>

                      {/* טלפון 1 */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={dashLabel("user_phone", "common:phone1")}
                          name="Phone1"
                          type="text"
                          placeholder={dashLabel("user_phone", "common:phone1")}
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

                      {/* כותרת לכתובת חיוב */}
                      <div className="col-span-6">
                        <h3 className="text-lg font-serif font-semibold mb-3 border-b pb-2">
                          {t("common:billingAddress")}
                        </h3>
                      </div>

                      {/* כתובת חיוב */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={dashLabel("address", "common:address")}
                          name="BillToAddress"
                          type="text"
                          placeholder={dashLabel("address", "common:address")}
                          // disabled={true}
                        />
                        <Error errorName={errors.BillToAddress} />
                      </div>

                      {/* עיר חיוב */}
                      <div className="col-span-6 sm:col-span-3">
                        <Label label={t("common:city")} isRequired className="mb-0" />
                        <City
                          // disabled={true}
                          setValue={(cityName) => {
                            setValue("BillToCity", cityName);
                            setBillToCityValue(cityName);
                          }}
                          value={billToCityValue}
                          placeholder={JSON.stringify({ city_name_he: t("common:city") })}
                        />
                        <Error errorName={errors.BillToCity} />
                      </div>

                      {/* מיקוד חיוב */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:zipCode")}
                          name="BillToZipCode"
                          type="text"
                          placeholder={t("common:zipCode")}
                          isRequired={false}
                          // disabled={true}
                        />
                        <Error errorName={errors.BillToZipCode} />
                      </div>

                      {/* מדינה חיוב */}
                      {/* <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:country")}
                          name="BillToCountry"
                          type="text"
                          placeholder={t("common:country")}
                          isRequired={false}
                        />
                        <Error errorName={errors.BillToCountry} />
                      </div> */}

                      {/* כותרת לכתובת משלוח */}
                      <div className="col-span-6">
                        <h3 className="text-lg font-serif font-semibold mb-3 border-b pb-2">
                          {t("common:shippingAddress")}
                        </h3>
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
                          // disabled={true}
                        />
                        <Error errorName={errors.ShipToAddress} />
                      </div>

                      {/* עיר משלוח */}
                      <div className="col-span-6 sm:col-span-3">
                        <Label label={t("common:mailCity")} isRequired={false} className="mb-0" />
                        <City
                          // disabled={true}
                          setValue={(cityName) => {
                            setValue("ShipToCity", cityName);
                            setShipToCityValue(cityName);
                          }}
                          value={shipToCityValue}
                          placeholder={JSON.stringify({ city_name_he: t("common:mailCity") })}
                        />
                        <Error errorName={errors.ShipToCity} />
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
                          // disabled={true}
                        />
                        <Error errorName={errors.ShipToZipCode} />
                      </div>

                      {/* מדינה משלוח */}
                      {/* <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:country")}
                          name="ShipToCountry"
                          type="text"
                          placeholder={t("common:country")}
                          isRequired={false}
                        />
                        <Error errorName={errors.ShipToCountry} />
                      </div> */}
                    </div>
                    <div className="col-span-6 sm:col-span-3 mt-5 flex justify-end">
                      {loading ? (
                        <button
                          disabled={true}
                          type="submit"
                          className="opacity-50 flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                        >
                          <img
                            src="/loader/spinner.gif"
                            alt="Loading"
                            width={20}
                            height={10}
                            className="saturate-0"
                          />
                          <span className="font-serif mr-2 font-light">
                            {t("common:processing")}
                          </span>
                        </button>
                      ) : (
                        <button
                          disabled={loading}
                          type="submit"
                          className="flex items-center justify-center gap-2 font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
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
      </div>
    </Dashboard>
  );
};

export default dynamic(() => Promise.resolve(UpdateProfile), { ssr: false });