"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Banknote, QrCode } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function PaymentMethodsSettings() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState({
    creditCard: {
      enabled: true,
      merchantId: "123456789",
      apiKey: "sk_test_abcdefghijklmnopqrstuvwxyz",
      installments: true,
      maxInstallments: 6,
    },
    pix: {
      enabled: true,
      key: "12345678-1234-1234-1234-123456789012",
      merchantName: "Les Amis Moda",
    },
    boleto: {
      enabled: true,
      merchantId: "987654321",
      apiKey: "sk_test_zyxwvutsrqponmlkjihgfedcba",
    },
  })

  const handleToggle = (method: string, value: boolean) => {
    setPaymentMethods((prev) => ({
      ...prev,
      [method]: {
        ...prev[method as keyof typeof prev],
        enabled: value,
      },
    }))
  }

  const handleChange = (method: string, field: string, value: string | number | boolean) => {
    setPaymentMethods((prev) => ({
      ...prev,
      [method]: {
        ...prev[method as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleSave = () => {
    console.log("Métodos de pagamento:", paymentMethods)

    toast({
      title: "Configurações salvas",
      description: "As configurações de pagamento foram atualizadas com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base">Cartão de Crédito</CardTitle>
            <CardDescription>Aceite pagamentos com cartão de crédito</CardDescription>
          </div>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="creditCard"
              checked={paymentMethods.creditCard.enabled}
              onCheckedChange={(value) => handleToggle("creditCard", value)}
            />
            <Label htmlFor="creditCard">Habilitar pagamento com cartão de crédito</Label>
          </div>

          {paymentMethods.creditCard.enabled && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditCardMerchantId">ID do Comerciante</Label>
                  <Input
                    id="creditCardMerchantId"
                    value={paymentMethods.creditCard.merchantId}
                    onChange={(e) => handleChange("creditCard", "merchantId", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditCardApiKey">Chave API</Label>
                  <Input
                    id="creditCardApiKey"
                    type="password"
                    value={paymentMethods.creditCard.apiKey}
                    onChange={(e) => handleChange("creditCard", "apiKey", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="installments"
                    checked={paymentMethods.creditCard.installments}
                    onCheckedChange={(value) => handleChange("creditCard", "installments", value)}
                  />
                  <Label htmlFor="installments">Permitir parcelamento</Label>
                </div>
                {paymentMethods.creditCard.installments && (
                  <div className="pt-2">
                    <Label htmlFor="maxInstallments">Número máximo de parcelas</Label>
                    <Input
                      id="maxInstallments"
                      type="number"
                      min="1"
                      max="12"
                      value={paymentMethods.creditCard.maxInstallments}
                      onChange={(e) => handleChange("creditCard", "maxInstallments", Number.parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base">PIX</CardTitle>
            <CardDescription>Aceite pagamentos instantâneos com PIX</CardDescription>
          </div>
          <QrCode className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="pix"
              checked={paymentMethods.pix.enabled}
              onCheckedChange={(value) => handleToggle("pix", value)}
            />
            <Label htmlFor="pix">Habilitar pagamento com PIX</Label>
          </div>

          {paymentMethods.pix.enabled && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave PIX</Label>
                  <Input
                    id="pixKey"
                    value={paymentMethods.pix.key}
                    onChange={(e) => handleChange("pix", "key", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pixMerchantName">Nome do Recebedor</Label>
                  <Input
                    id="pixMerchantName"
                    value={paymentMethods.pix.merchantName}
                    onChange={(e) => handleChange("pix", "merchantName", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base">Boleto Bancário</CardTitle>
            <CardDescription>Aceite pagamentos com boleto bancário</CardDescription>
          </div>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="boleto"
              checked={paymentMethods.boleto.enabled}
              onCheckedChange={(value) => handleToggle("boleto", value)}
            />
            <Label htmlFor="boleto">Habilitar pagamento com boleto</Label>
          </div>

          {paymentMethods.boleto.enabled && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="boletoMerchantId">ID do Comerciante</Label>
                  <Input
                    id="boletoMerchantId"
                    value={paymentMethods.boleto.merchantId}
                    onChange={(e) => handleChange("boleto", "merchantId", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boletoApiKey">Chave API</Label>
                  <Input
                    id="boletoApiKey"
                    type="password"
                    value={paymentMethods.boleto.apiKey}
                    onChange={(e) => handleChange("boleto", "apiKey", e.target.value)}
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

