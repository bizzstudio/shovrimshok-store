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

const UpdateProfile = () => {
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

  return (
    <Dashboard
      title={showingTranslateValue(
        storeCustomizationSetting?.dashboard?.update_profile
      )}
      description="This is edit profile page"
    >
      <div className="max-w-screen-2xl">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h2 className="text-xl font-serif font-semibold mb-5">
                {showingTranslateValue(
                  storeCustomizationSetting?.dashboard?.update_profile
                )}
              </h2>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="bg-white space-y-6">
              <div>
                <Label label="Photo" />
                <div className="mt-1 flex items-center">
                  <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
                </div>
              </div>
            </div>

            <div className="mt-10 sm:mt-0">
              <div className="md:grid-cols-6 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="lg:mt-6 mt-4 bg-white">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.full_name
                          )}
                          name="name"
                          type="text"
                          placeholder={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.full_name
                          )}
                        />
                        <Error errorName={errors.name} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <Label label={t("common:city")} />
                        <City
                          setValue={setChosenCity}
                          placeholder={JSON.stringify(chosenCity)}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
        
                          label={t("common:street")}
                          name="street"
                          type="text"
                          placeholder={t("common:street")}
                        />
                        <Error errorName={errors.street} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:houseNumber")}
                          name="houseNumber"
                          type="text"
                          placeholder={t("common:houseNumber")}
                        />
                        <Error errorName={errors.houseNumber} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:apartmentNumber")}
                          name="apartmentNumber"
                          type="text"
                          placeholder={t("common:apartmentNumber")}
                        />
                        <Error errorName={errors.apartmentNumber} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:floor")}
                          name="floor"
                          type="text"
                          placeholder={t("common:floor")}
                          isRequired={false}
                        />
                        <Error errorName={errors.floor} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
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
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={t("common:postalCode")}
                          name="postalCode"
                          type="text"
                          placeholder={t("common:postalCode")}
                          isRequired={false}
                        />
                        <Error errorName={errors.postalCode} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.user_phone
                          )}
                          name="phone"
                          type="tel"
                          placeholder={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.user_phone
                          )}
                        />
                        <Error errorName={errors.phone} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
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
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-3 mt-5 text-right">
                      {loading ? (
                        <button
                          disabled={loading}
                          type="submit"
                          className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-customGreen text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-customGreen-dark h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
                        >
                          <img
                            src="/loader/spinner.gif"
                            alt="Loading"
                            width={20}
                            height={10}
                          />
                          <span className="font-serif mr-2 font-light">
                            {t("common:Processing")}
                          </span>
                        </button>
                      ) : (
                        <button
                          disabled={loading}
                          type="submit"
                          className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-customGreen text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-customGreen-dark h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
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
      </div>
    </Dashboard>
  );
};

export default dynamic(() => Promise.resolve(UpdateProfile), { ssr: false });
