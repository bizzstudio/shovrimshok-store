import { use, useContext } from "react";
import Link from "next/link";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

//internal import
import useAddToCart from "@hooks/useAddToCart";
import { SidebarContext } from "@context/SidebarContext";
import useCart from "@hooks/useCart";

const CartItem = ({ item, currency, updateTotalPrice }) => {
  const { updateItemQuantity, removeItem, updateItem  } = useCart();
  const { closeCartDrawer } = useContext(SidebarContext);
  const { handleIncreaseQuantity } = useAddToCart();
  const router = useRouter();

  const [appliedOffers, setAppliedOffers] = useState([]);

  // החלת ההצעות על כמות המוצרים שנלקחו תוך חישוב שמכניס כמה שיותר מוצרים אל תוך ההצעות הקיימות
  useEffect(() => {
    // במקרה של מבצע על מוצר רגיל
    if (item?.prices?.offers && item?.prices?.offers.length > 0) {
      // Copy the quantity to avoid mutating the original item
      let remainingQuantity = item.quantity;
      const sortedOffers = [...item?.prices?.offers].sort((a, b) => b.quantity - a.quantity);
      const offersToApply = [];

      sortedOffers.forEach((offer) => {
        if (remainingQuantity >= offer.quantity) {
          const offerCount = Math.floor(remainingQuantity / offer.quantity);
          remainingQuantity -= offerCount * offer.quantity;
          for (let i = 0; i < offerCount; i++) {
            offersToApply.push({
              name: offer.name,
              quantity: offer.quantity,
              price: offer.price,
            });
          }
        }
      });

      // את השארית דוחפים אל תוך הצעה שלא עושה כלום
      if (remainingQuantity > 0) {
        offersToApply.push({
          name: "",
          quantity: remainingQuantity,
          price: item.prices.price * remainingQuantity,
        });
      }

      setAppliedOffers(offersToApply);
    }
    // במקרה של מבצע על מוצר עם אופציות בתוכו
    else if (item.isCombination && item?.variant?.offers?.length > 0) {
      // Copy the quantity to avoid mutating the original item
      let remainingQuantity = item.quantity;
      const sortedOffers = [...item?.variant?.offers].sort((a, b) => b.quantity - a.quantity);
      const offersToApply = [];

      sortedOffers.forEach((offer) => {
        if (remainingQuantity >= offer.quantity) {
          const offerCount = Math.floor(remainingQuantity / offer.quantity);
          remainingQuantity -= offerCount * offer.quantity;
          for (let i = 0; i < offerCount; i++) {
            offersToApply.push({
              name: offer.name,
              quantity: offer.quantity,
              price: offer.price,
            });
          }
        }
      });

      // את השארית דוחפים אל תוך הצעה שלא עושה כלום
      if (remainingQuantity > 0) {
        offersToApply.push({
          name: "",
          quantity: remainingQuantity,
          price: item?.variant?.price * remainingQuantity,
        });
      }

      setAppliedOffers(offersToApply);
    }
    else {
      setAppliedOffers([
        {
          name: "",
          quantity: item.quantity,
          price: item.prices.price * item.quantity,
        },
      ]);
    }
  }, [item.quantity, item?.prices?.offers, item.prices.price]);

  // console.log("item>>", item);

  // חישוב המחיר הכולל בהתאם להצעות שחלו על כמות המוצר
  const totalPrice = appliedOffers.reduce(
    (total, offer) => total + Number(offer.price),
    0
  );

  useEffect(() => {
    // Update the item in the cart with the calculated total price
    updateItem(item.id, { ...item, calculatedTotalPrice: totalPrice });
  }, [totalPrice]);

  // TODO: לטפל במבצעים של אחוזי הנחה למוצר עם אופציות ולמוצר רגיל

  // console.log(`${item.title} - appliedOffers: `, appliedOffers)
  // console.log(item.title + ': ', item)

  return (
    <div className="group w-full h-auto flex gap-6 justify-start items-center bg-white py-3 px-6 border-b hover:bg-gray-50 transition-all border-gray-100 relative last:border-b-0">
      <div onClick={() => router.push(`/product/${item?.slug}`)} className="relative flex justify-between rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 cursor-pointer">
        <img
          key={item.id}
          src={item.image}
          width={60}
          height={60}
          alt={item.title}
        />
      </div>
      <div className="flex flex-col w-full overflow-hidden">
        <Link
          href={`/product/${item?.slug}`}
          onClick={closeCartDrawer}
          className="truncate text-sm font-medium text-gray-700 text-heading line-clamp-1"
        >
          {item.title}
        </Link>
        {/* <span className="text-xs text-gray-400 mb-1">
          Item Price ${item.price}
        </span> */}
        <div className="flex items-center justify-between">
          <div className="font-bold text-sm md:text-base text-heading leading-5">
            <span>
              {/* {(item.price * item.quantity).toFixed(2)} */}
              {/* אם יש הנחה מופיע בקטן המחיר המקורי */}
              {totalPrice < item.prices.price * item.quantity &&
                <del className="text-xs font-normal text-gray-400 mr-1">
                  {(item.prices.price * item.quantity).toFixed(2)}
                </del>}
              {currency}
              {totalPrice.toFixed(2)}
            </span>
            {/* פירוט ההצעות שחלו על המוצר */}
            <div className="mt-2">
              {appliedOffers.filter((item, index, self) =>
                index === self.findIndex((t) => (
                  t.name === item.name
                ))
              ).map((offer, index) => (
                <div key={index} className="text-xs text-gray-500">
                  {offer.name}
                  {appliedOffers.filter((o) => o.name === offer.name).length > 1 && <span className="font-normal"> ×{appliedOffers.filter((o) => o.name === offer.name).length}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-row-reverse mt-auto">
            <div className="h-8 flex items-center p-1 border border-gray-100 bg-white text-gray-600 rounded-md">
              <button
                className="px-1"
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
              >
                <span className="text-dark text-base">
                  <FiMinus />
                </span>
              </button>
              <p className="text-sm font-semibold text-dark px-2">
                {item.quantity}
              </p>
              <button onClick={() => handleIncreaseQuantity(item)} className="px-1">
                <span className="text-dark text-base">
                  <FiPlus />
                </span>
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="hover:text-red-600 text-red-400 text-lg cursor-pointer"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
