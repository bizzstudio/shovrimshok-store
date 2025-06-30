// shapira-store/src/component/select/City.jsx
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import useTranslation from "next-translate/useTranslation";

const City = ({ setValue, placeholder, value, disabled }) => {
  const { t } = useTranslation();

  const [cities, setCities] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "https://data.gov.il/api/3/action/datastore_search?resource_id=8f714b6f-c35c-4b40-a0e7-547b675eee0e&limit=100000"
      );
      const data = await response.json();
      let tempCities = []
      data.result.records.forEach(record => {
        tempCities.push(record)
      })
      setCities(tempCities.sort((a, b) => a.city_name_he.localeCompare(b.city_name_he, 'he')))
    })();
  }, []);

  const options = cities.map((city) => ({
    value: city,
    label: city.city_name_he
  }));

  // מצא את האופציה המתאימה לערך הנוכחי
  const selectedOption = value
    ? options.find(opt => opt.label.trim() === value.trim())
    : null;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#e7191f' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 0.05px #e7191f' : provided.boxShadow,
      '&:hover': {
        borderColor: state.isFocused ? '#e7191f' : provided.borderColor,
      },
      padding: '5px',
      direction: 'rtl',
      textAlign: 'right',
      borderRadius: '6px',
      fontSize: '14px', // גודל טקסט placeholder
    }),
    menu: (provided) => ({
      ...provided,
      direction: 'rtl', // שינוי כיוון הכתיבה בתפריט האופציות
      textAlign: 'right',
    }),
    option: (provided, state) => ({
      ...provided,
      textAlign: 'right',
      backgroundColor: state.isSelected ? '#e7191f' : state.isFocused ? '#ffdbdb' : provided.backgroundColor,
      '&:active': {
        backgroundColor: '#e7191f', // צבע הרקע כאשר לוחצים על האופציות
        color: 'white',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      textAlign: 'right',
      color: '#9ca3af', // צבע placeholder
      fontSize: '14px', // גודל טקסט placeholder
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(selectedOption) => setValue(selectedOption ? selectedOption.value.city_name_he : "")}
      placeholder={placeholder ? JSON.parse(placeholder).city_name_he : t("common:selectCity")}
      styles={customStyles}
      noOptionsMessage={() => t("common:noOptions")}
      isRtl={true}
      menuPortalTarget={typeof window !== "undefined" ? document.body : null}
      menuPosition="absolute"
      isDisabled={disabled}
    />
  );
};

export default City;
