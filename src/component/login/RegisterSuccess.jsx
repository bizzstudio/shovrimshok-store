import { FiLock, FiMail } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";

// Internal  import
import Error from "@component/form/Error";
import useLoginSubmit from "@hooks/useLoginSubmit";
import InputArea from "@component/form/InputArea";
import registerSuccess from 'public/titles/registerSuccess.svg'
import { useEffect } from "react";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";

const RegisterSuccess = ({ setShowResetPassword, setModalOpen }) => {
  const { handleSubmit, submitHandler, register, errors, loading } =
    useLoginSubmit(setModalOpen);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      localStorage.removeItem("showRegisterSuccess");
    }
  }, [localStorage.showRegisterSuccess]);

  return (
    <>
      <div className="text-center mb-4">
        <ShapiraTitle text={t("common:registerSuccess")} height={70} key="registerSuccess" />
      </div>
      <div className="flex flex-col justify-center gap-3">
        <p className="text-center"><b>{t("common:registerMessage1")}</b> {t("common:registerMessage2")}</p>
        <a href="https://mail.google.com" 
        className="flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
        target="_blank">
        {t("common:goToEmail")}</a>
      </div>
    </>
  );
};

export default RegisterSuccess;
