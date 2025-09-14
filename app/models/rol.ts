import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Rol extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  static table = 'roles'
}
