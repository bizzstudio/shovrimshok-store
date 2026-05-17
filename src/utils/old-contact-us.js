// src/pages/contact-us.js
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";
import { FiMail, FiMapPin, FiBell } from "react-icons/fi";

// Internal import
import Layout from "@layout/Layout";
import Label from "@component/form/Label";
import Error from "@component/form/Error";
import { notifySuccess } from "@utils/toast";
import InputArea from "@component/form/InputArea";
import PageHeader from "@component/header/PageHeader";
import useGetSetting from "@hooks/useGetSetting";
import CMSkeleton from "@component/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Link from "next/link";
import CustomerServices from "@services/CustomerServices";
import notifyApiResponse from "@utils/notifyApiResponse";
import MainBT from "@component/button/MainBT";

const ContactUs = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting, loading: settingsLoading, error } = useGetSetting();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await CustomerServices.sendContactUsMessage(data);
      notifyApiResponse(res, true);
      reset(); // ריקון הטופס לאחר שליחה מוצלחת
    } catch (error) {
      console.log("error :>> ", error);
      notifyApiResponse(error, false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="אודות" description="עמוד אודות - שוברים שוק">
      {storeCustomizationSetting?.contact_us?.header_status && (
        <PageHeader
          headerBg={storeCustomizationSetting?.contact_us?.header_bg}
          title={showingTranslateValue(
            storeCustomizationSetting?.contact_us?.title
          )}
        />
      )}

      <div className="bg-white">
        <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
          {/* contact form */}
          <div className="px-0 mx-auto flex flex-col lg:flex-row w-full justify-between gap-16">
            <div className="px-0 pb-2 w-full lg:w-6/12 flex flex-col md:flex-row">
              <form
                onSubmit={handleSubmit(submitHandler)}
                className="w-full mx-auto flex flex-col justify-center"
              >
                <div className="mb-12">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold font-serif mb-3">
                    <CMSkeleton
                      count={1}
                      height={50}
                      // error={error}
                      loading={settingsLoading}
                      data={storeCustomizationSetting?.contact_us?.form_title}
                    />
                  </h3>
                  <p className="text-base opacity-90">
                    <CMSkeleton
                      count={2}
                      height={20}
                      // error={error}
                      loading={settingsLoading}
                      data={
                        storeCustomizationSetting?.contact_us?.form_description
                      }
                    />
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {/* שם איש קשר */}
                  <div className="relative col-span-2 sm:col-span-1">
                    <InputArea
                      register={register}
                      label={t("common:contact-page-form-input-contact-name")}
                      name="contactName"
                      type="text"
                      placeholder={t("common:contact-page-form-placeholder-contact-name")}
                    />
                    <Error errorName={errors.contactName} />
                  </div>

                  {/* שם החברה */}
                  <div className="relative col-span-2 sm:col-span-1">
                    <InputArea
                      register={register}
                      label={t("common:contact-page-form-input-business-name")}
                      name="businessName"
                      type="text"
                      placeholder={t("common:contact-page-form-placeholder-business-name")}
                    />
                    <Error errorName={errors.businessName} />
                  </div>

                  {/* שם התחום */}
                  <div className="relative col-span-2 sm:col-span-1">
                    <InputArea
                      register={register}
                      label={t("common:contact-page-form-input-business-field")}
                      name="businessField"
                      type="text"
                      placeholder={t("common:contact-page-form-placeholder-business-field")}
                    />
                    <Error errorName={errors.businessField} />
                  </div>

                  {/* מיקום החברה */}
                  <div className="relative col-span-2 sm:col-span-1">
                    <InputArea
                      register={register}
                      label={t("common:contact-page-form-input-business-location")}
                      name="businessLocation"
                      type="text"
                      placeholder={t("common:contact-page-form-placeholder-business-location")}
                    />
                    <Error errorName={errors.businessLocation} />
                  </div>

                  {/* טלפון */}
                  <div className="relative col-span-2 sm:col-span-1">
                    <InputArea
                      register={register}
                      label={t("common:contact-page-form-input-phone")}
                      name="phone"
                      type="tel"
                      placeholder={t("common:contact-page-form-placeholder-phone")}
                    />
                    <Error errorName={errors.phone} />
                  </div>

                  {/* דוא"ל */}
                  <div className="relative col-span-2 sm:col-span-1">
                    <InputArea
                      register={register}
                      isRequired={false}
                      label={`${t("common:contact-page-form-input-email")} ${t("common:optional")}`}
                      name="email"
                      type="email"
                      placeholder={t("common:contact-page-form-placeholder-email")}
                    />
                    <Error errorName={errors.email} />
                  </div>

                  {/* בקשה מיוחדת */}
                  <div className="relative col-span-2">
                    <Label
                      label={t("common:contact-page-form-input-special-requests")}
                    />
                    <textarea
                      {...register("specialRequests")}
                      name="specialRequests"
                      className="px-4 py-3 flex items-center w-full rounded appearance-none opacity-75 transition duration-300 ease-in-out text-sm focus:ring-0 bg-white border border-gray-300 focus:shadow-none focus:outline-none focus:border-gray-500 placeholder-body"
                      autoComplete="off"
                      spellCheck="false"
                      rows="4"
                      placeholder={t("common:contact-page-form-placeholder-special-requests")}
                    ></textarea>
                    <Error errorName={errors.specialRequests} />
                  </div>

                  {/* תקנון */}
                  <div className="relative flex items-start col-span-2">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        {...register("terms", {
                          required: `${t("common:terms-required")}`,
                        })}
                        type="checkbox"
                        className="focus:ring-customRed h-4 w-4 text-customRed border-gray-300 rounded"
                      />
                    </div>
                    <div className="ms-3 text-sm flex flex-col">
                      <label htmlFor="terms" className="font-medium text-gray-700">
                        {t("common:accept")} <Link target="_blank" href="/terms-and-conditions" className="text-customRed hover:text-customRed-dark">{t("common:terms-of-use")}</Link> {t("common:and")}<Link target="_blank" href="/privacy-policy" className="text-customRed hover:text-customRed-dark">{t("common:privacy-policy")}</Link>
                      </label>
                      <Error errorName={errors.terms} />
                    </div>
                  </div>

                  {/* שלח */}
                  <div className="relative col-span-2 flex justify-end md:-mt-5 -mt-2">
                    {loading ? (
                      <MainBT
                        disabled={true}
                        type="submit"
                      >
                        <img src="/loader/spinner.gif" className="saturate-0" alt="Loading" width={20} height={10} />
                        <span className="ms-1">{t("common:processing")}</span>
                      </MainBT>
                    ) : (
                      <MainBT
                        disabled={loading}
                        type="submit"
                      >
                        {t("common:contact-page-form-send-btn")}
                      </MainBT>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* תמונה משמאל */}
            <div className="w-full lg:w-5/12 flex flex-col h-full">
              <Image
                width={874}
                height={874}
                src={
                  storeCustomizationSetting?.contact_us?.left_col_img ||
                  "/contact-us.png"
                }
                alt="logo"
                className="block w-auto"
              />

              {/* פרטי החנות */}
              <div className="flex flex-col gap-5 mt-6">                {settingsLoading ? (<CMSkeleton count={10} height={20} error={error} loading={settingsLoading} />) : (
                <div className="flex justify-start items-center gap-4 border p-5 rounded-lg text-center">
                  <span className="flex justify-center text-4xl text-customRed">
                    <FiMail />
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center items-start justify-start gap-0 sm:gap-2">
                    <h5 className="text-xl font-bold">
                      {showingTranslateValue(
                        storeCustomizationSetting?.contact_us?.email_box_title
                      )}
                    </h5>
                    <p className="text-base opacity-90">
                      <a
                        href={`mailto:${storeCustomizationSetting?.contact_us?.email_box_email}`}
                        className="text-customRed"
                      >
                        {showingTranslateValue(
                          storeCustomizationSetting?.contact_us?.email_box_email
                        )}
                      </a>{" "}
                      {showingTranslateValue(
                        storeCustomizationSetting?.contact_us?.email_box_text
                      )}
                    </p>
                  </div>
                </div>
              )}

                {settingsLoading ? (
                  <CMSkeleton
                    count={10}
                    height={20}
                    error={error}
                    loading={settingsLoading}
                  />
                ) : (
                  <div className="flex justify-start items-center gap-4 border p-5 rounded-lg text-center">
                    <span className="flex justify-center text-4xl text-customRed">
                      <FiBell />
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center items-start justify-start gap-0 sm:gap-2">
                      <h5 className="text-xl font-bold">
                        {showingTranslateValue(
                          storeCustomizationSetting?.contact_us?.call_box_title
                        )}
                      </h5>
                      <p className="text-base opacity-90">
                        <a
                          href={`mailto:${storeCustomizationSetting?.contact_us?.call_box_phone}`}
                          className="text-customRed"
                        >
                          {showingTranslateValue(
                            storeCustomizationSetting?.contact_us?.call_box_phone
                          )}
                        </a>{" "}
                        {showingTranslateValue(
                          storeCustomizationSetting?.contact_us?.call_box_text
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {settingsLoading ? (
                  <CMSkeleton
                    count={10}
                    height={20}
                    error={error}
                    loading={settingsLoading}
                  />
                ) : (
                  <div className="flex justify-start items-center gap-4 border p-5 rounded-lg text-center">
                    <span className="flex justify-center text-4xl text-customRed">
                      <FiMapPin />
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center items-start justify-start gap-0 sm:gap-2">
                      <h5 className="text-xl font-bold">
                        {showingTranslateValue(
                          storeCustomizationSetting?.contact_us?.address_box_title
                        )}
                      </h5>
                      <p className="text-base opacity-90 text-customRed">
                        <span>
                          {showingTranslateValue(
                            storeCustomizationSetting?.contact_us
                              ?.address_box_address_one
                          )}
                        </span>
                        {/* {" "}
                      <br />
                      {showingTranslateValue(
                        storeCustomizationSetting?.contact_us
                          ?.address_box_address_two
                      )}
                      {" "}
                      <br />
                      {showingTranslateValue(
                        storeCustomizationSetting?.contact_us
                          ?.address_box_address_three
                      )} */}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;