"use client"

import { Search } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { CarouselProducts } from "./Products-Carrosel"



export default function HomeDashboard() {
    return (

        <div className="min-h-screen bg-background">


            {/* Header with trigger */}
            <header className="flex h-16 items-center gap-4 border-b px-6">
                <h1 className="text-2xl font-semibold">Painel</h1>
                <div className="ml-auto flex items-center gap-4">
                    <span className="text-sm text-green-600 font-medium">CAIXA ABERTO</span>

                </div>
            </header>

            {/* Main Content */}
            <div className="p-6">
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground">Dinheiro</div>
                        <div className="flex items-baseline">
                            <span className="text-sm">R$</span>
                            <span className="text-2xl font-semibold ml-1">0,00</span>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground">Cartão</div>
                        <div className="flex items-baseline">
                            <span className="text-sm">R$</span>
                            <span className="text-2xl font-semibold ml-1">0,00</span>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-sm text-muted-foreground">Caixa</div>
                        <div className="flex items-baseline">
                            <span className="text-sm">R$</span>
                            <span className="text-2xl font-semibold ml-1">0,00</span>
                        </div>
                    </Card>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Consultar Material" className="pl-10" />
                </div>

                {/* Products Grid */}
                <div className="flex justify-center  pb-4 ">
                    <CarouselProducts />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ProductCard name="Salgadinho de Milho" price={4.99} image="/placeholder.svg" />
                    <ProductCard name="Chips De Coco" price={15.95} image="/placeholder.svg" />
                    <ProductCard name="Salgadinho de Arroz" price={4.55} image="/placeholder.svg" />
                    <ProductCard name="Geléia de Morango" price={4.99} image="/placeholder.svg" />
                    <ProductCard name="Amendoim" price={12.99} image="/placeholder.svg" />
                    <ProductCard name="Coquetel" price={5.99} image="/placeholder.svg" />
                </div>
            </div>

        </div>

    )
}

function ProductCard({ name, price, image }: { name: string; price: number; image: string }) {
    return (
        <Card className="p-4">
            <div className="flex gap-4">
                <Image src={image || "/placeholder.svg"} alt={name} width={60} height={60} className="rounded-md" />
                <div className="flex-1">
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-red-600 font-medium">R$ {price.toFixed(2)}</div>
                </div>
                <Button variant="outline" size="icon">
                    +
                </Button>
            </div>
        </Card>
    )
}

