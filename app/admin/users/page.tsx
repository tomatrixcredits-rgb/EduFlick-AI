"use client"

import { useEffect, useMemo, useState } from "react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Array<{ id: string; email: string | null; full_name: string | null; phone: string | null; created_at: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 20

  const adminSecret = useMemo(() => process.env.NEXT_PUBLIC_ADMIN_API_SECRET, []) as string | undefined

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
        if (query.trim()) params.set("q", query.trim())
        const res = await fetch(`/api/users?${params.toString()}` , {
          headers: {
            "x-admin-secret": adminSecret || "",
          },
          signal: controller.signal,
        })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json?.message || "Failed to load users")
        }
        setUsers(json.users || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load users")
      } finally {
        setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [adminSecret, page, pageSize, query])

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="mt-4 flex gap-3">
          <input
            className="w-80 rounded-md border border-white/10 bg-white/5 px-3 py-2"
            placeholder="Search name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {error ? <div className="mt-4 text-red-300 text-sm">{error}</div> : null}
        <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-3" colSpan={5}>Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-4 py-3" colSpan={5}>No users</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="odd:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs text-white/70">{u.id}</td>
                    <td className="px-4 py-3">{u.full_name || "—"}</td>
                    <td className="px-4 py-3">{u.email || "—"}</td>
                    <td className="px-4 py-3">{u.phone || "—"}</td>
                    <td className="px-4 py-3">{new Date(u.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button className="rounded-md bg-white/10 px-3 py-1 disabled:opacity-50" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <span className="text-white/70 text-sm">Page {page}</span>
          <button className="rounded-md bg-white/10 px-3 py-1" onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </main>
  )
}

