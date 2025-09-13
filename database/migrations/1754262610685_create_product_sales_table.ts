import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_sales'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('product_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('sale_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('sales')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.integer('quantity')
      table.integer('unit_price')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
