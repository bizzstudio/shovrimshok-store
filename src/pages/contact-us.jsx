// src/pages/contact-us.js
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";

// Internal import
import Layout from "@layout/Layout";
import Error from "@component/form/Error";
import { notifySuccess } from "@utils/toast";
import InputArea from "@component/form/InputArea";
import PageHeader from "@component/header/PageHeader";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CustomerServices from "@services/CustomerServices";
import notifyApiResponse from "@utils/notifyApiResponse";
import MainBT from "@component/button/MainBT";
import FactoryStore from "public/new customers/FactoryStore.svg";
import QuickDelivery from "public/new customers/QuickDelivery.svg";
import ProductsVariety from "public/new customers/ProductsVariety.svg";
import WholesalePrices from "public/new customers/WholesalePrices.svg";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";

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
      reset();
    } catch (error) {
      console.log("error :>> ", error);
      notifyApiResponse(error, false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={t("common:contact-us")} description={t("common:contact-us-description")} noFooterTop={true}>
      {storeCustomizationSetting?.contact_us?.header_status && (
        <PageHeader
          height={100}
          // useShapiraTitle={false}
          headerBg={storeCustomizationSetting?.contact_us?.header_bg}
          title={showingTranslateValue(
            storeCustomizationSetting?.contact_us?.title
          )}
        />
      )}

      <div className="bg-gray-50 sm:pt-20 pt-16">
        {/* Features Section - Full Width */}
        <div className="w-full px-4 sm:px-6 xl:px-56 md:px-20 sm:mb-20 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-16">
            {/* חנות המפעל */}
            <div className="text-center shadow-lg p-5 pb-4 rounded-lg">
              <div className="flex justify-center sm:mb-3 mb-1">
                <Image src={FactoryStore} alt={t("common:factory-store")} width={80} height={80} className="svg-red-filter sm:h-20 h-12" />
              </div>
              <h3 className="sm:text-3xl text-xl font-bold text-customBlue mb-1.5">{t("common:factory-store")}</h3>
              <p className="text-gray-600 text-sm sm:text-base !leading-tight px-2 max-w-[250px] text-center mx-auto">
                {t("common:factory-store-description")}
              </p>
            </div>

            {/* אספקה מהירה */}
            <div className="text-center shadow-lg p-5 pb-4 rounded-lg">
              <div className="flex justify-center sm:mb-3 mb-1">
                <Image src={QuickDelivery} alt={t("common:quick-delivery")} width={80} height={80} className="svg-red-filter sm:h-20 h-12" />
              </div>
              <h3 className="sm:text-3xl text-xl font-bold text-customBlue mb-1.5">{t("common:quick-delivery")}</h3>
              <p className="text-gray-600 text-sm sm:text-base !leading-tight px-2 max-w-[250px] text-center mx-auto">
                {t("common:quick-delivery-description")}
              </p>
            </div>

            {/* מגוון מוצרים */}
            <div className="text-center shadow-lg p-5 pb-4 rounded-lg">
              <div className="flex justify-center sm:mb-3 mb-1">
                <Image src={ProductsVariety} alt={t("common:products-variety")} width={80} height={80} className="svg-red-filter sm:h-20 h-12" />
              </div>
              <h3 className="sm:text-3xl text-xl font-bold text-customBlue mb-1.5">{t("common:products-variety")}</h3>
              <p className="text-gray-600 text-sm sm:text-base !leading-tight px-2 max-w-[250px] text-center mx-auto">
                {t("common:products-variety-description")}
              </p>
            </div>

            {/* מחירי סיטונאות */}
            <div className="text-center shadow-lg p-5 pb-4 rounded-lg">
              <div className="flex justify-center sm:mb-3 mb-1">
                <Image src={WholesalePrices} alt={t("common:wholesale-prices")} width={80} height={80} className="svg-red-filter sm:h-20 h-12" />
              </div>
              <h3 className="sm:text-3xl text-xl font-bold text-customBlue mb-1.5">{t("common:wholesale-prices")}</h3>
              <p className="text-gray-600 text-sm sm:text-base !leading-tight px-2 max-w-[250px] text-center mx-auto">
                {t("common:wholesale-prices-description")}
              </p>
            </div>
          </div>
        </div>

        {/* Contact info boxes from admin (email/phone/address) */}
        {(() => {
          const cu = storeCustomizationSetting?.contact_us || {};
          const showEmailBox = cu.email_box_status !== false && (cu.email_box_title || cu.email_box_email || cu.email_box_text);
          const showCallBox = cu.call_box_status !== false && (cu.call_box_title || cu.call_box_phone || cu.call_box_text);
          const showAddressBox = cu.address_box_status !== false && (cu.address_box_title || cu.address_box_address_one || cu.address_box_address_two || cu.address_box_address_three);
          const anyBox = showEmailBox || showCallBox || showAddressBox;
          if (!anyBox) return null;
          return (
            <div className="w-full px-4 sm:px-6 xl:px-56 md:px-20 sm:mb-16 mb-10">
              <div className={`grid gap-4 sm:gap-8 ${[showEmailBox, showCallBox, showAddressBox].filter(Boolean).length === 3 ? "md:grid-cols-3" : [showEmailBox, showCallBox, showAddressBox].filter(Boolean).length === 2 ? "md:grid-cols-2" : "grid-cols-1"}`}>
                {showEmailBox && (
                  <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h3 className="text-xl font-bold text-customBlue mb-2">
                      {showingTranslateValue(cu.email_box_title)}
                    </h3>
                    {cu.email_box_email && (
                      <a href={`mailto:${showingTranslateValue(cu.email_box_email)}`} className="text-customRed underline block mb-1">
                        {showingTranslateValue(cu.email_box_email)}
                      </a>
                    )}
                    <p className="text-gray-600 text-sm">{showingTranslateValue(cu.email_box_text)}</p>
                  </div>
                )}
                {showCallBox && (
                  <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h3 className="text-xl font-bold text-customBlue mb-2">
                      {showingTranslateValue(cu.call_box_title)}
                    </h3>
                    {cu.call_box_phone && (
                      <a href={`tel:${showingTranslateValue(cu.call_box_phone)}`} className="text-customRed underline block mb-1">
                        {showingTranslateValue(cu.call_box_phone)}
                      </a>
                    )}
                    <p className="text-gray-600 text-sm">{showingTranslateValue(cu.call_box_text)}</p>
                  </div>
                )}
                {showAddressBox && (
                  <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h3 className="text-xl font-bold text-customBlue mb-2">
                      {showingTranslateValue(cu.address_box_title)}
                    </h3>
                    <p className="text-gray-600 text-sm">{showingTranslateValue(cu.address_box_address_one)}</p>
                    <p className="text-gray-600 text-sm">{showingTranslateValue(cu.address_box_address_two)}</p>
                    <p className="text-gray-600 text-sm">{showingTranslateValue(cu.address_box_address_three)}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Main Content - Centered */}
        {storeCustomizationSetting?.contact_us?.form_status !== false && (
        <div className="w-full bg-gray-100 sm:pb-[70px] sm:pt-14 pt-7 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center sm:mb-9 mb-5">
              {/* <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-customRed mb-6">
              {t("common:contact-main-title")}
            </h1> */}
              <ShapiraTitle
                text={showingTranslateValue(storeCustomizationSetting?.contact_us?.form_title) || t("common:contact-main-title")}
                height={70}
                className="!mb-5"
              />
              {storeCustomizationSetting?.contact_us?.form_description && (
                <p className="sm:text-xl text-base text-customBlue max-w-3xl mx-auto whitespace-pre-line">
                  {showingTranslateValue(storeCustomizationSetting?.contact_us?.form_description)}
                </p>
              )}
            </div>

            {/* Contact Form */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* שם איש קשר */}
                  <div className="relative">
                    <input
                      {...register("contactName", { required: t("common:contact-name-required") })}
                      type="text"
                      placeholder={t("common:contact-name-placeholder")}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-customRed focus:border-transparent outline-none transition-all duration-200"
                    />
                    <Error errorName={errors.contactName} />
                  </div>

                  {/* טלפון */}
                  <div className="relative">
                    <input
                      {...register("phone", { required: t("common:phone-required") })}
                      type="tel"
                      dir="rtl"
                      placeholder={t("common:phone-placeholder")}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-customRed focus:border-transparent outline-none transition-all duration-200"
                    />
                    <Error errorName={errors.phone} />
                  </div>

                  {/* שם העסק */}
                  <div className="relative">
                    <input
                      {...register("businessName", { required: t("common:business-name-required") })}
                      type="text"
                      placeholder={t("common:business-name-placeholder")}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-customRed focus:border-transparent outline-none transition-all duration-200"
                    />
                    <Error errorName={errors.businessName} />
                  </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    {loading ? (
                      <MainBT
                        disabled={true}
                        type="submit"
                        className='w-full'
                      >
                        <img src="/loader/spinner.gif" className="saturate-0" alt="Loading" width={20} height={10} />
                        <span className="ms-1">{t("common:processing")}</span>
                      </MainBT>
                    ) : (
                      <MainBT
                        disabled={loading}
                        type="submit"
                        className='w-full'
                      >
                        {t("common:contact-main-subtitle")}
                      </MainBT>
                    )}
                </div>
              </form>
            </div>
          </div>
        </div>
        )}
      </div>
    </Layout>
  );
};

export default ContactUs;