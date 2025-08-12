import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to landing page since we now have role-based routing
  redirect("/")
}
