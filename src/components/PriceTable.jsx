export default function PriceTable({ prices }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
            <th className="px-4 py-3">Crop</th>
            <th className="px-4 py-3">Market</th>
            <th className="px-4 py-3">Price (GMD)</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {prices.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                No prices available
              </td>
            </tr>
          ) : (
            prices.map((price) => (
              <tr
                key={price.id}
                className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-700">
                  {price.crop.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{price.market.name}</td>
                <td className="px-4 py-3 text-green-700 font-medium">
                  D {price.amount}
                </td>
                <td className="px-4 py-3 text-gray-400">{price.recorded_at}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
