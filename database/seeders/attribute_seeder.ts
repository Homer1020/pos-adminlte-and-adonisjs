import { AttributeValueFactory } from '#database/factories/attribute_value_factory'
import Attribute from '#models/attribute'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const attributes = ['Color', 'Talla', 'Material']

    for (let attr of attributes) {
      const attribute = await Attribute.create({
        name: attr,
        slug: attr.toLowerCase(),
      })
      await AttributeValueFactory.merge({ attribute_id: attribute.id }).createMany(3)
    }
  }
}
