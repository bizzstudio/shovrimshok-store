// src/component/category/Category.js
import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import useTranslation from "next-translate/useTranslation";

// Internal import
import { pages } from "@utils/data";
import { SidebarContext } from "@context/SidebarContext";
import Loading from "@component/preloader/Loading";
import CategoryCard from "./CategoryCard";
import useGetSetting from "@hooks/useGetSetting";
import CMSkeleton from "@component/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Category = ({ onLinkClick }) => {
  const { categoryDrawerOpen, closeCategoryDrawer, categories, setIsLoading } = useContext(SidebarContext);
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const { t } = useTranslation();

  // console.log('categoies :>> ', categories);

  return (
    <div className="flex flex-col w-full h-full bg-white overflow-y-auto">
      {categoryDrawerOpen && (
        <div className="bg-gradient-to-b from-[#E0E2E9] to-transparent w-full flex flex-col justify-center items-center">
          {/* לוגו וכפתור סגירה */}
          <div className="w-full flex justify-between items-center px-6 py-2 text-white">
            <h2 className="font-semibold font-serif text-lg m-0 text-heading flex align-center">
              <Link
                href="/"
                className="ms-2"
                rel="noreferrer"
              >
                <Image
                  width={100}
                  height={10}
                  src={
                    storeCustomizationSetting?.footer?.block4_logo ||
                    "/logo/logo-color.svg"
                  }
                  alt="logo"
                  className="w-full"
                />
              </Link>
            </h2>
            <button
              onClick={closeCategoryDrawer}
              className="flex text-xl items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-red-500 p-2 focus:outline-none transition-opacity hover:text-red-600"
              aria-label="close"
            >
              <IoClose />
            </button>
          </div>

          {/* כותרת קטגוריות */}
          <hr
            className="w-full h-[3px]"
            style={{
              backgroundImage:
                'linear-gradient(to right, transparent 0%, #f3f4f6 10%, #002863 30%, #002863 70%, #f3f4f6 90%, transparent 100%)',
            }}
          />
          <h2 className="w-full font-semibold font-serif text-lg m-0 text-heading flex align-center px-8 py-3">
            {showingTranslateValue(storeCustomizationSetting?.navbar?.categories)}
          </h2>
          <hr
            className="w-full h-[3px]"
            style={{
              backgroundImage:
                'linear-gradient(to right, transparent 0%, #f3f4f6 10%, #002863 30%, #002863 70%, #f3f4f6 90%, transparent 100%)',
            }}
          />
        </div>
      )}

      <div className="w-full max-h-full">
        {/* קטגוריות */}
        {!categories ? (
          <Loading loading />
        ) : (
          <div className="relative grid gap-2 px-4 py-2">
            {/* הצגת כל הקטגוריות הראשיות */}
            {categories.map((category) => (
              <CategoryCard
                key={category.code}
                id={category.code}
                icon={null}
                nested={category.children} // תתי קטגוריות
                title={category.name}
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        )}

        {categoryDrawerOpen && (
          <div className="relative mt-5">
            {/* כותרת עמודים */}
            <hr
              className="w-full h-[3px]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, transparent 0%, #f3f4f6 10%, #002863 30%, #002863 70%, #f3f4f6 90%, transparent 100%)',
              }}
            />
            <h3 className="font-semibold font-serif text-lg m-0 text-heading flex align-center px-8 py-3">
              {t("common:Pages")}
            </h3>
            <hr
              className="w-full h-[3px]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, transparent 0%, #f3f4f6 10%, #002863 30%, #002863 70%, #f3f4f6 90%, transparent 100%)',
              }}
            />

            {/* עמודים */}
            <div className="relative grid gap-1 p-6">
              {pages.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={closeCategoryDrawer} // סוגר את התפריט לפני הניווט
                  className="p-2 flex gap-1.5 font-serif items-center justify-center rounded-md hover:bg-gray-50 w-full hover:text-customRed"
                >
                  <item.icon
                    className="flex-shrink-0 h-4 w-4"
                    aria-hidden="true"
                  />
                  <p className="inline-flex items-center justify-between text-sm font-medium w-full hover:text-customRed mb-[1px]">
                    {t(`common:${item.title}`)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;