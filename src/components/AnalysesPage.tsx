import { useEffect, useState } from 'react'
import { useAnalysisQuery } from '@/api/analysis/analysis.query'
import { type Analysis } from '@/types/analysis.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar, Clock, Search, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useUserQuery } from '@/api/user/user.query'
import { useNavigate } from '@tanstack/react-router'

export function AnalysesPage() {
  const { useGetLoggedUser } = useUserQuery();
  const { data: user } = useGetLoggedUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && !user.is_recruiter) {
      navigate({ to: '/' })
    }
  }, [user])

  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(5)
  
  const { useListAllAnalysisQuery } = useAnalysisQuery()
  const { data, isLoading, error } = useListAllAnalysisQuery(currentPage, limit)

  const getStatusIcon = (status: Analysis['status']) => {
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

  const getStatusColor = (status: Analysis['status']) => {
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

  const totalPages = data ? Math.ceil(data.total / limit) : 0

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar análises</h2>
          <p className="text-gray-600">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Minhas Análises</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Visualize todas as análises de candidatos que você realizou
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total de Análises</p>
                <p className="text-2xl font-bold text-blue-900">{data?.total || 0}</p>
              </div>
              <Search className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Análises */}
      {data?.data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {data.data.map((analysis: Analysis) => (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {analysis.query ? analysis.query.slice(0, 50) : 'Análise sem descrição'}
                    </CardTitle>
                    <Badge className={`${getStatusColor(analysis.status)} flex items-center gap-1`}>
                      {getStatusIcon(analysis.status)}
                      {analysis.status === 'COMPLETED' && 'Concluída'}
                      {analysis.status === 'PENDING' && 'Pendente'}
                      {analysis.status === 'FAILED' && 'Falhou'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Criada em: {formatDate(analysis.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Última atualização: {formatDate(analysis.updatedAt)}</span>
                    </div>
                    
                    {/* Botão Ver Detalhes */}
                    <div className="pt-2">
                      <Button 
                        onClick={() => navigate({ to: `/analyses/${analysis.id}` })}
                        className="w-full"
                        size="default"
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma análise encontrada</h3>
            <p className="text-gray-600">
              Você ainda não realizou nenhuma análise de candidatos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
