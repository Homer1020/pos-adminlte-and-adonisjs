import factory from '@adonisjs/lucid/factories'
import Category from '#models/category'

export const CategoryFactory = factory
  .define(Category, async ({ faker }) => {
    const category = faker.lorem.words({
      min: 1,
      max: 3,
    })
    return {
      name: category,
      display_name: category.toLowerCase().replace(/\s+/g, '-'),
    }
  })
  .build()
