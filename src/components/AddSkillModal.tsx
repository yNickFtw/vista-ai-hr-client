import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSkillQueries } from '@/api/skill/skill.query';
import { useSkillMutation } from '@/api/skill/skill.mutation';
import { useDebounce } from '@/hooks/use-debounce';
import type { Skill } from '@/types/skill.types';

export function AddSkillModal() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [,setSelectedSkill] = useState<Skill | null>(null);
  const skillsListRef = useRef<HTMLDivElement>(null);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { useListSkillsQuery } = useSkillQueries();
  const { useAddSkillMutation } = useSkillMutation();
  
  const { data: skillsData, isLoading, error } = useListSkillsQuery(page, limit, debouncedSearch);
  const addSkillMutation = useAddSkillMutation();

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
    scrollToTop();
  }, [debouncedSearch]);

  const handleSkillSelect = (skill: Skill) => {
    addSkillMutation.mutate(skill.id, {
      onSuccess: () => {
        setOpen(false);
        setSearchTerm('');
        setSelectedSkill(null);
        setPage(1);
      }
    });
  };

  const scrollToTop = () => {
    if (skillsListRef.current) {
      skillsListRef.current.scrollTop = 0;
    }
  };

  const handleNextPage = () => {
    if (skillsData && page < skillsData.totalPages) {
      setPage(page + 1);
      scrollToTop();
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      scrollToTop();
    }
  };

  const skills = skillsData?.skills || [];
  const totalPages = skillsData?.totalPages || 0;
  const total = skillsData?.total || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Adicionar Competência</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* Search Input */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar competências..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results Info */}
          {skills.length > 0 && (
            <div className="text-sm text-muted-foreground flex-shrink-0">
              Mostrando {skills.length} de {total} competências
            </div>
          )}

          {/* Skills List */}
          <div ref={skillsListRef} className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                Erro ao carregar competências
              </div>
            ) : skills.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {skills.map((skill: Skill) => (
                  <div
                    key={skill.id}
                    className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                    onClick={() => handleSkillSelect(skill)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {skill.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {skill.name}
                        </h4>
                        {skill.description && (
                          <p className="text-sm text-muted-foreground">{skill.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  {searchTerm ? 'Nenhuma competência encontrada' : 'Nenhuma competência disponível'}
                </p>
                {searchTerm && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Tente ajustar os termos de pesquisa.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t flex-shrink-0">
              <div className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
