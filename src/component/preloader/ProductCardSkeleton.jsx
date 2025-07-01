// src/component/preloader/ProductCardSkeleton.jsx
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton = ({ count = 18 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="group h-full box-border overflow-hidden flex justify-between rounded-md shadow-sm pe-0 flex-col items-center bg-white relative"
        >
          {/* אזור התמונה */}
          <div className="relative flex justify-center pt-2 w-full h-44">
            <div className="relative w-full h-full p-2">
              <Skeleton
                height="100%"
                width="100%"
                baseColor="#f1f5f9"
                highlightColor="#cbd5e1"
                className="rounded"
              />
            </div>
          </div>

          {/* אזור הטקסט והמחיר */}
          <div className="w-full px-3 lg:px-4 pb-4 overflow-hidden">
            {/* יחידה ושם מוצר */}
            <div className="relative mb-1">
              <Skeleton
                height={16}
                width="90%"
                baseColor="#f1f5f9"
                highlightColor="#cbd5e1"
                className="mb-1"
              />
              <Skeleton
                height={16}
                width="70%"
                baseColor="#f1f5f9"
                highlightColor="#cbd5e1"
              />
            </div>

            {/* מחיר וכפתור הוספה לעגלה */}
            <div className="flex justify-between items-center gap-1 mt-1.5">
              <div className="flex flex-col">
                {/* מחיר */}
                <Skeleton
                  height={18}
                  width={60}
                  baseColor="#f1f5f9"
                  highlightColor="#cbd5e1"
                  className="mb-1"
                />
                {/* קוד מוצר */}
                <Skeleton
                  height={12}
                  width={80}
                  baseColor="#f1f5f9"
                  highlightColor="#cbd5e1"
                />
              </div>

              {/* כפתור הוספה לעגלה */}
              <Skeleton
                height={40}
                width={40}
                baseColor="#f1f5f9"
                highlightColor="#cbd5e1"
                className="rounded"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCardSkeleton; 