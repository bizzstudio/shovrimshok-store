// avrahami-store/src/pages/user/dashboard.jsx
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { IoLockOpenOutline } from "react-icons/io5";
import {
  FiCheck,
  FiFileText,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiSettings,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { PiCoins } from "react-icons/pi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Internal import
import Layout from "@layout/Layout";
import Card from "@component/order-card/Card";
import { UserContext } from "@context/UserContext";
import OrderServices from "@services/OrderServices";
import RecentOrder from "@pages/user/recent-order";
import { SidebarContext } from "@context/SidebarContext";
import Loading from "@component/preloader/Loading";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import MyOrders from "./my-orders";
import UserDetailsCard from "@component/user/UserDetailsCard";
import useCart from "@hooks/useCart";
import { OrderContext } from "@context/OrderContext";

const Dashboard = ({ title, description, children }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    dispatch,
    state: { userInfo },
  } = useContext(UserContext);

  if (process.env.NEXT_PUBLIC_ENV === "dev") {
    console.log('Dashboard user :>> ', userInfo);
  }

  const { isLoading, setIsLoading, currentPage } = useContext(SidebarContext);
  const { orderData, loading, error } = useContext(OrderContext);

  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  // console.log('orderData :>> ', orderData);

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("couponInfo");
    router.push("/");
  };

  useEffect(() => {
    setIsLoading(false);
    if (!userInfo) {
      router.push("/");
    }
  }, [userInfo]);

  const userSidebar = [
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.dashboard_title
      ),
      href: "/user/dashboard",
      icon: FiGrid,
    },
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.my_order
      ),
      href: "/user/my-orders",
      icon: FiList,
    },
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.update_profile
      ),
      href: "/user/update-profile",
      icon: FiSettings,
    },
    {
      title: showingTranslateValue(
        storeCustomizationSetting?.dashboard?.change_password
      ),
      href: "/user/change-password",
      icon: FiFileText,
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout
          title={title ? title : "אזור אישי"}
          description={description ? description : "עמוד אזור אישי - האחים שפירא י.ת.ר"}
        >
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
            <div className="py-10 lg:py-12 flex flex-col lg:flex-row w-full">
              <div className="flex-shrink-0 w-full lg:w-80 ml-7 lg:ml-10  xl:ml-10 ">
                <div className="bg-white p-4 sm:p-5 lg:p-8 rounded-md sticky top-32">
                  {userSidebar?.map((item) => (
                    <Link
                      href={item.href}
                      key={item?.title}
                      className="p-2 my-2 flex gap-1 font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customRed-dark"
                    >
                      <item.icon
                        className="flex-shrink-0 h-4 w-4"
                        aria-hidden="true"
                      />
                      <span
                        className="inline-flex items-center justify-between text-sm font-medium w-full hover:text-customRed-dark"
                      >
                        {item.ItemName ? item.ItemName : item.title}
                      </span>
                    </Link>
                  ))}
                  <span className="p-2 flex gap-1 font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customRed-dark">
                    <span>
                      <IoLockOpenOutline />
                    </span>{" "}
                    <button
                      onClick={handleLogOut}
                      className="inline-flex items-center justify-between text-sm font-medium w-full hover:text-customRed-dark"
                    >
                      {showingTranslateValue(
                        storeCustomizationSetting?.navbar?.logout
                      )}
                    </button>
                  </span>
                </div>
              </div>
              <div className="w-full bg-white mt-4 lg:mt-0 p-4 sm:p-5 lg:p-8 rounded-md overflow-hidden">
                {!children && (
                  <div className="overflow-hidden">
                    <h2 className="text-xl font-serif font-semibold mb-5">
                      {showingTranslateValue(
                        storeCustomizationSetting?.dashboard?.dashboard_title
                      )}
                    </h2>
                    <div className="grid gap-4 mb-8 grid-cols-1 lg:grid-cols-4">
                      <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.total_order
                        )}
                        Icon={FiShoppingCart}
                        quantity={
                          loading ? <Skeleton width={60} height={20} /> : orderData?.totalDoc
                        }
                        className="text-customRed-dark bg-red-100"
                      />
                      {/* <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.pending_order
                        )}
                        Icon={FiRefreshCw}
                        quantity={data?.pending}
                        className="text-orange-600 bg-orange-200"
                      /> */}
                      <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.processing_order
                        )}
                        Icon={FiTruck}
                        quantity={
                          loading ? <Skeleton width={60} height={20} /> : orderData?.processing
                        }
                        className="text-amber-600 bg-amber-100"
                      />
                      <Card
                        title={showingTranslateValue(
                          storeCustomizationSetting?.dashboard?.complete_order
                        )}
                        Icon={FiCheck}
                        quantity={
                          loading ? <Skeleton width={60} height={20} /> : orderData?.delivered
                        }
                        className="text-green-600 bg-green-100"
                      />
                      <Card
                        title={t("common:balance")}
                        Icon={PiCoins}
                        quantity={
                          loading ? <Skeleton width={60} height={20} /> : (orderData?.balance ?? 0)
                        }
                        className="text-blue-600 bg-blue-100"
                        quantityColor={orderData?.balance > 0 ? "text-red-500" : orderData?.balance < 0 ? "text-green-500" : ""}
                      />
                    </div>
                    {/* <RecentOrder data={data} loading={loading} error={error} /> */}
                    {/* פרטי הלקוח */}
                    <UserDetailsCard />
                  </div>
                )}
                {children}
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
