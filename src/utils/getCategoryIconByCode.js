// shapira-store/src/utils/getCategoryIconByCode.js

// פונקציה שמחזירה אייקון לפי קוד קטגוריה (להרחיב לפי הצורך)
const getCategoryIconByCode = (code) => {
    const base = "/categories icons";
    const iconsMap = {
        "1000": "cannedFood",
        "1500": "spices",
        "2000": "rice",
        "2500": "softDrinks",
        "3000": "bakingGoods",
        "3500": "cleaningSupplies",
        "4000": "alcoholic",
        "4500": "sauces",
        "5000": "sweets",
        "5500": "nuts",
        "6000": "asianFood",
        "6500": "mealBoxes",
        "7500": "legumes",
        "8000": "cookies",
        "8500": "organic",
    };

    const name = iconsMap[code];

    if (!name) {
        return {
            color: "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
            bw: "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
        };
    }

    return {
        color: `${base}/${name}_color.svg`,
        bw: `${base}/${name}.svg`,
    };
};

export default getCategoryIconByCode;