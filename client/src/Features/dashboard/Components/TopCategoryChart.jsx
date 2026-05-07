import { useSelector } from "react-redux";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#f89f1b", "#22c55e", "#3b82f6", "#ef4444", "#a855f7"];

const TopCategoryChart = () => {
  const { transactions } = useSelector((state) => state.transactions);
  const [view, setView] = useState("bar"); // "bar" | "pie"

  // 1. filter expenses
  const expenses = transactions.filter((t) => t.type === "expense");

  // 2. group by category
  const categoryMap = {};

  expenses.forEach((t) => {
    const cat = t.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + parseFloat(t.amount);
  });

  // 3. convert to array
  const data = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
  }));

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

// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const data = [
//   { name: "Food", value: 400 },
//   { name: "Transport", value: 200 },
//   { name: "Shopping", value: 300 },
//   { name: "Bills", value: 150 },
//   { name: "Health", value: 100 },
// ];

// const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e"];

// const TopCategoryChart = () => {
//   return (
//     <ResponsiveContainer width="100%" height={220}>
//       <PieChart>
//         <Pie
//           data={data}
//           cx="50%"
//           cy="50%"
//           innerRadius={60}
//           outerRadius={90}
//           paddingAngle={4}
//           dataKey="value"
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip
//           contentStyle={{ backgroundColor: "#1d1d1d", border: "1px solid #404040", borderRadius: "8px" }}
//           labelStyle={{ color: "#fff" }}
//           itemStyle={{ color: "#ccc" }}
//         />
//         <Legend
//           iconType="circle"
//           iconSize={8}
//           formatter={(value) => <span style={{ color: "#9ca3af", fontSize: "12px" }}>{value}</span>}
//         />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// export default TopCategoryChart;
