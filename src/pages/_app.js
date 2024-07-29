import "@styles/custom.css";
import { CartProvider } from "react-use-cart";
import { Elements } from "@stripe/react-stripe-js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useRouter } from "next/router";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//internal import
import store from "@redux/store";
import getStripe from "@utils/stripe";
import useAsync from "@hooks/useAsync";
import { UserProvider } from "@context/UserContext";
import DefaultSeo from "@component/common/DefaultSeo";
import { SidebarProvider } from "@context/SidebarContext";
import SettingServices from "@services/SettingServices";
import { handlePageView } from "@utils/analytics";

let persistor = persistStore(store);

// let stripePromise = getStripe();

function RedirectPage() {
  const navigate = useNavigate(); // React Router v6

  useEffect(() => {
    // בוצע הפניה לכתובת החדשה
    navigate('/new-page', { replace: true });
  }, [navigate]);

  return null; // רכיב זה לא מציג שום דבר
}


function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const {
    data: storeSetting,
    loading,
    error,
  } = useAsync(SettingServices.getStoreSetting);

  useEffect(() => {
    // Initialize Google Analytics
    if (!loading && !error && storeSetting?.google_analytic_status) {
      ReactGA.initialize(storeSetting?.google_analytic_key || "");

      // Initial page load
      handlePageView();

      // Track page view on route change
      const handleRouteChange = (url) => {
        handlePageView(`/${router.pathname}`, "משק קירשנר");
      };

      // Set up event listeners
      router.events.on("routeChangeComplete", handleRouteChange);

      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, [storeSetting]);

  // console.log("storeSetting", storeSetting, "stripePromise", stripePromise);

  return (
    <>

    <Router>
      <Routes>
        <Route path="/product-category/מבצעים" element={<Navigate to="/offers" replace />} />
      </Routes>
    </Router>


      {!loading && !error && storeSetting?.tawk_chat_status && (
        <TawkMessengerReact
          propertyId={storeSetting?.tawk_chat_property_id || ""}
          widgetId={storeSetting?.tawk_chat_widget_id || ""}
        />
      )}
        
      <GoogleOAuthProvider clientId={storeSetting?.google_client_id || ""}>
        <UserProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SidebarProvider>
                {/* <Elements stripe={stripePromise}> */}
                  <CartProvider>
                    <DefaultSeo />
                    <Component {...pageProps} />
                  </CartProvider>
                {/* </Elements> */}
              </SidebarProvider>
            </PersistGate>
          </Provider>
        </UserProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export const getServerSideProps = async () => {
  const storeSetting = await SettingServices.getStoreSeoSetting();

  return {
    props: {
      storeSetting,
    },
  };
};

export default MyApp;
