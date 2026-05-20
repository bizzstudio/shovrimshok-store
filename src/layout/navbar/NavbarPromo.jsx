// shapira-store/src/layout/navbar/NavbarPromo.jsx
import { Fragment, useState, useEffect, useContext, useTransition } from "react";
import Link from "next/link";
import { Transition, Popover } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import SettingServices from "@services/SettingServices";
import Cookies from "js-cookie";

// Internal import
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useAsync from "@hooks/useAsync";
import CategoryServices from "@services/CategoryServices";
import Loading from "@component/preloader/Loading";
import CategoryCard from "@component/category/CategoryCard";
import Image from "next/image";
import { useRouter } from "next/router";
import DeliveriesPopup from "@component/deliveriesPopup/DeliveriesPopup";
import MainModal from "@component/modal/MainModal";
import deliveryIcon from 'public/shipped.svg'
import whatsapp from 'public/22.svg'

import { UserContext } from "@context/UserContext";
import LoginModal from "@component/modal/LoginModal";
import { BsWhatsapp } from "react-icons/bs";
import { FaWheelchair } from "react-icons/fa";
import notifyApiResponse from "@utils/notifyApiResponse";

const NavbarPromo = () => {
  const [languages, setLanguages] = useState([]);
  const [currentLang, setCurrentLang] = useState({});
  const [deliveriesPopup, setDeliveriesPopup] = useState(false);
  const [LoginModalOpen, setLoginModalOpen] = useState(false);
  const { isLoading, setIsLoading } = useContext(SidebarContext);

  const { showingTranslateValue } = useUtilsFunction();

  const { data, loading, error } = useAsync(() => CategoryServices.getShowingCategory());
  const { state: { userInfo } } = useContext(UserContext);

  const router = useRouter();

  const handleOpenLogin = () => {
    if (router.push("/?redirect=/user/my-orders")) {
      setLoginModalOpen(!LoginModalOpen);
    }
  };

  // כפתור שחזור הזמנה
  const handleDeliveryRecover = () => {
    if (!userInfo) {
      handleOpenLogin(); // Handle login if user is not logged in
    } else {
      router.push("/user/my-orders"); // Redirect to checkout page
    }
  }

  const handleLanguage = (lang) => {
    setCurrentLang(lang);
    Cookies.set("_lang", lang?.iso_code, {
      sameSite: "None",
      secure: true,
    });
  };

  useEffect(() => {
    (async () => {
      {
        try {
          const res = await SettingServices.getShowingLanguage();
          setLanguages(res);
          // console.log("res", res);

          // const result = res?.find((language) => language?.iso_code === lang);
          const result = res?.find((language) => language?.iso_code === "he");
          setCurrentLang(result);
          handleLanguage(result);
        } catch (err) {
          notifyApiResponse(err, false);
          console.log("error on getting lang", err);
        }
      }
    })();
  }, []);

  // handle show category
  const showCategory = (id, categoryName) => {
    const name = categoryName.toLowerCase()
    // .replace(/[^A-Z0-9]+/gi, "-");
    router.push(`/search?category=${name}&_id=${id}`);
  };

  const [isHover, setIsHover] = useState(null);
  const categoriesLength = data[0]?.children?.length;
  useEffect(() => {
    setIsHover(categoriesLength + 1)
  }, [data])

  const [selectedCategory, setSelectedCategory] = useState(null);
  const { asPath } = router; // כאן נשתמש ב-asPath כדי לגשת לנתיב המלא

  useEffect(() => {
    if (asPath.startsWith("/category/")) {
      const categoryName = decodeURIComponent(asPath.split("/category/")[1]);

      // חיפוש הקטגוריה לפי שם בעברית או באנגלית
      const foundCategory = data[0]?.children?.find(
        (category) =>
          category.name.he === categoryName || category.name.en === categoryName
      );

      if (foundCategory) {
        const index = data[0]?.children?.indexOf(foundCategory);
        setSelectedCategory(index !== -1 ? index : null);
      }
    } else if (asPath === "/offers") {
      setSelectedCategory(categoriesLength);
    } else {
      setSelectedCategory(null);
    }
  }, [asPath, data]);

  return (
    <>
      {deliveriesPopup && (
        <MainModal modalOpen={deliveriesPopup} setModalOpen={setDeliveriesPopup}>
          <DeliveriesPopup />
        </MainModal>
      )}
      {LoginModalOpen && (
        <LoginModal modalOpen={LoginModalOpen} setModalOpen={setLoginModalOpen} />
      )}
      <div className="hidden lg:block xl:block border-b border-gray-200">
        <div className="h-[70px]">
          <Popover className="relative w-full h-full">
            <Popover.Group
              as="nav"
              className="flex items-center w-full h-full bg-gray-100"
            >
              {/* categories list */}
              <div className="flex-1 flex items-center flex-wrap gap-1 px-4 h-full">
                {!loading && !error && data[0]?.children?.map((category, index) => {
                  const categoryId = category.slug || category._id;
                  const title = showingTranslateValue(category?.name);
                  const hasChildren = category.children?.length > 0;
                  const isActive = selectedCategory === index;

                  if (!hasChildren) {
                    return (
                      <Link
                        key={category._id}
                        href={`/category/${categoryId}`}
                        className={`flex-shrink-0 font-serif px-3 py-3 text-lg font-medium whitespace-nowrap hover:text-customRed ${isActive ? "text-customRed" : "text-customBlue"}`}
                      >
                        {title}
                      </Link>
                    );
                  }

                  return (
                    <div key={category._id} className="group relative flex-shrink-0 h-full flex items-center">
                      <Link
                        href={`/category/${categoryId}`}
                        className={`font-serif inline-flex items-center gap-1 px-3 py-3 text-lg font-medium whitespace-nowrap hover:text-customRed ${isActive ? "text-customRed" : "text-customBlue"}`}
                      >
                        {title}
                        <ChevronDownIcon className="h-3 w-3" aria-hidden="true" />
                      </Link>

                      {/* hover dropdown */}
                      <div className="absolute top-full right-0 z-20 hidden group-hover:block min-w-[220px] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <ul className="py-2">
                          {category.children.map((child) => (
                            <li key={child._id}>
                              <Link
                                href={`/category/${categoryId}?sub=${child.slug || child._id}`}
                                className="block px-4 py-2 text-sm font-medium text-customBlue hover:text-customRed hover:bg-gray-50 whitespace-nowrap"
                              >
                                {showingTranslateValue(child?.name)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* pages */}
              {/* <Popover className="relative font-serif">
                      <Popover.Button className="group inline-flex items-center py-2 text-lg font-medium text-customBlue hover:text-customRed focus:outline-none">
                        <span>
                          {showingTranslateValue(
                            storeCustomizationSetting?.navbar?.pages
                          )}
                        </span>
                        <ChevronDownIcon
                          className="ml-1 h-3 w-3 group-text-customBlue hover:text-customRed"
                          aria-hidden="true"
                        />
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute z-10 -ml-1 mt-1 transform w-screen max-w-xs bg-white">
                          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-y-scroll flex-grow scrollbar-hide w-full h-full">
                            <div className="relative grid gap-2 px-6 py-6">
                              {storeCustomizationSetting?.navbar
                                ?.offers_menu_status && (
                                  <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full text-customBlue hover:text-customRed">
                                    <div className="w-full flex">
                                      <FiGift className="my-auto" />
                                      <Link
                                        href="/offer"
                                        onClick={() => setIsLoading(true)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-lg font-medium  text-customBlue hover:text-customRed"
                                      >
                                        {showingTranslateValue(
                                          storeCustomizationSetting?.navbar
                                            ?.offers
                                        )}
                                      </Link>
                                    </div>
                                  </span>
                                )}
                              <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full text-customBlue hover:text-customRed">
                                <div className="w-full flex">
                                  <FiShoppingBag className="my-auto" />
                                  <Link
                                    href="/checkout"
                                    onClick={() => setIsLoading(true)}
                                    className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-lg font-medium  text-customBlue hover:text-customRed"
                                  >
                                    {showingTranslateValue(
                                      storeCustomizationSetting?.navbar
                                        ?.checkout
                                    )}
                                  </Link>
                                </div>
                              </span>

                              {storeCustomizationSetting?.navbar
                                ?.faq_status && (
                                  <span className="p-2 font-serif items-center rounded-md hover:bg-gray-50 w-full text-customBlue hover:text-customRed">
                                    <div className="w-full flex">
                                      <FiHelpCircle className="my-auto" />
                                      <Link
                                        href="/faq"
                                        onClick={() => setIsLoading(true)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-lg font-medium  text-customBlue hover:text-customRed"
                                      >
                                        {showingTranslateValue(
                                          storeCustomizationSetting?.navbar?.faq
                                        )}
                                      </Link>
                                    </div>
                                  </span>
                                )}

                              {storeCustomizationSetting?.navbar
                                ?.about_menu_status && (
                                  <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full text-customBlue hover:text-customRed">
                                    <div className="w-full flex">
                                      <FiUsers className="my-auto" />
                                      <Link
                                        href="/about-us"
                                        onClick={() => setIsLoading(true)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-lg font-medium  text-customBlue hover:text-customRed"
                                      >
                                        {showingTranslateValue(
                                          storeCustomizationSetting?.navbar
                                            ?.about_us
                                        )}
                                      </Link>
                                    </div>
                                  </span>
                                )}

                              {storeCustomizationSetting?.navbar
                                ?.contact_menu_status && (
                                  <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full text-customBlue hover:text-customRed">
                                    <div className="w-full flex">
                                      <FiPhoneIncoming className="my-auto" />
                                      <Link
                                        href="/contact-us"
                                        onClick={() => setIsLoading(true)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-lg font-medium  text-customBlue hover:text-customRed"
                                      >
                                        {showingTranslateValue(
                                          storeCustomizationSetting?.navbar
                                            ?.contact_us
                                        )}
                                      </Link>
                                    </div>
                                  </span>
                                )}

                              {storeCustomizationSetting?.navbar
                                ?.privacy_policy_status && (
                                  <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full text-customBlue hover:text-customRed">
                                    <div className="w-full flex">
                                      <FiPocket className="my-auto" />
                                      <Link
                                        href="/privacy-policy"
                                        onClick={() => setIsLoading(true)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-lg font-medium  text-customBlue hover:text-customRed"
                                      >
                                        {showingTranslateValue(
                                          storeCustomizationSetting?.navbar
                                            ?.privacy_policy
                                        )}
                                      </Link>
                                    </div>
                                  </span>
                                )}

                              {storeCustomizationSetting?.navbar
                                ?.term_and_condition_status && (
                                  <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full text-customBlue hover:text-customRed">
                                    <div className="w-full flex">
                                      <FiFileText className="my-auto" />
                                      <Link
                                        href="/terms-and-conditions"
                                        onClick={() => setIsLoading(true)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-lg font-medium  text-customBlue hover:text-customRed"
                                      >
                                        {showingTranslateValue(
                                          storeCustomizationSetting?.navbar
                                            ?.term_and_condition
                                        )}
                                      </Link>
                                    </div>
                                  </span>
                                )}

                              <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full text-customBlue hover:text-customRed">
                                <div className="w-full flex">
                                  <FiAlertCircle className="my-auto" />
                                  <Link
                                    href="/404"
                                    onClick={() => setIsLoading(true)}
                                    className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-lg font-medium  text-customBlue hover:text-customRed"
                                  >
                                    404
                                  </Link>
                                </div>
                              </span>
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </Popover> */}

              {/* {storeCustomizationSetting?.navbar?.offers_menu_status && (
                      <Link
                        href="/offer"
                        onClick={() => setIsLoading(true)}
                        className="relative inline-flex items-center bg-red-100 font-serif py-0 px-2 m-2 rounded text-lg font-medium text-red-500 hover:text-red-800"
                      >
                        {showingTranslateValue(
                          storeCustomizationSetting?.navbar?.offers
                        )}
                        <div className="absolute flex w-2 h-2 left-auto -right-1 -top-1">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </div>
                      </Link>
                    )} */}
            </Popover.Group>
          </Popover>
          <div className="xl:flex gap-3 hidden">
            {/* <button className="hidden sm:inline-block lg:inline-block text-lg leading-6 font-serif font-medium px-6 py-2 bg-customRed text-center rounded-md text-white hover:bg-customRed-dark">
              משלוחים ואיזורי חלוקה
            </button> */}
            {/* <a href="https://api.whatsapp.com/send/?phone=972525123003" target="_blank">
              <button className="flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
              >
                <BsWhatsapp className="w-6 h-6 drop-shadow-xl" />
                <span>שירות לקוחות</span>
              </button>
            </a>
            <button className="flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
              onClick={() => setDeliveriesPopup(true)}>
              <img src={deliveryIcon.src} className="h-full mt-1 " />
              <span>משלוחים ואיזורי חלוקה</span>
            </button> */}
            {/* <div className="dropdown">
              <div
                className={`flot-l flag ${currentLang?.flag?.toLowerCase()}`}
              ></div>
              <button className="dropbtn">
                {currentLang?.name}
                &nbsp;<i className="fas fa-angle-down"></i>
              </button>
              <div className="dropdown-content">
                {languages?.map((language, i) => {
                  return (
                    <Link
                      onClick={() => {
                        handleLanguage(language);
                      }}
                      key={i + 1}
                      href="/"
                      locale={`${language.iso_code}`}
                    >
                      <div
                        className={`flot-l flag ${language?.flag?.toLowerCase()}`}
                      ></div>
                      {language?.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {storeCustomizationSetting?.navbar?.privacy_policy_status && (
              <Link
                onClick={() => setIsLoading(true)}
                href="/privacy-policy"
                className="font-serif mx-4 py-2 text-lg font-medium text-customBlue hover:text-customRed"
              >
                {showingTranslateValue(
                  storeCustomizationSetting?.navbar?.privacy_policy
                )}
              </Link>
            )}
            {storeCustomizationSetting?.navbar?.term_and_condition_status && (
              <Link
                onClick={() => setIsLoading(true)}
                href="/terms-and-conditions"
                className="font-serif mx-4 py-2 text-lg font-medium text-customBlue hover:text-customRed"
              >
                {showingTranslateValue(
                  storeCustomizationSetting?.navbar?.term_and_condition
                )}
              </Link>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPromo;