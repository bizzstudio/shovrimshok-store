// src/component/order/OrderTable.js
import useUtilsFunction from "@hooks/useUtilsFunction";
import React from "react";
import { shouldShowPrice } from "./OrderHistory";

const OrderTable = ({ data, currency }) => {
  const { getNumberTwo } = useUtilsFunction();

  return (
    <tbody className="bg-white divide-y divide-gray-100 text-serif text-sm">
      {data?.items?.map((item, i) => (
        <tr key={i}>
          <th className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-center">
            {i + 1}
          </th>
          <td className="px-2 py-1 font-normal text-gray-500 text-start break-words min-w-0">
            {item.ItemDescription}
          </td>
          <td className="px-6 py-1 whitespace-nowrap font-bold text-center">
            {item.Quantity}
          </td>
          <td className="px-6 py-1 whitespace-nowrap font-bold text-center font-DejaVu">
            {shouldShowPrice(data?.DocumentStatus) 
              ? `${getNumberTwo(item?.Price)} ${currency}`
              : "-"
            }
          </td>

          <td className="px-6 py-1 whitespace-nowrap text-center font-bold font-DejaVu k-grid text-red-500">
            {shouldShowPrice(data?.DocumentStatus) 
              ? `${getNumberTwo(item.LineTotal)} ${currency}`
              : "-"
            }
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default OrderTable;