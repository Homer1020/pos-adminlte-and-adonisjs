import Category from '#models/category'
import Post from '#models/post'
import { createPostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const posts = await Post.query().preload('category').orderBy('created_at', 'desc')

    return view.render('pages/posts/index', { posts })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const categories = await Category.all()
    return view.render('pages/posts/create', { categories })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    const {
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId,
    } = await createPostValidator.validate(request.all())

    await db.transaction(async () => {
      const post = await Post.create({
        title,
        slug,
        excerpt,
        content,
      })

      const category = await Category.find(categoryId)

      if (category) {
        post.related('category').associate(category)
      }
    })

    session.flash('notification', {
      type: 'success',
      message: 'Se creó correctamente la publicación',
    })

    return response.redirect().toRoute('posts.index')
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const { id } = params

    const post = await Post.findOrFail(id)

    await post?.load('category')

    return view.render('pages/posts/show', { post })
  }

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const { id } = params

    const post = await Post.findOrFail(id)

    return view.render('pages/posts/create', { post })
  }

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, response, session }: HttpContext) {
    const { id } = params

    const post = await Post.findOrFail(id)

    await post.delete()

    session.flash('notification', {
      type: 'success',
      message: 'Se eliminó correctamente la publicación',
    })

    response.redirect().back()
  }
}
