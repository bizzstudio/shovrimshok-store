// shapira-store/src/pages/user/email-verification/[token].js
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

// Internal import
import CustomerServices from "@services/CustomerServices";
import { UserContext } from "@context/UserContext";
import Loading from "@component/preloader/Loading";
import notifyApiResponse from "@utils/notifyApiResponse";

const EmailVerification = ({ params }) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    CustomerServices.registerCustomer(params?.token)
      .then((res) => {
        localStorage.setItem("firstTime", true);
        router.push("/");
        setLoading(false);
        setSuccess(res.message);
        notifyApiResponse(res, true);
        dispatch({ type: "USER_LOGIN", payload: res });
        Cookies.set("userInfo", JSON.stringify(res));
      })
      .catch((err) => {
        setLoading(false);
        setError(err ? err.response.data.message : err.message);
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {loading ? (
        <Loading loading={loading} />
      ) : success ? (
        <div className="text-customBlue">
          <IoCheckmarkCircle className="mx-auto mb-2 text-center text-4xl" />
          <h2 className="text-xl font-medium"> {success} </h2>
        </div>
      ) : (
        <div className="text-red-500">
          <IoCloseCircle className="mx-auto mb-2 text-center text-4xl" />
          <h2 className="text-xl font-medium"> {error} </h2>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  return {
    props: { params },
  };
};

export default EmailVerification;