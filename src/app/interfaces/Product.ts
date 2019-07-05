export interface Product {
    _id?: String
    description: String
    ref: String
    size: String
    cost: Number
    price: Number
    image: String
    section?: String// { _id?: String, name?: String }
    category?: String// { _id?: String, name?: String }
    subcategory?: String// { _id?: String, name?: String }
    brand?: String// { _id?: String, name?: String }
    sectionName?: String
    categoryName?: String
    subcategoryName?: String
    brandName?: String
    slide?: { _id?: String, url?: String }
    sizes?: Number[]
}