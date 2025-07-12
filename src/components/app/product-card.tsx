"use client";

import Image from "next/image";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MinusCircle,
  PlusCircle,
  Pencil,
  Trash2,
  DollarSign,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ManageProductDialog } from "./manage-product-dialog";
import { SellProductDialog } from "./sell-product-dialog";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onSell: (productId: string, quantity: number) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onUpdateStock,
  onSell,
}: ProductCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-md transition-shadow hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={product["data-ai-hint"]}
          />
        </div>
        <div className="p-4">
            <CardTitle className="truncate text-xl">{product.name}</CardTitle>
            <CardDescription className="text-lg font-semibold text-primary">
                {formatCurrency(product.price)}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="flex items-center justify-between">
          <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => onUpdateStock(product.id, product.stock - 1)}
              disabled={product.stock === 0}
            >
              <MinusCircle className="h-5 w-5" />
            </Button>
            <span className="font-bold">{product.stock}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => onUpdateStock(product.id, product.stock + 1)}
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 p-4 pt-0">
        <ManageProductDialog product={product} onSave={onEdit}>
          <Button variant="outline" size="sm" className="w-full">
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        </ManageProductDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                product "{product.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(product.id)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <SellProductDialog product={product} onSell={onSell}>
            <Button size="sm" className="w-full" disabled={product.stock === 0}>
                <DollarSign className="mr-2 h-4 w-4" /> Sell
            </Button>
        </SellProductDialog>
      </CardFooter>
    </Card>
  );
}
