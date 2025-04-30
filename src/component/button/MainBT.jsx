// src/component/button/MainBT.jsx
import React from 'react';

const MainBT = ({ children, className, ...props }) => {
    return (
        <button
            className={`font-bold relative px-4 py-1.5 text-center text-lg tracking-wider 
            text-customRed bg-transparent cursor-pointer transition-all duration-500 
            border-2 border-customRed rounded-lg overflow-hidden
            hover:text-white active:scale-90 group ${className || ''}`}
            {...props}
        >
            <span className="flex items-center justify-center relative z-10">{children}</span>
            <span className="absolute rounded-md inset-0 bg-customRed translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms] ease-in-out" />
        </button>
    );
};

export default MainBT;