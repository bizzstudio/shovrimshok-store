import DeliveryServices from "@services/DeliveryServices";
import Cookies from "js-cookie";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FiInfo, FiTruck } from "react-icons/fi";
import dayjs from 'dayjs';
import 'dayjs/locale/he';

const InputShipping = ({
  register,
  value,
  time,
  cost = 0,
  currency,
  handleShippingCost,
  icon = <FiTruck />,
  isDeliverable,
  note = '',
  nextTime = null,
}) => {

  const { t } = useTranslation();

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

  const formatDate = (dateString) => {
    dayjs.locale('he');
    const date = dayjs(dateString);
    return date.format('dddd, D בMMMM בשעה HH:mm');
  };

  return (
    <div className={`p-3 card border border-gray-200 ${isDeliverable ? "bg-white" : "opacity-60"} rounded-md h-full flex items-center`}>
      <label className={`label w-full px-1.5 ${isDeliverable ? "cursor-pointer" : "cursor-not-allowed"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl text-gray-400">
              {icon}
            </span>
            <div>
              <h6 className={`flex items-center gap-1 font-serif font-medium text-base ${isDeliverable ? "text-gray-600" : "text-gray-400"} `}>
                {value} {note && <span className="text-base text-gray-400" title={note}><FiInfo /></span>}
              </h6>
              {!isDeliverable && <p className={nextTime ? "text-sm text-red-500 -mt-1 pl-3" : "text-sm text-gray-400 -mt-1"}>
                {nextTime ? `${t("common:nextAvailable")} ${formatDate(nextTime)}` : t("common:cannotDeliver")}
              </p>}
            </div>
          </div>
          <input
            onClick={() => {
              handleShippingCost(cost)
            }}
            {...register(`shippingOption`, {
              required: `Shipping Option is required!`,
            })}
            name="shippingOption"
            type="radio"
            disabled={!isDeliverable}
            value={value}
            className={`form-radio outline-none focus:ring-0 text-customGreen bg-transparent cursor-pointer ${!isDeliverable && "cursor-not-allowed"}`}
          />
        </div>
      </label>
    </div>
  );
};

export default InputShipping;
