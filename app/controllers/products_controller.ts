import Attribute from '#models/attribute'
import Category from '#models/category'
import Product from '#models/product'
import ProductImage from '#models/product_image'
import { createProductValidator } from '#validators/product'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import string from '@adonisjs/core/helpers/string'
import fs from 'node:fs'
import { DateTime } from 'luxon'
import Brand from '#models/brand'

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
    const brands = await Brand.all()
    return view.render('pages/products/create', { categories, attributes, brands })
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
      brand_id: brandId,
    } = await request.validateUsing(createProductValidator)

    console.log({ categoryId })

    let categoryToUse: number
    if (Number.isNaN(+categoryId) && typeof categoryId === 'string') {
      const dbCategory = await Category.create({ name: categoryId, display_name: categoryId })
      categoryToUse = dbCategory.id
    } else {
      categoryToUse = +categoryId
    }

    console.log({ categoryToUse })

    const post = await Product.create({
      name,
      price,
      description,
      slug,
      categoryId: categoryToUse,
      brandId,
      code: string.random(20),
    })

    if (images) {
      // al menos debe de haber una imagen valida
      const validImages = images.filter((image) => image.isValid)

      if (!validImages.length) {
        return response.badRequest({
          errors: 'All files are invalid.',
        })
      }

      const postImages: Pick<ProductImage, 'path' | 'is_default'>[] = []

      for (let image of validImages) {
        await image.move(app.makePath('storage/uploads/products'), {
          name: `${cuid()}.${image.extname}`,
        })

        postImages.push({
          path: `/uploads/products/${image.fileName}`,
        })
      }

      await post.related('images').createMany(postImages)
    }

    if (values) post.related('values').attach(values)

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
      .preload('brand')
      .orderBy('created_at', 'desc')

    const products = dbProducts.map((product) => ({
      ...product.toJSON(),
      createdAt: product.createdAt.toLocaleString(DateTime.DATE_MED),
      routes: {
        editPath: router.builder().params(product).make('products.edit'),
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
  async edit({ params, view }: HttpContext) {
    const { id } = params

    const product = await Product.query()
      .where({ id })
      .preload('images')
      .preload('values', (query) => {
        query.preload('attribute')
      })
      .first()

    const productAttributes = product?.values
      ? Object.groupBy(product.values, (item) => item.attribute.id)
      : {}

    const categories = await Category.all()
    const attributes = await Attribute.query().preload('values')
    const brands = await Brand.all()

    return view.render('pages/products/create', {
      product,
      categories,
      attributes,
      brands,
      productAttributes,
    })
  }

  // /**
  //  * Handle form submission for the edit action
  //  */
  async update({ params, request, response, session }: HttpContext) {
    const {
      name,
      description,
      slug,
      category_id: categoryId,
      price,
      images,
      brand_id: brandId,
      values,
    } = await request.validateUsing(createProductValidator, {
      meta: {
        productId: params.id,
      },
    })

    const product = await Product.findOrFail(params.id)

    let categoryToUse: number
    if (typeof categoryId === 'string') {
      const dbCategory = await Category.create({ name: categoryId, display_name: categoryId })

      categoryToUse = dbCategory.id
    } else {
      categoryToUse = categoryId
    }

    await product
      .merge({
        name,
        description,
        slug,
        categoryId: categoryToUse,
        price,
        brandId,
      })
      .save()

    if (images) {
      const validImages = images.filter((image) => image.isValid)
      const postImages: Pick<ProductImage, 'path' | 'is_default'>[] = []

      if (images && !validImages.length) {
        return response.badRequest({
          errors: 'All files are invalid.',
        })
      }

      for (let image of validImages) {
        await image.move(app.makePath('storage/uploads/products'), {
          name: `${cuid()}.${image.extname}`,
        })

        postImages.push({
          path: `/uploads/products/${image.fileName}`,
        })
      }

      await product.related('images').createMany(postImages)
    }

    if (values) await product.related('values').sync(values)

    session.flash('notification', {
      type: 'success',
      message: 'Se guardó correctamente el producto',
    })

    return response.redirect().toRoute('products.index')
  }

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
