// shapira-store/pages/category/[categoryId].jsx
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

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

// import categories titles
import fruitTitle from "public/titles/fruitTitle.svg";
import herbsTitle from "public/titles/herbsTitle.svg";
import leguTitle from "public/titles/leguTitle.svg";
import ourOffers from "public/titles/ourOffers.svg";
import vegTitle from "public/titles/vegTitle.svg";
import honeyTitle from "public/titles/honeyTitle.svg";
import eggsTitle from "public/titles/eggsTitle.svg";
import ShapiraTitle from "@component/shapira-title/ShapiraTitle";

/*
 * עמוד קטגוריה שמקבל מה-SSR:
 *  - props.allProd (מוצרים בעמוד הראשון)
 *  - props.attributes
*/
const CategoryPage = ({ allProd, attributes }) => {
    const { t } = useTranslation();
    const { isLoading, setIsLoading, offers, categories } = useContext(SidebarContext);

    // נשמור כאן את כל המוצרים מכל העמודים
    const [allProducts, setAllProducts] = useState(allProd || []);
    const [isLoadMore, setIsLoadMore] = useState(false);
    // console.log('all Products :>> ', allProducts);

    // state לניהול page = עמוד נוכחי
    const [page, setPage] = useState(1);

    // האם יש עוד מוצרים בעמוד הבא?
    const [hasMore, setHasMore] = useState(true);

    const router = useRouter();
    const { categoryId, sub } = router.query;

    // שליפת שמות הקטגוריה ותת-הקטגוריה מהקונטקסט
    const foundParent = categories?.find((cat) => cat.code === categoryId);
    const parentName = foundParent?.name || categoryId;

    let childName = "";
    if (sub && foundParent?.children?.length > 0) {
        const foundChild = foundParent.children.find((child) => child.code === sub);
        childName = foundChild?.name || sub;
    }

    // כדי לוודא שאין ספינר
    useEffect(() => {
        setIsLoading(false);
    }, [allProducts, setIsLoading]);

    // useFilter עדיין יכול לעבוד: למשל אם צריך למיין מוצרים
    // אבל צריך להזין את כל המוצרים שיש (allProducts):
    const { productData } = useFilter(allProducts);

    // בוחרים איזו תמונה להציג לפי parentName
    const [fallbackTitle, setFallbackTitle] = useState("");

    // הגדרות לוגיקה לתמונה
    useEffect(() => {
        if (!parentName) return;
        let catName = parentName;

        // אם יש childName ולא מצאנו תמונה מיוחדת, נוסיף " / childName" בכותרת
        if (childName) {
            catName += " / " + childName;
        }

        setFallbackTitle(catName);
    }, [parentName, childName]);

    // title ל-Layout
    const layoutTitle = childName ? `${parentName} / ${childName}` : parentName;

    // פונקציה לטעינת עמוד נוסף
    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setIsLoadMore(true);
        try {
            const res = await ProductServices.getShowingStoreProducts({
                category: categoryId,
                subcategories: sub,
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

    // משיכת המוצרים בעת שינוי קטגוריה
    useEffect(() => {
        const fetchProducts = async () => {
            if (!categoryId) return;

            setIsLoading(true);
            setPage(1); // התחלה מחדש
            try {
                const res = await ProductServices.getShowingStoreProducts({
                    category: categoryId,
                    subcategories: sub,
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
    }, [categoryId, sub]);

    return (
        <Layout title={layoutTitle || "קטגוריה"} description="This is category page">
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                <div className="flex sm:py-5 py-3">
                    <div className="flex w-full">
                        <div className="w-full">
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
                                // אחרת מציגים כותרת "קטגוריה / תת קטגוריה" מעוצבת
                                <div className="flex justify-center items-center mb-3">
                                    {/* <h6 className="text-sm font-serif">{fallbackTitle}</h6> */}
                                    <ShapiraTitle text={fallbackTitle} height={70} key={fallbackTitle} />
                                </div>
                            )}

                            {isLoading && page === 1 ? (
                                // ספינר ראשוני רק בעמוד הראשון
                                <Loading loading={isLoading} />
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
                                            <ProductCard
                                                key={product.ItemCode || i}
                                                product={product}
                                                attributes={attributes}
                                                offers={offers}
                                            />
                                        ))}
                                    </div>

                                    {/* כפתור "Load More" – נטען עמוד נוסף מהשרת */}
                                    {hasMore && productData?.length > 0 && (
                                        isLoadMore ? <Loading loading={isLoadMore} /> :
                                            <button
                                                onClick={handleLoadMore}
                                                className="w-auto mx-auto mt-6 flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customRed text-white px-6 py-1.5 h-11 rounded-lg border-customRed-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                                            >
                                                {t("common:loadMoreBtn")}
                                            </button>
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

export default CategoryPage;

// ===============================
// =       getServerSideProps    =
// ===============================
export const getServerSideProps = async (context) => {
    const { categoryId, sub } = context.query;

    // 1) נטען את העמוד הראשון (page=1)
    const [data, attributes] = await Promise.all([
        ProductServices.getShowingStoreProducts({
            category: categoryId,
            subcategories: sub,
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