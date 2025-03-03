import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ProductImage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare path: string

  @column({ columnName: 'product_id' })
  declare productId: number

  @column()
  declare isDefault: boolean
}
