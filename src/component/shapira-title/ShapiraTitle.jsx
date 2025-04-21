// shapira-store/src/component/shapira-title/ShapiraTitle.jsx
import useUtilsFunction from "@hooks/useUtilsFunction";
import shapira_leaf from "public/shapira_leaf.svg";

export default function ShapiraTitle({
    text,
    height = 80,
    className = "",
}) {
    const { showingTranslateValue } = useUtilsFunction();

    return (
        <div
            className={`flex flex-col justify-between w-fit relative mx-auto select-none ${className}`}
            style={{ height, marginBottom: height * 0.1, marginTop: height * 0.1 }}
        >
            {/* אייקון עלים */}
            <img
                src={shapira_leaf.src}
                alt="shapira leaf logo"
                className="absolute bottom-[74%] left-0 animate-fade-scale-in"
                style={{ height: height * 0.7 }}
            />

            {/* פס עליון */}
            <div
                className="bg-[#f56416] rounded-full self-start animate-slide-in-left"
                style={{
                    width: "min(200px, 50%)",
                    height: height * 0.12,
                }}
            />

            {/* טקסט */}
            <span
                className="w-fit font-popper tracking-[1px] text-red-600 leading-none whitespace-nowrap flex items-center animate-fade-scale-in"
                style={{
                    fontSize: `calc(${height}px * 0.55)`,
                    marginTop: `calc(-${height * 0.11}px / 2)`,
                }}
            >
                {typeof text === "object" ? showingTranslateValue(text) : text}
            </span>

            {/* פס תחתון */}
            <div
                className="bg-[#f56416] rounded-full self-start ms-auto animate-slide-in-right"
                style={{
                    width: "min(200px, 40%)",
                    height: height * 0.12,
                }}
            />
        </div>
    );
};