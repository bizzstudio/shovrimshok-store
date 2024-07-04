import { useCart as useOriginalCart } from 'react-use-cart';

const useCart = () => {
    const cart = useOriginalCart();

    // חישוב המחיר הכולל של העגלה עם המחירים המחושבים של הפריטים
    const customCartTotal = cart.items.reduce((total, item) => {
        return total + (item.calculatedTotalPrice || item.price * item.quantity);
    }, 0)
        // הוספת 10% דמי ליקוט
        * 1.1;

    return {
        ...cart,
        customCartTotal
    };
};

export default useCart;
