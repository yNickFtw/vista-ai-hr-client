import React from 'react';
import { CandidatesResults } from './CandidatesResults';
import type { AnalysisResponse } from '../types/analysis.types';

// Dados de exemplo para demonstração usando a nova estrutura da API
const mockAnalysisResponse: AnalysisResponse = {
  analysis: { id: 'example_001' },
  users: [
    {
      analysisId: 'ac_ex_001',
      candidateId: 'user_ex_001',
      analysis_summary: 'Candidato excepcional com perfil técnico sólido e experiência em liderança. Excelente match para posições de Tech Lead ou Senior Developer.',
      score: 95,
      technical_match_score: 98,
      business_fit_score: 92,
      behavioral_match_score: 95,
      candidate: {
        id: 'user_ex_001',
        email: 'joao.silva@email.com',
        name: 'João Silva',
        experiences: [
          {
            id: 'exp1',
            title: 'Desenvolvedor Full Stack Senior',
            description: 'Desenvolvimento de aplicações web usando React, Node.js e PostgreSQL. Liderança de equipe de 5 desenvolvedores.',
            startDate: '2022-01-01',
            endDate: '2024-01-01'
          },
          {
            id: 'exp2',
            title: 'Desenvolvedor Frontend',
            description: 'Desenvolvimento de interfaces responsivas com React e TypeScript.',
            startDate: '2020-03-01',
            endDate: '2021-12-31'
          }
        ],
        user_skills: [
          { id: 'us1', skill: { id: 's1', name: 'React', description: 'Biblioteca JavaScript para interfaces' } },
          { id: 'us2', skill: { id: 's2', name: 'TypeScript', description: 'Superset do JavaScript' } },
          { id: 'us3', skill: { id: 's3', name: 'Node.js', description: 'Runtime JavaScript' } },
          { id: 'us4', skill: { id: 's4', name: 'PostgreSQL', description: 'Banco de dados relacional' } }
        ],
        user_areas: [
          { id: 'ua1', area: { id: 'a1', name: 'Desenvolvimento Web', description: 'Aplicações web e sistemas' } },
          { id: 'ua2', area: { id: 'a2', name: 'Frontend', description: 'Interfaces de usuário' } }
        ],
        user_summary: null
      }
    },
    {
      analysisId: 'ac_ex_002',
      candidateId: 'user_ex_002',
      analysis_summary: 'Perfil técnico sólido com forte experiência em Python e arquitetura de sistemas. Excelente para posições de Backend Senior.',
      score: 87,
      technical_match_score: 85,
      business_fit_score: 90,
      behavioral_match_score: 88,
      candidate: {
        id: 'user_ex_002',
        email: 'maria.santos@email.com',
        name: 'Maria Santos',
        experiences: [
          {
            id: 'exp3',
            title: 'Tech Lead',
            description: 'Liderança técnica de equipe de desenvolvimento, arquitetura de sistemas e mentoria.',
            startDate: '2023-01-01'
          }
        ],
        user_skills: [
          { id: 'us5', skill: { id: 's5', name: 'Python', description: 'Linguagem de programação' } },
          { id: 'us6', skill: { id: 's6', name: 'Django', description: 'Framework web Python' } },
          { id: 'us7', skill: { id: 's7', name: 'AWS', description: 'Serviços em nuvem' } }
        ],
        user_areas: [
          { id: 'ua3', area: { id: 'a3', name: 'Backend', description: 'Servidores e APIs' } },
          { id: 'ua4', area: { id: 'a4', name: 'DevOps', description: 'Operações de desenvolvimento' } }
        ],
        user_summary: null
      }
    }
  ]
};

export const CandidatesResultsExample: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Exemplo de Resultados
        </h1>
        <p className="text-gray-600">
          Esta é uma demonstração da nova interface de análise de candidatos
        </p>
      </div>

      <CandidatesResults
        analysisResponse={mockAnalysisResponse}
      />
    </div>
  );
};
