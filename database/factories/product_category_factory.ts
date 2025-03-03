import factory from '@adonisjs/lucid/factories'
import ProductCategory from '#models/product_category'

export const ProductCategoryFactory = factory
  .define(ProductCategory, async ({ faker }) => {
    const category = faker.lorem.words({
      min: 1,
      max: 3,
    })
    return {
      display_name: category,
      name: category.toLowerCase().replace(/\s+/g, '-'),
    }
  })
  .build()
