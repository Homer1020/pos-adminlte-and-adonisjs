import User from '#models/user'
import { createUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  loginForm({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async login({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    return response.redirect().toRoute('products.index')
  }

  registerForm({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async register({ request, response }: HttpContext) {
    const {
      full_name: fullName,
      email,
      password,
    } = await createUserValidator.validate(request.all())

    const user = await User.create({
      fullName,
      email,
      password,
    })

    return response.json(user)
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
