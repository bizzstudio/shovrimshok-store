// src/component/category/CategoryCard.js
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import {
  IoChevronDownOutline,
  IoChevronBackOutline,
  IoRemoveSharp,
} from "react-icons/io5";

import { SidebarContext } from "@context/SidebarContext";
import getCategoryIconByCode from "@utils/getCategoryIconByCode";

const CategoryCard = ({ title, nested, id, onLinkClick }) => {
  const router = useRouter();
  const { query, pathname } = router;

  const { closeCategoryDrawer, setIsLoading } = useContext(SidebarContext);

  const [show, setShow] = useState(false);

  const toggleShow = () => setShow(!show);

  const handleClick = (targetPath, targetSub = "") => {
    const currentPath = pathname;
    const currentSub = query?.sub || "";

    const isSameCategory = currentPath === "/category/[categoryId]" && query.categoryId === id;
    const isSameSub = currentSub === targetSub;

    if (isSameCategory && (!nested || isSameSub)) {
      // אם כבר באותה הקטגוריה ותת־קטגוריה – לא טוענים מחדש
      closeCategoryDrawer();
      if (onLinkClick) setTimeout(() => onLinkClick(), 100);
      return;
    }

    // אחרת – מתחילים טעינה ומעבירים
    closeCategoryDrawer();
    if (onLinkClick) setTimeout(() => onLinkClick(), 100);
    // setIsLoading(true);
  };

  const icon = getCategoryIconByCode(id);

  return (
    <>
      <div className="flex items-center rounded-md hover:bg-gray-50 w-full hover:text-customRed cursor-pointer select-none">
        <Link
          href={`/category/${id}`}
          onMouseDown={() => handleClick(`/category/${id}`)} // סוגר את התפריט לפני הניווט
          className="p-2 flex items-center w-full gap-2 group"
        >
          <div className="relative w-[25px] h-[25px]">
            <Image
              src={icon.bw}
              width={25}
              height={25}
              alt="Category BW"
              className="absolute top-0 left-0 object-contain transition-opacity duration-200 group-hover:opacity-0"
            />
            <Image
              src={icon.color}
              width={25}
              height={25}
              alt="Category Color"
              className="absolute top-0 left-0 object-contain opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
          </div>
          <div className="inline-flex items-center justify-between text-sm font-medium w-full hover:text-customRed">
            {title}
          </div>
        </Link>

        {nested?.length > 0 && (
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleShow();
            }}
            className="p-2 text-gray-400 hover:text-customRed"
          >
            {show ? <IoChevronDownOutline /> : <IoChevronBackOutline />}
          </span>
        )}
      </div>

      {show && nested?.length > 0 && (
        <ul className="pl-6 pb-3 pt-1 -mt-1">
          {nested.map((child, ci) => (
            <li key={child.code}>
              <Link
                href={`/category/${id}?sub=${child.code}`}
                onMouseDown={() => handleClick(`/category/${id}`, child.code)} // סוגר את התפריט לפני הניווט
                className="flex items-center gap-1 font-serif py-1 text-sm text-gray-600 hover:text-customRed"
              >
                <span className="text-xs text-gray-500 pr-2">
                  <IoRemoveSharp />
                </span>
                <span className=" truncate max-w-[150px]" title={child?.name || `תת קטגוריה ${ci + 1}`}>
                  {child?.name || `תת קטגוריה ${ci + 1}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default CategoryCard;