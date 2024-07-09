import { FiLock, FiMail } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";

//internal  import
import Error from "@component/form/Error";
import useLoginSubmit from "@hooks/useLoginSubmit";
import InputArea from "@component/form/InputArea";
import loginTitle from 'public/titles/loginTitle.svg'

const Login = ({ setShowResetPassword, setModalOpen }) => {
  const { handleSubmit, submitHandler, register, errors, loading } =
    useLoginSubmit(setModalOpen);
    const { t } = useTranslation();

  return (
    <>
      <div className="text-center mb-6">
        <img src={loginTitle.src} alt="login" className="h-28 mx-auto -mt-4 -mb-9" />
        {/* <h2 className="text-3xl font-bold font-serif">{t("common:loginTitle")}</h2> */}
        {/* <p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
        {t("common:loginBoxText")}
        </p> */}
      </div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 gap-5">
          <div className="form-group">
            <InputArea
              register={register}
              // label={t("common:email")}
              name="registerEmail"
              type="email"
              placeholder={t("common:email")}
              Icon={FiMail}
            />
            <Error errorName={errors.registerEmail} />
          </div>
          <div className="form-group">
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
              <span className="font-serif ml-2 font-light mr-1">{t("common:processing")}</span>
            </button>
          ) : (
            <button
              disabled={loading}
              type="submit"
              className="flex items-center justify-center gap-2 font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
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
