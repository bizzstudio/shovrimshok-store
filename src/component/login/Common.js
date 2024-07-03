import React, { useState } from "react";
import { ImFacebook, ImGoogle } from "react-icons/im";

//internal import
import useAsync from "@hooks/useAsync";
import Login from "@component/login/Login";
import { notifyError } from "@utils/toast";
import useLoginSubmit from "@hooks/useLoginSubmit";
import Register from "@component/login/Register";
import ResetPassword from "@component/login/ResetPassword";
import SettingServices from "@services/SettingServices";
import useTranslation from "next-translate/useTranslation";

const Common = ({ setModalOpen }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const { handleGoogleSignIn, GoogleLogin } = useLoginSubmit(setModalOpen);
  const { data: storeSetting } = useAsync(SettingServices.getStoreSetting);
  const { t } = useTranslation();

  const handleModal = () => {
    setShowRegister(!showRegister);
    setShowResetPassword(false);
  };

  return (
    <>
      <div className="overflow-hidden bg-white mx-auto">
        {showResetPassword ? (
          <ResetPassword
            setShowResetPassword={setShowResetPassword}
            setModalOpen={setModalOpen}
          />
        ) : showRegister ? (
          <Register
            setShowResetPassword={setShowResetPassword}
            setModalOpen={setModalOpen}
          />
        ) : (
          <Login
            setShowResetPassword={setShowResetPassword}
            setModalOpen={setModalOpen}
          />
        )}



        <div>
          {/* <button className="text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-600 bg-gray-100 shadow-sm md:px-2 my-1 sm:my-1 md:my-1 lg:my-0 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-blue-600 h-11 md:h-12 w-full mr-2">
            <ImFacebook /> <span className="ml-2">{t("common:facebookLogin")}</span>
          </button> */}

          {storeSetting?.google_login_status && (
            <>
              <div className="my-8 after:bg-gray-100 before:bg-gray-100 fo10t-sans text-center font-medium">
                {t("common:or")}
              </div>
              <GoogleLogin
                width={"100%"}
                // clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <ImGoogle /> <span className="ml-2">{t("common:googleLogin")}</span>
                  </button>
                )}
                onSuccess={handleGoogleSignIn}
                onFailure={(err) =>
                  notifyError(
                    err?.message || "Something wrong on your auth setup!"
                  )
                }
                cookiePolicy={"single_host_origin"}
              />
            </>
          )}
        </div>
        <div className="text-center text-sm text-gray-900 mt-4">
          <div className="text-gray-500 mt-2.5">
            {showRegister ? t("common:alreadyHaveAccount") : t("common:notAccount")}
            <button
              onClick={handleModal}
              className="text-gray-800 hover:text-customGreen font-bold mx-1"
            >
              {showRegister ? t("common:loginBtn") : t("common:register")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Common;
