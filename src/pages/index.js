// shapira-store/src/pages/index.js
import { SidebarContext } from "@context/SidebarContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";

// Internal import
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
import HomeFAQ from "@component/faq/HomeFAQ";
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
  const [fakeLoading, setFakeLoading] = useState(false);

  useEffect(() => {
    const fakeLoadingSession = sessionStorage.getItem("fakeLoading");
    if (fakeLoadingSession === "true") {
      setFakeLoading(true);
    } else {
      setTimeout(() => {
        setFakeLoading(true);
        sessionStorage.setItem("fakeLoading", "true");
      }, 2000);
    }
  }, []);

  useEffect(() => {
    if (router.asPath === "/") {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [router]);

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

  if (
    storeCustomizationSetting?.home?.popular_products_status &&
    popularProducts &&
    discountProducts &&
    attributes &&
    Array.isArray(offers) &&
    fakeLoading
  ) {
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
                      {storeCustomizationSetting?.home?.small_banner_img ? (
                        <Image
                          src={storeCustomizationSetting?.home?.small_banner_img}
                          alt="small banner"
                          width={300}
                          height={carouselHeight}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <OfferCard
                          discountProducts={discountProducts}
                          height={carouselHeight}
                          attributes={attributes}
                        />
                      )}
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
                    {storeCustomizationSetting?.home?.feature_title?.he && (
                      <div className="mb-10 flex justify-center">
                        <div className="text-center w-full lg:w-2/5">
                          <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                            <CMSkeleton
                              count={1}
                              height={30}
                              loading={loading}
                              data={storeCustomizationSetting?.home?.feature_title}
                            />
                          </h2>
                          {storeCustomizationSetting?.home?.feature_description?.he && (
                            <div className="text-base font-sans text-gray-600 leading-6">
                              <CMSkeleton
                                count={4}
                                height={10}
                                error={error}
                                loading={loading}
                                data={storeCustomizationSetting?.home?.feature_description}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <FeatureCategory />

                    {storeCustomizationSetting?.faq?.title && (
                      <HomeFAQ faqSettings={storeCustomizationSetting?.faq} />
                    )}
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

              {/* שאר הסקשנים נשארים בדיוק כמו בקוד שלך... */}
              {/* popular products */}
              {/* delivery banner */}
              {/* discount products */}
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

  const [data, attributes, popularProductsData] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: _id ? _id : "",
      title: query ? query : "",
    }),
    AttributeServices.getShowingAttributes(),
    ProductServices.getPopularProducts(),
  ]);

  return {
    props: {
      popularProducts: popularProductsData.products || [],
      discountProducts: data.products,
      cookies,
      attributes,
    },
  };
};

export default Home;
