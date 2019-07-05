import { Category } from './Category'

export interface Section{
    _id?: String
    name: String
    category?: [Category]
}