import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import ProductImage from './product_image.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ProductCategory from './product_category.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare price: number

  @hasMany(() => ProductImage, {
    foreignKey: 'productId',
  })
  declare images: HasMany<typeof ProductImage>

  @column({ columnName: 'category_id' })
  declare categoryId: number

  @belongsTo(() => ProductCategory, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof ProductCategory>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
