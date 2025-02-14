"use client"

import { Search } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CarouselProducts } from "./Products-Carrosel"
import { SidebarCheckout } from "./checkout/Sidebar-Checkout"
import CardsProducts from "./products/Cards-Products"




export default function HomeDashboard() {
    return (

        <div className="min-h-screen bg-background">


            {/* Header with trigger */}
            <header className="flex h-16 items-center gap-4 border-b px-6">
                <h1 className="text-2xl font-semibold">Painel</h1>
                <div className="ml-auto flex items-center gap-4">
                    <span className="text-sm text-green-600 font-medium">CAIXA ABERTO</span>

                </div>
                <div>
                    <SidebarCheckout />
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
                    <Input placeholder="Consultar Produtos" className="pl-10" />
                </div>

                {/* Products Grid */}
                <div className="flex justify-center  pb-4 ">
                    <CarouselProducts />
                </div>
                <div>
                    <CardsProducts />
                </div>
            </div>

        </div>

    )
}



