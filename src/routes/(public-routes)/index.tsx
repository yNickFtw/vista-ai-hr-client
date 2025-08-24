import { createFileRoute } from '@tanstack/react-router'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { useCandidateSearchMutation } from '@/api/candidates-search/candidates-search.mutation'
import { useRef, useState } from 'react'
import { CandidatesResults } from '@/components/CandidatesResults'
import type { AnalysisResponse } from '@/types/analysis.types'

export const Route = createFileRoute('/(public-routes)/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const { register, handleSubmit } = useForm();

  const { useSearchCandidateByQueryMutation } = useCandidateSearchMutation();

  const candidatesSession = useRef<HTMLDivElement>(null);

  const searchCandidateByQueryMutation = useSearchCandidateByQueryMutation();

  const onSubmit = async (data: any) => {
    setResult(null);
    const result = await searchCandidateByQueryMutation.mutateAsync(data.query);

    console.log(result);

    setResult(result.data);

    candidatesSession.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen py-2">
      {/* Main Content com padding-top para compensar o header fixo */}
      <div className="pt-32 flex items-center justify-center px-6 min-h-screen">
        <div className="w-full max-w-2xl">
          {/* Banner Promocional */}
          <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-8 mx-auto">
            <span className="text-red-500 text-sm">*</span>
            <span className="text-sm text-gray-700">Encontre candidatos qualificados em segundos</span>
          </div>

          {/* Título Principal */}
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              A plataforma de busca de
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 block">desenvolvedores por IA</span>
            </h1>
          </div>

          {/* Descrição */}
          <p className="text-xl text-gray-600 text-center mb-12 max-w-xl mx-auto">
            Descreva o perfil que você procura e encontre candidatos ideais usando inteligência artificial. 
            Simples, rápido e eficiente.
          </p>

          {/* Campo de Input */}
          <div className="mb-6">
            <Textarea
              placeholder="Ex: Desenvolvedor Full Stack com experiência em React, Node.js e TypeScript. Necessário conhecimento em bancos de dados SQL e pelo menos 2 anos de experiência em projetos similares."
              className="w-full min-h-[120px] text-center text-lg border-gray-300 focus:border-gray-400 focus:ring-gray-400 resize-none rounded-lg py-6"
              {...register('query')}
            />
          </div>

          {/* Botão de Ação */}
          <Button className="w-full h-14 text-lg font-medium shadow-lg" onClick={handleSubmit(onSubmit)} disabled={searchCandidateByQueryMutation.isPending}>
            {searchCandidateByQueryMutation.isPending ? 'Buscando...' : 'Buscar candidatos'}
          </Button>
        </div>
      </div>

      {/* Resultados da Busca */}
      {result && (
        <div className="px-6 pb-12" ref={candidatesSession}>
          <div className="max-w-7xl mx-auto">
            <CandidatesResults 
              analysisResponse={result}
            />
          </div>
        </div>
      )}
    </div>
  )
}
