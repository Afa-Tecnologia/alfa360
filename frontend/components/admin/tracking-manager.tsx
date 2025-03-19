"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Send, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TrackingManagerProps {
  pedidoId: string | any
  rastreamento?: string
  metodoEnvio?: string
  status: string
}

export function TrackingManager({ pedidoId, rastreamento, metodoEnvio, status }: TrackingManagerProps) {
  const [trackingCode, setTrackingCode] = useState(rastreamento || "")
  const [shippingMethod, setShippingMethod] = useState(metodoEnvio || "sedex")
  const [isEditing, setIsEditing] = useState(!rastreamento)

  const handleSave = () => {
    console.log(`Salvando código de rastreio ${trackingCode} para o pedido ${pedidoId}`)
    // Aqui você faria uma chamada para a API para atualizar o código de rastreio
    setIsEditing(false)
  }

  const handleSendNotification = () => {
    console.log(`Enviando notificação para o cliente sobre o pedido ${pedidoId}`)
    // Aqui você faria uma chamada para a API para enviar a notificação
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Informações de Rastreamento
        </CardTitle>
        <CardDescription>Gerencie o código de rastreio e notifique o cliente sobre o envio</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="shipping-method" className="text-sm font-medium">
                Método de Envio
              </label>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger id="shipping-method">
                  <SelectValue placeholder="Selecione o método de envio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedex">Sedex</SelectItem>
                  <SelectItem value="pac">PAC</SelectItem>
                  <SelectItem value="transportadora">Transportadora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="tracking-code" className="text-sm font-medium">
                Código de Rastreio
              </label>
              <Input
                id="tracking-code"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Digite o código de rastreio"
              />
            </div>
          </div>
        ) : rastreamento ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Código de Rastreio</p>
                <p className="text-lg font-bold">{rastreamento}</p>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500">
                {status === "Enviado" ? "Enviado" : "Entregue"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Método de Envio</p>
              <p>{metodoEnvio}</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm">
                Status atual: <span className="font-medium">{status}</span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://rastreamento.correios.com.br/app/index.php`, "_blank")}
              >
                Verificar Status
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <AlertTriangle className="h-10 w-10 mb-2" />
            <p>Nenhum código de rastreio adicionado.</p>
            <p className="text-sm">Adicione um código para acompanhar o envio.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!trackingCode.trim()}>
              Salvar e Atualizar Status
            </Button>
          </>
        ) : rastreamento ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
            <Button onClick={handleSendNotification}>
              <Send className="h-4 w-4 mr-2" />
              Notificar Cliente
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={() => setIsEditing(true)}>
            <Truck className="h-4 w-4 mr-2" />
            Adicionar Código de Rastreio
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

