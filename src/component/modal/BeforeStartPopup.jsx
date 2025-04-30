// BeforeStartPopup.jsx
import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import Cookies from "js-cookie";
import beforeStartTitle from "public/titles/beforeStartTitle.svg";

// קומפוננטות קיימות
import City from "@component/select/City";
import DeliveryServices from "@services/DeliveryServices";
import dayjs from "dayjs";
import "dayjs/locale/he";
import MainBT from "@component/button/MainBT";
dayjs.locale("he"); // עברית עבור dayjs

// הלוגיקה המלאה לחישוב מתי המשלוח הבא, מועתקת (או דומה) לזו שיש ב-DeliveryMsgModal
function getNextDeliveryMessage(cityNameHe, shippingDays) {
    if (!cityNameHe || !shippingDays?.length) {
        return "לא זמינים פרטי משלוח לעיר זו.";
    }

    // לוגיקת מציאת יום המשלוח הבא – זהה ל-DeliveryMsgModal
    const now = dayjs();
    const systemDay = now.day() + 1; // 1..7 (dayjs: 0=Sunday)
    const currentHour = now.hour();

    // פונקציה עזר
    const getHebrewDayName = (dayNumber) => {
        const daysMap = [
            "ראשון",
            "שני",
            "שלישי",
            "רביעי",
            "חמישי",
            "שישי",
            "שבת",
        ];
        return daysMap[dayNumber - 1];
    };

    // חיפוש יום משלוח
    const findNextShippingDay = (startDay) => {
        for (let i = 0; i < 14; i++) {
            const dayToCheck = ((startDay - 1 + i) % 7) + 1; // 1..7
            if (shippingDays.includes(String(dayToCheck))) {
                return dayToCheck;
            }
        }
        return null;
    };

    // פונקציה למציאת היום הבא
    const getNextShippingDate = (currentSystemDay, currentHour, shippingDays, plus = 0) => {
        let searchFromDay = currentSystemDay;
        const isFriday = currentSystemDay === 6;
        const cutoff = isFriday ? 10 : 13;

        // אם עברנו את שעת החיתוך, מחפשים החל ממחר
        if (currentHour >= cutoff) {
            searchFromDay = (currentSystemDay % 7) + 1;
        }

        const nextDay = findNextShippingDay(searchFromDay + plus);
        if (!nextDay) return {};

        let daysToAdd = 0;
        let checkDay = currentSystemDay;

        while (checkDay !== nextDay) {
            checkDay = (checkDay % 7) + 1;
            daysToAdd++;
        }

        // אם יש רק יום משלוח אחד והוא יוצא היום עצמו, נוסיף שבוע
        const onlyOneShippingDay = shippingDays.length === 1;
        const isSameDay = nextDay === currentSystemDay;
        if (isSameDay && onlyOneShippingDay) {
            daysToAdd += 7;
        }

        const targetDate = now.add(daysToAdd, "day");
        const isNextFriday = nextDay === 6;
        const cutoffHour = isNextFriday ? "13:00" : "21:30";

        return {
            dayName: getHebrewDayName(nextDay),
            date: targetDate.format("DD/MM"),
            hour: cutoffHour,
        };
    };

    // בדיקה אם היום עצמו במשלוח
    const isTodayShippingDay = shippingDays.includes(String(systemDay));
    let finalMessage = "";
    const isFriday = systemDay === 6; // שישי
    const fridayCutoff = 10;
    const midweekCutoff = 13;

    if (isTodayShippingDay) {
        if (isFriday) {
            // יום שישי
            if (currentHour < fridayCutoff) {
                // עוד אפשר היום
                const nextShipping = getNextShippingDate(systemDay, currentHour, shippingDays, 1);
                if (nextShipping.dayName) {
                    // finalMessage = `משלוח ל${cityNameHe} צפוי להגיע היום (${now.format("DD/MM")}) עד השעה 13, ואם יהיה עומס - ישלח ביום ${nextShipping.dayName} (${nextShipping.date}) עד ${nextShipping.hour}.`;
                    finalMessage = `הזמנות ליישובך יסופקו היום עד השעה 13:00.`;
                } else {
                    finalMessage = `אין ימי משלוח זמינים עבור ${cityNameHe}.`;
                }
            } else {
                // עבר cutoff
                const nextShipping = getNextShippingDate(systemDay, currentHour, shippingDays);
                if (nextShipping.dayName) {
                    // finalMessage = `משלוח ל${cityNameHe} ייצא ביום ${nextShipping.dayName} (${nextShipping.date}) עד השעה ${nextShipping.hour}.`;
                    finalMessage = `הזמנות ליישובך יסופקו ביום ${nextShipping.dayName} (${nextShipping.date}) עד השעה 21:30.`;
                } else {
                    finalMessage = `אין ימי משלוח זמינים עבור ${cityNameHe}.`;
                }
            }
        } else {
            // יום רגיל
            if (currentHour < midweekCutoff) {
                const nextShipping = getNextShippingDate(systemDay, currentHour, shippingDays, 1);
                if (nextShipping.dayName) {
                    // finalMessage = `משלוח ל${cityNameHe} צפוי להגיע היום (${now.format("DD/MM")}) עד השעה 22, ואם יהיה עומס - ישלח ביום ${nextShipping.dayName} (${nextShipping.date}) עד ${nextShipping.hour}.`;
                    finalMessage = `הזמנות ליישובך יסופקו היום עד השעה 21:30.`;
                } else {
                    finalMessage = `אין ימי משלוח זמינים עבור ${cityNameHe}.`;
                }
            } else {
                const nextShipping = getNextShippingDate(systemDay, currentHour, shippingDays);
                if (nextShipping.dayName) {
                    // finalMessage = `משלוח ל${cityNameHe} ייצא ביום ${nextShipping.dayName} (${nextShipping.date}) עד השעה ${nextShipping.hour}.`;
                    finalMessage = `הזמנות ליישובך יסופקו ביום ${nextShipping.dayName} (${nextShipping.date}) עד השעה 21:30.`;
                } else {
                    finalMessage = `אין ימי משלוח זמינים עבור ${cityNameHe}.`;
                }
            }
        }
    } else {
        // היום לא במשלוח - מוצאים את הבא
        const nextShipping = getNextShippingDate(systemDay, currentHour, shippingDays);
        if (nextShipping.dayName) {
            finalMessage = `המשלוח הקרוב ל${cityNameHe} יהיה ביום ${nextShipping.dayName} (${nextShipping.date}) עד השעה ${nextShipping.hour}.`;
        } else {
            finalMessage = `אין ימי משלוח זמינים עבור ${cityNameHe}.`;
        }
    }

    return finalMessage;
}

