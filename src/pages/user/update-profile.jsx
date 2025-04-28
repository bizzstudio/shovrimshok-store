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
  const [chosenCity, setChosenCity] = useState();
  const [cityValue, setCityValue] = useState("");
  const [mailCityValue, setMailCityValue] = useState("");
  const {
    state: { userInfo },
  } = useContext(UserContext);
  console.log('userInfo :>> ', userInfo);

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

    // בניית אובייקט יוזר חדש לפי המבנה שלך
    const userData = {
      CardName: data.CardName,
      Address: data.Address,
      City: data.City,
      ZipCode: data.ZipCode,
      // Country: data.Country,
      StreetNo: data.StreetNo,
      Block: data.Block,
      MailAddres: data.MailAddres,
      MailCity: data.MailCity,
      MailZipCod: data.MailZipCod,
      AddID: data.AddID,
      GlblLocNum: data.GlblLocNum,
      E_Mail: data.E_Mail,
      Phone1: data.Phone1,
      Phone2: data.Phone2,
      Cellular: data.Cellular,
      LicTradNum: data.LicTradNum,
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
      setValue("Address", userInfo.Address || "");
      setValue("City", userInfo.City || "");
      setValue("ZipCode", userInfo.ZipCode || "");
      // setValue("Country", userInfo.Country || "");
      setValue("StreetNo", userInfo.StreetNo || "");
      setValue("Block", userInfo.Block || "");
      setValue("MailAddres", userInfo.MailAddres || "");
      setValue("MailCity", userInfo.MailCity || "");
      setValue("MailZipCod", userInfo.MailZipCod || "");
      setValue("AddID", userInfo.AddID || "");
      setValue("GlblLocNum", userInfo.GlblLocNum || "");
      setValue("E_Mail", userInfo.E_Mail || "");
      setValue("Phone1", userInfo.Phone1 || "");
      setValue("Phone2", userInfo.Phone2 || "");
      setValue("Cellular", userInfo.Cellular || "");
      setValue("LicTradNum", userInfo.LicTradNum || "");
      setValue("CardCode", userInfo.CardCode || "");
      setImageUrl(userInfo.Picture || "");
      setCityValue(userInfo.City || "");
      setMailCityValue(userInfo.MailCity || "");
    }
  }, [setValue]);

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

                      {/* מדינה */}
                      {/* <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:country")}
                          name="Country"
                          type="text"
                          placeholder={t("common:country")}
                        />
                        <Error errorName={errors.Country} />
                      </div> */}

                      {/* מספר רחוב */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:streetNo")}
                          name="StreetNo"
                          type="text"
                          placeholder={t("common:streetNo")}
                          isRequired={false}
                        />
                        <Error errorName={errors.StreetNo} />
                      </div>

                      {/* בלוק */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:block")}
                          name="Block"
                          type="text"
                          placeholder={t("common:block")}
                          isRequired={false}
                        />
                        <Error errorName={errors.Block} />
                      </div>

                      {/* כתובת למשלוח */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:mailAddress")}
                          name="MailAddres"
                          type="text"
                          placeholder={t("common:mailAddress")}
                          isRequired={false}
                        />
                        <Error errorName={errors.MailAddres} />
                      </div>

                      {/* עיר למשלוח */}
                      <div className="col-span-6 sm:col-span-3">
                        <Label label={t("common:mailCity")} isRequired={false} className="mb-0" />
                        <City
                          setValue={(cityName) => {
                            setValue("MailCity", cityName);
                            setMailCityValue(cityName);
                          }}
                          value={mailCityValue}
                          placeholder={JSON.stringify({ city_name_he: t("common:mailCity") })}
                        />
                        <Error errorName={errors.MailCity} />
                      </div>

                      {/* מיקוד למשלוח */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:mailZipCode")}
                          name="MailZipCod"
                          type="text"
                          placeholder={t("common:mailZipCode")}
                          isRequired={false}
                        />
                        <Error errorName={errors.MailZipCod} />
                      </div>

                      {/* מזהה נוסף */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:addId")}
                          name="AddID"
                          type="text"
                          placeholder={t("common:addId")}
                          isRequired={false}
                        />
                        <Error errorName={errors.AddID} />
                      </div>

                      {/* מספר מיקום גלובלי */}
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:glblLocNum")}
                          name="GlblLocNum"
                          type="text"
                          placeholder={t("common:glblLocNum")}
                          isRequired={false}
                        />
                        <Error errorName={errors.GlblLocNum} />
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

                      {/* טלפון 3 */}
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
