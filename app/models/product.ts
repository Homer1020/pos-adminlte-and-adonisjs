import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import ProductImage from './product_image.js'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import ProductCategory from './product_category.js'
import AttributeValue from './attribute_value.js'
import Attribute from './attribute.js'
import Brand from './brand.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare slug: string

  @column()
  declare description?: string

  @column()
  declare price: number

  @hasMany(() => ProductImage, {
    foreignKey: 'productId',
  })
  declare images: HasMany<typeof ProductImage>

  @column({ columnName: 'category_id' })
  declare categoryId?: number

  @column({ columnName: 'brand_id' })
  declare brandId?: number

  @belongsTo(() => ProductCategory, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof ProductCategory>

  @belongsTo(() => Brand, {
    foreignKey: 'brandId',
  })
  declare brand: BelongsTo<typeof Brand>

  @manyToMany(() => AttributeValue, {
    pivotColumns: ['attribute_id'],
    pivotTable: 'attribute_products',
  })
  declare values: ManyToMany<typeof AttributeValue>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
