import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_dashboardLayout/sheets/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="p-4">Hello "/sheets/"!</div>
}
