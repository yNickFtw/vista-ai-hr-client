import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAnalysisQuery } from '@/api/analysis/analysis.query'
import { useUserQuery } from '@/api/user/user.query'
import { CandidatesResults } from './CandidatesResults'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, Search, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { type GetAnalysisByIdResponse } from '@/types/analysis.types'

export function AnalysisDetailsPage({ analysisId }: { analysisId: string }) {
  const navigate = useNavigate()
  
  const { useGetLoggedUser } = useUserQuery()
  const { data: user } = useGetLoggedUser()
  
  const { useGetAnalysisByIdQuery } = useAnalysisQuery()
  const { data: analysisData, isLoading, error } = useGetAnalysisByIdQuery(analysisId) as { 
    data: GetAnalysisByIdResponse | undefined, 
    isLoading: boolean, 
    error: any 
  }

  useEffect(() => {
    if (user && !user.is_recruiter) {
      navigate({ to: '/' })
    }
  }, [user, navigate])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar análise</h2>
          <p className="text-gray-600 mb-4">Tente novamente mais tarde.</p>
          <Button onClick={() => navigate({ to: '/analyses' })}>
            Voltar para Análises
          </Button>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Análise não encontrada</h2>
          <p className="text-gray-600 mb-4">A análise solicitada não foi encontrada.</p>
          <Button onClick={() => navigate({ to: '/analyses' })}>
            Voltar para Análises
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header com Botão Voltar */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/analyses' })}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Análises
        </Button>
        
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Detalhes da Análise</h1>
        </div>
      </div>

      {/* Informações da Análise */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl text-blue-900 mb-2">
                {analysisData.analysis.query || 'Análise sem descrição'}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Criada em: {formatDate(analysisData.analysis.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Última atualização: {formatDate(analysisData.analysis.updatedAt)}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(analysisData.analysis.status)} flex items-center gap-1`}>
              {getStatusIcon(analysisData.analysis.status)}
              {analysisData.analysis.status === 'COMPLETED' && 'Concluída'}
              {analysisData.analysis.status === 'PENDING' && 'Pendente'}
              {analysisData.analysis.status === 'FAILED' && 'Falhou'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Resultados dos Candidatos */}
      {analysisData.users && analysisData.users.length > 0 ? (
        <CandidatesResults analysisResponse={analysisData} />
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum candidato encontrado</h3>
            <p className="text-gray-600">
              Esta análise não retornou candidatos ou ainda está em processamento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
