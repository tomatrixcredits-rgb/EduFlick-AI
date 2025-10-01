import { NextResponse } from "next/server"

import { getSupabaseAdminClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const adminSecret = process.env.ADMIN_API_SECRET
  const providedSecret = request.headers.get("x-admin-secret")
  if (!adminSecret || providedSecret !== adminSecret) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase is not configured. Verify server credentials." },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get("page") || 1))
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20)))
  const search = (searchParams.get("q") || "").trim().toLowerCase()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("profiles")
    .select("id, email, full_name, phone, created_at, updated_at", { count: "exact" })
    .order("created_at", { ascending: false })

  if (search) {
    // Basic case-insensitive filtering on name or email
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%`,
    )
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    return NextResponse.json(
      { message: "Unable to fetch users", errors: { form: [error.message] } },
      { status: 500 },
    )
  }

  return NextResponse.json({
    page,
    pageSize,
    total: count ?? 0,
    users: data ?? [],
  })
}

