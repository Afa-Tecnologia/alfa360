"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export function StoreSettingsForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nomeLoja: "Les Amis",
    descricao: "Moda feminina elegante e sofisticada",
    email: "contato@lesamis.com",
    telefone: "(11) 2345-6789",
    endereco: "Rua da Moda, 123",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    cnpj: "12.345.678/0001-90",
    instagram: "@lesamis",
    facebook: "lesamis",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dados da loja:", formData)

    toast({
      title: "Configurações salvas",
      description: "As configurações da loja foram atualizadas com sucesso.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nomeLoja">Nome da Loja</Label>
            <Input id="nomeLoja" name="nomeLoja" value={formData.nomeLoja} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição da Loja</Label>
          <Textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows={3} />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações de Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Endereço</h3>
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Input id="estado" name="estado" value={formData.estado} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input id="cep" name="cep" value={formData.cep} onChange={handleChange} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Redes Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" name="facebook" value={formData.facebook} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  )
}

