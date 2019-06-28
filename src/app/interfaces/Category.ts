export interface Category{
    _id?: String
    name: String
    subcategory?: [{ _id?:String, name: String }]
}