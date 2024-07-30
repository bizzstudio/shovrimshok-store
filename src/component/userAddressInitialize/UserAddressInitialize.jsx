import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import React, { useContext, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";

//internal import
import Label from "@component/form/Label";
import Error from "@component/form/Error";
import Dashboard from "@pages/user/dashboard";
import InputArea from "@component/form/InputArea";
import CustomerServices from "@services/CustomerServices";
import { UserContext } from "@context/UserContext";
import Uploader from "@component/image-uploader/Uploader";
import { notifySuccess, notifyError } from "@utils/toast";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import City from "@component/select/City";
import initializeAddressTitle from "public/titles/finishRgisterTitle.svg"

const UserAddressInitialize = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [chosenCity, setChosenCity] = useState();
  const {
    state: { userInfo },
  } = useContext(UserContext);
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);

    // ווידוא שהשם משתמש הוא 2 מילים לפחות
    const usernameWords = data.name.trim().split(" ");
    if (usernameWords.length < 2) {
      setLoading(false);
      notifyError(t("common:username_at_least_two_words"));
      return;
    }

    const userData = {
      name: data.name,
      email: data.email,
      address: {
        city: chosenCity,
        street: data.street,
        houseNumber: data.houseNumber,
        apartmentNumber: data.apartmentNumber,
        floor: data.floor,
        entryCode: data.entryCode,
        postalCode: data.postalCode,
      },
      phone: data.phone,
      image: imageUrl,
    };

    CustomerServices.updateCustomer(userInfo._id, userData)
      .then((res) => {
        if (res) {
          setLoading(false);
          notifySuccess(t("common:success"));
          Cookies.set("userInfo", JSON.stringify(res));
          window.location.reload();
        }
      })
      .catch((err) => {
        setLoading(false);
        notifyError(err?.response?.data?.message || err?.message);
      });
  };

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      const user = JSON.parse(Cookies.get("userInfo"));
      setValue("name", user.name);
      setValue("email", user.email);
      if (user.address) {
        setValue("street", user.address.street);
        setValue("houseNumber", user.address.houseNumber);
        setValue("apartmentNumber", user.address.apartmentNumber);
        setValue("floor", user.address.floor);
        setValue("entryCode", user.address.entryCode);
        setValue("postalCode", user.address.postalCode);
        setChosenCity(user.address.city);
      }
      setValue("phone", user.phone);
      setImageUrl(user.image);
    }
  }, [setValue]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("firstTime");
    }
  }, [localStorage.firstTime])


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <img src={initializeAddressTitle.src} alt="login" className="h-28 mx-auto -mt-4 -mb-6" />
      <p className="text-center text-lg font-semibold">{t("common:hey")} {userInfo?.name.split(' ')[0]}! {t("common:initializeAddressDes")}</p>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid-cols-6 md:gap-6">
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="lg:mt-6 mt-4 bg-white">
                <div className="grid grid-cols-6 gap-6">

                  <div className="col-span-3 sm:col-span-3">
                    <Label label={t("common:city")} />
                    <City
                      setValue={setChosenCity}
                      placeholder={JSON.stringify(chosenCity)}
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-3">
                    <InputArea
                      register={register}

                      label={t("common:street")}
                      name="street"
                      type="text"
                      placeholder={t("common:street")}
                    />
                    <Error errorName={errors.street} />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <InputArea
                      register={register}
                      label={t("common:houseNumber")}
                      name="houseNumber"
                      type="text"
                      placeholder={t("common:houseNumber")}
                    />
                    <Error errorName={errors.houseNumber} />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <InputArea
                      register={register}
                      label={t("common:apartmentNumber")}
                      name="apartmentNumber"
                      type="text"
                      placeholder={t("common:apartmentNumber")}
                    />
                    <Error errorName={errors.apartmentNumber} />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <InputArea
                      register={register}
                      label={t("common:floor")}
                      name="floor"
                      type="number"
                      placeholder={t("common:floor")}
                      isRequired={false}
                    />
                    <Error errorName={errors.floor} />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <InputArea
                      register={register}
                      label={t("common:entryCode")}
                      name="entryCode"
                      type="text"
                      placeholder={t("common:entryCode")}
                      isRequired={false}
                    />
                    <Error errorName={errors.entryCode} />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <InputArea
                      register={register}
                      label={t("common:postalCode") + " " + t("common:optional")}
                      name="postalCode"
                      type="text"
                      placeholder={t("common:postalCode")}
                      isRequired={false}
                    />
                    <Error errorName={errors.postalCode} />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <InputArea
                      register={register}
                      label={t("common:phone")}
                      name="phone"
                      type="tel"
                      placeholder={t("common:phone")}
                    />
                    <Error errorName={errors.phone} />
                  </div>


                </div>
                <div className="w-full mt-7">
                  {loading ? (
                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full flex items-center justify-center font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
                    >
                      <img
                        src="/loader/spinner.gif"
                        alt="Loading"
                        width={20}
                        height={10}
                      />
                      <span className="font-serif ml-2 font-light">
                        {t("common:processing")}
                      </span>
                    </button>
                  ) : (
                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full flex items-center justify-center font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
                      onClick={() => localStorage.removeItem("firstTime")}
                    >
                      {showingTranslateValue(
                        storeCustomizationSetting?.dashboard?.update_button
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    // <></>
  );
};

export default UserAddressInitialize;
