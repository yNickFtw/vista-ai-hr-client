import React from 'react';
import { CandidatesResults } from './CandidatesResults';
import type { User } from '../types/user.types';

// Dados de exemplo para demonstração
const exampleUsers: User[] = [
  {
    id: '1',
    email: 'joao.silva@email.com',
    name: 'João Silva',
    experiences: [
      {
        id: 'exp1',
        title: 'Desenvolvedor Full Stack Senior',
        description: 'Desenvolvimento de aplicações web usando React, Node.js e PostgreSQL. Liderança de equipe de 5 desenvolvedores.',
        startDate: '2022-01-01',
        endDate: '2024-01-01'
      }
    ],
    user_skills: [
      { id: 'us1', skill: { id: 's1', name: 'React', description: 'Biblioteca JavaScript' } },
      { id: 'us2', skill: { id: 's2', name: 'TypeScript', description: 'Superset do JavaScript' } }
    ],
    user_areas: [
      { id: 'ua1', area: { id: 'a1', name: 'Desenvolvimento Web', description: 'Aplicações web' } }
    ],
    user_summary: null
  }
];

const exampleTextResult = `Com base na sua busca por desenvolvedores React, identifiquei 1 candidato altamente qualificado:

**João Silva** - Desenvolvedor Full Stack Senior com experiência em React, TypeScript e Node.js. Sua experiência como líder técnico demonstra capacidade de mentoria e coordenação de projetos.`;

export const CandidatesResultsExample: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Exemplo de Resultados</h2>
      <CandidatesResults 
        textResult={exampleTextResult}
        users={exampleUsers}
      />
    </div>
  );
};
