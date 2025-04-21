// shapira-store/pages/best-sellers.jsx
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

// internal import
import Layout from "@layout/Layout";
import useFilter from "@hooks/useFilter";
import ProductServices from "@services/ProductServices";
import AttributeServices from "@services/AttributeServices";

import ProductCard from "@component/product/ProductCard";
import { SidebarContext } from "@context/SidebarContext";
import Loading from "@component/preloader/Loading";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";

const BestSellersPage = ({ allProd, attributes }) => {
    const { t } = useTranslation();
    const { isLoading, setIsLoading, offers } = useContext(SidebarContext);

    // נשמור כאן את כל המוצרים מכל העמודים
    const [allProducts, setAllProducts] = useState(allProd || []);
    const [isLoadMore, setIsLoadMore] = useState(false);
    console.log('all Products :>> ', allProducts);

    // state לניהול page = עמוד נוכחי
    const [page, setPage] = useState(1);

    // האם יש עוד מוצרים בעמוד הבא?
    const [hasMore, setHasMore] = useState(true);

    // ודא שה‑spinner הראשי לא נתקע
    useEffect(() => setIsLoading(false), [allProducts, setIsLoading]);

    // מיון / סינון (לפי useFilter הקיים)
    const { productData } = useFilter(allProducts);

    const layoutTitle = t("common:bestSellers");

    // טעינת עמודים נוספים
    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setIsLoadMore(true);
        try {
            const res = await ProductServices.getShowingStoreProducts({
                page: nextPage,
            });
            // אם אין מוצרים בעמוד הבא, סוגרים hasMore
            if (!res.products || res.products.length < 36) {
                setHasMore(false);
            } else {
                // מוסיפים את המוצרים החדשים למערך
                setAllProducts([...allProducts, ...res.products]);
                setPage(nextPage);
            }
        } catch (err) {
            console.error("Load More error: ", err);
        } finally {
            setIsLoadMore(false);
        }
    };

    // רענון בעת פתיחת העמוד (או ריענון ידני בעתיד)
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setPage(1); // התחלה מחדש
            try {
                const res = await ProductServices.getShowingStoreProducts({
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
    }, []);

    return (
        <Layout title={layoutTitle} description="Best-sellers page">
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                <div className="flex py-5">
                    <div className="w-full">
                        {isLoading && page === 1 ? (
                            // ספינר ראשוני רק בעמוד הראשון
                            <Loading loading={isLoading} />
                        ) : productData?.length === 0 ? (
                            <div className="flex flex-col items-center text-center mx-auto p-5 my-5">
                                <Image
                                    className="my-4"
                                    src="/no-result.svg"
                                    alt="no-result"
                                    width={400}
                                    height={380}
                                />
                                <h2 className="text-lg md:text-xl lg:text-2xl font-medium font-serif text-gray-600">
                                    {t("common:sorryText")}
                                </h2>
                            </div>
                        ) : (
                            <>
                                {/* כותרת דינאמית עם תרגום / ברירת‑מחדל */}
                                <h2 className="text-center text-xl sm:text-2xl font-semibold mb-5 mt-6">
                                    <ShapiraTitle text={layoutTitle} height={70} key={layoutTitle} />
                                </h2>
                                <div
                                    className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3 ${productData?.length < 6 ? "justify-center" : ""
                                        }`}
                                    style={{
                                        gridTemplateColumns:
                                            typeof window !== "undefined" && window.innerWidth < 640
                                                ? `repeat(2, minmax(150px, 1fr))`
                                                : productData?.length < 6
                                                    ? `repeat(${Math.min(
                                                        productData?.length,
                                                        6
                                                    )}, minmax(150px, 235px))`
                                                    : "",
                                    }}
                                >
                                    {productData.map((product, i) => (
                                        <ProductCard
                                            key={product.ItemCode || i}
                                            product={product}
                                            attributes={attributes}
                                            offers={offers}
                                        />
                                    ))}
                                </div>

                                {hasMore && productData?.length > 0 && (
                                    isLoadMore ? (
                                        <Loading loading={isLoadMore} />
                                    ) : (
                                        <button
                                            onClick={handleLoadMore}
                                            className="w-auto mx-auto mt-6 flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
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
        </Layout>
    );
};

export default BestSellersPage;

/* ===============================
   =       getServerSideProps    =
   =============================== */
export const getServerSideProps = async () => {
    const [data, attributes] = await Promise.all([
        ProductServices.getShowingStoreProducts({
            page: 1,
            limit: 36,
        }),
        AttributeServices.getShowingAttributes({}),
    ]);

    return {
        props: {
            allProd: data?.products || [],
            attributes,
        },
    };
};