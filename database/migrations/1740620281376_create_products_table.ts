import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('category_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('product_categories')
        .onDelete('SET NULL')

      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.string('code').notNullable().unique()
      table.decimal('price').notNullable()
      table.text('description').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
