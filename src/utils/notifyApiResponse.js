// src/utils/notifyApiResponse.js
import Cookies from "js-cookie";
import { notifyError, notifySuccess } from "./toast";

const notifyApiResponse = (response, success = Boolean) => {
    const lang = Cookies.get("_lang");

    const message = response?.data?.message || response?.response?.data?.message || response?.message;

    if (success) {
        // הצלחה
        const successMessage = message?.[lang] || (lang === "he" ? "הפעולה הצליחה!" : "Action succeeded!");
        notifySuccess(successMessage);
    } else {
        // כישלון
        const errorMessage = message?.[lang] || message || (lang === "he" ? "התרחשה שגיאה!" : "An error occurred!");
        notifyError(errorMessage);
    }
};

export default notifyApiResponse;
