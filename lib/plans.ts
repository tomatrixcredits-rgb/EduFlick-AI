export type PaymentPlanId = "basic" | "pro" | "premium"

export type PaymentPlan = {
  id: PaymentPlanId
  name: string
  description: string
  amount: number
  currency: "INR"
  price: string
  highlight?: string
  features: string[]
}

export const paymentPlans: PaymentPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for individuals who want to explore Eduflick AI at their own pace.",
    amount: 49900,
    currency: "INR",
    price: "₹499",
    features: [
      "Access to core learning tracks",
      "Community discord access",
      "Weekly live doubt resolution",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ideal for professionals looking to accelerate their AI journey.",
    amount: 99900,
    currency: "INR",
    price: "₹999",
    highlight: "Most popular",
    features: [
      "Everything in Basic",
      "1:1 mentor guidance",
      "Project feedback sessions",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Designed for teams and founders who want full-stack AI enablement.",
    amount: 149900,
    currency: "INR",
    price: "₹1,499",
    features: [
      "Everything in Pro",
      "Custom AI strategy workshop",
      "Priority cohort onboarding",
    ],
  },
]

export function getPaymentPlan(planId: PaymentPlanId) {
  return paymentPlans.find((plan) => plan.id === planId)
}
