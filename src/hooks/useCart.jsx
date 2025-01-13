// useCart.jsx
import { useCart as useOriginalCart } from 'react-use-cart';
import { useContext, useEffect, useState } from 'react';
import { SidebarContext } from '@context/SidebarContext';

const useCart = () => {
    const cart = useOriginalCart();
    const { offers } = useContext(SidebarContext);

    const [calculating, setCalculating] = useState(false); // מצב העוקב אחרי חישוב המבצעים

    // Helper function to apply offers to cart items (כמו בצד השרת)
    const applyOffers = (cartItems, offers = []) => {
        if (!Array.isArray(offers) || offers.length === 0) {
            return { updatedCartItems: cartItems, totalDiscount: 0 };
        }

        let updatedCartItems = cartItems.map(item => ({
            ...item,
            discountedPrice: null,
            offerTitle: ''
        }));
        let totalDiscount = 0;

        // Create a map to count the quantity of each product
        const productCount = {};
        cartItems.forEach(item => {
            if (!productCount[item._id]) {
                productCount[item._id] = 0;
            }
            productCount[item._id] += item.quantity;
        });

        // יישום המבצע בהתבסס על כמות המוצרים שתואמים לו
        offers.forEach(offer => {
            // מזהי המוצרים שבמבצע המסוים הזה
            const offerProducts = offer.products.map(p => p._id);

            // חישוב כמות כללית בעגלה שנכנסת למבצע
            let totalApplicableQuantity = 0;

            // אם המוצר שבעגלה קיים בתוך המבצע הנוכחי אז הכמות שלו נוספת לכמות המוצרים הכללית שנכנסת למבצע
            offerProducts.forEach(id => {
                if (productCount[id]) {
                    totalApplicableQuantity += productCount[id];
                }
            });

            // כמות הפעמים שהמבצע יכול לחול
            const timesOfferCanApply = Math.floor(totalApplicableQuantity / offer.quantity);
            let remainingQuantityToApply = timesOfferCanApply * offer.quantity;

            if (timesOfferCanApply > 0) {
                const offerUnitPrice = offer.price / offer.quantity;

                // עדכון updatedCartItems עם מחיר המבצע
                updatedCartItems = updatedCartItems.map(item => {
                    if (offerProducts.includes(item._id)) {
                        if (remainingQuantityToApply > 0) {
                            const discountQuantity = Math.min(item.quantity, remainingQuantityToApply);
                            remainingQuantityToApply -= discountQuantity;
                            const nonDiscountQuantity = item.quantity - discountQuantity;

                            const discountedPrice =
                                discountQuantity * offerUnitPrice +
                                nonDiscountQuantity * item.prices.price;

                            return {
                                ...item,
                                discountedPrice,
                                offerTitle: offer.name
                            };
                        }
                    }
                    return item;
                });

                // סך כל ההנחה שהתקבלה ממבצע זה
                const originalPricePerItem = offer.products[0].prices.price;
                totalDiscount += timesOfferCanApply * (offer.quantity * originalPricePerItem - offer.price);
            }
        });

        return { updatedCartItems, totalDiscount };
    };

    const [customCart, setCustomCart] = useState({
        customCartTotal: 0,
        updatedCartItems: []
    });

    useEffect(() => {
        if (cart.totalItems === 0) {
            // אם אין פריטים בעגלה, אין צורך לבצע חישוב
            setCustomCart({
                customCartTotal: 0,
                updatedCartItems: cart.items,
            });
            return;
        }

        setCalculating(true); // התחלת חישוב

        // 1. החלת מבצעים על העגלה
        const { updatedCartItems, totalDiscount: offerDiscount } = applyOffers(cart.items, offers);

        // 2. חישוב הסכום הכולל (כמו בצד השרת)
        let localTotal = 0;
        updatedCartItems.forEach(item => {
            // כמו בצד השרת: itemTotal = מחיר יחידה * כמות
            const itemTotal = item.prices.price * item.quantity;
            // אם יש מחיר מבצע, נשתמש בו; אם לא, במחיר הרגיל
            localTotal += item.discountedPrice ? item.discountedPrice : itemTotal;
        });

        // 3. הכפלת דמי ליקוט 10%
        localTotal *= 1.1;

        // 4. שמירה ב־state
        setCustomCart({
            customCartTotal: localTotal,
            updatedCartItems,
        });

        setCalculating(false); // סיום חישוב
    }, [cart, offers]);

    return {
        ...cart,
        // אם אנחנו עדיין מחשבים, נחזיר טקסט. אחרת נחזיר את הסכום
        customCartTotal: calculating ? 'מחשב פריטים...' : customCart.customCartTotal,
        items: customCart.updatedCartItems,
        isLoading: calculating,
    };
};

export default useCart;
