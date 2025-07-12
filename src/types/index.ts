export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  "data-ai-hint"?: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  date: Date;
}
