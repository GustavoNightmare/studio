"use client";

import { useState, type ReactNode } from "react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";

interface ManageProductDialogProps {
  product?: Product;
  children: ReactNode;
  onSave: (data: any) => void;
}

export function ManageProductDialog({ product, children, onSave }: ManageProductDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditMode = !!product;

  const handleSave = (formData: Omit<Product, "id">) => {
    if (isEditMode) {
      onSave({ ...product, ...formData });
    } else {
      onSave(formData);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Realiza cambios a tu producto aquí. Haz clic en guardar cuando termines."
              : "Agrega un nuevo producto a tu inventario. Haz clic en guardar cuando termines."}
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={handleSave}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
