import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title')
      table.string('slug')
      table.text('excerpt').nullable()
      table.string('thumbnail').nullable()
      table.text('content', 'long')

      table
        .integer('category_id')
        .unsigned()
        .references('categories.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
