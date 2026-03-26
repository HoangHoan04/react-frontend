const StatsCard = ({ theme, stats }) => {
  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`${theme === "dark" ? "bg-[#1f1f1f]" : "bg-white"} rounded-2xl shadow-sm border p-4 hover:shadow-md transition`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">{item.title}</span>

            <div
              className={`flex items-center gap-1 text-sm font-medium ${item.color}`}
            >
              <i className={`${item.icon} text-xs`} />
              {item.change}
            </div>
          </div>

          <h2
            className={`${theme === "dark" ? "text-white" : "text-gray-800"} text-2xl font-bold mb-3`}
          >
            {item.value}
          </h2>

          <p
            className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} text-sm font-medium flex items-center gap-1`}
          >
            {item.desc}
            <i className="pi pi-arrow-up-right text-xs" />
          </p>

          <p
            className={`${theme === "dark" ? "text-gray-500" : "text-gray-400"} text-xs mt-1`}
          >
            {item.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
