// shovrimshok-store/src/component/coupon/CouponBanner.jsx
import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import useGetSetting from "@hooks/useGetSetting";

const CouponBanner = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const [copied, setCopied] = useState(false);

  const isEnabled = storeCustomizationSetting?.home?.coupon_status === true;
  const code = storeCustomizationSetting?.home?.discount_coupon_code;

  if (!isEnabled || !code) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // fallback בשרתים בלי clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="bg-customRed text-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 py-3 flex items-center justify-center gap-3 flex-wrap text-sm sm:text-base font-serif">
        <span>השתמש בקוד הקופון לקבלת הנחה:</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-white text-customRed font-bold tracking-wider px-3 py-1 rounded border-2 border-dashed border-white hover:bg-customRed-superLight transition-colors"
          aria-label="העתק קוד קופון"
        >
          <span>{code}</span>
          {copied ? <FiCheck className="text-green-600" /> : <FiCopy />}
        </button>
        {copied && <span className="text-xs opacity-90">הקוד הועתק!</span>}
      </div>
    </div>
  );
};

export default CouponBanner;
