import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import useTranslation from "next-translate/useTranslation";

//internal import
import { pages } from "@utils/data";
import useAsync from "@hooks/useAsync";
import Loading from "@component/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";
import CategoryServices from "@services/CategoryServices";
import CategoryCard from "@component/category/CategoryCard";
import useUtilsFunction from "@hooks/useUtilsFunction";
import logo from "public/newlogo.svg";
import deliveryIcon from 'public/shipped.svg'
import MainModal from "@component/modal/MainModal";
import DeliveriesPopup from "@component/deliveriesPopup/DeliveriesPopup";

const Category = () => {
  const { categoryDrawerOpen, closeCategoryDrawer } =
    useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();
  const { data, loading, error } = useAsync(() =>
    CategoryServices.getShowingCategory()
  );
  const [deliveriesPopup, setDeliveriesPopup] = useState(false);

  const { t } = useTranslation();

  return (
    <>
      {deliveriesPopup && (
        <MainModal modalOpen={deliveriesPopup} setModalOpen={setDeliveriesPopup} z={9999}>
          <DeliveriesPopup closeCategoryDrawer={closeCategoryDrawer} />
        </MainModal>
      )}
      <div className="flex flex-col w-full h-full bg-white cursor-pointer scrollbar-hide">
        {categoryDrawerOpen && (
          <div className="w-full flex justify-between items-center px-6 py-1 text-white border-b-2 border-gray-100">
            <h2 className="font-semibold font-serif text-lg m-0 text-heading flex align-center">
              <Link href="/" className="bg-white rounded-xl">
                <img
                  src={logo.src}
                  alt="logo"
                  className="h-[72px]"
                />
              </Link>
            </h2>
            <button
              onClick={closeCategoryDrawer}
              className="inline-flex justify-center px-2 py-2 text-base font-medium text-customGreen border border-transparent rounded-full bg-customGreen-leaf focus:outline-none border-none outline-none"
              aria-label="close"
            >
              <IoClose />
            </button>
          </div>
        )}
        <div className="w-full max-h-full">
          {categoryDrawerOpen && (
            <h2 className="flex justify-between font-semibold font-serif text-lg m-0 text-heading items-center border-b-2 border-t-2 border-customGreen px-8 py-3">
              קטגוריות
            </h2>
          )}
          {error ? (
            <p className="flex justify-center align-middle items-center m-auto text-xl text-red-500">
              <span> {error}</span>
            </p>
          ) : data.length === 0 ? (
            <Loading loading={loading} />
          ) : (
            <div className="relative grid gap-2 p-6">
              {data[0]?.children?.map((category, index) => (
                <CategoryCard
                  index={index}
                  key={category._id}
                  id={category._id}
                  icon={category.icon}
                  nested={category.children}
                  title={showingTranslateValue(category?.name)}
                />
              ))}
              {/* מבצעים */}
              <CategoryCard
                index={4}
                key={"offers"}
                id={"offers"}
                title={t("common:Offers")}
              />
            </div>
          )}

          {/* {categoryDrawerOpen && (
          <div className="relative grid gap-2 mt-5">
            <h3 className="font-semibold font-serif text-lg m-0 text-heading flex align-center border-b px-8 py-3">
              עמודים
            </h3>
            <div className="relative grid gap-1 p-6">
              {pages.map((item) => (
                <a
                  href={item.href}
                  className="p-2 flex font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-customGreen-dark"
                >
                  <item.icon
                    className="flex-shrink-0 h-4 w-4"
                    aria-hidden="true"
                  />
                  <p className="inline-flex items-center justify-between ml-2 text-sm font-medium w-full hover:text-customGreen-dark">
                    {item.title}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )} */}
        </div>
        <button className="mt-auto m-3 flex items-center justify-center gap-2 font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] whitespace-nowrap"
          onClick={() => setDeliveriesPopup(true)}>
          {/* <TbTruckDelivery size={21} className="mt-0.5" /> */}
          <img src={deliveryIcon.src} className="h-full mt-1 " />
          <span>משלוחים ואיזורי חלוקה</span>
        </button>
      </div>
    </>
  );
};

export default Category;
