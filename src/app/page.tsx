
"use client";

import { useState } from "react";
import type { Product, Sale } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, UtensilsCrossed } from "lucide-react";
import  ProductGrid from "@/components/app/product-grid";
import  SalesDashboard from "@/components/app/sales-dashboard";
import { ManageProductDialog } from "@/components/app/manage-product-dialog";
import { useToast } from "@/hooks/use-toast";

const initialProducts: Product[] = [
  { id: "1", name: "Torta Red Velvet", price: 50000, stock: 10, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'red velvet cake' },
  { id: "2", name: "Galletas con Chips de Chocolate", price: 2500, stock: 150, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'chocolate cookies' },
  { id: "3", name: "Cheesecake", price: 60000, stock: 8, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'cheesecake dessert' },
  { id: "4", name: "Brownies", price: 5000, stock: 75, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'chocolate brownies' },
  { id: "5", name: "Tarta de Manzana", price: 45000, stock: 12, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'apple pie' },
  { id: "6", name: "Macarons", price: 4000, stock: 200, imageUrl: "https://placehold.co/600x400.png", 'data-ai-hint': 'colorful macarons' },
];

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sales, setSales] = useState<Sale[]>([]);
  const { toast } = useToast();

  const handleAddProduct = async (newProductData: Omit<Product, "id" | "imageUrl" | "data-ai-hint"> & { imageFile?: File }) => {
    let imageUrl = "https://placehold.co/600x400.png";
    if (newProductData.imageFile) {
      try {
        imageUrl = await fileToDataUrl(newProductData.imageFile);
      } catch (error) {
        toast({
          title: "Error de Imagen",
          description: "No se pudo procesar la imagen.",
          variant: "destructive",
        });
        return;
      }
    }
    
    const newProduct: Product = {
      ...newProductData,
      id: crypto.randomUUID(),
      imageUrl,
    };
    setProducts((prev) => [...prev, newProduct]);
    toast({
      title: "Éxito",
      description: "Producto agregado al inventario.",
    });
  };

  const handleEditProduct = async (updatedProductData: Product & { imageFile?: File }) => {
     let imageUrl = updatedProductData.imageUrl;
    if (updatedProductData.imageFile) {
       try {
        imageUrl = await fileToDataUrl(updatedProductData.imageFile);
      } catch (error) {
        toast({
          title: "Error de Imagen",
          description: "No se pudo procesar la imagen.",
          variant: "destructive",
        });
        return;
      }
    }

    const finalProduct = { ...updatedProductData, imageUrl };
    delete (finalProduct as any).imageFile;

    setProducts((prev) =>
      prev.map((p) => (p.id === finalProduct.id ? finalProduct : p))
    );
    toast({
      title: "Éxito",
      description: "Detalles del producto actualizados.",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
     toast({
      title: "Producto Eliminado",
      description: "El producto ha sido eliminado del inventario.",
      variant: "destructive"
    });
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    if (newStock < 0) {
      toast({
        title: "Error",
        description: "El stock no puede ser negativo.",
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
        title: "Stock Insuficiente",
        description: `Solo hay ${product.stock} unidades de ${product.name} disponibles.`,
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
      title: "¡Venta Registrada!",
      description: `Se vendieron ${quantity} de ${product.name}.`,
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
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Producto
            </Button>
          </ManageProductDialog>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="inventory">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
          </TabsList>
          <TabsContent value="inventory">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Productos</CardTitle>
                <CardDescription>
                  Gestiona tus productos y mira el estado de su inventario.
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
            <SalesDashboard sales={sales} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
