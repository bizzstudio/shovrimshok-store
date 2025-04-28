// shapira-store/src/component/login/Login.js
import { FiLock, FiUser } from "react-icons/fi"; // שינוי מ־FiPhone ל־FiUser
import useTranslation from "next-translate/useTranslation";

// Internal import
import Error from "@component/form/Error";
import useLoginSubmit from "@hooks/useLoginSubmit";
import InputArea from "@component/form/InputArea";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";

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
          <div className="form-group">
            <InputArea
              register={register}
              name="username"                             // שינוי מ-phone ל-username
              type="text"
              placeholder={t("common:clientCodeOrEmail")}   // שינוי טקסט placeholder
              Icon={FiUser}                              // אייקון משתמש
            />
            <Error errorName={errors.username} />
          </div>
          <div className="form-group">
            <InputArea
              register={register}
              name="password"
              type="password"
              placeholder={t("common:idNumberOrLicense")} // שינוי placeholder לסיסמה
              Icon={FiLock}
            />
            <Error errorName={errors.password} />
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
              className="flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
            >
              <img src="/loader/spinner.gif" alt="Loading" width={20} height={10} />
              <span className="font-serif ml-2 font-light mr-1">{t("common:processing")}</span>
            </button>
          ) : (
            <button
              disabled={loading}
              type="submit"
              className="flex items-center justify-center gap-2 font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
              {t("common:loginTitle")}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default Login;