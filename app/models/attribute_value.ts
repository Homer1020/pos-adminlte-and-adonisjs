import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Attribute from './attribute.js'

export default class AttributeValue extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare attribute_id: number

  @belongsTo(() => Attribute)
  declare attribute: BelongsTo<typeof Attribute>

  @column()
  declare value: string
}
