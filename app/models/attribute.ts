import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import AttributeValue from './attribute_value.js'

export default class Attribute extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @hasMany(() => AttributeValue, {
    foreignKey: 'attribute_id',
  })
  declare values: HasMany<typeof AttributeValue>
}
