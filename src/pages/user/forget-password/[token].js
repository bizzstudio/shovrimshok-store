import { useRouter } from "next/router";
import React, { useState, useContext, useRef } from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { FiLock, FiMail } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import useTranslation from "next-translate/useTranslation";

// Internal import
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import CustomerServices from "@services/CustomerServices";
import { UserContext } from "@context/UserContext";
import { notifyError, notifySuccess } from "@utils/toast";
import notifyApiResponse from "@utils/notifyApiResponse";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { dispatch } = useContext(UserContext);
  const router = useRouter();
  const password = useRef("");
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  password.current = watch("newPassword");

  const submitHandler = ({ registerEmail, password, newPassword }) => {
    // notifySuccess("This Feature is disabled for demo!");

    setLoading(true);
    if (newPassword) {
      CustomerServices.resetPassword({
        newPassword,
        token: router.query?.token,
      })
        .then((res) => {
          setLoading(false);
          setShowLogin(true);
          notifyApiResponse(res, true);
          setValue("newPassword");
        })
        .catch((err) => {
          setLoading(false);
          notifyApiResponse(err, false);
        });
    }

    if (registerEmail && password) {
      CustomerServices.customerLogin({
        username: registerEmail,
        password,
      })
        .then((res) => {
          setLoading(false);
          router.push("/");
          notifyApiResponse(res, true);
          dispatch({ type: "USER_LOGIN", payload: res });
          Cookies.set("userInfo", JSON.stringify(res));
        })
        .catch((err) => {
          setLoading(false);
          notifyApiResponse(err, false);
        });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow max-w-md w-full space-y-8 py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <ShapiraTitle text={showLogin ? t("common:loginTitle") : t("common:resetPassword")} height={50} />
            {/* <p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
              {showLogin
                ? t("common:loginWithNewPassword")
                : t("common:resetYourPassword")}
            </p> */}
          </div>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col justify-center"
          >
            <div className="grid grid-cols-1 gap-5">
              {showLogin && (
                <>
                  {" "}
                  <div className="form-group">
                    <InputArea
                      register={register}
                      label={t("common:email")}
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
                      label={t("common:password")}
                      name="password"
                      type="password"
                      autocomplete="new-password"
                      placeholder={t("common:password")}
                      Icon={FiLock}
                    />
                    <Error errorName={errors.password} />
                  </div>
                </>
              )}

              {!showLogin && (
                <>
                  {" "}
                  <div className="form-group">
                    <input
                      name="newPassword"
                      type="password"
                      placeholder={t("common:newPassword")}
                      {...register("newPassword", {
                        required: t("common:passwordRequired"),
                        minLength: {
                          value: 8,
                          message: t("common:passwordMinLength"),
                        },
                      })}
                      className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-gray-100 border-gray-200 focus:outline-none focus:border-customRed h-11 md:h-12"
                    />
                    <Error errorName={errors.newPassword} />
                  </div>
                  <div className="form-group">
                    <input
                      name="confirm_password"
                      type="password"
                      placeholder={t("common:confirmPassword")}
                      {...register("confirm_password", {
                        validate: (value) =>
                          value === password.current ||
                          t("common:passwordsDoNotMatch"),
                      })}
                      className="py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-gray-100 border-gray-200 focus:outline-none focus:border-customRed h-11 md:h-12"
                    />
                    <Error errorName={errors.confirm_password} />
                  </div>
                </>
              )}

              <button
                disabled={loading}
                type="submit"
                className="flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
                >
                {loading ? (
                  <>
                    <img src="/loader/spinner.gif" alt="Loading" width={20} height={10} />
                    <span className="font-serif ml-2 font-light mr-1">{t("common:processing")}</span>
                  </>
                ) : (
                  showLogin ? t("common:login") : t("common:resetPassword")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;