import { NextResponse } from "next/server"
import { z } from "zod"

import { getSupabaseAdminClient } from "@/lib/supabase/server"

const trackSchema = z.enum(["ai-content", "ai-software", "ai-automation"])

const bodySchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(6).max(40).optional(),
  track: trackSchema,
  planId: z.enum(["basic", "pro", "premium"]).optional(),
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

  const { userId, name, email, phone, track, planId } = parsed.data

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase is not configured. Verify server credentials." },
      { status: 500 },
    )
  }

  // Optionally upsert a profile row with provided data
  if (name || phone || email) {
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: name ?? null,
          phone: phone ?? null,
        },
        { onConflict: "id" },
      )

    if (profileError) {
      return NextResponse.json(
        {
          message: "Unable to save profile",
          errors: { form: [profileError.message] },
        },
        { status: 500 },
      )
    }
  }

  // Create enrollment with pending payment status
  const { error: enrollError } = await supabase.from("enrollments").insert({
    user_id: userId,
    track,
    plan_id: planId ?? null,
    payment_status: "pending",
  })

  if (enrollError) {
    return NextResponse.json(
      {
        message: "Unable to create enrollment",
        errors: { form: [enrollError.message] },
      },
      { status: 500 },
    )
  }

  // Update onboarding stage to payment_pending
  const { error: stageError } = await supabase
    .from("profiles")
    .update({ onboarding_stage: "payment_pending" })
    .eq("id", userId)

  if (stageError) {
    return NextResponse.json(
      {
        message: "Enrollment created but unable to update onboarding stage",
        errors: { form: [stageError.message] },
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ message: "Enrollment created" }, { status: 201 })
}

