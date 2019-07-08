import { Product } from "./Product"

interface Item{
    product: Product
    size: any
    variant?: string
    quantity: number
}

interface Cart{
    items: Item[]
}

export { Item, Cart }