"use client";

import type { Sale } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SalesHistoryProps {
  sales: Sale[];
}

export default function SalesHistory({ sales }: SalesHistoryProps) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-CO", {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Ventas</CardTitle>
        <CardDescription>
          Un registro de todas las ventas realizadas a través de la aplicación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-right">Precio Total</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.productName}</TableCell>
                  <TableCell className="text-center">{sale.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.totalPrice)}</TableCell>
                  <TableCell className="text-right">{formatDate(sale.date)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Aún no se han registrado ventas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex items-center gap-4">
            <span className="text-lg font-medium">Ingresos Totales:</span>
            <Badge variant="default" className="text-xl">
              {formatCurrency(totalRevenue)}
            </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
