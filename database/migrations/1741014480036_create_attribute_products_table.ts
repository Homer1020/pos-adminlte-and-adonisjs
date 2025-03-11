import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attribute_products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('attribute_id')
        .unsigned()
        .references('id')
        .inTable('attributes')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('attribute_value_id')
        .unsigned()
        .references('id')
        .inTable('attributes')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
