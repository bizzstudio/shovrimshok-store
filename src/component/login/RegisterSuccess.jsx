import { FiLock, FiMail } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";

//internal  import
import Error from "@component/form/Error";
import useLoginSubmit from "@hooks/useLoginSubmit";
import InputArea from "@component/form/InputArea";
import registerSuccess from 'public/titles/registerSuccess.svg'
import { useEffect } from "react";

const RegisterSuccess = ({ setShowResetPassword, setModalOpen }) => {
  const { handleSubmit, submitHandler, register, errors, loading } =
    useLoginSubmit(setModalOpen);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      localStorage.removeItem("firstTime");
    }
  }, [localStorage.firstTime])

  return (
    <>
      <div className="text-center mb-6">
        <img src={registerSuccess.src} alt="Register Success" className="h-28 mx-auto -mt-4 -mb-9" />
      </div>
      <div className="flex flex-col justify-center gap-3">
        <p className="text-center">{t("common:registerMessage")}</p>
        <a href="https://mail.google.com" 
        className="flex items-center justify-center font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
        target="_blank">
        {t("common:goToEmail")}</a>
      </div>
    </>
  );
};

export default RegisterSuccess;
