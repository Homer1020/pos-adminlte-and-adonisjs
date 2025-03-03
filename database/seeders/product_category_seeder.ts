import { ProductCategoryFactory } from '#database/factories/product_category_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    await ProductCategoryFactory.createMany(20)
  }
}
