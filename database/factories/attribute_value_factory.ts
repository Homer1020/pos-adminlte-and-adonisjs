import factory from '@adonisjs/lucid/factories'
import AttributeValue from '#models/attribute_value'

export const AttributeValueFactory = factory
  .define(AttributeValue, async ({ faker }) => {
    const category = faker.lorem.words({
      min: 1,
      max: 3,
    })
    return {
      value: category.toLowerCase().replace(/\s+/g, '-'),
    }
  })
  .build()
