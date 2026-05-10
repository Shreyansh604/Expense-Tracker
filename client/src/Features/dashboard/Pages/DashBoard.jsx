import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  createTransaction,
} from "../../transaction/transactionSlice.js";
import TopCategoryChart from "../components/TopCategoryChart.jsx";
import api from "../../../services/axios.js";

const DashBoard = () => {
  const dispatch = useDispatch();
  const { transactions, isLoading } = useSelector(
    (state) => state.transactions,
  );
  const { user } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category_id: null,
  });

  useEffect(() => {
    dispatch(fetchTransactions());
    api.get("/categories").then((res) => setCategories(res.data.data));
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      amount: parseFloat(formData.amount),
      category_id:
        formData.category_id && formData.category_id !== ""
          ? parseInt(formData.category_id)
          : null,
    };
    // console.log("dataToSend:", dataToSend);
    await dispatch(createTransaction(dataToSend));
    setShowForm(false);
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category_id: null,
    });
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  if (isLoading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-medium text-neutral-100">
            Good morning, {user?.name || "User"}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}{" "}
            overview
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f89f1b] text-neutral-900 rounded-lg text-xs font-medium"
        >
          + Add transaction
        </button>
      </div>

      {/* Add transaction form */}
      {showForm && (
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-5 mb-5">
          <h2 className="text-sm font-medium text-neutral-200 mb-4">
            New transaction
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Grocery shopping"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-[#f89f1b]"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-[#f89f1b]"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-400 focus:outline-none focus:border-[#f89f1b]"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-400 focus:outline-none focus:border-[#f89f1b]"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#f89f1b] rounded-lg text-sm font-medium text-neutral-900"
              >
                Save transaction
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1.5">
            Balance
          </p>
          <p className="text-xl font-medium text-neutral-100">
            ₹{balance.toFixed(2)}
          </p>
        </div>
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1.5">
            Total income
          </p>
          <p className="text-xl font-medium text-green-400">
            ₹{totalIncome.toFixed(2)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {transactions.filter((t) => t.type === "income").length}{" "}
            transactions
          </p>
        </div>
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1.5">
            Total expenses
          </p>
          <p className="text-xl font-medium text-red-400">
            ₹{totalExpense.toFixed(2)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {transactions.filter((t) => t.type === "expense").length}{" "}
            transactions
          </p>
        </div>
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-4 mb-4">
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-neutral-200">
              Recent transactions
            </p>
            <a href="/transactions" className="text-xs text-[#f89f1b]">
              View all
            </a>
          </div>
          <div className="flex flex-col gap-3">
            {recentTransactions.length === 0 ? (
              <p className="text-xs text-neutral-500">No transactions yet</p>
            ) : (
              recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.type === "income" ? "bg-green-400/10" : "bg-red-400/10"}`}
                  >
                    <span
                      className={`text-xs ${t.type === "income" ? "text-green-400" : "text-red-400"}`}
                    >
                      {t.type === "income" ? "↑" : "↓"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-300">
                      {t.description || "No description"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(t.date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium ${t.type === "income" ? "text-green-400" : "text-red-400"}`}
                  >
                    {t.type === "income" ? "+" : "-"}₹
                    {parseFloat(t.amount).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-5">
          {/* <p className="text-sm font-medium text-neutral-200 mb-4">Top category</p> */}
          <TopCategoryChart categories={categories} />
        </div>
      </div>

      {/* Bills & Subscriptions */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-medium text-neutral-200">
            Bills & subscriptions
          </p>
          <a href="#" className="text-xs text-[#f89f1b]">
            Manage
          </a>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              name: "Netflix",
              amount: "₹649",
              due: "Due May 15",
              color: "text-blue-400",
              bg: "bg-blue-400/10",
            },
            {
              name: "Spotify",
              amount: "₹119",
              due: "Due May 18",
              color: "text-green-400",
              bg: "bg-green-400/10",
            },
            {
              name: "iCloud",
              amount: "₹75",
              due: "Due May 20",
              color: "text-amber-400",
              bg: "bg-amber-400/10",
            },
            {
              name: "YouTube",
              amount: "₹189",
              due: "Due May 22",
              color: "text-pink-400",
              bg: "bg-pink-400/10",
            },
          ].map((sub) => (
            <div
              key={sub.name}
              className="bg-neutral-900 rounded-xl border border-neutral-700/50 p-3"
            >
              <div
                className={`w-7 h-7 rounded-lg ${sub.bg} flex items-center justify-center mb-2`}
              >
                <span className={`text-xs font-medium ${sub.color}`}>
                  {sub.name[0]}
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-300">{sub.name}</p>
              <p className="text-sm font-medium text-neutral-100 mt-1">
                {sub.amount}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">{sub.due}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;