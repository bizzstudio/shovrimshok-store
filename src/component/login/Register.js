import { FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";

//internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import useLoginSubmit from "@hooks/useLoginSubmit";
import registerTitle from 'public/titles/registerTitle.svg'

const Register = ({ setShowResetPassword, setModalOpen }) => {
  const { handleSubmit, submitHandler, register, errors, loading, watch } =
    useLoginSubmit(setModalOpen);
  const { t } = useTranslation();

  const [notMatch, setNotMatch] = useState({ message: '' })

  const comparePasswords = (value) => {
    if (value !== watch("password")) {
      setNotMatch({ message: t('common:passwordsDoNotMatch') });
    } else {
      setNotMatch('');
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <img src={registerTitle.src} alt="register" className="h-28 mx-auto -mt-4 -mb-9" />
        {/* <h2 className="text-3xl font-bold font-serif">{t("common:signingUp")}</h2>
        <p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
        {t("common:createAccount")}
        </p> */}
      </div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col justify-center w-full"
      >
        <div className="grid grid-cols-1 gap-5">
          <div className="form-group">
            <InputArea
              register={register}
              label={t("common:name")}
              name="name"
              type="text"
              placeholder={t("common:name")}
              Icon={FiUser}
            />

            <Error errorName={errors.name} />
          </div>

          <div className="form-group">
            <InputArea
              register={register}
              label={t("common:email")}
              name="email"
              type="email"
              placeholder={t("common:email")}
              Icon={FiMail}
            />
            <Error errorName={errors.email} />
          </div>

          <div className="form-group">
            <InputArea
              register={register}
              label={t("common:phone")}
              name="phone"
              type="text"
              placeholder={t("common:phone")}
              Icon={FiPhone}
            />
            <Error errorName={errors.phone} />
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="form-group w-full">
              <InputArea
                register={register}
                label={t("common:password")}
                name="password"
                type="password"
                placeholder={t("common:password")}
                Icon={FiLock}
              />

              <Error errorName={errors.password} />
            </div>

            {/* אישור סיסמה */}
            <div className="form-group w-full">
              <InputArea
                register={register}
                label={t('common:confirmPassword')}
                name="confirmPassword"
                type="password"
                placeholder={t('common:confirmPassword')}
                Icon={FiLock}
                onChange={(e) => comparePasswords(e.target.value)}
              />
              <Error errorName={notMatch} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex ms-auto">
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-end text-sm text-heading ps-3 underline hover:no-underline focus:outline-none"
              >
                {t("common:forgotPassword")}
              </button>
            </div>
          </div>
          {loading ? (
            <button
              disabled={loading}
              type="submit"
              className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-customGreen text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-customGreen-dark h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
            >
              <img
                src="/loader/spinner.gif"
                alt="Loading"
                width={20}
                height={10}
              />
              <span className="font-serif ml-2 font-light">{t("common:Processing")}</span>
            </button>
          ) : (
            <button
              disabled={loading || notMatch}
              type="submit"
              className="w-full text-center py-3 rounded bg-customGreen text-white hover:bg-customGreen-dark transition-all focus:outline-none my-1"
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
