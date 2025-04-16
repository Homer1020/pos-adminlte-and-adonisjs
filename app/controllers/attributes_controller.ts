import Attribute from '#models/attribute'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class AttributesController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    return view.render('pages/attributes/index')
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  async datatables({ response }: HttpContext) {
    const dbAttributes = await Attribute.query().preload('values')

    const attributes = dbAttributes.map((attribute) => ({
      ...attribute.toJSON(),
      routes: {
        editPath: router.builder().params(attribute).make('attributes.edit'),
        deletePath: router.builder().params(attribute).make('attributes.destroy'),
        showPath: router.builder().params(attribute).make('attributes.show'),
      },
    }))

    return response.json({ ok: true, attributes })
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
