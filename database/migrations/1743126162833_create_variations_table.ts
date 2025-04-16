import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'variations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('stock').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
