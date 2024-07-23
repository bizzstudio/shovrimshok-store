import React, { useRef } from "react";
import Router from "next/router";

//internal import
import Coupon from "@component/coupon/Coupon";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import OfferServices from "@services/OfferServices";
import useAsync from "@hooks/useAsync";
import Discount from "@component/common/Discount";

const OfferCard = ({ discountProducts }) => {
  const { storeCustomizationSetting } = useGetSetting();
  // const { showingTranslateValue } = useUtilsFunction();

  const { data: offers } = useAsync(() => OfferServices.getAllOffers());

  const isProductWithDiscount = (product) => {
    const offerName = offers.find((offer) => offer.products.some(prod => prod._id == product._id))?.name?.he
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
      <div className="bg-gray-50  transition duration-150 ease-linear transform">
        <div className="bg-customBrown-light text-gray-900 px-6 py-2 rounded-t border-b flex items-center justify-center">
          // <h3 className="text-base font-serif font-medium ">
          //   {showingTranslateValue(
          //     storeCustomizationSetting?.home?.discount_title
          //   )}
          // </h3>
    // <h2 class="text-xl lg:text-2xl mb-2 font-serif font-semibold"><img src="https://site.meshek-kirshner.co.il/_next/static/media/popolarTitle.5256804c.svg" alt="skeleton" class="h-28 mx-auto -mb-10 -mt-4"></h2>
        </div>
        <div className="scroll-container">
          <div className="scroll-content"
            ref={scrollContentRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {discountProducts?.map((product) => (
              <div key={product._id} onClick={() => Router.push(`/product/${product?.slug}`)} className="group w-full h-auto flex gap-4 justify-start products-center bg-white py-3 px-6 border-b hover:bg-gray-50 transition-all border-gray-100 relative last:border-b-0 cursor-pointer">
                <div className="relative flex justify-between rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0"
                >
                  <img
                    key={product.id}
                    src={product.image}
                    width={60}
                    height={60}
                    alt={product.title?.he}
                    style={{ aspectRatio: 1, objectFit: 'contain' }}
                  />
                </div>
                <div className="flex items-center my-auto w-full h-fit justify-between">
                  <div className="truncate text-sm font-medium text-gray-700 text-heading line-clamp-1">
                    {product.title?.he}
                  </div>
                  {isProductWithDiscount(product)}
                </div>
              </div>
            ))}
            {discountProducts?.map((product) => (
              <div key={`${product._id}-clone`} onClick={() => Router.push(`/product/${product?.slug}`)} className="group w-full h-auto flex gap-4 justify-start products-center bg-white py-3 px-6 border-b hover:bg-gray-50 transition-all border-gray-100 relative last:border-b-0 cursor-pointer">
                <div className="relative flex justify-between rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0"
                >
                  <img
                    key={product.id}
                    src={product.image}
                    width={60}
                    height={60}
                    alt={product.title?.he}
                    style={{ aspectRatio: 1, objectFit: 'contain' }}
                  />
                </div>
                <div className="flex items-center my-auto w-full h-fit justify-between">
                  <div className="truncate text-sm font-medium text-gray-700 text-heading line-clamp-1">
                    {product.title?.he}
                  </div>
                  {isProductWithDiscount(product)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
