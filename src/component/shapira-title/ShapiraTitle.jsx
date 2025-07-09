// shapira-store/src/component/shapira-title/ShapiraTitle.jsx
import useUtilsFunction from "@hooks/useUtilsFunction";
import shapira_leaf from "public/shapira_leaf.svg";
import { useEffect, useState } from "react";

export default function ShapiraTitle({
    text,
    height = 80,
    className = "",
}) {
    const { showingTranslateValue } = useUtilsFunction();
    const [currentHeight, setCurrentHeight] = useState(height);
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 640) { // sm ומטה ב־Tailwind
                setCurrentHeight(height / 1.8);
                setIsSmall(true);
            } else {
                setCurrentHeight(height);
                setIsSmall(false);
            }
        };

        handleResize(); // להריץ פעם אחת גם ב־mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [height]);

    const translatedTitle = (typeof text === "object" ? showingTranslateValue(text) : text)
    const isContainNewLine = translatedTitle.includes('\\n') || translatedTitle.includes('\\r') || translatedTitle.includes('\\r\\n');
    const finalTitle = translatedTitle
        ?.replace(/\\r\\n/g, '<br />')
        ?.replace(/\\n/g, '<br />')
        ?.replace(/\\r/g, '<br />')

    return (
        <div
            className={`flex flex-col justify-between w-fit relative mx-auto select-none sm:gap-0 gap-2 ${className}`}
            style={{
                height: isSmall ? 'fit-content' : isContainNewLine ? currentHeight * 1.5 : currentHeight,
                marginBottom: currentHeight * 0.1,
                marginTop: currentHeight * 0.1,
            }}
        >
            {/* אייקון עלים */}
            {/* <img
                src={shapira_leaf.src}
                alt="shapira leaf logo"
                className="absolute left-[5%] animate-fade-scale-in"
                style={{ height: currentHeight * 0.7, bottom: isSmall ? '85%' : '74%' }}
            /> */}

            {/* פס עליון */}
            <div
                className="bg-[#f56416] rounded-full self-start animate-slide-in-left"
                style={{
                    width: "min(200px, 50%)",
                    height: currentHeight * 0.12,
                }}
            />

            {/* טקסט */}
            <span
                className="flex flex-wrap w-fit font-popper font-light text-red-600 leading-none items-center animate-fade-scale-in text-center"
                style={{
                    fontSize: `calc(${currentHeight}px * 0.55)`,
                    marginTop: `calc(-${currentHeight * (isContainNewLine ? 0.18 : 0.11)}px / 2)`,
                }}
                dangerouslySetInnerHTML={{
                    __html: finalTitle
                }}
            />

            {/* פס תחתון */}
            <div
                className="bg-[#f56416] rounded-full self-start ms-auto animate-slide-in-right"
                style={{
                    width: "min(200px, 40%)",
                    height: currentHeight * 0.12,
                }}
            />
        </div>
    );
};