import { Card, CardContent } from "../ui/card";

interface Category {
    emoji: string;
    name: string;
  }
  
  export const categories: Category[] = [
    { emoji: "🍞", name: "Pães" },
    { emoji: "🥨", name: "Salgados" },
    { emoji: "🥤", name: "Bebidas" },
    { emoji: "🍬", name: "Doces" },
    { emoji: "🍦", name: "Sorvete" },
  ];
  
  export function CardsCategorys({ emoji, name }: Category) {
    return (
      <Card>
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <div className="flex flex-col items-center py-4 px-6 h-auto">
            <span className="text-2xl mb-1">{emoji}</span>
            <span className="text-sm">{name}</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  