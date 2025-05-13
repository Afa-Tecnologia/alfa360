'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCcw } from 'lucide-react';
import { TiposDeNegociosTab } from '@/components/dashboard-v2/configuracoes/tipos-negocios-tab';
import { TiposDeProdutosTab } from '@/components/dashboard-v2/configuracoes/tipos-produtos-tab';
import { ConfigDoNegocioTab } from '@/components/dashboard-v2/configuracoes/config-negocio-tab';
import { MetodosPagamentoTab } from '@/components/dashboard-v2/configuracoes/metodos-pagamento-tab';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('config-negocio');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie as configurações do seu negócio
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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
        defaultValue="config-negocio"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <TabsList className="bg-muted/60 w-full sm:w-auto">
            {/* <TabsTrigger
              value="tipos-negocios"
              className="flex-1 sm:flex-initial"
            >
              Tipos de Negócios
            </TabsTrigger> */}
            <TabsTrigger
              value="config-negocio"
              className="flex-1 sm:flex-initial"
            >
              Config. do Negócio
            </TabsTrigger>
            <TabsTrigger
              value="tipos-produtos"
              className="flex-1 sm:flex-initial"
            >
              Tipos de Produtos
            </TabsTrigger>
            <TabsTrigger
              value="metodos-pagamento"
              className="flex-1 sm:flex-initial"
            >
              Métodos de Pagamento
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

        {/* <TabsContent value="tipos-negocios" className="space-y-6">
          <TiposDeNegociosTab key={`tipos-negocios-${refreshKey}`} />
        </TabsContent> */}

        <TabsContent value="config-negocio" className="space-y-6">
          <ConfigDoNegocioTab key={`config-negocio-${refreshKey}`} />
        </TabsContent>

        <TabsContent value="tipos-produtos" className="space-y-6">
          <TiposDeProdutosTab key={`tipos-produtos-${refreshKey}`} />
        </TabsContent>

        <TabsContent value="metodos-pagamento" className="space-y-6">
          <MetodosPagamentoTab key={`metodos-pagamento-${refreshKey}`} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
