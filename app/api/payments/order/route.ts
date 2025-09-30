import { NextResponse } from "next/server"

import { getPaymentPlan, type PaymentPlanId } from "@/lib/plans"

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

if (!RAZORPAY_KEY_ID) {
  throw new Error("Missing RAZORPAY_KEY_ID environment variable")
}

if (!RAZORPAY_KEY_SECRET) {
  throw new Error("Missing RAZORPAY_KEY_SECRET environment variable")
}

type CreateOrderBody = {
  planId?: PaymentPlanId
  customer?: {
    name?: string
    email?: string
    contact?: string
  }
}

type RazorpayOrder = {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  offer_id: string | null
  status: string
  attempts: number
  notes: Record<string, unknown>
  created_at: number
}

export async function POST(request: Request) {
  let body: CreateOrderBody

  try {
    body = (await request.json()) as CreateOrderBody
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 },
    )
  }

  if (!body.planId) {
    return NextResponse.json(
      { message: "Missing planId" },
      { status: 400 },
    )
  }

  const plan = getPaymentPlan(body.planId)

  if (!plan) {
    return NextResponse.json(
      { message: "Invalid plan selected" },
      { status: 400 },
    )
  }

  const receipt = `eduflick_${plan.id}_${Date.now()}`

  let response: Response

  try {
    response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: plan.amount,
        currency: plan.currency,
        receipt,
        notes: {
          planId: plan.id,
          planName: plan.name,
          customerName: body.customer?.name ?? null,
          customerEmail: body.customer?.email ?? null,
          customerContact: body.customer?.contact ?? null,
        },
      }),
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to reach Razorpay at the moment. Please try again later." },
      { status: 502 },
    )
  }

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null)

    return NextResponse.json(
      {
        message:
          errorPayload?.error?.description ??
          "Unable to create payment order. Please try again.",
      },
      { status: response.status },
    )
  }

  const order = (await response.json()) as RazorpayOrder

  return NextResponse.json({ order, plan })
}
