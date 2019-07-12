import { Product } from "./Product"

interface BuyerInfo{
    name?: string
    address?: string
    city?: string
    phone?: number
    email?: string
}

interface Item{
    product: Product
    size?: any
    variant?: string
    quantity: number
}

interface Order{
    _id?: string
    shortid?: string
    items: Item[]
    buyer: BuyerInfo
    total?: number
    info?: string
    state?: number
    created?: Date
    updated?: Date
    total_cost?: number
    method?: number
    payu_info?: any
    note?: string
}

const States = 
[
    { text: 'Pendiente', class: '' },
    { text: 'Completado', class: 'is-success' },
    { text: 'En Camino', class: 'is-info' },
    { text: 'Fallido', class: 'is-danger' },
    { text: 'Reembolsado', class: 'is-black' },
    { text: 'Proceso de Pago', class: 'is-grey-1' },
    { text: 'Cancelado', class: 'is-dark' }
]

interface Cart{
    items: Item[]
}

export { Item, Cart, BuyerInfo, Order, States }