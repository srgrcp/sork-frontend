import { Category } from './Category'

export interface Section{
    _id?: string
    name: string
    category?: [Category]
}