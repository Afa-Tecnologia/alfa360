
import React, { useState } from 'react';
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
};

interface CategoryTabsProps {
  onSelectCategory: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const categories: Category[] = [
    { id: 'all', name: 'Todos' },
    { id: 'masculino', name: 'Masculino' },
    { id: 'feminino', name: 'Feminino' },
    { id: 'infantil', name: 'Infantil' },
    { id: 'acessorios', name: 'Acessórios' },
    { id: 'calcados', name: 'Calçados' },
    { id: 'ofertas', name: 'Ofertas' },
  ];
  
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onSelectCategory(categoryId);
  };
  
  return (
    <div className="w-full overflow-x-auto py-1">
      <div className="flex space-x-2 min-w-max">
        {categories.map((category, index) => (
          <button
            key={category.id}
            className={cn(
              "category-button",
              activeCategory === category.id && "active",
              `animate-fade-in [animation-delay:${index * 50}ms]`
            )}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;