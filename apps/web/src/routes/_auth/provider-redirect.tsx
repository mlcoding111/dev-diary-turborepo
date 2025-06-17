import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/provider-redirect')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/provider-redirect"!</div>
}
