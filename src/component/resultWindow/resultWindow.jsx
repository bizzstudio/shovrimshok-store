import React, { useEffect, useRef, useState } from 'react';
import { IoAdd, IoBagAddSharp, IoRemove } from 'react-icons/io5';
import { useCart } from 'react-use-cart';
import { notifyError } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import useGetSetting from "@hooks/useGetSetting";
import ProductModal from "@component/modal/ProductModal";
import useTranslation from "next-translate/useTranslation";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Link from 'next/link';
import Price from '@component/common/Price';
import Image from 'next/image';

export default function ResultWindow({ products = [], attributes, clearInput, closeResultWindow }) {
    // console.log('products: ', products)
    const resultRef = useRef(null);
    const [bottomPosition, setBottomPosition] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { items, addItem, updateItemQuantity, inCart } = useCart();
    const { handleIncreaseQuantity } = useAddToCart();
    const { globalSetting } = useGetSetting();
    const { showingTranslateValue } = useUtilsFunction();
    const { t } = useTranslation();

    const currency = globalSetting?.default_currency || "$";

    // בלחיצה מחוץ לחלון התוצאות הוא נסגר אם הפופאפ מוצר לא פתוח
    useEffect(() => {
        if (resultRef.current) {
            const height = resultRef.current.clientHeight;
            setBottomPosition(-height);
        }

        const handleClickOutside = (event) => {
            if (
                resultRef.current &&
                !resultRef.current.contains(event.target) &&
                !modalOpen
            ) {
                closeResultWindow();
            }
        };

        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [products, clearInput, closeResultWindow, modalOpen]);

    const handleAddToCart = (product) => {
        if (product.stock < 1) return notifyError(t("common:productStockOut"));

        const { slug, variants, categories, description, ...updatedProduct } = product;
        const newItem = {
            ...updatedProduct,
            id: product._id,
            title: showingTranslateValue(product?.title),
            price: product.prices.price,
            originalPrice: product.prices?.originalPrice,
            image: product.image[0],
            slug: product.slug,  // Ensure slug is included
        };

        addItem(newItem);
    };

    const handleModalOpen = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    // delete this before prodaction
    let example = {
        "prices": {
            "price": 15,
            "originalPrice": 20,
            "discount": 5
        },
        "categories": [
            "6666fc1b61eead5864aa27b2"
        ],
        "image": [
            "https://res.cloudinary.com/dzxn0xhoy/image/upload/v1716360445/product/%D7%A2%D7%A0%D7%91-%D7%9C%D7%91%D7%9F-%D7%9C%D7%9C%D7%90-e1652005717961.jpg"
        ],
        "tag": [
            "[]"
        ],
        "variants": [],
        "status": "show",
        "_id": "6678148a5c4c4525b058be3d",
        "productId": "6678148a5c4c4525b058be3c",
        "sku": "10018-1",
        "barcode": "41",
        "title": {
            "he": "ענב לבן ללא גרעין (כ-1ק\"ג)"
        },
        "description": {
            "he": "מתיקות טהורה, פריכות מרעננת וחוויה ללא גרעין!\n\nתיהנו מענבים לבנים ללא גרעין באיכות הגבוהה ביותר, ישירות מהחקלאי אליכם הביתה.\n\nלמה לבחור בנו?\n\nטריות מובטחת: הענבים שלנו נקטפים יום לפני המשלוח, כך שתוכלו להיות בטוחים שאתם מקבלים את המוצר הטרי ביותר האפשרי.\nטעם משובח: אנו מגדלים את הענבים שלנו בתנאים אופטימליים, תוך הקפדה על שימוש בשיטות חקלאות ידידותיות לסביבה, מה שמבטיח לכם ענבים מתוקים, עסיסיים וטעימים במיוחד.\nנוחות הזמנה: אנו מציעים משלוח מהיר עד הבית, כך שתוכלו להזמין את הענבים שלכם בקלות ובנוחות מירבית.\nשקיפות מלאה: אנו גאים בחקלאות שלנו, ולכן אנו פתוחים לכל שאלה בנוגע לגידול הענבים שלנו.\nהזמינו עכשיו ותיהנו מחוויית טעם יוצאת דופן!"
        },
        "slug": "ענב-לבן-ללא-גרעין-כ-1ק\"ג",
        "category": {
            "_id": "6666fc1b61eead5864aa27b2",
            "name": {
                "en": "Fruits",
                "he": "פירות"
            }
        },
        "stock": 1000,
        "isCombination": false,
        "createdAt": "2024-06-23T12:26:50.749Z",
        "updatedAt": "2024-06-23T12:27:48.120Z",
        "__v": 0
    }

    console.log('search Product: ', selectedProduct);

    return (
        <>
            {/* פופאפ מוצר בלחיצה על מוצר עם אפשרויות */}
            {modalOpen && selectedProduct && (
                <ProductModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    product={selectedProduct}
                    currency={currency}
                    attributes={attributes}
                    clearInput={clearInput}
                />
            )}

            <div
                ref={resultRef}
                className='absolute bg-white left-0 w-full shadow-xl overflow-hidden rounded-bl-lg rounded-br-lg'
                style={{ bottom: `${bottomPosition}px` }}
            >
                <div className="p-1">
                    <h2 className="text-right text-xl p-4">{products.length} {t("common:itemsFound")}</h2>
                    <div className="overflow-y-auto sm:max-h-[570px] max-h-[450px]">
                        {products.slice(0, 10).map((product) => (
                            <Link
                                href={`/product/${product.slug}`} onClick={() => clearInput()}
                                key={product._id}>
                                <div className="flex items-center justify-between border-t p-4 hover:bg-gray-100">
                                    {/* תמונה כותרת ומחיר */}
                                    <div className="flex items-center gap-2">
                                        {product.image[0] ? (
                                            <Image
                                                src={product.image[0]}
                                                width={420}
                                                height={420}
                                                alt="product"
                                                className="w-16 h-16 object-contain"
                                            />
                                        ) : (
                                            <Image
                                                src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                                                width={420}
                                                height={420}
                                                alt="product Image"
                                                className="w-16 h-16 object-contain"
                                            />
                                        )}
                                        <div className="text-right ml-4">
                                            <h3 className="font-bold">{showingTranslateValue(product?.title)}</h3>
                                            <Price
                                                product={product}
                                                price={product.prices.price}
                                                originalPrice={product.prices.originalPrice}
                                                currency={currency}
                                                card={true}
                                            />
                                        </div>
                                    </div>
                                    {/* ProductCard-כפתורים דינאמיים כמו ב */}
                                    <div className="flex items-center"
                                        onClick={e => { e.preventDefault(), e.stopPropagation() }}>
                                        {inCart(product._id) ? (
                                            items.map(
                                                (item) =>
                                                    // כפתורי פלוס ומינוס
                                                    item.id === product._id && (
                                                        <div
                                                            key={item.id}
                                                            className="h-9 w-auto flex items-center justify-evenly py-1 px-2 bg-customGreen text-white rounded"
                                                        >
                                                            <button
                                                                type='button'
                                                                className="pl-1"
                                                                onClick={() =>
                                                                    updateItemQuantity(item.id, item.quantity - 1)
                                                                }
                                                            >
                                                                <span className="text-dark text-base">
                                                                    <IoRemove />
                                                                </span>
                                                            </button>
                                                            <p className="text-sm text-dark px-1 font-serif font-semibold">
                                                                {item.quantity}
                                                            </p>
                                                            <button
                                                                type='button'
                                                                className="pr-1"
                                                                onClick={() =>
                                                                    item?.variants?.length > 0
                                                                        ? handleModalOpen(product)
                                                                        : handleIncreaseQuantity(item)
                                                                }
                                                            >
                                                                <span className="text-dark text-base">
                                                                    <IoAdd />
                                                                </span>
                                                            </button>
                                                        </div>
                                                    )
                                            )
                                        ) : (
                                            // כפתורי אפשרויות או הוספה ישירה
                                            product?.variants?.length > 0 ? (
                                                <button
                                                    type='button'
                                                    onClick={() => handleModalOpen(product)}
                                                    aria-label="options"
                                                    className="h-9 px-2 flex items-center justify-center border border-gray-200 rounded text-customGreen hover:border-customGreen hover:bg-customGreen hover:text-white transition-all"
                                                >
                                                    <span className="text-[10px]">
                                                        {t("common:options")}
                                                    </span>
                                                </button>
                                            ) : (
                                                <button
                                                    type='button'
                                                    onClick={() => handleAddToCart(product)}
                                                    aria-label="cart"
                                                    className="h-9 px-2 flex items-center justify-center border border-gray-200 rounded text-customGreen hover:border-customGreen hover:bg-customGreen hover:text-white transition-all"
                                                >
                                                    <span className="text-xl">
                                                        <IoBagAddSharp />
                                                    </span>
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {/* כפתור צפייה בכל התוצאות */}
                    {products.length > 10 && (
                        <div className="text-center">
                            <button
                                className="text-customGreen hover:underline"
                                type='submit'
                            >
                                {t("common:showAll")} ({products.length})
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
