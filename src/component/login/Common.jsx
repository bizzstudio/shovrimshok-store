// shapira-store/src/component/login/Common.jsx
import React, { useState } from "react";
import Link from "next/link";

// Internal import
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

  // אם הוגדר במפורש false באדמין - להציג רק התחברות עסקית/מוסדית.
  // ברירת מחדל (כולל כשהשדה חסר) - מציג את שני הטאבים.
  const showPrivateTab = storeSetting?.enable_private_customers !== false;

  // טאב פעיל: ברירת מחדל לפי כיבוי הלקוחות הפרטיים
  const [activeLoginTab, setActiveLoginTab] = useState("regular");
  const effectiveTab = showPrivateTab ? activeLoginTab : "business";

  const handleModal = () => {
    setShowRegister(!showRegister);
    setShowResetPassword(false);
  };

  const renderLoginContent = () => {
    if (!showPrivateTab) {
      // רק התחברות עסקית - בלי טאבים
      return (
        <Login
          loginType="business"
          setShowResetPassword={setShowResetPassword}
          setModalOpen={setModalOpen}
        />
      );
    }

    // שני הטאבים זמינים
    return (
      <>
        <div className="grid grid-cols-2 mb-5 border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveLoginTab("regular")}
            className={`py-2.5 text-sm font-semibold transition-colors ${
              effectiveTab === "regular"
                ? "bg-customRed text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("common:loginRegularTab")}
          </button>
          <button
            type="button"
            onClick={() => setActiveLoginTab("business")}
            className={`py-2.5 text-sm font-semibold transition-colors ${
              effectiveTab === "business"
                ? "bg-customRed text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("common:loginBusinessTab")}
          </button>
        </div>

        <Login
          key={effectiveTab}
          loginType={effectiveTab}
          setShowResetPassword={setShowResetPassword}
          setModalOpen={setModalOpen}
        />
      </>
    );
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
          renderLoginContent()
        )}

        {/* <div>
          {storeSetting?.google_login_status && !showRegister && (
            <>
              <div className="mt-7 mb-6 after:bg-gray-100 before:bg-gray-100 fo10t-sans text-center font-medium">
                {t("common:orGoogle")}
              </div>
              <div className="flex items-center justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSignIn}
                  onFailure={(err) =>
                    notifyError(
                      err?.message || "Something wrong on your auth setup!"
                    )
                  }
                  cookiePolicy={"single_host_origin"}
                  shape="circle"
                  type="icon"
                />
              </div>
            </>
          )}
        </div> */}
        <div className="text-center text-base text-gray-900 mt-4">
          <div className="text-gray-500 mt-2.5">
            {showRegister ? t("common:alreadyHaveAccount") : t("common:notAccount")}
            {showRegister ? (
              <button
                onClick={handleModal}
                className="text-gray-800 hover:text-customRed font-bold mx-1 underline"
              >
                {t("common:loginBtn")}
              </button>
            ) : (
              <Link
                href="/contact-us"
                className="text-gray-800 hover:text-customRed font-bold mx-1 underline"
                onClick={() => setModalOpen(false)}
              >
                {t("common:register")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Common;
