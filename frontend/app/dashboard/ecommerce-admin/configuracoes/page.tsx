import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoreSettingsForm } from "@/components/admin/store-settings-form"
import { PaymentMethodsSettings } from "@/components/admin/payment-methods-settings"
import { ShippingMethodsSettings } from "@/components/admin/shipping-methods-settings"
import { EmailTemplatesSettings } from "@/components/admin/email-templates-settings"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua loja.</p>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          <TabsTrigger value="envios">Envios</TabsTrigger>
          <TabsTrigger value="emails">E-mails</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
              <CardDescription>Configure as informações básicas da sua loja.</CardDescription>
            </CardHeader>
            <CardContent>
              <StoreSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>Configure os métodos de pagamento disponíveis na sua loja.</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodsSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="envios">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Envio</CardTitle>
              <CardDescription>Configure os métodos de envio disponíveis na sua loja.</CardDescription>
            </CardHeader>
            <CardContent>
              <ShippingMethodsSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <Card>
            <CardHeader>
              <CardTitle>Templates de E-mail</CardTitle>
              <CardDescription>Configure os templates de e-mail enviados pela sua loja.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplatesSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

