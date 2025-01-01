import { useCart as useOriginalCart } from 'react-use-cart';
import { useContext, useEffect, useState } from 'react';
import { SidebarContext } from '@context/SidebarContext';

const useCart = () => {
    const cart = useOriginalCart();
    const { offers } = useContext(SidebarContext);

    const [calculating, setCalculating] = useState(false); // מצב העוקב אחרי חישוב המבצעים

    // Helper function to apply offers to cart items
    const applyOffers = (cartItems, offers = []) => {
        if (!Array.isArray(offers) || offers.length === 0) return { updatedCartItems: cartItems, totalDiscount: 0 };

        let updatedCartItems = cartItems.map(item => ({ ...item, discountedPrice: null, offerTitle: '' }));
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
            // יצירת מערך שמכיל את המזהים של המוצרים שבמבצע המסויים הזה
            const offerProducts = offer.products.map(p => p._id);

            // כמות המוצרים שנכנסים למבצע הזה מהעגלה
            let totalApplicableQuantity = 0;

            // אם המוצר שבעגלה קיים בתוך המבצע הנוכחי אז הכמות שלו נוספת לכמות המוצרים הכללית שנכנסת למבצע
            offerProducts.forEach(id => {
                if (productCount[id]) {
                    totalApplicableQuantity += productCount[id];
                }
            });

            // חישוב כמה פעמים המבצע יכול לחול
            const timesOfferCanApply = Math.floor(totalApplicableQuantity / offer.quantity);
            let remainingQuantityToApply = timesOfferCanApply * offer.quantity;

            if (timesOfferCanApply > 0) {
                const offerUnitPrice = offer.price / offer.quantity;

                updatedCartItems = updatedCartItems.map(item => {
                    if (offerProducts.includes(item._id)) {
                        if (remainingQuantityToApply > 0) {
                            const discountQuantity = Math.min(item.quantity, remainingQuantityToApply);
                            remainingQuantityToApply -= discountQuantity;
                            const nonDiscountQuantity = item.quantity - discountQuantity;

                            const discountedPrice = (discountQuantity * offerUnitPrice) + (nonDiscountQuantity * item.prices.price);
                            // console.log(`המוצר ${item.title} התעדכן למחיר מבצע חדש בסך ${discountedPrice}`)
                            return {
                                ...item,
                                discountedPrice: discountedPrice,
                                offerTitle: offer.name
                            };
                        }
                    }
                    return item;
                });

                totalDiscount += timesOfferCanApply * (offer.quantity * offer.products[0].prices.price - offer.price);
            }
        });

        return { updatedCartItems, totalDiscount };
    };

    const [customCart, setCustomCart] = useState({
        customCartTotal: cart.totalItems,
        updatedCartItems: cart.items
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
        
        const { updatedCartItems, totalDiscount } = applyOffers(cart.items, offers);
        setCustomCart({
            customCartTotal: (cart.cartTotal - totalDiscount) * 1.1, // הוספת דמי ליקוט 10%
            updatedCartItems: updatedCartItems,
        });

        setCalculating(false); // סיום חישוב
    }, [cart, offers]);

    return {
        ...cart,
        customCartTotal: calculating ? 'מחשב פריטים...' : customCart.customCartTotal,
        items: customCart.updatedCartItems,
        isLoading: calculating
    };
};

export default useCart;
