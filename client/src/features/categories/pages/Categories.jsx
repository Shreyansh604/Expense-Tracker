import { useEffect, useState } from "react";
import api from "../../../services/axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setError(null);

    try {
      setIsLoading(true);
      await api.post("/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories(); // refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
    } catch (err) {
        setError(err.response?.data?.message || "Cannot delete this category");
    }
};

  const globalCategories = categories.filter(c => c.user_id === null);
  const userCategories = categories.filter(c => c.user_id !== null);

  return (
    <div className="p-6 w-full">
      <div className="max-w-[600px] mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-medium text-neutral-100">Categories</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Manage your transaction categories</p>
        </div>

        {/* Add category form */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-5 mb-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-3">Add custom category</p>
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Rent, Gym, Freelance"
              className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-[#f89f1b]"
            />
            <button type="submit" disabled={isLoading}
              className="px-4 py-2 bg-[#f89f1b] rounded-lg text-sm font-medium text-neutral-900">
              {isLoading ? "Adding..." : "Add"}
            </button>
          </form>
        </div>

        {/* User categories */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-5 mb-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-3">Your categories</p>
          {userCategories.length === 0 ? (
            <p className="text-xs text-neutral-500">No custom categories yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {userCategories.map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-neutral-700/30">
                  <span className="text-sm text-neutral-300">{c.name}</span>
                  <button onClick={() => handleDelete(c.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global categories */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-5">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-3">Default categories</p>
          <div className="flex flex-wrap gap-2">
            {globalCategories.map(c => (
              <span key={c.id}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-700/50 rounded-lg text-xs text-neutral-400">
                {c.name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Categories;