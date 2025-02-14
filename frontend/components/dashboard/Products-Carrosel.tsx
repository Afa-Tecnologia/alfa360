import * as React from "react";
// Importando os cards
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CardsCategorys, categories } from "./Cards-Categorys";

export function CarouselProducts() {
    return (
        <>
        <div className="flex flex-col justify-center py-4 px-6 h-auto">
        <span className="text-1xl mb-1">Categorias dos Produtos</span>
       
      <Carousel className="w-full max-w-[45rem]">
        <CarouselContent className="-ml-1">
          {categories.map((category, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <CardsCategorys emoji={category.emoji} name={category.name} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      </div>
        </>
    );
  }