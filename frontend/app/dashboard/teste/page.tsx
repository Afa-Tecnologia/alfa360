'use client'
import { useEffect, useState } from "react";
import { create } from "zustand";

interface Variant {
  id: number;
  color: string;
  size: string;
  price: string;
  stock: string;
}

interface ProductStore {
  variants: Variant[];
  addVariant: (variant: Variant) => void;
  removeVariant: (id: number) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  variants: [],
  addVariant: (variant) => set((state) => ({ variants: [...state.variants, variant] })),
  removeVariant: (id) =>
    set((state) => ({
      variants: state.variants.filter((variant) => variant.id !== id),
    })),
}));


export function ProductForm() {
  const [product, setProduct] = useState({ name: "", price: "" });
  const { variants, addVariant, removeVariant } = useProductStore();
  const [newVariant, setNewVariant] = useState({
    color: "",
    size: "",
    price: "",
    stock: "",
  });

  const handleAddVariant = () => {
    if (!newVariant.color || !newVariant.size || !newVariant.price || !newVariant.stock) {
      alert("Preencha todos os campos");
      return;
    }

    addVariant({ ...newVariant, id: Date.now() }); // Gerando um ID único
    setNewVariant({ color: "", size: "", price: "", stock: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name,
        price: parseFloat(product.price),
        variants: variants.map(v => ({
          color: v.color,
          size: v.size,
          price: parseFloat(v.price),
          stock: parseInt(v.stock),
        }))
      }),
    });

    const data = await response.json();
    console.log("Produto criado:", data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Nome do Produto</label>
        <input type="text" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} className="border p-2 w-full" />
      </div>

      <div>
        <label>Preço</label>
        <input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} className="border p-2 w-full" />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Cor"
          value={newVariant.color}
          onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Tamanho"
          value={newVariant.size}
          onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Preço"
          value={newVariant.price}
          onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Estoque"
          value={newVariant.stock}
          onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
          className="border p-2 rounded-md"
        />
      </div>

      <button onClick={handleAddVariant} className="mt-2 bg-blue-500 text-white p-2 rounded-md">
        Adicionar Variante
      </button>

      {/* Lista de variantes adicionadas */}
      <div className="mt-4">
        {variants.map((variant) => (
          <div key={variant.id} className="flex justify-between items-center p-2 border rounded-md mt-2">
            <p>
              <b>Cor:</b> {variant.color} | <b>Tamanho:</b> {variant.size} | <b>Preço:</b> {variant.price} | <b>Estoque:</b> {variant.stock}
            </p>
            <button onClick={() => removeVariant(variant.id)} className="bg-red-500 text-white p-1 rounded-md">
              Remover
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}

export default function Page(){
  return (
    <ProductForm />
  );
};
