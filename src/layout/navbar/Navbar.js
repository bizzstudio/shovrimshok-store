import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCart } from "react-use-cart";
import { IoSearchOutline } from "react-icons/io5";
import { FiShoppingCart, FiUser, FiBell } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import debounce from "lodash.debounce";

//internal import
import NavbarPromo from "@layout/navbar/NavbarPromo";
import { UserContext } from "@context/UserContext";
import LoginModal from "@component/modal/LoginModal";
import CartDrawer from "@component/drawer/CartDrawer";
import { SidebarContext } from "@context/SidebarContext";
import useGetSetting from "@hooks/useGetSetting";
import { handleLogEvent } from "@utils/analytics";
import logo from "public/newLogo.svg";
import ProductServices from "@services/ProductServices";
import ResultWindow from "@component/resultWindow/resultWindow";
import AttributeServices from "@services/AttributeServices";

const Navbar = () => {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [attributes, setAttributes] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const { toggleCartDrawer } = useContext(SidebarContext);
  const { totalItems } = useCart();
  const router = useRouter();

  const { storeCustomizationSetting } = useGetSetting();
  // console.log("storeCustomizationSetting", storeCustomizationSetting);

  const {
    state: { userInfo },
  } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    // return;
    if (searchText.trim()) {
      router.push(`/search?query=${searchText.trim()}`, null, { scroll: false });
      setSearchText("");
      handleLogEvent("search", `searched ${searchText}`);
    }
  };

  // חיפוש מיידי
  useEffect(() => {
    const fetchData = async () => {
      if (searchText.trim()) {
        // קבלת המוצרים המתאימים מהשרת
        let serverProducts = await ProductServices.getShowingStoreProducts({
          title: searchText,
        });
        setSearchResults(serverProducts.products);
        // קבלת התכונות מהשרת
        let attributes = await AttributeServices.getShowingAttributes();
        setAttributes(attributes);
      } else {
        setSearchResults();
      }
    };

    // הוצאה לפועל של הפונקציה אחרי מינימום 300 אלפיות כדי למנוע הצפת בקשות
    const debouncedFetch = debounce(fetchData, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [searchText])


  useEffect(() => {
    if (Cookies.get("userInfo")) {
      const user = JSON.parse(Cookies.get("userInfo"));
      setImageUrl(user.image);
    }
  }, []);

  return (
    <>
      <CartDrawer />
      {modalOpen && (
        <LoginModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}

      <div className="bg-white sticky top-0 z-20">
        <div className="w-full px-3 sm:px-10">
          <div className="top-bar h-16 lg:h-auto flex items-center justify-between pt-4 mx-auto">
            <Link
              href="/"
              className=" hidden md:hidden lg:block"
            >
              <Image
                width={350}
                height={43}
                src={
                  storeCustomizationSetting?.navbar?.header_logo ||
                  logo
                }
                alt="logo"
                className="object-contain"
              />
            </Link>
            <div className="w-full transition-all duration-200 ease-in-out lg:flex lg:max-w-[520px] xl:max-w-[750px] 2xl:max-w-[900px] md:mx-12 lg:mx-4 xl:mx-0">
              <div className="w-full flex flex-col justify-center flex-shrink-0 relative z-30">
                <div className="flex flex-col mx-auto w-full">
                  {/* <form
                    onSubmit={handleSubmit}
                    className="relative pr-12 md:pr-14 bg-gray-100 overflow-hidden rounded-md w-full border-2 border-gray-100 focus-within:border-customGreen"
                  >
                    <label className="flex items-center py-0.5">
                      <input
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                        className="form-input w-full pl-5 appearance-none transition ease-in-out border text-input text-sm font-sans rounded-md min-h-10 h-10 duration-200 bg-transparent focus:ring-0 outline-none border-none focus:outline-none placeholder-gray-500 placeholder-opacity-75"
                        placeholder={t(`common:search-placeholder`)}
                      />
                    </label>
                    <button
                      aria-label="Search"
                      type="submit"
                      className="outline-none text-xl text-gray-400 absolute top-0 right-0 end-0 w-12 md:w-14 h-full flex items-center justify-center transition duration-200 ease-in-out hover:text-heading focus:outline-none"
                    >
                      <IoSearchOutline />
                    </button>
                  </form> */}
                  <form onSubmit={handleSubmit}
                    className="relative w-full h-[40px] flex items-center px-3.5 rounded-[10px] transition-[border-radius] duration-500 ease-in-out bg-gray-100 focus-within:rounded-[1px] before:content-[''] before:absolute before:bg-customGreen before:transform before:scale-x-0 before:origin-center before:w-full before:h-[2px] before:left-0 before:bottom-0 before:rounded-[1px] before:transition-transform before:duration-300 before:ease-in-out focus-within:before:scale-100">
                    <button type="submit" className="border-none bg-none text-[#8b8ba7] focus:text-customGreen">
                      <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                        <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </button>
                    <input
                      onChange={(e) => setSearchText(e.target.value)}
                      className="peer text-sm bg-transparent w-full h-full px-2 py-[0.7em] border-none focus:outline-none focus:ring-0"
                      placeholder={t(`common:search-placeholder`)}
                      required
                      type="text"
                      value={searchText}
                    />
                    <button onClick={() => { setSearchResults(), setSearchText("") }} type="reset" className="border-none bg-none peer-placeholder-shown:opacity-0 peer-placeholder-shown:invisible transition-opacity duration-300" >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                    {searchResults && <ResultWindow
                      products={searchResults}
                      attributes={attributes}
                      clearInput={() => { setSearchResults(), setSearchText("") }}
                      closeResultWindow={() => setSearchResults()}
                    />}
                  </form>
                </div>
              </div>
            </div>
            <div className="hidden md:hidden md:items-center lg:flex gap-5 absolute inset-y-0 right-0 pr-2 sm:static sm:inset-auto sm:pr-0">
              {/* <button
                className="text-customGreen-dark text-2xl font-bold"
                aria-label="Alert"
              >
                <FiBell className="w-6 h-6 drop-shadow-xl" />
              </button> */}
              <button
                aria-label="Total"
                onClick={toggleCartDrawer}
                className="relative text-customGreen-dark text-2xl font-bold"
              >
                {totalItems === 0 ? null :
                  <span className="absolute z-10 top-0 right-0 inline-flex items-center justify-center p-1 h-5 text-xs font-medium leading-none text-red-100 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full" style={{ minWidth: '20px' }}>
                    {totalItems}
                  </span>
                }
                <FiShoppingCart className="w-6 h-6 drop-shadow-xl" />
              </button>
              {/* Profile dropdown */}

              {userInfo?.name ?
                <Link
                  className="flex items-center justify-center text-white bg-customGreen text-2xl font-bold w-9 h-9 rounded-full leading-none outline outline-2 outline-customGreen outline-offset-2 hover:scale-110 hover:outline-none transition-all overflow-hidden"
                  aria-label="Login"
                  href="/user/dashboard"
                >
                  {imageUrl || userInfo?.image ?
                    <Image
                      width={100}
                      height={100}
                      src={imageUrl || userInfo?.image}
                      alt="user"
                      className="min-w-full min-h-full object-cover"
                    /> :
                    <span className="flex items-center justify-center leading-none font-bold font-serif mb-0.5">
                      {userInfo?.name[0]}
                    </span>}
                </Link> :
                <button className="flex items-center justify-center text-white bg-customGreen text-2xl font-bold w-9 h-9 rounded-full leading-none outline outline-2 outline-customGreen outline-offset-2 hover:scale-110 hover:outline-none transition-all overflow-hidden"
                  aria-label="Login"
                  onClick={() => setModalOpen(!modalOpen)}>
                  <FiUser className="w-6 h-6 drop-shadow-xl" />
                </button>
              }
            </div>
          </div>
        </div>

        {/* second header */}
        <NavbarPromo />
      </div >
    </>
  );
};
export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
