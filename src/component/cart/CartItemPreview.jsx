import React from "react";
import Cookies from "js-cookie";

const CartItemPreview = ({ item }) => {

  let currentLang = Cookies.get('_lang');

  switch (currentLang) {
    case 'he':
      currentLang = true;
      break;
    case 'en':
      currentLang = false;
      break;
    default:
      currentLang = false;
      break;
  }

  return (
    <div className="group w-full h-auto flex gap-4 justify-start items-center bg-white py-3 border-b border-gray-100 relative last:border-b-0">
      <div className="relative flex justify-between rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0"
      >
        <img
          key={item.id}
          src={item.image}
          width={60}
          height={60}
          alt={item.title}
          style={{ aspectRatio: 1, objectFit: 'contain' }}
        />
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-700 text-heading">
          {currentLang ? item.title?.he : item.title?.en}
        </div>
        <div className="flex items-center justify-between">
          <div className="font-bold text-sm md:text-base text-heading leading-5">
            <span>{item?.prices?.price}₪</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemPreview;
