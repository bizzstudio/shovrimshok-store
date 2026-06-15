// src/component/guestAddress/GuestAddressForm.jsx
import React, { useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import useTranslation from "next-translate/useTranslation";

// Internal import
import Label from "@component/form/Label";
import Error from "@component/form/Error";
import InputArea from "@component/form/InputArea";
import City from "@component/select/City";

const GuestAddressForm = ({
  register,
  errors,
  setError,
  clearErrors,
  watch,
  chosenCity,
  setChosenCity,
}) => {
  const { t } = useTranslation();

  // ניקוי error של עיר
  useEffect(() => {
    if (chosenCity && errors?.guestCity) {
      clearErrors("guestCity");
    }
  }, [chosenCity, errors?.guestCity, clearErrors]);

  // מעקב אחר השדות לניקוי errors
  const guestName = watch("guestName");
  const guestLastName = watch("guestLastName");
  const guestPhone = watch("guestPhone");
  const guestEmail = watch("guestEmail");
  const guestStreet = watch("guestStreet");
  const guestHouseNumber = watch("guestHouseNumber");
  const guestApartmentNumber = watch("guestApartmentNumber");

  const phoneRegex = /^05\d{8}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (guestName?.trim() && errors?.guestName) clearErrors("guestName");
  }, [guestName, errors?.guestName, clearErrors]);

  useEffect(() => {
    if (guestLastName?.trim() && errors?.guestLastName) clearErrors("guestLastName");
  }, [guestLastName, errors?.guestLastName, clearErrors]);

  useEffect(() => {
    if (guestPhone && phoneRegex.test(guestPhone) && errors?.guestPhone) clearErrors("guestPhone");
  }, [guestPhone, errors?.guestPhone, clearErrors]);

  useEffect(() => {
    if (guestEmail && emailRegex.test(guestEmail) && errors?.guestEmail) clearErrors("guestEmail");
  }, [guestEmail, errors?.guestEmail, clearErrors]);

  useEffect(() => {
    if (guestStreet?.trim() && errors?.guestStreet) clearErrors("guestStreet");
  }, [guestStreet, errors?.guestStreet, clearErrors]);

  useEffect(() => {
    if (guestHouseNumber?.trim() && errors?.guestHouseNumber) clearErrors("guestHouseNumber");
  }, [guestHouseNumber, errors?.guestHouseNumber, clearErrors]);

  useEffect(() => {
    if (guestApartmentNumber?.trim() && errors?.guestApartmentNumber) clearErrors("guestApartmentNumber");
  }, [guestApartmentNumber, errors?.guestApartmentNumber, clearErrors]);

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <IoLocationOutline className="text-customRed text-xl" />
            {t("common:deliveryDetails")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* שם פרטי */}
            <div>
              <InputArea
                register={register}
                label={t("common:firstName")}
                name="guestName"
                type="text"
                placeholder={t("common:firstName")}
              />
              <Error errorName={errors?.guestName} />
            </div>

            {/* שם משפחה */}
            <div>
              <InputArea
                register={register}
                label={t("common:lastName")}
                name="guestLastName"
                type="text"
                placeholder={t("common:lastName")}
              />
              <Error errorName={errors?.guestLastName} />
            </div>

            {/* טלפון */}
            <div>
              <InputArea
                register={register}
                label={t("common:phone")}
                name="guestPhone"
                type="tel"
                placeholder={t("common:phone")}
              />
              <Error errorName={errors?.guestPhone} />
            </div>

            {/* אימייל */}
            <div>
              <InputArea
                register={register}
                label={t("common:email")}
                name="guestEmail"
                type="email"
                placeholder={t("common:email")}
              />
              <Error errorName={errors?.guestEmail} />
            </div>

            {/* עיר */}
            <div>
              <Label label={t("common:city")} isRequired={true} />
              <City
                setValue={setChosenCity}
                value={chosenCity}
              />
              <Error errorName={errors?.guestCity} />
            </div>

            {/* רחוב */}
            <div>
              <InputArea
                register={register}
                label={t("common:street")}
                name="guestStreet"
                type="text"
                placeholder={t("common:street")}
              />
              <Error errorName={errors?.guestStreet} />
            </div>

            {/* מספר בית */}
            <div>
              <InputArea
                register={register}
                label={t("common:houseNumber")}
                name="guestHouseNumber"
                type="text"
                placeholder={t("common:houseNumber")}
              />
              <Error errorName={errors?.guestHouseNumber} />
            </div>

            {/* מספר דירה */}
            <div>
              <InputArea
                register={register}
                label={t("common:apartmentNumber")}
                name="guestApartmentNumber"
                type="text"
                placeholder={t("common:apartmentNumber")}
              />
              <Error errorName={errors?.guestApartmentNumber} />
            </div>

            {/* קומה */}
            <div>
              <InputArea
                register={register}
                label={t("common:floor")}
                name="guestFloor"
                type="number"
                placeholder={t("common:floor")}
                isRequired={false}
              />
              <Error errorName={errors?.guestFloor} />
            </div>

            {/* קוד כניסה */}
            <div>
              <InputArea
                register={register}
                label={t("common:entryCode")}
                name="guestEntryCode"
                type="text"
                placeholder={t("common:entryCode")}
                isRequired={false}
              />
              <Error errorName={errors?.guestEntryCode} />
            </div>

            {/* מיקוד */}
            <div>
              <InputArea
                register={register}
                label={t("common:postalCode")}
                name="guestPostalCode"
                type="text"
                placeholder={t("common:postalCode")}
                isRequired={false}
              />
              <Error errorName={errors?.guestPostalCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestAddressForm;
