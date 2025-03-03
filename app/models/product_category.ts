import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Product from './product.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class ProductCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare display_name: string

  @hasMany(() => Product, {
    foreignKey: 'category_id',
  })
  declare products: HasMany<typeof Product>
}
