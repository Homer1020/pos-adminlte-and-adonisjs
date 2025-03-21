import Attribute from '#models/attribute'
import Category from '#models/category'
import Product from '#models/product'
import ProductImage from '#models/product_image'
import { createProductValidator } from '#validators/product'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import fs from 'node:fs'

export default class ProductsController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const products = await Product.query()
      .preload('images')
      .preload('category')
      .orderBy('created_at', 'desc')
    // return products
    return view.render('pages/products/index', { products })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const categories = await Category.all()
    const attributes = await Attribute.query().preload('values')
    return view.render('pages/products/create', { categories, attributes })
  }

  // /**
  //  * Handle form submission for the create action
  //  */
  async store({ request, response, session }: HttpContext) {
    const {
      name,
      description,
      slug,
      category_id: categoryId,
      price,
      images,
      values,
    } = await request.validateUsing(createProductValidator)

    // al menos debe de haber una imagen valida
    const validImages = images.filter((image) => image.isValid)

    if (!validImages.length) {
      return response.badRequest({
        errors: 'All files are invalid.',
      })
    }

    const post = await Product.create({
      name,
      price,
      description,
      slug,
      categoryId,
    })

    const postImages: Pick<ProductImage, 'path'>[] = []

    for (let image of validImages) {
      await image.move(app.makePath('storage/uploads/products'), {
        name: `${cuid()}.${image.extname}`,
      })

      postImages.push({
        path: `/uploads/products/${image.fileName}`,
      })
    }

    await post.related('images').createMany(postImages)

    for (let attr in values) {
      const obj: { [key: number]: { attribute_id: number } } = {}
      const arrValues = Array.isArray(values[attr]) ? values[attr] : [values[attr]]
      const attrId = Number(attr.split('-').at(-1))

      arrValues.forEach((value) => {
        obj[value] = {
          attribute_id: attrId,
        }
      })

      console.log({ obj })

      post.related('values').attach(obj)
    }

    session.flash('notification', {
      type: 'success',
      message: 'Se guardó correctamente el producto',
    })

    return response.redirect().toRoute('products.index')
  }

  async datatables({ response }: HttpContext) {
    const dbProducts = await Product.query()
      .preload('category')
      .preload('images')
      .orderBy('created_at', 'desc')

    const products = dbProducts.map((product) => ({
      ...product.toJSON(),
      routes: {
        deletePath: router.builder().params(product).make('products.destroy'),
        showPath: router.builder().params(product).make('products.show'),
      },
    }))

    return response.json({ ok: true, products })
  }

  // /**
  //  * Show individual record
  //  */
  async show({ params, view }: HttpContext) {
    const { id } = params

    const product = await Product.query()
      .where({ id })
      .preload('category')
      .preload('images')
      .preload('values', (valuesQuery) => {
        valuesQuery.preload('attribute')
      })
      .first()

    const attributes: { [key: string]: string[] } = {}

    if (product?.values.length) {
      product.values.forEach((value) => {
        if (!attributes[value.attribute.name]) attributes[value.attribute.name] = []
        attributes[value.attribute.name].push(value.value)
      })
    }

    return view.render('pages/products/show', { product, attributes })
  }

  // /**
  //  * Edit individual record
  //  */
  // async edit({ params }: HttpContext) {}

  // /**
  //  * Handle form submission for the edit action
  //  */
  // async update({ params, request }: HttpContext) {}

  // /**
  //  * Delete record
  //  */
  async destroy({ params, response }: HttpContext) {
    const { id } = params

    const product = await Product.query().where('id', id).preload('images').firstOrFail()

    await product.delete()

    product.images.forEach((image) => {
      if (fs.existsSync(`storage/${image.path}`)) {
        fs.unlinkSync(app.makePath(`storage/${image.path}`))
      }
    })

    return response.json({ ok: true })
  }
}
