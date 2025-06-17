import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_dashboardLayout/sheets/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sheets/create"!</div>
}
