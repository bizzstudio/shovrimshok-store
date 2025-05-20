// src/component/preloader/CMSkeleton.js
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import parse from "html-react-parser";
import useUtilsFunction from "@hooks/useUtilsFunction";

const CMSkeleton = ({
  html,
  count,
  height,
  color,
  loading,
  error,
  data,
  highlightColor,
  isIimage = false,
}) => {
  const { showingTranslateValue } = useUtilsFunction();

  // Function to handle line breaks and text formatting
  const formatTextWithLineBreaks = (text) => {
    return text.split('\n').map((line, index) => {
      // Process bold text (text surrounded by asterisks)
      const parts = line.split(/(\*[^*]+\*)/g);
      const formattedLine = parts.map((part, i) => {
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          // Remove asterisks and wrap in <strong> tag
          return <strong key={i}>{part.slice(1, -1)}</strong>;
        }
        return part;
      });

      return (
        <React.Fragment key={index}>
          {formattedLine}
          {index !== text.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {loading ? (
        <Skeleton
          count={count || 6}
          height={height || 25}
          // className="bg-gray-200"
          baseColor={color || "#f1f5f9"}
          highlightColor={highlightColor || "#cbd5e1"}
        />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : data ? (
        // if the data is an image
        isIimage ? (
          <img src={data} alt="skeleton" className="h-28 mx-auto -mb-10 -mt-4" />
        ) :
          // if the data is text
          html ? (
            parse(showingTranslateValue(data))
          ) : (
            formatTextWithLineBreaks(showingTranslateValue(data))
          )
      ) : null}
    </>
  );
};

export default CMSkeleton;