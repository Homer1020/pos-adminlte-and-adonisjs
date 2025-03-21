import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import ProductImage from './product_image.js'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import ProductCategory from './product_category.js'
import AttributeValue from './attribute_value.js'
import Attribute from './attribute.js'

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

  @manyToMany(() => AttributeValue, {
    pivotColumns: ['attribute_id'],
    pivotTable: 'attribute_products',
  })
  declare values: ManyToMany<typeof AttributeValue>

  @manyToMany(() => Attribute, {
    pivotColumns: ['attribute_value_id'],
    pivotTable: 'attribute_products',
  })
  declare attributes: ManyToMany<typeof Attribute>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
