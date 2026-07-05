import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sites() {
  const { user, logout } = useAuth();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  async function loadSites() {
    setLoading(true);
    const { data } = await client.get("/sites");
    setSites(data);
    setLoading(false);
  }

  useEffect(() => {
    loadSites();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await client.post("/sites", { name, domain });
      setName("");
      setDomain("");
      setShowForm(false);
      loadSites();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add site");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this site and all of its collected data?")) return;
    await client.delete(`/sites/${id}`);
    loadSites();
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-line px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-pulse animate-blip" />
          <span className="font-display font-semibold text-lg tracking-tight">pulse</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted">{user?.name}</span>
          <button onClick={logout} className="text-muted hover:text-text transition-colors">
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold">Your sites</h1>
            <p className="text-muted text-sm mt-1">Pick a site to see its traffic, or add a new one.</p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-pulse text-ink text-sm font-medium rounded-md px-4 py-2 hover:opacity-90 transition-opacity"
          >
            {showForm ? "Cancel" : "Add site"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-surface border border-line rounded-xl p-5 mb-8 space-y-4"
          >
            {error && <p className="text-sm text-red-300">{error}</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Site name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Blog"
                  className="w-full bg-ink border border-line rounded-md px-3 py-2 text-sm outline-none focus:border-pulse transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Domain</label>
                <input
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="myblog.com"
                  className="w-full bg-ink border border-line rounded-md px-3 py-2 text-sm outline-none focus:border-pulse transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-pulse text-ink text-sm font-medium rounded-md px-4 py-2 hover:opacity-90 transition-opacity"
            >
              Create site
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : sites.length === 0 ? (
          <div className="bg-surface border border-line rounded-xl p-10 text-center">
            <p className="text-muted text-sm">
              No sites yet. Add one above to get your tracking snippet.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sites.map((site) => (
              <li
                key={site._id}
                className="bg-surface border border-line rounded-xl px-5 py-4 flex items-center justify-between hover:border-pulse/40 transition-colors"
              >
                <Link to={`/sites/${site.siteId}`} className="flex-1">
                  <p className="font-medium">{site.name}</p>
                  <p className="text-sm text-muted">{site.domain}</p>
                </Link>
                <button
                  onClick={() => handleDelete(site._id)}
                  className="text-xs text-muted hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
