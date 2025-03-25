// src/component/category/CategoryCard.js
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronBackOutline,
  IoRemoveSharp,
} from "react-icons/io5";

import { SidebarContext } from "@context/SidebarContext";

// פונקציה שמחזירה אייקון לפי קוד קטגוריה (להרחיב לפי הצורך)
const getCategoryIconByCode = (code) => {
  const iconsMap = {
    // "1000": "/icons/canned.svg",
  };
  return iconsMap[code] || "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";
};

const CategoryCard = ({ title, nested, id }) => {
  const { closeCategoryDrawer, isLoading, setIsLoading } = useContext(SidebarContext);

  const [show, setShow] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState({
    id: "",
    show: false,
  });

  const toggleShow = () => setShow(!show);

  const handleSubSubToggle = (code) => {
    setShowSubCategory((prev) => ({
      id: code,
      show: prev.id === code ? !prev.show : true,
    }));
  };

  const handleCategoryClick = () => {
    closeCategoryDrawer();
    setIsLoading(true);
  };

  return (
    <>
      <div className="flex items-center rounded-md hover:bg-gray-50 w-full hover:text-customGreen cursor-pointer select-none">
        <Link
          href={`/category/${id}`}
          className="p-2 flex items-center w-full gap-2"
          onClick={handleCategoryClick}
        >
          <Image
            src={getCategoryIconByCode(id)}
            width={30}
            height={30}
            alt="Category"
            className="object-contain"
          />
          <div className="inline-flex items-center justify-between text-sm font-medium w-full hover:text-customGreen">
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
            className="p-2 text-gray-400 hover:text-customGreen"
          >
            {show ? <IoChevronDownOutline /> : <IoChevronBackOutline />}
          </span>
        )}
      </div>

      {show && nested?.length > 0 && (
        <ul className="pl-6 pb-3 pt-1 -mt-1">
          {nested.map((child) => (
            <li key={child.code}>
              <Link
                href={`/category/${id}?sub=${child.code}`}
                onClick={handleCategoryClick}
                className="flex items-center gap-1 font-serif py-1 text-sm text-gray-600 hover:text-customGreen"
              >
                <span className="text-xs text-gray-500 pr-2">
                  <IoRemoveSharp />
                </span>
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default CategoryCard;