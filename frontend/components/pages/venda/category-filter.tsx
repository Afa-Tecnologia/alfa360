"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import GetCategorys from "@/services/products/getCategorys"

interface CategoryFilterProps {
  onCategorySelect: (categoryId: number | null) => void
  selectedCategory: number | null
}

export default function CategoryFilter({ onCategorySelect, selectedCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const categoriesData = await GetCategorys()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Erro ao buscar categorias:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 py-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          className="whitespace-nowrap"
          onClick={() => onCategorySelect(null)}
        >
          Todos
        </Button>

        {!isLoading &&
          categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="whitespace-nowrap"
              onClick={() => onCategorySelect(category.id)}
            >
              {category.name}
            </Button>
          ))}

        {isLoading &&
          Array(5)
            .fill(0)
            .map((_, index) => <div key={index} className="h-10 w-24 bg-muted animate-pulse rounded-md" />)}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

