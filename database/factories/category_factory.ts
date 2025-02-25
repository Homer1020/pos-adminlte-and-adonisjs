import factory from '@adonisjs/lucid/factories'
import Category from '#models/category'
import { PostFactory } from './post_factory.js'

export const CategoryFactory = factory
  .define(Category, async ({ faker }) => {
    const category = faker.lorem.words({
      min: 1,
      max: 3,
    })
    return {
      display_name: category,
      name: category.toLowerCase().replace(/\s+/g, '-'),
    }
  })
  .relation('posts', () => PostFactory)
  .build()
