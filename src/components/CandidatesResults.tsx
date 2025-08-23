import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { type User } from '../types/user.types';

interface CandidatesResultsProps {
  textResult: string;
  users: User[];
}

export const CandidatesResults: React.FC<CandidatesResultsProps> = ({ textResult, users }) => {
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

  return (
    <div className="space-y-6">
      {/* Resultado da IA */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <svg
              className="w-5 h-5"
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
            Análise da IA
          </CardTitle>
          <CardDescription className="text-blue-700">
            Recomendações baseadas na sua busca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-blue-800">
            <p className="whitespace-pre-wrap leading-relaxed">{textResult}</p>
          </div>
        </CardContent>
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900">
                  {user.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {user.email}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Experiências */}
                {user.experiences.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2M4 6a2 2 0 00-2 2v7a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2z" />
                      </svg>
                      Experiência
                    </h4>
                    <div className="space-y-2">
                      {user.experiences.slice(0, 2).map((exp) => (
                        <div key={exp.id} className="text-sm">
                          <div className="font-medium text-gray-800">{exp.title}</div>
                          <div className="text-gray-600 text-xs">
                            {formatExperiencePeriod(exp.startDate, exp.endDate)}
                          </div>
                          {exp.description && (
                            <div className="text-gray-600 mt-1 line-clamp-2">
                              {exp.description}
                            </div>
                          )}
                        </div>
                      ))}
                      {user.experiences.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{user.experiences.length - 2} outras experiências
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Skills */}
                {user.user_skills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {user.user_skills.slice(0, 5).map((userSkill) => (
                        <Badge key={userSkill.id} variant="outline" className="text-xs">
                          {userSkill.skill.name}
                        </Badge>
                      ))}
                      {user.user_skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.user_skills.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Áreas */}
                {user.user_areas.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Áreas de Atuação
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {user.user_areas.map((userArea) => (
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
