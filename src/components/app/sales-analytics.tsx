"use client";

import { useMemo } from "react";
import type { Sale } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, LineChart, DollarSign, ShoppingBag } from "lucide-react";
import SalesSummaryCard from "./sales-summary-card";
import TopSellingProductsChart from "./top-selling-chart";
import SalesOverTimeChart from "./sales-over-time-chart";

interface SalesAnalyticsProps {
  sales: Sale[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function SalesAnalytics({ sales }: SalesAnalyticsProps) {
  const { totalRevenue, totalSales, topProducts, salesByDay } = useMemo(() => {
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalPrice, 0);
    const totalSales = sales.reduce((acc, sale) => acc + sale.quantity, 0);

    const productSales = sales.reduce((acc, sale) => {
      acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity;
      return acc;
    }, {} as Record<string, number>);

    const topProducts = Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
      
    const salesByDay = sales.reduce((acc, sale) => {
        const day = sale.date.toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + sale.totalPrice;
        return acc;
    }, {} as Record<string, number>);

    const sortedSalesByDay = Object.entries(salesByDay)
        .map(([date, total]) => ({ date, total }))
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    return { totalRevenue, totalSales, topProducts, salesByDay: sortedSalesByDay };
  }, [sales]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Resumen de Ventas</CardTitle>
          <CardDescription>
            Un vistazo rápido al rendimiento de tu negocio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <SalesSummaryCard
              title="Ingresos Totales"
              value={formatCurrency(totalRevenue)}
              icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
            />
            <SalesSummaryCard
              title="Productos Vendidos"
              value={totalSales.toString()}
              icon={<ShoppingBag className="h-6 w-6 text-muted-foreground" />}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Productos Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
             {sales.length > 0 ? (
                <TopSellingProductsChart data={topProducts} />
             ) : (
                <div className="flex items-center justify-center h-60 text-muted-foreground">
                    No hay suficientes datos para mostrar el gráfico.
                </div>
             )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Ingresos a lo Largo del Tiempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sales.length > 0 ? (
                <SalesOverTimeChart data={salesByDay} />
            ) : (
                 <div className="flex items-center justify-center h-60 text-muted-foreground">
                    No hay suficientes datos para mostrar el gráfico.
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
