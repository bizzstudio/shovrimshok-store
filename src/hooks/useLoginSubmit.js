import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { set, useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";

//internal import

import { UserContext } from "@context/UserContext";
import { notifyError, notifySuccess } from "@utils/toast";
import CustomerServices from "@services/CustomerServices";
import useTranslation from "next-translate/useTranslation";

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
    watch
  } = useForm();

  const submitHandler = ({
    name,
    lastName,
    email,
    registerEmail,
    verifyEmail,
    password,
    phone
  }) => {
    setLoading(true);
    const cookieTimeOut = 10;

    // console.log({
    //   name,
    //   lastName,
    //   email,
    //   registerEmail,
    //   verifyEmail,
    //   password,
    //   phone
    // })

    if (registerEmail && password) {
      if (localStorage.getItem("plsRegisterAgain")) {
        setLoading(false);
        notifyError(t("common:pls_register_again"));
        return;
      } else {
        CustomerServices.customerLogin({
          registerEmail,
          password,
        })
          .then((res) => {
            // console.log(res);
            setLoading(false);
            setModalOpen(false);
            localStorage.removeItem("plsRegisterAgain");
            localStorage.removeItem("waitingForVerification");
            // גרימה לפופאפ הזנת כתובת לקפוץ אם אין לו כתובת
            if (!res.address.city) {
              localStorage.setItem("firstTime", true);
            }
            router.push(redirect || "/");
            notifySuccess(t("common:loginSuccess"));
            dispatch({ type: "USER_LOGIN", payload: res });
            Cookies.set("userInfo", JSON.stringify(res), {
              expires: cookieTimeOut,
            });
          })
          .catch((err) => {
            // בדיקה אם המשתמש כבר נרשם וממתין לאימות
            if (localStorage.getItem("waitingForVerification") == registerEmail) {
              setLoading(false);
              notifyError(t("common:waiting_for_verification"));
              return;
            } else {
              notifyError(err ? err.response.data.message : err.message);
              setLoading(false);
            }
          });
      }
    }
    if (name && email && password) {
      // ווידוא שהשם משתמש הוא 2 מילים לפחות
      // const usernameWords = name.trim().split(" ");
      // if (usernameWords.length < 2) {
      //   setLoading(false);
      //   notifyError(t("common:username_at_least_two_words"));
      //   return;
      // }
      CustomerServices.verifyEmailAddress({ name, lastName, email, password, phone })
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
          // notifySuccess(res.message);
          localStorage.setItem("showRegisterSuccess", true); // פופאפ במקום נוטיפיי
        })
        .catch((err) => {
          console.log(err)
          setLoading(false);
          notifyError(err.response.data.message);
        });
    }
    if (verifyEmail) {
      CustomerServices.forgetPassword({ verifyEmail })
        .then((res) => {
          setLoading(false);
          notifySuccess(res.message);
          setValue("verifyEmail");
        })
        .catch((err) => {
          setLoading(false);
          notifyError(err ? err.response.data.message : err.message);
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
          notifySuccess(t("common:loginSuccess"));
          router.push(redirect || "/");
          dispatch({ type: "USER_LOGIN", payload: res });
          Cookies.set("userInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
          });
        })

        .catch((err) => {
          notifyError(err.message);
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
  };
};

export default useLoginSubmit;
