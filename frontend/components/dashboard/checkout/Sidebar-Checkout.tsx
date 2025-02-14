"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";

const paymentMethods = [
  { id: "dinheiro", label: "Dinheiro", icon: "\uD83D\uDCB5" },
  { id: "cartao", label: "Cartão", icon: "\uD83D\uDCB3" },
  { id: "transferencia", label: "Transferência bancária", icon: "\uD83C\uDFE6" },
];

export function SidebarCheckout() {
  const [selectedMethod, setSelectedMethod] = useState("dinheiro");
  const [selectedPayments, setSelectedPayments] = useState(1);
  const { cart, incrementQuantity, decrementQuantity } = useCartStore();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir Pagamento</Button>
      </SheetTrigger>
      <SheetContent className="max-w-margin!">
        <SheetHeader>
          <SheetTitle>Pagamento</SheetTitle>
        </SheetHeader>

        {/* Alternância entre Pago e Crédito */}
        <div className="flex space-x-2 my-4">
          <Tabs defaultValue="checkout" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pago">Pago</TabsTrigger>
              <TabsTrigger value="checkout">Checkout</TabsTrigger>
            </TabsList>
         
       
        <TabsContent value="pago">
       
          {/* Data da venda */}
          <div className="mb-4">
            <Label>Data da venda *</Label>
            <Input type="date" className="w-full" />
          </div>

          {/* Seleção de Cliente */}
          <div className="mb-4">
            <Label>Cliente *</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cliente1">Cliente 1</SelectItem>
                <SelectItem value="cliente2">Cliente 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Adicionar desconto */}
          <Button variant="link" className="mb-4">+ Adicionar desconto</Button>
          {/* Método de pagamento */}
          <div className="mb-4">
            <Label>Selecione o método de pagamento *</Label>
            <div className="flex space-x-2">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={selectedMethod === method.id ? "default" : "outline"}
                  className={cn("w-full flex items-center gap-2", selectedMethod === method.id && "border-green-500")}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <span>{method.icon}</span> {method.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Resumo do pagamento */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <SheetClose asChild>
                <Button variant="default">Criar venda</Button>
              </SheetClose>
              <span className="text-lg font-bold">R$ 100</span>
            </div>
          </div>
      
        </TabsContent>
        <TabsContent value="checkout">
  <div className="space-y-4 max-h-[400px] overflow-y-auto">
    {cart.map((product) => (
      <div key={product.id} className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center space-x-2">
          {/* <Image src="/placeholder.svg" alt={product.name} width={50} height={50} /> */}
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => decrementQuantity(product.id)}>-</Button>
          <span>{product.quantity}</span>
          <Button variant="outline" size="icon" onClick={() => incrementQuantity(product.id)}>+</Button>
        </div>
        <div className="font-bold">R$ {(parseFloat(product.selling_price) * product.quantity).toFixed(2)}</div>
      </div>
    ))}
  </div>

  {/* Resumo do Pagamento */}
  <div className="border-t pt-4">
    <div className="flex justify-between items-center">
      <span>Total</span>
      <span className="text-lg font-bold">R$ {cart.reduce((acc, item) => acc + parseFloat(item.selling_price) * item.quantity, 0).toFixed(2)}</span>
    </div>
    <Button className="w-full mt-4">Finalizar Compra</Button>
  </div>
</TabsContent>
        </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
