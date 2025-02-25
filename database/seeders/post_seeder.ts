import { PostFactory } from '#database/factories/post_factory'
import Category from '#models/category'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  static environment = ['development', 'testing']
  async run() {
    const categories = await Category.all()

    for (const category of categories) {
      await PostFactory.merge({ category_id: category.id }).createMany(2)
    }
  }
}
