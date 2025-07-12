"use client";

import { useState, type ReactNode } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const sellSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Debes vender al menos 1 artículo."),
});

interface SellProductDialogProps {
  product: Product;
  children: ReactNode;
  onSell: (productId: string, quantity: number) => void;
}

export function SellProductDialog({ product, children, onSell }: SellProductDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof sellSchema>>({
    resolver: zodResolver(sellSchema.refine(
        (data) => data.quantity <= product.stock,
        {
          message: `No se puede vender más que el stock disponible (${product.stock}).`,
          path: ["quantity"],
        }
    )),
    defaultValues: {
      quantity: 1,
    },
  });

  const handleSubmit = (values: z.infer<typeof sellSchema>) => {
    onSell(product.id, values.quantity);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vender: {product.name}</DialogTitle>
          <DialogDescription>
            Ingresa la cantidad que quieres vender. Hay {product.stock} unidades
            disponibles.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} id="sell-form" className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max={product.stock} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="sell-form">Confirmar Venta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
