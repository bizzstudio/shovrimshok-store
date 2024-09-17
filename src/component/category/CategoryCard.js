import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoRemoveSharp,
} from "react-icons/io5";

//internal import
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";

// TODO: אמור להגיע מהאדמין
import offerIcon from 'public/categories icons/gift-color.svg'
import offerIconNoColor from 'public/categories icons/gift.svg'
import fruitsIcon from 'public/categories icons/fruits_color.svg'
import legumesIcon from 'public/categories icons/beans_color.svg'
import herbsIcon from 'public/categories icons/mortar_color.svg'
import vegetablesIcon from 'public/categories icons/carrot_color.svg'

const CategoryCard = ({ title, icon, nested, id, index, isOdd }) => {
  const router = useRouter();
  const { closeCategoryDrawer, isLoading, setIsLoading } =
    useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();

  // react hook
  const [show, setShow] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState({
    id: "",
    show: false,
  });

  // handle show category
  const showCategory = (id, categoryName) => {
    closeCategoryDrawer()
    // const name = categoryName.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");

    setShow(!show);
    id == "offers" ? router.push('/offers') :
      router.push(`/category/${categoryName}`);
    setIsLoading(!isLoading);
  };

  // handle sub nested category
  const handleSubNestedCategory = (id, categoryName) => {
    const name = categoryName.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");

    setShowSubCategory({ id: id, show: showSubCategory.show ? false : true });
    router.push(`/search?category=${name}&_id=${id}`);
    closeCategoryDrawer;
    setIsLoading(!isLoading);
  };

  const handleSubCategory = (id, categoryName) => {
    // const name = categoryName.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");

    router.push(`/search?category=${categoryName}&_id=${id}`);
    closeCategoryDrawer;
    setIsLoading(!isLoading);
  };

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

  return (
    <>
      {id == "offers" ? <a
        onClick={() => showCategory(id, title)}
        className={`${isOdd ? '' : 'col-span-2'} border-2 border-gray-100 p-2 flex flex-col justify-center items-center rounded-md hover:bg-gray-50 hover:text-customGreen-dark`}
        role="button"
      >
        <Image src={offerIconNoColor.src} width={60} height={60} alt="Category" />
        {/* <Image src={getColorIcon(index, icon)} width={60} height={60} alt="Category" /> */}
        <div className="text-2xl text-center inline-flex items-center justify-between hover:text-customGreen-dark">
          {title}
          {nested?.length > 0 && (
            <span className="transition duration-700 ease-in-out inline-flex loading-none items-end text-gray-400">
              {show ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
            </span>
          )}
        </div>
      </a> : <>
        <a
          onClick={() => showCategory(id, title)}
          className="border-2 border-gray-100 p-2 flex flex-col justify-center items-center rounded-md hover:bg-gray-50 hover:text-customGreen-dark"
          role="button"
        >
          {icon ? (
            <Image src={icon} width={60} height={60} alt="Category" />
            // <Image src={getColorIcon(index, icon)} width={60} height={60} alt="Category" /> 
          ) : (
            <Image
              src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
              width={60}
              height={60}
              alt="category"
            />
          )}

          <div className="text-2xl text-center inline-flex items-center justify-between hover:text-customGreen-dark">
            {title}
            {nested?.length > 0 && (
              <span className="transition duration-700 ease-in-out inline-flex loading-none items-end text-gray-400">
                {show ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
              </span>
            )}
          </div>
        </a>
        {show && nested.length > 0 && (
          <ul className="pl-6 pb-3 pt-1 -mt-1">
            {nested.map((children) => (
              <li key={children._id}>
                {children.children.length > 0 ? (
                  <a
                    onClick={() =>
                      handleSubNestedCategory(
                        children._id,
                        showingTranslateValue(children.name)
                      )
                    }
                    className="flex items-center font-serif pr-2 text-sm text-gray-600 hover:text-customGreen-dark py-1 cursor-pointer"
                  >
                    <span className="text-xs text-gray-500">
                      <IoRemoveSharp />
                    </span>

                    <div className="inline-flex items-center justify-between text-sm font-medium w-full hover:text-customGreen-dark">
                      {showingTranslateValue(children.name)}

                      {children.children.length > 0 ? (
                        <span className="transition duration-700 ease-in-out inline-flex loading-none items-end text-gray-400">
                          {showSubCategory.id === children._id &&
                            showSubCategory.show ? (
                            <IoChevronDownOutline />
                          ) : (
                            <IoChevronForwardOutline />
                          )}
                        </span>
                      ) : null}
                    </div>
                  </a>
                ) : (
                  <a
                    onClick={() =>
                      handleSubCategory(
                        children._id,
                        showingTranslateValue(children.name)
                      )
                    }
                    className="flex items-center font-serif py-1 text-sm text-gray-600 hover:text-customGreen-dark cursor-pointer"
                  >
                    <span className="text-xs text-gray-500 pr-2">
                      <IoRemoveSharp />
                    </span>
                    {showingTranslateValue(children.name)}
                  </a>
                )}

                {/* sub children category */}
                {showSubCategory.id === children._id &&
                  showSubCategory.show === true ? (
                  <ul className="pl-6 pb-3">
                    {children.children.map((subChildren) => (
                      <li key={subChildren._id}>
                        <a
                          onClick={() =>
                            handleSubCategory(
                              subChildren._id,
                              showingTranslateValue(subChildren?.name)
                            )
                          }
                          className="flex items-center font-serif py-1 text-sm text-gray-600 hover:text-customGreen-dark cursor-pointer"
                        >
                          <span className="text-xs text-gray-500 pr-2">
                            <IoRemoveSharp />
                          </span>
                          {showingTranslateValue(subChildren?.name)}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </>}
    </>
  );
};

export default CategoryCard;
