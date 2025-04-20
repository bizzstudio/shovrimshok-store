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

//internal import
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

const ProductScreen = ({ product, attributes, relatedProducts }) => {
  const router = useRouter();

  const { lang, showingTranslateValue, getNumber, currency } = useUtilsFunction();

  const { isLoading, setIsLoading, offers, categories } = useContext(SidebarContext);
  const { handleAddItem, item, setItem } = useAddToCart();

  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectVariant, setSelectVariant] = useState({});
  const [isReadMore, setIsReadMore] = useState(true);
  const [selectVa, setSelectVa] = useState({});
  const [variantTitle, setVariantTitle] = useState([]);
  const [variants, setVariants] = useState([]);

  const { items } = useCart();
  const [offerTitle, setOfferTitle] = useState();

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
    setStock(product?.OnHand ?? product?.stock ?? 0);
    setImg(product?.image?.[0]);
    const price = getNumber(product?.prices?.price ?? product?.LastPurPrc ?? 0);
    const originalPrice = getNumber(product?.prices?.originalPrice ?? product?.AvgPrice ?? price);
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
    if (stock <= 0) return notifyError(t("common:productStockOut"));
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
      id: p.ItemCode,
      title: p.ItemName ? p.ItemName : showingTranslateValue(p.title),
      image: img,
      price: price,
      originalPrice: originalPrice,
      variant: {}, // אפשר להשאיר ריק
    };
    handleAddItem(newItem);
  };

  const handleChangeImage = (img) => {
    setImg(img);
  };

  const { t } = useTranslation();

  // category name slug
  // const category_name = showingTranslateValue(product?.category?.name)
  //   .toLowerCase()
  // .replace(/[^A-Z0-9]+/gi, "-");

  const categoryId = product?.ItemCode?.slice(0, 4);
  const category_name = categories?.find((cat) => cat.code === categoryId)?.name;

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
                  <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer hover:text-customRed font-semibold ">
                    <Link
                      href={`/category/${categoryId}`}
                    // href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                    >
                      <button
                        type="button"
                        onClick={() => setIsLoading(!isLoading)}
                      >
                        {category_name}
                      </button>
                    </Link>
                  </li>
                  <li className="text-sm mt-[1px]">
                    {" "}
                    <FiChevronLeft />{" "}
                  </li>
                  <li className="text-sm px-1 transition duration-200 ease-in ">
                    {product?.ItemName ?? showingTranslateValue(product?.title)}
                  </li>
                </ol>
              </div>
              {/* <div className="rounded-lg p-3 lg:p-12 bg-white"> */}
              <div className="w-full flex flex-col items-center justify-center lg:flex-row rounded-lg p-3 lg:p-12 bg-white">
                <div className="max-w-lg flex-shrink-0 lg:block md:w-6/12">
                  <Discount slug product={product} discount={discount} title={offerTitle}
                  // title={product.isCombination ? (selectVariant?.offers?.length > 0 ? (
                  //   selectVariant.offers.reduce((title, obj) => (
                  //     <>
                  //       {title}
                  //       {title && <br />}
                  //       {obj.name}
                  //     </>
                  //   ), null)
                  // ) : '') : (product?.prices?.offers?.length > 0 ? (
                  //   product?.prices?.offers.reduce((title, obj) => (
                  //     <>
                  //       {title}
                  //       {title && <br />}
                  //       {obj.name}
                  //     </>
                  //   ), null)
                  // ) : '')}
                  />

                  {product.image?.[0] ? (
                    <Image
                      src={img || product.image?.[0]}
                      alt="product"
                      width={650}
                      height={650}
                      priority
                      className="max-h-[400px] object-contain"
                    />
                  ) : (
                    <Image
                      src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                      width={650}
                      height={650}
                      alt="product Image"
                    />
                  )}

                  {product?.image?.length > 1 && (
                    <div className="flex flex-row flex-wrap mt-4 border-t">
                      <ImageCarousel
                        images={product.image}
                        handleChangeImage={handleChangeImage}
                      />
                    </div>
                  )}
                </div>

                {/* <div className="w-full"> */}
                <div className="flex flex-col md:flex-row md:w-1/2 lg:flex-row lg:w-1/2 xl:flex-row xl:w-1/2">
                  <div className="xl:pr-6 md:pr-6 w-full">
                    <div className="mb-3">
                      <h1 className="leading-7 text-lg md:text-xl lg:text-2xl mb-1 font-semibold font-serif text-gray-800">
                        {product?.ItemName ?? showingTranslateValue(product?.title)}
                      </h1>

                      <p className="uppercase font-serif font-medium text-gray-500 text-sm">
                        {t("common:SKU")} :{" "}
                        <span className="font-bold text-gray-600">
                          {product?.ItemCode ?? product.sku}
                        </span>
                      </p>

                      <div className="pt-2">
                        <Stock stock={stock} card={false} />
                      </div>
                    </div>

                    {/* מחיר */}
                    {/* <Price
                      price={price}
                      product={product}
                      currency={currency}
                      originalPrice={originalPrice}
                    /> */}

                    {/* אופציות מוצר (גדול קטן בינוני וכו') */}
                    {/* <div className="mb-4">
                      {variantTitle?.map((a, i) => (
                        <span key={a._id}>
                          <h4 className="text-sm py-1">
                            {showingTranslateValue(a?.name)}:
                          </h4>
                          <div className="flex flex-row items-center justify-center gap-2 w-fit mb-3">
                            <VariantList
                              att={a._id}
                              lang={lang}
                              option={a.option}
                              setValue={setValue}
                              varTitle={variantTitle}
                              variants={product?.variants}
                              setSelectVa={setSelectVa}
                              selectVariant={selectVariant}
                              setSelectVariant={setSelectVariant}
                            />
                          </div>
                        </span>
                      ))}
                    </div> */}

                    <div>
                      {showingTranslateValue(product?.description) &&
                        <div className="text-sm leading-6 text-gray-500 md:leading-7">
                          {isReadMore
                            ? <>{showingTranslateValue(
                              product?.description
                            )?.slice(0, 220)}{product?.description[lang]?.length > 220 && '...'}</>
                            : showingTranslateValue(product?.description)}
                          <br />
                          {Object?.keys(product?.description)?.includes(lang)
                            ? product?.description[lang]?.length > 230 && (
                              <span
                                onClick={() => setIsReadMore(!isReadMore)}
                                className="read-or-hide"
                              >
                                {isReadMore
                                  ? t("common:moreInfo")
                                  : t("common:showLess")}
                              </span>
                            )
                            : product?.description?.en?.length > 230 && (
                              <span
                                onClick={() => setIsReadMore(!isReadMore)}
                                className="read-or-hide"
                              >
                                {isReadMore
                                  ? t("common:moreInfo")
                                  : t("common:showLess")}
                              </span>
                            )}
                        </div>}

                      <div className="flex items-center mt-4">
                        <div className="flex items-center justify-start space-s-3 sm:space-s-4 w-full gap-3">
                          <div className="group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border h-11 md:h-12 border-gray-300">
                            <button
                              onClick={() => setItem(item - 1)}
                              disabled={item === 1}
                              className="flex items-center justify-center flex-shrink-0 h-full transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-e border-gray-300 hover:text-gray-500"
                            >
                              <span className="text-dark text-base">
                                <FiMinus />
                              </span>
                            </button>
                            <p className="font-semibold flex items-center justify-center h-full  transition-colors duration-250 ease-in-out cursor-default flex-shrink-0 text-base text-heading w-8  md:w-20 xl:w-24">
                              {item}
                            </p>
                            <button
                              onClick={() => setItem(item + 1)}
                              // disabled={selectVariant?.quantity <= item}
                              disabled={stock <= item}
                              className="flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-s border-gray-300 hover:text-gray-500"
                            >
                              <span className="text-dark text-base">
                                <FiPlus />
                              </span>
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-white px-4 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 hover:text-white bg-customRed hover:bg-customRed-dark w-full h-12"
                          >
                            {t("common:addToCart")}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col mt-4">
                        <span className="font-serif font-semibold py-1 text-sm d-block">
                          <span className="text-gray-800">
                            {t("common:category")}:
                          </span>{" "}
                          <Link
                            href={`/category/${categoryId}`}
                          // href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                          >
                            <button
                              type="button"
                              className="text-gray-600 font-serif font-medium underline ml-2 hover:text-teal-600"
                              onClick={() => setIsLoading(!isLoading)}
                            >
                              {category_name}
                            </button>
                          </Link>
                        </span>
                        <Tags product={product} />
                      </div>

                      {/* <div className="mt-8">
                        <p className="text-xs sm:text-sm text-gray-700 font-medium">
                          Call Us To Order By Mobile Number :{" "}
                          <span className="text-customRed-dark font-semibold">
                            +0044235234
                          </span>{" "}
                        </p>
                      </div> */}

                      {/* social share */}
                      <div className="mt-2">
                        {/* <h3 className="text-base font-semibold mb-1 font-serif">
                          {t("common:shareYourSocial")}
                        </h3> */}
                        {/* <p className="font-sans text-sm text-gray-500">
                          {t("common:shareYourSocialText")}
                        </p> */}
                        {/* <ul className="flex gap-2 mt-4">
                          <li className="flex items-center text-center border border-gray-100 rounded-full hover:bg-customRed transition ease-in-out duration-500">
                            <FacebookShareButton
                              url={`https://אחים שפירא-store-nine.vercel.app/product/${router.query.slug}`}
                              quote=""
                            >
                              <FacebookIcon size={32} round />
                            </FacebookShareButton>
                          </li>
                          <li className="flex items-center text-center border border-gray-100 rounded-full hover:bg-customRed transition ease-in-out duration-500">
                            <TwitterShareButton
                              url={`https://אחים שפירא-store-nine.vercel.app/product/${router.query.slug}`}
                              quote=""
                            >
                              <TwitterIcon size={32} round />
                            </TwitterShareButton>
                          </li>
                          <li className="flex items-center text-center border border-gray-100 rounded-full hover:bg-customRed transition ease-in-out duration-500">
                            <RedditShareButton
                              url={`https://אחים שפירא-store-nine.vercel.app/product/${router.query.slug}`}
                              quote=""
                            >
                              <RedditIcon size={32} round />
                            </RedditShareButton>
                          </li>
                          <li className="flex items-center text-center border border-gray-100 rounded-full hover:bg-customRed transition ease-in-out duration-500">
                            <WhatsappShareButton
                              url={`https://אחים שפירא-store-nine.vercel.app/product/${router.query.slug}`}
                              quote=""
                            >
                              <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                          </li>
                          <li className="flex items-center text-center border border-gray-100 rounded-full hover:bg-customRed transition ease-in-out duration-500">
                            <LinkedinShareButton
                              url={`https://אחים שפירא-store-nine.vercel.app/product/${router.query.slug}`}
                              quote=""
                            >
                              <LinkedinIcon size={32} round />
                            </LinkedinShareButton>
                          </li>
                        </ul> */}
                      </div>
                    </div>
                  </div>

                  {/* shipping description card */}

                  {/* <div className="w-full xl:w-5/12 lg:w-6/12 md:w-5/12">
                        <div className="mt-6 md:mt-0 lg:mt-0 bg-gray-50 border border-gray-100 p-4 lg:p-8 rounded-lg">
                          <Card />
                        </div>
                      </div> */}
                </div>
                {/* </div> */}
                {/* </div> */}
              </div>

              {/* related products */}
              {relatedProducts?.length >= 2 && (
                <div className="pt-10 lg:pt-10 lg:pb-10">
                  {/* <h3 className="leading-7 text-lg lg:text-xl mb-3 font-semibold font-serif hover:text-gray-600">
                    {t("common:relatedProducts")}
                  </h3> */}
                  <img src={relatedTitle.src} alt="Related products" className="h-24 mx-auto animate-fadeIn" />
                  <div className="flex">
                    <div className="w-full">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                        {relatedProducts?.slice(1, 13).map((product, i) => (
                          <ProductCard
                            key={(product._id ?? product.ItemCode)}
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

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      itemCode: slug,
      subcategories: slug.slice(0, 8), // תת הקטגוריה של המוצר
      limit: 13, // כדי שיהיה מקום ל־related
    }),
    AttributeServices.getShowingAttributes({}),
  ]);

  const product = data?.products?.find(p => p.ItemCode === slug);
  const relatedProducts = data?.products?.filter(p => p.ItemCode !== slug);

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