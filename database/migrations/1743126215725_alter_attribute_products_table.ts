import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attribute_products'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('variant_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('variations')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('variant_id')
    })
  }
}
