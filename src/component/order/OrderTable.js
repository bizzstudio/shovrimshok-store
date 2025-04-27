// shapira-store/src/component/order/OrderTable.js
import useUtilsFunction from "@hooks/useUtilsFunction";
import React from "react";

const OrderTable = ({ data, currency }) => {
  const { getNumberTwo } = useUtilsFunction();

  return (
    <tbody className="bg-white divide-y divide-gray-100 text-serif text-sm">
      {data?.items?.map((item, i) => (
        <tr key={i}>
          <th className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-center">
            {i + 1}
          </th>
          <td className="px-2 py-1 whitespace-nowrap font-normal text-gray-500 text-start">
            {item.Dscription}
          </td>
          <td className="px-6 py-1 whitespace-nowrap font-bold text-center">
            {item.Quantity}
          </td>
          <td className="px-6 py-1 whitespace-nowrap font-bold text-center font-DejaVu">
            {getNumberTwo(item.Price)}
            {" "}
            {currency}
          </td>

          <td className="px-6 py-1 whitespace-nowrap text-right font-bold font-DejaVu k-grid text-red-500">
            {getNumberTwo(item.LineTotal)}
            {" "}
            {currency}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default OrderTable;
