import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    await db.table('brands').multiInsert([
      {
        name: 'nike',
        display_name: 'Nike',
      },
      {
        name: 'adidas',
        display_name: 'Adidas',
      },
      {
        name: 'lenovo',
        display_name: 'Lenovo',
      },
    ])
  }
}
