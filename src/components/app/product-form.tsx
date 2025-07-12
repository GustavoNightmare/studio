
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre del producto debe tener al menos 2 caracteres.",
  }),
  price: z.coerce.number().min(0, {
    message: "El precio debe ser un número positivo.",
  }),
  stock: z.coerce.number().int().min(0, {
    message: "El stock debe ser un número entero positivo.",
  }),
  image: z.any()
    .refine((value) => {
        if (typeof value === 'string') return true;
        return value?.[0]?.size <= MAX_FILE_SIZE;
    }, `El tamaño máximo de la imagen es 5MB.`)
    .refine((value) => {
        if (typeof value === 'string') return true;
        return ACCEPTED_IMAGE_TYPES.includes(value?.[0]?.type);
    }, "Solo se aceptan formatos .jpg, .jpeg, .png y .webp."),
});


type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'imageUrl'> & { imageUrl?: string; imageFile?: File }) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [preview, setPreview] = useState<string | null>(product?.imageUrl || null);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      image: product?.imageUrl || undefined,
    },
  });

  const imageRef = form.register("image");
  const watchImage = form.watch("image");

  useEffect(() => {
    if (watchImage && typeof watchImage !== "string" && watchImage.length > 0) {
      const file = watchImage[0];
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else if (typeof watchImage === 'string') {
      setPreview(watchImage);
    }
  }, [watchImage]);
  
  const handleFormSubmit = (data: ProductFormValues) => {
    const { image, ...rest } = data;
    const submissionData: any = { ...rest };

    if (image && typeof image !== 'string' && image.length > 0) {
      submissionData.imageFile = image[0];
    } else if (typeof image === 'string') {
       submissionData.imageUrl = image;
    }
    onSubmit(submissionData);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input placeholder="ej. Torta de Chocolate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                    <Input type="number" step="1" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen del Producto</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" {...imageRef} />
              </FormControl>
              <FormDescription>
                Sube una imagen para tu producto.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {preview && (
            <div className="mt-4">
                <FormLabel>Vista Previa</FormLabel>
                <div className="mt-2 relative w-full h-48 rounded-md overflow-hidden border">
                    <Image src={preview} alt="Vista previa de la imagen" layout="fill" objectFit="cover" />
                </div>
            </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
}
