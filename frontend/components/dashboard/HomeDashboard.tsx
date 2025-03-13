"use client"
import React, { useState } from "react";
import { Search, ShoppingCart, CreditCard, Wallet, BarChart3, Menu, CircleUser, Package, Settings, ArrowUpRight  } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ProductCard, { Product } from "./products/Cards-Products";
import CategoryTabs from "./Cards-Categorys";
import Link from "next/link";
import mockProducts from "./products/mockProducts";





const sampleProducts = mockProducts
const HomeCaixa = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<Product[]>([]);
  
  // Filter products based on search and category
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Statistics for the dashboard
  const stats = {
    cash: 1250.75,
    card: 3428.50,
    total: 4679.25
  };
  
  return (
    <div className="min-h-screen bg-fashion-secondary">
      {/* Header */}
  
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
          <Card className="card-stat">
            <Wallet className="card-stat-icon text-green-500 bg-green-50 w-11" />
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Dinheiro</h3>
            <div className="flex items-baseline">
              <span className="text-sm">R$</span>
              <span className="text-3xl font-bold ml-1">{stats.cash.toFixed(2).replace('.', ',')}</span>
            </div>
          </Card>
          
          <Card className="card-stat">
            <CreditCard className="card-stat-icon text-blue-500 bg-blue-50" />
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Cartão</h3>
            <div className="flex items-baseline">
              <span className="text-sm">R$</span>
              <span className="text-3xl font-bold ml-1">{stats.card.toFixed(2).replace('.', ',')}</span>
            </div>
          </Card>
          
          <Card className="card-stat">
            <BarChart3 className="card-stat-icon text-purple-500 bg-purple-50" />
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total em Caixa</h3>
            <div className="flex items-baseline">
              <span className="text-sm">R$</span>
              <span className="text-3xl font-bold ml-1">{stats.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </Card>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6 animate-fade-in [animation-delay:300ms]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar produtos..." 
            className="pl-10 h-12 search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Categories */}
        <div className="mb-6 animate-fade-in [animation-delay:400ms]">
          <CategoryTabs onSelectCategory={setSelectedCategory} />
        </div>
        
        {/* Products Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold animate-fade-in [animation-delay:500ms]">Produtos</h2>
            <Link href="/dashboard/estoque">
            
            <Button variant="outline" size="sm" className="animate-fade-in [animation-delay:500ms]">
              <Package className="mr-2 h-4 w-4" />
              Gerenciar Produtos
              <ArrowUpRight />
            </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground animate-fade-in">
                <p>Nenhum produto encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeCaixa;