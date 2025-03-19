"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export function EmailTemplatesSettings() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState({
    orderConfirmation: {
      subject: "Confirmação de Pedido - Les Amis",
      body: `Olá {{nome}},

Obrigado por comprar na Les Amis!

Seu pedido #{{numero_pedido}} foi recebido e está sendo processado.

Detalhes do Pedido:
{{detalhes_pedido}}

Total: R$ {{valor_total}}

Você receberá outro e-mail quando seu pedido for enviado.

Atenciosamente,
Equipe Les Amis`,
    },
    shipping: {
      subject: "Pedido Enviado - Les Amis",
      body: `Olá {{nome}},

Seu pedido #{{numero_pedido}} foi enviado!

Código de rastreamento: {{codigo_rastreamento}}
Link para rastreamento: {{link_rastreamento}}

Prazo estimado de entrega: {{prazo_entrega}}

Atenciosamente,
Equipe Les Amis`,
    },
    welcome: {
      subject: "Bem-vindo à Les Amis!",
      body: `Olá {{nome}},

Bem-vindo à Les Amis!

Estamos felizes em tê-lo como cliente. Sua conta foi criada com sucesso.

Explore nossa coleção de moda feminina elegante e sofisticada.

Atenciosamente,
Equipe Les Amis`,
    },
  })

  const handleChange = (template: string, field: string, value: string) => {
    setTemplates((prev) => ({
      ...prev,
      [template]: {
        ...prev[template as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleSave = () => {
    console.log("Templates de e-mail:", templates)

    toast({
      title: "Templates salvos",
      description: "Os templates de e-mail foram atualizados com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="orderConfirmation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orderConfirmation">Confirmação de Pedido</TabsTrigger>
          <TabsTrigger value="shipping">Envio</TabsTrigger>
          <TabsTrigger value="welcome">Boas-vindas</TabsTrigger>
        </TabsList>

        <TabsContent value="orderConfirmation" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderConfirmationSubject">Assunto</Label>
            <Input
              id="orderConfirmationSubject"
              value={templates.orderConfirmation.subject}
              onChange={(e) => handleChange("orderConfirmation", "subject", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderConfirmationBody">Corpo do E-mail</Label>
            <Textarea
              id="orderConfirmationBody"
              value={templates.orderConfirmation.body}
              onChange={(e) => handleChange("orderConfirmation", "body", e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
          </div>
          <div className="bg-muted p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Variáveis disponíveis:</h4>
            <ul className="text-sm space-y-1">
              <li>
                <code>&#123;&#123;nome&#125;&#125;</code> - Nome do cliente
              </li>
              <li>
                <code>&#123;&#123;numero_pedido&#125;&#125;</code> - Número do pedido
              </li>
              <li>
                <code>&#123;&#123;detalhes_pedido&#125;&#125;</code> - Lista de itens do pedido
              </li>
              <li>
                <code>&#123;&#123;valor_total&#125;&#125;</code> - Valor total do pedido
              </li>
              <li>
                <code>&#123;&#123;data_pedido&#125;&#125;</code> - Data do pedido
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shippingSubject">Assunto</Label>
            <Input
              id="shippingSubject"
              value={templates.shipping.subject}
              onChange={(e) => handleChange("shipping", "subject", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingBody">Corpo do E-mail</Label>
            <Textarea
              id="shippingBody"
              value={templates.shipping.body}
              onChange={(e) => handleChange("shipping", "body", e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
          </div>
          <div className="bg-muted p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Variáveis disponíveis:</h4>
            <ul className="text-sm space-y-1">
              <li>
                <code>&#123;&#123;nome&#125;&#125;</code> - Nome do cliente
              </li>
              <li>
                <code>&#123;&#123;numero_pedido&#125;&#125;</code> - Número do pedido
              </li>
              <li>
                <code>&#123;&#123;codigo_rastreamento&#125;&#125;</code> - Código de rastreamento
              </li>
              <li>
                <code>&#123;&#123;link_rastreamento&#125;&#125;</code> - Link para rastreamento
              </li>
              <li>
                <code>&#123;&#123;prazo_entrega&#125;&#125;</code> - Prazo estimado de entrega
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="welcome" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcomeSubject">Assunto</Label>
            <Input
              id="welcomeSubject"
              value={templates.welcome.subject}
              onChange={(e) => handleChange("welcome", "subject", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="welcomeBody">Corpo do E-mail</Label>
            <Textarea
              id="welcomeBody"
              value={templates.welcome.body}
              onChange={(e) => handleChange("welcome", "body", e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
          </div>
          <div className="bg-muted p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Variáveis disponíveis:</h4>
            <ul className="text-sm space-y-1">
              <li>
                <code>&#123;&#123;nome&#125;&#125;</code> - Nome do cliente
              </li>
              <li>
                <code>&#123;&#123;email&#125;&#125;</code> - E-mail do cliente
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave}>Salvar Templates</Button>
      </div>
    </div>
  )
}

