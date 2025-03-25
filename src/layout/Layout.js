// shapira-store/src/layout/Layout.js
import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

//internal import
import Navbar from "@layout/navbar/Navbar";
import Footer from "@layout/footer/Footer";
import NavBarTop from "./navbar/NavBarTop";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
import FeatureCard from "@component/feature-card/FeatureCard";
import MainModal from "@component/modal/MainModal";
import UserAddressInitialize from "@component/userAddressInitialize/UserAddressInitialize";
import RegisterSuccess from "@component/login/RegisterSuccess";
import PopupServices from "@services/PopupServices";
import useAsync from "@hooks/useAsync";
import DynamicPopup from "@component/modal/DynamicPopup";
import StickyCart from "@component/cart/StickyCart";
import { UserContext } from "@context/UserContext";
import BeforeStartPopup from "@component/modal/BeforeStartPopup";

const Layout = ({ title, description, children }) => {

  const {
    state: { userInfo },
  } = useContext(UserContext);

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

  const router = useRouter();
  const { pathname } = router;

  // משיכת פופאפים דינאמיים
  const [currentPopup, setCurrentPopup] = useState(null);
  const { data: popupData, loading, error } = useAsync(() => PopupServices.getAllPopups());

  // בדיקה האם להציג פופאפ בעמוד הנוכחי
  useEffect(() => {
    if (popupData && popupData.length > 0) {
      const matchedPopup = popupData.find(
        (popup) => popup.pageToShow === pathname && popup.isActive
      );

      // בדיקה אם הפופאפ כבר הוצג
      if (matchedPopup && !sessionStorage.getItem(`popupShown_${matchedPopup._id}`)) {
        setCurrentPopup(matchedPopup || null);
      }
    }
  }, [pathname, popupData]);

  // הצגת הפופאפ ושמירת המידע ב-sessionStorage
  useEffect(() => {
    if (currentPopup) {
      sessionStorage.setItem(`popupShown_${currentPopup._id}`, 'true');
    }
  }, [currentPopup]);

  const [addressPopup, setAddressPopup] = useState(false);
  useEffect(() => {
    if (localStorage.firstTime && JSON.parse(localStorage.firstTime)) {
      localStorage.removeItem("plsRegisterAgain");
      localStorage.removeItem("waitingForVerification");
      setAddressPopup(true);
    }
  }, [localStorage.firstTime]);

  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  useEffect(() => {
    const handleStorageChange = () => {
      if (localStorage.showRegisterSuccess && JSON.parse(localStorage.showRegisterSuccess)) {
        setShowRegisterSuccess(true);
        localStorage.removeItem('showRegisterSuccess');
      }
    };

    handleStorageChange();
    window.addEventListener("customLocalStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("customLocalStorageChange", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      const event = new Event('customLocalStorageChange');
      originalSetItem.apply(this, arguments);
      window.dispatchEvent(event);
    };
  }, []);


  // פופאפ לפני שמתחילים בחירת עיר
  const [showBeforeStartPopup, setShowBeforeStartPopup] = useState(false);
  // נבדוק בתנאי שהמשתמש אינו מחובר וכו'
  useEffect(() => {
    // אם יש יוזר -> לא מציגים את הפופאפ
    if (userInfo) return;

    // אם כבר יש פופאפ דינאמי או addressPopup וכו' -> חכה עם זה
    if (currentPopup || addressPopup || showRegisterSuccess) return;

    // אם כבר ראינו את הפופאפ
    if (sessionStorage.getItem("beforeStartPopupShown")) return;

    // במידה והגענו לכאן, נפתח את הפופאפ
    setShowBeforeStartPopup(true);
    sessionStorage.setItem("beforeStartPopupShown", "true");
  }, [
    userInfo,
    currentPopup,
    addressPopup,
    showRegisterSuccess,
    // וכל State אחר שמבטיח שלא תקפוץ כפילות
  ]);

  return (
    <>
      <ToastContainer rtl={currentLang} />

      {addressPopup && (
        <MainModal modalOpen={addressPopup} setModalOpen={setAddressPopup}>
          <div className="px-3 sm:px-11 py-8 max-w-xl">
            <UserAddressInitialize />
          </div>
        </MainModal>
      )}

      {showRegisterSuccess && (
        <MainModal modalOpen={showRegisterSuccess} setModalOpen={setShowRegisterSuccess}>
          <div className="px-3 sm:px-11 py-8 max-w-md">
            <RegisterSuccess />
          </div>
        </MainModal>
      )}

      {/* פופאפ דינאמי */}
      {!loading && !error && currentPopup && !addressPopup && !showRegisterSuccess && !showBeforeStartPopup && (
        <MainModal modalOpen={true} setModalOpen={() => setCurrentPopup(null)}>
          <div className="px-3 sm:px-11 py-7 max-w-md">
            <DynamicPopup popup={currentPopup} />
          </div>
        </MainModal>
      )}

      {/* פופאפ "לפני שמתחילים" */}
      {showBeforeStartPopup && (
        <MainModal
          modalOpen={showBeforeStartPopup}
          setModalOpen={setShowBeforeStartPopup}
        >
          <BeforeStartPopup onClose={() => setShowBeforeStartPopup(false)} />
        </MainModal>
      )}

      <div className="font-sans">
        <Head>
          <title>
            {title
              ? `אחים שפירא | ${title}`
              : "אחים שפירא"}
          </title>
          {description && <meta name="description" content={description} />}
          <link ref="icon" href="/favicon.png" />
        </Head>
        {/* <NavBarTop /> */}
        <Navbar />
        <div className="bg-gray-50">
          <StickyCart />
          {children}
        </div>
        <MobileFooter />
        <div className="w-full">
          <FooterTop />
          <div className="hidden relative lg:block mx-auto max-w-screen-2xl py-6 px-3 sm:px-10">
            <FeatureCard />
          </div>
          <hr className="hr-line"></hr>
          <div className="border-t border-gray-100 w-full">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
