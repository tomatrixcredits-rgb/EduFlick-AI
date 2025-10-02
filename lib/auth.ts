export function getAdminEmails(): string[] {
  const raw =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_ADMIN_EMAILS) ||
    (typeof process !== "undefined" && process.env.ADMIN_EMAILS) ||
    ""

  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const adminEmails = getAdminEmails()
  return adminEmails.includes(email.toLowerCase())
}

