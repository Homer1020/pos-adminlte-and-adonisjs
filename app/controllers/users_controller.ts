import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  index({ view }: HttpContext) {
    return view.render('pages/users/index')
  }
}
