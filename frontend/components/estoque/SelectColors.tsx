"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useProductStore } from "@/stores/createProductStore";
import { COLORS_CLOTHES, COLORS_SHOES } from "@/types/constants";

interface ColorSelectorProps {
  tipo_produto: string | null;
}

export function SelectColor({ tipo_produto }: ColorSelectorProps) {
  const { color, setColor, addVariant, variants, variant } = useProductStore();
  const [newVariant, setNewVariant] = useState({
      name:"",
      color: "",
      size: "",
      selling_price: 0,
      stock: 0,
      type:"", 
      active:false
    });
  

  const availableColors = useMemo(() => {
    if (tipo_produto === "roupa") return COLORS_CLOTHES;
    if (tipo_produto === "sapato") return COLORS_SHOES;
    return [];
  }, [tipo_produto]);

  useEffect(() => {
    setColor([]);
  }, [tipo_produto]);


  //Edição
  useEffect(() =>{
    if(variant){
      setColor([`${variant.color}`])
    }
  },[])

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setColor(selectedOptions);
    console.log('cor selecionada:' +selectedOptions)
    // addVariant({ ...variants, id: Date.now(), color: event.target.value });
  };

  if (!availableColors.length) {
    return null;
  }

  return (
    <div className="w-full lg:w-full lg:max-w-xs">
      <label htmlFor="color-select" className="block text-sm font-medium text-gray-700 mb-1">
        Selecione as cores
      </label>
      <select
        id="color-select"
        multiple
        value={color || []}
        onChange={handleColorChange}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {availableColors.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <p className="mt-2 text-sm text-gray-500">
        Cores selecionadas: {Array.isArray(color) ? color.join(', ') : color || 'Nenhuma'}
      </p>
    </div>
  );
}
