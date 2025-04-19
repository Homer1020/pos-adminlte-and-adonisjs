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

  async githubLogin({ ally }: HttpContext) {
    return ally.use('github').redirect()
  }

  async githubRedirect({ ally, response, auth }: HttpContext) {
    const gh = ally.use('github')

    /**
     * User has denied access by canceling
     * the login flow
     */
    if (gh.accessDenied()) {
      return 'You have cancelled the login process'
    }

    /**
     * OAuth state verification failed. This happens when the
     * CSRF cookie gets expired.
     */
    if (gh.stateMisMatch()) {
      return 'We are unable to verify the request. Please try again'
    }

    /**
     * GitHub responded with some error
     */
    if (gh.hasError()) {
      return gh.getError()
    }

    /**
     * Access user info
     */
    const ghUser = await gh.user()

    const user = await User.updateOrCreate(
      {
        email: ghUser.email,
      },
      {
        fullName: ghUser.nickName,
        githubToken: ghUser.token.token,
      }
    )

    await auth.use('web').login(user)

    return response.redirect().toRoute('products.index')
  }
}
