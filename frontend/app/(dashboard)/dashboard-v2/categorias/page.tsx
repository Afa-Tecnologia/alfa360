'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCategoryStore } from '@/stores/categoryStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw, Layers } from 'lucide-react';
import { CategoriasDashboard } from '@/components/dashboard-v2/categorias/dashboard';
import { CategoryDialog } from '@/components/dashboard-v2/categorias/category-dialog';

export default function CategoriasPage() {
  const { categories, isLoading, error, fetchCategories } = useCategoryStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('lista');

  // Estado para controlar os diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Função para abrir o diálogo de edição
  const handleEdit = (category: any) => {
    setCategoryToEdit(category);
    setIsEditDialogOpen(true);
  };

  // Função para atualizar a lista após criar/editar
  const handleOperationSuccess = async () => {
    await fetchCategories();
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[250px]" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert variant="destructive" className="my-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Layers className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Categorias</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie as categorias de produtos da sua loja
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            Nova Categoria
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="hidden sm:flex"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="lista"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <TabsList className="bg-muted/60 w-full sm:w-auto">
            <TabsTrigger value="lista" className="flex-1 sm:flex-initial">
              Lista
            </TabsTrigger>
            <TabsTrigger
              value="estatisticas"
              className="flex-1 sm:flex-initial"
            >
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="w-full sm:hidden"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        <TabsContent value="lista" className="space-y-6">
          <CategoriasDashboard
            categories={categories}
            onEdit={handleEdit}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="estatisticas">
          <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
            <div className="text-center p-6">
              <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">
                Estatísticas de Categorias
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Esta funcionalidade estará disponível em breve. Aqui você poderá
                visualizar estatísticas sobre suas categorias e produtos
                relacionados.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo para criar nova categoria */}
      <CategoryDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleOperationSuccess}
      />

      {/* Diálogo para editar categoria */}
      {categoryToEdit && (
        <CategoryDialog
          category={categoryToEdit}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleOperationSuccess}
        />
      )}
    </motion.div>
  );
}
