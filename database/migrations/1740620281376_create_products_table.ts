import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('product_categories')
        .onDelete('SET NULL')

      table.string('name')
      table.string('slug').unique()
      table.string('code').unique()
      table.decimal('price')
      table.text('description')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
