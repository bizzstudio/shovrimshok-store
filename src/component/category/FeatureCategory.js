// shapira-store/src/component/category/FeatureCategory.js
import Image from "next/image";
import { useContext, useState, Fragment } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { IoRemoveSharp } from "react-icons/io5";
import { ChevronDownIcon } from "@heroicons/react/outline";
import Router from "next/router";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import useTranslation from "next-translate/useTranslation";

// Internal import
import CMSkeleton from "@component/preloader/CMSkeleton";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";

const PLACEHOLDER_ICON =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const FeatureCategory = () => {
  const { categories } = useContext(SidebarContext);
  const [activePopover, setActivePopover] = useState(null);
  const { t } = useTranslation();
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <div className="container mx-auto">
      {!categories?.length ? (
        <CMSkeleton count={10} height={20} />
      ) : (
        <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {(categories[0]?.children || categories)?.map((category, i) => {
            const icon = {
              color: category?.coloredIcon || category?.icon || PLACEHOLDER_ICON,
            };
            const title = showingTranslateValue(category?.name);
            const catId = category?.slug || category?.code || category?._id;
            return (
              <li
                onClick={() => Router.push(`/category/${catId}`)}
                className="group relative"
                key={`${category?._id ?? category?.slug ?? i}_${i}`}
                title={title}
                onMouseEnter={() => category.children?.length > 0 && setActivePopover(catId)}
                onMouseLeave={() => setActivePopover(null)}
              >
                <div className="flex justify-center md:justify-start w-full h-full border border-gray-100 shadow-sm bg-white p-4 cursor-pointer transition duration-200 ease-linear transform group-hover:shadow-lg">
                  <div className="flex sm:flex-row flex-col gap-2 items-center w-full">
                    <div className="p-2 flex items-center gap-2 group">
                      <div className="relative w-[55px] h-[55px]">
                        <Image
                          src={icon.color}
                          width={55}
                          height={55}
                          alt={title}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <div className="sm:pl-4 w-full">
                      <div>
                        <h3 className="text-customBlue font-serif font-medium leading-tight line-clamp-1 group-hover group-hover:text-customRed sm:text-start text-center">
                          {title}
                        </h3>
                      </div>
                      
                      {/* כפתור הצג הכל במקום רשימת תתי קטגוריות */}
                      {category?.children?.length > 0 && (
                        <div className="pt-1 mt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePopover(activePopover === catId ? null : catId);
                            }}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-customRed-light transition-all duration-150 font-serif"
                          >
                            <span className="text-sm">
                              <ChevronDownIcon 
                                className={`w-3 h-3 transition-transform duration-200 ${
                                  activePopover === category?.slug ? 'rotate-180' : ''
                                }`} 
                              />
                            </span>
                            <span>{t("common:showAllSubCategories")} ({category.children.length})</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* תפריט נפתח של תתי קטגוריות */}
                <Transition
                  show={activePopover === catId && category.children?.length > 0}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <div className="absolute top-full left-0 right-0 z-20 bg-white shadow-lg rounded-b-md ring-1 ring-black ring-opacity-5">
                    <div className="p-2">
                      <ul className="">
                        {category.children && category.children.map((child, ci) => (
                          <li key={`${child._id ?? child.slug ?? ci}_${ci}`}>
                            <Link
                              href={`/category/${catId}?sub=${child?.slug || child?.code || child?._id}`}
                              className="p-2 flex items-center gap-1 text-sm text-gray-600 hover:text-customRed hover:bg-gray-100 rounded-md transition-all duration-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="text-xs text-gray-500 pr-2">
                                <IoRemoveSharp />
                              </span>
                              <span className="whitespace-nowrap truncate" title={showingTranslateValue(child?.name)}>
                                {showingTranslateValue(child?.name)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Transition>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  );
};

export default FeatureCategory;
