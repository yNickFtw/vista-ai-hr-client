import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { type AnalysisResponse } from '../types/analysis.types';

interface CandidatesResultsProps {
  analysisResponse: AnalysisResponse;
}

export const CandidatesResults: React.FC<CandidatesResultsProps> = ({ analysisResponse }) => {
  const { analysis, users } = analysisResponse;
  
  // Estado para controlar expansão/colapso individual de cada seção
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    });
  };

  const formatExperiencePeriod = (startDate: string, endDate?: string) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Atual';
    return `${start} - ${end}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Função para calcular a porcentagem baseada na escala de cada score
  const calculatePercentage = (score: number, maxValue: number) => {
    return Math.round((score / maxValue) * 100);
  };

  // Função para alternar expansão de uma seção específica
  const toggleSectionExpansion = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  // Função para verificar se uma seção específica está expandida
  const isSectionExpanded = (sectionKey: string) => {
    return expandedSections.has(sectionKey);
  };

  return (
    <div className="space-y-6">
      {/* Header da Análise */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Análise de Candidatos
          </CardTitle>
          <CardDescription className="text-purple-700">
            {users.length} candidato{users.length !== 1 ? 's' : ''} analisado{users.length !== 1 ? 's' : ''} e recomendado{users.length !== 1 ? 's' : ''} pela IA
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Lista de Candidatos */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Candidatos Recomendados
          </h2>
          <Badge variant="secondary" className="text-sm">
            {users.length} encontrado{users.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((candidate, index) => (
            <Card 
              key={candidate.analysisId} 
              className={`hover:shadow-lg transition-all duration-300 ${
                index === 0 
                  ? 'relative shadow-lg before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 before:rounded-lg before:-z-10' 
                  : ''
              }`}
            >
              {index === 0 && (
                <div className="absolute -top-3 -right-3 z-10">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-md">
                    ⭐ Principal
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900">
                      {candidate.candidate.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {candidate.candidate.email}
                    </CardDescription>
                  </div>
                </div>

                {/* Score Geral */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Score Geral</span>
                    <span className={`text-lg font-bold ${getScoreColor(candidate.score)}`}>
                      {candidate.score}/100
                    </span>
                  </div>
                  <Progress 
                    value={candidate.score} 
                    className="h-2"
                    style={{
                      '--progress-color': getScoreProgressColor(candidate.score)
                    } as React.CSSProperties}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Scores Detalhados */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm">Análise Detalhada</h4>
                  
                  {/* Score Técnico (0-40) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Match Técnico (0-40)</span>
                      <span className={`text-xs font-medium ${getScoreColor(calculatePercentage(candidate.technical_match_score, 40))}`}>
                        {candidate.technical_match_score}/40
                      </span>
                    </div>
                    <Progress 
                      value={calculatePercentage(candidate.technical_match_score, 40)} 
                      className="h-1.5"
                      style={{
                        '--progress-color': getScoreProgressColor(calculatePercentage(candidate.technical_match_score, 40))
                      } as React.CSSProperties}
                    />
                  </div>

                  {/* Score de Negócio (0-20) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Fit de Negócio (0-20)</span>
                      <span className={`text-xs font-medium ${getScoreColor(calculatePercentage(candidate.business_fit_score, 20))}`}>
                        {candidate.business_fit_score}/20
                      </span>
                    </div>
                    <Progress 
                      value={calculatePercentage(candidate.business_fit_score, 20)} 
                      className="h-1.5"
                      style={{
                        '--progress-color': getScoreProgressColor(calculatePercentage(candidate.business_fit_score, 20))
                      } as React.CSSProperties}
                    />
                  </div>

                  {/* Score Comportamental (0-10) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Match Comportamental (0-10)</span>
                      <span className={`text-xs font-medium ${getScoreColor(calculatePercentage(candidate.behavioral_match_score, 10))}`}>
                        {candidate.behavioral_match_score}/10
                      </span>
                    </div>
                    <Progress 
                      value={calculatePercentage(candidate.behavioral_match_score, 10)} 
                      className="h-1.5"
                      style={{
                        '--progress-color': getScoreProgressColor(calculatePercentage(candidate.behavioral_match_score, 10))
                      } as React.CSSProperties}
                    />
                  </div>
                </div>

                <Separator />

                {/* Resumo da Análise com Ler Mais Individual */}
                {candidate.analysis_summary && (
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-2">Resumo da IA</h4>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {isSectionExpanded(`summary_${candidate.analysisId}`) ? (
                        <p>{candidate.analysis_summary}</p>
                      ) : (
                        <p className="line-clamp-3">{candidate.analysis_summary}</p>
                      )}
                      
                      {candidate.analysis_summary.length > 120 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-purple-600 hover:text-purple-700 p-0 h-auto mt-2"
                          onClick={() => toggleSectionExpansion(`summary_${candidate.analysisId}`)}
                        >
                          {isSectionExpanded(`summary_${candidate.analysisId}`) ? (
                            <>
                              <ChevronUp className="w-3 h-3 mr-1" />
                              Ver menos
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />
                              Ler mais
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Experiências com Ler Mais Individual */}
                {candidate.candidate.experiences.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2M4 6a2 2 0 00-2 2v7a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2z" />
                      </svg>
                      Experiência
                    </h4>
                    <div className="space-y-2">
                      {candidate.candidate.experiences.slice(0, 2).map((exp) => (
                        <div key={exp.id} className="text-sm">
                          <div className="font-medium text-gray-800">{exp.title}</div>
                          <div className="text-gray-600 text-xs">
                            {formatExperiencePeriod(exp.startDate, exp.endDate)}
                          </div>
                          {exp.description && (
                            <div className="text-gray-600 mt-1">
                              {isSectionExpanded(`exp_${exp.id}`) ? (
                                <p className="text-xs">{exp.description}</p>
                              ) : (
                                <p className="text-xs line-clamp-2">{exp.description}</p>
                              )}
                              
                              {/* Botão Ler Mais individual para cada experiência */}
                              {exp.description.length > 100 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-purple-600 hover:text-purple-700 p-0 h-auto mt-1"
                                  onClick={() => toggleSectionExpansion(`exp_${exp.id}`)}
                                >
                                  {isSectionExpanded(`exp_${exp.id}`) ? (
                                    <>
                                      <ChevronUp className="w-3 h-3 mr-1" />
                                      Ver menos
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3 h-3 mr-1" />
                                      Ler mais
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {candidate.candidate.experiences.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{candidate.candidate.experiences.length - 2} outras experiências
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Skills */}
                {candidate.candidate.user_skills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate.candidate.user_skills.slice(0, 5).map((userSkill) => (
                        <Badge key={userSkill.id} variant="outline" className="text-xs">
                          {userSkill.skill.name}
                        </Badge>
                      ))}
                      {candidate.candidate.user_skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.candidate.user_skills.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Áreas */}
                {candidate.candidate.user_areas.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Áreas de Atuação
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate.candidate.user_areas.map((userArea) => (
                        <Badge key={userArea.id} variant="secondary" className="text-xs">
                          {userArea.area.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-lg font-medium">Nenhum candidato encontrado</p>
                <p className="text-sm">Tente ajustar os critérios de busca</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
