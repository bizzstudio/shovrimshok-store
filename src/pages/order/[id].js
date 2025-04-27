// shapira-store/src/pages/order/[id].js
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { IoPrintOutline } from "react-icons/io5";
import useTranslation from "next-translate/useTranslation";
import ReactToPrint from "react-to-print";
import Cookies from "js-cookie";

// Internal import
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import Invoice from "@component/invoice/Invoice";
import Loading from "@component/preloader/Loading";
import { UserContext } from "@context/UserContext";
import OrderServices from "@services/OrderServices";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Order = ({ params }) => {
  const printRef = useRef();
  const orderId = params.id;
  const router = useRouter();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const {
    state: { userInfo },
  } = useContext(UserContext);
  const { showingTranslateValue, getNumberTwo, currency } = useUtilsFunction();
  const { storeCustomizationSetting, globalSetting } = useGetSetting();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const res = await OrderServices.getOrderById(orderId);
        setData(res);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log("err", err.message);
      }
    })();

    if (!userInfo) {
      router.push("/");
    }
  }, []);

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
  };

  // console.log('data', data)

  return (
    <Layout title={t("common:order") + " " + data?.DocNum} description="order confirmation page">
      {loading && !data ? (
        <Loading loading={loading} />
      ) : (
        <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
          {/* <div className="bg-customBrown-light rounded-md mb-5 px-4 py-3">
            <label>
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.invoice_message_first
              )}{" "}
              <span className="font-bold text-customRed-dark">
                {data?.user_info?.name},
              </span>{" "}
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.invoice_message_last
              )}
            </label>
          </div> */}
          <div className="bg-white rounded-md shadow-sm">
            <Invoice
              data={data}
              printRef={printRef}
              currency={currency}
              globalSetting={globalSetting}
            />
            <div className="bg-white p-8 rounded-b-xl">
              <div className="flex lg:flex-row-reverse md:flex-row-reverse sm:flex-row-reverse flex-col justify-between invoice-btn">
                <ReactToPrint
                  trigger={() => (
                    <button className={`${currentLang ? "flex-row-reverse" : ""} mb-3 sm:mb-0 md:mb-0 lg:mb-0 flex items-center justify-center gap-2 bg-customBlue hover:bg-customRed text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-md`}>
                      {showingTranslateValue(
                        storeCustomizationSetting?.dashboard?.print_button
                      )}{" "}
                      <span>
                        <IoPrintOutline />
                      </span>
                    </button>
                  )}
                  content={() => printRef.current}
                  documentTitle="Order"
                  pageStyle="@media print { body { direction: rtl; } }"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps = ({ params }) => {
  return {
    props: { params },
  };
};

export default dynamic(() => Promise.resolve(Order), { ssr: false });
