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
  async create({ view }: HttpContext) {
    return view.render('pages/attributes/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const { name, slug, values } = request.body()
      const attribute = await Attribute.create({ name, slug })
      await attribute.related('values').createMany(values.map((value: string) => ({ value })))
      response.json({ ok: true, attribute })
    } catch (err) {
      console.log(err)
      response.status(500).json({
        ok: false,
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ view, params }: HttpContext) {
    const attribute = await Attribute.find(params.id)
    await attribute?.load('values')
    return view.render('pages/attributes/create', { attribute })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const { name, slug, values } = request.body()

      const attribute = await Attribute.findOrFail(params.id)
      attribute.merge({ name, slug }).save()

      const preservedIDs = values.filter((value: string) => !Number.isNaN(+value))
      const newValues = values.filter((value: string) => Number.isNaN(+value))

      await attribute.related('values').query().whereNotIn('id', preservedIDs).delete()
      await attribute.related('values').createMany(newValues.map((value: string) => ({ value })))

      response.json({ ok: true, attribute })
    } catch (err) {
      console.log(err)
      response.status(500).json({
        ok: false,
      })
    }
  }

  async datatables({ response }: HttpContext) {
    const dbAttributes = await Attribute.query().preload('values')

    const attributes = dbAttributes.map((attribute) => ({
      ...attribute.toJSON(),
      routes: {
        editPath: router.builder().params(attribute).make('attributes.edit'),
        deletePath: router.builder().params(attribute).make('attributes.destroy'),
        // showPath: router.builder().params(attribute).make('attributes.show'),
      },
    }))

    return response.json({ ok: true, attributes })
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const attribute = await Attribute.find(params.id)

      attribute?.delete()

      return response.json({ ok: true })
    } catch (err) {
      console.log(err)
      return response.status(500).json({ ok: false })
    }
  }
}
