import Link from "next/link";
import React from "react";
import { FiMail } from "react-icons/fi";

// Internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import useLoginSubmit from "@hooks/useLoginSubmit";
import forgetPassTitle from "public/titles/forgetPassTitle.svg";
import useTranslation from "next-translate/useTranslation";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";

const ResetPassword = ({ setShowResetPassword, setModalOpen }) => {
  const { handleSubmit, submitHandler, register, errors, loading } =
    useLoginSubmit(setModalOpen);
    const { t } = useTranslation();

  return (
    <>
      <div className="text-center mb-6">
        <ShapiraTitle text={t("common:forgotPassword")} height={70} key="forgotPassword" />
      </div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 gap-5">
          <div className="form-group">
            <InputArea
              register={register}
              label={t("common:email")}
              name="verifyEmail"
              type="email"
              placeholder={t("common:registerEmail")}
              Icon={FiMail}
            />
            <Error errorName={errors.verifyEmail} />
          </div>

          {loading ? (
            <button
              disabled={loading}
              type="submit"
              className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-customRed text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-customRed-dark h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
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
              disabled={loading}
              type="submit"
              className="w-full text-center py-3 rounded bg-customRed text-white hover:bg-customRed-dark transition-all focus:outline-none my-1"
            >
              {t("common:recoverPassword")}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default ResetPassword;
