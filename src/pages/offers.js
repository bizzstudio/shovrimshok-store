import { SidebarContext } from "@context/SidebarContext";
import { useContext } from "react";

//internal import
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import Loading from "@component/preloader/Loading";
import ProductServices from "@services/ProductServices";
import ProductCard from "@component/product/ProductCard";
import AttributeServices from "@services/AttributeServices";
import CMSkeleton from "@component/preloader/CMSkeleton";
import ourOffers from "public/titles/ourOffers.svg"
import OfferServices from "@services/OfferServices";
import useAsync from "@hooks/useAsync";

const Offers = ({ discountProducts, attributes }) => {
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { loading, error, storeCustomizationSetting } = useGetSetting();
  const { data: offers } = useAsync(() => OfferServices.getAllOffers());

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout>
          <div className="min-h-screen">
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
                      <p className="text-base font-sans text-gray-600 leading-6">
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
                      </p>
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
                          {discountProducts.map((product) => (
                            <ProductCard
                              key={product._id}
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

  // שינוי המוצרים במבצע למוצרים עם מבצעי הצעות במקום מבצעים של סתם מחיר זול יותר
  const sortedDiscountProducts = data.productsWithOffers;
  // const sortedDiscountProducts = sortProducts(data.productsWithOffers);
  // const sortedDiscountProducts = sortProducts(data.discountedProducts);

  return {
    props: {
      discountProducts: sortedDiscountProducts,
      cookies: cookies,
      attributes,
    },
  };
};

export default Offers;
