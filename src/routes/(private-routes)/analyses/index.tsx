import { AnalysesPage } from '@/components/AnalysesPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private-routes)/analyses/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AnalysesPage />
}
