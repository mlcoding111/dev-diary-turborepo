import { createFileRoute } from '@tanstack/react-router'
import CommitsPage from './-commits'
import { useGitCommits } from '@/hooks/useGit'

export const Route = createFileRoute('/dashboard/_dashboardLayout/commits/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: commits, error } = useGitCommits()

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!commits) {
    return <div>Loading...</div>
  }

  return <div><CommitsPage /></div>
}
