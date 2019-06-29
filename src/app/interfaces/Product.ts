export interface Product {
    _id?: String
    description: String
    ref: String
    size: String
    cost: Number
    price: Number
    image: String
    category: { _id?: String, name?: String }
    subcategory: { _id?: String, name?: String }
    brand: { _id?: String, name?: String }
    slide?: { _id?: String, url?: String }
    sizes?: Number[]
}