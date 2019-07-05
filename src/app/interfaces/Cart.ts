import { Product } from "./Product"

interface Item{
    product: Product
    size: any
}

interface Cart{
    items: Item[]
}

export { Item, Cart }