// shapira-store/src/pages/index.js
import { SidebarContext } from "@context/SidebarContext";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";

//internal import
import Layout from "@layout/Layout";
import Banner from "@component/banner/Banner";
import useGetSetting from "@hooks/useGetSetting";
import CardTwo from "@component/cta-card/CardTwo";
import OfferCard from "@component/offer/OfferCard";
import StickyCart from "@component/cart/StickyCart";
import Loading from "@component/preloader/Loading";
import ProductServices from "@services/ProductServices";
import ProductCard from "@component/product/ProductCard";
import MainCarousel from "@component/carousel/MainCarousel";
import FeatureCategory from "@component/category/FeatureCategory";
import AttributeServices from "@services/AttributeServices";
import CMSkeleton from "@component/preloader/CMSkeleton";
import ourOffers from "public/titles/ourOffers.svg";
import popolarTitle from "public/titles/popolarTitle.svg";
import logoGif from "public/shapira_loading_gif.gif";
import Image from "next/image";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";

const Home = ({ popularProducts, discountProducts, attributes }) => {
  const router = useRouter();
  const { isLoading, setIsLoading, offers } = useContext(SidebarContext);
  const { loading, error, storeCustomizationSetting } = useGetSetting();
  const [fakeLoading, setFakeLoading] = useState(false)

  useEffect(() => {
    const fakeLoadingSession = sessionStorage.getItem('fakeLoading');
    if (fakeLoadingSession === 'true') {
      setFakeLoading(true);
    } else {
      // שתי שניות של טעינה מזויפת בפעם הראשונה
      setTimeout(() => {
        setFakeLoading(true);
        sessionStorage.setItem('fakeLoading', 'true');
      }, 2000);
    }
  }, []);


  // רעיון לעתיד כותרות קופצות
  // const [showTitles, setShowTitles] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 100) {
  //       setShowTitles(true);
  //     } else {
  //       setShowTitles(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  // console.log("storeCustomizationSetting", storeCustomizationSetting);

  useEffect(() => {
    if (router.asPath === "/") {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // האזנה לגודל הקרוסלה וקביעת גובה הקונטיינר של המבצעים לאחר מכן
  const carouselRef = useRef(null);
  const [carouselHeight, setCarouselHeight] = useState(0);
  useEffect(() => {
    const updateCarouselHeight = () => {
      if (carouselRef.current) {
        setCarouselHeight(carouselRef.current.offsetHeight);
      }
    };

    if (fakeLoading) {
      updateCarouselHeight();

      const resizeObserver = new ResizeObserver(() => {
        updateCarouselHeight();
      });

      if (carouselRef.current) {
        resizeObserver.observe(carouselRef.current);
      }

      return () => {
        if (carouselRef.current) {
          resizeObserver.unobserve(carouselRef.current);
        }
      };
    }
  }, [fakeLoading, carouselRef.current]);

  if (storeCustomizationSetting?.home?.popular_products_status && popularProducts && discountProducts && attributes && Array.isArray(offers) && fakeLoading) {
    return (
      <>
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <Layout>
            <div className="min-h-screen">
              <div className="bg-white">
                <div className="mx-auto py-6 max-w-screen-2x1 px-3 sm:px-7">
                  <div className="w-full flex gap-8">
                    <div ref={carouselRef} className="2xl:w-[85%] w-full h-fit">
                      <MainCarousel />
                    </div>
                    <div className="w-full hidden lg:flex">
                      {storeCustomizationSetting?.home?.small_banner_img ?
                        <Image
                          src={storeCustomizationSetting?.home?.small_banner_img}
                          alt="small banner"
                          width={300}
                          // height={300}
                          height={carouselHeight}
                          className="w-full h-full object-cover"
                        /> :
                        <OfferCard
                          discountProducts={discountProducts}
                          // קבלת הגובה של הבאנר המתחלף (קרוסלה)
                          height={carouselHeight}
                          attributes={attributes}
                        />
                      }
                    </div>
                  </div>
                  {storeCustomizationSetting?.home?.promotion_banner_status && (
                    <div className="bg-gray-100 px-10 py-6 mt-6">
                      <Banner />
                    </div>
                  )}
                </div>
              </div>

              {/* feature category's */}
              {storeCustomizationSetting?.home?.featured_status && (
                <div className="bg-gray-100 lg:py-16 sm:py-11 py-3">
                  <div className="mx-auto max-w-screen-2x1 px-3 sm:px-10">
                    {storeCustomizationSetting?.home?.feature_title?.he &&
                      <div className="mb-10 flex justify-center">
                        <div className="text-center w-full lg:w-2/5">
                          {storeCustomizationSetting?.home?.feature_title?.he &&
                            <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                              <CMSkeleton
                                count={1}
                                height={30}
                                // error={error}
                                loading={loading}
                                data={storeCustomizationSetting?.home?.feature_title}
                              />
                            </h2>
                          }
                          {storeCustomizationSetting?.home?.feature_description?.he &&
                            <div className="text-base font-sans text-gray-600 leading-6">
                              <CMSkeleton
                                count={4}
                                height={10}
                                error={error}
                                loading={loading}
                                data={
                                  storeCustomizationSetting?.home?.feature_description
                                }
                              />
                            </div>
                          }
                        </div>
                      </div>
                    }

                    <FeatureCategory />
                  </div>
                </div>
              )}

              {/* logos_carousel */}
              {storeCustomizationSetting?.home?.logos_carousel_status && (
                <div className="bg-white lg:py-10 py-3 select-none">
                  <div className="mx-auto px-3 sm:px-24">
                    <Swiper
                      modules={[Autoplay]}
                      spaceBetween={30}
                      slidesPerView="auto"
                      loop={true}
                      speed={4000}
                      autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                        waitForTransition: false,
                      }}
                      allowTouchMove={false}
                      className="flex items-center"
                    >
                      {storeCustomizationSetting?.home?.logos_carousel?.map((logo, index) => (
                        <SwiperSlide
                          key={index}
                          className="w-auto flex items-center justify-center"
                          style={{ width: "150px" }}
                        >
                          <img
                            src={logo}
                            alt={`Logo ${index}`}
                            className="h-[70px] object-contain transition duration-300 select-none"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              )}

              {/* popular products */}
              {storeCustomizationSetting?.home?.popular_products_status && (
                <div className="bg-gray-50 lg:py-10 py-3 mx-auto max-w-screen-2xl px-3 sm:px-10">
                  {/* {showTitles && ( */}
                  <div className="lg:mt-4 mt-9 mb-3 flex justify-center animate-fadeIn">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl font-serif font-semibold">
                        {/* <CMSkeleton
                          count={1}
                          height={30}
                          // error={error}
                          loading={loading}
                          // data={storeCustomizationSetting?.home?.popular_title}
                          data={popolarTitle.src}
                          isIimage={true}
                        /> */}
                        <ShapiraTitle text={storeCustomizationSetting?.home?.popular_title} height={70} />
                      </h2>
                      <div className="text-base font-sans text-gray-600 leading-6">
                        <CMSkeleton
                          count={5}
                          height={10}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home?.popular_description
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/* )} */}
                  <div className="flex">
                    <div className="w-full">
                      {loading ? (
                        <CMSkeleton
                          count={20}
                          height={20}
                          error={error}
                          loading={loading}
                        />
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                          {popularProducts
                            ?.slice(
                              0,
                              storeCustomizationSetting?.home
                                ?.popular_product_limit
                            )
                            .map((product) => (
                              <ProductCard
                                key={(product._id ?? product.ItemCode)}
                                product={product}
                                attributes={attributes}
                                offers={offers}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* promotional banner card */}
              {storeCustomizationSetting?.home?.delivery_status && (
                // <div className="block mx-auto max-w-screen-2xl">
                <div className="w-full">
                  {/* <div className="lg:p-16 p-6 bg-customRed shadow-sm border rounded-lg"> */}
                  <CardTwo />
                  {/* </div> */}
                </div>
                // </div>
              )}

              {/* discounted products */}
              {storeCustomizationSetting?.home?.discount_product_status &&
                discountProducts?.length > 0 && (
                  <div
                    id="discount"
                    className="bg-gray-50 lg:py-10 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10"
                  >
                    <div className="mb-10 flex justify-center">
                      <div className="text-center w-full lg:w-2/5">
                        <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                          <CMSkeleton
                            count={1}
                            height={30}
                            // error={error}
                            loading={loading}
                            // data={
                            //   storeCustomizationSetting?.home
                            //     ?.latest_discount_title
                            // }
                            data={ourOffers.src}
                            isIimage={true}
                          />
                        </h2>
                        <div className="text-base font-sans text-gray-600 leading-6">
                          <CMSkeleton
                            count={5}
                            height={20}
                            // error={error}
                            loading={loading}
                            data={
                              storeCustomizationSetting?.home
                                ?.latest_discount_description
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-full">
                        {loading ? (
                          <CMSkeleton
                            count={20}
                            height={20}
                            error={error}
                            loading={loading}
                          />
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                            {discountProducts
                              ?.slice(
                                0,
                                storeCustomizationSetting?.home
                                  ?.latest_discount_product_limit
                              )
                              .map((product, index) => (
                                <ProductCard
                                  key={(product._id ?? product.ItemCode) + index}
                                  product={product}
                                  attributes={attributes}
                                  offers={offers}
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </Layout>
        )}
      </>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src={logoGif.src} alt="loading" className="m-auto w-[550px] max-w-[90%]" />
      </div>
    );
  }
};

export const getServerSideProps = async (context) => {
  const { cookies } = context.req;
  const { query, _id } = context.query;

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: _id ? _id : "",
      title: query ? query : "",
    }),

    AttributeServices.getShowingAttributes(),
  ]);

  console.log('data: ', data)

  // const sortedPopularProducts = sortProducts(data.popularProducts);
  const sortedPopularProducts = data.products;

  // שינוי המוצרים במבצע למוצרים עם מבצעי הצעות במקום מבצעים של סתם מחיר זול יותר
  const sortedDiscountProducts = data.products;
  // const sortedDiscountProducts = sortProducts(data.productsWithOffers);
  // const sortedDiscountProducts = sortProducts(data.discountedProducts);

  return {
    props: {
      popularProducts: sortedPopularProducts || [],
      discountProducts: sortedDiscountProducts || [],
      cookies: cookies,
      attributes,
    },
  };
};

export default Home;
