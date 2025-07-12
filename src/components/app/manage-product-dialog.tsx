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
          <DialogTitle>{isEditMode ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Make changes to your product here. Click save when you're done."
              : "Add a new product to your inventory. Click save when you're done."}
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
