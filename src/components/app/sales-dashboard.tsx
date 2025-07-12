"use client";

import type { Sale } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesHistory from "./sales-history";
import SalesAnalytics from "./sales-analytics";

interface SalesDashboardProps {
  sales: Sale[];
}

export default function SalesDashboard({ sales }: SalesDashboardProps) {
  return (
    <Tabs defaultValue="history" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="history">Historial</TabsTrigger>
        <TabsTrigger value="analytics">Análisis</TabsTrigger>
      </TabsList>
      <TabsContent value="history">
        <SalesHistory sales={sales} />
      </TabsContent>
      <TabsContent value="analytics">
        <SalesAnalytics sales={sales} />
      </TabsContent>
    </Tabs>
  );
}
