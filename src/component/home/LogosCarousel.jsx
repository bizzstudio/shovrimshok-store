// shapira-store/src/components/home/LogosCarousel.jsx
import React, { useRef } from "react";

const LogosCarousel = ({ logos = [] }) => {
  const trackRef = useRef(null);

  const pause = () => trackRef.current?.classList.add("paused");
  const play  = () => trackRef.current?.classList.remove("paused");

  // משכפלים 3× כדי שלא “ייגמר” בחלונות גדולים מאוד
  const trackLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full">
      <div className="scroll-container">
        <div
          ref={trackRef}
          onMouseEnter={pause}
          onMouseLeave={play}
          className="scroll-track"
        >
          {trackLogos.map((logo, i) => (
            <div key={i} className="px-8 flex-shrink-0" style={{ minWidth:150 }}>
              <img
                src={logo}
                alt={`logo-${i}`}
                className="h-[60px] object-contain select-none grayscale hover:grayscale-0 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogosCarousel;
