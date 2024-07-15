import OfferServices from '@services/OfferServices';
import { useCart as useOriginalCart } from 'react-use-cart';
import useAsync from './useAsync';
import { useMemo } from 'react';

const useCart = () => {
    const cart = useOriginalCart();

    const { data: offers, loading, error } = useAsync(() => OfferServices.getAllOffers());

    // Helper function to apply offers to cart items
    const applyOffers = (cartItems, offers) => {
        if (!offers || offers.length === 0) return 0;

        let updatedCartItems = [...cartItems];
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

            if (timesOfferCanApply > 0) {
                // Apply the offer
                let remainingQuantityToApply = timesOfferCanApply * offer.quantity;
                let offerDiscount = timesOfferCanApply * (offer.quantity * offer.products[0].prices.price - offer.price);

                // Calculate the total discount
                totalDiscount += offerDiscount;

                // Update cart items by marking the quantity of products covered by the offer
                offerProducts.forEach(id => {
                    while (remainingQuantityToApply > 0 && productCount[id] > 0) {
                        const itemIndex = updatedCartItems.findIndex(item => item._id === id);
                        if (itemIndex > -1) {
                            // כמות המוצרים שיש להפחית משארית המוצרים שנשאר להכניס למבצע
                            const reduction = Math.min(remainingQuantityToApply, updatedCartItems[itemIndex].quantity);

                            remainingQuantityToApply -= reduction;
                            productCount[id] -= reduction;
                        }
                    }
                });
            }
        });

        return totalDiscount;
    };

    // חישוב המחיר הכולל של העגלה עם המחירים המחושבים של הפריטים
    const customCartTotal = useMemo(() => {
        if (!cart.items || cart.items.length === 0 || loading || error) return cart.cartTotal;

        const discount = applyOffers(cart.items, offers);
        console.log('discount: ', discount)

        return (cart.cartTotal - discount)
            // הוספת 10% דמי ליקוט
            * 1.1;
    }, [cart.items, offers, loading, error]);

    console.log('customCartTotal: ', customCartTotal)

    return {
        ...cart,
        customCartTotal
    };
};

export default useCart;
