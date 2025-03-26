// src/pages/search.jsx
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

//internal import
import Layout from "@layout/Layout";
import useFilter from "@hooks/useFilter";
import ProductServices from "@services/ProductServices";
import ProductCard from "@component/product/ProductCard";
import { SidebarContext } from "@context/SidebarContext";
import Loading from "@component/preloader/Loading";
import AttributeServices from "@services/AttributeServices";
import { useRouter } from "next/router";

// אם תרצה (לא חובה), תוכל להוסיף כאן import לתמונות כמו fruitTitle, etc.

const Search = ({ products, attributes, totalDoc }) => {
  const { t } = useTranslation();
  const { isLoading, setIsLoading, offers } = useContext(SidebarContext);

  // שמירה של כל המוצרים שכבר נטענו (כמו בקטגוריה)
  const [allProducts, setAllProducts] = useState(products || []);
  const [isLoadMore, setIsLoadMore] = useState(false);
  console.log('all Products :>> ', allProducts);

  // ניהול טעינת עמודים
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const { query: queryValue } = router.query;

  // עבור סינון/Mixing מקומי
  const { productData } = useFilter(allProducts);

  // כיבוי ספינר ראשוני
  useEffect(() => {
    setIsLoading(false);
  }, [products, setIsLoading]);

  // משיכת עמוד נוסף של מוצרים מהשרת
  const handleLoadMore = async () => {
    setIsLoadMore(true);
    const nextPage = page + 1;

    try {
      const res = await ProductServices.getProductsByTitle({
        title: queryValue,
        limit: 36,
        page: nextPage
      });

      // אם בפועל חזרו מוצרים
      if (res?.products?.length > 0) {
        // מוסיפים את המוצרים החדשים למערך
        setAllProducts(prev => [...prev, ...res.products]);
        setPage(nextPage);

        if (res.products.length < 36) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Load more failed:", error);
      setHasMore(false);
    } finally {
      setIsLoadMore(false);
    }
  };

  // משיכת המוצרים בעת שינוי חיפוש
  useEffect(() => {
    const fetchProducts = async () => {
      if (!queryValue) return;

      setIsLoading(true);
      setPage(1); // התחלה מחדש
      try {
        const res = await ProductServices.getProductsByTitle({
          title: queryValue,
          page: 1,
          limit: 36,
        });

        setAllProducts(res?.products || []);
        setHasMore(res?.products?.length === 36); // אם יש פחות מ־36, אין עוד עמוד
      } catch (err) {
        console.error("Reload products error: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [queryValue]);

  return (
    <Layout title={queryValue || t("common:search")} description={t("common:searchPageDesc")}>
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="flex py-5">
          <div className="flex w-full">
            <div className="w-full">
              {/* אם אין תוצאות */}
              {productData?.length === 0 ? (
                <div className="flex flex-col items-center text-center align-middle mx-auto p-5 my-5">
                  <Image
                    className="my-4"
                    src="/no-result.svg"
                    alt="no-result"
                    width={400}
                    height={380}
                  />
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-center mt-2 font-medium font-serif text-gray-600">
                    {t("common:sorryText")}
                  </h2>
                </div>
              ) : (
                <div className="flex justify-between my-3 bg-customBrown-light border border-gray-100 rounded p-3">
                  <h6 className="text-sm font-serif">
                    {t("common:totalI")}{" "}
                    <span className="font-bold">{totalDoc}</span>{" "}
                    {t("common:itemsFound")}
                  </h6>
                  {/* מיון על פי מחיר, כרגע בהערה */}
                  {/* <span className="text-sm font-serif">
                    <select
                      onChange={(e) => setSortedField(e.target.value)}
                      className="py-0 text-sm font-serif font-medium block w-full rounded border-0 bg-white pr-10 cursor-pointer focus:ring-0"
                    >
                      <option className="px-3" value="All" defaultValue hidden>
                        {t("common:sortByPrice")}
                      </option>
                      <option className="px-3" value="Low">
                        {t("common:lowToHigh")}
                      </option>
                      <option className="px-3" value="High">
                        {t("common:highToLow")}
                      </option>
                    </select>
                  </span> */}
                </div>
              )}

              {isLoading && page === 1 ? (
                // ספינר אם אנחנו עדיין בטעינה של העמוד הראשון
                <Loading loading={isLoading} />
              ) : (
                <>
                  <div
                    className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3 ${productData?.length < 6 ? "justify-center" : ""
                      }`}
                    style={{
                      gridTemplateColumns: window.innerWidth < 640
                        ? `repeat(2, minmax(150px, 1fr))` // למסכים קטנים תמיד יהיה repeat של 2
                        : productData?.length < 6
                          ? `repeat(${Math.min(productData?.length, 6)}, minmax(150px, 235px))`
                          : '',
                    }}
                  >

                    {productData?.map((product, i) => (
                      <ProductCard
                        key={i + 1}
                        product={product}
                        attributes={attributes}
                        offers={offers}
                      />
                    ))}
                  </div>

                  {/* כפתור "Load More" */}
                  {hasMore && productData?.length > 0 && (
                    isLoadMore ? (
                      <Loading loading={isLoadMore} />
                    ) : (
                      <button
                        onClick={handleLoadMore}
                        className="w-auto mx-auto mt-6 flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                      >
                        {t("common:loadMoreBtn")}
                      </button>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;

// טעינה ראשונית מהשרת (page=1, limit=36)
export const getServerSideProps = async (context) => {
  const { query } = context;
  const searchQuery = query?.query || "";

  const [data, attributes] = await Promise.all([
    ProductServices.getProductsByTitle({
      title: searchQuery,
      page: 1,
      limit: 36,
    }),
    AttributeServices.getShowingAttributes({}),
  ]);

  return {
    props: {
      products: data?.products || [],
      totalDoc: data?.totalDoc || 0,
      attributes,
    },
  };
};