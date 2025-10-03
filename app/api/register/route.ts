import { NextResponse } from "next/server"
import { z } from "zod"

import { getSupabaseAdminClient } from "@/lib/supabase/server"

const trackSchema = z.enum([
  "ai-content",
  "ai-software",
  "ai-automation",
])

const registrationSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Please enter your full name")
      .max(120, "Name is too long"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email address"),
    phone: z
      .preprocess((value) => {
        if (typeof value === "string" && value.trim() === "") return undefined
        return value
      }, z.string().min(6, "Phone number is too short").max(40, "Phone number is too long").optional()),
    track: trackSchema,
    company: z.string().optional(),
  })
  .refine((data) => !data.company, {
    message: "Spam detected",
    path: ["company"],
  })

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 },
    )
  }

  const result = registrationSchema.safeParse(body)

  if (!result.success) {
    const { fieldErrors, formErrors } = result.error.flatten()
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

  const { name, email, phone, track } = result.data

  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return NextResponse.json(
      {
        message:
          "Supabase is not configured. Please verify the server credentials and try again.",
      },
      { status: 500 },
    )
  }

  const { error } = await supabase.from("registrations").insert({
    name,
    email,
    phone: phone ?? null,
    track,
  })

  if (error) {
    return NextResponse.json(
      {
        message: "Unable to save registration",
        errors: {
          form: [error.message],
        },
      },
      { status: 500 },
    )
  }

  return NextResponse.json(
    {
      message: "Registration submitted successfully",
    },
    { status: 201 },
  )
}
