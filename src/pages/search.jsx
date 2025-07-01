// src/pages/search.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

// Internal import
import Layout from "@layout/Layout";
import useFilter from "@hooks/useFilter";
import ProductServices from "@services/ProductServices";
import ProductCard from "@component/product/ProductCard";
import { SidebarContext } from "@context/SidebarContext";
import Loading from "@component/preloader/Loading";
import AttributeServices from "@services/AttributeServices";
import { useRouter } from "next/router";
import { UserContext } from "@context/UserContext";
import SortDropdown from "@component/common/SortDropdown";

// אם תרצה (לא חובה), תוכל להוסיף כאן import לתמונות כמו fruitTitle, etc.

const Search = () => {
  const { t } = useTranslation();
  const { isLoading, setIsLoading, offers } = useContext(SidebarContext);
  const { state: { userInfo } } = useContext(UserContext);

  // שמירה של כל המוצרים שכבר נטענו
  const [allProducts, setAllProducts] = useState([]);
  console.log('allProducts: ', allProducts);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [totalDoc, setTotalDoc] = useState(0);

  // ניהול טעינת עמודים
  const [page, setPage] = useState(1);
  const [sapSkip, setSapSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const { query: queryValue } = router.query;

  // עבור סינון/Mixing מקומי
  const { productData, setSortedField, sortedField } = useFilter(allProducts);

  const observerTarget = useRef(null);

  // משיכת עמוד נוסף של מוצרים מהשרת
  const handleLoadMore = async () => {
    if (isLoadMore || !hasMore) return;
    setIsLoadMore(true);
    const nextPage = page + 1;

    try {
      const res = await ProductServices.getProductsByTitle({
        title: queryValue,
        limit: 36,
        page: nextPage,
        sapSkip: sapSkip,
        token: userInfo?.token,
      });

      // אם בפועל חזרו מוצרים
      if (res?.products?.length > 0) {
        // מוסיפים את המוצרים החדשים למערך
        setAllProducts(prev => [...prev, ...res.products]);
        setPage(nextPage);
        setSapSkip(res.nextSapSkip ?? 0);

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
    const fetchInitialData = async () => {
      if (!queryValue) return;

      setIsInitialLoading(true);
      setPage(1);
      setAllProducts([]); // נקה מוצרים קודמים מיידי

      try {
        // טען מוצרים ו-attributes במקביל
        const [productsRes, attributesRes] = await Promise.all([
          ProductServices.getProductsByTitle({
            title: queryValue,
            page: 1,
            limit: 36,
            sapSkip: 0,
            token: userInfo?.token,
          }),
          AttributeServices.getShowingAttributes({})
        ]);

        setAllProducts(productsRes?.products || []);
        setAttributes(attributesRes || []);
        setTotalDoc(productsRes?.totalDoc || 0);
        setSapSkip(productsRes.nextSapSkip ?? 0);
        setHasMore(productsRes?.products?.length === 36);
      } catch (err) {
        console.error("Fetch initial data error: ", err);
        setAllProducts([]);
        setHasMore(false);
      } finally {
        setIsInitialLoading(false);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [queryValue, userInfo?.token]);

  useEffect(() => {
    if (!hasMore || isLoadMore || isInitialLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadMore, page, allProducts, isInitialLoading]);

  return (
    <Layout title={queryValue || t("common:search")} description={t("common:searchPageDesc")}>
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="flex py-5">
          <div className="flex w-full">
            <div className="w-full">
              {/* מידע על תוצאות החיפוש - מוצג מיידי אם יש query */}
              {queryValue && !isInitialLoading && (
                <div className="flex justify-between items-center my-3 bg-customRed-superLight border border-gray-100 rounded-lg p-3">
                  <h6 className="text-sm font-serif">
                    {t("common:totalI")}{" "}
                    <span className="font-bold">{totalDoc}{hasMore ? "+" : ""}</span>{" "}
                    {t("common:itemsFound")}
                  </h6>

                  {/* הוספת רכיב המיון */}
                  {!isInitialLoading && productData?.length > 0 && (
                    <div className="flex justify-end">
                      <SortDropdown
                        sortedField={sortedField}
                        setSortedField={setSortedField}
                      />
                    </div>
                  )}
                </div>
              )}


              {isInitialLoading ? (
                // ספינר רק בטעינה ראשונית
                <Loading loading={isInitialLoading} />
              ) : productData?.length === 0 ? (
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
                <>
                  <div
                    className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3 ${productData?.length < 6 ? "justify-center" : ""
                      }`}
                    style={{
                      gridTemplateColumns: typeof window !== "undefined" && window.innerWidth < 640
                        ? `repeat(2, minmax(150px, 1fr))` // למסכים קטנים תמיד יהיה repeat של 2
                        : productData?.length < 6
                          ? `repeat(${Math.min(productData?.length, 6)}, minmax(150px, 235px))`
                          : '',
                    }}
                  >
                    {productData?.map((product, i) => (
                      <div key={product.ItemCode + i}>
                        <ProductCard
                          product={product}
                          attributes={attributes}
                          offers={offers}
                        />
                      </div>
                    ))}
                  </div>

                  <div ref={observerTarget} />

                  {/* שיפור אלמנט המעקב */}
                  <div
                    className="w-full py-4 mt-4"
                    style={{ minHeight: '100px' }}
                  >
                    {isLoadMore && <Loading loading={isLoadMore} />}
                  </div>
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