// shapira-store/src/component/login/Login.js
import { FiLock, FiUser } from "react-icons/fi"; // שינוי מ־FiPhone ל־FiUser
import useTranslation from "next-translate/useTranslation";

// Internal import
import Error from "@component/form/Error";
import useLoginSubmit from "@hooks/useLoginSubmit";
import InputArea from "@component/form/InputArea";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";
import MainBT from "@component/button/MainBT";

const Login = ({ setShowResetPassword, setModalOpen }) => {
  const { handleSubmit, submitHandler, register, errors, loading } = useLoginSubmit(setModalOpen);
  const { t } = useTranslation();

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
              name="username"                             // שינוי מ-phone ל-username
              type="text"
              placeholder={t("common:clientCodeOrEmail")}   // שינוי טקסט placeholder
              Icon={FiUser}                              // אייקון משתמש
            />
            <Error errorName={errors.username} />
          </div>
          <div className="w-full">
            <InputArea
              register={register}
              name="password"
              type="password"
              placeholder={t("common:password")} // שינוי placeholder לסיסמה
              Icon={FiLock}
            />
            <Error errorName={errors.password} />
          </div>
          <p className="-mt-2 -mb-1 text-sm text-start text-customRed-leaf">{t("common:loginPasswordNote")}</p>

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
            <MainBT
              disabled={true}
              type="submit"
            >
              <img src="/loader/spinner.gif" className="saturate-0" alt="Loading" width={20} height={10} />
              <span className="ms-1">{t("common:processing")}</span>
            </MainBT>
          ) : (
            <MainBT
              disabled={loading}
              type="submit"
            >
              {t("common:loginTitle")}
            </MainBT>
          )}
        </div>
      </form>
    </>
  );
};

export default Login;