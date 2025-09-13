import Attribute from '#models/attribute'
import Category from '#models/category'
import Post from '#models/post'
import { createPostValidator } from '#validators/post'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import fs from 'node:fs'

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
    const attributes = await Attribute.query().preload('values')
    return view.render('pages/posts/create', { categories, attributes })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session, auth }: HttpContext) {
    const {
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId,
    } = await createPostValidator.validate(request.all())

    const thumbnail = request.file('thumbnail')

    if (thumbnail) {
      await thumbnail?.move(app.makePath('storage/uploads'), {
        name: `${cuid()}.${thumbnail.extname}`,
      })
    }

    await db.transaction(async () => {
      await Post.create({
        user_id: auth.user?.id,
        title,
        slug,
        excerpt,
        content,
        category_id: categoryId,
        thumbnail: thumbnail?.fileName ? `/uploads/${thumbnail.fileName}` : undefined,
      })
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
  async edit({ params, view, bouncer, response }: HttpContext) {
    const { id } = params

    const post = await Post.findOrFail(id)

    if (await bouncer.with('PostPolicy').denies('edit', post)) {
      return response.forbidden('Cannot create a post')
    }

    const categories = await Category.all()

    return view.render('pages/posts/create', { post, categories })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, session, response }: HttpContext) {
    const { id } = params
    const {
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId,
    } = await request.validateUsing(createPostValidator, {
      meta: {
        postId: id,
      },
    })

    const post = await Post.findOrFail(id)

    post.title = title
    post.slug = slug
    post.excerpt = excerpt
    post.content = content

    const thumbnail = request.file('thumbnail')

    if (thumbnail) {
      await thumbnail?.move(app.makePath('storage/uploads'), {
        name: `${cuid()}.${thumbnail.extname}`,
      })

      if (post.thumbnail && fs.existsSync(`storage/${post.thumbnail}`)) {
        fs.unlinkSync(app.makePath(`storage/${post.thumbnail}`))
      }

      post.thumbnail = `/uploads/${thumbnail.fileName}`
    }

    const category = await Category.find(categoryId)

    if (category) {
      post.related('category').associate(category)
    }

    session.flash('notification', {
      type: 'success',
      message: 'Se actualizó correctamente la publicación',
    })

    return response.redirect().toRoute('posts.index')
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session }: HttpContext) {
    const { id } = params

    const post = await Post.findOrFail(id)

    if (post.thumbnail && fs.existsSync(`storage/${post.thumbnail}`)) {
      fs.unlinkSync(app.makePath(`storage/${post.thumbnail}`))
    }

    await post.delete()

    session.flash('notification', {
      type: 'success',
      message: 'Se eliminó correctamente la publicación',
    })

    response.redirect().back()
  }
}
