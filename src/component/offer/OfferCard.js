// OfferCard.js
import React, { useContext, useRef } from "react";

//internal import
import Coupon from "@component/coupon/Coupon";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Discount from "@component/common/Discount";
import ScrollOfferCard from "@component/product/ScrollOfferCard";
import getOfferNames from "./getOfferNames";
import { SidebarContext } from "@context/SidebarContext";

const OfferCard = ({ discountProducts, height, attributes }) => {
  const { storeCustomizationSetting } = useGetSetting();
  const { offers } = useContext(SidebarContext);
  const headerRef = useRef(null);

  const isProductWithDiscount = (product) => {
    const offerName = getOfferNames(offers, product);
    if (offerName) {
      return <Discount slug product={product} title={offerName} />
    } else {
      return <></>
    }
  }

  const scrollContentRef = useRef(null);

  const handleMouseEnter = () => {
    if (scrollContentRef.current) {
      scrollContentRef.current.classList.add('paused');
    }
  };

  const handleMouseLeave = () => {
    if (scrollContentRef.current) {
      scrollContentRef.current.classList.remove('paused');
    }
  };

  return (
    <div className="w-full group">
      <div className="transition duration-150 ease-linear transform border-customGreen">
        <div className="text-gray-900 px-6 py-2 rounded-t border-b flex items-center justify-center" ref={headerRef}>
          <h3 className="text-base font-serif font-medium">
            <img
              src="/222.svg"
              width={220}
              height={75}
            />
          </h3>
        </div>
        <div className="scroll-container" style={{ height: height - headerRef.current?.offsetHeight || 0 }}>
          <div className="scroll-content"
            ref={scrollContentRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {discountProducts?.map((product, index) => (
              <div key={(product._id ?? product.ItemCode) + index} className="group w-full h-auto flex gap-4 justify-start products-center bg-white py-3 px-6 border-b transition-all border-gray-100 relative last:border-b-0 cursor-pointer">
                <ScrollOfferCard product={product} offers={offers} attributes={attributes} key={(product._id ?? product.ItemCode)} />
              </div>
            ))}
            {discountProducts?.map((product, index) => (
              <div key={`${(product._id ?? product.ItemCode)}-clone-${index}`} className="group w-full h-auto flex gap-4 justify-start products-center bg-white py-3 px-6 border-b transition-all border-gray-100 relative last:border-b-0 cursor-pointer">
                <ScrollOfferCard product={product} offers={offers} attributes={attributes} key={(product._id ?? product.ItemCode)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
