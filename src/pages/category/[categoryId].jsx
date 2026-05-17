// pages/category/[categoryId].jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { NextSeo } from "next-seo";

// Internal import
import Layout from "@layout/Layout";
import useFilter from "@hooks/useFilter";
import ProductServices from "@services/ProductServices";
import AttributeServices from "@services/AttributeServices";
import CategoryServices from "@services/CategoryServices";

import ProductCard from "@component/product/ProductCard";
import { SidebarContext } from "@context/SidebarContext";
import Loading from "@component/preloader/Loading";
import { useRouter } from "next/router";
import ProductCardSkeleton from "@component/preloader/ProductCardSkeleton";

// בוחר טקסט בעברית מתוך אובייקט רב־לשוני {he, en} או מחרוזת רגילה
const pickName = (val, fallback = "") => {
    if (val == null) return fallback;
    if (typeof val === "string" || typeof val === "number") return val;
    if (typeof val === "object") return val.he ?? val.en ?? fallback;
    return fallback;
};

// import categories titles
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";
import { UserContext } from "@context/UserContext";
import SortDropdown from "@component/common/SortDropdown";

const CategoryPage = ({ categories: serverCategories, categoryTitle, categoryDescription }) => {
    const { t } = useTranslation();
    const { isLoading, setIsLoading, offers, categories } = useContext(SidebarContext);
    const { state: { userInfo } } = useContext(UserContext);

    // נשמור כאן את כל המוצרים מכל העמודים
    const [allProducts, setAllProducts] = useState([]);
    // console.log('allProducts :>> ', allProducts);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [attributes, setAttributes] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // state לניהול page = עמוד נוכחי
    const [page, setPage] = useState(1);
    const [sapSkip, setSapSkip] = useState(0);

    // האם יש עוד מוצרים בעמוד הבא?
    const [hasMore, setHasMore] = useState(true);

    const router = useRouter();
    const { categoryId, sub } = router.query;

    // נשתמש בקטגוריות מהשרת אם הן זמינות, אחרת מהקונטקסט
    const categoriesData = serverCategories || categories;
    
    // חישוב הטיטל
    const matchesCategory = (cat, id) =>
        String(cat?._id) === id || cat?.slug === id || cat?.code === id;
    const foundParent = categoriesData?.find((cat) => matchesCategory(cat, categoryId));
    const parentName = pickName(foundParent?.name, categoryId);

    let childName = "";
    if (sub && foundParent?.children?.length > 0) {
        const foundChild = foundParent.children.find((child) => matchesCategory(child, sub));
        childName = pickName(foundChild?.name, sub);
    }

    const layoutTitle = childName ? `${parentName} / ${childName}` : parentName;
    
    // useFilter עדיין יכול לעבוד: למשל אם צריך למיין מוצרים
    const { productData, setSortedField, sortedField } = useFilter(allProducts);

    // בוחרים איזו תמונה להציג לפי categoryName - מיידי!
    const [fallbackTitle, setFallbackTitle] = useState("");

    // הגדרות לוגיקה לתמונה - מיידי!
    useEffect(() => {
        if (!parentName) return;
        let catName = parentName;

        // אם יש childName ולא מצאנו תמונה מיוחדת, נוסיף " / childName" בכותרת
        if (childName) {
            catName += " / " + childName;
        }

        setFallbackTitle(catName);
    }, [parentName, childName]);

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
            const res = await ProductServices.getShowingStoreProducts({
                category: categoryId,
                subcategories: sub,
                page: nextPage,
                sapSkip: sapSkip,
                token: userInfo?.token,
            });

            if (!res.products || res.products.length === 0) {
                setHasMore(false);
            } else {
                // מוסיפים את המוצרים החדשים למערך
                setAllProducts(prev => [...prev, ...res.products]);
                setPage(nextPage);
                setSapSkip(res.nextSapSkip ?? 0);
                // אם res.products.length < 36, אפשר להפסיק לטעון אחרי הוספה
                if (res.products.length < 36) setHasMore(false);
            }
        } catch (err) {
            console.error("Load More error: ", err);
            setHasMore(false); // במקרה של שגיאה, נפסיק את הטעינה
        } finally {
            setIsLoadMore(false);
        }
    };

    // משיכת המוצרים בעת שינוי קטגוריה - רק כאן יש טעינה
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!categoryId) return;

            setIsInitialLoading(true);
            setPage(1);
            setAllProducts([]); // נקה מוצרים קודמים מיידי

            try {
                // טען מוצרים ו-attributes במקביל
                const [productsRes, attributesRes] = await Promise.all([
                    ProductServices.getShowingStoreProducts({
                        category: categoryId,
                        subcategories: sub,
                        page: 1,
                        limit: 36,
                        sapSkip: 0,
                        token: userInfo?.token,
                    }),
                    AttributeServices.getShowingAttributes({})
                ]);

                setAllProducts(productsRes?.products || []);
                setAttributes(attributesRes || []);
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
    }, [categoryId, sub, userInfo?.token]);

    return (
        <>
            <NextSeo
                title={categoryTitle || layoutTitle}
                description={categoryDescription || `מוצרים בקטגוריה ${layoutTitle}`}
                openGraph={{
                    title: categoryTitle || layoutTitle,
                    description: categoryDescription || `מוצרים בקטגוריה ${layoutTitle}`,
                }}
            />
            <Layout title={layoutTitle || "קטגוריה"} description="This is category page">
                <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                    <div className="flex sm:py-5 py-3">
                        <div className="flex w-full">
                            <div className="w-full">
                                {/* הכותרת מוצגת מיידי! */}
                                {fallbackTitle && (
                                    <div className="flex justify-center items-center mb-3">
                                        <ShapiraTitle text={fallbackTitle} height={70} key={fallbackTitle} />
                                    </div>
                                )}

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
                                    // ספינר רק בטעינה ראשונית
                                    // <ProductCardSkeleton count={18} />
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
                                                >
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
        </>
    );
};

export async function getServerSideProps(context) {
    const { categoryId, sub } = context.query;
    
    try {
        // טעינת קטגוריות מהשרת
        const categories = await CategoryServices.getShowingCategory();
        
        // חישוב הטיטל בשרת
        const matchesCategory = (cat, id) =>
            String(cat?._id) === id || cat?.slug === id || cat?.code === id;
        const foundParent = categories?.find((cat) => matchesCategory(cat, categoryId));
        const parentName = pickName(foundParent?.name, categoryId);

        let childName = "";
        if (sub && foundParent?.children?.length > 0) {
            const foundChild = foundParent.children.find((child) => matchesCategory(child, sub));
            childName = pickName(foundChild?.name, sub);
        }
        
        const categoryTitle = childName ? `${parentName} / ${childName}` : parentName;
        const categoryDescription = `מוצרים בקטגוריה ${categoryTitle} - שוברים שוק`;
        
        return {
            props: {
                categories,
                categoryTitle,
                categoryDescription,
            },
        };
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return {
            props: {
                categories: [],
                categoryTitle: "קטגוריה",
                categoryDescription: "מוצרים בקטגוריה",
            },
        };
    }
}

export default CategoryPage;