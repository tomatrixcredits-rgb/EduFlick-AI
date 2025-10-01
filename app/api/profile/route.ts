import { NextResponse } from "next/server"
import { z } from "zod"

import { getSupabaseAdminClient } from "@/lib/supabase/server"

const bodySchema = z.object({
  userId: z.string().uuid(),
  full_name: z.string().min(2).max(120).optional(),
  phone: z.string().min(6).max(40).optional(),
  email: z.string().email().optional(),
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

  const { userId, full_name, phone, email } = parsed.data

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase is not configured. Verify server credentials." },
      { status: 500 },
    )
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        full_name: full_name ?? null,
        phone: phone ?? null,
        email: email ?? null,
      },
      { onConflict: "id" },
    )

  if (error) {
    return NextResponse.json(
      { message: "Unable to save profile", errors: { form: [error.message] } },
      { status: 500 },
    )
  }

  return NextResponse.json({ message: "Profile saved" }, { status: 201 })
}

