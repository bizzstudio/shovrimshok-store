import { FiLock, FiMail } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import dayjs from 'dayjs';
import 'dayjs/locale/he';

// הגדרת השפה לעברית
dayjs.locale('he');

//internal  import
import Error from "@component/form/Error";
import useLoginSubmit from "@hooks/useLoginSubmit";
import InputArea from "@component/form/InputArea";
import deliveryMsgTitle from 'public/titles/deliveryMsgTitle.svg'
import { useEffect } from "react";

const DeliveryMsgModal = ({ closeModal = () => { } }) => {
  const { t } = useTranslation();

  // התאמת ההודעה בהתאם לשעה (אם לפני או אחרי 14:00)
  let now = dayjs();
  const currentHour = now.hour();

  if (currentHour >= 14) {
    now = now.add(1, 'day');
  }

  const formattedDate = now.format('DD/MM');

  return (
    <div className="w-52">
      <div className="text-center mb-6">
        <img src={deliveryMsgTitle.src} alt="Register Success" className="h-28 mx-auto -mt-4 -mb-12" />
      </div>
      <div className="flex flex-col justify-center gap-3">
        <p className="text-center text-lg">
          {currentHour < 14 ? t("common:deliveryMessagePart1") + "(" + formattedDate + ")" + ", " + t("common:deliveryMessagePart2") : t("common:deliveryMessagePart3") + "(" + formattedDate + ")" + ", " + t("common:deliveryMessagePart2")}
        </p>
        <button onClick={closeModal}
          className="flex items-center justify-center font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap">
          {t("common:ok")}
        </button>
      </div>
    </div>
  );
};

export default DeliveryMsgModal;
