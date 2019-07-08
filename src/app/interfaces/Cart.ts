import { Product } from "./Product"

interface BuyerInfo{
    name: string,
    address: string,
    phone: number,
    email: string
}

interface Item{
    product: Product
    size?: any
    variant?: string
    quantity: number
}

interface Order{
    shortid?: string
    items: Item[]
    buyer: BuyerInfo
    total?: number
    info?: string
}

interface Cart{
    items: Item[]
}

export { Item, Cart, BuyerInfo, Order }