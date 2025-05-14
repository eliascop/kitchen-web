import { Product } from "./product.model";

export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
    value: number;
}
  
export interface Cart {
    id: number;
    user: {
         id: number 
         name: string
    };
    items: CartItem[];
    total: number;
}
  