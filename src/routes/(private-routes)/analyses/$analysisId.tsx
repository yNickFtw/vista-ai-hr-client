import { AnalysisDetailsPage } from '@/components/AnalysisDetailsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private-routes)/analyses/$analysisId')({
  component: RouteComponent
})

function RouteComponent() {
  const { analysisId } = Route.useParams()
  
  console.log('RouteComponent rendered with analysisId:', analysisId)

  return <AnalysisDetailsPage analysisId={analysisId} />
}
