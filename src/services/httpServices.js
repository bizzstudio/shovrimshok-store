import axios from 'axios';
import Cookies from 'js-cookie';

// בצד-שרת (SSR בתוך קונטיינר) "localhost" מצביע על הקונטיינר עצמו ולא על ה-backend,
// לכן משתמשים בכתובת הפנימית של רשת דוקר (INTERNAL_API_BASE_URL, למשל http://backend:3019/api).
// בצד-לקוח (דפדפן) משתמשים בכתובת הציבורית NEXT_PUBLIC_API_BASE_URL.
const baseURL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const instance = axios.create({
  baseURL,
  timeout: 500000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  let userInfo;
  if (Cookies.get('userInfo')) {
    userInfo = JSON.parse(Cookies.get('userInfo'));
  }

  return {
    ...config,
    headers: {
      authorization: userInfo ? `Bearer ${userInfo.token}` : null,
    },
  };
});

// Auto-logout רק כשה-401 מגיע מאימות הטוקן עצמו (token פג/לא תקין),
// ולא כאשר השרת מחזיר 401 על endpoint אחר (כמו route שדורש isAdmin)
// כדי שמשתמש רגיל לא יוצא בטעות.
const AUTH_FAILED_MESSAGES = [
  "ההזדהות נכשלה, יש להתנתק ולהתחבר לחשבונך מחדש.",
  "ההזדהות נכשלה, יש לצאת ולהכנס לחשבונך מחדש.",
];

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    const isTokenAuthFailure =
      status === 401 &&
      typeof serverMessage === "string" &&
      AUTH_FAILED_MESSAGES.includes(serverMessage);

    if (isTokenAuthFailure && Cookies.get('userInfo')) {
      Cookies.remove('userInfo');
      Cookies.remove('couponInfo');
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, body) => instance.get(url, body).then(responseBody),

  post: (url, body, headers) =>
    instance.post(url, body, headers).then(responseBody),

  put: (url, body) => instance.put(url, body).then(responseBody),
};

export default requests;
