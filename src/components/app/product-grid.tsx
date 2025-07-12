"use client";

import type { Product } from "@/types";
import ProductCard from "./product-card";

interface ProductGridProps {
  products: Product[];
  onEditProduct: (product: Product & { imageFile?: File }) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onSellProduct: (productId: string, quantity: number) => void;
}

export default function ProductGrid({
  products,
  onEditProduct,
  onDeleteProduct,
  onUpdateStock,
  onSellProduct,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-12 text-center">
        <h3 className="text-xl font-bold tracking-tight text-muted-foreground">
          No hay productos en el inventario
        </h3>
        <p className="text-sm text-muted-foreground">
          Haz clic en "Agregar Producto" para empezar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
          onUpdateStock={onUpdateStock}
          onSell={onSellProduct}
        />
      ))}
    </div>
  );
}
