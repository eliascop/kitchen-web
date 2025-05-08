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
    };
    items: CartItem[];
    total: number;
}
  