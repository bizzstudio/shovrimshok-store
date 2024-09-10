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
import { useRouter } from "next/router";

// import ctegories titles
import fruitTitle from "public/titles/fruitTitle.svg";
import herbsTitle from "public/titles/herbsTitle.svg";
import leguTitle from "public/titles/leguTitle.svg";
import ourOffers from "public/titles/ourOffers.svg";
import vegTitle from "public/titles/vegTitle.svg";
import honeyTitle from "public/titles/honeyTitle.svg";
import useAsync from "@hooks/useAsync";
import OfferServices from "@services/OfferServices";
import AttributeServices from "@services/AttributeServices";

const CategoryPage = ({ products, attributes }) => {
    const { t } = useTranslation();
    const { isLoading, setIsLoading } = useContext(SidebarContext);
    const [visibleProduct, setVisibleProduct] = useState(24);
    const [category, setCategory] = useState('');
    const router = useRouter();
    const { categoryId } = router.query; // מתייחס לקטגוריה ישירות מהנתב
    const { data: offers } = useAsync(() => OfferServices.getAllOffers());

    useEffect(() => {
        if (categoryId) {
            switch (categoryId) { // משתמש ב-categoryId במקום query?.category
                case 'פירות':
                    setCategory(fruitTitle.src);
                    break;
                case 'עלים ועשבי תיבול':
                    setCategory(herbsTitle.src);
                    break;
                case 'קטניות':
                    setCategory(leguTitle.src);
                    break;
                case 'ירקות':
                    setCategory(vegTitle.src);
                    break;
                case 'דבש':
                    setCategory(honeyTitle.src);
                    break;
                case 'מבצעים':
                    setCategory(ourOffers.src);
                    break;
                default:
                    setCategory('');
                    break;
            }
        }
    }, [categoryId]);

    useEffect(() => {
        setIsLoading(false);
    }, [products]);

    const { setSortedField, productData } = useFilter(products);

    return (
        <Layout title={categoryId} description="This is category page">
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                <div className="flex py-5">
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
                                category ? (
                                    <img src={category} alt={categoryId} className="h-24 mx-auto animate-fadeIn" />
                                ) : (
                                    <div className="flex justify-between my-3 bg-customBrown-light border border-gray-100 rounded p-3">
                                        <h6 className="text-sm font-serif">
                                            {t("common:totalI")}{" "}
                                            <span className="font-bold">{productData?.length}</span>{" "}
                                            {t("common:itemsFound")}
                                        </h6>
                                    </div>
                                )
                            )}

                            {isLoading ? (
                                <Loading loading={isLoading} />
                            ) : (
                                <>
                                    <div
                                        className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3 ${productData?.length < 6 ? 'justify-center' : ''}`}
                                        style={{
                                            gridTemplateColumns: window.innerWidth < 640
                                                ? `repeat(2, minmax(150px, 1fr))`
                                                : productData?.length < 6
                                                    ? `repeat(${Math.min(productData?.length, 6)}, minmax(150px, 235px))`
                                                    : '',
                                        }}
                                    >
                                        {productData?.slice(0, visibleProduct).map((product, i) => (
                                            <ProductCard
                                                key={i + 1}
                                                product={product}
                                                attributes={attributes}
                                                offers={offers}
                                            />
                                        ))}
                                    </div>

                                    {productData?.length > visibleProduct && (
                                        <button
                                            onClick={() => setVisibleProduct((pre) => pre + 36)}
                                            className="w-auto mx-auto mt-6 flex items-center gap-2 font-semibold cursor-pointer transition-all bg-customGreen text-white px-6 py-1.5 h-11 rounded-lg border-customGreen-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
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

export const getServerSideProps = async (context) => {
    const { categoryId } = context.query;

    const [data, attributes] = await Promise.all([
        ProductServices.getShowingStoreProducts({
            category: categoryId,
        }),
        AttributeServices.getShowingAttributes({}),
    ]);

    return {
        props: {
            products: data?.products,
            attributes,
        },
    };
};
