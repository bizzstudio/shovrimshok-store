import { Fragment, useState, useEffect, useContext, useTransition } from "react";
import Link from "next/link";
import { Transition, Popover } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import SettingServices from "@services/SettingServices";
import Cookies from "js-cookie";
import useTranslation from "next-translate/useTranslation";

//internal import
import { notifyError } from "@utils/toast";
import useGetSetting from "@hooks/useGetSetting";
import Category from "@component/category/Category";
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
import cycleIcon from 'public/circular-arrows.svg'
import whatsapp from 'public/whatsapp.svg'

// TODO: אמור להגיע מהאדמין
import offerIcon from 'public/categories icons/gift-color.svg'
import offerIconNoColor from 'public/categories icons/gift.svg'
import fruitsIcon from 'public/categories icons/fruits_color.svg'
import legumesIcon from 'public/categories icons/beans_color.svg'
import herbsIcon from 'public/categories icons/mortar_color.svg'
import vegetablesIcon from 'public/categories icons/carrot_color.svg'
import { UserContext } from "@context/UserContext";
import LoginModal from "@component/modal/LoginModal";

const NavbarPromo = () => {
  const [languages, setLanguages] = useState([]);
  const [currentLang, setCurrentLang] = useState({});
  const [deliveriesPopup, setDeliveriesPopup] = useState(false);
  const [LoginModalOpen, setLoginModalOpen] = useState(false);
  const { lang, storeCustomizationSetting } = useGetSetting();
  const { isLoading, setIsLoading } = useContext(SidebarContext);

  const { showingTranslateValue } = useUtilsFunction();

  const { data, loading, error } = useAsync(() => CategoryServices.getShowingCategory());
  const { state: { userInfo } } = useContext(UserContext);

  const router = useRouter();

  const { t } = useTranslation();

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
          notifyError(err);
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
  useEffect(() => {
    setIsHover(data[0]?.children?.length + 1)
  }, [data])

  const getColorIcon = (index, defaultIcon) => {
    switch (index) {
      case 0:
        return fruitsIcon.src ? fruitsIcon.src : defaultIcon;
      case 1:
        return legumesIcon.src ? legumesIcon.src : defaultIcon;
      case 2:
        return herbsIcon.src ? herbsIcon.src : defaultIcon;
      case 3:
        return vegetablesIcon.src ? vegetablesIcon.src : defaultIcon;
      case 4:
        return offerIcon.src ? offerIcon.src : defaultIcon;
      default:
        return defaultIcon;
    }
  }

  const [selectedCategory, setSelectedCategory] = useState(null);
  const { query } = router;

  useEffect(() => {
    if (query?.category) {
      switch (query?.category) {
        case 'פירות':
          setSelectedCategory(0);
          break;
        case 'קטניות':
          setSelectedCategory(1);
          break;
        case 'עלים ועשבי תיבול':
          setSelectedCategory(2);
          break;
        case 'ירקות':
          setSelectedCategory(3);
          break;
        case 'מבצעים':
          setSelectedCategory(4);
          break;
        default:
          setSelectedCategory(null);
          break;
      }
    } else {
      setSelectedCategory(null);
    }
  }, [query]);

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
      <div className="hidden lg:block xl:block bg-white border-b">
        <div className="w-full px-5 pb-3 pt-1.5 sm:px-4 flex justify-between items-center">
          <div className="inline-flex">
            <Popover className="relative">
              <div className="max-w-7xl mx-auto">
                {/* <div className="relative grid gap-2 p-6">
                  {data[0]?.children?.map((category) => (
                    <CategoryCard
                      key={category._id}
                      id={category._id}
                      icon={category.icon}
                      nested={category.children}
                      title={showingTranslateValue(category?.name)}
                    />
                  ))}
                </div> */}
                <div className="flex justify-between items-center md:justify-start md:space-x-10">
                  <Popover.Group
                    as="nav"
                    className="md:flex items-center justify-center gap-4"
                  >
                    {storeCustomizationSetting?.navbar
                      ?.categories_menu_status && (
                        // <Popover className="relative font-serif">
                        //   <Popover.Button className="group inline-flex items-center py-2 hover:text-customGreen-dark focus:outline-none">
                        //     <span className="font-serif text-sm font-medium">
                        //       {showingTranslateValue(
                        //         storeCustomizationSetting?.navbar?.categories
                        //       )}
                        //     </span>

                        //     <ChevronDownIcon
                        //       className="ml-1 h-3 w-3 group-hover:text-customGreen-dark"
                        //       aria-hidden="true"
                        //     />
                        //   </Popover.Button>

                        //   <Transition
                        //     as={Fragment}
                        //     enter="transition ease-out duration-200"
                        //     enterFrom="opacity-0 translate-y-1"
                        //     enterTo="opacity-100 translate-y-0"
                        //     leave="transition ease-in duration-150"
                        //     leaveFrom="opacity-100 translate-y-0"
                        //     leaveTo="opacity-0 translate-y-1"
                        //   >
                        //     <Popover.Panel className="absolute z-10 -ml-1 mt-1 transform w-screen max-w-xs c-h-65vh bg-white">
                        //       <div className="rounded-md shadow-lg ring-1 ring-black ring-opacity-5 overflow-y-scroll flex-grow scrollbar-hide w-full h-full">
                        //         <Category />
                        //       </div>
                        //     </Popover.Panel>
                        //   </Transition>
                        // </Popover>
                        <>
                          {!loading && !error && data && data[0]?.children?.map((category, index) => {
                            const title = showingTranslateValue(category?.name)
                            return <a
                              onMouseEnter={() => setIsHover(index)}
                              onMouseLeave={() => setIsHover(null)}
                              onClick={() => showCategory(category._id, title)}
                              className={`p-2 flex items-center gap-2 rounded-md hover:text-customGreen transform transition duration-300 hover:scale-105 ${selectedCategory == index ? 'scale-105' : ''}`}
                              role="button"
                              key={category._id}
                            >
                              {/* {console.log('category: ', category)} */}
                              {category.icon ? (
                                isHover == index || selectedCategory == index ?
                                  <Image src={getColorIcon(index, category.icon)} width={30} height={30} alt="Category" /> :
                                  <Image src={category.icon} width={30} height={30} alt="Category" />
                              ) : (
                                <Image
                                  src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                                  width={30}
                                  height={30}
                                  alt="category"
                                />
                              )}

                              <div className="inline-flex items-center justify-between text-2xl font-light w-full hover:text-customGreen-dark whitespace-nowrap">
                                {title}
                              </div>
                            </a>
                          })}
                          <a onMouseEnter={() => setIsHover(4)}
                            onMouseLeave={() => setIsHover(null)}
                            onClick={() => router.push('offers')}
                            className={`p-2 flex items-center gap-2 rounded-md hover:text-customGreen transform transition duration-300 hover:scale-105 ${selectedCategory == 4 ? 'scale-105' : ''}`}
                            role="button">
                            {isHover == 4 || selectedCategory == 4 ?
                              <Image src={getColorIcon(4, offerIconNoColor.src)} width={30} height={30} alt="Category" /> :
                              <Image src={offerIconNoColor.src} width={30} height={30} alt="Category" />}
                            <div className="inline-flex items-center justify-between text-2xl font-light w-full hover:text-customGreen-dark whitespace-nowrap">
                              {t("common:Offers")}
                            </div>
                          </a>
                        </>
                      )}

                    {/* {storeCustomizationSetting?.navbar?.about_menu_status && (
                      <Link
                        href="/about-us"
                        onClick={() => setIsLoading(!isLoading)}
                        className="font-serif mx-4 py-2 text-sm font-medium hover:text-customGreen-dark"
                      >
                        {showingTranslateValue(
                          storeCustomizationSetting?.navbar?.about_us
                        )}
                      </Link>
                    )} */}

                    {/* {storeCustomizationSetting?.navbar?.contact_menu_status && (
                      <Link
                        onClick={() => setIsLoading(!isLoading)}
                        href="/contact-us"
                        className="font-serif mx-4 py-2 text-sm font-medium hover:text-customGreen-dark"
                      >
                        {showingTranslateValue(
                          storeCustomizationSetting?.navbar?.contact_us
                        )}
                      </Link>
                    )} */}

                    {/* <Popover className="relative font-serif">
                      <Popover.Button className="group inline-flex items-center py-2 text-sm font-medium hover:text-customGreen-dark focus:outline-none">
                        <span>
                          {showingTranslateValue(
                            storeCustomizationSetting?.navbar?.pages
                          )}
                        </span>
                        <ChevronDownIcon
                          className="ml-1 h-3 w-3 group-hover:text-customGreen-dark"
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
                                  <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customGreen-dark">
                                    <div className="w-full flex">
                                      <FiGift className="my-auto" />
                                      <Link
                                        href="/offer"
                                        onClick={() => setIsLoading(!isLoading)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-sm font-medium  hover:text-customGreen-dark"
                                      >
                                        {showingTranslateValue(
                                          storeCustomizationSetting?.navbar
                                            ?.offers
                                        )}
                                      </Link>
                                    </div>
                                  </span>
                                )}
                              <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customGreen-dark">
                                <div className="w-full flex">
                                  <FiShoppingBag className="my-auto" />
                                  <Link
                                    href="/checkout"
                                    onClick={() => setIsLoading(!isLoading)}
                                    className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-sm font-medium  hover:text-customGreen-dark"
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
                                  <span className="p-2 font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customGreen-dark">
                                    <div className="w-full flex">
                                      <FiHelpCircle className="my-auto" />
                                      <Link
                                        href="/faq"
                                        onClick={() => setIsLoading(!isLoading)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-sm font-medium  hover:text-customGreen-dark"
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
                                  <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customGreen-dark">
                                    <div className="w-full flex">
                                      <FiUsers className="my-auto" />
                                      <Link
                                        href="/about-us"
                                        onClick={() => setIsLoading(!isLoading)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-sm font-medium  hover:text-customGreen-dark"
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
                                  <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customGreen-dark">
                                    <div className="w-full flex">
                                      <FiPhoneIncoming className="my-auto" />
                                      <Link
                                        href="/contact-us"
                                        onClick={() => setIsLoading(!isLoading)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-sm font-medium  hover:text-customGreen-dark"
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
                                  <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customGreen-dark">
                                    <div className="w-full flex">
                                      <FiPocket className="my-auto" />
                                      <Link
                                        href="/privacy-policy"
                                        onClick={() => setIsLoading(!isLoading)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-sm font-medium  hover:text-customGreen-dark"
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
                                  <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customGreen-dark">
                                    <div className="w-full flex">
                                      <FiFileText className="my-auto" />
                                      <Link
                                        href="/terms-and-conditions"
                                        onClick={() => setIsLoading(!isLoading)}
                                        className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-sm font-medium  hover:text-customGreen-dark"
                                      >
                                        {showingTranslateValue(
                                          storeCustomizationSetting?.navbar
                                            ?.term_and_condition
                                        )}
                                      </Link>
                                    </div>
                                  </span>
                                )}

                              <span className="p-2  font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customGreen-dark">
                                <div className="w-full flex">
                                  <FiAlertCircle className="my-auto" />
                                  <Link
                                    href="/404"
                                    onClick={() => setIsLoading(!isLoading)}
                                    className="relative inline-flex items-center font-serif ml-2 py-0 rounded text-sm font-medium  hover:text-customGreen-dark"
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
                        onClick={() => setIsLoading(!isLoading)}
                        className="relative inline-flex items-center bg-red-100 font-serif py-0 px-2 m-2 rounded text-sm font-medium text-red-500 hover:text-red-800"
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
                </div>
              </div>
            </Popover>
          </div>
          <div className="flex gap-3">
            {/* <button className="hidden sm:inline-block lg:inline-block text-sm leading-6 font-serif font-medium px-6 py-2 bg-customGreen text-center rounded-md text-white hover:bg-customGreen-dark">
              משלוחים ואיזורי חלוקה
            </button> */}
            <button className="flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
              onClick={handleDeliveryRecover}>
              {/* <TbTruckDelivery size={21} className="mt-0.5" /> */}
              <img src={whatsapp.src} className="h-3/4 mt-0.5" />
              <span>שירות לקוחות</span>
            </button>
            <button className="flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
              onClick={() => setDeliveriesPopup(true)}>
              {/* <TbTruckDelivery size={21} className="mt-0.5" /> */}
              <img src={deliveryIcon.src} className="h-full mt-1 " />
              <span>משלוחים ואיזורי חלוקה</span>
            </button>
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
                onClick={() => setIsLoading(!isLoading)}
                href="/privacy-policy"
                className="font-serif mx-4 py-2 text-sm font-medium hover:text-customGreen-dark"
              >
                {showingTranslateValue(
                  storeCustomizationSetting?.navbar?.privacy_policy
                )}
              </Link>
            )}
            {storeCustomizationSetting?.navbar?.term_and_condition_status && (
              <Link
                onClick={() => setIsLoading(!isLoading)}
                href="/terms-and-conditions"
                className="font-serif mx-4 py-2 text-sm font-medium hover:text-customGreen-dark"
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
