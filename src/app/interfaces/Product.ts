interface Product {
    _id?: string
    description: string
    ref: string
    size: string
    cost: Number
    price: number
    image: [{ url: string, color?: string, variant?: string }]
    section?: string// { _id?: string, name?: string }
    category?: string// { _id?: string, name?: string }
    subcategory?: string// { _id?: string, name?: string }
    brand?: string// { _id?: string, name?: string }
    sectionName?: string
    categoryName?: string
    subcategoryName?: string
    brandName?: string
    slide?: { _id?: string, url?: string }
    sizes?: Number[]
}

interface Slide {
    _id?: string
    url: string //image
    ref?: string
    description: string
    product?: { _id: String, description: String }
}

export { Product, Slide }