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

  const [addressPopup, setAddressPopup] = useState(false);
  useEffect(() => {
    if (localStorage.firstTime && JSON.parse(localStorage.firstTime)) {
      setAddressPopup(true);
    }
  }, [localStorage.firstTime]);

  const [showRegisterSuccess, setShowRegisterSuccess] = useState(true);
  useEffect(() => {
    if (localStorage.showRegisterSuccess && JSON.parse(localStorage.showRegisterSuccess)) {
      setShowRegisterSuccess(true);
    }
  }, [localStorage.showRegisterSuccess]);

  return (
    <>
      <ToastContainer rtl={currentLang} />

      {addressPopup && (
        <MainModal modalOpen={addressPopup} setModalOpen={setAddressPopup}>
          <div className="px-3 sm:px-11 py-8 max-w-md">
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
