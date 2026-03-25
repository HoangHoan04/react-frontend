export function TopExpensiveProducts({ products, theme }) {
  const topProducts = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  return (
    <div
      className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-5 rounded-2xl shadow-sm border mt-6`}
    >
      <h3 className="text-lg font-semibold mb-4">Giá bán cao nhất</h3>

      <div className="space-y-4">
        {topProducts.map((p) => (
          <div key={p.id} className="flex items-center gap-4">
            <img
              src={p.images[0]}
              className="w-14 h-14 rounded-lg object-cover"
            />

            <div className="flex-1">
              <p className="text-sm font-medium line-clamp-1">{p.title}</p>
              <p className="text-xs text-gray-500">{p.category.name}</p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-800">${p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
