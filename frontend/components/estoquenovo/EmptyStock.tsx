'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { Package, PlusCircle, ShoppingCart } from 'lucide-react';

export default function EmptyStock() {
  const setIsOpenCreate = useUIStore((state) => state.setIsOpenCreate);

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-600" />
            Nenhum Produto Cadastrado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 text-lg">
            Comece a gerenciar seu estoque cadastrando seus produtos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-800">
                      Controle de Estoque
                    </h3>
                    <p className="text-sm text-blue-600">
                      Acompanhe a quantidade de produtos disponíveis e gerencie
                      seu inventário de forma eficiente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">
                      Gestão de Produtos
                    </h3>
                    <p className="text-sm text-green-600">
                      Cadastre produtos com detalhes como preço, descrição e
                      quantidade em estoque.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setIsOpenCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Cadastrar Primeiro Produto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
