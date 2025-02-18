import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table
        .integer('parent_id')
        .unsigned()
        .references('categories.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table.string('display_name')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
