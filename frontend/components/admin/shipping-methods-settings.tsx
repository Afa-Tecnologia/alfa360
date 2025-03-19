"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ShippingMethodsSettings() {
  const { toast } = useToast()
  const [shippingMethods, setShippingMethods] = useState({
    correios: {
      enabled: true,
      username: "usuario_correios",
      password: "senha_correios",
      services: {
        sedex: {
          enabled: true,
          additionalDays: 0,
          markup: 0,
        },
        pac: {
          enabled: true,
          additionalDays: 0,
          markup: 0,
        },
      },
    },
    freeShipping: {
      enabled: true,
      minOrderValue: 300,
    },
    fixedRate: {
      enabled: true,
      name: "Entrega Expressa",
      price: 35,
      estimatedDays: "1-2",
    },
  })

  const handleToggle = (method: string, value: boolean) => {
    setShippingMethods((prev) => ({
      ...prev,
      [method]: {
        ...prev[method as keyof typeof prev],
        enabled: value,
      },
    }))
  }

  const handleServiceToggle = (service: string, value: boolean) => {
    setShippingMethods((prev) => ({
      ...prev,
      correios: {
        ...prev.correios,
        services: {
          ...prev.correios.services,
          [service]: {
            ...prev.correios.services[service as keyof typeof prev.correios.services],
            enabled: value,
          },
        },
      },
    }))
  }

  const handleChange = (method: string, field: string, value: string | number | boolean) => {
    setShippingMethods((prev) => ({
      ...prev,
      [method]: {
        ...prev[method as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleServiceChange = (service: string, field: string, value: string | number | boolean) => {
    setShippingMethods((prev) => ({
      ...prev,
      correios: {
        ...prev.correios,
        services: {
          ...prev.correios.services,
          [service]: {
            ...prev.correios.services[service as keyof typeof prev.correios.services],
            [field]: value,
          },
        },
      },
    }))
  }

  const handleSave = () => {
    console.log("Métodos de envio:", shippingMethods)

    toast({
      title: "Configurações salvas",
      description: "As configurações de envio foram atualizadas com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base">Correios</CardTitle>
            <CardDescription>Calcular frete com base nas tabelas dos Correios</CardDescription>
          </div>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="correios"
              checked={shippingMethods.correios.enabled}
              onCheckedChange={(value) => handleToggle("correios", value)}
            />
            <Label htmlFor="correios">Habilitar cálculo de frete via Correios</Label>
          </div>

          {shippingMethods.correios.enabled && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correiosUsername">Usuário</Label>
                  <Input
                    id="correiosUsername"
                    value={shippingMethods.correios.username}
                    onChange={(e) => handleChange("correios", "username", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correiosPassword">Senha</Label>
                  <Input
                    id="correiosPassword"
                    type="password"
                    value={shippingMethods.correios.password}
                    onChange={(e) => handleChange("correios", "password", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Serviços</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sedex"
                        checked={shippingMethods.correios.services.sedex.enabled}
                        onCheckedChange={(value) => handleServiceToggle("sedex", value)}
                      />
                      <Label htmlFor="sedex">SEDEX</Label>
                    </div>

                    {shippingMethods.correios.services.sedex.enabled && (
                      <div className="flex items-center space-x-4">
                        <div className="space-x-2">
                          <Label htmlFor="sedexAdditionalDays" className="text-xs">
                            Dias adicionais
                          </Label>
                          <Input
                            id="sedexAdditionalDays"
                            type="number"
                            min="0"
                            value={shippingMethods.correios.services.sedex.additionalDays}
                            onChange={(e) =>
                              handleServiceChange("sedex", "additionalDays", Number.parseInt(e.target.value))
                            }
                            className="w-16 h-8"
                          />
                        </div>
                        <div className="space-x-2">
                          <Label htmlFor="sedexMarkup" className="text-xs">
                            Acréscimo (%)
                          </Label>
                          <Input
                            id="sedexMarkup"
                            type="number"
                            min="0"
                            value={shippingMethods.correios.services.sedex.markup}
                            onChange={(e) => handleServiceChange("sedex", "markup", Number.parseInt(e.target.value))}
                            className="w-16 h-8"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pac"
                        checked={shippingMethods.correios.services.pac.enabled}
                        onCheckedChange={(value) => handleServiceToggle("pac", value)}
                      />
                      <Label htmlFor="pac">PAC</Label>
                    </div>

                    {shippingMethods.correios.services.pac.enabled && (
                      <div className="flex items-center space-x-4">
                        <div className="space-x-2">
                          <Label htmlFor="pacAdditionalDays" className="text-xs">
                            Dias adicionais
                          </Label>
                          <Input
                            id="pacAdditionalDays"
                            type="number"
                            min="0"
                            value={shippingMethods.correios.services.pac.additionalDays}
                            onChange={(e) =>
                              handleServiceChange("pac", "additionalDays", Number.parseInt(e.target.value))
                            }
                            className="w-16 h-8"
                          />
                        </div>
                        <div className="space-x-2">
                          <Label htmlFor="pacMarkup" className="text-xs">
                            Acréscimo (%)
                          </Label>
                          <Input
                            id="pacMarkup"
                            type="number"
                            min="0"
                            value={shippingMethods.correios.services.pac.markup}
                            onChange={(e) => handleServiceChange("pac", "markup", Number.parseInt(e.target.value))}
                            className="w-16 h-8"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base">Frete Grátis</CardTitle>
            <CardDescription>Ofereça frete grátis para pedidos acima de um valor mínimo</CardDescription>
          </div>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="freeShipping"
              checked={shippingMethods.freeShipping.enabled}
              onCheckedChange={(value) => handleToggle("freeShipping", value)}
            />
            <Label htmlFor="freeShipping">Habilitar frete grátis</Label>
          </div>

          {shippingMethods.freeShipping.enabled && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="minOrderValue">Valor mínimo do pedido (R$)</Label>
              <Input
                id="minOrderValue"
                type="number"
                min="0"
                step="0.01"
                value={shippingMethods.freeShipping.minOrderValue}
                onChange={(e) => handleChange("freeShipping", "minOrderValue", Number.parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base">Taxa Fixa</CardTitle>
            <CardDescription>Ofereça envio com taxa fixa</CardDescription>
          </div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="fixedRate"
              checked={shippingMethods.fixedRate.enabled}
              onCheckedChange={(value) => handleToggle("fixedRate", value)}
            />
            <Label htmlFor="fixedRate">Habilitar taxa fixa</Label>
          </div>

          {shippingMethods.fixedRate.enabled && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="fixedRateName">Nome</Label>
                <Input
                  id="fixedRateName"
                  value={shippingMethods.fixedRate.name}
                  onChange={(e) => handleChange("fixedRate", "name", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fixedRatePrice">Preço (R$)</Label>
                  <Input
                    id="fixedRatePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={shippingMethods.fixedRate.price}
                    onChange={(e) => handleChange("fixedRate", "price", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fixedRateEstimatedDays">Prazo estimado (dias)</Label>
                  <Input
                    id="fixedRateEstimatedDays"
                    value={shippingMethods.fixedRate.estimatedDays}
                    onChange={(e) => handleChange("fixedRate", "estimatedDays", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </div>
    </div>
  )
}

