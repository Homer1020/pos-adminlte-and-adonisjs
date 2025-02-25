import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare display_name: string

  @hasMany(() => Post, {
    foreignKey: 'category_id',
  })
  declare posts: HasMany<typeof Post>
}
