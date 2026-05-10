import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../transactionSlice.js";
import api from "../../../services/axios.js";

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, isLoading } = useSelector(
    (state) => state.transactions,
  );

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category_id: null,
  });

  useEffect(() => {
    dispatch(fetchTransactions());
    api.get("/categories").then(res => setCategories(res.data.data));
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("formData before send:", formData);
    // validate first before dispatching
    if (parseFloat(formData.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    const dataToSend = {
      ...formData,
      amount: parseFloat(formData.amount),
      category_id: formData.category_id && formData.category_id !== "" 
        ? parseInt(formData.category_id) 
        : null,
    };

    if (editingTransaction) {
      await dispatch(
        updateTransaction({ id: editingTransaction.id, data: dataToSend }),
      );
    } else {
      await dispatch(createTransaction(dataToSend));
    }

    setShowForm(false);
    setEditingTransaction(null);
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category_id: null,
    });
  };

  const handleEdit = (t) => {
    setEditingTransaction(t);
    setFormData({
      description: t.description || "",
      amount: t.amount,
      type: t.type,
      category_id: t.category_id,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category_id: null,
    });
  };

  const filtered = transactions
    .filter((t) => filterType === "all" || t.type === filterType)
    .filter((t) => t.description?.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-lg font-medium text-neutral-100">Transactions</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            All your income and expenses
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f89f1b] text-neutral-900 rounded-lg text-xs font-medium"
        >
          + Add transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700/50 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-[#f89f1b]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-neutral-800 border border-neutral-700/50 rounded-lg text-sm text-neutral-400 focus:outline-none"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 overflow-hidden mb-5">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Description
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Type
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Date
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Amount
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-neutral-500"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-neutral-700/30 hover:bg-neutral-700/20"
                >
                  <td className="px-4 py-3 text-sm text-neutral-300">
                    {t.description || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${t.type === "income" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {new Date(t.date).toLocaleDateString("en-IN")}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium text-right ${t.type === "income" ? "text-green-400" : "text-red-400"}`}
                  >
                    {t.type === "income" ? "+" : "-"}₹
                    {parseFloat(t.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-neutral-500 hover:text-[#f89f1b] mr-3 transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-5">
          <h2 className="text-sm font-medium text-neutral-200 mb-4">
            {editingTransaction ? "Edit transaction" : "Add transaction"}
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
                  min="0.01"
                  step="0.01"
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
                onClick={handleCancel}
                className="px-4 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#f89f1b] rounded-lg text-sm font-medium text-neutral-900"
              >
                {editingTransaction ? "Update transaction" : "Save transaction"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Transactions;
