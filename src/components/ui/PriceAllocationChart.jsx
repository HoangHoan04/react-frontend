import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PriceAllocationChart = ({ products }) => {
  const priceRange = {
    "0-100": 0,
    "100-300": 0,
    "300+": 0,
  };

  products.forEach((p) => {
    if (p.price < 100) priceRange["0-100"]++;
    else if (p.price < 300) priceRange["100-300"]++;
    else priceRange["300+"]++;
  });

  const chartData = {
    labels: Object.keys(priceRange),
    datasets: [
      {
        label: "Product Count",
        data: Object.values(priceRange),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed} products`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PriceAllocationChart;
