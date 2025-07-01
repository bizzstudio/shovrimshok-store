const { default: Image } = require("next/image");
const { useEffect, useState } = require("react");

const fallbackImage =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const ImageWithFallback = ({
  fallback = fallbackImage,
  alt,
  src,
  outOfStock,
  noPadding = false,
  ...props
}) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  console.log('src: ', src);

  return (
    <Image
      alt={alt}
      onError={setError}
      src={error ? fallbackImage : src}
      {...props}
      fill
      style={{
        objectFit: "contain",
      }}
      sizes="100%"
      className={`object-contain transition duration-150 ease-linear transform group-hover:scale-105 ${noPadding ? "p-1" : "p-4"}`}
      // className={`object-contain transition duration-150 ease-linear transform group-hover:scale-105 ${noPadding ? "p-1" : "p-4"} ${outOfStock ? 'grayscale' : ''}`}
    />
  );
};

export default ImageWithFallback;