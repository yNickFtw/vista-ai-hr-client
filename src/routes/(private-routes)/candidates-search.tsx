import { useState } from 'react';
import { CandidatesResults } from '../../components/CandidatesResults';
import type { User } from '../../types/user.types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';

// Dados de exemplo para demonstração
const mockUsers: User[] = [
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
  },
  {
    id: '2',
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
];

const mockTextResult = `Com base na sua busca por desenvolvedores com experiência em React e TypeScript, identifiquei 2 candidatos altamente qualificados:

1. **João Silva** - Desenvolvedor Full Stack Senior com 4+ anos de experiência, incluindo liderança de equipe. Possui forte conhecimento em React, TypeScript, Node.js e PostgreSQL. Sua experiência como líder técnico demonstra capacidade de mentoria e coordenação de projetos.

2. **Maria Santos** - Tech Lead com foco em Python/Django, mas com habilidades transferíveis para o ecossistema JavaScript. Sua experiência em liderança técnica e conhecimento em DevOps seria valiosa para projetos que requerem arquitetura robusta e práticas de CI/CD.

Ambos os candidatos demonstram perfil sênior adequado para posições de liderança técnica.`;

function CandidatesSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{ textResult: string; users: User[] } | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulação de busca - em produção, aqui você faria a chamada para sua API
    setTimeout(() => {
      setSearchResults({
        textResult: mockTextResult,
        users: mockUsers
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Busca de Candidatos
        </h1>
        <p className="text-gray-600">
          Encontre os melhores candidatos usando IA para análise e recomendação
        </p>
      </div>

      {/* Formulário de Busca */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Critérios de Busca</CardTitle>
          <CardDescription>
            Descreva o perfil do candidato que você está procurando
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Ex: Desenvolvedor React Senior com experiência em TypeScript e Node.js"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !searchQuery.trim()}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {searchResults && (
        <CandidatesResults 
          textResult={searchResults.textResult}
          users={searchResults.users}
        />
      )}

      {/* Estado inicial */}
      {!searchResults && !isLoading && (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-gray-500">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhuma busca realizada</p>
              <p className="text-sm">Digite os critérios de busca acima para encontrar candidatos</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const Route = createFileRoute('/(private-routes)/candidates-search')({
  component: CandidatesSearchPage,
});
