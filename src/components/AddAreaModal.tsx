import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Search, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { useAreaQuery } from '@/api/area/area.query';
import { useAreaMutation } from '@/api/area/area.mutation';
import { useDebounce } from '@/hooks/use-debounce';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Area } from '@/types/area.types';

export function AddAreaModal() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const areasListRef = useRef<HTMLDivElement>(null);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { useListAreasQuery } = useAreaQuery();
  const { useSetUserAreaMutation } = useAreaMutation();
  
  const { data: areasData, isLoading, error } = useListAreasQuery(page, limit, debouncedSearch);
  const setUserAreaMutation = useSetUserAreaMutation();

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
    scrollToTop();
  }, [debouncedSearch]);

  const handleAreaSelect = (area: Area) => {
    setSelectedArea(area);
    setShowConfirmation(true);
  };

  const handleConfirmArea = () => {
    if (selectedArea) {
      setUserAreaMutation.mutate(selectedArea.id, {
        onSuccess: () => {
          setOpen(false);
          setSearchTerm('');
          setSelectedArea(null);
          setPage(1);
          setShowConfirmation(false);
        }
      });
    }
  };

  const scrollToTop = () => {
    if (areasListRef.current) {
      areasListRef.current.scrollTop = 0;
    }
  };

  const handleNextPage = () => {
    if (areasData && page < areasData.totalPages) {
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

  const areas = areasData?.areas || [];
  const totalPages = areasData?.totalPages || 0;
  const total = areasData?.total || 0;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Definir Área
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Definir Área de Atuação</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col space-y-4 min-h-0">
            {/* Search Input */}
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar áreas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Results Info */}
            {areas.length > 0 && (
              <div className="text-sm text-muted-foreground flex-shrink-0">
                Mostrando {areas.length} de {total} áreas
              </div>
            )}

            {/* Areas List */}
            <div ref={areasListRef} className="flex-1 overflow-y-auto space-y-2 min-h-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-muted-foreground">
                  Erro ao carregar áreas
                </div>
              ) : areas.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {areas.map((area: Area) => (
                    <div
                      key={area.id}
                      className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                      onClick={() => handleAreaSelect(area)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {area.name}
                          </h4>
                          {area.description && (
                            <p className="text-sm text-muted-foreground">{area.description}</p>
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
                    {searchTerm ? 'Nenhuma área encontrada' : 'Nenhuma área disponível'}
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

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Seleção</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja definir <strong>{selectedArea?.name}</strong> como sua área de atuação?
              <br />
              <span className="text-sm text-muted-foreground">
                Esta ação substituirá sua área atual, se houver.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmArea}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
