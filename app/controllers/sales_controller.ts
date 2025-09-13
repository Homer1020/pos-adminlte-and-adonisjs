import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class SalesController {
  index({ view }: HttpContext) {
    return view.render('pages/sales/index')
  }

  async create({ view }: HttpContext) {
    const products = await Product.query().orderBy('name', 'desc')
    return view.render('pages/sales/create', { products })
  }
}
