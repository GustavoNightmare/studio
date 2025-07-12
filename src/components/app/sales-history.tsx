
"use client";

import { useState } from "react";
import type { Sale } from "@/types";
import { isSameDay } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';


interface SalesHistoryProps {
  sales: Sale[];
}

export default function SalesHistory({ sales }: SalesHistoryProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const filteredSales = date
    ? sales.filter((sale) => isSameDay(sale.date, date))
    : sales;

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);

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
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>
            Un registro de todas las ventas realizadas. Filtra por fecha para ver detalles.
          </CardDescription>
        </div>
        <div className="mt-4 md:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={"w-full justify-start text-left font-normal md:w-[240px]"}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
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
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
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
                  No se encontraron ventas para la fecha seleccionada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex items-center gap-4">
            <span className="text-lg font-medium">Ingresos Totales del día:</span>
            <Badge variant="default" className="text-xl">
              {formatCurrency(totalRevenue)}
            </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
