import React from "react";
import Image from "next/image";
import Link from "next/link";

//internal import
import useGetSetting from "@hooks/useGetSetting";
import CMSkeleton from "@component/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";

const CardTwo = () => {
  const { storeCustomizationSetting, error, loading } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <div className="w-full bg-white lg:px-32 lg:py-10 p-6 rounded-lg bgship">
      <div className="flex justify-center items-center">
        <div 
        // className="lg:w-3/5"
        >
          <span className="text-base lg:text-lg">
            <CMSkeleton
              count={1}
              height={20}
              error={error}
              loading={loading}
              data={storeCustomizationSetting?.home?.quick_delivery_subtitle}
              html={true}
            />
          </span>
          <h2 className="font-serif text-xl lg:text-2xl font-bold mb-1">
            <CMSkeleton
              count={1}
              height={30}
              error={error}
              loading={loading}
              data={storeCustomizationSetting?.home?.quick_delivery_title}
              html={true}
            />
          </h2>
          <p className="text-sm font-sans leading-6">
            <CMSkeleton
              count={4}
              height={20}
              error={error}
              loading={loading}
              data={
                storeCustomizationSetting?.home?.quick_delivery_description
              }
              html={true}
            />
          </p>
          {/* <Link
            href={`${storeCustomizationSetting?.home?.quick_delivery_link}`}
            className="lg:w-1/3 flex items-center justify-center gap-2 font-semibold cursor-pointer transition-all bg-customGreen text-white mt-5 px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            // target="_blank"
          >
            {showingTranslateValue(
              storeCustomizationSetting?.home?.quick_delivery_button
            )}
          </Link> */}
        </div>
        {/* <div className="w-1/5 flex-grow hidden lg:flex md:flex md:justify-items-center lg:justify-end">
          <Image
            width={300}
            height={300}
            alt="Quick Delivery to Your Home"
            className="block object-contain"
            src={
              storeCustomizationSetting?.home?.quick_delivery_img ||
              "/cta/delivery-boy.png"
            }
          />
        </div> */}
      </div>
    </div>
  );
};

export default CardTwo;
