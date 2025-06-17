import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_dashboardLayout/summary/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/_dashboardLayout/summary/"!</div>
}
