// shapira-store/src/component/login/Register.js
import { FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";

// Internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import useLoginSubmit from "@hooks/useLoginSubmit";
import registerTitle from 'public/titles/registerTitle.svg';
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";

const Register = ({ setShowResetPassword, setModalOpen }) => {
  const { handleSubmit, submitHandler, register, errors, loading, watch, setError } =
    useLoginSubmit(setModalOpen);
  const { t } = useTranslation();

  const [notMatch, setNotMatch] = useState({ message: '' });

  const comparePasswords = (value) => {
    if (value !== watch("password")) {
      setNotMatch({ message: t('common:passwordsDoNotMatch') });
    } else {
      setNotMatch('');
    }
  };

  const validateInput = (data) => {
    const { name, lastName, phone } = data;

    // בדיקת רווחים בשדות שם ושם משפחה
    if (!name.trim()) {
      setError('name', { type: 'manual', message: t('common:invalidName') });
      return false;
    }

    if (!lastName.trim()) {
      setError('lastName', { type: 'manual', message: t('common:invalidLastName') });
      return false;
    }

    // בדיקת מספר טלפון - מתחיל ב־05 וכולל 10 ספרות בדיוק
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError('phone', { type: 'manual', message: t('common:invalidPhone') });
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
      <div className="text-center mb-4">
        <ShapiraTitle text={t("common:signingUp")} height={70} key="signingUp" />
      </div>
      <form
        onSubmit={handleSubmit(customSubmitHandler)}
        className="flex flex-col justify-center w-full"
      >
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-1">
            <InputArea
              register={register}
              // label={t("common:name")}
              name="name"
              type="text"
              placeholder={t("common:name")}
              Icon={FiUser}
            />
            <Error errorName={errors.name} />
          </div>

          <div className="col-span-1">
            <InputArea
              register={register}
              // label={t("common:lastName")}
              name="lastName"
              type="text"
              placeholder={t("common:lastName")}
              Icon={FiUser}
            />
            <Error errorName={errors.lastName} />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              // label={t("common:email")}
              name="email"
              type="email"
              placeholder={t("common:email")}
              Icon={FiMail}
            />
            <Error errorName={errors.email} />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <InputArea
              register={register}
              // label={t("common:phone")}
              name="phone"
              type="tel"
              placeholder={t("common:phone")}
              Icon={FiPhone}
            />
            <Error errorName={errors.phone} />
          </div>

          <div className="col-span-2 flex gap-3 flex-col sm:flex-row">
            <div className="form-group w-full">
              <InputArea
                register={register}
                // label={t("common:password")}
                name="password"
                type="password"
                placeholder={t("common:password")}
                Icon={FiLock}
              />
              <Error errorName={errors.password} />
            </div>

            {/* אימות סיסמה */}
            <div className="form-group w-full">
              <InputArea
                register={register}
                // label={t('common:confirmPassword')}
                name="confirmPassword"
                type="password"
                placeholder={t('common:confirmPassword')}
                Icon={FiLock}
                onChange={(e) => comparePasswords(e.target.value)}
              />
              <Error errorName={notMatch} />
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex ms-auto">
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-end text-sm text-heading ps-3 underline hover:no-underline focus:outline-none"
              >
                {t("common:forgotPassword")}
              </button>
            </div>
          </div> */}
          {loading ? (
            <button
              disabled={loading}
              type="submit"
              className="col-span-2 flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
            >
              <img
                src="/loader/spinner.gif"
                alt="Loading"
                width={20}
                height={10}
              />
              <span className="font-serif ml-2 font-light">{t("common:processing")}</span>
            </button>
          ) : (
            <button
              disabled={loading || notMatch}
              type="submit"
              className="col-span-2 flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
            >
              {t("common:signingUp")}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default Register;
