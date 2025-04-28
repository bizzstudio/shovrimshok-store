import Cookies from "js-cookie";
import React from "react";

const Label = ({ label, htmlFor = '', isRequired = false, className = '' }) => {

  let currentLang = Cookies.get('_lang');

  switch (currentLang) {
    case 'he':
      currentLang = true;
      break;
    case 'en':
      currentLang = false;
      break;
    default:
      currentLang = false;
      break;
  }

  return (
    <label className={`${className} block text-gray-500 font-medium text-sm leading-none mb-2 cursor-pointer ${htmlFor ? 'cursor-pointer' : ''} ${currentLang ? 'text-right' : ''}`} htmlFor={htmlFor}>
      {isRequired && label && <span className="text-lg leading-[0px] text-red-500 me-0.5">*</span>}
      {label}
    </label>
  );
};

export default Label;
