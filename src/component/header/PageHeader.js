// src/component/header/PageHeader.js
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";
import React from "react";

const PageHeader = ({ title, headerBg, useShapiraTitle = true, className = "", height = 70 }) => {
  return (
    <div
      style={{ backgroundImage: `url(${headerBg || "/page-header-bg.jpg"})` }}
      className={`flex justify-center py-10 lg:py-28 bg-indigo-100 w-full bg-cover bg-no-repeat bg-bottom`}
    >
      <div className="flex mx-auto w-full max-w-screen-2xl px-3 sm:px-10">
        <div className="w-full flex justify-center flex-col relative">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold font-serif text-center">
            {useShapiraTitle ? <ShapiraTitle text={title} height={height} className={className} /> : <h1 className="text-3xl md:text-4xl lg:text-5xl text-customRed mb-6 font-popper tracking-[2px]">{title}</h1>}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
