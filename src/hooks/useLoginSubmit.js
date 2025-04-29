// shapira-store/src/hooks/useLoginSubmit.js
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";

// Internal import
import { UserContext } from "@context/UserContext";
import { notifyError, notifySuccess } from "@utils/toast";
import CustomerServices from "@services/CustomerServices";
import useTranslation from "next-translate/useTranslation";
import notifyApiResponse from "@utils/notifyApiResponse";

const useLoginSubmit = (setModalOpen) => {
  const router = useRouter();
  const { redirect } = router.query;
  const { dispatch } = useContext(UserContext);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    setError,
  } = useForm();

  const submitHandler = (data) => {
    setLoading(true);
    const cookieTimeOut = 10;

    // הרשמה חדשה עם כל השדות
    if (
      data.CardName
      && data.Address
      && data.City
      && data.E_Mail
      && data.Phone1
      && data.password
      && data.LicTradNum
    ) {
      CustomerServices.verifyEmailAddress({
        CardName: data.CardName,
        Address: data.Address,
        City: data.City,
        ZipCode: data.ZipCode,
        // Country: data.Country,
        E_Mail: data.E_Mail,
        Phone1: data.Phone1,
        Phone2: data.Phone2,
        LicTradNum: data.LicTradNum,
        password: data.password,
      })
        .then((res) => {
          if (res.waitingForVerification) {
            localStorage.setItem("waitingForVerification", res.waitingForVerification);
            // מחיקת האימייל מהלוקל סטורג' תוך רבע שעה
            setTimeout(() => {
              localStorage.removeItem("waitingForVerification");
              // אחרי רבע שעה החלפת ההודעה לנא להרשם מחדש
              localStorage.setItem("plsRegisterAgain", true);
            }, 1000 * 60 * 15);
          }
          setLoading(false);
          setModalOpen(false);
          localStorage.setItem("showRegisterSuccess", true); // פופאפ הצלחה
        })
        .catch((err) => {
          setLoading(false);
          notifyApiResponse(err, false);
        });
      return;
    }

    // התחברות רגילה
    if (data.username && data.password) {
      if (localStorage.getItem("plsRegisterAgain")) {
        setLoading(false);
        notifyError(t("common:pls_register_again"));
        return;
      } else {
        CustomerServices.customerLogin({
          username: data.username,
          password: data.password,
        })
          .then((res) => {
            setLoading(false);
            setModalOpen(false);
            localStorage.removeItem("plsRegisterAgain");
            localStorage.removeItem("waitingForVerification");
            if (!res.city) {
              localStorage.setItem("firstTime", true);
            }
            router.push(redirect || "/");
            notifyApiResponse(res, true);
            dispatch({ type: "USER_LOGIN", payload: res });
            Cookies.set("userInfo", JSON.stringify(res), {
              expires: cookieTimeOut,
            });
          })
          .catch((err) => {
            console.error(err);
            // בדיקה אם המשתמש כבר נרשם וממתין לאימות
            if (localStorage.getItem("waitingForVerification") == data.username) {
              setLoading(false);
              notifyError(t("common:waiting_for_verification"));
              return;
            } else {
              notifyApiResponse(err, false);
              setLoading(false);
            }
          });
      }
      return;
    }

    // איפוס סיסמה
    if (data.verifyEmail) {
      CustomerServices.forgetPassword({ verifyEmail: data.verifyEmail })
        .then((res) => {
          setLoading(false);
          notifyApiResponse(res, true);
          setValue("verifyEmail");
        })
        .catch((err) => {
          setLoading(false);
          notifyApiResponse(err, false);
        });
    }
  };

  const handleGoogleSignIn = (user) => {
    // console.log("google sign in", user?.credential);
    const cookieTimeOut = 0.5;
    if (user) {
      CustomerServices.signUpWithProvider(user?.credential)
        .then((res) => {
          setModalOpen(false);
          notifyApiResponse(res, true);
          router.push(redirect || "/");
          dispatch({ type: "USER_LOGIN", payload: res });
          Cookies.set("userInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
          });
        })
        .catch((err) => {
          notifyApiResponse(err, false);
          setModalOpen(false);
        });
    }
  };

  return {
    handleSubmit,
    submitHandler,
    handleGoogleSignIn,
    register,
    errors,
    GoogleLogin,
    loading,
    watch,
    setError,
    setValue,
  };
};

export default useLoginSubmit;