import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('path')
      table
        .integer('product_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.boolean('is_default').notNullable().defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
