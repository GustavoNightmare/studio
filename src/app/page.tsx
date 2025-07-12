"use client";

import { useState } from "react";
import type { Product, Sale } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, UtensilsCrossed } from "lucide-react";
import  ProductGrid from "@/components/app/product-grid";
import  SalesHistory  from "@/components/app/sales-history";
import { ManageProductDialog } from "@/components/app/manage-product-dialog";
import { useToast } from "@/hooks/use-toast";

const initialProducts: Product[] = [
  { id: "1", name: "Red Velvet Cake", price: 25.50, stock: 10, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'red velvet cake' },
  { id: "2", name: "Chocolate Chip Cookies", price: 1.25, stock: 150, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'chocolate cookies' },
  { id: "3", name: "Cheesecake", price: 30.00, stock: 8, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'cheesecake dessert' },
  { id: "4", name: "Brownies", price: 2.50, stock: 75, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'chocolate brownies' },
  { id: "5", name: "Apple Pie", price: 22.00, stock: 12, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'apple pie' },
  { id: "6", name: "Macarons", price: 2.00, stock: 200, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'colorful macarons' },
];

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sales, setSales] = useState<Sale[]>([]);
  const { toast } = useToast();

  const handleAddProduct = (newProductData: Omit<Product, "id" | "data-ai-hint">) => {
    const newProduct: Product = {
      ...newProductData,
      id: crypto.randomUUID(),
    };
    setProducts((prev) => [...prev, newProduct]);
    toast({
      title: "Success",
      description: "Product added to inventory.",
    });
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast({
      title: "Success",
      description: "Product details updated.",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
     toast({
      title: "Product Deleted",
      description: "The product has been removed from inventory.",
      variant: "destructive"
    });
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    if (newStock < 0) {
      toast({
        title: "Error",
        description: "Stock cannot be negative.",
        variant: "destructive",
      });
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };
  
  const handleSellProduct = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if(product.stock < quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} units of ${product.name} available.`,
        variant: "destructive",
      });
      return;
    }

    const newSale: Sale = {
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      quantity,
      totalPrice: product.price * quantity,
      date: new Date(),
    };

    setSales(prev => [newSale, ...prev]);
    handleUpdateStock(productId, product.stock - quantity);
    toast({
      title: "Sale Recorded!",
      description: `Sold ${quantity} of ${product.name}.`,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold font-headline">PolipostresAPP</h1>
        </div>
        <div className="ml-auto">
          <ManageProductDialog onSave={handleAddProduct}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </ManageProductDialog>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="inventory">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="sales">Sales History</TabsTrigger>
          </TabsList>
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your products and view their inventory status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductGrid
                  products={products}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onUpdateStock={handleUpdateStock}
                  onSellProduct={handleSellProduct}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sales">
            <SalesHistory sales={sales} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
