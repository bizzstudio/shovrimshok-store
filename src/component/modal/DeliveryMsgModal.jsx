// DeliveryMsgModal.jsx
import dayjs from 'dayjs';
import 'dayjs/locale/he';
import useTranslation from "next-translate/useTranslation";
import deliveryMsgTitle from 'public/titles/deliveryMsgTitle.svg';
import Image from 'next/image';
import MainBT from '@component/button/MainBT';
import ShapiraTitle from '@component/shapira-title/ShapiraTitle';

// הגדרת השפה לעברית
dayjs.locale('he');

const DeliveryMsgModal = ({
  closeModal = () => { },
  cityName = '',          // שם העיר/האזור לצורך הטקסט
  shippingDays = [],      // מערך הימים המותרים למשלוח: [1,2,3,4,5,6] וכדומה
}) => {
  console.log('shippingDays :>> ', shippingDays);
  const { t } = useTranslation();

  // יום ושעה נוכחיים (dayjs מחזיר 0=Sunday ... 6=Saturday)
  const now = dayjs();
  const currentDayJs = now.day();        // 0 עד 6
  const currentHour = now.hour();

  // הופכים ל"פורמט מערכת" - ראשון=1, שני=2, שבת=7
  const systemDay = currentDayJs + 1;

  // פונקציה עזר שתיתן לנו את שם היום בשבוע בעברית (למשל "ראשון" "שני" וכו')
  const getHebrewDayName = (dayNumber) => {
    // נניח מערך ארוך עבור 1..7
    const daysMap = [
      'ראשון',    // index=0 => dayNumber=1
      'שני',
      'שלישי',
      'רביעי',
      'חמישי',
      'שישי',
      'שבת',
    ];
    return daysMap[dayNumber - 1];
  };

  // פונקציה לחיפוש יום המשלוח הבא במידה שלא היום
  const findNextShippingDay = (startDay) => {
    // נתחיל מיום "startDay+1", ונחפש עד 7 ימים קדימה
    for (let i = 0; i < 14; i++) {
      // dayToCheck במונחי המערכת (1..7)
      const dayToCheck = ((startDay - 1 + i) % 7) + 1;
      if (shippingDays.includes(String(dayToCheck))) {
        // זהו היום המשלוח הבא
        return dayToCheck;
      }
    }
    // אם לא מצאנו בכלל, נחזיר null
    return null;
  };

  // קבלת יום המשלוח הבא
  const getNextShippingDate = (currentSystemDay, currentHour, shippingDays, plus = 0) => {
    let searchFromDay = currentSystemDay;

    const isFriday = currentSystemDay === 6;
    const cutoff = isFriday ? 10 : 14;

    // אם עברנו את שעת החיתוך - מתחילים חיפוש מהיום הבא
    if (currentHour >= cutoff) {
      searchFromDay = ((currentSystemDay) % 7) + 1;
    }

    const nextDay = findNextShippingDay(searchFromDay + plus);

    if (!nextDay) return {};

    let daysToAdd = 0;
    let checkDay = currentSystemDay;

    while (checkDay !== nextDay) {
      checkDay = ((checkDay) % 7) + 1;
      daysToAdd++;
    }

    // ✅ אם היום הבא שמצאנו זה היום עצמו, והיום הזה היחיד במערך – נוסיף שבוע
    const onlyOneShippingDay = shippingDays.length === 1;
    const isSameDay = nextDay === currentSystemDay;
    if (isSameDay && onlyOneShippingDay) {
      daysToAdd += 7;
    }

    const targetDate = now.add(daysToAdd, 'day');
    const isNextFriday = nextDay === 6;
    const cutoffHour = isNextFriday ? 14 : 22;

    return {
      dayName: getHebrewDayName(nextDay),
      date: targetDate.format('DD/MM'),
      hour: cutoffHour
    };
  };

  // נבדוק האם היום במערכת הוא אחד מימי המשלוח
  const isTodayShippingDay = shippingDays.includes(String(systemDay));

  // משתנים עבור הודעה סופית:
  let finalMessage = '';
  let fridayCutoff = 14;
  let isFriday = (systemDay === 6);  // שישי לפי המערכת = 6

  // לוגיקה עיקרית
  if (isTodayShippingDay) { // אם היום הוא יום משלוח
    if (isFriday) { // יום שישי - cutoff 10
      if (currentHour < 10) { // לפני 10 - אפשר היום
        // נמצא את יום המשלוח הבא למקרה של עומס
        const nextShipping = getNextShippingDate(systemDay, currentHour, shippingDays, 1);
        if (nextShipping.dayName) {
          finalMessage = `אנו צפויים לספק את המשלוח שלך (ל${cityName}) היום (${now.format('DD/MM')}) עד השעה ${fridayCutoff}, במקרה של עומס חריג המשלוח יגיע ביום המשלוח הבא, יום ${nextShipping.dayName} (${nextShipping.date}) עד השעה ${nextShipping.hour}.`;
        } else {
          // אין בכלל יום משלוח
          finalMessage = `אין ימי משלוח זמינים ל${cityName}.`;
        }
      } else { // אחרי 10 - המשלוח נדחה ליום הבא
        const nextShipping = getNextShippingDate(systemDay, currentHour, shippingDays);
        if (nextShipping.dayName) {
          finalMessage = `אנו צפויים לספק את המשלוח שלך (ל${cityName}) ביום ${nextShipping.dayName} (${nextShipping.date}) עד השעה ${nextShipping.hour}.`;
        } else {
          // אין בכלל יום משלוח - מצב קצה
          finalMessage = `אין ימי משלוח זמינים ל${cityName}.`;
        }
      }
    } else { // לא יום שישי - cutoff 14
      if (currentHour < 14) { // לפני 14 - אפשר היום
        // נמצא את יום המשלוח הבא למקרה של עומס
        const nextShipping = getNextShippingDate(systemDay, currentHour, shippingDays, 1);
        if (nextShipping.dayName) {
          finalMessage = `אנו צפויים לספק את המשלוח שלך (ל${cityName}) היום (${now.format('DD/MM')}) עד השעה 22, במקרה של עומס חריג המשלוח יגיע ביום המשלוח הבא, יום ${nextShipping.dayName} (${nextShipping.date}) עד השעה ${nextShipping.hour}.`;
        } else {
          // אין בכלל יום משלוח - מצב קצה
          finalMessage = `אין ימי משלוח זמינים ל${cityName}.`;
        }
      } else { // אחרי 14 - המשלוח נדחה ליום הבא
        const nextShipping = getNextShippingDate(systemDay, currentHour, shippingDays);
        if (nextShipping.dayName) {
          finalMessage = `אנו צפויים לספק את המשלוח שלך (ל${cityName}) ביום ${nextShipping.dayName} (${nextShipping.date}) עד השעה ${nextShipping.hour}.`;
        } else {
          finalMessage = `אין ימי משלוח זמינים ל${cityName}.`;
        }
      }
    }
  } else { // היום אינו יום משלוח - יש למצוא את היום הבא
    const nextShipping = getNextShippingDate(systemDay, currentHour, shippingDays);
    if (nextShipping.dayName) {
      finalMessage = `אנו צפויים לספק את המשלוח שלך (ל${cityName}) ביום ${nextShipping.dayName} (${nextShipping.date}) עד השעה ${nextShipping.hour}.`;
    } else {
      // אין כלל ימים
      finalMessage = `אין ימי משלוח זמינים ל${cityName}.`;
    }
  };

  return (
    <div className="w-52">
      <div className="text-center mb-6">
        <ShapiraTitle text={t("common:deliveryMsgTitle")} height={70} key="deliveryMsgTitle" />
      </div>
      <div className="flex flex-col justify-center gap-3">
        <p className="text-center text-lg">
          {finalMessage}
        </p>
        <MainBT onClick={closeModal}>
          {t("common:ok")}
        </MainBT>
      </div>
    </div>
  );
};

export default DeliveryMsgModal;