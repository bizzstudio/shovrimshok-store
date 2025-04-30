import Link from "next/link";
import React from "react";
import { FiMail, FiLock } from "react-icons/fi";

// Internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import useLoginSubmit from "@hooks/useLoginSubmit";
import forgetPassTitle from "public/titles/forgetPassTitle.svg";
import useTranslation from "next-translate/useTranslation";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";
import MainBT from "@component/button/MainBT";

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
            <MainBT
              disabled={true}
              type="submit"
            >
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
            <MainBT
              disabled={loading}
              type="submit"
            >
              {t("common:recoverPassword")}
            </MainBT>
          )}
        </div>
      </form>
    </>
  );
};

export default ResetPassword;
