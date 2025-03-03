import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('display_name')
      table.string('name').unique()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
