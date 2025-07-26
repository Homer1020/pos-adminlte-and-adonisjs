/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const PostsController = () => import('#controllers/posts_controller')
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AttributesController = () => import('#controllers/attributes_controller')
const AssetsController = () => import('#controllers/assets_controller')
const ProductsController = () => import('#controllers/products_controller')

router.on('/').render('pages/front/home')

/**
 * PRIVATE ROUTES
 */
router
  .group(() => {
    router.resource('posts', PostsController)
    router.resource('users', UsersController)
    router.resource('products', ProductsController)
    router.resource('attributes', AttributesController).except(['show'])

    router.get('datatables/products', [ProductsController, 'datatables']).as('products.datatables')
    router
      .get('datatables/attributes', [AttributesController, 'datatables'])
      .as('attributes.datatables')
  })
  .prefix('admin')
  .middleware(
    middleware.auth({
      guards: ['web'],
    })
  )

/** AUTH ROUTES */
router
  .post('/logout', [AuthController, 'logout'])
  .as('auth.logout')
  .middleware(
    middleware.auth({
      guards: ['web'],
    })
  )

router
  .group(() => {
    router.get('/login', [AuthController, 'loginForm']).as('auth.loginForm')
    router.post('/login', [AuthController, 'login']).as('auth.login')
    router.get('/register', [AuthController, 'registerForm']).as('auth.registerForm')
    router.post('/register', [AuthController, 'register']).as('auth.register')

    router.get('/github/redirect', [AuthController, 'githubLogin']).as('githubLogin')
    router.get('/login/github/oauth', [AuthController, 'githubRedirect']).as('githubRedirect')
  })
  .middleware(
    middleware.guest({
      guards: ['web'],
    })
  )

router.get('/uploads/*', [AssetsController, 'index'])
