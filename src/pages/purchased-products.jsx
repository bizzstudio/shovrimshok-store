// pages/purchased-products.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { UserContext } from "@context/UserContext";
import ProductCardSkeleton from "@component/preloader/ProductCardSkeleton";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";
import SortDropdown from "@component/common/SortDropdown";
import { useRouter } from "next/router";

const PurchasedProductsPage = () => {
    const { t } = useTranslation();
    const { isLoading, setIsLoading, offers } = useContext(SidebarContext);
    const { state: { userInfo } } = useContext(UserContext);

    const router = useRouter();

    useEffect(() => {
        setIsLoading(false);
        if (!userInfo) {
            router.push("/");
        }
    }, [userInfo]);

    // נשמור כאן את כל המוצרים מכל העמודים
    const [allProducts, setAllProducts] = useState([]);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [attributes, setAttributes] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // state לניהול page = עמוד נוכחי
    const [page, setPage] = useState(1);

    // סך כל המוצרים שנרכשו (מהשרת)
    const [totalDoc, setTotalDoc] = useState(0);

    // האם יש עוד מוצרים בעמוד הבא?
    const [hasMore, setHasMore] = useState(true);

    // מיון / סינון (לפי useFilter הקיים)
    const { productData, setSortedField, sortedField } = useFilter(allProducts);

    const layoutTitle = t("common:purchasedProducts");

    // נוסיף ref לאלמנט האחרון
    const observerTarget = useRef(null);

    // הוספת Intersection Observer עם תלויות מעודכנות
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

    // טעינת עמודים נוספים
    const handleLoadMore = async () => {
        if (isLoadMore || !hasMore) return; // הגנה נוספת מפני קריאות כפולות

        const nextPage = page + 1;
        setIsLoadMore(true);
        try {
            const res = await ProductServices.getPurchasedProducts({
                token: userInfo?.token,
                page: nextPage,
                limit: 20
            });

            if (res.products && res.products.length > 0) {
                // מוסיפים את המוצרים החדשים למערך
                setAllProducts(prev => [...prev, ...res.products]);
                setPage(nextPage);

                // בדיקה אם הגענו לסוף המוצרים
                const currentTotal = allProducts.length + res.products.length;
                setHasMore(currentTotal < res.totalDoc);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Load More error: ", err);
            setHasMore(false); // במקרה של שגיאה, נפסיק את הטעינה
        } finally {
            setIsLoadMore(false);
        }
    };

    // טעינה ראשונית
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsInitialLoading(true);
            setPage(1);
            setAllProducts([]); // נקה מוצרים קודמים מיידי

            try {
                // טען מוצרים ו-attributes במקביל
                const [productsRes, attributesRes] = await Promise.all([
                    ProductServices.getPurchasedProducts({
                        token: userInfo?.token,
                        page: 1,
                        limit: 20
                    }),
                    AttributeServices.getShowingAttributes({})
                ]);

                setAllProducts(productsRes?.products || []);
                setAttributes(attributesRes || []);
                setTotalDoc(productsRes?.totalDoc || 0);
                setHasMore((productsRes?.products?.length || 0) < (productsRes?.totalDoc || 0));
            } catch (err) {
                console.error("Fetch initial data error: ", err);
                setAllProducts([]);
                setHasMore(false);
            } finally {
                setIsInitialLoading(false);
                setIsLoading(false);
            }
        };

        if (userInfo?.token) {
            fetchInitialData();
        }
    }, [userInfo?.token]);

    return (
        <Layout title={layoutTitle} description="Best-sellers page">
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                <div className="flex py-5">
                    <div className="w-full">
                        {/* הכותרת מוצגת מיידי! */}
                        <h2 className="text-center text-xl sm:text-2xl font-semibold mb-5 mt-6">
                            <ShapiraTitle text={layoutTitle} height={70} key={layoutTitle} />
                        </h2>

                        {/* הוספת רכיב המיון */}
                        {!isInitialLoading && productData?.length > 0 && (
                            <div className="flex justify-end mb-4">
                                <SortDropdown
                                    sortedField={sortedField}
                                    setSortedField={setSortedField}
                                />
                            </div>
                        )}

                        {isInitialLoading ? (
                            // <ProductCardSkeleton count={18} />
                            // ספינר רק בטעינה ראשונית
                            <Loading loading={isInitialLoading} />
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
                                        <div
                                            key={product.ItemCode + i}
                                            ref={i === productData.length - 7 ? observerTarget : null}
                                        >
                                            <ProductCard
                                                product={product}
                                                attributes={attributes}
                                                offers={offers}
                                            />
                                        </div>
                                    ))}
                                </div>

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
        </Layout>
    );
};

export default PurchasedProductsPage;