import factory from '@adonisjs/lucid/factories'
import Post from '#models/post'
import { CategoryFactory } from './category_factory.js'

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    const title = faker.word.words(5)

    return {
      title,
      slug: faker.helpers.slugify(title),
      content: faker.lorem.lines(10),
      thumbnail: faker.image.url({ width: 720, height: 640 }),
      excerpt: faker.lorem.lines(10),
    }
  })
  .relation('category', () => CategoryFactory)
  .build()