const BeforeStartPopup = ({ onClose }) => {
    const { t } = useTranslation();

    // state עבור בחירת עיר
    const [chosenCity, setChosenCity] = useState(null);
    // state עבור הודעת המשלוח
    const [deliveryMessage, setDeliveryMessage] = useState("");
    // מצב שמראה אם אנחנו טוענים את נתוני המשלוח (ימים וכו')
    const [loadingDelivery, setLoadingDelivery] = useState(false);

    // הטקסט של הכפתור בתחתית
    const [buttonText, setButtonText] = useState("אני מזמין/ה באיסוף עצמי");

    // בכל פעם שמשתמש בוחר עיר, נביא משרת ה־delivery את הנתונים ונחשב את ההודעה
    useEffect(() => {
        if (!chosenCity) {
            setDeliveryMessage("");
            setButtonText("אני מזמין/ה באיסוף עצמי");
            return;
        }

        // אם נבחרה עיר, נביא את הימים והמחיר
        const fetchDelivery = async () => {
            try {
                setLoadingDelivery(true);
                const res = await DeliveryServices.getByCityName(chosenCity.city_name_he);
                // console.log("res", res);
                const days = res?.days?.map((day) => day?.value) || [];
                const msg = getNextDeliveryMessage(chosenCity.city_name_he, days);
                setDeliveryMessage(msg);
                setButtonText("אישור");
            } catch (err) {
                console.error("Error fetching delivery data:", err);
                setDeliveryMessage(`מצטערים, אין עדיין משלוחים ל${chosenCity.city_name_he?.trim()}.`);
            } finally {
                setLoadingDelivery(false);
            }
        };

        fetchDelivery();
    }, [chosenCity]);

    // בלחיצה על הכפתור התחתון: נסגור את הפופאפ בכל מקרה
    const handleButtonClick = () => {
        onClose();
    };

    return (
        <div className="px-3 sm:px-11 py-8 max-w-md">
            {/* כותרת (SVG) */}
            <div className="text-center mb-2">
                <img
                    src={beforeStartTitle.src}
                    alt="before start title"
                    className="h-24 mx-auto -mt-4 -mb-6"
                />
            </div>

            {/* טקסט הסבר */}
            <p className="text-center text-lg font-semibold mb-6">
                כדי שנוכל להגיד לך מתי המשלוח הקרוב לביתך,<br />
                איפה את/ה גר/ה?
            </p>

            {/* קומפוננטת העיר */}
            <div className="mb-6">
                <City setValue={setChosenCity} placeholder={null} />
            </div>

            {/* הצגת הודעת המשלוח (או מצב טוען) */}
            {loadingDelivery ? (
                <p className="text-center text-sm text-gray-500 mb-6">
                    טוען פרטי משלוח...
                </p>
            ) : (
                deliveryMessage && (
                    <p className="text-center text-base font-medium mb-6">
                        {deliveryMessage}
                    </p>
                )
            )}

            {/* הכפתור התחתון – סוגר את הפופאפ תמיד */}
            <MainBT onClick={handleButtonClick}>
                {buttonText}
            </MainBT>
        </div>
    );
};

export default BeforeStartPopup;