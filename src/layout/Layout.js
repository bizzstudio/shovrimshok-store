import Head from "next/head";
import { ToastContainer } from "react-toastify";

//internal import
import Navbar from "@layout/navbar/Navbar";
import Footer from "@layout/footer/Footer";
import NavBarTop from "./navbar/NavBarTop";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
import FeatureCard from "@component/feature-card/FeatureCard";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import MainModal from "@component/modal/MainModal";
import UserAddressInitialize from "@component/userAddressInitialize/UserAddressInitialize";
import RegisterSuccess from "@component/login/RegisterSuccess";
import { useRouter } from "next/router";
import PopupServices from "@services/PopupServices";
import useAsync from "@hooks/useAsync";
import DynamicPopup from "@component/modal/DynamicPopup";

const Layout = ({ title, description, children }) => {

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
      setCurrentPopup(matchedPopup || null);
    }
  }, [pathname, popupData]);

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

    // בדיקה ראשונית
    handleStorageChange();

    // הוספת מאזין לאירוע מותאם אישית
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
      {!loading && !error && currentPopup && (
        <MainModal modalOpen={true} setModalOpen={() => setCurrentPopup(null)}>
          <div className="px-3 sm:px-11 py-7 max-w-md">
            <DynamicPopup popup={currentPopup} />
          </div>
        </MainModal>
      )}

      <div className="font-sans">
        <Head>
          <title>
            {title
              ? `משק קירשנר | ${title}`
              : "משק קירשנר"}
          </title>
          {description && <meta name="description" content={description} />}
          <link ref="icon" href="/favicon.png" />
        </Head>
        {/* <NavBarTop /> */}
        <Navbar />
        <div className="bg-gray-50">{children}</div>
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
