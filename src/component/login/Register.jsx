// shapira-store/src/component/login/Register.jsx
import { FiLock, FiMail, FiPhone, FiUser, FiMapPin, FiHome, FiGlobe, FiHash } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";

// Internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import useLoginSubmit from "@hooks/useLoginSubmit";
import registerTitle from 'public/titles/registerTitle.svg';
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";
import City from "@component/select/City";
import MainBT from "@component/button/MainBT";

const Register = ({ setShowResetPassword, setModalOpen }) => {
  const {
    handleSubmit,
    submitHandler,
    register,
    errors,
    loading,
    watch,
    setError,
    setValue,
  } = useLoginSubmit(setModalOpen);
  const { t } = useTranslation();

  const [notMatch, setNotMatch] = useState({ message: '' });
  const [cityValue, setCityValue] = useState("");
  const [mailCityValue, setMailCityValue] = useState("");

  const comparePasswords = (value) => {
    if (value !== watch("password")) {
      setNotMatch({ message: t('common:passwordsDoNotMatch') });
    } else {
      setNotMatch('');
    }
  };

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
    // בדיקת סיסמאות
    if (data.password !== data.confirmPassword) {
      setNotMatch({ message: t('common:passwordsDoNotMatch') });
      return false;
    }
    return true;
  };

  const customSubmitHandler = (data) => {
    if (validateInput(data)) {
      submitHandler(data);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <ShapiraTitle text={t("common:signingUp")} height={70} key="signingUp" />
      </div>
      <form
        onSubmit={handleSubmit(customSubmitHandler)}
        className="flex flex-col justify-center w-full"
      >
        <div className="grid grid-cols-2 gap-5">
          {/* CardName (שם מלא) */}
          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              name="CardName"
              type="text"
              placeholder={t("common:cardName")}
              Icon={FiUser}
            />
            <Error errorName={errors.CardName} />
          </div>

          {/* LicTradNum (ת.ז/עוסק) */}
          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              name="LicTradNum"
              type="text"
              placeholder={t("common:idNumberOrLicense")}
              Icon={FiHash}
            />
            <Error errorName={errors.LicTradNum} />
          </div>

          {/* Address */}
          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              name="Address"
              type="text"
              placeholder={t("common:address")}
              Icon={FiMapPin}
            />
            <Error errorName={errors.Address} />
          </div>

          {/* City */}
          <div className="col-span-2 sm:col-span-1">
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

          {/* ZipCode */}
          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              name="ZipCode"
              type="text"
              placeholder={t("common:zipCode")}
              Icon={FiHash}
            />
            <Error errorName={errors.ZipCode} />
          </div>

          {/* Country */}
          {/* <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              name="Country"
              type="text"
              placeholder={t("common:country")}
              Icon={FiGlobe}
            />
            <Error errorName={errors.Country} />
          </div> */}

          {/* E_Mail */}
          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              name="E_Mail"
              type="email"
              placeholder={t("common:email")}
              Icon={FiMail}
            />
            <Error errorName={errors.E_Mail} />
          </div>

          {/* Phone1 */}
          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              name="Phone1"
              type="text"
              placeholder={t("common:phone")}
              Icon={FiPhone}
            />
            <Error errorName={errors.Phone1} />
          </div>

          {/* Phone2 */}
          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              name="Phone2"
              type="text"
              placeholder={t("common:phone2")}
              Icon={FiPhone}
              isRequired={false}
            />
            <Error errorName={errors.Phone2} />
          </div>

          {/* סיסמה */}
          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              name="password"
              type="password"
              placeholder={t("common:password")}
              Icon={FiLock}
            />
            <Error errorName={errors.password} />
          </div>

          {/* אימות סיסמה */}
          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              name="confirmPassword"
              type="password"
              placeholder={t('common:confirmPassword')}
              Icon={FiLock}
              onChange={(e) => comparePasswords(e.target.value)}
            />
            <Error errorName={notMatch} />
          </div>

          {/* כפתור */}
          {loading ? (
            <MainBT
              disabled={true}
              type="submit"
              className="col-span-2"
            >
              <img
                src="/loader/spinner.gif"
                alt="Loading"
                width={20}
                height={10}
              />
              <span className="ms-1">{t("common:processing")}</span>
            </MainBT>
          ) : (
            <MainBT
              disabled={loading}
              type="submit"
              className="col-span-2"
            >
              {t("common:signingUp")}
            </MainBT>
          )}
        </div>
      </form>
    </>
  );
};

export default Register;
