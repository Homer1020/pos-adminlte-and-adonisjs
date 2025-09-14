import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('github_token').nullable()
      table.string('github_token_expires_at').nullable()
      table.string('github_avatar').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('github_token')
      table.dropColumn('github_token_expires_at')
      table.dropColumn('github_avatar')
    })
  }
}
