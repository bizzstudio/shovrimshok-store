// shapira-store/src/component/category/FeatureCategory.js
import Image from "next/image";
import { useContext } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import Router from "next/router";
import Link from "next/link";

// Internal import
import CMSkeleton from "@component/preloader/CMSkeleton";
import { SidebarContext } from "@context/SidebarContext";
import getCategoryIconByCode from "@utils/getCategoryIconByCode";

const FeatureCategory = () => {
  const { categories } = useContext(SidebarContext);

  return (
    <div className="container mx-auto">
      {!categories?.length ? (
        <CMSkeleton count={10} height={20} />
      ) : (
        <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {categories?.map((category, i) => {
            const icon = getCategoryIconByCode(category?.code);
            const title = category?.name;
            return (
              <li
                onClick={() => Router.push(`/category/${category?.code}`)}
                className="group"
                key={category?.code + i}
                title={title}
              >
                <div className="flex justify-center md:justify-start w-full h-full border border-gray-100 shadow-sm bg-white p-4 cursor-pointer transition duration-200 ease-linear transform group-hover:shadow-lg">
                  <div className="flex sm:flex-row flex-col gap-2 items-center w-full">
                    <div className="p-2 flex items-center gap-2 group">
                      <div className="relative w-[55px] h-[55px]">
                        <Image
                          src={icon.bw}
                          width={55}
                          height={55}
                          alt="Category BW"
                          className="absolute top-0 left-0 object-contain transition-opacity duration-200 sm:group-hover:opacity-0 sm:block hidden filter-custom-blue"
                        />
                        <Image
                          src={icon.color}
                          width={55}
                          height={55}
                          alt="Category Color"
                          className="absolute top-0 left-0 object-contain opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                        />
                      </div>
                    </div>

                    <div className="sm:pl-4 w-full">
                      <div>
                        <h3 className="text-customBlue font-serif font-medium leading-tight line-clamp-1 group-hover group-hover:text-customRed sm:text-start text-center">
                          {title}
                        </h3>
                      </div>
                      <ul className="pt-1 mt-1">
                        {category?.children?.slice(0, 5).map((child, ci) => (
                          <li
                            onClick={e => e.stopPropagation()}
                            key={child.code + ci}
                            className="pt-1 text-gray-400 cursor-pointer hover:text-customRed-light hover:ms-2 transition-all duration-150"
                          >
                            <Link
                              href={`/category/${category?.code}?sub=${child?.code}`}
                              className="flex items-center gap-1 font-serif text-xs"
                            >
                              <span className="text-sm">
                                <IoChevronBackSharp />
                              </span>
                              <span className="truncate" title={child?.name || `תת קטגוריה ${ci + 1}`}>
                                {child?.name || `תת קטגוריה ${ci + 1}`}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul >
      )}
    </div>
  );
};

export default FeatureCategory;
