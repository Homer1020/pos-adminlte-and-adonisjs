import { CategoryFactory } from '#database/factories/category_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    await CategoryFactory.createMany(20)
  }
}
