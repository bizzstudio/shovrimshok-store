// shapira-store/src/pages/_app.js
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
import Hotjar from '@hotjar/browser';
import Script from "next/script";

//internal import
import store from "@redux/store";
import getStripe from "@utils/stripe";
import useAsync from "@hooks/useAsync";
import { UserProvider } from "@context/UserContext";
import DefaultSeo from "@component/common/DefaultSeo";
import { SidebarProvider } from "@context/SidebarContext";
import SettingServices from "@services/SettingServices";
import { handlePageView } from "@utils/analytics";
// import { Assistant } from 'next/font/google';

// const assistant = Assistant({
//   weight: ['200', '400', '800'],
//   display: 'swap',
//   subsets: ['latin', 'hebrew'],
// });

let persistor = persistStore(store);

const siteId = 5076708;
const hotjarVersion = 6;

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
        handlePageView(url, "אחים שפירא");

        // Google Analytics
        // עדכון Google Tag עם הנתיב החדש
        window.gtag('config', 'G-R5FJVK2CGS', {
          page_path: url,
        });
      };

      // Set up event listeners
      router.events.on("routeChangeComplete", handleRouteChange);

      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, [storeSetting, loading, error, router.events]);

  // Redirects
  useEffect(() => {
    if (router.pathname === "/product-category/מבצעים") {
      router.push("/offers");
    }
  }, [router.pathname]);

  // Hotjar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Hotjar.init(siteId, hotjarVersion);
    }
  }, []);

  return (
    <div
    // className={assistant.className}
    >
      {/* טעינת הסקריפט של Google Tag */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-R5FJVK2CGS"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-R5FJVK2CGS');
        `}
      </Script>

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
    </div>
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
