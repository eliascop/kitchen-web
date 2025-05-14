import { Cart } from "./cart.model"

export interface Order {
    id: number
    creation:string
    status:string
    cart: Cart
    blink: boolean
}