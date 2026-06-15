// shapira-store/src/component/login/Login.js
import { FiHash, FiLock, FiMail } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";

// Internal import
import Error from "@component/form/Error";
import useLoginSubmit from "@hooks/useLoginSubmit";
import InputArea from "@component/form/InputArea";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";
import MainBT from "@component/button/MainBT";

const Login = ({ loginType = "regular", setShowResetPassword, setModalOpen }) => {
  const { handleSubmit, submitHandler, register, errors, loading } =
    useLoginSubmit(setModalOpen);
  const { t } = useTranslation();

  const isBusinessLogin = loginType === "business";

  return (
    <>
      <div className="text-center mb-6">
        <ShapiraTitle text={t("common:loginTitle")} height={70} key="loginTitle" />
      </div>
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col justify-center">
        <div className="grid grid-cols-1 gap-5">
          <div className="w-full">
            <InputArea
              register={register}
              name="registerEmail"
              type="email"
              placeholder={t("common:email")}
              Icon={FiMail}
            />
            <Error errorName={errors.registerEmail} />
          </div>
          <div className="w-full">
            <InputArea
              register={register}
              name="password"
              type="password"
              placeholder={t("common:password")}
              Icon={FiLock}
            />
            <Error errorName={errors.password} />
          </div>

          {isBusinessLogin && (
            <div className="w-full">
              <InputArea
                register={register}
                name="rivhitCustomerNumber"
                type="tel"
                placeholder={t("common:rivhitCustomerNumber")}
                Icon={FiHash}
                isRequired={true}
              />
              <Error errorName={errors.rivhitCustomerNumber} />
            </div>
          )}

          <p className="-mt-2 -mb-1 text-sm text-start text-customRed-leaf">
            {t("common:loginPasswordNote")}
          </p>

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
            <MainBT disabled={true} type="submit">
              <img
                src="/loader/spinner.gif"
                className="saturate-0"
                alt="Loading"
                width={20}
                height={10}
              />
              <span className="ms-1">{t("common:processing")}</span>
            </MainBT>
          ) : (
            <MainBT disabled={loading} type="submit">
              {t("common:loginTitle")}
            </MainBT>
          )}
        </div>
      </form>
    </>
  );
};

export default Login;
