// src/pages/product/[slug].jsx
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMinus, FiPlus } from "react-icons/fi";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import dayjs from "dayjs";

// Internal import
import Price from "@component/common/Price";
import Stock from "@component/common/Stock";
import Tags from "@component/common/Tags";
import Layout from "@layout/Layout";
import { notifyError } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import Loading from "@component/preloader/Loading";
import ProductCard from "@component/product/ProductCard";
import VariantList from "@component/variants/VariantList";
import { SidebarContext } from "@context/SidebarContext";
import AttributeServices from "@services/AttributeServices";
import ProductServices from "@services/ProductServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Discount from "@component/common/Discount";
import ImageCarousel from "@component/carousel/ImageCarousel";
import relatedTitle from 'public/titles/relatedProducts.svg'
import useCart from "@hooks/useCart";
import getOfferNames from "@component/offer/getOfferNames";
import MainBT from "@component/button/MainBT";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";
import ProductDescription from "@component/product/ProductDescription";
import ProductRichDescription from "@component/product/ProductRichDescription";

const ProductScreen = ({ product, attributes, relatedProducts }) => {
  // console.log('product :>> ', product);
  // console.log('relatedProducts :>> ', relatedProducts);
  const router = useRouter();

  const { lang, showingTranslateValue, getNumber, currency } = useUtilsFunction();

  const { isLoading, setIsLoading, offers, categories } = useContext(SidebarContext);
  const { handleAddItem, item, setItem } = useAddToCart();

  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  // const [stock, setStock] = useState(Infinity);
  const [discount, setDiscount] = useState(0);
  const [selectVariant, setSelectVariant] = useState({});
  const [isReadMore, setIsReadMore] = useState(true);
  const [selectVa, setSelectVa] = useState({});
  const [variantTitle, setVariantTitle] = useState([]);
  const [variants, setVariants] = useState([]);

  const { items } = useCart();
  const [offerTitle, setOfferTitle] = useState();

  const inStock = product?.stock > 0 || product?.OnHand > 0;

  // עדכון מחיר המוצר על סמך המבצע שלו
  useEffect(() => {
    const offerName = getOfferNames(offers, product);
    if (offerName) {
      setOfferTitle(offerName);
    } else {
      setOfferTitle('');
    }
  }, [offers]);

  useEffect(() => {
    // if (value) {
    //   const result = product?.variants?.filter((variant) =>
    //     Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
    //   );

    //   const res = result?.map(
    //     ({
    //       originalPrice,
    //       price,
    //       discount,
    //       quantity,
    //       barcode,
    //       sku,
    //       productId,
    //       image,
    //       ...rest
    //     }) => ({
    //       ...rest,
    //     })
    //   );

    //   const filterKey = Object.keys(Object.assign({}, ...res));
    //   const selectVar = filterKey?.reduce(
    //     (obj, key) => ({ ...obj, [key]: selectVariant[key] }),
    //     {}
    //   );
    //   const newObj = Object.entries(selectVar).reduce(
    //     (a, [k, v]) => (v ? ((a[k] = v), a) : a),
    //     {}
    //   );

    //   // const result2 = result?.find((v) =>
    //   //   Object.keys(newObj).every((k) => newObj[k] === v[k])
    //   // );
    //   const result2 = result[0];

    //   // console.log("result2", result2);

    //   if (result.length <= 0 || result2 === undefined) return setStock(0);

    //   setVariants(result);
    //   setSelectVariant(result2);
    //   setSelectVa(result2);
    //   setImg(result2?.image);
    //   setStock(result2?.quantity);
    //   const price = getNumber(result2?.price);
    //   const originalPrice = getNumber(result2?.originalPrice);
    //   const discountPercentage = getNumber(
    //     ((originalPrice - price) / originalPrice) * 100
    //   );
    //   setDiscount(getNumber(discountPercentage));
    //   setPrice(price);
    //   setOriginalPrice(originalPrice);
    // } else if (product?.variants?.length > 0) {
    //   const result = product?.variants?.filter((variant) =>
    //     Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
    //   );

    //   setVariants(result);
    //   setStock(product.variants[0]?.quantity);
    //   setSelectVariant(product.variants[0]);
    //   setSelectVa(product.variants[0]);
    //   setImg(product.variants[0]?.image);
    //   const price = getNumber(product.variants[0]?.price);
    //   const originalPrice = getNumber(product.variants[0]?.originalPrice);
    //   const discountPercentage = getNumber(
    //     ((originalPrice - price) / originalPrice) * 100
    //   );
    //   setDiscount(getNumber(discountPercentage));
    //   setPrice(price);
    //   setOriginalPrice(originalPrice);
    // } else {
    setStock(product?.stock ?? 0);
    setImg(product?.image?.[0]);
    const price = getNumber(product?.Price ?? product?.prices?.price ?? product?.LastPurPrc ?? 0);
    const originalPrice = getNumber(product?.Price ?? product?.prices?.originalPrice ?? product?.AvgPrice ?? price);
    const discountPercentage = getNumber(
      ((originalPrice - price) / originalPrice) * 100
    );
    setDiscount(getNumber(discountPercentage));
    setPrice(price);
    setOriginalPrice(originalPrice);
    // }
  }, [
    product?.prices?.discount,
    product?.prices?.originalPrice,
    product?.prices?.price,
    product?.Price,
    product?.stock,
    product.variants,
    selectVa,
    selectVariant,
    value,
    product?.OnHand,
    product?.LastPurPrc,
    product?.AvgPrice,
  ]);

  // קביעת שם הגרסת מוצר
  // useEffect(() => {
  //   const res = Object.keys(Object.assign({}, ...(product?.variants || [{}])));

  //   const varTitle = attributes?.filter((att) => res.includes(att?._id));

  //   setVariantTitle(varTitle?.sort());
  // }, [variants, attributes]);

  useEffect(() => {
    setIsLoading(false);
  }, [product]);

  const handleAddToCart = (p) => {
    // if (p.variants.length === 1 && p.variants[0].quantity < 1)
    //   return notifyError(t("common:productStockOut"));
    // if (notAvailable) return notifyError('This Variation Not Available Now!');

    // const arrivalDate = product?.purchaseOrderInfo?.arrivalDate ? dayjs(product?.purchaseOrderInfo?.arrivalDate).format("DD/MM/YYYY") : null;
    // if (!inStock) return notifyError(arrivalDate ? t("common:productStockOutUntil", { date: arrivalDate }) : t("common:productStockOutNow"));

    // console.log('selectVariant', selectVariant);

    // if (
    //   product?.variants?.map(
    //     (variant) =>
    //       Object.entries(variant).sort().toString() ===
    //       Object.entries(selectVariant).sort().toString()
    //   )
    // ) {
    //   const { variants, categories, description, ...updatedProduct } = product;
    //   const newItem = {
    //     ...updatedProduct,
    //     id: `${p.variants.length <= 1
    //       ? (p._id ?? p.ItemCode)
    //       : (p._id ?? p.ItemCode) +
    //       variantTitle
    //         ?.map(
    //           // (att) => selectVariant[att.title.replace(/[^a-zA-Z0-9]/g, '')]
    //           (att) => selectVariant[att._id]
    //         )
    //         .join("-")
    //       }`,

    //     title: p.variants.length <= 1
    //       ? product.title
    //       : {
    //         he: product.title.he +
    //           "-" +
    //           variantTitle
    //             ?.map(
    //               // (att) => selectVariant[att.title.replace(/[^a-zA-Z0-9]/g, '')]
    //               (att) =>
    //                 att.variants?.find((v) => v._id === selectVariant[att._id])
    //             )
    //             .map((el) => el?.name),
    //         en: product.title.en +
    //           "-" +
    //           variantTitle
    //             ?.map(
    //               // (att) => selectVariant[att.title.replace(/[^a-zA-Z0-9]/g, '')]
    //               (att) =>
    //                 att.variants?.find((v) => v._id === selectVariant[att._id])
    //             )
    //             .map((el) => el?.name)
    //       },
    //     image: img,
    //     variant: selectVariant,
    //     price: price,
    //     originalPrice: originalPrice,
    //   };
    //   handleAddItem(newItem);
    // } else {
    //   return notifyError("Please select all variant first!");
    // }

    const newItem = {
      ...p,
      id: p._id ?? p.ItemCode ?? p.slug,
      title: p.ItemName ? p.ItemName : showingTranslateValue(p.title),
      image: img,
      price: price,
      originalPrice: originalPrice,
      variant: {},
    };
    handleAddItem(newItem);
  };

  const handleChangeImage = (img) => {
    setImg(img);
  };

  const { t } = useTranslation();

  // category name slug
  // const categoryName = showingTranslateValue(product?.category?.name)
  //   .toLowerCase()
  // .replace(/[^A-Z0-9]+/gi, "-");

  const productCategoryIds = Array.isArray(product?.categories) ? product.categories.map(c => c?._id ?? c) : [];
  const allCategories = categories ?? [];
  const category = allCategories.find(
    (cat) => productCategoryIds.includes(cat._id) || productCategoryIds.includes(cat.slug) || productCategoryIds.includes(cat.code)
  ) ?? null;
  const subCategory = allCategories
    .flatMap((cat) => cat.children ?? [])
    .find(
      (child) => productCategoryIds.includes(child._id) || productCategoryIds.includes(child.slug) || productCategoryIds.includes(child.code)
    ) ?? null;
  const catHref = category?.slug ?? category?.code ?? category?._id;
  const subCatHref = subCategory?.slug ?? subCategory?.code ?? subCategory?._id;

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout
          title={product?.ItemName ?? showingTranslateValue(product?.title)}
          description={showingTranslateValue(product.description)}
        >
          <div className="px-0 py-10 lg:py-10">
            <div className="mx-auto px-3 lg:px-10 max-w-screen-2xl">
              <div className="flex items-center pb-4">
                <ol className="flex items-center w-full overflow-hidden font-serif">

                  <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-customRed font-semibold">
                    <Link href="/">{t("common:HOME")}</Link>
                  </li>

                  <li className="text-sm mt-[1px]">
                    {" "}
                    <FiChevronLeft />{" "}
                  </li>

                  {category?.name && (
                    <>
                      <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer hover:text-customRed font-semibold">
                        <Link href={`/category/${catHref}`} onClick={() => setIsLoading(!isLoading)}>
                          {showingTranslateValue(category.name)}
                        </Link>
                      </li>
                      <li className="text-sm mt-[1px]">
                        {" "}<FiChevronLeft />{" "}
                      </li>
                    </>
                  )}

                  {subCategory?.name && (
                    <>
                      <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer hover:text-customRed font-semibold">
                        <Link href={`/category/${catHref}?sub=${subCatHref}`} onClick={() => setIsLoading(!isLoading)}>
                          {showingTranslateValue(subCategory.name)}
                        </Link>
                      </li>
                      <li className="text-sm mt-[1px]">
                        {" "}<FiChevronLeft />{" "}
                      </li>
                    </>
                  )}

                  <li className="text-sm px-1 transition duration-200 ease-in ">
                    {product?.ItemName ?? showingTranslateValue(product?.title)}
                  </li>
                </ol>
              </div>
              <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10 rounded-lg p-4 sm:p-6 lg:p-10 bg-white">

                {/* Left: Image section */}
                <div className="lg:w-5/12 flex flex-col items-center justify-start flex-shrink-0">
                  {product.image?.[0] ? (
                    <div className="w-full h-[300px] sm:h-[380px] flex items-center justify-center select-none bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src={img || product.image?.[0]}
                        alt="product"
                        width={650}
                        height={650}
                        priority
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[300px] sm:h-[380px] flex items-center justify-center select-none bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                        width={650}
                        height={650}
                        alt="product Image"
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                  )}

                  {product?.image?.length > 1 && (
                    <div className="flex flex-row flex-wrap mt-3 pt-3 border-t border-gray-100 w-full">
                      <ImageCarousel
                        images={product.image}
                        handleChangeImage={handleChangeImage}
                      />
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-100 self-stretch flex-shrink-0" />
                <div className="block lg:hidden h-px w-full bg-gray-100" />

                {/* Right: Product info */}
                <div className="lg:w-7/12 flex flex-col min-w-0">

                  {/* Title + SKU */}
                  <div className="pb-4 border-b border-gray-100">
                    <h1 className="leading-snug text-xl md:text-2xl font-semibold font-serif text-gray-800 mb-2 break-words">
                      {product?.ItemName ?? showingTranslateValue(product?.title)}
                    </h1>
                    {(product?.sku || product?.ItemCode) && (
                      <p className="font-serif font-medium text-gray-400 text-sm">
                        {t("common:SKU")}:{" "}
                        <span className="font-bold text-gray-500">
                          {product?.sku ?? product?.ItemCode}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="py-4 border-b border-gray-100">
                    <Price
                      price={price}
                      product={product}
                      currency={currency}
                      originalPrice={originalPrice}
                    />
                  </div>

                  {/* Description */}
                  {product?.description && (
                    <div className="py-4 border-b border-gray-100 overflow-hidden">
                      <ProductDescription description={product.description} />
                    </div>
                  )}

                  {/* Add to cart */}
                  <div className="py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border h-11 border-gray-300">
                        <button
                          onClick={() => setItem(item - 1)}
                          disabled={item === 1}
                          className="flex items-center justify-center flex-shrink-0 h-full w-10 transition ease-in-out duration-300 focus:outline-none border-e border-gray-300 hover:text-gray-500"
                        >
                          <FiMinus />
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={9999}
                          value={item === 0 ? "" : item}
                          onChange={e => {
                            if (e.target.value === "") { setItem(0); return; }
                            let val = Number(e.target.value);
                            if (isNaN(val)) val = 1;
                            setItem(val);
                          }}
                          onBlur={e => {
                            let val = Number(e.target.value);
                            if (isNaN(val) || val < 1) val = 1;
                            if (val > 9999) val = 9999;
                            setItem(val);
                          }}
                          className="no-spinner font-semibold flex items-center justify-center h-full text-base text-heading w-14 sm:w-20 text-center outline-none"
                          style={{ MozAppearance: 'textfield' }}
                        />
                        <button
                          onClick={() => setItem(item + 1)}
                          className="flex items-center justify-center h-full flex-shrink-0 w-10 transition ease-in-out duration-300 focus:outline-none border-s border-gray-300 hover:text-gray-500"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <MainBT
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 h-11"
                      >
                        {t("common:addToCart")}
                      </MainBT>
                    </div>
                  </div>

                  {/* Category + Tags */}
                  <div className="pt-4 flex flex-col gap-2">
                    {(category?.name) && (
                      <div className="flex items-start gap-1 text-sm text-gray-700 flex-wrap">
                        <span className="font-serif font-semibold flex-shrink-0">
                          {t("common:category")}:
                        </span>
                        <ol className="flex items-center gap-1 font-serif flex-wrap">
                          <li>
                            <Link
                              href={`/category/${category?.slug ?? category?.code ?? category?._id}`}
                              className="text-gray-600 hover:text-customRed underline"
                              onClick={() => setIsLoading(!isLoading)}
                            >
                              {showingTranslateValue(category?.name)}
                            </Link>
                          </li>
                          {subCategory?.name && (
                            <>
                              <li className="flex items-center text-gray-400">
                                <FiChevronLeft />
                              </li>
                              <li>
                                <Link
                                  href={`/category/${category?.slug ?? category?.code ?? category?._id}?sub=${subCategory?.slug ?? subCategory?.code ?? subCategory?._id}`}
                                  className="text-gray-600 hover:text-customRed underline"
                                  onClick={() => setIsLoading(!isLoading)}
                                >
                                  {showingTranslateValue(subCategory.name)}
                                </Link>
                              </li>
                            </>
                          )}
                        </ol>
                      </div>
                    )}
                    <Tags product={product} />
                  </div>
                </div>
              </div>

              <ProductRichDescription product={product} />

              {/* related products */}
              {relatedProducts?.length >= 2 && (
                <div className="pt-10 lg:pt-10 lg:pb-10">
                  {/* <h3 className="leading-7 text-lg lg:text-xl mb-3 font-semibold font-serif hover:text-gray-600">
                    {t("common:relatedProducts")}
                  </h3> */}
                  {/* <img src={relatedTitle.src} alt="Related products" className="h-24 mx-auto animate-fadeIn" /> */}
                  <ShapiraTitle text={t("common:relatedProducts")} height={70} key={t("common:relatedProducts")} />
                  <div className="flex mt-5">
                    <div className="w-full">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                        {relatedProducts?.slice(1, 13).map((product, i) => (
                          <ProductCard
                            key={(product._id ?? product.ItemCode) + i}
                            product={product}
                            attributes={attributes}
                            offers={offers}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

// you can use getServerSideProps alternative for getStaticProps and getStaticPaths
export const getServerSideProps = async (context) => {
  const { slug } = context.params;
  const { cookies } = context.req;

  const token = cookies.userInfo ? JSON.parse(cookies.userInfo).token : null;

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      slug: slug,
      token,
    }),
    AttributeServices.getShowingAttributes({}),
  ]);

  const product = data?.products?.find(p => p.slug === slug) ?? data?.products?.[0];
  const relatedProducts = data?.relatedProducts || data?.products?.filter(p => p.slug !== slug) || [];

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product,
      attributes,
      relatedProducts,
    },
  };
};

export default ProductScreen;