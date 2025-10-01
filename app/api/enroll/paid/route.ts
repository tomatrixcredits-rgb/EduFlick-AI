import { NextResponse } from "next/server"
import { z } from "zod"

import { getSupabaseAdminClient } from "@/lib/supabase/server"

const bodySchema = z.object({
  userId: z.string().uuid(),
  planId: z.enum(["basic", "pro", "premium"]),
})

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    const { fieldErrors, formErrors } = parsed.error.flatten()
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: {
          ...fieldErrors,
          form: formErrors,
        },
      },
      { status: 400 },
    )
  }

  const { userId, planId } = parsed.data

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase is not configured. Verify server credentials." },
      { status: 500 },
    )
  }

  // Mark the most recent pending enrollment as paid for this user
  const { data: enrollment, error: fetchError } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("payment_status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (fetchError) {
    return NextResponse.json(
      { message: "Unable to locate enrollment", errors: { form: [fetchError.message] } },
      { status: 500 },
    )
  }

  if (!enrollment?.id) {
    return NextResponse.json(
      { message: "No pending enrollment found for this user" },
      { status: 404 },
    )
  }

  const { error: updateError } = await supabase
    .from("enrollments")
    .update({ payment_status: "paid", plan_id: planId, paid_at: new Date().toISOString() })
    .eq("id", enrollment.id)

  if (updateError) {
    return NextResponse.json(
      { message: "Unable to update enrollment status", errors: { form: [updateError.message] } },
      { status: 500 },
    )
  }

  return NextResponse.json({ message: "Enrollment marked as paid" })
}

