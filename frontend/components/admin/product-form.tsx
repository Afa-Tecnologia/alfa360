"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Upload, X } from "lucide-react"
import { useToast } from "../ui/use-toast"

interface Variante {
  id: string
  cor: string
  tamanho: string
  estoque: number
  ativo: boolean
}

export function ProductForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    marca: "Les Amis",
    precoVenda: "",
    precoCompra: "",
    codigo: "",
    tipo: "roupa",
    ativo: true,
  })
  const [variantes, setVariantes] = useState<Variante[]>([
    { id: "1", cor: "PRETO", tamanho: "P", estoque: 10, ativo: true },
  ])
  const [imagens, setImagens] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleVarianteChange = <K extends keyof Variante>(index: number, field: K, value: Variante[K]) => {
    const newVariantes = [...variantes];
    newVariantes[index] = { ...newVariantes[index], [field]: value };
    setVariantes(newVariantes);
  };

  const addVariante = () => {
    setVariantes([...variantes, { id: Date.now().toString(), cor: "PRETO", tamanho: "P", estoque: 10, ativo: true }])
  }

  const removeVariante = (index: number) => {
    setVariantes(variantes.filter((_, i) => i !== index))
  }

  const handleImageUpload = () => {
    // Simulação de upload de imagem
    const newImage = `/placeholder.svg?height=800&width=600&text=Imagem ${imagens.length + 1}`
    setImagens([...imagens, newImage])
  }

  const removeImage = (index: number) => {
    setImagens(imagens.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dados do produto:", { ...formData, variantes, imagens })

    toast({
      title: "Produto criado com sucesso!",
      description: `O produto ${formData.nome} foi adicionado ao catálogo.`,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
          <TabsTrigger value="variantes">Variantes</TabsTrigger>
          <TabsTrigger value="imagens">Imagens</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código do Produto *</Label>
              <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows={5} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roupas">Roupas</SelectItem>
                  <SelectItem value="acessorios">Acessórios</SelectItem>
                  <SelectItem value="calcados">Calçados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" name="marca" value={formData.marca} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roupa">Roupa</SelectItem>
                  <SelectItem value="acessorio">Acessório</SelectItem>
                  <SelectItem value="calcado">Calçado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="precoVenda">Preço de Venda (R$) *</Label>
              <Input
                id="precoVenda"
                name="precoVenda"
                type="number"
                step="0.01"
                min="0"
                value={formData.precoVenda}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precoCompra">Preço de Compra (R$)</Label>
              <Input
                id="precoCompra"
                name="precoCompra"
                type="number"
                step="0.01"
                min="0"
                value={formData.precoCompra}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => handleSwitchChange("ativo", checked)}
            />
            <Label htmlFor="ativo">Produto ativo</Label>
          </div>
        </TabsContent>

        <TabsContent value="variantes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Variantes do Produto</h3>
            <Button type="button" onClick={addVariante}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Variante
            </Button>
          </div>

          {variantes.map((variante, index) => (
            <Card key={variante.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">Variante {index + 1}</CardTitle>
                  {variantes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariante(index)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover variante</span>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`cor-${index}`}>Cor</Label>
                    <Select value={variante.cor} onValueChange={(value) => handleVarianteChange(index, "cor", value)}>
                      <SelectTrigger id={`cor-${index}`}>
                        <SelectValue placeholder="Selecione uma cor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRETO">Preto</SelectItem>
                        <SelectItem value="BRANCO">Branco</SelectItem>
                        <SelectItem value="AZUL">Azul</SelectItem>
                        <SelectItem value="VERMELHO">Vermelho</SelectItem>
                        <SelectItem value="VERDE">Verde</SelectItem>
                        <SelectItem value="BEGE">Bege</SelectItem>
                        <SelectItem value="ROSA">Rosa</SelectItem>
                        <SelectItem value="MARROM">Marrom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`tamanho-${index}`}>Tamanho</Label>
                    <Select
                      value={variante.tamanho}
                      onValueChange={(value) => handleVarianteChange(index, "tamanho", value)}
                    >
                      <SelectTrigger id={`tamanho-${index}`}>
                        <SelectValue placeholder="Selecione um tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P">P</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="G">G</SelectItem>
                        <SelectItem value="GG">GG</SelectItem>
                        <SelectItem value="ÚNICO">Único</SelectItem>
                        <SelectItem value="36">36</SelectItem>
                        <SelectItem value="38">38</SelectItem>
                        <SelectItem value="40">40</SelectItem>
                        <SelectItem value="42">42</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`estoque-${index}`}>Estoque</Label>
                    <Input
                      id={`estoque-${index}`}
                      type="number"
                      min="0"
                      value={variante.estoque}
                      onChange={(e) => handleVarianteChange(index, "estoque", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`ativo-${index}`}
                    checked={variante.ativo}
                    onCheckedChange={(checked) => handleVarianteChange(index, "ativo", checked)}
                  />
                  <Label htmlFor={`ativo-${index}`}>Variante ativa</Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="imagens" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Imagens do Produto</h3>
            <Button type="button" onClick={handleImageUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Fazer Upload
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {imagens.map((imagem, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md border">
                  <img
                    src={imagem || "/placeholder.svg"}
                    alt={`Imagem ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remover imagem</span>
                </Button>
              </div>
            ))}

            {imagens.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed rounded-md">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma imagem adicionada</p>
                <p className="text-sm text-muted-foreground">Clique em "Fazer Upload" para adicionar imagens</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Título</Label>
            <Input id="metaTitle" name="metaTitle" placeholder="Título para SEO" />
            <p className="text-xs text-muted-foreground">
              O título que aparecerá nos resultados de busca. Recomendado: até 60 caracteres.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Descrição</Label>
            <Textarea id="metaDescription" name="metaDescription" placeholder="Descrição para SEO" rows={3} />
            <p className="text-xs text-muted-foreground">
              A descrição que aparecerá nos resultados de busca. Recomendado: até 160 caracteres.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urlSlug">URL Amigável</Label>
            <Input id="urlSlug" name="urlSlug" placeholder="url-amigavel-do-produto" />
            <p className="text-xs text-muted-foreground">
              A parte final da URL do produto. Use apenas letras minúsculas, números e hífens.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit">Salvar Produto</Button>
      </div>
    </form>
  )
}

