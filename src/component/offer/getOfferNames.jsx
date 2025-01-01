// getOfferNames.jsx
/**
 * פונקציה שמחזירה את שמות המבצעים עבור מוצר מסוים.
 * @param {Array} offers - מערך המבצעים
 * @param {Object} product - אובייקט המוצר
 * @param {String} separator - מפריד בין שמות המבצעים (ברירת מחדל: " / ")
 * @returns {String|null} - מחרוזת שמות המבצעים מופרדים במפריד או null אם אין מבצעים
 */
const getOfferNames = (offers, product, separator = " / ") => {
    if (!Array.isArray(offers) || !product || !product._id) {
        return null;
    };

    const offerNames = offers
        .filter((offer) => offer.products.some((prod) => prod._id === product._id))
        .map((offer) => offer.name?.he); // מחלץ את שם המבצע

    if (offerNames.length === 0) {
        return null;
    };

    // יצירת אלמנט React עם מפריד דינמי
    return (
        <>
            {offerNames.map((name, index) => (
                <span key={index}>
                    {name}
                    {index < offerNames.length - 1 && separator}
                </span>
            ))}
        </>
    );
};

export default getOfferNames;