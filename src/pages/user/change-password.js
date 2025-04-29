// shapira-store/src/pages/user/change-password.js
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

// Internal import
import Error from "@component/form/Error";
import Dashboard from "@pages/user/dashboard";
import InputArea from "@component/form/InputArea";
import CustomerServices from "@services/CustomerServices";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useTranslation from "next-translate/useTranslation";
import notifyApiResponse from "@utils/notifyApiResponse";
import { UserContext } from "@context/UserContext";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  const onSubmit = ({ 
    // email,
     currentPassword, newPassword }) => {
    // return notifySuccess("This Feature is disabled for demo!");

    setLoading(true);
    CustomerServices.changePassword({ 
      // email,
       currentPassword, newPassword })
      .then((res) => {
        notifyApiResponse(res, true);
        setLoading(false);
        reset({ currentPassword: "", newPassword: "" });
      })
      .catch((err) => {
        setLoading(false);
        notifyApiResponse(err, false);
      });
  };

  const { state: { userInfo } } = useContext(UserContext);

  useEffect(() => {
    if (userInfo) {
      setValue("email", userInfo.E_Mail);
    }
  }, [userInfo, setValue]);

  return (
    <Dashboard
      title={showingTranslateValue(
        storeCustomizationSetting?.dashboard?.change_password
      )}
      description="This is change-password page"
    >
      <h2 className="text-xl font-serif font-semibold mb-5">
        {showingTranslateValue(
          storeCustomizationSetting?.dashboard?.change_password
        )}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="md:grid-cols-6 md:gap-6">
          <div className="md:mt-0 md:col-span-2">
            <div className="lg:mt-6 bg-white">
              <div className="grid grid-cols-6 gap-6">
                {/* <div className="col-span-6 sm:col-span-6">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.user_email
                    )}
                    name="email"
                    type="email"
                    placeholder={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.user_email
                    )}
                  />
                  <Error errorName={errors.email} />
                </div> */}
                <div className="col-span-6 sm:col-span-6">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.current_password
                    )}
                    name="currentPassword"
                    type="password"
                    autocomplete="new-password"
                    placeholder={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.current_password
                    )}
                  />
                  <Error errorName={errors.currentPassword} />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.new_password
                    )}
                    name="newPassword"
                    type="password"
                    autocomplete="new-password"
                    placeholder={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.new_password
                    )}
                  />
                  <Error errorName={errors.newPassword} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          {loading ? (
            <button
              disabled={loading}
              type="submit"
              className="opacity-50 flex items-center justify-center font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
              <img
                src="/loader/spinner.gif"
                alt="Loading"
                width={20}
                height={10}
              />
              <span className="font-serif ml-2 font-light">{t("common:Processing")}</span>
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center justify-center gap-2 font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.change_password
              )}
            </button>
          )}
        </div>
      </form>
    </Dashboard>
  );
};

export default ChangePassword;
