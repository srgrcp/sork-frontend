export interface Category{
    _id?: string
    name: string
    subcategory?: [{ _id?:string, name: string }]
}