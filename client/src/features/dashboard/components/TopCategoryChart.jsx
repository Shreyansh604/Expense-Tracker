import { useSelector } from "react-redux";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#f89f1b", "#22c55e", "#3b82f6", "#ef4444", "#a855f7"];

const TopCategoryChart = ({ categories = [] }) => {
  const { transactions } = useSelector((state) => state.transactions);
  const [view, setView] = useState("bar"); // "bar" | "pie"

  // 1. filter expenses
  const expenses = transactions.filter((t) => t.type === "expense");

  // 2. group by category
  const categoryMap = {};

  expenses.forEach((t) => {
    const categoryName = categories.find(c => c.id === t.category_id)?.name || "Other";
    categoryMap[categoryName] = (categoryMap[categoryName] || 0) + parseFloat(t.amount);
  });

  // 3. convert to array
  const data = Object.entries(categoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // 4. sort
  data.sort((a, b) => b.amount - a.amount);

  return (
    <div>
      {/* HEADER + TOGGLE BUTTON */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-neutral-200">Spending by category</p>

        <button
          onClick={() => setView(view === "bar" ? "pie" : "bar")}
          className="text-xs px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded"
        >
          {view === "bar" ? "Pie" : "Bar"}
        </button>
      </div>

      {/* SWITCH VIEW */}
      <div className="h-[220px] flex items-center justify-center">
        {data.length === 0 ? (
          <p className="text-xs text-neutral-500">No data</p>
        ) : view === "bar" ? (
          <BarView data={data} />
        ) : (
          <PieView data={data} />
        )}
      </div>
    </div>
  );
};

export default TopCategoryChart;

/* ---------------- BAR VIEW (food ---- style) ---------------- */

const BarView = ({ data }) => {
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="w-full flex flex-col justify-center gap-3">
      {data.map((item) => (
        <div key={item.category}>
          {/* label */}
          <div className="flex justify-between text-xs text-neutral-300 mb-1">
            <span>{item.category}</span>
            <span>₹{item.amount.toFixed(0)}</span>
          </div>

          {/* bar */}
          <div className="w-full bg-neutral-700 h-2 rounded">
            <div
              className="bg-[#f89f1b] h-2 rounded"
              style={{
                width: `${(item.amount / max) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------------- PIE VIEW ---------------- */

const PieView = ({ data }) => {
  return (
    <div className="w-full flex justify-center items-center">
      <PieChart width={180} height={180}>
        <Pie data={data} dataKey="amount" nameKey="category" outerRadius={80}>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </div>
  );
};
